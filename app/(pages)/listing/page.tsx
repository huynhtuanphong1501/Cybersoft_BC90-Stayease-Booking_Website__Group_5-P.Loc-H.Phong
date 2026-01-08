"use client";

import BackToTopButton from "@/app/components/BackToTop";
import HomeFooter from "@/app/components/HomeFooter";
import HomeHeader from "@/app/components/HomeHeader";
import api from "@/app/service/api";
import { TBooking, TUser } from "@/app/type";
import React, { useEffect, useState, useCallback } from "react";

const Listing = () => {
    const [user, setUser] = useState<TUser | null>(null);
    const [bookings, setBookings] = useState<TBooking[]>([]);
    const [loading, setLoading] = useState(true);

    const calculateTotal = (checkIn: string, checkOut: string, price: number, guests: number) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

        let finalPrice = price;
        if (guests > 4) {
            finalPrice = price + price * 0.1 * (guests - 4);
        }

        return { days, total: (days * finalPrice).toLocaleString() };
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const raw = localStorage.getItem("USER_LOGIN");
            if (!raw) {
                setUser(null);
                setBookings([]);
                return;
            }

            const parsed = JSON.parse(raw);
            const currentUser = parsed?.content?.user;
            if (!currentUser?.id) return;

            setUser(currentUser);

            const res = await api.get(`dat-phong/lay-theo-nguoi-dung/${currentUser.id}`);
            const list: TBooking[] = res.data.content || [];

            const enriched = await Promise.all(
                list.map(async (b) => {
                    try {
                        const r = await api.get(`phong-thue/${b.maPhong}`);
                        return { ...b, roomDetails: r.data.content };
                    } catch {
                        return b;
                    }
                })
            );

            setBookings(enriched);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        window.addEventListener("LOGIN_SUCCESS", fetchData);
        return () => window.removeEventListener("LOGIN_SUCCESS", fetchData);
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-rose-500 rounded-full animate-spin border-t-transparent" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-white min-h-screen">
                <HomeHeader />

                <main className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <i className="fa-solid fa-user-lock text-3xl text-gray-400"></i>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                        Login to see your bookings
                    </h2>
                    <p className="text-gray-500 max-w-md mb-8">
                        Manage your trips and booking history after logging in.
                    </p>
                    <button
                        onClick={() =>
                            window.dispatchEvent(
                                new CustomEvent("OPEN_AUTH_MODAL", { detail: { mode: "login" } })
                            )
                        }
                        className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all duration-300 cursor-pointer active:scale-95 shadow-lg"
                    >
                        Login Now
                    </button>
                </main>

                <HomeFooter />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <HomeHeader />

            <main className="app-container mx-auto py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">

                    <aside className="w-full lg:w-[320px] xl:w-95 shrink-0">
                        <div className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border lg:sticky lg:top-28">
                            <div className="flex items-center lg:flex-col gap-5 text-center">
                                <img
                                    src=""
                                    alt={user.name}
                                    className="w-24 h-24 xl:w-32 xl:h-32 rounded-full object-cover shadow-lg ring-4 ring-rose-50 cursor-pointer transition-all duration-300 hover:scale-105"
                                />
                                <h2 className="text-2xl font-black truncate">{user.name}</h2>
                            </div>

                            <div className="mt-8 space-y-3 border-t pt-8">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] uppercase font-black text-gray-400">Email</p>
                                    <p className="text-sm font-bold truncate">{user.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] uppercase font-black text-gray-400">Phone</p>
                                    <p className="text-sm font-bold">{user.phone || "Not provided"}</p>
                                </div>
                            </div>

                            <button className="w-full mt-8 bg-gray-900 py-4 rounded-2xl font-bold text-white hover:bg-rose-500 transition-all duration-300 cursor-pointer active:scale-95">
                                Edit Profile
                            </button>
                        </div>
                    </aside>

                    <section className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl xl:text-5xl font-black">
                                Booking History
                            </h1>
                            <p className="text-gray-500 mt-2">
                                You have {bookings.length} trips scheduled
                            </p>
                        </div>

                        <div className="grid gap-6 md:gap-8">
                            {bookings.map((item) => {
                                const { days, total } = calculateTotal(
                                    item.ngayDen,
                                    item.ngayDi,
                                    item.roomDetails?.giaTien || 0,
                                    item.soLuongKhach
                                );

                                return (
                                    <div
                                        key={item.id}
                                        className="group bg-white rounded-4xl border overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="relative w-full md:w-65 xl:w-85 h-56 md:h-auto overflow-hidden">
                                            {item.roomDetails?.hinhAnh ? (
                                                <img
                                                    src={item.roomDetails.hinhAnh}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <i className="fa-solid fa-hotel text-4xl text-gray-300"></i>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                                            <h3 className="text-xl md:text-2xl font-black group-hover:text-rose-500 transition-colors duration-300">
                                                {item.roomDetails?.tenPhong || `Room ${item.maPhong}`}
                                            </h3>

                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300">
                                                    <i className="fa-solid fa-right-to-bracket text-rose-500"></i>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400">Check-in</p>
                                                        <p className="font-bold text-sm">
                                                            {new Date(item.ngayDen).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300">
                                                    <i className="fa-solid fa-right-from-bracket text-blue-500"></i>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400">Check-out</p>
                                                        <p className="font-bold text-sm">
                                                            {new Date(item.ngayDi).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <span className="bg-gray-50 px-4 py-2 rounded-full text-xs font-bold">
                                                    {days} Nights
                                                </span>
                                                <span className="bg-gray-50 px-4 py-2 rounded-full text-xs font-bold">
                                                    {item.soLuongKhach} Guests
                                                </span>
                                            </div>

                                            <div className="mt-auto pt-6 border-t flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-gray-400">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-3xl font-black text-rose-500">
                                                        ${total}
                                                    </p>
                                                </div>
                                                <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-rose-500 transition-all duration-300 cursor-pointer active:scale-95">
                                                    View Receipt
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </main>

            <BackToTopButton />
            <HomeFooter />
        </div>
    );
};

export default Listing;
