"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Send, ChevronLeft, ChevronRight, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/service/api";

interface TComment {
    id: number;
    ngayBinhLuan: string;
    noiDung: string;
    saoBinhLuan: number;
    tenNguoiBinhLuan: string;
    avatar?: string;
}

const CommentSection = ({ roomId }: { roomId: string }) => {
    const [comments, setComments] = useState<TComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAuthNotice, setShowAuthNotice] = useState(false);
    const [user, setUser] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("USER_LOGIN");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    setUser(null);
                }
            }
        }
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
        if (!user) {
            setShowAuthNotice(true);
            setTimeout(() => setShowAuthNotice(false), 2500);
            return;
        }

        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const userData = user.user || user.content?.user;
            const userId = userData?.id;

            const payload = {
                id: 0,
                maPhong: Number(roomId),
                maNguoiBinhLuan: Number(userId),
                ngayBinhLuan: new Date().toISOString(),
                noiDung: newComment,
                saoBinhLuan: rating,
            };

            await api.post("binh-luan", payload);

            setNewComment("");
            setRating(5);
            await fetchComments();
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
                        <div
                            key={i}
                            className="min-w-75 h-40 bg-slate-100 animate-pulse rounded-2xl"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="relative border-t border-slate-100">
            <AnimatePresence>
                {showAuthNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-24 left-1/2 z-50 bg-slate-900 text-white shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 whitespace-nowrap"
                    >
                        <Lock size={16} className="text-amber-400" />
                        <span className="text-sm font-medium">
                            Please log in to post a review
                        </span>
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
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
                {comments.length > 0 ? (
                    comments.map((item) => (
                        <div
                            key={item.id}
                            className="snap-start min-w-[90%] sm:min-w-100 p-5 sm:p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-50">
                                        {item.avatar ? (
                                            <img
                                                src={item.avatar}
                                                alt={item.tenNguoiBinhLuan}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User
                                                size={20}
                                                className="text-slate-400"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-black leading-tight text-sm sm:text-base">
                                            {item.tenNguoiBinhLuan}
                                        </h5>
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                                            {new Date(item.ngayBinhLuan).toLocaleDateString("vi-VN", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={
                                                i < item.saoBinhLuan
                                                    ? "fill-[#7D3719] text-[#7D3719]"
                                                    : "text-slate-200"
                                            }
                                        />
                                    ))}
                                </div>

                                <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px] line-clamp-4">
                                    {item.noiDung}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full py-10 text-center text-slate-400 border border-dashed rounded-2xl">
                        No reviews yet for this room.
                    </div>
                )}
            </div>

            <div className="mt-10 bg-slate-50/80 p-5 sm:p-8 rounded-3xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h4 className="font-bold text-black text-lg">
                        Leave your review
                    </h4>
                    <div className="flex gap-2 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                onClick={() => setRating(s)}
                                className={`w-6 h-6 cursor-pointer transition-all ${s <= rating
                                    ? "fill-amber-400 text-amber-400 scale-110"
                                    : "text-slate-200 hover:text-slate-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="How was your stay? Share your experience..."
                        className="w-full h-36 p-5 pr-14 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 outline-none transition-all resize-none text-[15px] shadow-sm"
                    />
                    <button
                        onClick={handlePostComment}
                        disabled={!newComment.trim() || isSubmitting}
                        className="absolute right-3 bottom-3 p-3 rounded-xl bg-slate-900 text-white hover:bg-black disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CommentSection;