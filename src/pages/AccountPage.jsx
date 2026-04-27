import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../api/auth";
import { getProfile } from "../api/users";
import { setItemInLocalStorage } from "../axios/ index";
import "./CommercePages.css";

function getStoredUser() {
    try {
        const storedData = localStorage.getItem("userDetail");
        return storedData ? JSON.parse(storedData) : null;
    } catch {
        return null;
    }
}

function buildProfileDefaults(user) {
    const storedUser = user || getStoredUser();
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
    const navigate = useNavigate();
    const [profile, setProfile] = useState(() => buildProfileDefaults());
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    
    const displayName = `${profile.firstName} ${profile.lastName}`.trim();

    useEffect(() => {
        let isMounted = true;

        async function loadProfile() {
            try {
                const { response } = await getProfile();

                setItemInLocalStorage("userDetail", response);

                if (isMounted) {
                    setProfile(buildProfileDefaults(response));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Log in to view your account");
                    navigate("/auth/login");
                    return;
                }

                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        "Unable to load profile",
                );
            }
        }

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    function handlePasswordChange(event) {
        const { name, value } = event.target;

        setPasswordData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            !passwordData.currentPassword &&
            !passwordData.newPassword &&
            !passwordData.confirmPassword
        ) {
            toast.info("Enter password details to save changes");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password must match");
            return;
        }

        setIsSavingPassword(true);

        try {
            await changePassword(passwordData);
            toast.success("Password changed successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Log in again to change your password");
                navigate("/auth/login");
                return;
            }

            toast.error(error.response?.data?.message || "Unable to change password");
        } finally {
            setIsSavingPassword(false);
        }
    }

    return (
        <main className="ecommercePageWrapper commerce-page--account profilePageWrapper">
            <div className="appContainer">
                <div className="profileTopGreeting">
                    <nav
                        className="breadcrumbNav"
                        aria-label="Breadcrumb"
                    >
                        <Link to="/">Home</Link>
                        <span className="breadcrumbSeparator">/</span>
                        <span className="breadcrumbCurrentPage">
                            My Account
                        </span>
                    </nav>
                    <p className="profileWelcomeText">
                        Welcome! <strong>{displayName}</strong>
                    </p>
                </div>

                <div className="profilePageLayout">
                    <aside
                        aria-label="Account sections"
                        className="profileNavSidebar"
                    >
                        <section className="profileSidebarMenu">
                            <h2>Manage My Account</h2>
                            <ul>
                                <li className="activeProfileMenuLink">
                                    My Profile
                                </li>
                                <li>Address Book</li>
                                <li>My Payment Options</li>
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
                        className="profileMainPanel"
                        aria-labelledby="profile-title"
                    >
                        <h1 id="profile-title">Edit Your Profile</h1>

                        <form
                            className="profileDetailsForm"
                            onSubmit={handleSubmit}
                        >
                            <div className="profileInputGrid">
                                <label className="profileInputField">
                                    <span>First Name</span>
                                    <input
                                        readOnly
                                        type="text"
                                        value={profile.firstName}
                                    />
                                </label>
                                <label className="profileInputField">
                                    <span>Last Name</span>
                                    <input
                                        readOnly
                                        type="text"
                                        value={profile.lastName}
                                    />
                                </label>
                                <label className="profileInputField">
                                    <span>Email</span>
                                    <input
                                        readOnly
                                        type="email"
                                        value={profile.email}
                                    />
                                </label>
                                <label className="profileInputField">
                                    <span>Address</span>
                                    <input
                                        readOnly
                                        type="text"
                                        value={profile.address}
                                    />
                                </label>
                            </div>

                            <label className="profileInputField">
                                <span>Password Changes</span>
                                <div className="profilePasswordSection">
                                    <input
                                        autoComplete="current-password"
                                        name="currentPassword"
                                        onChange={handlePasswordChange}
                                        placeholder="Current Password"
                                        type="password"
                                        value={passwordData.currentPassword}
                                    />
                                    <input
                                        autoComplete="new-password"
                                        name="newPassword"
                                        onChange={handlePasswordChange}
                                        placeholder="New Password"
                                        type="password"
                                        value={passwordData.newPassword}
                                    />
                                    <input
                                        autoComplete="new-password"
                                        name="confirmPassword"
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm New Password"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                    />
                                </div>
                            </label>

                            <div className="profileActionButtons">
                                <button
                                    className="profileCancelButton"
                                    onClick={() =>
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        })
                                    }
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="commerce-button commerce-button--primary profileSaveButton"
                                    disabled={isSavingPassword}
                                    type="submit"
                                >
                                    {isSavingPassword ? "Saving..." : "Save Changes"}
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
