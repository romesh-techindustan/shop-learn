import { Link, useLocation, useNavigate } from "react-router-dom";
import cartIcon from "../assets/icons/Cart1.svg";
import cancelIcon from "../assets/icons/icon-cancel.svg";
import logoutIcon from "../assets/icons/Icon-logout.svg";
import orderIcon from "../assets/icons/icon-mallbag.svg";
import reviewsIcon from "../assets/icons/Icon-Reviews.svg";
import userIcon from "../assets/icons/user.svg";
import wishlistIcon from "../assets/icons/Wishlist.svg";
import "./Navbar.css";

const navItems = [
    { id: "home", label: "Home", to: "/" },
    { id: "contact", label: "Contact" },
    { id: "about", label: "About" },
    { id: "sign-up", label: "Sign Up", to: "/auth/sign-up" },
];

const accountMenuItems = [
    {
        id: "account",
        label: "Manage My Account",
        icon: userIcon,
        src: "/profile",
    },
    { id: "order", label: "My Order", icon: orderIcon, src: "/orders" },
    {
        id: "cancel",
        label: "My Cancellations",
        icon: cancelIcon,
        src: "/cancelled-orders",
    },
    {
        id: "reviews",
        label: "My Reviews",
        icon: reviewsIcon,
        src: "/my-reviews",
    },
    { id: "logout", label: "Logout", icon: logoutIcon, src: "/auth/log-out" },
];

function getStoredUser() {
    try {
        const storedData = localStorage.getItem("userDetail");
        return storedData ? JSON.parse(storedData) : null;
    } catch {
        return null;
    }
}

function getUserName(user) {
    return user?.name || user?.fullName || user?.user?.name || "";
}

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function SearchIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
                d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm9 3-4.35-4.35"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function Navbar() {
    const { pathname } = useLocation();
    const data = getStoredUser();
    const userName = getUserName(data);
    const isLoggedIn = Boolean(userName);
    const userInitials = getInitials(userName);
    const visibleNavItems = isLoggedIn
        ? navItems.filter((item) => item.id !== "sign-up")
        : navItems;
    const activeItem =
        pathname === "/"
            ? "home"
            : pathname.startsWith("/auth/sign-up")
              ? "sign-up"
              : "";
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (item.id === "logout") {
            localStorage.removeItem("userDetail");
            localStorage.removeItem("access_token");
        }
    };

    return (
        <div className="navbar">
            <div className="navbar__promo">
                <div className="app-shell__container navbar__promo-inner">
                    <p className="navbar__promo-text">
                        Summer Sale For All Swim Suits And Free Express Delivery
                        - OFF 50%!
                        <button className="navbar__text-link" type="button">
                            ShopNow
                        </button>
                    </p>
                    <button className="navbar__language" type="button">
                        English
                        <span aria-hidden="true">▾</span>
                    </button>
                </div>
            </div>

            <header className="navbar__header">
                <div className="app-shell__container navbar__header-inner">
                    <Link className="navbar__brand" to="/">
                        Exclusive
                    </Link>

                    <nav aria-label="Primary" className="navbar__nav">
                        {visibleNavItems.map((item) =>
                            item.to ? (
                                <Link
                                    aria-current={
                                        activeItem === item.id
                                            ? "page"
                                            : undefined
                                    }
                                    className={`navbar__nav-link ${
                                        activeItem === item.id
                                            ? "navbar__nav-link--active"
                                            : ""
                                    }`}
                                    key={item.id}
                                    to={item.to}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    className="navbar__nav-link"
                                    key={item.id}
                                    type="button"
                                >
                                    {item.label}
                                </button>
                            ),
                        )}
                    </nav>

                    <div className="navbar__tools">
                        <label className="navbar__search">
                            <span className="navbar__sr-only">
                                Search products
                            </span>
                            <input
                                aria-label="Search products"
                                placeholder="What are you looking for?"
                                type="text"
                            />
                            <SearchIcon />
                        </label>

                        <div className="navbar__icon-group">
                            <button
                                aria-label="Wishlist"
                                className="navbar__tool"
                                type="button"
                            >
                                <img alt="" src={wishlistIcon} />
                            </button>

                            <button
                                aria-label="Cart"
                                className="navbar__tool navbar__tool--cart"
                                type="button"
                            >
                                <img alt="" src={cartIcon} />
                                <span className="navbar__tool-badge">2</span>
                            </button>

                            {isLoggedIn ? (
                                <button
                                    aria-label={`Account for ${userName}`}
                                    className="navbar__tool navbar__tool--user navbar__account-initials"
                                    type="button"
                                >
                                    {userInitials}
                                </button>
                            ) : (
                                <Link
                                    aria-label="Account"
                                    className="navbar__tool navbar__tool--user"
                                    to="/auth/login"
                                >
                                    <img alt="" src={userIcon} />
                                </Link>
                            )}

                            <div className="navbar__user-menu">
                                {accountMenuItems.map((item) => (
                                    <button
                                        className="navbar__menu-item"
                                        key={item.id}
                                        type="button"
                                    >
                                        <img alt="" src={item.icon} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Navbar;
