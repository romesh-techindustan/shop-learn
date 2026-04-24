import gamepadImage from "../assets/GP11.png";
import monitorImage from "../assets/monitor.png";
import "./CommercePages.css";

const checkoutItems = [
    { id: "lcd-monitor", name: "LCD Monitor", total: 650, image: gamepadImage },
    { id: "h1-gamepad", name: "H1 Gamepad", total: 1100, image: monitorImage },
];

const billingFields = [
    { id: "firstName", label: "First Name", required: true },
    { id: "company", label: "Company Name" },
    { id: "street", label: "Street Address", required: true },
    { id: "apartment", label: "Apartment, floor, etc. (optional)" },
    { id: "city", label: "Town/City", required: true },
    { id: "phone", label: "Phone Number", required: true, type: "tel" },
    { id: "email", label: "Email Address", required: true, type: "email" },
];

const subtotal = 1750;

function formatMoney(value) {
    return `$${value}`;
}

function CheckoutPage() {
    return (
        <main className="commerce-page checkout-page">
            <div className="app-shell__container">
                <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
                    <span>Account</span>
                    <span className="commerce-breadcrumb__divider">/</span>
                    <span>My Account</span>
                    <span className="commerce-breadcrumb__divider">/</span>
                    <span>Product</span>
                    <span className="commerce-breadcrumb__divider">/</span>
                    <span>View Cart</span>
                    <span className="commerce-breadcrumb__divider">/</span>
                    <span className="commerce-breadcrumb__current">
                        CheckOut
                    </span>
                </nav>

                <div className="checkout-page__layout">
                    <section aria-labelledby="billing-title">
                        <h1 id="billing-title">Billing Details</h1>
                        <form className="checkout-page__form">
                            {billingFields.map((field) => (
                                <label
                                    className="checkout-page__field"
                                    key={field.id}
                                >
                                    <span>
                                        {field.label}
                                        {field.required && <strong>*</strong>}
                                    </span>
                                    <input
                                        autoComplete={field.id}
                                        type={field.type || "text"}
                                    />
                                </label>
                            ))}

                            <label className="checkout-page__save">
                                <input defaultChecked type="checkbox" />
                                <span
                                    aria-hidden="true"
                                    className="checkout-page__checkbox"
                                >
                                    ✓
                                </span>
                                <span>
                                    Save this information for faster check-out
                                    next time
                                </span>
                            </label>
                        </form>
                    </section>

                    <aside className="checkout-page__summary">
                        <div className="checkout-page__items">
                            {checkoutItems.map((item) => (
                                <div
                                    className="checkout-page__item"
                                    key={item.id}
                                >
                                    <div className="checkout-page__product">
                                        <img alt="" src={item.image} />
                                        <span>{item.name}</span>
                                    </div>
                                    <span>{formatMoney(item.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-page__line">
                            <span>Subtotal:</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>
                        <div className="checkout-page__line">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="checkout-page__line">
                            <span>Total:</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>

                        <div className="checkout-page__payments">
                            <div className="checkout-page__payment-head">
                                <label className="checkout-page__radio">
                                    <input name="payment" type="radio" />
                                    <span className="checkout-page__radio-mark" />
                                    <span>Bank</span>
                                </label>
                                <div
                                    aria-label="Supported payment methods"
                                    className="checkout-page__logos"
                                >
                                    <span className="checkout-page__logo checkout-page__logo--bkash">
                                        bKash
                                    </span>
                                    <span className="checkout-page__logo checkout-page__logo--visa">
                                        VISA
                                    </span>
                                    <span className="checkout-page__logo checkout-page__logo--master">
                                        MasterCard
                                    </span>
                                    <span className="checkout-page__logo checkout-page__logo--nagad">
                                        nagad
                                    </span>
                                </div>
                            </div>

                            <label className="checkout-page__radio">
                                <input defaultChecked name="payment" type="radio" />
                                <span className="checkout-page__radio-mark" />
                                <span>Cash on delivery</span>
                            </label>
                        </div>

                        <form className="checkout-page__coupon">
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

                        <button
                            className="commerce-button commerce-button--primary checkout-page__place-order"
                            type="button"
                        >
                            Place Order
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default CheckoutPage;
