import Link from "next/link"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram, faYoutube, faLinkedin } from "@fortawesome/free-brands-svg-icons"

const HomeFooter = () => {
    return (
        <footer className="text-white w-full border-t border-white/5">
            <div
                className="relative w-full h-auto flex items-center bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('/img/footerBackground.png')" }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-1 py-16">
                    <div className="app-container mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="w-full lg:w-3/5 text-center lg:text-left">
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-snug mb-4">
                                    Get weekly travel inspiration, exclusive offers, and early access to our newest homes.
                                </h2>

                                <p className="text-xs sm:text-sm md:text-base text-gray-300">
                                    By submitting this form, you agree to our
                                    <span className="underline cursor-pointer hover:text-white ml-1">
                                        Terms and Privacy Policy
                                    </span>
                                </p>
                            </div>

                            <div className="w-full sm:w-125 lg:w-2/5">
                                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                                    <input
                                        type="email"
                                        placeholder="Your email address..."
                                        className="flex-1 px-5 py-4 bg-transparent border-none outline-none text-white text-xs sm:text-sm md:text-base placeholder:text-gray-400 cursor-text"
                                    />

                                    <button className="px-8 py-4 rounded-xl bg-black text-white font-bold text-xs sm:text-sm transition-all duration-300 hover:bg-gray-900 active:scale-95 cursor-pointer whitespace-nowrap">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#0D0F11] py-12 md:py-16 lg:py-20">
                <div className="app-container mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-16">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8 w-full lg:w-1/2 order-2 lg:order-1">
                            <img
                                src="/img/logo.png"
                                alt="LockWind Logo"
                                className="w-32 sm:w-40 md:w-48 brightness-110 cursor-pointer"
                            />

                            <div className="space-y-4">
                                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
                                    Connect with us
                                </p>

                                <div className="flex gap-4 sm:gap-6 justify-center lg:justify-start">
                                    <Link
                                        href="#"
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-[#1877F2] hover:text-white hover:-translate-y-2 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faFacebook} className="text-lg md:text-xl" />
                                    </Link>

                                    <Link
                                        href="#"
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-[#E4405F] hover:text-white hover:-translate-y-2 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faInstagram} className="text-lg md:text-xl" />
                                    </Link>

                                    <Link
                                        href="#"
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-[#FF0000] hover:text-white hover:-translate-y-2 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faYoutube} className="text-lg md:text-xl" />
                                    </Link>

                                    <Link
                                        href="#"
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-[#0A66C2] hover:text-white hover:-translate-y-2 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faLinkedin} className="text-lg md:text-xl" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-6 w-full lg:w-1/2 order-1 lg:order-2">
                            <div className="space-y-4">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                                    Join the <span className="text-[#FF4B5C]">Adventure</span>
                                </h3>
                                <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed ml-auto">
                                    Subscribe to our newsletter to receive exclusive offers and the latest travel inspiration every week.
                                </p>
                            </div>

                            <div className="relative w-full max-w-md">
                                <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-[#1A1D21] rounded-2xl border border-white/5 transition-all shadow-2xl">
                                    <input
                                        type="email"
                                        placeholder="Your email address..."
                                        className="flex-1 px-4 py-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-600 cursor-text"
                                    />
                                    <button className="px-6 py-3 rounded-xl bg-[#FF4B5C] font-bold text-sm transition-all duration-300 hover:bg-[#ff3245] hover:shadow-[0_0_15px_rgba(255,75,92,0.4)] active:scale-95 cursor-pointer">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-6 md:py-8 border-t border-white/5 bg-black/30">
                <div className="app-container mx-auto">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-widest font-bold text-gray-500">
                            <Link href="#" className="hover:text-[#FF4B5C] transition-colors cursor-pointer">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-[#FF4B5C] transition-colors cursor-pointer">
                                Terms & Conditions
                            </Link>
                        </div>

                        <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-600 font-medium tracking-wider text-right whitespace-nowrap">
                            © 2025 LOCKWIND. ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default HomeFooter
