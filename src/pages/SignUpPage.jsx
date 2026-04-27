import { toast } from "react-toastify";
import frame760 from "../assets/Frame 760.png";
import "./SignUpPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignUpPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const { response, status } = await signup(data);
            if (status === 200 || status === 201) {
                reset();
                toast.success(`Account created for ${response.email}`);
                navigate("/auth/login");
            }
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
                    className="signupPagePanel"
                    aria-labelledby="signup-title"
                >
                    <div className="signupPagePanelCopy">
                        <h1 id="signup-title">Create an account</h1>
                        <p>Enter your details below</p>
                    </div>

                    <form
                        className="signupPageForm"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="signupPageInputField">
                            <span className="signupPageSrOnly">Name</span>
                            <input
                                autoComplete="name"
                                placeholder="Name"
                                type="text"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                            />
                        </label>
                        {errors.name && (
                            <p className="signupPageErrorMessage">
                                {errors.name.message}
                            </p>
                        )}

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
                                autoComplete="new-password"
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

                        <button
                            className="signupPagePrimaryButton"
                            type="submit"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="signupPageLoginCopy">
                        Already have account?
                        <Link
                            className="signupPageTextLink"
                            to="/auth/login"
                        >
                            Log in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default SignUpPage;
