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
        <div className="w-full border-3 border-red-300 lg:rounded-full rounded-2xl p-2 flex flex-col lg:flex-row items-stretch gap-2 bg-white transition-all duration-300">
            <div className="relative flex-[1.5] w-full transition-all duration-300" ref={dropdownRef}>
                <div className="w-full h-full px-5 py-3 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex items-center">
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setSelectedLocation(null);
                            setIsOpen(true);
                        }}
                        onFocus={() => {
                            setFilteredLocations(allLocations);
                            setIsOpen(true);
                        }}
                        placeholder="Where are you going?"
                        className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                    />
                    {isLoading && (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-400 ml-2 w-4 h-4" />
                    )}
                </div>

                {isOpen && filteredLocations.length > 0 && (
                    <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="max-h-96 overflow-y-auto p-3">
                            {filteredLocations.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelectLocation(item)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                        <img src={item.hinhAnh} alt={item.tenViTri} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-gray-800">{item.tenViTri}</span>
                                        <span className="text-xs text-gray-500">
                                            {item.tinhThanh}, {item.quocGia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 w-full px-5 py-2 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex flex-col justify-center">
                <input
                    ref={dateRef}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
                />
            </div>

            <div className="flex-1 w-full px-5 py-2 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex flex-col justify-center">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1 mt-1 w-fit">
                    <button
                        type="button"
                        disabled={guests === 1}
                        onClick={() => handleGuestChange(false)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-200 transition-all text-gray-600 disabled:opacity-50"
                    >
                        -
                    </button>

                    <span className="text-sm font-medium text-gray-700 min-w-5 text-center">
                        {guests}
                    </span>

                    <button
                        type="button"
                        onClick={() => handleGuestChange(true)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-200 transition-all text-gray-600"
                    >
                        +
                    </button>

                    <span className="text-sm text-gray-700 ml-1">
                        Guest{guests > 1 ? "s" : ""}
                    </span>
                </div>
            </div>


            <Link
                href={selectedLocation ? `/${selectedLocation.id}` : "#"}
                className={`w-full lg:w-auto px-7 py-2 lg:rounded-full rounded-xl bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${!selectedLocation ? "pointer-events-none opacity-50" : ""
                    }`}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                Search
            </Link>
        </div>
    );
};

export default DestinationBar;
