"use client";

import BackToTopButton from "@/app/components/BackToTop";
import HomeFooter from "@/app/components/HomeFooter";
import HomeHeader from "@/app/components/HomeHeader";
import api from "@/app/service/api";
import React, { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    birthday?: string;
};

const Listing = () => {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const raw = localStorage.getItem("USER_LOGIN");
                if (!raw) {
                    setLoading(false);
                    return;
                }

                const parsed = JSON.parse(raw);
                const currentUser: User | undefined = parsed?.content?.user;

                if (!currentUser?.id) {
                    setLoading(false);
                    return;
                }

                setUser(currentUser);

                const res = await api.get(
                    `dat-phong/lay-theo-nguoi-dung/${currentUser.id}`
                );

                setBookings(res.data.content || []);
            } catch (error) {
                console.error("Fetch booking history failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-rose-500 rounded-full animate-spin border-t-transparent" />
                </div>
            </div>
        );
    }

    /* ---------- Chưa login ---------- */
    if (!user) {
        return (
            <div className="bg-white min-h-screen">
                <HomeHeader />
                <main className="flex flex-col items-center justify-center py-32 text-center">
                    <h2 className="text-2xl font-bold mb-2">Please login</h2>
                    <p className="text-gray-500 mb-6">
                        You need an account to view booking history.
                    </p>
                    <button
                        onClick={() =>
                            window.dispatchEvent(
                                new CustomEvent("OPEN_AUTH_MODAL", {
                                    detail: { mode: "login" },
                                })
                            )
                        }
                        className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-rose-600 transition cursor-pointer active:scale-95"
                    >
                        Login now
                    </button>
                </main>
                <HomeFooter />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <HomeHeader />

            <main className="app-container mx-auto py-6 md:py-10 text-black px-4">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* ---------- Profile ---------- */}
                    <aside className="w-full lg:w-1/3">
                        <div className="border border-gray-200 rounded-3xl p-8 shadow-lg sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-28 h-28 bg-linear-to-tr from-rose-500 to-pink-400 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mb-4 shadow-inner cursor-pointer">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-gray-500 text-sm mb-6">
                                    Verified Member
                                </p>
                            </div>

                            <div className="space-y-5 border-t pt-6">
                                <div className="flex justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                                    <span className="text-gray-600">Email</span>
                                    <span className="truncate max-w-37.5">
                                        {user.email}
                                    </span>
                                </div>
                                <div className="flex justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                                    <span className="text-gray-600">Phone</span>
                                    <span>{user.phone || "-"}</span>
                                </div>
                                <div className="flex justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                                    <span className="text-gray-600">Birthday</span>
                                    <span>
                                        {user.birthday
                                            ? new Date(user.birthday).toLocaleDateString(
                                                "en-US"
                                            )
                                            : "-"}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full mt-8 border-2 border-black py-3 rounded-xl font-bold hover:bg-black hover:text-white transition cursor-pointer active:scale-95">
                                Edit Profile
                            </button>
                        </div>
                    </aside>

                    {/* ---------- Booking history ---------- */}
                    <section className="w-full lg:w-2/3">
                        <h1 className="text-3xl font-extrabold mb-8">
                            Booking History
                        </h1>

                        {bookings.length > 0 ? (
                            <div className="grid gap-6">
                                {bookings.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
                                    >
                                        <div className="sm:w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-300 cursor-pointer">
                                            <i className="fa-solid fa-house-chimney text-5xl" />
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="text-xl font-bold">
                                                        Room #{item.maPhong}
                                                    </h3>
                                                    <span className="text-xs text-gray-400">
                                                        Ref: {item.id}
                                                    </span>
                                                </div>

                                                <div className="flex gap-6 mt-4">
                                                    <div className="bg-gray-50 p-2 rounded-lg text-center min-w-25 cursor-pointer">
                                                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                                                            Check-in
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {new Date(
                                                                item.ngayDen
                                                            ).toLocaleDateString(
                                                                "en-US"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-50 p-2 rounded-lg text-center min-w-25 cursor-pointer">
                                                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                                                            Check-out
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {new Date(
                                                                item.ngayDi
                                                            ).toLocaleDateString(
                                                                "en-US"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    {item.soLuongKhach} Guests
                                                </span>
                                                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-rose-600 transition cursor-pointer active:scale-95">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-3xl py-20 text-center border-2 border-dashed">
                                <p className="text-gray-500 font-medium">
                                    No trips booked yet.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <BackToTopButton />
            <HomeFooter />
        </div>
    );
};

export default Listing;
