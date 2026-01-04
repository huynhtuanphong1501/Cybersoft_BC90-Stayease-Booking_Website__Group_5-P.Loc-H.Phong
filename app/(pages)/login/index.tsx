"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import api from "@/app/service/api";

interface LoginModalProps {
    onClose: () => void;
    onSwitchRegister: () => void;
    onLoginSuccess: (userData: any) => void;
}

interface LoginData {
    email: string;
    password: string;
}

const LoginModal = ({ onClose, onSwitchRegister, onLoginSuccess }: LoginModalProps) => {
    const [login, setLogin] = useState<LoginData>({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("auth/signin", {
                email: login.email,
                password: login.password
            });
            onLoginSuccess(response.data);
        } catch (error) {
            alert("Login failed! Please check your credentials.");
        }
    };

    return (
        <div
            className="w-full max-w-[92%] sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg bg-[#FDF8F3] rounded-2xl 
            p-5 sm:p-6 md:p-8 lg:p-8 xl:p-10 relative shadow-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute right-4 top-4 text-[#272B45] hover:text-red-600 transition cursor-pointer"
            >
                <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-[#272B45]">
                Login
            </h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={login.email}
                    onChange={(e) => setLogin({ ...login, email: e.target.value })}
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                    className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                />

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#B99333] text-white font-semibold 
                    hover:bg-[#a37f2c] transition cursor-pointer"
                >
                    Login
                </button>
            </form>

            <div className="flex flex-col md:flex-col lg:flex-row gap-3 my-6">
                <button
                    className="w-full py-3 rounded-xl border border-gray-300 flex items-center justify-center gap-2 
                    bg-white text-[#DB4437] hover:bg-[#DB4437] hover:text-white transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faGoogle} />
                    Google
                </button>

                <button
                    className="w-full py-3 rounded-xl border border-gray-300 flex items-center justify-center gap-2 
                    bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faFacebook} />
                    Facebook
                </button>
            </div>

            <p className="text-center text-sm sm:text-base text-[#272B45]">
                Don't have an account?{" "}
                <span
                    onClick={onSwitchRegister}
                    className="font-semibold cursor-pointer hover:underline text-[#B99333]"
                >
                    Register
                </span>
            </p>
        </div>
    );
};

export default LoginModal;
