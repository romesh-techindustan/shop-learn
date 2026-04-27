import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../api/auth";
import frame760 from "../assets/Frame 760.png";
import "./SignUpPage.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    async function onSubmit(data) {
        try {
            const { message } = await forgotPassword(data.email);
            toast.success(message || "Password reset email sent");
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to send reset email");
        }
    }

    return (
        <main className="signupPageWrapper">
            <div className="appContainer signupPageHeroSection">
                <div className="signupPageVisual">
                    <img alt="" className="signupPageVisualImage" src={frame760} />
                </div>

                <section className="signupPagePanel" aria-labelledby="forgot-title">
                    <div className="signupPagePanelCopy">
                        <h1 id="forgot-title">Forgot password</h1>
                        <p>Enter your email to receive a reset link</p>
                    </div>

                    <form className="signupPageForm" onSubmit={handleSubmit(onSubmit)}>
                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">Email address</span>
                            <input
                                aria-invalid={Boolean(errors.email)}
                                autoComplete="email"
                                placeholder="Email Address"
                                type="text"
                                {...register("email", {
                                    required: "Email is required",
                                    setValueAs: (value) => value.trim(),
                                    validate: (value) =>
                                        emailPattern.test(value) ||
                                        "Enter a valid email address",
                                })}
                            />
                        </label>
                        {errors.email ? (
                            <p className="signupPageErrorMessage">{errors.email.message}</p>
                        ) : null}

                        <button className="signupPagePrimaryButton" disabled={isSubmitting} type="submit">
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <p className="signupPageLoginCopy">
                        Remembered it?
                        <Link className="signupPageTextLink" to="/auth/login">
                            Log in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default ForgotPasswordPage;
