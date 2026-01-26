"use client";
import { useEffect, useState } from "react";
import { Table, Space } from "antd";
import type { TableProps } from "antd";
import type {
  TBooking2,
  TBookingView,
  TUser,
  TRooms,
  TApiResponse,
  TCity,
} from "@/app/type";
import api from "@/app/service/api";
import dayjs from "dayjs";
import EditBooking from "../editBooking/EditBooking";
import DelBooking from "../deleteBooking/DelBooking";

export default function TableData({
  reload,
  keyword,
}: {
  reload: number;
  keyword: string;
}) {
  const [data, setData] = useState<TBookingView[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<TBooking2 | null>(null);
  const [filteredData, setFilteredData] = useState<TBookingView[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes, roomsRes, citiesRes] = await Promise.all([
        api.get<TApiResponse<TUser>>("/users"),
        api.get<TApiResponse<TBooking2>>("/dat-phong"),
        api.get<TApiResponse<TRooms>>("/phong-thue"),
        api.get<TApiResponse<TCity>>("/vi-tri"),
      ]);

      const users = usersRes.data.content;
      const bookings = bookingsRes.data.content;
      const rooms = roomsRes.data.content;
      const cities = citiesRes.data.content;
      const bookingsWithUser: TBookingView[] = bookings.map((booking) => {
        const user = users.find((user) => user.id === booking.maNguoiDung);
        const room = rooms.find((room) => room.id === booking.maPhong);
        const city = cities.find((city) => city.id === room?.id);
        return {
          ...booking,
          roomName: room?.tenPhong ?? "-",
          ngayDen: dayjs(booking.ngayDen).format("DD/MM/YYYY"),
          ngayDi: dayjs(booking.ngayDi).format("DD/MM/YYYY"),
          userName: user?.name ?? "-",
          email: user?.email ?? "-",
          tenViTri: city?.tenViTri ?? "-",
        };
      });

      setData(bookingsWithUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: TBooking2) => {
    setEditingUser(user);
    setOpenEdit(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  useEffect(() => {
    let result = data;

    if (keyword.trim()) {
      const lower = keyword.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.roomName?.toLowerCase().includes(lower) ||
          booking.userName?.toLowerCase().includes(lower) ||
          booking.tenViTri?.toLowerCase().includes(lower) ||
          booking.email?.toLowerCase().includes(lower),
      );
    }

    setFilteredData(result);
  }, [keyword, data]);

  const columns: TableProps<TBookingView>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Room ID",
      dataIndex: "maPhong",
      key: "maPhong",
      width: 180,
    },
    {
      title: "Room Name",
      dataIndex: "roomName",
      key: "roomName",
      width: 180,
    },
    {
      title: "Location",
      dataIndex: "tenViTri",
      key: "tenViTri",
      width: 180,
    },
    {
      title: "Check-in",
      dataIndex: "ngayDen",
      key: "ngayDen",
      width: 180,
    },
    {
      title: "Check-out",
      dataIndex: "ngayDi",
      key: "ngayDi",
      width: 180,
    },
    {
      title: "Guests",
      dataIndex: "soLuongKhach",
      key: "soLuongKhach",
      width: 100,
    },
    {
      title: "Guest ID",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <DelBooking id={record.id} onSuccess={() => fetchUsers()}>
            <a style={{ color: "red" }}>Delete</a>
          </DelBooking>
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
      />
      <EditBooking
        open={openEdit}
        target={editingUser}
        onCancel={() => setOpenEdit(false)}
        onSuccess={() => {
          setOpenEdit(false);
          fetchUsers();
        }}
      />
    </div>
  );
}
