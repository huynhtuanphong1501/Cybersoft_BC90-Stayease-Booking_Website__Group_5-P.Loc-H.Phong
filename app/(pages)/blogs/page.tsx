"use client"

import React, { useEffect } from 'react';
import 'animate.css';
import HomeHeader from '@/app/components/HomeHeader';
import HomeFooter from '@/app/components/HomeFooter';

const BlogsPage = () => {
    const blogPosts = [
        {
            id: 1,
            title: "7 Perfect Days in the Heart of Ancient Hoi An",
            category: "Heritage Guide",
            image: "/img/Blogs/hoiAn.jpg",
        },
        {
            id: 2,
            title: "The Ultimate Lunar New Year Escapes 2026",
            category: "Seasonal Experience",
            image: "/img/Blogs/The Ultimate Lunar New Year Escapes 2026.webp",
        },
        {
            id: 3,
            title: "Beyond the Clouds: Private Retreats in Sapa",
            category: "Mountain Luxury",
            image: "/img/Blogs/SaPa.jpg",
        },
        {
            id: 4,
            title: "LockWind City Guide | The Colonial Charm of Hanoi",
            category: "Urban Discovery",
            image: "/img/Blogs/The Colonial Charm of Hanoi.jpg",
        },
        {
            id: 5,
            title: "Hidden Azure: Discovering Secret Bays in Ninh Thuan",
            category: "Coastal Escape",
            image: "/img/Blogs/Discovering Secret Bays in Ninh Thuan.jpg",
        },
        {
            id: 6,
            title: "Redefining Wellness in the Central Highlands",
            category: "Retreat & Soul",
            image: "/img/Blogs/Wellness in the Central Highlands vietnam.webp",
        }
    ];

    useEffect(() => {
        import('wowjs').then((WOW) => {
            new WOW.WOW({
                live: false
            }).init();
        });
    }, []);

    return (
        <section className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans selection:bg-rose-100 overflow-x-hidden">
            <HomeHeader />

            <main className='app-container mx-auto py-12 md:py-24'>
                {/* Header Section */}
                <div className="text-center wow animate__animated animate__fadeInUp">
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tight">
                        Blogs
                    </h1>
                    <p className="w-full mx-auto text-slate-500 text-lg font-light leading-relaxed">
                        Where Expert Knowledge Meets Exclusive Destinations. <br />
                        Inspiring Experiences and Curated Travel Guides for the Discerning Traveler.
                    </p>
                    <div className="w-12 h-px bg-slate-300 mx-auto mt-12 animate__animated animate__zoomIn animate__delay-1s"></div>
                </div>

                {/* Blog Grid */}
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-y-20 gap-x-6 sm:gap-x-8 md:gap-x-12">
                        {blogPosts.map((post, index) => (
                            <article
                                key={post.id}
                                className="group wow animate__animated animate__fadeInUp"
                                data-wow-delay={`${(index % 3) * 0.2}s`}
                            >
                                <div className="relative aspect-3/4 overflow-hidden bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-2xl">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                                </div>

                                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold text-rose-800 block opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                        {post.category}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-serif leading-snug group-hover:text-slate-600 transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    <div className="pt-1 sm:pt-2">
                                        <button className="relative text-[10px] sm:text-[11px] uppercase tracking-widest font-bold border-b border-slate-900 pb-1 overflow-hidden group/btn">
                                            <span className="relative z-10 group-hover/btn:text-rose-800 transition-colors duration-300">
                                                Read More
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-16 sm:mt-24 md:mt-32 text-center wow animate__animated animate__fadeInUp">
                        <button className="px-10 py-4 sm:px-14 sm:py-5 border border-slate-200 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm hover:shadow-xl">
                            Load more
                        </button>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="mt-40 text-center opacity-40 wow animate__animated animate__fadeIn">
                    <p className="font-serif italic text-xl text-slate-400 tracking-wider">
                        — Curating Vietnam's Finest Moments —
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-slate-900">LockWind Vietnam</p>
                </div>
            </main>

            <HomeFooter />
        </section>
    );
};

export default BlogsPage;