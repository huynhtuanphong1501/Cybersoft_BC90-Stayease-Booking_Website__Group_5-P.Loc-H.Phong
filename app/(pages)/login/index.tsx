"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import api from "@/app/service/api";

import { LoginData, LoginErrors, LoginModalProps } from "@/app/type";

import { signIn } from "next-auth/react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{6,}$/;

const LoginModal = ({ onClose, onSwitchRegister, onLoginSuccess }: LoginModalProps) => {
    const [login, setLogin] = useState<LoginData>({ email: "", password: "" });
    const [errors, setErrors] = useState<LoginErrors>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: LoginErrors = {};

        if (!login.email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(login.email)) newErrors.email = "Invalid email format";

        if (!login.password.trim()) newErrors.password = "Password is required";
        else if (!passwordRegex.test(login.password)) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            setErrors({});
            const response = await api.post("auth/signin", login);

            localStorage.setItem("USER_LOGIN", JSON.stringify(response.data));

            window.dispatchEvent(new Event("USER_LOGIN_SUCCESS"));

            onLoginSuccess(response.data);
        } catch (error: any) {
            setErrors({
                form: "Account does not exist or incorrect credentials"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="app-container mx-auto sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg bg-white rounded-2xl p-5 sm:p-6 md:p-8 lg:p-8 xl:p-10 relative shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute right-4 top-4 text-[#272B45] hover:text-[#ED1B24]  transition cursor-pointer">
                <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-[#272B45]">
                Login
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={login.email}
                        onChange={(e) => {
                            setLogin({ ...login, email: e.target.value });
                            setErrors({ ...errors, email: undefined, form: undefined });
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />
                    {errors.email && <p className="mt-1 text-sm text-[#ED1B24] ">{errors.email}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={login.password}
                        onChange={(e) => {
                            setLogin({ ...login, password: e.target.value });
                            setErrors({ ...errors, password: undefined, form: undefined });
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />
                    {errors.password && <p className="mt-1 text-sm text-[#ED1B24] ">{errors.password}</p>}
                </div>

                {errors.form && (
                    <p className="text-sm text-[#ED1B24]  text-center">{errors.form}</p>
                )}

                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#B99333] text-white font-semibold hover:bg-[#a37f2c] transition cursor-pointer disabled:opacity-70">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="flex flex-row gap-3 my-6">
                <button
                    onClick={() => signIn("google")}
                    className="w-full py-3 rounded-xl border border-gray-300 flex items-center justify-center gap-2 bg-white text-[#DB4437] hover:bg-[#DB4437] hover:text-white transition cursor-pointer">
                    <FontAwesomeIcon icon={faGoogle} />
                    Google
                </button>

                <button
                    onClick={() => signIn("facebook")}
                    className="w-full py-3 rounded-xl border border-gray-300 flex items-center justify-center gap-2 bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition cursor-pointer">
                    <FontAwesomeIcon icon={faFacebook} />
                    Facebook
                </button>
            </div>

            <p className="text-center text-sm sm:text-base text-[#272B45]">
                Don't have an account?{" "}
                <span onClick={onSwitchRegister} className="font-semibold cursor-pointer hover:underline text-[#B99333]">
                    Register
                </span>
            </p>
        </section>
    );
};

export default LoginModal;
