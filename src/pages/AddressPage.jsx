import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAddress, getAddresses } from "../api/addresses";
import "../css/CommercePages.css";

const initialAddressForm = {
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    isDefault: false,
};

function AddressCard({ address }) {
    return (
        <article className="savedAddressCard">
            <div className="savedAddressCardHeader">
                <div>
                    <h2>{address.name}</h2>
                    <p>{address.phone}</p>
                </div>
                {address.isDefault && (
                    <span className="savedAddressDefaultBadge">Default</span>
                )}
            </div>

            <div className="savedAddressDetails">
                <span>{address.line1}</span>
                {address.line2 && <span>{address.line2}</span>}
                <span>
                    {[address.city, address.state, address.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                </span>
                <span>{address.country}</span>
            </div>
        </article>
    );
}

function AddressPage() {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(initialAddressForm);

    useEffect(() => {
        let isMounted = true;

        async function loadAddresses() {
            try {
                const { response } = await getAddresses();

                if (isMounted) {
                    setAddresses(Array.isArray(response) ? response : []);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Log in to view your saved addresses");
                    navigate("/auth/login");
                    return;
                }

                toast.error(
                    error.response?.data?.message ||
                        "Unable to load saved addresses",
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadAddresses();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    function handleInputChange(event) {
        const { checked, name, type, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleCreateAddress(event) {
        event.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                country: formData.country.trim().toUpperCase(),
                line2: formData.line2.trim() || undefined,
            };
            const { response } = await createAddress(payload);

            setAddresses((current) => [
                response,
                ...current.map((address) =>
                    response.isDefault ? { ...address, isDefault: false } : address,
                ),
            ]);
            setFormData(initialAddressForm);
            setShowForm(false);
            toast.success("Address added successfully");
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Log in to add a saved address");
                navigate("/auth/login");
                return;
            }

            toast.error(
                error.response?.data?.message || "Unable to add address",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="ecommercePageWrapper commerce-page--account profilePageWrapper">
            <div className="appContainer">
                <div className="profileTopGreeting">
                    <nav className="breadcrumbNav" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="breadcrumbSeparator">/</span>
                        <Link to="/account">My Account</Link>
                        <span className="breadcrumbSeparator">/</span>
                        <span className="breadcrumbCurrentPage">
                            Saved Addresses
                        </span>
                    </nav>
                </div>

                <div className="profilePageLayout">
                    <aside
                        aria-label="Account sections"
                        className="profileNavSidebar"
                    >
                        <section className="profileSidebarMenu">
                            <h2>Manage My Account</h2>
                            <ul>
                                <li>
                                    <Link to="/account">My Profile</Link>
                                </li>
                                <li className="activeProfileMenuLink">
                                    Saved Addresses
                                </li>
                            </ul>
                        </section>
                        <section className="profileSidebarMenu">
                            <h2>My Orders</h2>
                            <ul>
                                <li>
                                    <Link to="/orders">My Orders</Link>
                                </li>
                                <li>My Returns</li>
                                <li>My Cancellations</li>
                            </ul>
                        </section>
                        <section className="profileSidebarMenu">
                            <h2>
                                <Link to="/wishlist">My WishList</Link>
                            </h2>
                        </section>
                    </aside>

                    <section
                        className="profileMainPanel savedAddressesPanel"
                        aria-labelledby="saved-addresses-title"
                    >
                        <div className="savedAddressesHeader">
                            <div>
                                <h1 id="saved-addresses-title">
                                    Saved Addresses
                                </h1>
                                <p>
                                    {loading
                                        ? "Loading your addresses..."
                                        : `${addresses.length} saved address${addresses.length === 1 ? "" : "es"}`}
                                </p>
                            </div>
                            <button
                                className="commerce-button commerce-button--primary savedAddressAddButton"
                                onClick={() => setShowForm((current) => !current)}
                                type="button"
                            >
                                {showForm ? "Close Form" : "Add New Address"}
                            </button>
                        </div>

                        {showForm && (
                            <form
                                className="savedAddressForm"
                                onSubmit={handleCreateAddress}
                            >
                                <div className="savedAddressFormGrid">
                                    <label className="profileInputField">
                                        <span>Name</span>
                                        <input
                                            name="name"
                                            onChange={handleInputChange}
                                            required
                                            type="text"
                                            value={formData.name}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>Phone</span>
                                        <input
                                            name="phone"
                                            onChange={handleInputChange}
                                            required
                                            type="tel"
                                            value={formData.phone}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>Address Line 1</span>
                                        <input
                                            name="line1"
                                            onChange={handleInputChange}
                                            required
                                            type="text"
                                            value={formData.line1}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>Address Line 2</span>
                                        <input
                                            name="line2"
                                            onChange={handleInputChange}
                                            type="text"
                                            value={formData.line2}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>City</span>
                                        <input
                                            name="city"
                                            onChange={handleInputChange}
                                            required
                                            type="text"
                                            value={formData.city}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>State</span>
                                        <input
                                            name="state"
                                            onChange={handleInputChange}
                                            required
                                            type="text"
                                            value={formData.state}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>Postal Code</span>
                                        <input
                                            name="postalCode"
                                            onChange={handleInputChange}
                                            required
                                            type="text"
                                            value={formData.postalCode}
                                        />
                                    </label>
                                    <label className="profileInputField">
                                        <span>Country</span>
                                        <input
                                            maxLength={2}
                                            name="country"
                                            onChange={handleInputChange}
                                            required
                                            type="text"
                                            value={formData.country}
                                        />
                                    </label>
                                </div>

                                <label className="savedAddressDefaultOption">
                                    <input
                                        checked={formData.isDefault}
                                        name="isDefault"
                                        onChange={handleInputChange}
                                        type="checkbox"
                                    />
                                    <span>Set as default address</span>
                                </label>

                                <div className="savedAddressFormActions">
                                    <button
                                        className="profileCancelButton"
                                        onClick={() => {
                                            setFormData(initialAddressForm);
                                            setShowForm(false);
                                        }}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="commerce-button commerce-button--primary"
                                        disabled={isSaving}
                                        type="submit"
                                    >
                                        {isSaving ? "Saving..." : "Save Address"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {loading ? (
                            <div className="savedAddressesLoading">
                                Loading addresses...
                            </div>
                        ) : addresses.length > 0 ? (
                            <div className="savedAddressGrid">
                                {addresses.map((address) => (
                                    <AddressCard
                                        address={address}
                                        key={address.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="savedAddressesEmpty">
                                <h2>No saved addresses yet</h2>
                                <p>
                                    Addresses you save during checkout will show
                                    up here.
                                </p>
                                <Link
                                    className="commerce-button commerce-button--primary"
                                    to="/products"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AddressPage;
