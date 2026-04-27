import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById, cancelOrder, retryPayment } from "../api/orders";
import { formatPrice } from "../common/common";
import { buildAssetUrl } from "../common/constant";
import "./CommercePages.css";

function OrderStatusBadge({ status }) {
    const statusColors = {
        pending: "#f39c12",
        completed: "#2ecc71",
        shipped: "#3498db",
        cancelled: "#e74c3c",
        confirmed: "#2980b9",
        failed: "#c0392b"
    };

    return (
        <span
            style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor: statusColors[status.toLowerCase()] || "#95a5a6",
                textTransform: "capitalize",
            }}
        >
            {status}
        </span>
    );
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchOrder() {
            try {
                const { response } = await getOrderById(id);
                if (isMounted) {
                    setOrder(response);
                }
            } catch (error) {
                toast.error("Failed to load order details");
                navigate("/orders");
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

    async function handleCancel() {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        
        setIsActionLoading(true);
        try {
            await cancelOrder(id);
            toast.success("Order cancelled successfully");
            // Refresh order
            const { response } = await getOrderById(id);
            setOrder(response);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setIsActionLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="appContainer" style={{ padding: "100px 0", textAlign: "center" }}>
                <h2>Loading order details...</h2>
            </div>
        );
    }

    if (!order) return null;

    const address = order.shippingAddress || {};

    return (
        <main className="ecommercePageWrapper commerce-page--account">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <Link to="/orders">My Orders</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">Order Details</span>
                </nav>

                <div className="orderPageHeader" style={{ marginBottom: "40px", alignItems: "flex-start", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                        <h1 style={{ fontSize: "1.75rem" }}>Order #{order.id.slice(0, 12)}...</h1>
                        <OrderStatusBadge status={order.status} />
                    </div>
                    <p style={{ color: "rgba(0,0,0,0.5)" }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="checkoutPageLayout" style={{ gridTemplateColumns: "1.5fr 1fr", gap: "60px" }}>
                    <section>
                        <div className="historyOrderCard" style={{ marginBottom: "30px" }}>
                            <h2 style={{ marginBottom: "20px", fontSize: "1.2rem" }}>Order Items</h2>
                            <div className="checkoutOrderSummaryList">
                                {order.items?.map((item, index) => (
                                    <div className="checkoutOrderSummaryItem" key={index}>
                                        <div className="checkoutProductInfo">
                                            <img
                                                alt={item.productName}
                                                src={buildAssetUrl(item.product?.image || item.productImage)}
                                                style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                            />
                                            <div>
                                                <p style={{ fontWeight: "600", margin: 0 }}>{item.productName}</p>
                                                <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: "600" }}>{formatPrice(item.unitPrice * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                                <div className="checkoutTotalLine">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                                <div className="checkoutTotalLine">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div className="checkoutTotalLine" style={{ fontSize: "1.25rem", fontWeight: "700", borderBottom: 0 }}>
                                    <span>Total:</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside>
                        <div className="historyOrderCard" style={{ marginBottom: "30px" }}>
                            <h2 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Shipping Address</h2>
                            <div style={{ color: "rgba(0,0,0,0.7)", lineHeight: "1.6" }}>
                                <p style={{ fontWeight: "600", color: "#111", margin: "0 0 5px" }}>{address.name}</p>
                                <p style={{ margin: 0 }}>{address.line1}</p>
                                {address.line2 && <p style={{ margin: 0 }}>{address.line2}</p>}
                                <p style={{ margin: 0 }}>{address.city}, {address.state} {address.postalCode}</p>
                                <p style={{ margin: 0 }}>{address.country}</p>
                                {address.phone && <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>Phone: {address.phone}</p>}
                            </div>
                        </div>

                        <div className="historyOrderCard" style={{ marginBottom: "30px" }}>
                            <h2 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Payment Information</h2>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span>Method:</span>
                                <span style={{ textTransform: "uppercase", fontWeight: "600" }}>{order.paymentMethod}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Payment Status:</span>
                                <span style={{ 
                                    fontWeight: "600", 
                                    color: order.paymentStatus === "paid" ? "#2ecc71" : "#e67e22",
                                    textTransform: "capitalize"
                                }}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {order.status === "pending" && (
                            <div style={{ display: "grid", gap: "15px" }}>
                                <button 
                                    className="commerce-button" 
                                    style={{ width: "100%", borderColor: "#e74c3c", color: "#e74c3c" }}
                                    onClick={handleCancel}
                                    disabled={isActionLoading}
                                >
                                    {isActionLoading ? "Processing..." : "Cancel Order"}
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
}
