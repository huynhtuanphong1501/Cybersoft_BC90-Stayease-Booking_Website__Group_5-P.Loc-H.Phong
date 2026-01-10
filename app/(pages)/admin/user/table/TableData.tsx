"use client";
import { useEffect, useState } from "react";
import { Table, Space } from "antd";
import type { TableProps } from "antd";
import type { TUser } from "@/app/type";
import api from "@/app/service/api";
import EditUser from "../editUse/EditUser";
import DelUser from "../deleteUser/DelUser";

export default function TableData({
  reload,
  keyword,
}: {
  reload: number;
  keyword: string;
}) {
  const [data, setData] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<TUser | null>(null);
  const [filteredData, setFilteredData] = useState<TUser[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setData(response.data.content);
      setFilteredData(response.data.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: TUser) => {
    setEditingUser(user);
    setOpenEdit(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  useEffect(() => {
    const lower = keyword.toLowerCase();
    setFilteredData(
      data.filter(
        (user) =>
          user.name.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower)
      )
    );
  }, [keyword, data]);

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
          <a onClick={() => handleEdit(record)}>Edit</a>
          <DelUser id={record.id} onSuccess={() => fetchUsers()}>
            <a style={{ color: "red" }}>Delete</a>
          </DelUser>
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
      <EditUser
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
