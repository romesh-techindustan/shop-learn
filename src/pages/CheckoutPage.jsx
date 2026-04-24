import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCart } from "../api/cart";
import { checkout as createCheckout } from "../api/orders";
import gamepadImage from "../assets/GP11.png";
import monitorImage from "../assets/monitor.png";
import { formatPrice } from "../common/common";
import "./CommercePages.css";

const billingFields = [
    { id: "name", label: "Full Name", required: true, autoComplete: "name" },
    { id: "company", label: "Company Name" },
    {
        id: "line1",
        label: "Street Address",
        required: true,
        autoComplete: "address-line1",
    },
    {
        id: "line2",
        label: "Apartment, floor, etc. (optional)",
        autoComplete: "address-line2",
    },
    { id: "city", label: "Town/City", required: true, autoComplete: "address-level2" },
    { id: "state", label: "State", required: true, autoComplete: "address-level1" },
    {
        id: "postalCode",
        label: "Postal Code",
        required: true,
        autoComplete: "postal-code",
    },
    { id: "country", label: "Country Code", required: true, defaultValue: "US" },
    { id: "phone", label: "Phone Number", required: true, type: "tel" },
    { id: "email", label: "Email Address", required: true, type: "email" },
];

const fallbackImages = [gamepadImage, monitorImage];

function getApiErrorMessage(error) {
    return error.response?.data?.message || "Something went wrong";
}

function getCheckoutItemName(item) {
    return item.product?.name || item.productName || "Product";
}

function getCheckoutItemImage(item, index) {
    return item.product?.image || item.productImage || fallbackImages[index % fallbackImages.length];
}

function buildCheckoutPayload(data, paymentMethod) {
    const shippingAddress = {
        name: data.name,
        phone: data.phone || undefined,
        line1: data.line1,
        line2: data.line2 || undefined,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country.toUpperCase(),
    };

    return {
        currency: "usd",
        paymentMethod,
        shippingAddress,
    };
}

function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm({
        defaultValues: {
            country: "US",
        },
    });

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
                    toast.error("Log in before checkout");
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

    async function onSubmit(data) {
        if (!cart?.items?.length) {
            toast.error("Your cart is empty");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = buildCheckoutPayload(data, paymentMethod);
            const { response } = await createCheckout(payload);

            toast.success(
                response.paymentProvider === "stripe"
                    ? "Stripe checkout created"
                    : "Order placed successfully",
            );
            navigate("/orders");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    const checkoutItems = cart?.items ?? [];
    const subtotal = Number(cart?.subtotal ?? 0);

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
                                        autoComplete={field.autoComplete || field.id}
                                        defaultValue={field.defaultValue}
                                        required={field.required}
                                        type={field.type || "text"}
                                        {...register(field.id, {
                                            required: field.required,
                                            setValueAs: (value) =>
                                                typeof value === "string"
                                                    ? value.trim()
                                                    : value,
                                        })}
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
                            {isLoading ? <span>Loading checkout...</span> : null}
                            {!isLoading && checkoutItems.length === 0 ? (
                                <span>Your cart is empty.</span>
                            ) : null}
                            {checkoutItems.map((item, index) => (
                                <div
                                    className="checkout-page__item"
                                    key={item.id}
                                >
                                    <div className="checkout-page__product">
                                        <img
                                            alt=""
                                            src={getCheckoutItemImage(
                                                item,
                                                index,
                                            )}
                                        />
                                        <span>{getCheckoutItemName(item)}</span>
                                    </div>
                                    <span>{formatPrice(item.lineTotal)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-page__line">
                            <span>Subtotal:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="checkout-page__line">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="checkout-page__line">
                            <span>Total:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="checkout-page__payments">
                            <div className="checkout-page__payment-head">
                                <label className="checkout-page__radio">
                                    <input
                                        checked={paymentMethod === "stripe"}
                                        name="payment"
                                        onChange={() =>
                                            setPaymentMethod("stripe")
                                        }
                                        type="radio"
                                    />
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
                                <input
                                    checked={paymentMethod === "cod"}
                                    name="payment"
                                    onChange={() => setPaymentMethod("cod")}
                                    type="radio"
                                />
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
                            disabled={isSubmitting || isLoading}
                            onClick={handleSubmit(onSubmit)}
                            type="button"
                        >
                            {isSubmitting ? "Placing..." : "Place Order"}
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default CheckoutPage;
