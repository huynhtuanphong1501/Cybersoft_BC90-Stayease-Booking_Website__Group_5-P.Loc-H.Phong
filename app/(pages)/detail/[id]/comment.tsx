"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Send, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/app/service/api";

interface Comment {
    id: number;
    ngayBinhLuan: string;
    noiDung: string;
    saoBinhLuan: number;
    tenNguoiBinhLuan: string;
    avatar?: string;
}

const CommentSection = ({ roomId }: { roomId: string }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(
                    `binh-luan/lay-binh-luan-theo-phong/${roomId}`
                );
                setComments(res.data.content || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [roomId]);

    const averageRating =
        comments.length > 0
            ? (
                comments.reduce((sum, c) => sum + c.saoBinhLuan, 0) /
                comments.length
            ).toFixed(1)
            : "0.0";

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({
            left:
                dir === "left"
                    ? -scrollRef.current.clientWidth
                    : scrollRef.current.clientWidth,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (!scrollRef.current || comments.length === 0) return;

        const interval = setInterval(() => {
            const el = scrollRef.current!;
            const maxScrollLeft = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft >= maxScrollLeft - 10) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [comments]);

    const renderCommentCard = (item: Comment) => (
        <div
            key={item.id}
            className="snap-start flex flex-col justify-between
                       min-w-[85%] sm:min-w-[70%] md:min-w-[48%] lg:min-w-[32%] xl:min-w-[28%]
                       p-5 sm:p-6 rounded-2xl bg-white border border-slate-300"
        >
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={
                            item.avatar ||
                            "https://ui-avatars.com/api/?background=CBD5E1&color=334155"
                        }
                        alt={item.tenNguoiBinhLuan}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                        <h5 className="text-sm font-semibold text-slate-900 truncate">
                            {item.tenNguoiBinhLuan}
                        </h5>
                        <p className="text-[11px] text-slate-400">
                            {new Date(item.ngayBinhLuan).toLocaleDateString(
                                "vi-VN"
                            )}
                        </p>
                    </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 italic">
                    “{item.noiDung}”
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < item.saoBinhLuan
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-sm font-medium text-[#7D3719]">
                    {item.saoBinhLuan}/5
                </span>
            </div>
        </div>
    );

    const renderCommentList = () =>
        comments.map((item) => renderCommentCard(item));

    if (loading)
        return <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />;

    return (
        <section className="py-8 sm:py-10">
            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#7D3719]">
                        {averageRating}
                        <span className="text-black">
                            · {comments.length} reviews
                        </span>
                    </h3>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 sm:p-2.5 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 sm:p-2.5 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
                {renderCommentList()}
            </div>

            <div className="mt-6 sm:mt-8 w-full">
                <div className="relative bg-slate-50 border border-slate-300 rounded-2xl p-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full h-16 sm:h-20 bg-transparent p-3 pr-14 text-sm outline-none resize-none"
                    />
                    <button className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-amber-400 text-white hover:bg-amber-500 transition-all duration-300 cursor-pointer">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CommentSection;
