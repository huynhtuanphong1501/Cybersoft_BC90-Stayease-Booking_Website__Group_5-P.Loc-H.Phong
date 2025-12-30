"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

interface LoginModalProps {
    onClose: () => void;
    onSwitchRegister: () => void;
}

const LoginModal = ({ onClose, onSwitchRegister }: LoginModalProps) => {
    return (
        <div
            className="w-full max-w-md bg-white rounded-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute right-4 top-4 text-black hover:text-red-600 transition"
            >
                <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center">Login</h3>

            <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#143944]"
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full mb-6 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#143944]"
            />

            <button className="w-full py-3 rounded-xl bg-[#143944] text-white font-semibold hover:bg-black transition">
                Login
            </button>

            <div className="flex gap-4 my-6">
                <button className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                    <FontAwesomeIcon icon={faGoogle} />
                    Google
                </button>

                <button className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                    <FontAwesomeIcon icon={faFacebook} />
                    Facebook
                </button>
            </div>

            <p className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <span
                    onClick={onSwitchRegister}
                    className="font-semibold cursor-pointer hover:underline"
                >
                    Register
                </span>
            </p>
        </div>
    );
};

export default LoginModal;
