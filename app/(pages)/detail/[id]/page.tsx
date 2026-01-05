"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import api from "@/app/service/api";
import { Star, MapPin, ShieldCheck, Award, Lock, Wifi, Tv, Snowflake, Waves, UtensilsCrossed, Car, Shirt } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faCreditCard,
    faHouseCircleCheck,
    faBan,
    faShieldHeart,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { DetailRoomProps, TCity } from "@/app/type";
import Link from "next/link";
import CommentSection from "./comment";

const DetailRoom = ({ params }: DetailRoomProps) => {
    const { id } = React.use(params);
    const [dataRoom, setDataRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dataCity, setDataCity] = useState<TCity[]>([]);
    const [showAuthNotice, setShowAuthNotice] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        const checkUser = () => {
            const currentUser = localStorage.getItem("USER_LOGIN");
            if (currentUser !== user) {
                setUser(currentUser);
            }
        };

        checkUser();
        const interval = setInterval(checkUser, 1000);
        window.addEventListener("storage", checkUser);

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", checkUser);
        };
    }, [user]);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [roomRes, cityRes, commentRes] = await Promise.all([
                    api.get(`phong-thue/${id}`),
                    api.get("vi-tri"),
                    api.get(`binh-luan/lay-binh-luan-theo-phong/${id}`)
                ]);
                setDataRoom(roomRes?.data?.content);
                setDataCity(cityRes?.data?.content || []);
                setCommentCount(commentRes?.data?.content?.length || 0);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleReserveClick = () => {
        setShowAuthNotice(true);
        setTimeout(() => {
            setShowAuthNotice(false);
            window.dispatchEvent(
                new CustomEvent("OPEN_AUTH_MODAL", {
                    detail: { mode: "login" }
                })
            );
        }, 2000);
    };

    const renderReserveButton = () => {
        const commonClass = "w-full py-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:brightness-110 active:scale-95 cursor-pointer";

        if (!user) {
            return (
                <button onClick={handleReserveClick} className={commonClass}>
                    Reserve Now
                </button>
            );
        }

        return (
            <Link href={`/checkout/${id}`} className={commonClass}>
                Reserve Now
            </Link>
        );
    };

    const renderCityName = () => {
        const city = dataCity.find(c => c.id === Number(dataRoom?.maViTri));
        return <span>{city?.tenViTri || "-"}, {city?.tinhThanh || "-"}, {city?.quocGia || "-"}</span>;
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
                <section className="relative group overflow-hidden rounded-xl md:rounded-2xl mb-8 md:mb-12 border border-slate-100 shadow-sm cursor-pointer">
                    <img
                        src={dataRoom.hinhAnh}
                        alt={dataRoom.tenPhong}
                        className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    />
                    <button className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-white border border-slate-900 px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-xs md:text-sm shadow-md transition-all duration-300 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                        Show all photos
                    </button>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-14 xl:gap-24">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="mb-6">
                            <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold mb-3 tracking-tight text-black">
                                {dataRoom.tenPhong}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="fill-[#7D3719] text-[#7D3719]" />
                                    <span className="text-[#7D3719]">4.95 ·</span>
                                    <span className="text-black underline">
                                        {commentCount} reviews
                                    </span>
                                </div>

                                <span className="text-slate-300">|</span>
                                <div className="flex items-center gap-1 underline hover:text-rose-600 cursor-pointer text-black font-bold">
                                    <MapPin size={16} />
                                    {renderCityName()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm sm:text-base text-slate-500 font-medium border-b pb-8">
                            <span>{dataRoom.khach} guests ·</span>
                            <span>{dataRoom.phongNgu} bedrooms ·</span>
                            <span>{dataRoom.giuong} beds ·</span>
                            <span>{dataRoom.phongTam} baths</span>
                        </div>

                        <div className="py-8 border-b space-y-8">
                            <div className="flex gap-4 md:gap-6">
                                <Award className="text-slate-700 mt-1 shrink-0 w-6 h-6 md:w-7 md:h-7" />
                                <div>
                                    <h4 className="font-semibold text-base md:text-lg text-black">Self check-in</h4>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">Check yourself in with the keypad easily.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 md:gap-6">
                                <ShieldCheck className="text-slate-700 mt-1 shrink-0 w-6 h-6 md:w-7 md:h-7" />
                                <div>
                                    <h4 className="font-semibold text-base md:text-lg text-black">Professional Host</h4>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">Hosts are experienced professionals dedicated to your stay.</p>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black">About this place</h3>
                            <p className="text-slate-600 leading-7 text-sm md:text-[17px] whitespace-pre-line">
                                {dataRoom.moTa || "Experience luxury and comfort in this beautifully designed space."}
                            </p>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-black tracking-tight">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12">
                                {amenities.map((a, idx) => (
                                    <div key={idx} className={`flex gap-4 items-center transition-all ${a.ok ? "text-slate-700" : "text-slate-200"}`}>
                                        <span className={a.ok ? "text-black" : "text-slate-200"}>{a.icon}</span>
                                        <span className={`text-sm md:text-[17px] font-medium ${!a.ok && "line-through text-slate-200"}`}>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-black tracking-tight">
                                Booking policies & important information
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-black mb-3">
                                        <FontAwesomeIcon icon={faClock} className="text-slate-600" />
                                        Check-in & Check-out
                                    </h4>
                                    <ul className="list-disc pl-5 text-slate-600 leading-7 text-sm md:text-[17px] space-y-1">
                                        <li>Check in from 18:00</li>
                                        <li>Check out by 10:00</li>
                                        <li>Early check-in or late check-out available on request (fees may apply)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-black mb-3">
                                        <FontAwesomeIcon icon={faCreditCard} className="text-slate-600" />
                                        Payment conditions
                                    </h4>
                                    <ul className="list-disc pl-5 text-slate-600 leading-7 text-sm md:text-[17px] space-y-1">
                                        <li>The down payment to secure this home is 25%</li>
                                        <li>The final balance is due 60 days prior to arrival</li>
                                        <li>Full payment is required for bookings made within 60 days</li>
                                        <li>We accept credit/debit cards, bank transfer, check or cash</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-black mb-3">
                                        <FontAwesomeIcon icon={faHouseCircleCheck} className="text-slate-600" />
                                        House rules
                                    </h4>
                                    <ul className="list-disc pl-5 text-slate-600 leading-7 text-sm md:text-[17px] space-y-1">
                                        <li>No smoking</li>
                                        <li>No parties or events</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-black mb-3">
                                        <FontAwesomeIcon icon={faBan} className="text-slate-600" />
                                        Cancellation policy
                                    </h4>
                                    <ul className="list-disc pl-5 text-slate-600 leading-7 text-sm md:text-[17px] space-y-1">
                                        <li>More than 60 days prior to check-in – deposit forfeited</li>
                                        <li>Less than 60 days prior to check-in – 100% forfeited</li>
                                        <li>With cancellation insurance – up to 100% refunded (contact us for details)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-black mb-3">
                                        <FontAwesomeIcon icon={faShieldHeart} className="text-slate-600" />
                                        Travel insurance
                                    </h4>
                                    <ul className="list-disc pl-5 text-slate-600 leading-7 text-sm md:text-[17px] space-y-1">
                                        <li>Available to purchase at checkout</li>
                                        <li>Cancel for any reason with up to 100% refund</li>
                                        <li>Protection for natural disasters, illness & emergencies</li>
                                        <li>Medical coverage, evacuation & baggage protection included</li>
                                        <li>Coverage applies to all travelers in your group</li>
                                    </ul>
                                </div>

                                <div className="w-full mt-6 px-4 sm:px-6 md:px-8 py-5 sm:py-6 rounded-2xl bg-black">
                                    <h4 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3">
                                        <FontAwesomeIcon icon={faCircleInfo} className="text-white" />
                                        Need more information?
                                    </h4>
                                    <p className="text-slate-200 leading-7 text-sm sm:text-base md:text-[17px]">
                                        Contact us anytime via live chat or telephone. Our Travel Planners will be happy to assist you.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <CommentSection roomId={id} />
                    </div>

                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="hidden lg:block sticky top-28 rounded-3xl border border-slate-200 shadow-xl p-8 bg-white transition-all hover:shadow-2xl">
                            <div className="flex justify-between items-baseline mb-6">
                                <div>
                                    <span className="text-2xl font-extrabold text-slate-900">${dataRoom.giaTien}</span>
                                    <span className="text-slate-500 text-lg font-medium"> / night</span>
                                </div>
                            </div>

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
                                    <div className="text-sm font-bold text-black">1 guest</div>
                                </div>
                            </div>

                            {renderReserveButton()}

                            <div className="space-y-4 mt-4">
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

            <section className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="px-5 py-4 space-y-4">
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
                    <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estimated Total</span>
                        <span className="text-2xl font-black text-slate-900">${totalPrice}</span>
                    </div>
                    {renderReserveButton()}
                </div>
            </section>

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

            <div className="h-80 lg:hidden"></div>
            <HomeFooter />
        </div>
    );
};

export default DetailRoom;