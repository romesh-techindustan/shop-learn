import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCart } from "../api/cart";
import { checkout as createCheckout } from "../api/orders";
import { getAddresses, createAddress } from "../api/addresses";
import gamepadImage from "../assets/GP11.png";
import monitorImage from "../assets/monitor.png";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { formatPrice } from "../common/common";
import { buildAssetUrl } from "../common/constant";
import "./CommercePages.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const shippingFields = [
    { id: "name", label: "Full Name", required: true, autoComplete: "name" },
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
    return buildAssetUrl(item.product?.image || item.productImage) || fallbackImages[index % fallbackImages.length];
}

function buildCheckoutPayload(data, paymentMethod, addressId) {
    const shippingAddress = addressId ? undefined : {
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
        saveAddress: !addressId,
        addressId: addressId || undefined,
    };
}

function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            country: "US",
        },
    });

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [{ response: cartRes }, { response: addrRes }] = await Promise.all([
                    getCart(),
                    getAddresses(),
                ]);

                if (isMounted) {
                    setCart(cartRes);
                    setAddresses(addrRes || []);
                    if (addrRes?.length > 0) {
                        setSelectedAddressId(addrRes[0].id);
                    }
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

        loadData();

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
            let finalAddressId = selectedAddressId;

            if (selectedAddressId === "new") {
                const addrPayload = {
                    name: data.name,
                    phone: data.phone,
                    line1: data.line1,
                    line2: data.line2,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country.toUpperCase(),
                };
                const { response: newAddr } = await createAddress(addrPayload);
                console.log("6757657", newAddr);
                finalAddressId = newAddr.id;
            }

            const payload = buildCheckoutPayload(data, paymentMethod, finalAddressId);
            const { response } = await createCheckout(payload);

            if (response.paymentProvider === "stripe" && response.clientSecret) {
                toast.success("Stripe checkout created");
                setClientSecret(response.clientSecret);
                return;
            }

            toast.success("Order placed successfully");
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
        <main className="ecommercePageWrapper checkoutPageWrapper">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <span>Account</span>
                    <span className="breadcrumbSeparator">/</span>
                    <span>My Account</span>
                    <span className="breadcrumbSeparator">/</span>
                    <span>Product</span>
                    <span className="breadcrumbSeparator">/</span>
                    <span>View Cart</span>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">
                        CheckOut
                    </span>
                </nav>

                {clientSecret ? (
                    <div id="checkout" style={{ marginTop: "40px", minHeight: "600px" }}>
                        <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    </div>
                ) : (
                    <div className="checkoutPageLayout">
                        <section aria-labelledby="shipping-title">
                            <h1 id="shipping-title">Shipping Details</h1>

                            {addresses.length > 0 && (
                                <div style={{ marginBottom: "24px" }}>
                                    <label className="checkoutInputField">
                                        <span>Select Existing Address</span>
                                        <select
                                            className="commerce-input"
                                            value={selectedAddressId}
                                            onChange={(e) => setSelectedAddressId(e.target.value)}
                                            style={{ width: "100%", appearance: "auto" }}
                                        >
                                            {addresses.map((addr) => (
                                                <option key={addr.id} value={addr.id}>
                                                    {addr.name} - {addr.line1}, {addr.city}
                                                </option>
                                            ))}
                                            <option value="new">+ Add New Address</option>
                                        </select>
                                    </label>
                                </div>
                            )}

                            {(selectedAddressId === "new" || addresses.length === 0) && (
                                <form className="checkoutShippingForm">
                                    {shippingFields.map((field) => (
                                        <label
                                            className="checkoutInputField"
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
                                                    required: selectedAddressId === "new" || addresses.length === 0 ? field.required : false,
                                                    setValueAs: (value) =>
                                                        typeof value === "string"
                                                            ? value.trim()
                                                            : value,
                                                })}
                                            />
                                        </label>
                                    ))}

                                    <label className="checkoutSaveInfoOption">
                                        <input defaultChecked type="checkbox" />
                                        <span
                                            aria-hidden="true"
                                            className="checkoutSaveInfoCheckbox"
                                        >
                                            ✓
                                        </span>
                                        <span>
                                            Save this information for faster check-out
                                            next time
                                        </span>
                                    </label>
                                </form>
                            )}
                        </section>

                        <aside className="checkoutOrderSummary">
                            <div className="checkoutOrderSummaryList">
                                {isLoading ? <span>Loading checkout...</span> : null}
                                {!isLoading && checkoutItems.length === 0 ? (
                                    <span>Your cart is empty.</span>
                                ) : null}
                                {checkoutItems.map((item, index) => (
                                    <div
                                        className="checkoutOrderSummaryItem"
                                        key={item.id}
                                    >
                                        <div className="checkoutProductInfo">
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

                            <div className="checkoutTotalLine">
                                <span>Subtotal:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="checkoutTotalLine">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="checkoutTotalLine">
                                <span>Total:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            <div className="checkoutPaymentMethods">
                                <div className="checkoutPaymentHeader">
                                    <label className="checkoutPaymentRadio">
                                        <input
                                            checked={paymentMethod === "stripe"}
                                            name="payment"
                                            onChange={() =>
                                                setPaymentMethod("stripe")
                                            }
                                            type="radio"
                                        />
                                        <span className="checkoutRadioCustomMark" />
                                        <span>Bank</span>
                                    </label>
                                    <div
                                        aria-label="Supported payment methods"
                                        className="checkoutPaymentLogos"
                                    >
                                        <span className="checkoutPaymentLogo paymentLogoBkash">
                                            bKash
                                        </span>
                                        <span className="checkoutPaymentLogo paymentLogoVisa">
                                            VISA
                                        </span>
                                        <span className="checkoutPaymentLogo paymentLogoMastercard">
                                            MasterCard
                                        </span>
                                        <span className="checkoutPaymentLogo paymentLogoNagad">
                                            nagad
                                        </span>
                                    </div>
                                </div>

                                <label className="checkoutPaymentRadio">
                                    <input
                                        checked={paymentMethod === "cod"}
                                        name="payment"
                                        onChange={() => setPaymentMethod("cod")}
                                        type="radio"
                                    />
                                    <span className="checkoutRadioCustomMark" />
                                    <span>Cash on delivery</span>
                                </label>
                            </div>

                            <form className="checkoutCouponInput">
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
                                className="commerce-button commerce-button--primary checkoutPlaceOrderBtn"
                                disabled={isSubmitting || isLoading}
                                onClick={handleSubmit(onSubmit)}
                                type="button"
                            >
                                {isSubmitting ? "Placing..." : "Place Order"}
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}

export default CheckoutPage;
