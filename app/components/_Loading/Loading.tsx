"use client";

import React, { useEffect, useState } from "react";

const Loading = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <section className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <div
                    className="
        rounded-full border-2 border-gray-200 animate-spin
        h-8 w-8
        sm:h-10 sm:w-10
        md:h-12 md:w-12
        lg:h-14 lg:w-14
        xl:h-16 xl:w-16
        2xl:h-20 2xl:w-20
      "
                />

                <div
                    className="
        absolute inset-0 rounded-full border-2 border-transparent border-t-[#a50000] animate-spin
        h-8 w-8
        sm:h-10 sm:w-10
        md:h-12 md:w-12
        lg:h-14 lg:w-14
        xl:h-16 xl:w-16
        2xl:h-20 2xl:w-20
      "
                />
            </div>

            <p
                className="
      mt-4 uppercase tracking-widest text-gray-400
      text-[10px]
      sm:text-xs
      md:text-sm
      lg:text-base
      xl:text-lg
    "
            >
                Please wait
            </p>
        </section>
    );
};

export default Loading;
