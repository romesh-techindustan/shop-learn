import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getAdminOrderById,
    updateOrderStatus,
    updatePaymentStatus,
} from "../api/orders";
import { formatPrice } from "../common/common";
import { buildAssetUrl } from "../common/constant";
import { AdminSidebar } from "./AdminDashboardPage";
import "../css/AdminPages.css";

const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded", "cancelled"];

function getStoredUser() {
    try {
        const data = localStorage.getItem("userDetail");
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function Spinner() {
    return (
        <div className="adminLoadingSpinner">
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <span>Loading order details...</span>
        </div>
    );
}

function StatusBadge({ status }) {
    const key = status?.toLowerCase().replace(/\s+/g, "-") || "pending";
    return <span className={`adminBadge adminBadge--${key}`}>{status}</span>;
}

function DetailRow({ label, value }) {
    return (
        <div className="adminDetailRow">
            <span>{label}</span>
            <strong>{value || "-"}</strong>
        </div>
    );
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [form, setForm] = useState({
        status: "pending",
        paymentStatus: "pending",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const user = getStoredUser();
        const isAdmin = user?.isAdmin || user?.user?.isAdmin;

        if (!isAdmin) {
            navigate("/auth/login");
            return;
        }

        let isMounted = true;

        async function fetchOrder() {
            try {
                const { response } = await getAdminOrderById(id);

                if (!isMounted) {
                    return;
                }

                if (!response) {
                    toast.error("Order not found");
                    navigate("/admin/orders", { replace: true });
                    return;
                }

                setOrder(response);
                setForm({
                    status: response.status || "pending",
                    paymentStatus: response.paymentStatus || "pending",
                });
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate("/auth/login");
                    return;
                }

                toast.error("Failed to load order details");
                navigate("/admin/orders", { replace: true });
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchOrder();

        return () => {
            isMounted = false;
        };
    }, [id, navigate]);

    const hasChanges = useMemo(() => {
        if (!order) {
            return false;
        }

        return (
            form.status !== order.status ||
            form.paymentStatus !== order.paymentStatus
        );
    }, [form.paymentStatus, form.status, order]);

    async function handleSave(event) {
        event.preventDefault();

        if (!order || !hasChanges) {
            return;
        }

        setSaving(true);

        try {
            if (form.status !== order.status) {
                await updateOrderStatus(order.id, form.status);
            }

            if (form.paymentStatus !== order.paymentStatus) {
                await updatePaymentStatus(order.id, form.paymentStatus);
            }

            const { response } = await getAdminOrderById(order.id);
            const updatedOrder = response || {
                ...order,
                status: form.status,
                paymentStatus: form.paymentStatus,
            };

            setOrder(updatedOrder);
            setForm({
                status: updatedOrder.status || "pending",
                paymentStatus: updatedOrder.paymentStatus || "pending",
            });
            toast.success("Order updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order");
        } finally {
            setSaving(false);
        }
    }

    const address = order?.shippingAddress || {};
    const itemCount =
        order?.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
        0;

    return (
        <div className="adminLayout">
            <AdminSidebar />
            <div className="adminContent">
                <div className="adminTopBar">
                    <div className="adminTopBarLeft">
                        <h1>Order Details</h1>
                        <p>{order ? `#${order.orderNumber || order.id}` : "Review and update order"}</p>
                    </div>
                    <div className="adminTopBarRight">
                        <Link to="/admin/orders" className="adminBtn adminBtn--ghost">
                            Back to Orders
                        </Link>
                    </div>
                </div>

                <div className="adminPageBody">
                    {loading ? (
                        <div className="adminPanel">
                            <Spinner />
                        </div>
                    ) : (
                        order && (
                            <div className="adminDetailLayout">
                                <section className="adminPanel">
                                    <div className="adminPanelHeader">
                                        <div>
                                            <h2>Items</h2>
                                            <p>{itemCount} total item{itemCount === 1 ? "" : "s"}</p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    <div className="adminOrderItems">
                                        {order.items?.map((item) => (
                                            <div className="adminOrderItem" key={item.id || item.productId}>
                                                <img
                                                    alt={item.productName}
                                                    className="adminOrderItemImage"
                                                    src={buildAssetUrl(item.productImage)}
                                                />
                                                <div className="adminOrderItemInfo">
                                                    <strong>{item.productName}</strong>
                                                    <span>
                                                        Qty {item.quantity}
                                                        {item.productSku ? ` | SKU ${item.productSku}` : ""}
                                                    </span>
                                                </div>
                                                <div className="adminOrderItemPrice">
                                                    <strong>{formatPrice(item.lineTotal)}</strong>
                                                    <span>{formatPrice(item.unitPrice)} each</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="adminTotalsBox">
                                        <DetailRow label="Subtotal" value={formatPrice(order.subtotal)} />
                                        <DetailRow label="Shipping" value={formatPrice(order.shippingAmount)} />
                                        <DetailRow label="Tax" value={formatPrice(order.taxAmount)} />
                                        <DetailRow label="Discount" value={formatPrice(order.discountAmount)} />
                                        <DetailRow label="Total" value={formatPrice(order.totalAmount)} />
                                    </div>
                                </section>

                                <aside className="adminDetailSide">
                                    <section className="adminPanel">
                                        <div className="adminPanelHeader">
                                            <div>
                                                <h2>Edit Order</h2>
                                                <p>Update fulfillment and payment states</p>
                                            </div>
                                        </div>

                                        <form className="adminDetailForm" onSubmit={handleSave}>
                                            <div className="adminFormGroup">
                                                <label htmlFor="admin-detail-order-status">Order status</label>
                                                <select
                                                    id="admin-detail-order-status"
                                                    value={form.status}
                                                    onChange={(event) =>
                                                        setForm((current) => ({
                                                            ...current,
                                                            status: event.target.value,
                                                        }))
                                                    }
                                                >
                                                    {ORDER_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="adminFormGroup">
                                                <label htmlFor="admin-detail-payment-status">Payment status</label>
                                                <select
                                                    id="admin-detail-payment-status"
                                                    value={form.paymentStatus}
                                                    onChange={(event) =>
                                                        setForm((current) => ({
                                                            ...current,
                                                            paymentStatus: event.target.value,
                                                        }))
                                                    }
                                                >
                                                    {PAYMENT_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                className="adminBtn adminBtn--primary"
                                                disabled={!hasChanges || saving}
                                                type="submit"
                                            >
                                                {saving ? "Saving..." : "Save Changes"}
                                            </button>
                                        </form>
                                    </section>

                                    <section className="adminPanel">
                                        <div className="adminPanelHeader">
                                            <div>
                                                <h2>Customer</h2>
                                                <p>{order.user?.email || "No email available"}</p>
                                            </div>
                                        </div>
                                        <div className="adminDetailStack">
                                            <DetailRow label="Name" value={order.user?.name} />
                                            <DetailRow label="Email" value={order.user?.email} />
                                            <DetailRow label="Created" value={formatDate(order.createdAt)} />
                                            <DetailRow label="Updated" value={formatDate(order.updatedAt)} />
                                        </div>
                                    </section>

                                    <section className="adminPanel">
                                        <div className="adminPanelHeader">
                                            <div>
                                                <h2>Payment</h2>
                                                <p>{order.paymentProvider || order.paymentMethod}</p>
                                            </div>
                                            <StatusBadge status={order.paymentStatus} />
                                        </div>
                                        <div className="adminDetailStack">
                                            <DetailRow label="Method" value={order.paymentMethod?.toUpperCase()} />
                                            <DetailRow label="Provider" value={order.paymentProvider} />
                                            <DetailRow label="Currency" value={order.currency?.toUpperCase()} />
                                            <DetailRow label="Session" value={order.stripeCheckoutSessionId} />
                                        </div>
                                    </section>

                                    <section className="adminPanel">
                                        <div className="adminPanelHeader">
                                            <div>
                                                <h2>Shipping Address</h2>
                                                <p>{address.city || "Address details"}</p>
                                            </div>
                                        </div>
                                        <div className="adminAddressBox">
                                            <strong>{address.name || order.user?.name || "-"}</strong>
                                            <span>{address.line1}</span>
                                            {address.line2 && <span>{address.line2}</span>}
                                            <span>
                                                {[address.city, address.state, address.postalCode]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                            <span>{address.country}</span>
                                            {address.phone && <span>Phone: {address.phone}</span>}
                                        </div>
                                    </section>
                                </aside>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
