"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
    isHome?: boolean;
    homeAnimationDone?: boolean;
}

const HomeHeader = ({ isHome = false, homeAnimationDone = false }: HeaderProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showBg, setShowBg] = useState(!isHome);

    useEffect(() => {
        if (!isHome) return;

        const onScroll = () => {
            setShowBg(window.scrollY > 50);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    const content = (
        <div className="flex items-center justify-between w-full px-6 py-4">
            <Link href="/">
                <img src="/img/logo.png" className="h-12 cursor-pointer" />
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm font-semibold">
                <Link href="/inspiration" className="px-4 py-2 rounded-full hover:bg-black hover:text-white">
                    Inspiration
                </Link>
                <Link href="/listings" className="px-4 py-2 rounded-full hover:bg-black hover:text-white">
                    Listings
                </Link>
                <Link href="/about" className="px-4 py-2 rounded-full hover:bg-black hover:text-white">
                    About
                </Link>
                <Link href="/contact" className="px-4 py-2 rounded-full hover:bg-black hover:text-white">
                    Contact
                </Link>
                <Link
                    href="/list-now"
                    className="ml-2 px-6 py-2 rounded-full text-white bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 hover:scale-105 transition"
                >
                    List Now
                </Link>
                <Link
                    href="/login"
                    className="ml-2 px-5 py-2 rounded-full bg-[#143944] text-white hover:bg-black transition"
                >
                    Login
                </Link>
            </nav>

            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-2xl text-[#143944]"
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
        </div>
    );

    if (isHome) {
        return (
            <AnimatePresence>
                {homeAnimationDone && (
                    <motion.header
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${showBg
                            ? "bg-[#C3DFE3]/90 backdrop-blur-md shadow-md"
                            : "bg-transparent"
                            }`}
                    >
                        {content}
                    </motion.header>
                )}
            </AnimatePresence>
        );
    }

    return (
        <header className="sticky top-0 z-50 bg-[#C3DFE3]">
            {content}
        </header>
    );
};

export default HomeHeader;
