import { Link } from "react-router-dom";
import "./CommercePages.css";

export default function NotFoundPage() {
    return (
        <main className="ecommercePageWrapper">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">404 Error</span>
                </nav>

                <div className="notFoundContainer">
                    <h1 className="notFoundTitle">404 Not Found</h1>
                    <p className="notFoundText">Your visited page not found. You may go home page.</p>
                    <Link to="/" className="commerce-button commerce-button--primary notFoundButton">
                        Back to home page
                    </Link>
                </div>
            </div>
        </main>
    );
}
