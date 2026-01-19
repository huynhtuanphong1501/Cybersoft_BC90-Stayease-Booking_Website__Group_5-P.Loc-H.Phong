"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Send, ChevronLeft, ChevronRight, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/service/api";
import { TComment } from "@/app/type";
import Toast from "@/app/components/_Toast/Toast";

const CommentSection = ({ roomId }: { roomId: string }) => {
    const [comments, setComments] = useState<TComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [user, setUser] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

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
        const currentUser = localStorage.getItem("USER_LOGIN");

        if (!currentUser) {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                window.dispatchEvent(new CustomEvent("OPEN_AUTH_MODAL", { detail: { mode: "login" } }));
            }, 2000);
            return;
        }

        if (!newComment.trim() || isSubmitting) return;

        const parsedUser = JSON.parse(currentUser);
        const userId = parsedUser?.content?.user?.id;

        if (!userId) {
            setShowToast(true);
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
                <div className="h-8 w-48 bg-white  animate-pulse rounded-md" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-75 h-40 bg-white  animate-pulse rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="relative border-t border-[#B6D9E0]  pt-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-[#7D3719] text-[#7D3719]" />
                    <h3 className="text-xl font-bold tracking-tight text-[#7D3719]">
                        {averageRating} <span className="mx-1 text-[#65727D] ">·</span>{" "}
                        <span className="text-black">{comments.length} reviews</span>
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll("left")} className="p-2 rounded-full border border-[#335765]  bg-white hover:bg-white  ransition-colors shadow-sm active:scale-95">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => scroll("right")} className="p-2 rounded-full border border-[#335765]  bg-white hover:bg-white  ransition-colors shadow-sm active:scale-95">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                {comments.length > 0 ? (
                    comments.map((item) => (
                        <div key={item.id} className="snap-start min-w-[90%] sm:min-w-100 p-5 sm:p-6 rounded-2xl border border-[#335765]  bg-white shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white  flex items-center justify-center border border-[#335765]" >
                                        {item.avatar ? <img src={item.avatar} alt={item.tenNguoiBinhLuan} className="w-full h-full object-cover" /> : <User size={20} className="text-[#65727D] " />}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-black leading-tight text-sm sm:text-base">{item.tenNguoiBinhLuan}</h5>
                                        <p className="text-xs text-[#65727D]  font-medium">{new Date(item.ngayBinhLuan).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < item.saoBinhLuan ? "fill-amber-400 text-amber-400" : "text-[#65727D] "} />
                                    ))}
                                </div>
                                <p className="text-[#65727D]  text-sm sm:text-base leading-relaxed line-clamp-4 italic">"{item.noiDung}"</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full py-10 text-center border-2 border-dashed border-[#65727D]  rounded-3xl">
                        <p className="text-[#65727D]  font-medium">No reviews yet for this room.</p>
                    </div>
                )}
            </div>

            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white  order border-[#65727D] ">
                <h4 className="text-lg font-bold text-black mb-6">Add a review</h4>
                <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl w-fit shadow-sm border border-[#335765] ">
                    <span className="text-sm font-bold text-[#65727D]  uppercase tracking-wider">Rating</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setRating(s)} className="transition-transform active:scale-125">
                                <Star size={24} className={`${s <= rating ? "fill-amber-400 text-amber-400" : "text-[#65727D] "} transition-colors`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col w-full rounded-2xl border border-[#335765]  bg-white shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 transition-all overflow-hidden">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience about this place..."
                        className="w-full p-4 sm:p-5 md:p-6 min-h-30 sm:min-h-37.5 md:min-h-45 text-sm sm:text-base text-black outline-none resize-none bg-transparent"
                    />

                    <div className="flex items-center justify-end p-3 sm:p-4 border-t border-[#B6D9E0] bg-white  0">
                        <button
                            onClick={handlePostComment}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold tracking-wide bg-black text-white border border-black cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#a50000] hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
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

            <Toast
                open={showToast}
                onClose={() => setShowToast(false)}
                type="warning"
            >
                <p className="font-black text-sm">Login required</p>
                <p className="text-xs text-[#65727D]">
                    Please log in to leave a comment.
                </p>
            </Toast>
        </section >
    );
};

export default CommentSection;