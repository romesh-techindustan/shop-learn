import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrders } from "../api/orders";
import { formatPrice } from "../common/common";
import "../css/CommercePages.css";
function OrderStatusBadge({ status }) {
    const statusColors = {
        pending: "#f39c12",
        completed: "#2ecc71",
        shipped: "#3498db",
        cancelled: "#e74c3c",
    };

    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor:
                    statusColors[status.toLowerCase()] || "#95a5a6",
                textTransform: "capitalize",
            }}
        >
            {status}
        </span>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchOrders() {
            try {
                const { response } = await getOrders();
                console.log("86876868", response);
                if (isMounted) {
                    setOrders(response);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate("/auth/login");
                    return;
                }
                toast.error("Failed to load orders");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchOrders();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return (
        <main className="ecommercePageWrapper commerce-page--account">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">My Orders</span>
                </nav>

                <div className="orderPageHeader">
                    <h1>My Orders</h1>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        Loading orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px" }}>
                        <p>You haven't placed any orders yet.</p>
                        <Link
                            to="/"
                            className="commerce-button commerce-button--primary"
                        >
                            Go Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orderPageList">
                        {orders.map((order) => (
                            <div key={order.id} className="historyOrderCard">
                                <div className="orderCardHeaderTop">
                                    <div>
                                        <h2>
                                            Order #{order.id.slice(0, 8)}...
                                        </h2>
                                        <p>
                                            Placed on:{" "}
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <OrderStatusBadge
                                            status={order.status}
                                        />
                                        <p
                                            style={{
                                                marginTop: "8px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {formatPrice(order.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="orderCardItemsList">
                                    {order.items?.map((item, idx) => (
                                        <span key={idx}>
                                            {item.productName || "Product"} (x
                                            {item.quantity})
                                            {idx < order.items.length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    ))}
                                </div>

                                <div className="orderCardActionButtons">
                                    <Link
                                        to={`/order/${order.id}`}
                                        className="commerce-button"
                                        style={{
                                            minHeight: "40px",
                                            padding: "0 20px",
                                        }}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
