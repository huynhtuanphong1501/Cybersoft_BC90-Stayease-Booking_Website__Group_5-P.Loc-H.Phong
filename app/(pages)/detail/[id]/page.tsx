"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import api from "@/app/service/api";
import { Star, MapPin, Share, Heart, ShieldCheck, Award, Info, ChevronRight, Lock, Wifi, Tv, Snowflake, Waves, UtensilsCrossed, Car, Shirt, Calendar, Users } from 'lucide-react';
import { DetailRoomProps, TCity } from "@/app/type";

const DetailRoom = ({ params }: DetailRoomProps) => {
    const { id } = React.use(params);
    const [dataRoom, setDataRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dataCity, setDataCity] = useState<TCity[]>([]);
    const [showAuthNotice, setShowAuthNotice] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [roomRes, cityRes] = await Promise.all([
                    api.get(`phong-thue/${id}`),
                    api.get("vi-tri"),
                ]);
                setDataRoom(roomRes?.data?.content);
                setDataCity(cityRes?.data?.content || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const renderCityName = () => {
        const city = dataCity.find(c => c.id === Number(dataRoom?.maViTri));
        return <span>{city?.tenViTri || "-"}, {city?.tinhThanh || "-"}, {city?.quocGia || "-"}</span>;
    };

    const handleReserve = () => {
        const user = localStorage.getItem("USER_LOGIN");
        if (!user) {
            setShowAuthNotice(true);
            setTimeout(() => {
                setShowAuthNotice(false);
                window.dispatchEvent(new CustomEvent("OPEN_AUTH_MODAL", { detail: { mode: "register" } }));
            }, 3000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin"></div>
        </div>
    );

    if (!dataRoom) return null;

    const amenities = [
        { label: "Wi-Fi", icon: <Wifi size={24} />, ok: dataRoom.wifi },
        { label: "TV", icon: <Tv size={24} />, ok: dataRoom.tivi },
        { label: "Air conditioning", icon: <Snowflake size={24} />, ok: dataRoom.dieuHoa },
        { label: "Pool", icon: <Waves size={24} />, ok: dataRoom.hoBoi },
        { label: "Kitchen", icon: <UtensilsCrossed size={24} />, ok: dataRoom.bep },
        { label: "Parking", icon: <Car size={24} />, ok: dataRoom.doXe },
        { label: "Iron", icon: <Shirt size={24} />, ok: dataRoom.banLa },
    ];

    const totalPrice = dataRoom.giaTien * 5 + 20;

    return (
        <div className="bg-white min-h-screen">
            <HomeHeader />

            <main className="app-container mx-auto py-6 md:py-10 text-slate-900">
                {/* 1. Ảnh phòng */}
                <section className="relative group overflow-hidden rounded-xl md:rounded-2xl mb-8 md:mb-12 border border-slate-100 shadow-sm cursor-pointer">
                    <img
                        src={dataRoom.hinhAnh}
                        alt={dataRoom.tenPhong}
                        className="w-full h-64 sm:h-80 md:h-12500px] object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    />
                    <button className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-white border border-slate-900 px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-xs md:text-sm shadow-md transition-all duration-300 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                        Show all photos
                    </button>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-14 xl:gap-24">
                    {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <section className="mb-6">
                            <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold mb-3 tracking-tight text-slate-800">
                                {dataRoom.tenPhong}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
                                <div className="flex items-center gap-1 text-slate-800 hover:text-rose-600 transition-colors">
                                    <Star size={16} className="fill-rose-500 text-rose-500" />
                                    <span>4.95 ·</span>
                                    <span className="underline">84 reviews</span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <div className="flex items-center gap-1 underline hover:text-rose-600 cursor-pointer text-slate-800 font-bold">
                                    <MapPin size={16} />
                                    {renderCityName()}
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm sm:text-base text-slate-500 font-medium border-b pb-8">
                            <span>{dataRoom.khach} guests ·</span>
                            <span>{dataRoom.phongNgu} bedrooms ·</span>
                            <span>{dataRoom.giuong} beds ·</span>
                            <span>{dataRoom.phongTam} baths</span>
                        </div>

                        {/* Tiện ích đặc biệt */}
                        <div className="py-8 border-b space-y-8">
                            <div className="flex gap-4 md:gap-6">
                                <Award className="text-slate-700 mt-1 shrink-0 w-6 h-6 md:w-7 md:h-7" />
                                <div>
                                    <h4 className="font-semibold text-base md:text-lg text-slate-800">Self check-in</h4>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">Check yourself in with the keypad easily.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 md:gap-6">
                                <ShieldCheck className="text-slate-700 mt-1 shrink-0 w-6 h-6 md:w-7 md:h-7" />
                                <div>
                                    <h4 className="font-semibold text-base md:text-lg text-slate-800">Professional Host</h4>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">Hosts are experienced professionals dedicated to your stay.</p>
                                </div>
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="py-8 border-b">
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-slate-800">About this place</h3>
                            <p className="text-slate-600 leading-7 text-sm md:text-[17px] whitespace-pre-line">
                                {dataRoom.moTa || "Experience luxury and comfort in this beautifully designed space."}
                            </p>
                        </div>

                        {/* Danh sách tiện nghi */}
                        <div className="py-8 border-b">
                            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-slate-800 tracking-tight">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12">
                                {amenities.map((a, idx) => (
                                    <div key={idx} className={`flex gap-4 items-center transition-all ${a.ok ? "text-slate-700" : "text-slate-200"}`}>
                                        <span className={a.ok ? "text-slate-800" : "text-slate-200"}>{a.icon}</span>
                                        <span className={`text-sm md:text-[17px] font-medium ${!a.ok && "line-through text-slate-200"}`}>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ĐÂY NÈ: PHẦN TÍNH TOÁN CHI TIẾT TRÊN TRANG (Dành cho Mobile khi cuộn xuống) */}
                        <div className="lg:hidden py-10">
                            <h3 className="text-xl font-bold mb-6 text-slate-800">Price details</h3>
                            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between text-slate-600 font-medium text-base">
                                    <span className="underline">${dataRoom.giaTien} x 5 nights</span>
                                    <span>${dataRoom.giaTien * 5}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-medium text-base">
                                    <span className="underline">Cleaning fee</span>
                                    <span>$20</span>
                                </div>
                                <hr className="border-slate-200" />
                                <div className="flex justify-between font-bold text-xl text-slate-900 pt-2">
                                    <span>Total (USD)</span>
                                    <span className="text-rose-600">${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: SIDEBAR (Sticky cho Desktop) */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="hidden lg:block sticky top-28 rounded-3xl border border-slate-200 shadow-xl p-8 bg-white transition-all hover:shadow-2xl">
                            <div className="flex justify-between items-baseline mb-6">
                                <div>
                                    <span className="text-2xl font-extrabold text-slate-900">${dataRoom.giaTien}</span>
                                    <span className="text-slate-500 text-lg font-medium"> / night</span>
                                </div>
                            </div>

                            {/* Inputs Group */}
                            <div className="border border-slate-400 rounded-xl mb-4 overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                                <div className="grid grid-cols-2 border-b border-slate-400">
                                    <div className="p-3 border-r border-slate-400 hover:bg-slate-50 cursor-pointer">
                                        <label className="block text-[10px] font-extrabold uppercase text-slate-900">Check-in</label>
                                        <input type="text" placeholder="Add date" className="text-sm w-full outline-none bg-transparent cursor-pointer font-medium" readOnly />
                                    </div>
                                    <div className="p-3 hover:bg-slate-50 cursor-pointer">
                                        <label className="block text-[10px] font-extrabold uppercase text-slate-900">Checkout</label>
                                        <input type="text" placeholder="Add date" className="text-sm w-full outline-none bg-transparent cursor-pointer font-medium" readOnly />
                                    </div>
                                </div>
                                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-900">Guests</label>
                                    <div className="text-sm font-bold text-slate-800">1 guest</div>
                                </div>
                            </div>

                            <button onClick={handleReserve} className="w-full py-4 rounded-xl bg-linear-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-all cursor-pointer mb-4">
                                Reserve
                            </button>

                            {/* Bảng tính toán (Desktop Sidebar) */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span className="underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-slate-900">${dataRoom.giaTien} x 5 nights</span>
                                    <span>${dataRoom.giaTien * 5}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span className="underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-slate-900">Cleaning fee</span>
                                    <span>$20</span>
                                </div>
                                <hr className="border-slate-100" />
                                <div className="flex justify-between font-bold text-xl text-slate-900 pt-2">
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* MOBILE FIXED RESERVE BAR - ĐÚNG 3 HÀNG NHƯ YÊU CẦU */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="px-5 py-4 space-y-4">
                    {/* Hàng 1: Check-in, Checkout, Guests (Xếp dọc trên mobile hẹp, ngang trên mobile rộng) */}
                    <div className="flex flex-col sm:flex-row border border-slate-400 rounded-xl overflow-hidden">
                        <div className="flex flex-1 border-b sm:border-b-0 sm:border-r border-slate-400">
                            <div className="flex-1 p-2.5 border-r border-slate-400 bg-slate-50">
                                <label className="block text-[8px] font-black uppercase text-slate-500 mb-0.5">Check-in</label>
                                <div className="text-[11px] font-bold text-slate-900">Add date</div>
                            </div>
                            <div className="flex-1 p-2.5 bg-slate-50">
                                <label className="block text-[8px] font-black uppercase text-slate-500 mb-0.5">Checkout</label>
                                <div className="text-[11px] font-bold text-slate-900">Add date</div>
                            </div>
                        </div>
                        <div className="flex-1 p-2.5 bg-white">
                            <label className="block text-[8px] font-black uppercase text-slate-500 mb-0.5">Guests</label>
                            <div className="text-[11px] font-bold text-slate-900">1 guest</div>
                        </div>
                    </div>

                    {/* Hàng 2: Giá tổng (Riêng 1 hàng) */}
                    <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estimated Total</span>
                        <span className="text-2xl font-black text-slate-900">${totalPrice}</span>
                    </div>

                    {/* Hàng 3: Nút Reserve (Riêng 1 hàng) */}
                    <button
                        onClick={handleReserve}
                        className="w-full py-4 rounded-xl bg-linear-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-bold text-lg shadow-xl active:scale-95 transition-all cursor-pointer"
                    >
                        Reserve Now
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showAuthNotice && (
                    <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-6 left-1/2 z-50 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 border border-slate-100 w-[90%] sm:w-auto">
                        <div className="bg-rose-100 p-2 rounded-full shrink-0"><Lock className="text-rose-600" size={20} /></div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Sign in required</p>
                            <p className="text-xs text-slate-500">Please sign in to reserve this room</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer cuối trang cho Mobile */}
            <div className="h-80 lg:hidden"></div>
            <HomeFooter />
        </div>
    );
};

export default DetailRoom;