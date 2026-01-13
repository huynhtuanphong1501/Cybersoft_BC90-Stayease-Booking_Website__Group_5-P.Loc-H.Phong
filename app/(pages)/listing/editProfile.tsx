"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/service/api";
import { TUser } from "@/app/type";

interface Props {
    userId: number;
    onClose: () => void;
    onUpdateSuccess: () => void;
}

const EditProfilePopUp = ({ userId, onClose, onUpdateSuccess }: Props) => {
    const [formData, setFormData] = useState<Partial<TUser>>({
        name: "",
        email: "",
        phone: "",
        birthday: "",
        gender: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`users/${userId}`);
                setFormData(res.data.content);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const validate = () => {
        let newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,11}$/;

        if (!formData.name?.trim()) newErrors.name = "Name is required";
        if (!emailRegex.test(formData.email || "")) newErrors.email = "Invalid email format";
        if (!phoneRegex.test(formData.phone || "")) newErrors.phone = "Phone must be 10-11 digits";
        if (!formData.birthday) newErrors.birthday = "Birthday is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await api.put(`users/${userId}`, formData);

            const res = await api.get(`users/${userId}`);
            const newUser = res.data.content;

            const raw = localStorage.getItem("USER_LOGIN");
            if (raw) {
                const parsed = JSON.parse(raw);
                parsed.content.user = newUser;
                localStorage.setItem("USER_LOGIN", JSON.stringify(parsed));
            }

            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-[98%] sm:max-w-120 md:max-w-150 lg:max-w-2xl xl:max-w-3xl rounded-2xl sm:rounded-4xladow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-300">

                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 sm:right-5 sm:top-5 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full cursor-pointer transition-all z-20 active:scale-90"
                >
                    <i className="fa-solid fa-xmark text-lg sm:text-xl"></i>
                </button>

                <div className="p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-900">Edit Profile</h2>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase mt-0.5">Update your personal information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className={`w-full p-2.5 sm:p-3 md:p-4 bg-gray-50 border text-sm rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className={`w-full p-2.5 sm:p-3 md:p-4 bg-gray-50 border text-sm rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Phone Number</label>
                                <input
                                    type="text"
                                    className={`w-full p-2.5 sm:p-3 md:p-4 bg-gray-50 border text-sm rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.phone || ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Birthday</label>
                                <input
                                    type="date"
                                    className={`w-full p-2.5 sm:p-3 md:p-4 bg-gray-50 border text-sm rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.birthday ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.birthday?.split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                />
                                {errors.birthday && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.birthday}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Gender</label>
                            <div className="flex gap-2 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: true })}
                                    className={`flex-1 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all cursor-pointer active:scale-95 ${formData.gender ? 'bg-rose-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
                                > Male </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: false })}
                                    className={`flex-1 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all cursor-pointer active:scale-95 ${!formData.gender ? 'bg-rose-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
                                > Female </button>
                            </div>
                        </div>

                        <div className="pt-2 sm:pt-4">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gray-900 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-white text-sm md:text-base hover:bg-rose-600 transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePopUp;