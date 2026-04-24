import { useState } from "react";
import frame760 from "../assets/Frame 760.png";
import { isValidEmailOrPhone } from "../common/common";
import "./SignUpPage.css";
import { useForm } from "react-hook-form";
import axiosInstance, { setAccessToken } from "../axios/ index";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const {
        watch,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post("/auth/login", {
                email: data.contact,
                password: data.password,
            });
            const accessToken = response.data?.accessToken;

            if (accessToken) {
                setAccessToken(accessToken);
            }

            reset();
            navigate("/")
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Something went wrong';
            toast.error(errMsg);
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
                    className="signup-page__panel signup-page__panel--login"
                    aria-labelledby="login-title"
                >
                    <div className="signup-page__panel-copy">
                        <h1 id="login-title">Log in to Exclusive</h1>
                        <p>Enter your details below</p>
                    </div>

                    <form
                        className="signup-page__form signup-page__form--login"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="signup-page__field">
                            <span className="signup-page__sr-only">
                                Email or phone number
                            </span>
                            <input
                                aria-invalid={Boolean(errors.contact)}
                                autoComplete="username"
                                placeholder="Email or Phone Number"
                                // value={email}
                                // onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                {...register("contact")}
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
                                autoComplete="current-password"
                                placeholder="Password"
                                type="password"
                                {...register("password")}
                            />
                        </label>
                        {errors.password && (
                            <p className="signup-page__error">
                                {errors.password.message}
                            </p>
                        )}

                        <div className="signup-page__actions">
                            <button
                                className="signup-page__primary-button signup-page__primary-button--login"
                                type="submit"
                            >
                                Log In
                            </button>

                            <button
                                className="signup-page__forgot-link"
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
