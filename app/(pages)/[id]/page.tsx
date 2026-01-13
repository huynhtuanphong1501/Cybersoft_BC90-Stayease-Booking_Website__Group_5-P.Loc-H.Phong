"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BackToTopButton from '@/app/components/BackToTop';
import HomeFooter from '@/app/components/HomeFooter';
import HomeHeader from '@/app/components/HomeHeader';
import api from '@/app/service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar, faWifi, faTv, faWind, faSwimmingPool,
    faCar, faKitchenSet, faShirt, faSlidersH
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { CityNameProps, TCity } from '@/app/type';

const CityName = ({ params }: CityNameProps) => {
    const { id } = React.use(params);
    const [rooms, setRooms] = useState<any[]>([]);
    const [dataCity, setDataCity] = useState<TCity[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const allFilterOptions = [
        { id: 'wifi', label: 'Wifi', icon: faWifi },
        { id: 'mayGiat', label: 'Washer', icon: faShirt },
        { id: 'tivi', label: 'TV', icon: faTv },
        { id: 'dieuHoa', label: 'AC', icon: faWind },
        { id: 'hoBoi', label: 'Pool', icon: faSwimmingPool },
        { id: 'doXe', label: 'Parking', icon: faCar },
        { id: 'bep', label: 'Kitchen', icon: faKitchenSet },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [roomResponse, cityResponse] = await Promise.all([
                    api.get(`phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`),
                    api.get("vi-tri")
                ]);
                setRooms(roomResponse.data?.content || []);
                setDataCity(cityResponse.data?.content || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const availableFilters = useMemo(() => {
        return allFilterOptions.filter(option =>
            rooms.some(room => room[option.id] === true)
        );
    }, [rooms]);

    const toggleFilter = (filterId: string) => {
        setSelectedFilters(prev =>
            prev.includes(filterId) ? prev.filter(i => i !== filterId) : [...prev, filterId]
        );
    };

    const currentCity = dataCity?.find((city: TCity) => Number(id) === city.id);

    const filteredRooms = useMemo(() => {
        if (selectedFilters.length === 0) return rooms;
        return rooms.filter(room => selectedFilters.every(f => room[f] === true));
    }, [rooms, selectedFilters]);

    const mapUrl = useMemo(() => {
        if (!currentCity) return null;
        const query = encodeURIComponent(`${currentCity.tenViTri}, ${currentCity.tinhThanh}`);
        return `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }, [currentCity]);

    const getRandomRating = () => {
        const ratings = [2, 2.5, 3, 3.5, 4, 4.5, 5];
        return ratings[Math.floor(Math.random() * ratings.length)];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="h-12 w-12 rounded-full border-4 border-[#65727D]  border-t-[#ED1B24] animate-spin"></div>
            </div>
        );
    }

    const AmenityIcon = ({ icon, label }: { icon: any; label: string }) => (
        <div className="group/tool relative cursor-pointer">
            <div className="p-2 bg-white  text-[#65727D] rounded-lg transition-all duration-300 group-hover/tool:bg-black group-hover/tool:text-white">
                <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tool:opacity-100 transition-all duration-300 whitespace-nowrap z-1 pointer-events-none font-medium">
                {label}
            </div>
        </div>
    );

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans">
            <HomeHeader />

            <main>
                {currentCity && (
                    <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
                        <img
                            src={currentCity.hinhAnh && currentCity.hinhAnh !== "" ? currentCity.hinhAnh : "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
                            alt={currentCity.tenViTri}
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-6 left-0 w-full px-4 sm:px-6 md:px-10 lg:px-20">
                            <div className="app-container mx-auto">
                                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight">
                                    {currentCity.tenViTri}
                                </h1>
                                <p className="text-white/80 font-bold uppercase text-[10px] sm:text-xs tracking-widest mt-2">
                                    {currentCity.quocGia} • Premium Collection
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sticky top-0 z-1 bg-white border-b border-[#B6D9E0] py-4 shadow-sm">
                    <div className="app-container mx-auto">
                        <div className='flex flex-col gap-3'>
                            <div className="flex items-center gap-2 pr-3 shrink-0">
                                <FontAwesomeIcon icon={faSlidersH} className="text-[#65727D] text-sm" />
                                <span className="text-[10px] sm:text-xs font-black uppercase text-black">Filters</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {availableFilters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => toggleFilter(filter.id)}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer text-[10px] sm:text-[11px] font-bold uppercase
                                        ${selectedFilters.includes(filter.id)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-[#65727D] border-[#65727D]  hover:border-black'}`}
                                    >
                                        <FontAwesomeIcon icon={filter.icon} />
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="app-container mx-auto py-6 md:py-10">
                    <div className="flex flex-col lg:flex-row gap-6 xl:gap-10">
                        <div className="w-full lg:w-3/5 order-2 lg:order-1">
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#143944] ">{filteredRooms.length} stays found</h2>
                                <p className="text-[#65727D] text-xs sm:text-sm">Prices include a 20% membership discount.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {filteredRooms.length > 0 ? (
                                    filteredRooms.map((room) => {
                                        const originalPrice = Math.round(room.giaTien / 0.8);
                                        return (
                                            <Link
                                                key={room.id}
                                                href={`/detail/${room.id}`}
                                                className="group block bg-white rounded-2xl border border-[#335765]  overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
                                            >
                                                <div className="flex flex-col sm:flex-row h-full">
                                                    <div className="relative w-full sm:w-56 md:w-64 lg:w-72 shrink-0 overflow-hidden h-48 sm:h-auto">
                                                        <img
                                                            src={room.hinhAnh && room.hinhAnh !== "" ? room.hinhAnh : "https://via.placeholder.com/400x300?text=No+Image"}
                                                            alt={room.tenPhong}
                                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                                                        <h3 className="text-base sm:text-lg font-bold text-[#143944] hover:text-[#335765] transition-colors duration-300 line-clamp-1 mb-1">{room.tenPhong}</h3>
                                                        <div className="text-[10px] font-bold text-[#65727D] uppercase tracking-widest mb-3">
                                                            {room.khach} guests • {room.phongNgu} room • {room.giuong} beds
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {room.wifi && <AmenityIcon icon={faWifi} label="Wifi" />}
                                                            {room.mayGiat && <AmenityIcon icon={faShirt} label="Washer" />}
                                                            {room.hoBoi && <AmenityIcon icon={faSwimmingPool} label="Pool" />}
                                                            {room.doXe && <AmenityIcon icon={faCar} label="Parking" />}
                                                            {room.tivi && <AmenityIcon icon={faTv} label="TV" />}
                                                        </div>
                                                        <div className="mt-auto pt-4 border-t border-[#B6D9E0] flex flex-col justify-between sm:justify-end items-end gap-2">
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[#65727D] line-through text-[10px] sm:text-xs font-bold">${originalPrice}</span>
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-lg sm:text-xl font-black text-[#47242B] ">${room.giaTien}</span>
                                                                    <span className="text-[9px] sm:text-[10px] font-bold text-[#65727D] uppercase">/ night</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between w-full sm:mt-1">
                                                                <div className="flex items-center gap-1.5 bg-white  px-2 py-1 sm:px-2.5 rounded-lg">
                                                                    <FontAwesomeIcon icon={faStar} className="text-amber-500 text-[10px] sm:text-xs" />
                                                                    <span className="text-[10px] sm:text-xs font-black text-[#7D6834] ">{getRandomRating()}</span>
                                                                </div>
                                                                <div className="bg-linear-to-br from-[#ACCAD5] to-[#F0944D] text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-[10px] sm:text-xs hover:bg-linear-to-br hover:from-[#F0944D] hover:to-black hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10">
                                                                    Check Availability
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-dashed border-[#65727D] ">
                                        <p className="text-[#65727D] font-bold uppercase tracking-widest text-xs sm:text-sm">No matching stays</p>
                                        <button onClick={() => setSelectedFilters([])} className="mt-2 text-[#ED1B24]  font-bold underline cursor-pointer text-xs sm:text-sm transition-colors duration-300 hover:text-[#ED1B24] ">Reset filters</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-2/5 order-1 lg:order-2">
                            <div className="lg:sticky lg:top-32 h-62.5 sm:h-87.5 md:h-112.5 lg:h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-[#335765]  z-1 shadow-md">
                                {mapUrl ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        src={mapUrl}
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <span className="text-[#65727D] font-bold">Map unavailable</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BackToTopButton />
            <HomeFooter />
        </div>
    );
};

export default CityName;