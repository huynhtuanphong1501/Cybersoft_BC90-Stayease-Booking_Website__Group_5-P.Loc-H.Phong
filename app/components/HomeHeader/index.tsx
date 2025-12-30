"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoginModal from "@/app/(pages)/login/page";
import RegisterModal from "@/app/(pages)/register/page";

interface HeaderProps {
    isHome?: boolean;
    homeAnimationDone?: boolean;
}

const HomeHeader = ({ isHome = false, homeAnimationDone = false }: HeaderProps) => {
    const pathname = usePathname();
    const [showBg, setShowBg] = useState(!isHome);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);

    useEffect(() => {
        if (!isHome) return;
        const onScroll = () => setShowBg(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    const HeaderContent = (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 font-semibold flex-1">
                <Link
                    href="/inspiration"
                    className={`px-3 py-1 rounded-full cursor-pointer transition ${pathname === "/inspiration" ? "bg-black text-white" : "hover:text-black/70"
                        }`}
                >
                    Inspiration
                </Link>
                <Link
                    href="/about"
                    className={`px-3 py-1 rounded-full cursor-pointer transition ${pathname === "/about" ? "bg-black text-white" : "hover:text-black/70"
                        }`}
                >
                    About
                </Link>
            </div>

            <Link href="/" className="cursor-pointer">
                <div className="bg-[#C3DFE3] px-10 py-3 clip-logo">
                    <img src="/img/logo.png" className="h-12 " />
                </div>
            </Link>

            <div className="flex items-center gap-4 flex-1 justify-end">
                <Link
                    href="/list-now"
                    className="px-6 py-2 rounded-full text-white bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 hover:scale-105 transition cursor-pointer"
                >
                    List Now
                </Link>

                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full bg-[#143944] text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faUser} />
                </button>

                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-14 w-40 bg-white rounded-xl shadow-xl overflow-hidden"
                        >
                            <button
                                onClick={() => {
                                    setAuthModal("login");
                                    setDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setAuthModal("register");
                                    setDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                            >
                                Register
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <>
            {isHome ? (
                <AnimatePresence>
                    {homeAnimationDone && (
                        <motion.header
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className={`fixed top-0 left-0 w-full z-10 transition ${showBg
                                ? "bg-[#C3DFE3] shadow-md rounded-b-4xl"
                                : "bg-white/30 backdrop-blur-sm rounded-b-4xl"
                                }`}
                        >
                            <div className="container mx-auto">{HeaderContent}</div>
                        </motion.header>
                    )}
                </AnimatePresence>
            ) : (
                <header className="sticky top-0 z-10 bg-[#C3DFE3] shadow-md rounded-b-4xl">
                    <div className="container mx-auto">{HeaderContent}</div>
                </header>
            )}

            <AnimatePresence>
                {authModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                        onClick={() => setAuthModal(null)}
                    >
                        {authModal === "login" && (
                            <LoginModal
                                onClose={() => setAuthModal(null)}
                                onSwitchRegister={() => setAuthModal("register")}
                            />
                        )}

                        {authModal === "register" && (
                            <RegisterModal
                                onClose={() => setAuthModal(null)}
                                onSwitchLogin={() => setAuthModal("login")}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .clip-logo {
                    clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
                }
            `}</style>
        </>
    );
};

export default HomeHeader;
