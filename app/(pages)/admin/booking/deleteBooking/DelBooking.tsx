"use client";
import { Popconfirm, message } from "antd";
import api from "@/app/service/api";
import type { DeleteProps } from "@/app/type";

export default function DelBooking({ id, onSuccess, children }: DeleteProps) {
  const handleDelete = async () => {
    if (!id) return;

    try {
      await api.delete(`/dat-phong/${id}`);
      message.success("Delete booking success");
      onSuccess();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  return (
    <Popconfirm
      title="Delete booking?"
      description="This action cannot be undone"
      okText="Yes"
      cancelText="No"
      onConfirm={handleDelete}
    >
      {children}
    </Popconfirm>
  );
}
