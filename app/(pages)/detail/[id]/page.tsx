"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import api from "@/app/service/api";
import {
    Star, MapPin, Lock, Wifi, Tv, Snowflake, ShieldCheck, Award,
    Waves, UtensilsCrossed, Car, Shirt, CheckCircle2, Calendar as CalendarIcon, Users
} from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faHouseCircleCheck,
    faCreditCard,
    faBan,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { DetailRoomProps, TCity } from "@/app/type";
import { useRouter } from "next/navigation";
import CommentSection from "./comment";
import BackToTopButton from "@/app/components/BackToTop";

import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface IBooking {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
}

const DetailRoom = ({ params }: DetailRoomProps) => {
    const { id } = React.use(params);
    const router = useRouter();

    const [dataRoom, setDataRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dataCity, setDataCity] = useState<TCity[]>([]);
    const [showAuthNotice, setShowAuthNotice] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [commentCount, setCommentCount] = useState(0);

    const [checkIn, setCheckIn] = useState<Date | undefined>();
    const [checkOut, setCheckOut] = useState<Date | undefined>();
    const [guests, setGuests] = useState(1);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [bookedRanges, setBookedRanges] = useState<IBooking[]>([]);

    const calculateBooking = () => {
        if (!dataRoom || !checkIn || !checkOut) return null;
        const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 0) return null;
        const roomPriceTotal = dataRoom.giaTien * days;
        let extraGuestFee = guests > 4 ? (guests - 4) * (dataRoom.giaTien * 0.1) * days : 0;
        return { days, roomPriceTotal, extraGuestFee, total: roomPriceTotal + extraGuestFee };
    };

    const bookingDetails = calculateBooking();
    const originalPrice = dataRoom ? Math.round(dataRoom.giaTien / 0.8) : 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const checkUser = () => {
            const currentUser = localStorage.getItem("USER_LOGIN");
            if (currentUser !== user) setUser(currentUser);
        };
        checkUser();
        const interval = setInterval(checkUser, 1000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [roomRes, cityRes, commentRes, bookingRes] = await Promise.all([
                    api.get(`phong-thue/${id}`),
                    api.get("vi-tri"),
                    api.get(`binh-luan/lay-binh-luan-theo-phong/${id}`),
                    api.get("dat-phong")
                ]);
                setDataRoom(roomRes?.data?.content);
                setDataCity(cityRes?.data?.content || []);
                setCommentCount(commentRes?.data?.content?.length || 0);

                const filtered = bookingRes.data.content.filter((item: any) => item.maPhong === Number(id));
                setBookedRanges(filtered);
            } catch (error) { console.log(error); } finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    const disabledDays = [
        { before: new Date() },
        ...bookedRanges.map(range => ({
            from: new Date(range.ngayDen),
            to: new Date(range.ngayDi)
        }))
    ];

    const handleBooking = async () => {
        if (!user) {
            setShowAuthNotice(true);
            setTimeout(() => {
                setShowAuthNotice(false);
                window.dispatchEvent(new CustomEvent("OPEN_AUTH_MODAL", { detail: { mode: "login" } }));
            }, 2500);
            return;
        }
        if (!checkIn || !checkOut) return alert("Please select travel dates!");

        const loginData = JSON.parse(user);
        const payload = {
            id: 0, maPhong: Number(id),
            ngayDen: checkIn.toISOString(),
            ngayDi: checkOut.toISOString(),
            soLuongKhach: guests,
            maNguoiDung: loginData?.content?.user?.id
        };
        try {
            await api.post("dat-phong", payload);
            setShowSuccessPopup(true);
            setTimeout(() => { router.push("/"); }, 3000);
        } catch (error) { alert("Booking failed. Please try again."); }
    };

    const PriceCalculationUI = ({ isSidebar = false }: { isSidebar?: boolean }) => (
        <div className={`mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 ${!isSidebar ? "mb-6" : ""}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-slate-400 line-through text-sm font-bold">${originalPrice}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-black">${dataRoom.giaTien}</span>
                        <span className="text-sm font-bold text-slate-500">/ night</span>
                        <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Sale 20%</span>
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
                {bookingDetails ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex justify-between text-slate-600 font-bold text-sm underline cursor-help">
                            <span>${dataRoom.giaTien} x {bookingDetails.days} nights</span>
                            <span>${bookingDetails.roomPriceTotal}</span>
                        </div>
                        {bookingDetails.extraGuestFee > 0 && (
                            <div className="flex justify-between text-rose-600 font-black text-sm underline cursor-help">
                                <span>Extra guest fee ({guests - 4} pax)</span>
                                <span>+${bookingDetails.extraGuestFee.toFixed(0)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-black text-xl text-black pt-4 border-t border-slate-300">
                            <span>Total</span>
                            <span>${bookingDetails.total.toFixed(0)}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic text-center">Select dates to see total price</p>
                )}
            </div>
        </div>
    );

    const BookingInputs = ({ isSidebar = false }: { isSidebar?: boolean }) => (
        <div className="space-y-4 relative">
            <div className={`flex flex-col gap-3 ${!isSidebar ? "lg:flex-col sm:grid sm:grid-cols-3 sm:items-stretch" : "lg:flex-col"}`}>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsCalendarOpen(true);
                    }}
                    className={`border border-slate-400 rounded-xl bg-white shadow-sm overflow-hidden flex cursor-pointer hover:border-rose-500 transition-colors ${!isSidebar ? "sm:col-span-2" : ""}`}
                >
                    <div className="flex-1 p-3 border-r border-slate-400 hover:bg-slate-50 transition-all">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 mb-1 cursor-pointer">
                            <CalendarIcon size={12} className="text-rose-500" /> Check-in
                        </label>
                        <div className="text-xs font-black">{checkIn ? format(checkIn, "dd/MM/yyyy") : "Add date"}</div>
                    </div>
                    <div className="flex-1 p-3 hover:bg-slate-50 transition-all">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 mb-1 cursor-pointer">
                            <CalendarIcon size={12} className="text-rose-500" /> Checkout
                        </label>
                        <div className="text-xs font-black">{checkOut ? format(checkOut, "dd/MM/yyyy") : "Add date"}</div>
                    </div>
                </div>

                <div className={`border border-slate-400 rounded-xl bg-white shadow-sm p-3 ${!isSidebar ? "sm:col-span-1 lg:w-full" : ""}`}>
                    <label className="text-[9px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                        <Users size={12} className="text-rose-500" /> Guests
                    </label>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)); }}
                                className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:border-black disabled:opacity-30 cursor-pointer"
                                disabled={guests <= 1}
                            >
                                -
                            </button>
                            <span className="text-xs font-black px-2">{guests} guest{guests > 1 ? 's' : ''}</span>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setGuests(guests + 1); }}
                                className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:border-black cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <button onClick={(e) => { e.stopPropagation(); handleBooking(); }} className="w-full py-4 bg-linear-to-r from-rose-600 to-pink-600 text-white font-black rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm relative z-10 cursor-pointer">
                    <span>Reserve Now</span>
                    {bookingDetails && (
                        <>
                            <span className="opacity-30">|</span>
                            <span>${bookingDetails.total.toFixed(0)}</span>
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {isCalendarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer"
                            onClick={() => setIsCalendarOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 m-auto z-10 bg-white rounded-3xl p-6 shadow-2xl w-[95%] max-w-95 h-fit border border-slate-200"
                        >
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                                <div>
                                    <h3 className="font-black text-lg text-black">Select dates</h3>
                                </div>
                                <button onClick={() => setIsCalendarOpen(false)} className="text-slate-400 hover:text-black text-xl cursor-pointer">✕</button>
                            </div>

                            <div className="flex justify-center bg-slate-50 rounded-xl p-2">
                                <DayPicker
                                    mode="range"
                                    selected={{ from: checkIn, to: checkOut }}
                                    onSelect={(range) => {
                                        setCheckIn(range?.from);
                                        setCheckOut(range?.to);
                                        if (range?.from && range?.to) {
                                            setTimeout(() => setIsCalendarOpen(false), 300);
                                        }
                                    }}
                                    disabled={disabledDays}
                                    numberOfMonths={1}
                                    className="text-black"
                                />
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => { setCheckIn(undefined); setCheckOut(undefined); }}
                                    className="text-xs font-black uppercase underline text-rose-500 cursor-pointer"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin"></div></div>;
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

    return (
        <div className="bg-white min-h-screen">
            <HomeHeader />

            <AnimatePresence>
                {showAuthNotice && (
                    <motion.div initial={{ opacity: 0, y: -100, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -100, x: "-50%" }} className="fixed top-6 left-1/2 z-50 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 border border-slate-100 w-[90%] max-w-sm">
                        <div className="bg-rose-100 p-3 rounded-full shrink-0"><Lock className="text-rose-600" size={24} /></div>
                        <div className="flex-1"><p className="font-black text-black text-sm">Action Required</p><p className="text-xs text-slate-500 font-bold">Please login to continue.</p></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="app-container mx-auto py-6 md:py-10 text-black pb-40 lg:pb-10">
                <section className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-10 border shadow-sm">
                    <img src={dataRoom.hinhAnh} className="w-full object-cover h-75 md:h-125" alt={dataRoom.tenPhong} />
                    <button className="absolute bottom-6 right-6 bg-white border px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-black hover:text-white transition-all">Show all photos</button>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20">
                    <div className="w-full lg:col-span-2 space-y-10 order-1">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-tight">{dataRoom.tenPhong}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                                <div className="flex items-center gap-1"><Star size={16} className="fill-rose-500 text-rose-500" /><span>4.95 ·</span><span className="underline cursor-pointer">{commentCount} reviews</span></div>
                                <div className="flex items-center gap-1 underline cursor-pointer"><MapPin size={16} />{dataCity.find(c => c.id === Number(dataRoom?.maViTri))?.tinhThanh}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-slate-500 font-bold border-b pb-8">
                            <span>{dataRoom.khach} guests ·</span><span>{dataRoom.phongNgu} bedrooms ·</span><span>{dataRoom.giuong} beds ·</span><span>{dataRoom.phongTam} baths</span>
                        </div>

                        <div className="py-8 border-b space-y-6">
                            <div className="flex gap-4">
                                <Award className="text-slate-700 shrink-0 w-6 h-6" />
                                <div><h4 className="font-black">Self check-in</h4><p className="text-sm text-slate-500">Check yourself in with the keypad easily.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <ShieldCheck className="text-slate-700 shrink-0 w-6 h-6" />
                                <div><h4 className="font-black">Professional Host</h4><p className="text-sm text-slate-500">Experienced hosts for a worry-free stay.</p></div>
                            </div>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl font-black mb-4">About this place</h3>
                            <p className="text-slate-600 leading-7 whitespace-pre-line text-sm md:text-base font-medium">{dataRoom.moTa}</p>
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl font-black mb-6">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                                {amenities.map((a, idx) => (
                                    <div key={idx} className={`flex gap-4 items-center ${a.ok ? "text-slate-700" : "text-slate-200"}`}>
                                        <span>{a.icon}</span><span className={`text-sm font-bold ${!a.ok && "line-through"}`}>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:hidden">
                            <PriceCalculationUI isSidebar={false} />
                        </div>

                        <div className="py-8 border-b">
                            <h3 className="text-xl font-black mb-6">Booking policies</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="flex items-center gap-2 font-black"><FontAwesomeIcon icon={faClock} /> Timing</h4>
                                        <ul className="list-disc pl-5 text-slate-600"><li>Check-in from 14:00</li><li>Check-out by 12:00</li></ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="flex items-center gap-2 font-black"><FontAwesomeIcon icon={faCreditCard} /> Payment</h4>
                                        <ul className="list-disc pl-5 text-slate-600"><li>25% down payment required</li></ul>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="flex items-center gap-2 font-black"><FontAwesomeIcon icon={faHouseCircleCheck} /> Rules</h4>
                                        <ul className="list-disc pl-5 text-slate-600">
                                            <li>Non-smoking, no pets allowed</li>
                                            <li className="text-rose-600">Extra fee: 10% after 4 pax</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="flex items-center gap-2 font-black"><FontAwesomeIcon icon={faBan} /> Cancellation</h4>
                                        <ul className="list-disc pl-5 text-slate-600"><li>Free refund up to 30 days</li></ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex items-start gap-4 p-6 rounded-2xl bg-black text-white">
                                <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
                                <div><h4 className="font-bold mb-1">Stay with confidence</h4><p className="text-slate-300 text-xs font-medium leading-relaxed">We provide 24/7 support. In the rare event of an issue we can’t resolve, we’ll help you find a similar or better place.</p></div>
                            </div>
                        </div>

                        <CommentSection roomId={id} />
                    </div>

                    <aside className="w-full order-2 relative">
                        <div className="hidden lg:block sticky top-28 bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
                            <BookingInputs isSidebar={true} />
                            <PriceCalculationUI isSidebar={true} />
                        </div>
                    </aside>
                </section>
            </main>

            <section className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                <div className="max-w-3xl mx-auto">
                    <BookingInputs isSidebar={false} />
                </div>
            </section>

            <BackToTopButton />
            <HomeFooter />

            <AnimatePresence>
                {showSuccessPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center">
                            <CheckCircle2 className="text-green-600 mb-4 mx-auto" size={60} />
                            <h2 className="text-2xl font-black mb-2 tracking-tight">Booking Confirmed!</h2>
                            <p className="text-slate-500 font-bold">Your reservation request has been sent.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default DetailRoom;