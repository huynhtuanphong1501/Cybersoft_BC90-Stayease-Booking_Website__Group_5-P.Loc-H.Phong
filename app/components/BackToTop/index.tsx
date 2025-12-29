"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

const BackToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const main = document.querySelector("main");

        const handleScroll = () => {
            if (main && main.scrollHeight > main.clientHeight) {
                setShowButton(main.scrollTop > 300);
            } else {
                setShowButton(window.scrollY > 300);
            }
        };

        window.addEventListener("scroll", handleScroll);
        if (main) main.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (main) main.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        const main = document.querySelector("main");
        if (main && main.scrollHeight > main.clientHeight) {
            main.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        showButton && (
            <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="fixed bottom-[18%] sm:bottom-[15%] md:bottom-[10%] lg:bottom-[5%] right-[4%] sm:right-[3%] w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-black/70 backdrop-blur text-white flex items-center justify-center rounded-full shadow-xl transition-all duration-300 z-[60] cursor-pointer opacity-40 hover:opacity-100 hover:bg-rose-500 hover:scale-110"
            >
                <FontAwesomeIcon icon={faChevronUp} className="text-xs sm:text-sm md:text-lg lg:text-xl" />
            </button>
        )
    );
};

export default BackToTopButton;
