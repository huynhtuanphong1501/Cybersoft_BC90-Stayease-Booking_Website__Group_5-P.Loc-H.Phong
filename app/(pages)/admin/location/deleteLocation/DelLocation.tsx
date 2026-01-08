"use client";
import { Popconfirm, message } from "antd";
import api from "@/app/service/api";
import type { DeleteProps } from "@/app/type";

export default function DelLocation({ id, onSuccess, children }: DeleteProps) {
  const handleDelete = async () => {
    if (!id) return;

    try {
      await api.delete(`/vi-tri/${id}`);
      message.success("Delete location success");
      onSuccess();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  return (
    <Popconfirm
      title="Delete location?"
      description="This action cannot be undone"
      okText="Yes"
      cancelText="No"
      onConfirm={handleDelete}
    >
      {children}
    </Popconfirm>
  );
}
