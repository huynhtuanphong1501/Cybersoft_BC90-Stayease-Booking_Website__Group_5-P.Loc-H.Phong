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
        const response = await api.get(`phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`)
        rooms = response.data?.content || []
    } catch (error) {
        console.log(error);
    }

    try {
        const response = await api.get("vi-tri")
        dataCity = response?.data.content || []
    } catch (error) {
        console.log(error);
    }

    const renderCityName = () => {
        const city = dataCity?.find((city: TCity) => Number(id) === city.id);
        if (!city) return null;

        return (
            <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[380px] overflow-hidden">
                <img
                    src={city.hinhAnh || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
                    alt={city.tenViTri}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-6 sm:bottom-10 left-0 w-full px-4 sm:px-6 md:px-10 lg:px-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex items-center gap-2 text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-rose-500" />
                            <span>{city.quocGia}</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                            {city.tenViTri}, {city.tinhThanh}
                        </h1>
                    </div>
                </div>
            </div>
        );
    };

    const AmenityIcon = ({ icon, label }: { icon: any; label: string }) => (
        <div className="group/tool relative cursor-help">
            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg transition-colors group-hover/tool:bg-slate-900 group-hover/tool:text-white">
                <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tool:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-medium">
                {label}
            </div>
        </div>
    )

    const renderRoomCard = (room: any) => {
        const originalPrice = Math.round(room.giaTien / 0.8)

        return (
            <div key={room.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row border border-slate-200 overflow-hidden group">
                <div className="relative w-full h-52 sm:h-64 md:w-72 lg:w-80 xl:w-96 shrink-0 overflow-hidden">
                    <img
                        src={room.hinhAnh || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                        alt={room.tenPhong}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                        <FontAwesomeIcon icon={faTag} />
                        -20% Off
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-5 lg:p-7">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="space-y-1.5 flex-1">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                {room.tenPhong}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <span>{room.khach} guests</span>
                                <span>•</span>
                                <span>{room.phongNgu} room</span>
                                <span>•</span>
                                <span>{room.giuong} beds</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm sm:text-base line-clamp-2 leading-relaxed font-medium mb-6">
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

                    <div className="flex justify-between items-end mt-auto pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <FontAwesomeIcon icon={faStar} className="text-amber-500 text-sm" />
                            <span className="text-slate-900 font-black text-sm">4.9</span>
                        </div>

                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                            <div className="flex flex-col items-end">
                                <span className="text-slate-300 line-through text-[11px] font-bold">${originalPrice}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-900">${room.giaTien}</span>
                                    <span className="text-slate-400 font-bold text-[10px] uppercase">/ night</span>
                                </div>
                            </div>
                            <Link
                                href={`/detail/${room.id}`}
                                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-all duration-300 text-sm shadow-md active:scale-95 text-center">
                                Check Availability
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans">
            <HomeHeader />

            <main className="pb-20">
                {renderCityName()}

                <div className='app-container mx-auto px-4 mt-8'>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{rooms.length} stays available</h2>
                            <p className="text-slate-500 text-sm font-medium">Book your perfect home in {dataCity?.find((c: TCity) => Number(id) === c.id)?.tenViTri}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-slate-600 text-xs font-bold uppercase tracking-tighter italic">20% Discount applied to all results</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {rooms.length > 0 ? rooms.map(renderRoomCard) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No vacancy found</h2>
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