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
} from "@/app/type";
import api from "@/app/service/api";
import dayjs from "dayjs";
import EditBooking from "../editBooking/EditBooking";
import DelBooking from "../deleteBooking/DelBooking";

export default function TableData({ reload }: { reload: number }) {
  const [data, setData] = useState<TBookingView[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<TBooking2 | null>(null);

  const fetchUsers = async () => {
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
      const bookingsWithUser: TBookingView[] = bookings.map((booking) => {
        const user = users.find((user) => user.id === booking.maNguoiDung);
        const room = rooms.find((room) => room.id === booking.maPhong);
        return {
          ...booking,
          roomName: room?.tenPhong ?? "-",
          ngayDen: dayjs(booking.ngayDen).format("DD/MM/YYYY"),
          ngayDi: dayjs(booking.ngayDi).format("DD/MM/YYYY"),
          userName: user?.name ?? "-",
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
      title: "Check-in",
      dataIndex: "ngayDen",
      key: "ngayDen",
      width: 280,
    },
    {
      title: "Check-out",
      dataIndex: "ngayDi",
      key: "ngayDi",
      width: 280,
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
        dataSource={data}
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
