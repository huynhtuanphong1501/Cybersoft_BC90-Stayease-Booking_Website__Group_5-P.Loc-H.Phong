"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import api from "@/app/service/api";
import {
    ChevronLeft, Star, ShieldCheck, CreditCard,
    Lock, Calendar as CalendarIcon, Users, CheckCircle2,
    Banknote, Landmark, Check, ChevronDown, Award, X, AlertCircle, Loader2
} from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHouseCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createPortal } from "react-dom";
import Loading from "@/app/components/_Loading/Loading";

const CheckoutPage = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [checkIn, setCheckIn] = useState<Date | undefined>();
    const [checkOut, setCheckOut] = useState<Date | undefined>();
    const [guests, setGuests] = useState(1);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
    const [showNotice, setShowNotice] = useState(false);
    const [noticeMsg, setNoticeMsg] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const userLogin = localStorage.getItem("USER_LOGIN");
        if (!userLogin) {
            router.replace("/");
            return;
        }

        const data = sessionStorage.getItem("CHECKOUT_DATA");
        if (!data) {
            router.replace("/");
            return;
        }

        const parsed = JSON.parse(data);
        setCheckoutData(parsed);
        setCheckIn(new Date(parsed.checkIn));
        setCheckOut(new Date(parsed.checkOut));
        setGuests(parsed.guests || 1);

        setTimeout(() => {
            setMounted(true);
            setPageLoading(false);
        }, 1000);
    }, [router]);

    const triggerNotice = (msg: string) => {
        setNoticeMsg(msg);
        setShowNotice(true);
        setTimeout(() => setShowNotice(false), 4000);
    };

    const maxGuests = checkoutData?.maxGuests || checkoutData?.khach || 1;

    const calculateLivePrice = () => {
        if (!checkoutData || !checkIn || !checkOut) return { days: 0, roomPriceTotal: 0, total: 0 };
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
        const roomPriceTotal = checkoutData.pricePerNight * days;
        return { days, roomPriceTotal, total: roomPriceTotal };
    };

    const livePrice = calculateLivePrice();

    const handleConfirmBooking = async () => {
        if (!checkIn || !checkOut || livePrice.days <= 0) {
            triggerNotice("Please select valid check-in and check-out dates.");
            return;
        }

        if (paymentMethod === "card") {
            if (cardDetails.number.length < 16 || !cardDetails.expiry || !cardDetails.cvv) {
                triggerNotice("Please provide valid credit card information.");
                return;
            }
        }

        setIsProcessing(true);
        try {
            const payload = {
                maPhong: checkoutData.roomId,
                ngayDen: checkIn.toISOString(),
                ngayDi: checkOut.toISOString(),
                soLuongKhach: guests,
                maNguoiDung: checkoutData.userId
            };
            await api.post("dat-phong", payload);
            sessionStorage.removeItem("CHECKOUT_DATA");
            setShowSuccessModal(true);
            setTimeout(() => { router.push("/"); }, 3000);
        } catch (error) {
            triggerNotice("Something went wrong with the reservation. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (pageLoading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans selection:bg-rose-100">
            <HomeHeader />

            <AnimatePresence>
                {showNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-10 left-1/2 z-50 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 border-l-4 border-rose-500 w-[90%] max-w-md"
                    >
                        <div className="bg-rose-50 p-2 rounded-full">
                            <AlertCircle className="text-rose-500" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-900 text-sm">Action Required</p>
                            <p className="text-xs text-slate-500 mt-0.5">{noticeMsg}</p>
                        </div>
                        <button onClick={() => setShowNotice(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()} className="p-3 bg-white hover:bg-slate-50 rounded-full transition-all border border-slate-200 shadow-sm group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Confirm and pay</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-12">

                        <section className="space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Trip summary</h3>
                            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-200 divide-y divide-slate-100">
                                <div className="flex justify-between items-center pb-6">
                                    <div>
                                        <p className="font-bold">Dates</p>
                                        <p className="text-slate-500 text-sm mt-1">
                                            {checkIn && checkOut ? `${format(checkIn, "MMM dd")} – ${format(checkOut, "MMM dd, yyyy")}` : "Not selected"}
                                        </p>
                                    </div>
                                    <button onClick={() => setIsCalendarOpen(true)} className="text-sm font-bold underline underline-offset-4 hover:text-rose-600 transition-colors">Edit</button>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                    <div>
                                        <p className="font-bold">Guests</p>
                                        <p className="text-slate-500 text-sm mt-1">{guests} {guests > 1 ? 'guests' : 'guest'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            disabled={guests <= 1}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all font-bold">-</button>
                                        <span className="w-4 text-center font-bold text-sm">{guests}</span>
                                        <button
                                            onClick={() => {
                                                if (guests < maxGuests) {
                                                    setGuests(guests + 1);
                                                }
                                            }}
                                            disabled={guests >= maxGuests}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Payment method</h3>
                            <div className="space-y-4">
                                <div className={`border-2 rounded-2xl transition-all duration-300 ${paymentMethod === 'card' ? 'border-slate-900 bg-white ring-4 ring-slate-900/5' : 'border-slate-200 bg-white'}`}>
                                    <label className="p-6 flex items-start gap-4 cursor-pointer">
                                        <input type="radio" className="mt-1.5 w-5 h-5 accent-slate-900" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod("card")} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold flex items-center gap-2"><CreditCard size={18} /> Credit or Debit Card</span>
                                                <div className="flex gap-1 opacity-60">
                                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {paymentMethod === 'card' && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                        <div className="pt-6 space-y-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Card number"
                                                                maxLength={19}
                                                                value={cardDetails.number.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim()}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                                className="w-full p-4 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all text-sm bg-slate-50/50"
                                                            />
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input type="text" placeholder="Exp: MM/YY" className="p-4 rounded-xl border border-slate-200 focus:border-slate-900 outline-none text-sm bg-slate-50/50" onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                                                                <input type="text" placeholder="CVV" className="p-4 rounded-xl border border-slate-200 focus:border-slate-900 outline-none text-sm bg-slate-50/50" onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </label>
                                </div>
                                {['bank', 'cash'].map((method) => (
                                    <label key={method} className={`p-6 border-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === method ? 'border-slate-900 bg-white ring-4 ring-slate-900/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <input type="radio" className="w-5 h-5 accent-slate-900" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                        <span className="font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
                                            {method === 'bank' ? <><Landmark size={18} /> Bank Transfer</> : <><Banknote size={18} /> Pay at Property</>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <div className="pt-4 border-t border-slate-200">
                            <p className="text-[11px] text-slate-400 mb-6 italic leading-relaxed">By selecting the button below, I agree to the Host's House Rules, Safety Disclosures, and Re-booking and Refund Policy.</p>
                            <button
                                disabled={isProcessing}
                                onClick={handleConfirmBooking}
                                className="w-full md:w-auto px-16 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                            >
                                {isProcessing && <Loader2 size={20} className="animate-spin" />}
                                {isProcessing ? "Processing..." : "Confirm and Pay"}
                            </button>
                        </div>
                    </div>

                    <aside className="lg:col-span-5">
                        <div className="sticky top-28 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 space-y-8">
                            <div className="flex gap-6">
                                <div className="relative">
                                    <img src={checkoutData.roomImage} className="w-32 h-32 object-cover rounded-2xl shadow-inner border border-slate-100" alt="room" />
                                    <div className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1.5"><Award size={16} className="text-rose-500" /></div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 leading-snug text-lg line-clamp-2">{checkoutData.roomName}</h4>
                                    <div className="flex items-center gap-1.5 text-sm font-bold mt-2">
                                        <Star size={14} className="fill-slate-900" /> 4.95
                                        <span className="text-slate-400 font-medium">· Superior</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="font-bold text-lg">Price Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>${checkoutData.pricePerNight} x {livePrice.days} nights</span>
                                        <span className="text-slate-900 font-bold">${livePrice.roomPriceTotal}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t border-slate-900/5">
                                <span className="text-lg font-bold">Total <span className="text-slate-400 font-medium">(USD)</span></span>
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">${livePrice.total.toFixed(0)}</span>
                            </div>

                            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 relative overflow-hidden">
                                <div className="flex items-center gap-3 relative z-10">
                                    <ShieldCheck size={24} className="text-emerald-400" />
                                    <p className="font-bold text-sm">AirCover Protection</p>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed relative z-10">Your booking includes protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.</p>
                                <ShieldCheck size={100} className="absolute -bottom-6 -right-6 text-white/5" />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {mounted && showSuccessModal && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center max-w-sm w-full">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Booking Confirmed!</h2>
                        <p className="text-slate-500 mb-8 font-medium">We've sent the details to your email.</p>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="bg-emerald-500 h-full" />
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}

            {mounted && isCalendarOpen && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl tracking-tight italic">Select trip dates</h3>
                            <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all border border-slate-100"><X size={20} /></button>
                        </div>
                        <DayPicker
                            mode="range"
                            selected={{ from: checkIn, to: checkOut }}
                            onSelect={(range) => {
                                setCheckIn(range?.from);
                                setCheckOut(range?.to);
                                if (range?.from && range?.to) setTimeout(() => setIsCalendarOpen(false), 600);
                            }}
                            disabled={{ before: new Date() }}
                        />
                    </motion.div>
                </div>,
                document.body
            )}

            <HomeFooter />
        </div>
    );
};

export default CheckoutPage;