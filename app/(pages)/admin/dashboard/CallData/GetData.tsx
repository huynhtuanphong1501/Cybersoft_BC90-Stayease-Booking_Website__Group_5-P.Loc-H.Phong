"use client";

import api from "@/app/service/api";
import type {
  TBooking2,
  TUser,
  TRooms,
  TApiResponse,
  DashData,
} from "@/app/type";
import { useEffect, useState } from "react";
import CountUpTo from "../../_cmps/countUp/CountUpTo";
import { Spin } from "antd";

export default function GetData() {
  const [stats, setStats] = useState<DashData>({
    users: 0,
    bookings: 0,
    rooms: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes, roomsRes] = await Promise.all([
        api.get<TApiResponse<TUser>>("/users"),
        api.get<TApiResponse<TBooking2>>("/dat-phong"),
        api.get<TApiResponse<TRooms>>("/phong-thue"),
      ]);

      const users = usersRes.data.content;
      const bookings = bookingsRes.data.content;
      const rooms = roomsRes.data.content;

      const roomPriceMap = new Map<number, number>(
        rooms.map((room) => [room.id, room.giaTien]),
      );

      const calcDays = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        return Math.max(
          1,
          Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)),
        );
      };

      const totalRevenue = bookings.reduce((sum, booking) => {
        const price = roomPriceMap.get(booking.maPhong) ?? 0;
        const days = calcDays(booking.ngayDen, booking.ngayDi);
        return sum + price * days;
      }, 0);

      setStats({
        users: users.length,
        bookings: bookings.length,
        rooms: rooms.length,
        total: totalRevenue,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div>
        <Spin />
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
        <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          <CountUpTo value={stats.users} />
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
        <p className="text-xs sm:text-sm text-gray-500">Active Listings</p>
        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          <CountUpTo value={stats.rooms} />
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
        <p className="text-xs sm:text-sm text-gray-500">Total Bookings</p>
        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          <CountUpTo value={stats.bookings} />
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
        <p className="text-xs sm:text-sm text-gray-500">Monthly Revenue</p>
        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          <CountUpTo value={stats.total} prefix="$" />
        </p>
      </div>
    </div>
  );
}
