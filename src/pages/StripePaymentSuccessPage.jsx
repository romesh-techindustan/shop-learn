import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateStripePaymentStatus } from "../api/orders";

export default function StripePaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get("session_id");
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        async function verifyPayment() {
            if (!sessionId) {
                toast.error("Missing session ID");
                navigate("/");
                return;
            }

            try {
                await updateStripePaymentStatus(sessionId);
                toast.success("Payment verified successfully!");
                navigate("/orders");
            } catch (error) {
                console.error("Payment verification failed:", error);
                toast.error(error.response?.data?.message || "Failed to verify payment status.");
                // Even if it fails, we might want to show the orders page so they can see current status
                navigate("/orders");
            } finally {
                setVerifying(false);
            }
        }

        verifyPayment();
    }, [sessionId, navigate]);

    return (
        <div className="appContainer" style={{ padding: "100px 0", textAlign: "center" }}>
            {verifying ? (
                <div>
                    <h2>Verifying Payment...</h2>
                    <p>Please wait while we confirm your transaction with Stripe.</p>
                </div>
            ) : (
                <div>
                    <h2>Processing...</h2>
                </div>
            )}
        </div>
    );
}
