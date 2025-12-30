"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface RegisterModalProps {
    onClose: () => void;
    onSwitchLogin: () => void;
}

const RegisterModal = ({ onClose, onSwitchLogin }: RegisterModalProps) => {
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

            <h3 className="text-2xl font-bold mb-6 text-center">Register</h3>

            <input
                placeholder="Name"
                className="w-full mb-3 px-4 py-3 rounded-xl border"
            />

            <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 px-4 py-3 rounded-xl border"
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full mb-3 px-4 py-3 rounded-xl border"
            />

            <input
                placeholder="Phone"
                className="w-full mb-3 px-4 py-3 rounded-xl border"
            />

            <input
                type="date"
                className="w-full mb-3 px-4 py-3 rounded-xl border"
            />

            <select className="w-full mb-6 px-4 py-3 rounded-xl border">
                <option value="">Gender</option>
                <option value="true">Male</option>
                <option value="false">Female</option>
            </select>

            <button className="w-full py-3 rounded-xl bg-[#143944] text-white font-semibold hover:bg-black transition">
                Register
            </button>

            <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <span
                    onClick={onSwitchLogin}
                    className="font-semibold cursor-pointer hover:underline"
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export default RegisterModal;
