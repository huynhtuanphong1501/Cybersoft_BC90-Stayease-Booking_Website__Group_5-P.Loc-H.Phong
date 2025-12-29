import Link from 'next/link'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

const HomeFooter = () => {
    return (
        <footer className="bg-[#0D0F11] text-white w-full border-t border-white/5">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                {/* flex-col: dọc trên mobile
                    lg:flex-row: ngang trên desktop
                */}
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16">

                    {/* 1. BRAND & SOCIAL - Mobile nằm dưới (order-2), Desktop nằm trái (lg:order-1) */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8 w-full lg:w-1/2 order-2 lg:order-1">
                        <img
                            src="/img/logo.png"
                            alt="LockWind Logo"
                            className="w-40 md:w-48 brightness-110"
                        />

                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
                                Connect with us
                            </p>
                            <div className="flex gap-4 sm:gap-6 justify-center lg:justify-start">
                                {[
                                    { icon: faFacebook, color: "hover:bg-[#1877F2]" },
                                    { icon: faInstagram, color: "hover:bg-[#E4405F]" },
                                    { icon: faLinkedin, color: "hover:bg-[#0A66C2]" },
                                    { icon: faTwitter, color: "hover:bg-[#1DA1F2]" }
                                ].map((social, index) => (
                                    <Link
                                        key={index}
                                        href="#"
                                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 ${social.color} hover:text-white hover:-translate-y-2`}
                                    >
                                        <FontAwesomeIcon icon={social.icon} className="text-lg md:text-xl" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. NEWSLETTER - Mobile nằm trên cùng (order-1), Desktop nằm phải (lg:order-2) */}
                    <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-6 w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                Join the <span className="text-[#FF4B5C]">Adventure</span>
                            </h3>
                            <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed ml-auto">
                                Subscribe to our newsletter to receive exclusive offers and the latest travel inspiration every week.
                            </p>
                        </div>

                        <div className="relative w-full max-w-md group">
                            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-[#1A1D21] rounded-2xl border border-white/5 focus-within:border-[#FF4B5C]/50 transition-all shadow-2xl">
                                <input
                                    type="email"
                                    placeholder="Your email address..."
                                    className="flex-1 px-4 py-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-600"
                                />
                                <button className="px-6 py-3 rounded-xl bg-[#FF4B5C] font-bold text-sm transition-all hover:bg-[#ff3245] hover:shadow-[0_0_15px_rgba(255,75,92,0.4)] active:scale-95">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="py-8 border-t border-white/5 bg-black/30">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="flex gap-8 text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-500">
                        <Link href="#" className="hover:text-[#FF4B5C] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[#FF4B5C] transition-colors">Terms & Conditions</Link>
                    </div>

                    <div className="text-[10px] md:text-xs text-gray-600 font-medium">
                        © 2025 LOCKWIND. ALL RIGHTS RESERVED.
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;