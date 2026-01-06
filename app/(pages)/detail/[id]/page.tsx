"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import api from "@/app/service/api";
import {
    Star, MapPin, ShieldCheck, Award, Lock, Wifi, Tv, Snowflake,
    Waves, UtensilsCrossed, Car, Shirt, CheckCircle2
} from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faCreditCard,
    faHouseCircleCheck,
    faBan,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { DetailRoomProps, TCity } from "@/app/type";
import { useRouter } from "next/navigation";
import CommentSection from "./comment";
import BackToTopButton from "@/app/components/BackToTop";

const DetailRoom = ({ params }: DetailRoomProps) => {
    const { id } = React.use(params);
    const router = useRouter();

    const [dataRoom, setDataRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dataCity, setDataCity] = useState<TCity[]>([]);
    const [showAuthNotice, setShowAuthNotice] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [commentCount, setCommentCount] = useState(0);

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

    const handleBooking = async () => {
        if (!user) {
            handleReserveClick();
            return;
        }

        if (!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates!");
            return;
        }

        const loginData = JSON.parse(user);

        const userId = loginData?.content?.user?.id;

        if (!userId) {
            alert("User info is invalid. Please login again.");
            return;
        }

        const payload = {
            id: 0,
            maPhong: Number(id),
            ngayDen: new Date(checkIn).toISOString(),
            ngayDi: new Date(checkOut).toISOString(),
            soLuongKhach: guests,
            maNguoiDung: userId
        };

        try {
            await api.post("dat-phong", payload);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                router.push("/");
            }, 3000);
        } catch (error) {
            alert("Booking failed. Please try again.");
        }
    };


    const handleReserveClick = () => {
        setShowAuthNotice(true);
        setTimeout(() => {
            setShowAuthNotice(false);
            window.dispatchEvent(new CustomEvent("OPEN_AUTH_MODAL", { detail: { mode: "login" } }));
        }, 2000);
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

            <main className="app-container mx-auto py-6 md:py-10 text-black">
                <section className="relative group overflow-hidden rounded-xl md:rounded-2xl mb-8 md:mb-12 border border-slate-100 shadow-sm">
                    <img src={dataRoom.hinhAnh} alt={dataRoom.tenPhong} className="w-full h-62.5 sm:h-100 md:h-125 object-cover" />
                    <button className="absolute bottom-4 right-4 bg-white border border-slate-900 px-4 py-2 rounded-lg font-bold text-xs shadow-md">Show all photos</button>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-14">
                    <div className="lg:col-span-2 order-1">
                        <div className="mb-6">
                            <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold mb-3 text-black">{dataRoom.tenPhong}</h1>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="fill-[#7D3719] text-[#7D3719]" />
                                    <span className="text-[#7D3719]">4.95 ·</span>
                                    <span className="text-black underline">{commentCount} reviews</span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <div className="flex items-center gap-1 underline text-black font-bold"><MapPin size={16} />{renderCityName()}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm sm:text-base text-slate-500 font-medium border-b pb-8">
                            <span>{dataRoom.khach} guests ·</span>
                            <span>{dataRoom.phongNgu} bedrooms ·</span>
                            <span>{dataRoom.giuong} beds ·</span>
                            <span>{dataRoom.phongTam} baths</span>
                        </div>

                        <div className="lg:hidden mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-baseline mb-4">
                                <h3 className="text-lg font-bold">Price details</h3>
                                <div>
                                    <span className="text-lg font-bold">${dataRoom.giaTien}</span>
                                    <span className="text-sm text-slate-500"> / night</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span className="underline">${dataRoom.giaTien} x 5 nights</span>
                                    <span>${dataRoom.giaTien * 5}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span className="underline">Cleaning fee</span>
                                    <span>$20</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-black border-t border-slate-300 pt-3">
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 border-b space-y-8">
                            <div className="flex gap-4">
                                <Award className="text-slate-700 mt-1 shrink-0 w-6 h-6" />
                                <div><h4 className="font-semibold text-black">Self check-in</h4><p className="text-sm text-slate-500">Check yourself in with the keypad easily.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <ShieldCheck className="text-slate-700 mt-1 shrink-0 w-6 h-6" />
                                <div><h4 className="font-semibold text-black">Professional Host</h4><p className="text-sm text-slate-500">Experienced hosts for a worry-free stay.</p></div>
                            </div>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl font-semibold mb-4 text-black">About this place</h3>
                            <p className="text-slate-600 leading-7 text-sm md:text-base whitespace-pre-line">{dataRoom.moTa}</p>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl font-semibold mb-6 text-black">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                                {amenities.map((a, idx) => (
                                    <div key={idx} className={`flex gap-4 items-center ${a.ok ? "text-slate-700" : "text-slate-200"}`}>
                                        <span>{a.icon}</span>
                                        <span className={`text-sm font-medium ${!a.ok && "line-through"}`}>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl font-semibold mb-6 text-black">Booking policies</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-black mb-2"><FontAwesomeIcon icon={faClock} /> Check-in & Check-out</h4>
                                    <ul className="list-disc pl-5 text-slate-600 text-sm space-y-1">
                                        <li>Check in from 18:00, Check out by 10:00</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-black mb-2"><FontAwesomeIcon icon={faCreditCard} /> Payment</h4>
                                    <ul className="list-disc pl-5 text-slate-600 text-sm space-y-1">
                                        <li>25% down payment, balance due 60 days before arrival</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-black mb-2"><FontAwesomeIcon icon={faHouseCircleCheck} /> Rules</h4>
                                    <ul className="list-disc pl-5 text-slate-600 text-sm space-y-1">
                                        <li>Non-smoking, no pets, no parties</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-black mb-2"><FontAwesomeIcon icon={faBan} /> Cancellation</h4>
                                    <ul className="list-disc pl-5 text-slate-600 text-sm space-y-1">
                                        <li>100% refund up to 30 days before arrival</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 flex items-start gap-4 p-6 rounded-2xl bg-black text-white">
                                <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
                                <div><h4 className="font-semibold mb-1">Stay with confidence</h4><p className="text-slate-300 text-xs leading-relaxed">We provide 24/7 support for any issues during your check-in or stay.</p></div>
                            </div>
                        </div>

                        <CommentSection roomId={id} />
                    </div>

                    <div className="lg:col-span-1 order-2">
                        <div className="hidden lg:block sticky top-28 rounded-3xl border border-slate-200 shadow-xl p-8 bg-white">
                            <div className="flex justify-between items-baseline mb-6">
                                <div><span className="text-2xl font-extrabold text-black">${dataRoom.giaTien}</span><span className="text-slate-500 text-lg font-medium"> / night</span></div>
                            </div>
                            <div className="border border-slate-400 rounded-xl mb-4 overflow-hidden">
                                <div className="grid grid-cols-2 border-b border-slate-400">
                                    <div className="p-3 border-r border-slate-400">
                                        <label className="block text-[10px] font-extrabold uppercase">Check-in</label>
                                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="text-sm w-full outline-none" />
                                    </div>
                                    <div className="p-3">
                                        <label className="block text-[10px] font-extrabold uppercase">Checkout</label>
                                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="text-sm w-full outline-none" />
                                    </div>
                                </div>
                                <div className="p-3 flex justify-between items-center">
                                    <label className="block text-[10px] font-extrabold uppercase">Guests</label>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-slate-300 font-bold">-</button>
                                        <span className="font-bold text-sm">{guests}</span>
                                        <button onClick={() => setGuests(guests + 1)} className="w-7 h-7 rounded-full border border-slate-300 font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleBooking} className="w-full py-4 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 text-white font-bold text-lg shadow-xl mb-4">Reserve Now</button>
                            <div className="space-y-4">
                                <div className="flex justify-between text-slate-600"><span className="underline">${dataRoom.giaTien} x 5 nights</span><span>${dataRoom.giaTien * 5}</span></div>
                                <div className="flex justify-between text-slate-600"><span className="underline">Cleaning fee</span><span>$20</span></div>
                                <div className="flex justify-between font-bold text-xl text-black border-t pt-2"><span>Total</span><span>${totalPrice}</span></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <BackToTopButton />

            <HomeFooter />

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                <div className="max-w-4xl mx-auto flex flex-col gap-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="border border-slate-300 rounded-lg p-2">
                            <label className="text-[9px] font-bold uppercase text-slate-500">Check-in</label>
                            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="text-[12px] w-full outline-none font-bold bg-transparent" />
                        </div>
                        <div className="border border-slate-300 rounded-lg p-2">
                            <label className="text-[9px] font-bold uppercase text-slate-500">Check-out</label>
                            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="text-[12px] w-full outline-none font-bold bg-transparent" />
                        </div>
                        <div className="col-span-2 md:col-span-1 border border-slate-300 rounded-lg p-2 flex justify-between items-center">
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold uppercase text-slate-500 leading-tight">Guests</label>
                                <span className="text-[12px] font-bold">{guests} Guests</span>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 border rounded-full flex items-center justify-center font-extrabold">-</button>
                                <button onClick={() => setGuests(guests + 1)} className="w-7 h-7 border rounded-full flex items-center justify-center font-extrabold">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-4 border-t border-slate-100 pt-2">
                        <div className="shrink-0">
                            <span className="text-xl font-bold">${totalPrice}</span>
                            <span className="text-xs text-slate-500 font-medium ml-1">Total</span>
                        </div>
                        <button onClick={handleBooking} className="flex-1 py-3.5 bg-linear-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-all">
                            Reserve Now
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showSuccessPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                        <div className="bg-white rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="text-green-600" size={40} /></div>
                            <h2 className="text-2xl font-bold mb-2 text-black">Booking Successful!</h2>
                            <p className="text-slate-500 text-sm">Your reservation has been confirmed.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAuthNotice && (
                    <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-6 left-1/2 z-50 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 border border-slate-100">
                        <div className="bg-rose-100 p-2 rounded-full"><Lock className="text-rose-600" size={20} /></div>
                        <div><p className="font-bold text-black text-sm">Please login</p><p className="text-xs text-slate-500">You need an account to book.</p></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DetailRoom;