import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AccountPage from "./pages/AccountPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import StripePaymentSuccessPage from "./pages/StripePaymentSuccessPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const { pathname } = useLocation();
    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <div className="appLayoutWrapper">
            {!isAdminRoute && <Navbar />}
            <div className={isAdminRoute ? "" : "appMainContent"}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="product/:id" element={<ProductDetailPage />} />
                    <Route path="auth/sign-up" element={<SignUpPage />} />
                    <Route path="auth/login" element={<LoginPage />} />
                    <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="auth/reset-password" element={<ResetPasswordPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="order/:id" element={<OrderDetailPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="stripe-success" element={<StripePaymentSuccessPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="profile" element={<AccountPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="admin" element={<AdminDashboardPage />} />
                    <Route path="admin/orders" element={<AdminOrdersPage />} />
                    <Route path="admin/products" element={<AdminProductsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
            {!isAdminRoute && <Footer />}
        </div>
    );
}

export default App;
