"use client"

import HomeFooter from '@/app/components/HomeFooter'
import HomeHeader from '@/app/components/HomeHeader'
import React, { useEffect } from 'react'
import "animate.css"

const Inspiration = () => {

    useEffect(() => {
        const initWow = async () => {
            const WOW = (await import("wowjs")).default;
            new WOW.WOW({
                live: false,
                offset: 80,
            }).init();
        };
        initWow();
    }, []);

    return (
        <section className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans selection:bg-rose-100 overflow-x-hidden">
            <HomeHeader />

            <main className="app-container mx-auto py-12 md:py-24">

                {/* --- Hero Section --- */}
                <div className="text-center mb-20 space-y-6 wow animate__animated animate__fadeInUp">
                    <h2 className="text-sm uppercase tracking-[0.4em] text-slate-500">
                        The Art of Discovery
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-serif italic text-slate-900 tracking-tight">
                        LockWind Inspiration
                    </h1>
                    <div className="w-24 h-px bg-slate-400 mx-auto mt-8"></div>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 italic mt-6 wow animate__animated animate__fadeInUp" data-wow-delay="0.3s">
                        "Luxury is emotive and personal. Unique to every individual."
                    </p>
                </div>

                {/* --- Section 1: THE COLLECTION --- */}
                <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8 order-2 md:order-1 wow animate__animated animate__fadeInLeft" data-wow-delay="0.1s">
                        <h3 className="text-2xl font-light tracking-widest uppercase border-b border-slate-200 pb-4">
                            THE COLLECTION
                        </h3>
                        <div className="space-y-6 text-lg leading-relaxed text-slate-700">
                            <p>
                                For nearly two decades, <span className="font-semibold text-slate-900">LockWind</span> has meticulously curated a collection of only the finest villas in Vietnam’s most celebrated destinations.
                            </p>
                            <p className="font-light">
                                From the locally crafted fine art that adorns our walls, to our sommelier-selected wine collections, each facet of your stay is a bespoke masterpiece.
                            </p>
                        </div>
                    </div>

                    <div className="relative h-100 md:h-150 overflow-hidden shadow-2xl order-1 md:order-2 wow animate__animated animate__fadeInRight" data-wow-delay="0.3s">
                        <img
                            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
                            alt="Luxury Vietnam Villa"
                            className="object-cover w-full h-full hover:scale-110 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/5"></div>
                    </div>
                </section>

                {/* --- Section 2: THE EXPERIENCE --- */}
                <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div className="relative h-100 md:h-150 overflow-hidden shadow-2xl wow animate__animated animate__fadeInLeft" data-wow-delay="0.2s">
                        <img
                            src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
                            alt="Vietnam Experience"
                            className="object-cover w-full h-full hover:scale-110 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/5"></div>
                    </div>

                    <div className="space-y-8 wow animate__animated animate__fadeInRight">
                        <h3 className="text-2xl font-light tracking-widest uppercase border-b border-slate-200 pb-4">
                            THE EXPERIENCE
                        </h3>
                        <div className="space-y-6 text-lg leading-relaxed text-slate-700">
                            <p>
                                To us, luxury is emotive and personal. We get to know each of our cherished guests, creating bespoke journeys that speak to their personal definitions of luxury.
                            </p>
                            <p className="font-light italic border-l-2 border-rose-200 pl-6">
                                From floating with sea turtles in secret coves to rising over misty terraced fields in a private helicopter, our experience curators magically materialize the impossible.
                            </p>
                        </div>
                        <div className="pt-6">
                            <button className="group relative px-10 py-4 overflow-hidden border border-slate-900 text-sm uppercase tracking-widest transition-all">
                                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Explore Our World</span>
                                <div className="absolute inset-0 bg-slate-900 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- Footer Quote --- */}
                <div className="text-center py-32 border-t border-slate-100 wow animate__animated animate__fadeInUp">
                    <p className="text-3xl md:text-5xl font-serif italic text-slate-400 leading-snug">
                        "Unscripted moments and extraordinary <br className="hidden md:block" /> milestones that write your life’s story."
                    </p>
                    <div className="mt-12 flex flex-col items-center">
                        <span className="h-12 w-px bg-slate-300 mb-6"></span>
                        <p className="font-bold tracking-[0.5em] uppercase text-slate-900 text-xs">LockWind Vietnam</p>
                    </div>
                </div>
            </main>

            <HomeFooter />
        </section>
    );
};

export default Inspiration;