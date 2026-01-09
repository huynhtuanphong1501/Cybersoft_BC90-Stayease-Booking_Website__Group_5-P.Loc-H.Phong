"use client";
import { DatePicker, Form, InputNumber, Select, message } from "antd";
import ModalCmps from "../../_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { EditProps, TBookingView, TRooms, TUser } from "@/app/type";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default function EditBooking({
  open,
  target,
  onCancel,
  onSuccess,
}: EditProps) {
  dayjs.extend(customParseFormat);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const [room, setRoom] = useState<TRooms[]>([]);
  const [user, setUser] = useState<TUser[]>([]);

  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchData = async () => {
    setLoadingRooms(true);
    setLoadingUsers(true);
    try {
      const [roomRes, userRes] = await Promise.all([
        api.get("/phong-thue"),
        api.get("/users"),
      ]);

      const rooms = roomRes.data.content;
      const users = userRes.data.content;

      setRoom(
        rooms.map((room: TRooms) => ({
          label: room.tenPhong,
          value: room.id,
        }))
      );

      setUser(
        users.map((user: TUser) => ({
          label: user.name,
          value: user.id,
        }))
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRooms(false);
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const booking = target as TBookingView;
    if (target && open) {
      form.setFieldsValue({
        maPhong: booking.maPhong,
        maNguoiDung: booking.maNguoiDung,
        soLuongKhach: booking.soLuongKhach,
        dateRange: [
          dayjs(booking.ngayDen, "DD/MM/YYYY"),
          dayjs(booking.ngayDi, "DD/MM/YYYY"),
        ],
      });
    }
  }, [target, open, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const [checkIn, checkOut] = values.dateRange;

      await api.put(`/dat-phong/${target?.id}`, {
        maPhong: values.maPhong,
        maNguoiDung: values.maNguoiDung,
        soLuongKhach: values.soLuongKhach,
        ngayDen: checkIn.format("YYYY-MM-DD"),
        ngayDi: checkOut.format("YYYY-MM-DD"),
      });

      message.success("Update booking success");
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalCmps
      open={open}
      title="Edit Booking"
      okText="Update"
      onOk={handleUpdate}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Room Name"
          name="maPhong"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            options={room}
            optionFilterProp="label"
            loading={loadingRooms}
            placeholder="Select a room"
          />
        </Form.Item>

        <Form.Item
          name="soLuongKhach"
          label="Guests"
          rules={[{ required: true }, { type: "number", min: 1 }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Check-in / Check-out"
          name="dateRange"
          rules={[{ required: true }]}
        >
          <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="User Name"
          name="maNguoiDung"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            options={user}
            optionFilterProp="label"
            loading={loadingUsers}
            placeholder="Select a user"
          />
        </Form.Item>
      </Form>
    </ModalCmps>
  );
}
