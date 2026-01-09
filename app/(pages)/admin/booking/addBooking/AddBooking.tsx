"use client";
import { Button, DatePicker, Form, InputNumber, Select, message } from "antd";
import { useState, useEffect } from "react";
import ModalCmps from "@/app/(pages)/admin/_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { AddProps } from "@/app/type";
import type { TRooms, TUser } from "@/app/type";

export default function AddBooking({ onSuccess }: AddProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const [room, setRoom] = useState<TRooms[]>([]);
  const [user, setUser] = useState<TUser[]>([]);

  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { RangePicker } = DatePicker;

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [checkIn, checkOut] = values.dateRange;
      await api.post("/dat-phong", {
        maPhong: values.maPhong,
        maNguoiDung: values.maNguoiDung,
        soLuongKhach: values.soLuongKhach,
        ngayDen: checkIn.format("YYYY-MM-DD"),
        ngayDi: checkOut.format("YYYY-MM-DD"),
      });

      message.success("Create booking success");
      onSuccess();
      setOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          form.resetFields();
        }}
      >
        Create Booking
      </Button>

      <ModalCmps
        open={open}
        title="Create Booking"
        okText="Create"
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            gender: false,
          }}
        >
          <Form.Item
            label="Room Name"
            name="maPhong"
            rules={[{ required: true, message: "Please input!" }]}
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
            rules={[
              { required: true, message: "Please input guest number" },
              {
                type: "number",
                min: 1,
                message: "Guests must be greater than 0",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Check-in / Check-out"
            name="dateRange"
            rules={[{ required: true, message: "Please select date range!" }]}
          >
            <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="maNguoiDung"
            rules={[{ required: true, message: "Please input!" }]}
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
    </>
  );
}
