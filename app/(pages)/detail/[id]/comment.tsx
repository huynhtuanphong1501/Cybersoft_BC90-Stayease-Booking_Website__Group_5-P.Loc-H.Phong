"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Send, ChevronLeft, ChevronRight, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/service/api";
import { TComment } from "@/app/type";

const CommentSection = ({ roomId }: { roomId: string }) => {
    const [comments, setComments] = useState<TComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAuthNotice, setShowAuthNotice] = useState(false);
    const [user, setUser] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Đồng bộ User liên tục để tránh lỗi "đã login vẫn hiện thông báo"
    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem("USER_LOGIN");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        checkUser();
        const interval = setInterval(checkUser, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchComments = async () => {
        try {
            const res = await api.get(`binh-luan/lay-binh-luan-theo-phong/${roomId}`);
            setComments(res.data.content || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [roomId]);

    const handlePostComment = async () => {
        // Fix lỗi: Check lại trực tiếp localStorage
        const currentUser = localStorage.getItem("USER_LOGIN");

        if (!currentUser) {
            setShowAuthNotice(true);
            setTimeout(() => {
                setShowAuthNotice(false);
                // Mở modal login
                window.dispatchEvent(new CustomEvent("OPEN_AUTH_MODAL", { detail: { mode: "login" } }));
            }, 2000);
            return;
        }

        if (!newComment.trim() || isSubmitting) return;

        const parsedUser = JSON.parse(currentUser);
        const userId = parsedUser?.content?.user?.id;

        if (!userId) {
            setShowAuthNotice(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                id: 0,
                maPhong: Number(roomId),
                maNguoiBinhLuan: Number(userId),
                ngayBinhLuan: new Date().toISOString(),
                noiDung: newComment.trim(),
                saoBinhLuan: rating,
            };

            await api.post("binh-luan", payload);
            setNewComment("");
            setRating(5);
            fetchComments();
        } catch (error) {
            console.error(error);
            alert("Failed to post comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating =
        comments.length > 0
            ? (
                comments.reduce((sum, c) => sum + c.saoBinhLuan, 0) /
                comments.length
            ).toFixed(1)
            : "0.0";

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.clientWidth * 0.8;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    if (loading) {
        return (
            <div className="py-10 flex flex-col gap-4">
                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-75 h-40 bg-slate-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="relative border-t border-slate-100 pt-10">
            <AnimatePresence>
                {showAuthNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-6 left-1/2 z-5 bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 border border-slate-100 w-[90%] max-w-87.5"
                    >
                        <div className="bg-amber-100 p-2 rounded-full shrink-0">
                            <Lock className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-black text-sm">Please log in</p>
                            <p className="text-xs text-slate-500">You need to sign in to leave a review.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-[#7D3719] text-[#7D3719]" />
                    <h3 className="text-xl font-bold tracking-tight text-[#7D3719]">
                        {averageRating} <span className="mx-1 text-slate-300">·</span>{" "}
                        <span className="text-black">{comments.length} reviews</span>
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll("left")} className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => scroll("right")} className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                {comments.length > 0 ? (
                    comments.map((item) => (
                        <div key={item.id} className="snap-start min-w-[90%] sm:min-w-100 p-5 sm:p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-50">
                                        {item.avatar ? <img src={item.avatar} alt={item.tenNguoiBinhLuan} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-400" />}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-black leading-tight text-sm sm:text-base">{item.tenNguoiBinhLuan}</h5>
                                        <p className="text-xs text-slate-400 font-medium">{new Date(item.ngayBinhLuan).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < item.saoBinhLuan ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-4 italic">"{item.noiDung}"</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <p className="text-slate-400 font-medium">No reviews yet for this room.</p>
                    </div>
                )}
            </div>

            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <h4 className="text-lg font-bold text-black mb-6">Add a review</h4>
                <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl w-fit shadow-sm border border-slate-100">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Rating</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setRating(s)} className="transition-transform active:scale-125">
                                <Star size={24} className={`${s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} transition-colors`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col w-full rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 transition-all overflow-hidden">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience about this place..."
                        className="w-full p-4 sm:p-5 md:p-6 min-h-30 sm:min-h-37.5 md:min-h-45 text-sm sm:text-base text-black outline-none resize-none bg-transparent"
                    />

                    <div className="flex items-center justify-end p-3 sm:p-4 border-t border-slate-50 bg-slate-50/50">
                        <button
                            onClick={handlePostComment}
                            disabled={isSubmitting}
                            className="
                flex items-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm
                bg-black text-white 
                text-xs sm:text-sm md:text-base
                px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3
                lg:px-8 lg:py-3.5
                xl:px-10
                rounded-lg sm:rounded-xl
                hover:bg-slate-800
            "
                        >
                            <span className="inline-block">
                                {isSubmitting ? "Submitting..." : "Submit review"}
                            </span>
                            <Send
                                size={16}
                                className={`${isSubmitting ? "animate-pulse" : ""} sm:w-4.5 md:w-5`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommentSection;