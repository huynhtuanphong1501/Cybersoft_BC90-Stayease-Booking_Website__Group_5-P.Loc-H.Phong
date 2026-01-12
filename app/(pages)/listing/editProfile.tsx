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
        <div className="fixed inset-0 z-1 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">Edit Profile</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.phone || ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Birthday</label>
                                <input
                                    type="date"
                                    className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.birthday ? 'border-red-500' : 'border-transparent'}`}
                                    value={formData.birthday?.split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                />
                                {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Gender</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: true })}
                                    className={`flex-1 py-4 rounded-2xl font-bold transition-all cursor-pointer ${formData.gender ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                > Male </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: false })}
                                    className={`flex-1 py-4 rounded-2xl font-bold transition-all cursor-pointer ${!formData.gender ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                > Female </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full mt-4 bg-gray-900 py-4 rounded-2xl font-bold text-white hover:bg-rose-600 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePopUp;