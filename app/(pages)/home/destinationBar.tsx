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
    const [guests, setGuests] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const removeAccents = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await api.get("vi-tri");
                setAllLocations(response.data?.content || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        if (selectedLocation && keyword === selectedLocation.tenViTri) {
            setIsOpen(false);
            return;
        }

        if (!keyword.trim()) {
            setFilteredLocations(allLocations);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        setIsLoading(true);

        debounceRef.current = setTimeout(() => {
            const normalizedKeyword = removeAccents(keyword);

            const result = allLocations.filter(item => {
                const searchString = removeAccents(
                    `${item.tenViTri} ${item.tinhThanh} ${item.quocGia}`
                );
                return searchString.includes(normalizedKeyword);
            });

            setFilteredLocations(result);
            setIsLoading(false);
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [keyword, allLocations, selectedLocation, isOpen]);

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
    };

    return (
        <div className="w-full border-3 border-red-300 lg:rounded-full rounded-2xl p-2 flex flex-col lg:flex-row items-stretch gap-2 bg-white transition-all duration-300">
            <div className="relative flex-[1.5] w-full transition-all duration-300" ref={dropdownRef}>
                <div className="w-full h-full px-5 py-3 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300 flex items-center">
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            if (selectedLocation) setSelectedLocation(null);
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
                                        <img
                                            src={item.hinhAnh}
                                            alt={item.tenViTri}
                                            className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                                        />
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

            <div className="flex-1 w-full px-5 py-3 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                />
            </div>

            <div className="flex-1 w-full px-5 py-3 lg:rounded-full rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent focus-within:border-gray-300">
                <input
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="Add guests"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
            </div>

            <Link
                href={selectedLocation ? `/${selectedLocation.id}` : "#"}
                className={`w-full lg:w-auto px-7 py-3 lg:rounded-full rounded-xl bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:brightness-110 active:scale-95 ${!selectedLocation ? "pointer-events-none opacity-50" : ""}`}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                Search
            </Link>
        </div>
    );
};

export default DestinationBar;
