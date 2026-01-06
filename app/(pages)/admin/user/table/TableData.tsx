"use client";
import { useEffect, useState } from "react";
import { Table, Space } from "antd";
import type { TableProps } from "antd";
import type { TUser } from "@/app/type";
import api from "@/app/service/api";
import Column from "antd/es/table/Column";

const columns: TableProps<TUser>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 180,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 280,
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    render: (gender: boolean) => (gender ? "Male" : "Female"),
    width: 120,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 160,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
    width: 180,
  },
];

export default function TableData({ reload }: { reload: number }) {
  const [data, setData] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setData(response.data.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1020 }}
      />
    </div>
  );
}
