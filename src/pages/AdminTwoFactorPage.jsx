import frame760 from "../assets/Frame 760.png";
import "../css/SignUpPage.css";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyAdminOtp } from "../api/auth";
import { setAccessToken, setItemInLocalStorage } from "../axios/ index";

const ADMIN_2FA_EMAIL_KEY = "admin_2fa_email";

function AdminTwoFactorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = useMemo(
        () =>
            location.state?.email ||
            window.sessionStorage.getItem(ADMIN_2FA_EMAIL_KEY) ||
            "",
        [location.state?.email],
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (!email) {
            navigate("/auth/login", { replace: true });
        }
    }, [email, navigate]);

    const onSubmit = async (data) => {
        try {
            const otp = data.otp.replace(/\D/g, "");
            const { response, accessToken } = await verifyAdminOtp({
                email,
                otp,
            });

            if (accessToken) {
                setAccessToken(accessToken);
                setItemInLocalStorage("userDetail", response);
                window.sessionStorage.removeItem(ADMIN_2FA_EMAIL_KEY);
                toast.success("Admin login verified");
                navigate("/admin", { replace: true });
            }
        } catch (error) {
            const errMsg =
                error.response?.data?.message || "Invalid or expired OTP";

            toast.error(errMsg);
            reset({ otp: "" });
        }
    };

    return (
        <main className="signupPageWrapper">
            <div className="appContainer signupPageHeroSection">
                <div className="signupPageVisual">
                    <img
                        alt=""
                        className="signupPageVisualImage"
                        src={frame760}
                    />
                </div>

                <section
                    className="signupPagePanel signupPagePanelLogin"
                    aria-labelledby="admin-2fa-title"
                >
                    <div className="signupPagePanelCopy">
                        <h1 id="admin-2fa-title">2FA login</h1>
                        <p>Enter the 6 digit OTP sent to {email}</p>
                    </div>

                    <form
                        className="signupPageForm signupPageFormLogin"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">
                                Admin OTP
                            </span>
                            <input
                                aria-invalid={Boolean(errors.otp)}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="6 digit OTP"
                                type="text"
                                {...register("otp", {
                                    required: "OTP is required",
                                    setValueAs: (value) =>
                                        value.replace(/\D/g, "").slice(0, 6),
                                    validate: (value) =>
                                        /^\d{6}$/.test(value) ||
                                        "Enter the 6 digit OTP",
                                })}
                            />
                        </label>
                        {errors.otp && (
                            <p className="signupPageErrorMessage">
                                {errors.otp.message}
                            </p>
                        )}

                        <div className="signupPageActions signupPageActionsStacked">
                            <button
                                className="signupPagePrimaryButton signupPagePrimaryButtonLogin signupPagePrimaryButtonWide"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? "Verifying..." : "Verify OTP"}
                            </button>

                            <button
                                className="signupPageForgotLink"
                                onClick={() => navigate("/auth/login")}
                                type="button"
                            >
                                Back to login
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}

export { ADMIN_2FA_EMAIL_KEY };
export default AdminTwoFactorPage;
