"use client";

import { useEffect, useState } from "react";
import api from "./service/api";
import { TDestination } from "./type";

const DestinationBar = () => {
    const [locations, setLocations] = useState<TDestination[]>([]);
    const [keyword, setKeyword] = useState("");
    console.log(keyword);


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get("/vi-tri");
                setLocations(res.data?.content || []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchLocations();
    }, []);

    const filteredLocations = locations.filter(item =>
        `${item.tenViTri} ${item.tinhThanh} ${item.quocGia}`
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    return (
        <div className="relative flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Location"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
                />

                {keyword && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                        {filteredLocations.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            >
                                <img
                                    src={item.hinhAnh}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="text-sm">
                                    <div className="font-semibold">
                                        {item.tenViTri}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {item.tinhThanh}, {item.quocGia}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <input
                placeholder="Dates"
                className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <input
                placeholder="Guests"
                className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
            />

            <button className="bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
                Search
            </button>
        </div>
    );
};

export default DestinationBar;
