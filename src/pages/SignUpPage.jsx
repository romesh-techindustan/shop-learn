import { toast } from "react-toastify";
import frame760 from "../assets/Frame 760.png";
import axiosInstance from "../axios/ index";
import { isValidEmailOrPhone } from "../common/common";
import "./SignUpPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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
            const { status } = await axiosInstance.post("/auth/sign-up", {
                name: data.name,
                email: data.contact,
                password: data.password,
            });
            if (status === 200 || status === 201) {
                reset();
                navigate("/auth/login");
            }
        } catch (error) {
            console.error(error.response?.data?.message, "werwerwewer");
            const errMsg = error.response?.data?.message|| "Something went wrong";
            toast.error(errMsg)
            reset();
        }
    };

    return (
        <main className="signup-page">
            <div className="app-shell__container signup-page__hero">
                <div className="signup-page__visual">
                    <img
                        alt=""
                        className="signup-page__visual-image"
                        src={frame760}
                    />
                </div>

                <section
                    className="signup-page__panel"
                    aria-labelledby="signup-title"
                >
                    <div className="signup-page__panel-copy">
                        <h1 id="signup-title">Create an account</h1>
                        <p>Enter your details below</p>
                    </div>

                    <form
                        className="signup-page__form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="signup-page__field">
                            <span className="signup-page__sr-only">Name</span>
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
                            <p className="signup-page__error">
                                {errors.name.message}
                            </p>
                        )}

                        <label className="signup-page__field">
                            <span className="signup-page__sr-only">
                                Email or phone number
                            </span>
                            <input
                                aria-invalid={Boolean(errors.contact)}
                                autoComplete="username"
                                placeholder="Email or Phone Number"
                                type="text"
                                {...register("contact", {
                                    required:
                                        "Email or phone number is required",
                                    setValueAs: (value) => value.trim(),
                                    validate: (value) =>
                                        isValidEmailOrPhone(value) ||
                                        "Enter a valid email address or phone number",
                                })}
                            />
                        </label>
                        {errors.contact && (
                            <p className="signup-page__error">
                                {errors.contact.message}
                            </p>
                        )}

                        <label className="signup-page__field">
                            <span className="signup-page__sr-only">
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
                            <p className="signup-page__error">
                                {errors.password.message}
                            </p>
                        )}

                        <button
                            className="signup-page__primary-button"
                            type="submit"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="signup-page__login-copy">
                        Already have account?
                        <Link
                            className="signup-page__text-link"
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
