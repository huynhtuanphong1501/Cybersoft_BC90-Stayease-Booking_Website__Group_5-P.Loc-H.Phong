"use client";
import { Popconfirm, message } from "antd";
import api from "@/app/service/api";
import type { DeleteProps } from "@/app/type";

export default function DelUser({ id, onSuccess, children }: DeleteProps) {
  const handleDelete = async () => {
    if (!id) return;

    try {
      await api.delete(`/users?id=${id}`);
      message.success("Delete user success");
      onSuccess();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  return (
    <Popconfirm
      title="Delete user?"
      description="This action cannot be undone"
      okText="Yes"
      cancelText="No"
      onConfirm={handleDelete}
    >
      {children}
    </Popconfirm>
  );
}
