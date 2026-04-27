import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminOrders } from "../api/orders";
import { getProducts } from "../api/products";
import { getUsers } from "../api/users";
import { formatPrice } from "../common/common";
import "../css/AdminPages.css";

/* ── Helpers ───────────────────────────────────────────── */
function getStoredUser() {
    try {
        const d = localStorage.getItem("userDetail");
        return d ? JSON.parse(d) : null;
    } catch {
        return null;
    }
}

function getUserName(user) {
    return user?.name || user?.fullName || user?.user?.name || "Admin";
}

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
}

/* ── Shared Admin Sidebar ───────────────────────────────── */
export function AdminSidebar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const user = getStoredUser();
    const userName = getUserName(user);
    const initials = getInitials(userName);

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊", to: "/admin" },
        { id: "orders",    label: "Orders",    icon: "📦", to: "/admin/orders" },
        { id: "products",  label: "Products",  icon: "🛍️", to: "/admin/products" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("userDetail");
        localStorage.removeItem("access_token");
        navigate("/auth/login");
    };

    return (
        <aside className="adminSidebar">
            <div className="adminSidebarBrand">
                <div className="adminSidebarBrandIcon">🛒</div>
                <div>
                    <div className="adminSidebarBrandName">Exclusive</div>
                    <div className="adminSidebarBrandSub">Admin Panel</div>
                </div>
            </div>

            <nav className="adminSidebarNav" aria-label="Admin navigation">
                <div className="adminSidebarSection">Main Menu</div>
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.to}
                        className={`adminNavLink ${pathname === item.to ? "active" : ""}`}
                    >
                        <span className="adminNavLinkIcon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <div className="adminSidebarSection" style={{ marginTop: 16 }}>Store</div>
                <Link to="/" className="adminNavLink">
                    <span className="adminNavLinkIcon">🏪</span>
                    View Store
                </Link>
            </nav>

            <div className="adminSidebarFooter">
                <div className="adminSidebarUserCard">
                    <div className="adminSidebarAvatar">{initials}</div>
                    <div className="adminSidebarUserInfo">
                        <div className="adminSidebarUserName">{userName}</div>
                        <div className="adminSidebarUserRole">Administrator</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        style={{ background: "transparent", border: 0, cursor: "pointer", fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", marginLeft: "auto" }}
                    >
                        ↩
                    </button>
                </div>
            </div>
        </aside>
    );
}

/* ── Status Badge ───────────────────────────────────────── */
function StatusBadge({ status }) {
    const key = status?.toLowerCase().replace(/\s+/g, "-") || "pending";
    return (
        <span className={`adminBadge adminBadge--${key}`}>
            {status}
        </span>
    );
}

