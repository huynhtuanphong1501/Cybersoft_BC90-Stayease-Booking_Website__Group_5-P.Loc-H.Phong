"use client";

import { useEffect, useState, useRef } from "react";
import { TDestination } from "../../type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons";
import api from "@/app/service/api";
import Link from "next/link";

const DestinationBar = () => {
    const [allLocations, setAllLocations] = useState<TDestination[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<TDestination[]>([]);
    const [keyword, setKeyword] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<TDestination | null>(null);
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    const removeAccents = (str: string) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();

    useEffect(() => {
        api.get("vi-tri").then(res => {
            const data = res.data?.content || [];
            setAllLocations(data);
            setFilteredLocations(data);
        });
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        if (!keyword.trim()) {
            setFilteredLocations(allLocations);
            setIsLoading(false);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        setIsLoading(true);

        debounceRef.current = setTimeout(() => {
            const k = removeAccents(keyword);
            const result = allLocations.filter(item =>
                removeAccents(`${item.tenViTri} ${item.tinhThanh} ${item.quocGia}`).includes(k)
            );
            setFilteredLocations(result);
            setIsLoading(false);
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [keyword, isOpen, allLocations]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectLocation = (item: TDestination) => {
        setSelectedLocation(item);
        setKeyword(item.tenViTri);
        setIsOpen(false);
        setTimeout(() => {
            dateRef.current?.showPicker?.() || dateRef.current?.focus();
        }, 0);
    };

    const handleGuestChange = (status: boolean) => {
        setGuests(prev => {
            if (!status) return Math.max(1, prev - 1);
            return prev + 1;
        });
    };

    return (
        <div className="w-full border-3 border-red-300 lg:rounded-full rounded-2xl p-2 flex flex-col lg:flex-row items-center gap-2 bg-white transition-all duration-300 shadow-sm">
            <div className="relative flex-[1.5] w-full transition-all duration-300" ref={dropdownRef}>
                <div className="w-full h-full px-6 py-2 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex flex-col justify-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-800 ml-px">
                        Location
                    </label>
                    <div className="flex items-center">
                        <input
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
                                setSelectedLocation(null)
                                setIsOpen(true)
                            }}
                            onFocus={() => {
                                setFilteredLocations(allLocations)
                                setIsOpen(true)
                            }}
                            placeholder="Where are you going?"
                            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400 text-gray-700"
                        />
                        {isLoading && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="animate-spin text-gray-400 ml-2 w-3 h-3"
                            />
                        )}
                    </div>
                </div>

                {isOpen && filteredLocations.length > 0 && (
                    <div className="absolute top-[115%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-1 overflow-hidden">
                        <div className="max-h-80 overflow-y-auto p-2">
                            {filteredLocations.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelectLocation(item)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <img
                                            src={item.hinhAnh}
                                            alt={item.tenViTri}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-gray-800">
                                            {item.tenViTri}
                                        </span>
                                        <span className="text-[11px] text-gray-500">
                                            {item.tinhThanh}, {item.quocGia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div
                className="flex-1 w-full px-6 py-2 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex flex-col justify-center cursor-pointer"
                onClick={() => dateRef.current?.showPicker?.()}
            >
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-800 ml-px">
                    Check-in
                </label>
                <input
                    ref={dateRef}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                />
            </div>

            <div className="flex-1 w-full px-6 py-2 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex flex-col justify-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-800 ml-px">
                    Guests
                </label>
                <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-0.5">
                        <button
                            type="button"
                            disabled={guests === 1}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleGuestChange(false)
                            }}
                            className="w-5 h-5 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-200 transition-all text-gray-600 disabled:opacity-50 text-xs font-bold cursor-pointer"
                        >
                            -
                        </button>
                        <span className="text-xs font-bold text-gray-800 min-w-3 text-center">
                            {guests}
                        </span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleGuestChange(true)
                            }}
                            className="w-5 h-5 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-200 transition-all text-gray-600 text-xs font-bold cursor-pointer"
                        >
                            +
                        </button>
                    </div>
                    <span className="text-sm text-gray-500 font-medium truncate">
                        {guests > 1 ? "Guests" : "Guest"}
                    </span>
                </div>
            </div>

            <Link
                href={selectedLocation ? `/${selectedLocation.id}` : "#"}
                className={`w-full lg:w-auto px-10 h-13 lg:rounded-full rounded-xl bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shrink-0 ${!selectedLocation ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }`}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                <span>Search</span>
            </Link>
        </div>

    );
};

export default DestinationBar;
