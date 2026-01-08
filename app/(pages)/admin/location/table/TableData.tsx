"use client";
import { useEffect, useState } from "react";
import { Table, Space } from "antd";
import type { TableProps } from "antd";
import type { TCity } from "@/app/type";
import api from "@/app/service/api";
import EditLocation from "../editLocation/EditLocation";
import DelLocation from "../deleteLocation/DelLocation";

export default function TableData({ reload }: { reload: number }) {
  const [data, setData] = useState<TCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<TCity | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vi-tri");
      setData(response.data.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: TCity) => {
    setEditingUser(user);
    setOpenEdit(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  const columns: TableProps<TCity>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Location",
      dataIndex: "tenViTri",
      key: "tenViTri",
      width: 280,
    },
    {
      title: "Province",
      dataIndex: "tinhThanh",
      key: "tinhThanh",
      width: 180,
    },
    {
      title: "Country",
      dataIndex: "quocGia",
      key: "quocGia",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (hinhAnh: string) => (
        <img
          src={hinhAnh || "/img/default/default.png"}
          alt="Location"
          className="w-16 h-16 object-cover rounded"
        />
      ),
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <DelLocation id={record.id} onSuccess={() => fetchUsers()}>
            <a style={{ color: "red" }}>Delete</a>
          </DelLocation>
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
      <EditLocation
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
