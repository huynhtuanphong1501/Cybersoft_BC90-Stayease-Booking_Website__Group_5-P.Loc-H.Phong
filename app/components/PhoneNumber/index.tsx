"use client"

import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const PhoneNumber = () => {
    return (
        <div className="fixed bottom-[43%] sm:bottom-[30%] md:bottom-[30%] lg:bottom-[5%] left-[1%] z-100 flex flex-col gap-3 sm:gap-4">
            <a
                href="tel:+84123456789"
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-rose-800 text-white rounded-full shadow-lg hover:bg-[#143944] transition-all duration-300 hover:scale-110 active:scale-95"
                title="Call Us"
            >
                <span className="absolute inset-0 rounded-full bg-rose-800 animate-ping opacity-20 group-hover:bg-[#143944] transition-colors duration-300"></span>

                <FontAwesomeIcon
                    icon={faPhone}
                    className="relative z-10 text-lg sm:text-xl"
                />

                <span className="absolute left-16 px-3 py-1 bg-[#143944] text-white text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none rounded-sm hidden md:block">
                    Call Us Now
                </span>
            </a>
        </div>
    )
}

export default PhoneNumber
