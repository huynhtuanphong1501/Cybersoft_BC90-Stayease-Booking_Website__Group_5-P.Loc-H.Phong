import BackToTopButton from '@/app/components/BackToTop'
import HomeFooter from '@/app/components/HomeFooter'
import HomeHeader from '@/app/components/HomeHeader'
import api from '@/app/service/api'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTag, faWifi, faTv, faWind, faSwimmingPool, faCar, faKitchenSet, faShirt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { CityNameProps, TCity } from '@/app/type'

const CityName = async ({ params }: CityNameProps) => {
    const { id } = await params
    let rooms: any[] = []
    let dataCity: any[] = []

    try {
        const [roomResponse, cityResponse] = await Promise.all([
            api.get(`phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`),
            api.get("vi-tri")
        ])

        rooms = roomResponse.data?.content || []
        dataCity = cityResponse.data?.content || []
    } catch (error) {
        console.log(error)
    }

    const renderCityName = () => {
        const city = dataCity?.find((city: TCity) => Number(id) === city.id);
        if (!city) return null;

        return (
            <div className="relative w-full h-50 sm:h-70 md:h-80 lg:h-95 overflow-hidden">
                <img
                    src={city.hinhAnh || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
                    alt={city.tenViTri}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-6 sm:bottom-10 left-0 w-full px-4 sm:px-6 md:px-10 lg:px-20">
                    <div className="max-w-360 mx-auto">
                        <div className="flex items-center gap-2 text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-rose-500" />
                            <span>{city.quocGia}</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                            {city.tenViTri}, {city.tinhThanh}
                        </h1>
                    </div>
                </div>
            </div>
        );
    };

    const AmenityIcon = ({ icon, label }: { icon: any; label: string }) => (
        <div className="group/tool relative cursor-pointer">
            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg transition-all duration-300 group-hover/tool:bg-black group-hover/tool:text-white">
                <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] sm:text-[11px] md:text-[12px] px-2 py-1 rounded opacity-0 group-hover/tool:opacity-100 transition-all duration-300 whitespace-nowrap z-10 pointer-events-none font-medium">
                {label}
            </div>
        </div>
    );

    const renderRoomCard = (room: any) => {
        const ratings = [2, 2.5, 3, 3.5, 4, 4.5, 5];
        const rating = ratings[Math.floor(Math.random() * ratings.length)];
        const originalPrice = Math.round(room.giaTien / 0.8);

        return (
            <Link
                key={room.id}
                href={`/detail/${room.id}`}
                className="group block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row">
                    <div className="relative w-full sm:w-full md:w-72 lg:w-80 xl:w-96 shrink-0 overflow-hidden">
                        {room.hinhAnh ? (
                            <img
                                src={room.hinhAnh}
                                alt={room.tenPhong}
                                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                <span className="text-slate-500 text-sm sm:text-base md:text-base font-medium uppercase tracking-wide">
                                    No image available
                                </span>
                            </div>
                        )}
                        {room.hinhAnh && (
                            <div className="absolute top-3 left-3 bg-white text-rose-400 border border-rose-600 px-3 py-1 text-[10px] sm:text-[11px] md:text-[12px] font-bold shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                                Enjoy a Lovevery Play Kit
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="space-y-1.5 flex-1">
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-black group-hover:text-rose-600 transition-all duration-300 line-clamp-1">
                                    {room.tenPhong}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-black text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest">
                                    <span>{room.khach} guests</span>
                                    <span>•</span>
                                    <span>{room.phongNgu} room</span>
                                    <span>•</span>
                                    <span>{room.giuong} beds</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-500 text-sm sm:text-base md:text-base line-clamp-2 leading-relaxed font-medium mb-6">
                            {room.moTa || 'Premium experience with high-end facilities and great view in the heart of the city.'}
                        </p>

                        <div className="flex flex-wrap gap-2.5 mb-8">
                            {room.wifi && <AmenityIcon icon={faWifi} label="Free WiFi" />}
                            {room.tivi && <AmenityIcon icon={faTv} label="Smart TV" />}
                            {room.dieuHoa && <AmenityIcon icon={faWind} label="AC System" />}
                            {room.hoBoi && <AmenityIcon icon={faSwimmingPool} label="Pool" />}
                            {room.doXe && <AmenityIcon icon={faCar} label="Parking" />}
                            {room.bep && <AmenityIcon icon={faKitchenSet} label="Kitchen" />}
                            {room.mayGiat && <AmenityIcon icon={faShirt} label="Laundry" />}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-end mt-auto pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <FontAwesomeIcon icon={faStar} className="text-amber-500 text-sm sm:text-base md:text-base" />
                                <span className="text-[#7D3719] font-bold text-sm sm:text-base md:text-base">{rating}</span>
                            </div>

                            <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-end gap-2 w-full sm:w-auto">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-tighter">
                                            -20%
                                        </span>
                                        <span className="text-rose-600 line-through text-[11px] sm:text-[12px] md:text-[13px] font-bold">${originalPrice}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-black font-bold text-sm sm:text-base md:text-base lg:text-lg">
                                            FROM
                                        </span>
                                        <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-black">${room.giaTien}</span>
                                        <span className="text-black font-bold text-xs sm:text-sm md:text-sm lg:text-base">
                                            per night
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base md:text-base shadow-md text-center mt-2 transition-all duration-300 hover:bg-rose-600 cursor-pointer">
                                    Check Availability
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans">
            <HomeHeader />

            <main className="pb-20">
                {renderCityName()}

                <div className="app-container mx-auto pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-bold text-black">{rooms.length} stays available</h2>
                            <p className="text-slate-500 text-sm sm:text-base font-medium">
                                Book your perfect home in {dataCity?.find((c: TCity) => Number(id) === c.id)?.tenViTri}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 sm:px-6 py-2 rounded-xl border border-slate-200 shadow-md self-start">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-tighter italic">
                                20% Discount applied to all results
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {rooms.length > 0 ? rooms.map(renderRoomCard) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
                                <h2 className="text-xl font-bold text-black uppercase tracking-widest">No vacancy found</h2>
                                <Link href="/" className="mt-4 inline-block text-rose-500 font-bold underline">Discover other cities</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <BackToTopButton />
            <HomeFooter />
        </div>
    )
}

export default CityName;