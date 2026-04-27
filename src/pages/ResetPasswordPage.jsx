import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../api/auth";
import frame760 from "../assets/Frame 760.png";
import "./SignUpPage.css";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data) {
        try {
            await resetPassword({
                email,
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            toast.success("Password reset successfully");
            navigate("/auth/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to reset password");
        }
    }

    return (
        <main className="signupPageWrapper">
            <div className="appContainer signupPageHeroSection">
                <div className="signupPageVisual">
                    <img alt="" className="signupPageVisualImage" src={frame760} />
                </div>

                <section className="signupPagePanel" aria-labelledby="reset-title">
                    <div className="signupPagePanelCopy">
                        <h1 id="reset-title">Reset password</h1>
                        <p>Choose a new password for your account</p>
                    </div>

                    <form className="signupPageForm" onSubmit={handleSubmit(onSubmit)}>
                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">New password</span>
                            <input
                                autoComplete="new-password"
                                placeholder="New Password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters long",
                                    },
                                })}
                            />
                        </label>
                        {errors.password ? (
                            <p className="signupPageErrorMessage">{errors.password.message}</p>
                        ) : null}

                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">Confirm password</span>
                            <input
                                autoComplete="new-password"
                                placeholder="Confirm New Password"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === getValues("password") ||
                                        "Passwords must match",
                                })}
                            />
                        </label>
                        {errors.confirmPassword ? (
                            <p className="signupPageErrorMessage">
                                {errors.confirmPassword.message}
                            </p>
                        ) : null}

                        <button
                            className="signupPagePrimaryButton"
                            disabled={isSubmitting || !token || !email}
                            type="submit"
                        >
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <p className="signupPageLoginCopy">
                        Back to
                        <Link className="signupPageTextLink" to="/auth/login">
                            Log in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default ResetPasswordPage;
