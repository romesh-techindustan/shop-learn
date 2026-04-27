import frame760 from "../assets/Frame 760.png";
import "../css/SignUpPage.css";
import { useForm } from "react-hook-form";
import { setAccessToken, setItemInLocalStorage } from "../axios/ index";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { ADMIN_2FA_EMAIL_KEY } from "./AdminTwoFactorPage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        try {
            const { response, accessToken } = await login(data);

            if (response?.twoFactorRequired) {
                const pendingEmail = response.email || data.contact;
                window.sessionStorage.setItem(
                    ADMIN_2FA_EMAIL_KEY,
                    pendingEmail,
                );
                toast.success("Admin OTP sent to email");
                navigate("/auth/admin-2fa", { state: { email: pendingEmail } });
                reset();
                return;
            }

            if (accessToken) {
                setAccessToken(accessToken);
                setItemInLocalStorage("userDetail", response);
                // Redirect admins to the admin dashboard
                const isAdmin = response?.isAdmin || response?.user?.isAdmin;
                navigate(isAdmin ? "/admin" : "/");
            }

            reset();
        } catch (error) {
            const errMsg =
                error.response?.data?.message || "Something went wrong";

            toast.error(errMsg);
            reset();
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
                    aria-labelledby="login-title"
                >
                    <div className="signupPagePanelCopy">
                        <h1 id="login-title">Log in to Exclusive</h1>
                        <p>Enter your details below</p>
                    </div>

                    <form
                        className="signupPageForm signupPageFormLogin"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">
                                Email address
                            </span>
                            <input
                                aria-invalid={Boolean(errors.contact)}
                                autoComplete="email"
                                placeholder="Email Address"
                                type="text"
                                {...register("contact", {
                                    required: "Email is required",
                                    setValueAs: (value) => value.trim(),
                                    validate: (value) =>
                                        emailPattern.test(value) ||
                                        "Enter a valid email address",
                                })}
                            />
                        </label>
                        {errors.contact && (
                            <p className="signupPageErrorMessage">
                                {errors.contact.message}
                            </p>
                        )}

                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">
                                Password
                            </span>
                            <input
                                autoComplete="current-password"
                                placeholder="Password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                        </label>
                        {errors.password && (
                            <p className="signupPageErrorMessage">
                                {errors.password.message}
                            </p>
                        )}

                        <div className="signupPageActions">
                            <button
                                className="signupPagePrimaryButton signupPagePrimaryButtonLogin"
                                type="submit"
                            >
                                Log In
                            </button>

                            <button
                                className="signupPageForgotLink"
                                onClick={() => navigate("/auth/forgot-password")}
                                type="button"
                            >
                                Forget Password?
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
        // <form onSubmit={handleSubmit(onSubmit)}>
        //     {/* register your input into the hook by invoking the "register" function */}
        //     <input defaultValue="test" {...register("example")} />

        //     {/* include validation with required or other standard HTML validation rules */}
        //     <input {...register("exampleRequired", { required: true })} />
        //     {/* errors will return when field validation fails  */}
        //     {errors.exampleRequired && <span>This field is required</span>}

        //     <input type="submit" />
        // </form>
    );
}

export default LoginPage;
