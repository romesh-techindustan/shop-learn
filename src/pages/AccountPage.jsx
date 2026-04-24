import { Link } from "react-router-dom";
import "./CommercePages.css";

function getStoredUser() {
    try {
        const storedData = localStorage.getItem("userDetail");
        return storedData ? JSON.parse(storedData) : null;
    } catch {
        return null;
    }
}

function getProfileDefaults() {
    const storedUser = getStoredUser();
    const name = storedUser?.name || storedUser?.fullName || "Md Rimel";
    const [firstName = "Md", ...lastNameParts] = name.split(" ");

    return {
        firstName,
        lastName: lastNameParts.join(" ") || "Rimel",
        email: storedUser?.email || storedUser?.user?.email || "rimell111@gmail.com",
        address: "Kingston, 5236, United State",
    };
}

function AccountPage() {
    const profile = getProfileDefaults();
    const displayName = `${profile.firstName} ${profile.lastName}`.trim();

    return (
        <main className="commerce-page commerce-page--account account-page">
            <div className="app-shell__container">
                <div className="account-page__topline">
                    <nav
                        className="commerce-breadcrumb"
                        aria-label="Breadcrumb"
                    >
                        <Link to="/">Home</Link>
                        <span className="commerce-breadcrumb__divider">/</span>
                        <span className="commerce-breadcrumb__current">
                            My Account
                        </span>
                    </nav>
                    <p className="account-page__welcome">
                        Welcome! <strong>{displayName}</strong>
                    </p>
                </div>

                <div className="account-page__layout">
                    <aside
                        aria-label="Account sections"
                        className="account-page__sidebar"
                    >
                        <section className="account-page__menu">
                            <h2>Manage My Account</h2>
                            <ul>
                                <li className="account-page__active">
                                    My Profile
                                </li>
                                <li>Address Book</li>
                                <li>My Payment Options</li>
                            </ul>
                        </section>
                        <section className="account-page__menu">
                            <h2>My Orders</h2>
                            <ul>
                                <li>My Returns</li>
                                <li>My Cancellations</li>
                            </ul>
                        </section>
                        <section className="account-page__menu">
                            <h2>My WishList</h2>
                        </section>
                    </aside>

                    <section
                        className="account-page__panel"
                        aria-labelledby="profile-title"
                    >
                        <h1 id="profile-title">Edit Your Profile</h1>

                        <form
                            className="account-page__form"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <div className="account-page__field-grid">
                                <label className="account-page__field">
                                    <span>First Name</span>
                                    <input
                                        defaultValue={profile.firstName}
                                        type="text"
                                    />
                                </label>
                                <label className="account-page__field">
                                    <span>Last Name</span>
                                    <input
                                        defaultValue={profile.lastName}
                                        type="text"
                                    />
                                </label>
                                <label className="account-page__field">
                                    <span>Email</span>
                                    <input
                                        defaultValue={profile.email}
                                        type="email"
                                    />
                                </label>
                                <label className="account-page__field">
                                    <span>Address</span>
                                    <input
                                        defaultValue={profile.address}
                                        type="text"
                                    />
                                </label>
                            </div>

                            <label className="account-page__field">
                                <span>Password Changes</span>
                                <div className="account-page__passwords">
                                    <input
                                        placeholder="Current Password"
                                        type="password"
                                    />
                                    <input
                                        placeholder="New Password"
                                        type="password"
                                    />
                                    <input
                                        placeholder="Confirm New Password"
                                        type="password"
                                    />
                                </div>
                            </label>

                            <div className="account-page__actions">
                                <button
                                    className="account-page__cancel"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="commerce-button commerce-button--primary account-page__save"
                                    type="submit"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AccountPage;
