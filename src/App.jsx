import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <div className="app-shell">
            <Navbar />
            <div className="app-shell__content">
                <Routes>
                    <Route path="auth/sign-up" element={<SignUpPage />} />
                    <Route path="auth/login" element={<LoginPage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
