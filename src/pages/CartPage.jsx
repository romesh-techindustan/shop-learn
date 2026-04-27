import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    clearCart,
    getCart,
    removeCartItem,
    updateCartItem,
} from "../api/cart";
import gamepadImage from "../assets/GP11.png";
import monitorImage from "../assets/monitor.png";
import { formatPrice } from "../common/common";
import "../css/CommercePages.css";
import { baseUrl } from "../common/constant";

const fallbackImages = [monitorImage, gamepadImage];

function getApiErrorMessage(error) {
    return error.response?.data?.message || "Something went wrong";
}

function getCartItemName(item) {
    return item.product?.name || "Product";
}

function getCartItemImage(item, index) {
    return item.product?.image || fallbackImages[index % fallbackImages.length];
}

function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingAction, setPendingAction] = useState("");

    const loadCart = useCallback(
        async ({ showLoader = true } = {}) => {
            if (showLoader) {
                setIsLoading(true);
            }

            try {
                const { response } = await getCart();
                setCart(response);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Log in to view your cart");
                    navigate("/auth/login");
                    return;
                }

                toast.error(getApiErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        },
        [navigate],
    );

    useEffect(() => {
        let isMounted = true;

        async function loadInitialCart() {
            try {
                const { response } = await getCart();

                if (isMounted) {
                    setCart(response);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Log in to view your cart");
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

        loadInitialCart();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    async function handleQuantityChange(itemId, quantityValue) {
        const quantity = Number(quantityValue);

        if (!Number.isInteger(quantity) || quantity < 1) {
            return;
        }

        setPendingAction(itemId);

        try {
            const { response } = await updateCartItem(itemId, { quantity });
            setCart(response);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setPendingAction("");
        }
    }

    async function handleRemoveItem(itemId) {
        setPendingAction(itemId);

        try {
            const { response } = await removeCartItem(itemId);
            setCart(response);
            toast.success("Item removed");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setPendingAction("");
        }
    }

    async function handleClearCart() {
        setPendingAction("clear");

        try {
            const { response } = await clearCart();
            setCart(response);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setPendingAction("");
        }
    }

    const cartItems = cart?.items ?? [];
    const subtotal = Number(cart?.subtotal ?? 0);

    return (
        <main className="ecommercePageWrapper cartPageWrapper">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">Cart</span>
                </nav>

                <section className="shoppingCartTable" aria-label="Cart items">
                    <div className="cartTableRow cartTableHeader">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span className="cartItemSubtotal">Subtotal</span>
                    </div>

                    {isLoading ? (
                        <article className="cartTableRow">
                            <span>Loading cart...</span>
                        </article>
                    ) : null}

                    {!isLoading && cartItems.length === 0 ? (
                        <article className="cartTableRow">
                            <span>Your cart is empty.</span>
                        </article>
                    ) : null}

                    {cartItems.map((item, index) => (
                        <article className="cartTableRow" key={item.id}>
                            <div className="cartProductDetails">
                                <div className="cartProductImageWrapper">
                                    <button
                                        aria-label={`Remove ${getCartItemName(item)}`}
                                        className="cartRemoveItem"
                                        disabled={pendingAction === item.id}
                                        onClick={() =>
                                            handleRemoveItem(item.id)
                                        }
                                        type="button"
                                    >
                                        x
                                    </button>
                                    <img
                                        alt=""
                                        src={`${baseUrl}${getCartItemImage(item, index)}`}
                                    />
                                </div>
                                <span>{getCartItemName(item)}</span>
                            </div>

                            <span className="cartProductPrice">
                                {formatPrice(item.unitPrice)}
                            </span>

                            <label className="cartQuantityCell">
                                <span className="visuallyHiddenText">
                                    Quantity for {getCartItemName(item)}
                                </span>
                                <span className="cartQuantityControl">
                                    <button
                                        aria-label={`Decrease quantity for ${getCartItemName(item)}`}
                                        disabled={
                                            pendingAction === item.id ||
                                            item.quantity <= 1
                                        }
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity - 1,
                                            )
                                        }
                                        type="button"
                                    >
                                        -
                                    </button>
                                    <input
                                        aria-label={`Quantity for ${getCartItemName(item)}`}
                                        disabled={pendingAction === item.id}
                                        min="1"
                                        onChange={(event) =>
                                            handleQuantityChange(
                                                item.id,
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        value={item.quantity}
                                    />
                                    <button
                                        aria-label={`Increase quantity for ${getCartItemName(item)}`}
                                        disabled={pendingAction === item.id}
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity + 1,
                                            )
                                        }
                                        type="button"
                                    >
                                        +
                                    </button>
                                </span>
                            </label>

                            <span className="cartItemSubtotal">
                                {formatPrice(item.lineTotal)}
                            </span>
                        </article>
                    ))}
                </section>

                <div className="cartActionButtons">
                    <Link className="commerce-button" to="/">
                        Return To Shop
                    </Link>
                    <button
                        className="commerce-button"
                        onClick={() => loadCart({ showLoader: false })}
                        type="button"
                    >
                        Update Cart
                    </button>
                </div>

                <section className="cartCheckoutButton">
                    <form className="cartCouponSection">
                        <input
                            className="commerce-input"
                            placeholder="Coupon Code"
                            type="text"
                        />
                        <button
                            className="commerce-button commerce-button--primary"
                            type="button"
                        >
                            Apply Coupon
                        </button>
                    </form>

                    <aside className="cartTotalBox" aria-labelledby="cartTotalBox">
                        <h2 id="cartTotalBox">Cart Total</h2>
                        <div className="cartTotalLineItem">
                            <span>Subtotal:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="cartTotalLineItem">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="cartTotalLineItem">
                            <span>Total:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="cartTotalButtonWrapper">
                            <Link
                                className="commerce-button commerce-button--primary"
                                to="/checkout"
                            >
                                Proceed to checkout
                            </Link>
                        </div>
                        {cartItems.length ? (
                            <div className="cartTotalButtonWrapper">
                                <button
                                    className="commerce-button"
                                    disabled={pendingAction === "clear"}
                                    onClick={handleClearCart}
                                    type="button"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        ) : null}
                    </aside>
                </section>
            </div>
        </main>
    );
}

export default CartPage;
