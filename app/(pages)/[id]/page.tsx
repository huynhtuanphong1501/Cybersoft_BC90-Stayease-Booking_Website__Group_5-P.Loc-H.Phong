import BackToTopButton from '@/app/components/BackToTop'
import HomeFooter from '@/app/components/HomeFooter'
import HomeHeader from '@/app/components/HomeHeader'
import api from '@/app/service/api'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser, faBed, faBath, faStar, faTag,
    faWifi, faTv, faWind, faSwimmingPool,
    faCar, faKitchenSet, faShirt
} from '@fortawesome/free-solid-svg-icons'

interface CityNameProps {
    params: Promise<{ id: string }>
}

const CityName = async ({ params }: CityNameProps) => {
    const { id } = await params;
    let rooms = [];

    try {
        const response = await api.get(`phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`);
        rooms = response.data?.content || [];
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <HomeHeader />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Stays in Location {id}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {rooms.length} places to stay • <span className="text-rose-500 font-bold underline cursor-pointer">All deals 20% off</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {rooms.length > 0 ? (
                        rooms.map((room: any) => {
                            const randomRating = (Math.floor(Math.random() * 7) * 0.5 + 2).toFixed(1);
                            const originalPrice = Math.round(room.giaTien / 0.8);

                            return (
                                <div key={room.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row border border-slate-200 overflow-hidden cursor-pointer">

                                    {/* Thumbnail */}
                                    <div className="relative w-full md:w-72 lg:w-80 shrink-0 h-56 md:h-auto overflow-hidden">
                                        <img
                                            src={room.hinhAnh || 'https://via.placeholder.com/400x300?text=Room'}
                                            alt={room.tenPhong}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                                            <FontAwesomeIcon icon={faTag} />
                                            -20% Off
                                        </div>
                                    </div>

                                    {/* Detail */}
                                    <div className="p-5 lg:p-7 flex flex-col justify-between flex-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                                    {room.tenPhong}
                                                </h3>
                                                <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-lg font-bold shrink-0">
                                                    <FontAwesomeIcon icon={faStar} className="text-amber-500" />
                                                    <span>{randomRating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                                <span>{room.khach} guests</span>
                                                <span>•</span>
                                                <span>{room.phongNgu} room</span>
                                                <span>•</span>
                                                <span>{room.giuong} beds</span>
                                            </div>

                                            <p className="text-slate-400 text-sm mt-3 line-clamp-1 font-medium">
                                                {room.moTa || 'Premium experience with high-end facilities and great view.'}
                                            </p>

                                            {/* Amenities Chips (Small) */}
                                            <div className="flex flex-wrap gap-1.5 mt-5">
                                                {room.wifi && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="Wifi"><FontAwesomeIcon icon={faWifi} className="w-3.5 h-3.5" /></div>}
                                                {room.tivi && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="TV"><FontAwesomeIcon icon={faTv} className="w-3.5 h-3.5" /></div>}
                                                {room.dieuHoa && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="Air Con"><FontAwesomeIcon icon={faWind} className="w-3.5 h-3.5" /></div>}
                                                {room.hoBoi && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="Pool"><FontAwesomeIcon icon={faSwimmingPool} className="w-3.5 h-3.5" /></div>}
                                                {room.doXe && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="Parking"><FontAwesomeIcon icon={faCar} className="w-3.5 h-3.5" /></div>}
                                                {room.bep && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="Kitchen"><FontAwesomeIcon icon={faKitchenSet} className="w-3.5 h-3.5" /></div>}
                                                {room.mayGiat && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors cursor-pointer" title="Laundry"><FontAwesomeIcon icon={faShirt} className="w-3.5 h-3.5" /></div>}
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-slate-300 line-through text-xs font-bold leading-none">
                                                    ${originalPrice}
                                                </span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-slate-900">${room.giaTien}</span>
                                                    <span className="text-slate-400 font-bold text-[10px] uppercase">/ night</span>
                                                </div>
                                            </div>

                                            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-rose-600 transition-all duration-300 text-sm cursor-pointer shadow-md active:scale-95">
                                                Check Availability
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No vacancy found</h2>
                        </div>
                    )}
                </div>
            </main>

            <BackToTopButton />
            <HomeFooter />
        </div>
    )
}

export default CityName