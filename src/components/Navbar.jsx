import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CART_UPDATED_EVENT, getCart } from "../api/cart";
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
    { id: "contact", label: "Contact", to: "/contact" },
    { id: "about", label: "About", to: "/about" },
    { id: "sign-up", label: "Sign Up", to: "/auth/sign-up" },
];

const accountMenuItems = [
    {
        id: "account",
        label: "Manage My Account",
        icon: userIcon,
        to: "/account",
    },
    { id: "order", label: "My Order", icon: orderIcon, to: "/orders" },
    {
        id: "cancel",
        label: "My Cancellations",
        icon: cancelIcon,
        to: "/cancelled-orders",
    },
    {
        id: "reviews",
        label: "My Reviews",
        icon: reviewsIcon,
        to: "/my-reviews",
    },
    { id: "logout", label: "Logout", icon: logoutIcon, to: "/auth/login" },
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
    const [cartCount, setCartCount] = useState(0);
    const cartRequestId = useRef(0);
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
    const handleClick = (item) => {
        if (item.id === "logout") {
            localStorage.removeItem("userDetail");
            localStorage.removeItem("access_token");
            cartRequestId.current += 1;
            setCartCount(0);
        }
    };

    const loadCartCount = useCallback(async () => {
        if (!isLoggedIn) {
            cartRequestId.current += 1;
            setCartCount(0);
            return;
        }

        const requestId = cartRequestId.current + 1;
        cartRequestId.current = requestId;

        try {
            const { response } = await getCart();

            if (cartRequestId.current === requestId) {
                setCartCount(response?.totalItems ?? 0);
            }
        } catch {
            if (cartRequestId.current === requestId) {
                setCartCount(0);
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        let isMounted = true;

        async function loadInitialCartCount() {
            if (!isLoggedIn) {
                return;
            }

            const requestId = cartRequestId.current + 1;
            cartRequestId.current = requestId;

            try {
                const { response } = await getCart();

                if (isMounted && cartRequestId.current === requestId) {
                    setCartCount(response?.totalItems ?? 0);
                }
            } catch {
                if (isMounted && cartRequestId.current === requestId) {
                    setCartCount(0);
                }
            }
        }

        loadInitialCartCount();

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn, pathname]);

    useEffect(() => {
        function handleCartUpdated(event) {
            const totalItems = event.detail?.totalItems;

            if (Number.isFinite(totalItems)) {
                setCartCount(totalItems);
            }

            loadCartCount();
        }

        window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
        };
    }, [loadCartCount]);

    return (
        <div className="navBar">
            <div className="topPromoBanner">
                <div className="appContainer promoBannerContent">
                    <p className="promoAnnouncementText">
                        Summer Sale For All Swim Suits And Free Express Delivery
                        - OFF 50%!
                        <button className="promoShopNowLink" type="button">
                            ShopNow
                        </button>
                    </p>
                    <button className="languageSelector" type="button">
                        English
                        <span aria-hidden="true">▾</span>
                    </button>
                </div>
            </div>

            <header className="mainHeaderSection">
                <div className="appContainer headerContentWrapper">
                    <Link className="brandLogo" to="/">
                        Exclusive
                    </Link>

                    <nav aria-label="Primary" className="primaryNavLinks">
                        {visibleNavItems.map((item) =>
                            item.to ? (
                                <Link
                                    aria-current={
                                        activeItem === item.id
                                            ? "page"
                                            : undefined
                                    }
                                    className={`navLinkItem ${
                                        activeItem === item.id
                                            ? "activeNavLink"
                                            : ""
                                    }`}
                                    key={item.id}
                                    to={item.to}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    className="navLinkItem"
                                    key={item.id}
                                    type="button"
                                >
                                    {item.label}
                                </button>
                            ),
                        )}
                    </nav>

                    <div className="headerToolsGroup">
                        <label className="searchBarContainer">
                            <span className="visuallyHiddenText">
                                Search products
                            </span>
                            <input
                                aria-label="Search products"
                                placeholder="What are you looking for?"
                                type="text"
                            />
                            <SearchIcon />
                        </label>

                        <div className="userToolsGroup">
                            <Link
                                aria-label="Wishlist"
                                className="toolIconButton"
                                to="/wishlist"
                            >
                                <img alt="" src={wishlistIcon} />
                            </Link>

                            <Link
                                aria-label="Cart"
                                className="toolIconButton navbar__tool--cart"
                                to="/cart"
                            >
                                <img alt="" src={cartIcon} />
                                {cartCount > 0 ? (
                                    <span className="cartItemCountBadge">
                                        {cartCount}
                                    </span>
                                ) : null}
                            </Link>

                            {isLoggedIn ? (
                                <Link
                                    aria-label={`Account for ${userName}`}
                                    className="toolIconButton userAccountButton userInitialsAvatar"
                                    to="/account"
                                >
                                    {userInitials}
                                </Link>
                            ) : (
                                <Link
                                    aria-label="Account"
                                    className="toolIconButton userAccountButton"
                                    to="/auth/login"
                                >
                                    <img alt="" src={userIcon} />
                                </Link>
                            )}

                            <div className="userDropdownMenu">
                                {accountMenuItems.map((item) => (
                                    <Link
                                        className="dropdownMenuItem"
                                        key={item.id}
                                        onClick={() => handleClick(item)}
                                        to={item.to}
                                    >
                                        <img alt="" src={item.icon} />
                                        <span>{item.label}</span>
                                    </Link>
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
