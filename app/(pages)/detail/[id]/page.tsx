"use client";

import React, { useState, useEffect } from "react";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import api from "@/app/service/api";
import {
    Wifi, Tv, Snowflake, Waves, UtensilsCrossed,
    Bed, Car, Shirt, Users, Bath, DoorOpen, Star,
    MapPin, Share, Heart
} from "lucide-react";
import { DetailRoomProps, TCity } from "@/app/type";

const DetailRoom = ({ params }: DetailRoomProps) => {
    const { id } = React.use(params);
    const [dataRoom, setDataRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dataCity, setDataCity] = useState<TCity[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await api.get(`phong-thue/${id}`);
                setDataRoom(response?.data?.content);
            } catch (error) {
                console.error("Error fetching room data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get("vi-tri")
                setDataCity(response?.data.content || [])
            } catch (error) {
                console.log(error)
            }
        }
        fetchCities()
    }, [])

    const renderCityName = () => {
        const city = dataCity?.find((city: TCity) => Number(id) === city.id)
        if (!city) return <span>Loading...</span>

        return (
            <span>Mã vị trí: {city.tenViTri}, {city.tinhThanh}, {city.quocGia}</span>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (!dataRoom) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold">Room not found.</p>
            </div>
        );
    }

    const amenities = [
        { name: "Free Wi-Fi", icon: <Wifi size={20} />, available: dataRoom.wifi },
        { name: "TV", icon: <Tv size={20} />, available: dataRoom.tivi },
        { name: "Air Conditioning", icon: <Snowflake size={20} />, available: dataRoom.dieuHoa },
        { name: "Swimming Pool", icon: <Waves size={20} />, available: dataRoom.hoBoi },
        { name: "Kitchen", icon: <UtensilsCrossed size={20} />, available: dataRoom.bep },
        { name: "Beds", icon: <Bed size={20} />, available: dataRoom.giuong > 0 },
        { name: "Free Parking", icon: <Car size={20} />, available: dataRoom.doXe },
        { name: "Iron", icon: <Shirt size={20} />, available: dataRoom.banLa },
    ];

    const handleReserve = () => {
        const user = localStorage.getItem("USER_LOGIN");
        if (!user) {
            alert("Bạn phải đăng nhập để tiến hành đặt phòng này");
            const modalLogin = document.getElementById("modal-login");
            if (modalLogin) {
                modalLogin.style.display = "block";
                const registerTab = document.getElementById("switch-to-register");
                if (registerTab) (registerTab as HTMLElement).click();
            }
            return;
        }
    };

    return (
        <>
            <HomeHeader />
            <main className="app-container mx-auto px-4 py-8 font-sans antialiased text-slate-900 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{dataRoom.tenPhong}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                            <div className="flex items-center gap-1 cursor-pointer">
                                <Star className="fill-rose-500 text-rose-500" size={16} />
                                <span>4.95 · 84 reviews</span>
                            </div>
                            <div className="flex items-center gap-1 underline cursor-pointer hover:text-gray-600">
                                <MapPin size={16} />
                                {renderCityName()}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 text-sm font-semibold underline hover:bg-gray-100 p-2 rounded-lg transition">
                            <Share size={16} /> Share
                        </button>
                        <button className="flex items-center gap-2 text-sm font-semibold underline hover:bg-gray-100 p-2 rounded-lg transition">
                            <Heart size={16} /> Save
                        </button>
                    </div>
                </div>

                <div className="relative group overflow-hidden rounded-2xl mb-10 shadow-lg aspect-video md:aspect-auto">
                    <img
                        src={dataRoom.hinhAnh}
                        alt={dataRoom.tenPhong}
                        className="w-full h-75-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <button className="absolute bottom-6 right-6 bg-white border border-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                        Show all photos
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="border-b pb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Room Overview</h2>
                            <div className="flex flex-wrap gap-6 text-slate-600">
                                <div className="flex items-center gap-2"><Users size={20} /> <span>{dataRoom.khach} guests</span></div>
                                <div className="flex items-center gap-2"><DoorOpen size={20} /> <span>{dataRoom.phongNgu} bedrooms</span></div>
                                <div className="flex items-center gap-2"><Bed size={20} /> <span>{dataRoom.giuong} beds</span></div>
                                <div className="flex items-center gap-2"><Bath size={20} /> <span>{dataRoom.phongTam} bathrooms</span></div>
                            </div>
                        </div>

                        <div className="border-b pb-8">
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">About this space</h3>
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                {dataRoom.moTa || "No description available."}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-6 text-slate-800">What this place offers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                                {amenities.map((item) => (
                                    <div
                                        key={item.name}
                                        className={`flex items-center gap-4 ${item.available ? "text-slate-700" : "text-slate-300 line-through opacity-50"}`}
                                    >
                                        <span className={item.available ? "text-rose-500" : "text-slate-300"}>
                                            {item.icon}
                                        </span>
                                        <span className="text-lg font-light">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-8 border border-slate-200 rounded-3xl shadow-2xl bg-white space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-3xl font-extrabold text-slate-900">${dataRoom.giaTien}</span>
                                    <span className="text-slate-500 text-lg"> / night</span>
                                </div>
                            </div>

                            <div className="border border-slate-300 rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-2 border-b border-slate-300">
                                    <div className="p-4 border-r border-slate-300 hover:bg-slate-50 transition cursor-pointer">
                                        <p className="text-[10px] font-black uppercase text-slate-900">Check-in</p>
                                        <p className="text-sm text-slate-500">Add date</p>
                                    </div>
                                    <div className="p-4 hover:bg-slate-50 transition cursor-pointer">
                                        <p className="text-[10px] font-black uppercase text-slate-900">Check-out</p>
                                        <p className="text-sm text-slate-500">Add date</p>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-slate-50 transition cursor-pointer">
                                    <p className="text-[10px] font-black uppercase text-slate-900">Guests</p>
                                    <p className="text-sm text-slate-900 font-medium">{dataRoom.khach} guests</p>
                                </div>
                            </div>

                            <button
                                onClick={handleReserve}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-xl transition-all active:scale-95 shadow-lg"
                            >
                                Reserve
                            </button>

                            <div className="text-center space-y-3">
                                <p className="text-sm text-slate-500">You won&apos;t be charged yet</p>
                                <div className="flex justify-between text-slate-600">
                                    <span className="underline">Service fee</span>
                                    <span>$0</span>
                                </div>
                                <hr className="border-slate-100" />
                                <div className="flex justify-between font-bold text-lg text-slate-900 pt-2">
                                    <span>Total</span>
                                    <span>${dataRoom.giaTien}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <HomeFooter />
        </>
    );
};

export default DetailRoom;