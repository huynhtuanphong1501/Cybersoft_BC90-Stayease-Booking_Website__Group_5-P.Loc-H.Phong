"use client";

import { useEffect, useState, useRef } from "react";
import api from "./service/api";
import { TDestination } from "./type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const DestinationBar = () => {
    const [locations, setLocations] = useState<TDestination[]>([]);
    const [keyword, setKeyword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get("/vi-tri");
                setLocations(res.data?.content || []);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredLocations = locations.filter(item =>
        `${item.tenViTri} ${item.tinhThanh} ${item.quocGia}`
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    const handleSelectLocation = (locationName: string) => {
        setKeyword(locationName);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col lg:flex-row items-center w-full gap-3">
            {/* --- LOCATION SECTION --- */}
            <div className="relative flex-[1.5] w-full" ref={dropdownRef}>
                <div
                    className={`flex flex-col px-6 py-3 rounded-full transition-all duration-300 border border-gray-200
                        ${isOpen ? "bg-white shadow-lg" : "hover:bg-gray-50"} cursor-text`}
                >
                    <label className="text-[11px] font-black tracking-widest uppercase text-gray-800">
                        Location
                    </label>
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder="Where are you going?"
                        className="bg-transparent text-sm outline-none placeholder:text-gray-400 w-full mt-0.5"
                    />
                </div>

                {/* Dropdown Results */}
                {isOpen && keyword && filteredLocations.length > 0 && (
                    <div className="absolute top-[120%] left-0 w-full min-w-[400px] bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="max-h-[420px] overflow-y-auto p-4 scrollbar-hide">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 ml-4 tracking-tighter">Popular Destinations</p>
                            {filteredLocations.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelectLocation(item.tenViTri)}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer transition-all duration-200"
                                >
                                    <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            src={item.hinhAnh}
                                            alt={item.tenViTri}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 hover:text-rose-500 transition-colors">{item.tenViTri}</span>
                                        <span className="text-gray-500 text-xs font-medium">
                                            {item.tinhThanh}, {item.quocGia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- DATES SECTION --- */}
            <div className="flex-1 w-full px-6 py-3 hover:bg-gray-50 rounded-full transition-all duration-300 cursor-pointer">
                <label className="text-[11px] font-black tracking-widest uppercase text-gray-800">
                    Dates
                </label>
                <div className="text-sm text-gray-500 mt-0.5">Add dates</div>
            </div>

            {/* --- GUESTS SECTION --- */}
            <div className="flex-1 w-full px-6 py-3 hover:bg-gray-50 rounded-full transition-all duration-300 cursor-pointer">
                <label className="text-[11px] font-black tracking-widest uppercase text-gray-800">
                    Guests
                </label>
                <div className="text-sm text-gray-500 mt-0.5">Add guests</div>
            </div>

            {/* --- SEARCH BUTTON --- */}
            <div>
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 lg:rounded-full rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                    <span className="font-bold text-sm">Search</span>
                </button>
            </div>
        </div>
    );
};

export default DestinationBar;
