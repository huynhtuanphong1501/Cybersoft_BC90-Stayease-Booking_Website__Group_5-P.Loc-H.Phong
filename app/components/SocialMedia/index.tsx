"use client"

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faInstagram, faLinkedinIn, faYoutube } from "@fortawesome/free-brands-svg-icons"

const SocialMedia = () => {
    return (
        <div className="hidden lg:flex left-1 bottom-[20%] z-1 flex-col gap-2 sm:gap-3">
            <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 flex items-center justify-center bg-transparent border border-[#C4A453] text-[#C4A453] rounded-lg xl:rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:scale-110">
                <FontAwesomeIcon icon={faFacebookF} className="text-xs sm:text-sm md:text-base" />
            </button>

            <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 flex items-center justify-center bg-transparent border border-[#C4A453] text-[#C4A453] rounded-lg xl:rounded-xl cursor-pointer transition-all duration-300 hover:bg-linear-to-br hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:border-transparent hover:text-white hover:scale-110">
                <FontAwesomeIcon icon={faInstagram} className="text-xs sm:text-sm md:text-base" />
            </button>

            <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 flex items-center justify-center bg-transparent border border-[#C4A453] text-[#C4A453] rounded-lg xl:rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:scale-110">
                <FontAwesomeIcon icon={faYoutube} className="text-xs sm:text-sm md:text-base" />
            </button>

            <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 flex items-center justify-center bg-transparent border border-[#C4A453] text-[#C4A453] rounded-lg xl:rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:scale-110">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-xs sm:text-sm md:text-base" />
            </button>
        </div>
    )
}

export default SocialMedia