/* ── Stat Card ──────────────────────────────────────────── */
function StatCard({ variant, icon, value, label, change, changeColor }) {
    return (
        <div className={`adminStatCard adminStatCard--${variant}`}>
            <div className="adminStatIconBox">{icon}</div>
            <div className="adminStatInfo">
                <div className="adminStatValue">{value}</div>
                <div className="adminStatLabel">{label}</div>
                {change && (
                    <span
                        className="adminStatChange"
                        style={{
                            background: `${changeColor}18`,
                            color: changeColor,
                        }}
                    >
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ── Loading Spinner ────────────────────────────────────── */
function Spinner() {
    return (
        <div className="adminLoadingSpinner">
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <span>Loading data…</span>
        </div>
    );
}

/* ── Dashboard Page ─────────────────────────────────────── */
export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [orders, setOrders]     = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers]       = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        const storedUser = getStoredUser();
        const isAdmin = storedUser?.isAdmin || storedUser?.user?.isAdmin;
        if (!isAdmin) {
            navigate("/auth/login");
            return;
        }

        let isMounted = true;
        async function fetchData() {
            try {
                const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
                    getAdminOrders({ limit: 100 }),
                    getProducts({ limit: 100 }),
                    getUsers(),
                ]);

                if (!isMounted) return;

                if (ordersRes.status === "fulfilled") {
                    const data = ordersRes.value.response;
                    setOrders(Array.isArray(data) ? data : data?.orders || []);
                }
                if (productsRes.status === "fulfilled") {
                    const data = productsRes.value.response;
                    setProducts(Array.isArray(data) ? data : data?.products || []);
                }
                if (usersRes.status === "fulfilled") {
                    const data = usersRes.value.response;
                    setUsers(Array.isArray(data) ? data : []);
                }
            } catch {
                toast.error("Failed to load dashboard data");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, [navigate]);

    const totalRevenue = orders
        .filter((o) => o.status?.toLowerCase() !== "cancelled")
        .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

    return (
        <div className="adminLayout">
            <AdminSidebar />
            <div className="adminContent">
                <div className="adminTopBar">
                    <div className="adminTopBarLeft">
                        <h1>Dashboard</h1>
                        <p>Welcome back — here's what's happening today</p>
                    </div>
                    <div className="adminTopBarRight">
                        <span className="adminTopBarBadge">🟢 Live</span>
                        <Link to="/admin/orders" className="adminBtn adminBtn--primary">
                            View All Orders
                        </Link>
                    </div>
                </div>

                <div className="adminPageBody">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            {/* Stat Cards */}
                            <div className="adminStatsGrid">
                                <StatCard
                                    variant="orders"
                                    icon="📦"
                                    value={orders.length}
                                    label="Total Orders"
                                    change="All time"
                                    changeColor="#db4444"
                                />
                                <StatCard
                                    variant="revenue"
                                    icon="💰"
                                    value={formatPrice(totalRevenue)}
                                    label="Total Revenue"
                                    change="All time"
                                    changeColor="#10b981"
                                />
                                <StatCard
                                    variant="products"
                                    icon="🛍️"
                                    value={products.length}
                                    label="Total Products"
                                    change="In catalogue"
                                    changeColor="#6366f1"
                                />
                                <StatCard
                                    variant="users"
                                    icon="👥"
                                    value={users.length || "—"}
                                    label="Total Users"
                                    change="Registered"
                                    changeColor="#f59e0b"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="adminPanel" style={{ marginBottom: 24 }}>
                                <div className="adminPanelHeader">
                                    <div>
                                        <h2>Quick Actions</h2>
                                        <p>Jump to common admin tasks</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 12, padding: "20px 24px", flexWrap: "wrap" }}>
                                    <Link to="/admin/orders"   className="adminBtn adminBtn--primary">📦 Manage Orders</Link>
                                    <Link to="/admin/products" className="adminBtn adminBtn--ghost">🛍️ Manage Products</Link>
                                    <Link to="/"              className="adminBtn adminBtn--ghost">🏪 View Store</Link>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="adminPanel">
                                <div className="adminPanelHeader">
                                    <div>
                                        <h2>Recent Orders</h2>
                                        <p>Latest {recentOrders.length} orders across all customers</p>
                                    </div>
                                    <Link to="/admin/orders" className="adminBtn adminBtn--ghost adminBtn--sm">
                                        View All →
                                    </Link>
                                </div>

                                {recentOrders.length === 0 ? (
                                    <div className="adminEmptyState">
                                        <span>📭</span>
                                        <p>No orders yet</p>
                                    </div>
                                ) : (
                                    <div className="adminTableWrapper">
                                        <table className="adminTable">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Payment</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>
                                                            <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#64748b" }}>
                                                                #{order.id?.slice(0, 8)}
                                                            </span>
                                                        </td>
                                                        <td>{order.userName || order.user?.name || "—"}</td>
                                                        <td style={{ color: "#64748b", fontSize: "0.82rem" }}>
                                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                                month: "short", day: "numeric", year: "numeric"
                                                            })}
                                                        </td>
                                                        <td style={{ fontWeight: 700 }}>
                                                            {formatPrice(order.totalAmount)}
                                                        </td>
                                                        <td><StatusBadge status={order.status} /></td>
                                                        <td><StatusBadge status={order.paymentStatus || "unpaid"} /></td>
                                                        <td>
                                                            <Link
                                                                to={`/admin/orders/${order.id}`}
                                                                className="adminBtn adminBtn--ghost adminBtn--sm"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
