import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cancelOrder, getOrders, retryPayment } from "../api/orders";
import { formatPrice } from "../common/common";
import "./CommercePages.css";

function getApiErrorMessage(error) {
    return error.response?.data?.message || "Something went wrong";
}

function canCancelOrder(order) {
    return order.status === "pending" && order.paymentStatus === "pending";
}

function canRetryPayment(order) {
    return (
        order.paymentProvider === "stripe" &&
        ["failed", "cancelled"].includes(order.paymentStatus)
    );
}

function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingOrderId, setPendingOrderId] = useState("");

    const loadOrders = useCallback(async () => {
        setIsLoading(true);

        try {
            const { response } = await getOrders();
            setOrders(response ?? []);
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Log in to view your orders");
                navigate("/auth/login");
                return;
            }

            toast.error(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        let isMounted = true;

        async function loadInitialOrders() {
            try {
                const { response } = await getOrders();

                if (isMounted) {
                    setOrders(response ?? []);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Log in to view your orders");
                    navigate("/auth/login");
                    return;
                }

                toast.error(getApiErrorMessage(error));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadInitialOrders();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    async function handleCancel(orderId) {
        setPendingOrderId(orderId);

        try {
            await cancelOrder(orderId);
            toast.success("Order cancelled");
            loadOrders();
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setPendingOrderId("");
        }
    }

    async function handleRetry(orderId) {
        setPendingOrderId(orderId);

        try {
            await retryPayment(orderId);
            toast.success("Payment retry created");
            loadOrders();
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setPendingOrderId("");
        }
    }

    return (
        <main className="commerce-page order-page">
            <div className="app-shell__container">
                <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="commerce-breadcrumb__divider">/</span>
                    <span className="commerce-breadcrumb__current">Orders</span>
                </nav>

                <section className="order-page__header">
                    <h1>My Orders</h1>
                    <button
                        className="commerce-button"
                        onClick={loadOrders}
                        type="button"
                    >
                        Refresh
                    </button>
                </section>

                <section className="order-page__list" aria-label="Orders">
                    {isLoading ? <article>Loading orders...</article> : null}
                    {!isLoading && orders.length === 0 ? (
                        <article>No orders found.</article>
                    ) : null}
                    {orders.map((order) => (
                        <article className="order-card" key={order.id}>
                            <div className="order-card__top">
                                <div>
                                    <h2>Order {order.id.slice(0, 8)}</h2>
                                    <p>
                                        {order.status} / {order.paymentStatus}
                                    </p>
                                </div>
                                <strong>{formatPrice(order.totalAmount)}</strong>
                            </div>

                            <div className="order-card__items">
                                {(order.items ?? []).map((item) => (
                                    <span key={item.id}>
                                        {item.productName} x {item.quantity}
                                    </span>
                                ))}
                            </div>

                            <div className="order-card__actions">
                                {canRetryPayment(order) ? (
                                    <button
                                        className="commerce-button"
                                        disabled={pendingOrderId === order.id}
                                        onClick={() => handleRetry(order.id)}
                                        type="button"
                                    >
                                        Retry Payment
                                    </button>
                                ) : null}
                                {canCancelOrder(order) ? (
                                    <button
                                        className="commerce-button"
                                        disabled={pendingOrderId === order.id}
                                        onClick={() => handleCancel(order.id)}
                                        type="button"
                                    >
                                        Cancel Order
                                    </button>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}

export default OrdersPage;
