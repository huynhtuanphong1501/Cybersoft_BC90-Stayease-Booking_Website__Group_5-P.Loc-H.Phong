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
        <section
            className="app-container mx-auto bg-[#FDF8F3] rounded-2xl p-5 sm:p-7 md:p-8 lg:p-10 relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 text-[#272B45] hover:text-[#ED1B24]  transition cursor-pointer"
            >
                <FontAwesomeIcon icon={faXmark} className="text-lg sm:text-xl" />
            </button>

            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#272B45]">
                Create your account
            </h3>

            {errors.form && (
                <div className="mb-4 rounded-xl border border-[#ED1B24]  bg-[#47242B] p-3 sm:p-4 text-xs sm:text-sm text-[#ED1B24] ">
                    {errors.form}{" "}
                    <span
                        onClick={onSwitchLogin}
                        className="font-semibold underline cursor-pointer"
                    >
                        Log in here
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="md:col-span-1">
                        <input
                            name="name"
                            value={register.name}
                            onChange={handleChange}
                            placeholder="Full name"
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${errors.name ? 'border-[#ED1B24] ' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.name && <p className="text-[10px] sm:text-xs text-[#ED1B24]  mt-1">{errors.name}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <input
                            name="email"
                            value={register.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${errors.email ? 'border-[#ED1B24] ' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.email && <p className="text-[10px] sm:text-xs text-[#ED1B24]  mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <input
                            name="password"
                            type="password"
                            value={register.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${errors.password ? 'border-[#ED1B24] ' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.password && <p className="text-[10px] sm:text-xs text-[#ED1B24]  mt-1">{errors.password}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <input
                            name="phone"
                            value={register.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${errors.phone ? 'border-[#ED1B24] ' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.phone && <p className="text-[10px] sm:text-xs text-[#ED1B24]  mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <input
                            name="birthday"
                            type="date"
                            value={register.birthday}
                            onChange={handleChange}
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${errors.birthday ? 'border-[#ED1B24] ' : 'border-gray-300'} focus:ring-2 focus:ring-[#B99333] outline-none`}
                        />
                        {errors.birthday && <p className="text-[10px] sm:text-xs text-[#ED1B24]  mt-1">{errors.birthday}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <select
                            name="gender"
                            value={register.gender ? "true" : "false"}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#B99333] outline-none cursor-pointer"
                        >
                            <option value="true">Male</option>
                            <option value="false">Female</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 rounded-xl bg-[#B99333] text-white text-sm sm:text-base font-semibold hover:bg-[#a37f2c] transition-all duration-300 cursor-pointer disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Continue"}
                </button>
            </form>

            <p className="text-center text-xs sm:text-sm md:text-base mt-4 text-[#272B45]">
                Already have an account?{" "}
                <span onClick={onSwitchLogin} className="font-semibold cursor-pointer hover:underline text-[#B99333]">
                    Login
                </span>
            </p>
        </section>
    );
};

export default RegisterModal;