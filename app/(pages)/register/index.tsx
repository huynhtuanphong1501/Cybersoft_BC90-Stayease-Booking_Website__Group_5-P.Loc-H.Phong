"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import api from "@/app/service/api";

interface RegisterModalProps {
    onClose: () => void;
    onSwitchLogin: () => void;
    onRegisterSuccess: () => void;
}


interface RegisterForm {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
}

const RegisterModal = ({ onClose, onSwitchLogin, onRegisterSuccess }: RegisterModalProps) => {
    const [register, setRegister] = useState<RegisterForm>({
        id: 0,
        name: "",
        email: "",
        password: "",
        phone: "",
        birthday: "",
        gender: true,
        role: "USER",
    });
    console.log(register);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "gender") {
            setRegister((prev) => ({
                ...prev,
                gender: value === "true",
            }));
            return;
        }

        setRegister((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("users", register);
            onRegisterSuccess();
        } catch (error) {
            console.error("Register failed", error);
        }
    };

    return (
        <div
            className="w-full lg:w-[80%] xl:w-[70%] bg-[#FDF8F3] rounded-2xl p-6 sm:p-8 md:p-10 relative shadow-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute right-4 top-4 text-[#272B45] hover:text-red-600 transition cursor-pointer"
            >
                <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-[#272B45]">
                Register
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <input
                        name="name"
                        value={register.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />

                    <input
                        name="email"
                        type="email"
                        value={register.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />

                    <input
                        name="password"
                        type="password"
                        value={register.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />

                    <input
                        name="phone"
                        value={register.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />

                    <input
                        name="birthday"
                        type="date"
                        value={register.birthday}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    />

                    <select
                        name="gender"
                        value={register.gender ? "true" : "false"}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B99333] text-[#272B45]"
                    >
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 py-3 rounded-xl bg-[#B99333] text-white font-semibold hover:bg-[#a37f2c] transition cursor-pointer disabled:opacity-60"
                >
                    Register
                </button>
            </form>

            <p className="text-center text-sm mt-4 text-[#272B45]">
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
