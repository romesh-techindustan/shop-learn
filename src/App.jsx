import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AccountPage from "./pages/AccountPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <div className="app-shell">
            <Navbar />
            <div className="app-shell__content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="auth/sign-up" element={<SignUpPage />} />
                    <Route path="auth/login" element={<LoginPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="profile" element={<AccountPage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
