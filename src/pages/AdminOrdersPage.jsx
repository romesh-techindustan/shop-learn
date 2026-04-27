import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getAdminOrders,
    updateOrderStatus,
    updatePaymentStatus,
} from "../api/orders";
import { formatPrice } from "../common/common";
import { AdminSidebar } from "./AdminDashboardPage";
import "./AdminPages.css";

/* ── Constants ──────────────────────────────────────────── */
const ORDER_STATUSES   = ["pending", "processing", "shipped", "completed", "cancelled"];
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"];
const PAGE_SIZE = 10;

function getStoredUser() {
    try {
        const d = localStorage.getItem("userDetail");
        return d ? JSON.parse(d) : null;
    } catch { return null; }
}

/* ── Status Badge ───────────────────────────────────────── */
function StatusBadge({ status }) {
    const key = status?.toLowerCase().replace(/\s+/g, "-") || "pending";
    return <span className={`adminBadge adminBadge--${key}`}>{status}</span>;
}

/* ── Loading Spinner ────────────────────────────────────── */
function Spinner() {
    return (
        <div className="adminLoadingSpinner">
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <span>Loading orders…</span>
        </div>
    );
}

/* ── Admin Orders Page ──────────────────────────────────── */
export default function AdminOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [searchQuery, setSearch]    = useState("");
    const [statusFilter, setStatus]   = useState("");
    const [paymentFilter, setPayment] = useState("");
    const [page, setPage]             = useState(1);
    const [updatingId, setUpdating]   = useState(null);

    /* Guard: admin only */
    useEffect(() => {
        const user = getStoredUser();
        const isAdmin = user?.isAdmin || user?.user?.isAdmin;
        if (!isAdmin) { navigate("/auth/login"); return; }

        let isMounted = true;
        async function fetchOrders() {
            try {
                const { response } = await getAdminOrders();
                if (!isMounted) return;
                const list = Array.isArray(response)
                    ? response
                    : response?.orders || [];
                setOrders(list);
            } catch (err) {
                if (err.response?.status === 401) { navigate("/auth/login"); return; }
                toast.error("Failed to load orders");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchOrders();
        return () => { isMounted = false; };
    }, [navigate]);

    /* Filtered + paginated */
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return orders.filter((o) => {
            const matchesSearch =
                !q ||
                o.id?.toLowerCase().includes(q) ||
                (o.userName || o.user?.name || "").toLowerCase().includes(q);
            const matchesStatus  = !statusFilter  || o.status?.toLowerCase()        === statusFilter;
            const matchesPayment = !paymentFilter || o.paymentStatus?.toLowerCase() === paymentFilter;
            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, searchQuery, statusFilter, paymentFilter]);

    const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    /* Handlers */
    async function handleStatusChange(orderId, newStatus) {
        setUpdating(orderId + "_status");
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );
            toast.success("Order status updated");
        } catch {
            toast.error("Failed to update status");
        } finally {
            setUpdating(null);
        }
    }

    async function handlePaymentChange(orderId, newStatus) {
        setUpdating(orderId + "_payment");
        try {
            await updatePaymentStatus(orderId, newStatus);
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, paymentStatus: newStatus } : o
                )
            );
            toast.success("Payment status updated");
        } catch {
            toast.error("Failed to update payment status");
        } finally {
            setUpdating(null);
        }
    }

    return (
        <div className="adminLayout">
            <AdminSidebar />
            <div className="adminContent">
                {/* Top Bar */}
                <div className="adminTopBar">
                    <div className="adminTopBarLeft">
                        <h1>Order Management</h1>
                        <p>{filtered.length} orders found</p>
                    </div>
                    <div className="adminTopBarRight">
                        <span className="adminTopBarBadge">📦 {orders.length} Total</span>
                    </div>
                </div>

                <div className="adminPageBody">
                    <div className="adminPanel">
                        {/* Toolbar */}
                        <div className="adminToolbar">
                            <div className="adminToolbarFilters">
                                <div className="adminSearchBox">
                                    <span>🔍</span>
                                    <input
                                        id="admin-order-search"
                                        placeholder="Search by order ID or customer…"
                                        value={searchQuery}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    />
                                </div>

                                <select
                                    id="admin-order-status-filter"
                                    className="adminFilterSelect"
                                    value={statusFilter}
                                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Statuses</option>
                                    {ORDER_STATUSES.map((s) => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>

                                <select
                                    id="admin-order-payment-filter"
                                    className="adminFilterSelect"
                                    value={paymentFilter}
                                    onChange={(e) => { setPayment(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Payments</option>
                                    {PAYMENT_STATUSES.map((s) => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <Spinner />
                        ) : pageItems.length === 0 ? (
                            <div className="adminEmptyState">
                                <span>📭</span>
                                <p>No orders match your filters</p>
                            </div>
                        ) : (
                            <div className="adminTableWrapper">
                                <table className="adminTable">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Amount</th>
                                            <th>Order Status</th>
                                            <th>Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.map((order) => (
                                            <tr key={order.id}>
                                                <td>
                                                    <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b" }}>
                                                        #{order.id?.slice(0, 8)}…
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                                                        {order.userName || order.user?.name || "—"}
                                                    </div>
                                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                                        {order.userEmail || order.user?.email || ""}
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        month: "short", day: "numeric", year: "numeric",
                                                    })}
                                                </td>
                                                <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                                                    {order.items?.length ?? "—"} item{order.items?.length !== 1 ? "s" : ""}
                                                </td>
                                                <td style={{ fontWeight: 700 }}>
                                                    {formatPrice(order.totalAmount)}
                                                </td>
                                                <td>
                                                    {updatingId === order.id + "_status" ? (
                                                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Saving…</span>
                                                    ) : (
                                                        <select
                                                            id={`order-status-${order.id}`}
                                                            className="adminStatusSelect"
                                                            value={order.status?.toLowerCase() || "pending"}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        >
                                                            {ORDER_STATUSES.map((s) => (
                                                                <option key={s} value={s}>
                                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </td>
                                                <td>
                                                    {updatingId === order.id + "_payment" ? (
                                                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Saving…</span>
                                                    ) : (
                                                        <select
                                                            id={`order-payment-${order.id}`}
                                                            className="adminStatusSelect"
                                                            value={order.paymentStatus?.toLowerCase() || "unpaid"}
                                                            onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                                                        >
                                                            {PAYMENT_STATUSES.map((s) => (
                                                                <option key={s} value={s}>
                                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="adminPagination">
                                <button
                                    id="orders-prev-page"
                                    className="adminPaginationBtn"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    ‹ Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        id={`orders-page-${p}`}
                                        className={`adminPaginationBtn ${p === currentPage ? "active" : ""}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    id="orders-next-page"
                                    className="adminPaginationBtn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next ›
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
