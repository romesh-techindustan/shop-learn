import { Link } from "react-router-dom";
import gamepadImage from "../assets/GP11.png";
import monitorImage from "../assets/monitor.png";
import "./CommercePages.css";

const cartItems = [
    {
        id: "lcd-monitor",
        name: "LCD Monitor",
        price: 650,
        quantity: 1,
        image: monitorImage,
        removable: true,
    },
    {
        id: "h1-gamepad",
        name: "H1 Gamepad",
        price: 550,
        quantity: 2,
        image: gamepadImage,
    },
];

const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
);

function formatMoney(value) {
    return `$${value}`;
}

function CartPage() {
    return (
        <main className="commerce-page cart-page">
            <div className="app-shell__container">
                <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="commerce-breadcrumb__divider">/</span>
                    <span className="commerce-breadcrumb__current">Cart</span>
                </nav>

                <section className="cart-page__table" aria-label="Cart items">
                    <div className="cart-page__row cart-page__head">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span className="cart-page__subtotal">Subtotal</span>
                    </div>

                    {cartItems.map((item) => (
                        <article className="cart-page__row" key={item.id}>
                            <div className="cart-page__product">
                                <div className="cart-page__image-wrap">
                                    {item.removable && (
                                        <button
                                            aria-label={`Remove ${item.name}`}
                                            className="cart-page__remove"
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <img alt="" src={item.image} />
                                </div>
                                <span>{item.name}</span>
                            </div>

                            <span className="cart-page__price">
                                {formatMoney(item.price)}
                            </span>

                            <label className="cart-page__quantity-cell">
                                <span className="navbar__sr-only">
                                    Quantity for {item.name}
                                </span>
                                <span className="cart-page__quantity">
                                    <input
                                        defaultValue={String(
                                            item.quantity,
                                        ).padStart(2, "0")}
                                        min="1"
                                        type="number"
                                    />
                                </span>
                            </label>

                            <span className="cart-page__subtotal">
                                {formatMoney(item.price * item.quantity)}
                            </span>
                        </article>
                    ))}
                </section>

                <div className="cart-page__actions">
                    <Link className="commerce-button" to="/">
                        Return To Shop
                    </Link>
                    <button className="commerce-button" type="button">
                        Update Cart
                    </button>
                </div>

                <section className="cart-page__checkout">
                    <form className="cart-page__coupon">
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

                    <aside className="cart-total" aria-labelledby="cart-total">
                        <h2 id="cart-total">Cart Total</h2>
                        <div className="cart-total__line">
                            <span>Subtotal:</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>
                        <div className="cart-total__line">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="cart-total__line">
                            <span>Total:</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>
                        <div className="cart-total__button-wrap">
                            <Link
                                className="commerce-button commerce-button--primary"
                                to="/checkout"
                            >
                                Proceed to checkout
                            </Link>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}

export default CartPage;
