"use client";

import { useState } from "react";
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

interface RegisterErrors {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    birthday?: string;
    form?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
const phoneRegex = /^[0-9]{9,11}$/;
const nameRegex = /^([^0-9]*)$/;

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

    const [errors, setErrors] = useState<RegisterErrors>({});
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: RegisterErrors = {};

        if (!register.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (!nameRegex.test(register.name)) {
            newErrors.name = "Full name cannot contain numbers";
        }

        if (!register.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(register.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!register.password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(register.password)) {
            newErrors.password = "Password must be at least 6 characters and contain both letters and numbers";
        }

        if (!register.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(register.phone)) {
            newErrors.phone = "Phone number must be 9–11 digits";
        }

        if (!register.birthday) {
            newErrors.birthday = "Birthday is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setRegister((prev) => ({
            ...prev,
            [name]: name === "gender" ? value === "true" : value,
        }));

        if (errors[name as keyof RegisterErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await api.post("users", register);
            onRegisterSuccess();
        } catch (error: any) {
            setErrors({
                form: "An account with this email already exists. Please sign in to continue.",
            });
        } finally {
            setLoading(false);
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
                Create your account
            </h3>

            {errors.form && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600">
                    {errors.form}{" "}
                    <span
                        onClick={onSwitchLogin}
                        className="font-semibold underline cursor-pointer"
                    >
                        Log in here
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                        <input
                            name="name"
                            value={register.name}
                            onChange={handleChange}
                            placeholder="Full name"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <input
                            name="email"
                            value={register.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            value={register.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <input
                            name="phone"
                            value={register.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <input
                            name="birthday"
                            type="date"
                            value={register.birthday}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.birthday ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.birthday && <p className="text-xs text-red-500 mt-1">{errors.birthday}</p>}
                    </div>

                    <select
                        name="gender"
                        value={register.gender ? "true" : "false"}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#B99333] outline-none cursor-pointer"
                    >
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 rounded-xl bg-[#B99333] text-white font-semibold hover:bg-[#a37f2c] transition-all duration-300 cursor-pointer disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Continue"}
                </button>
            </form>

            <p className="text-center text-sm sm:text-base mt-4 text-[#272B45]">
                Already have an account?{" "}
                <span onClick={onSwitchLogin} className="font-semibold cursor-pointer hover:underline text-[#B99333]">
                    Login
                </span>
            </p>
        </div>
    );
};

export default RegisterModal;