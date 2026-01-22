"use client";
import { useEffect, useState } from "react";
import { Table, Space, Flex, Tag } from "antd";
import type { TableProps } from "antd";
import type { TApiResponse, TRooms, TRoomView, TCity } from "@/app/type";
import api from "@/app/service/api";
import EditList from "../editList/EditList";
import DelList from "../deleteList/DelLocation";

export default function TableData({
  reload,
  keyword,
  utilities,
}: {
  reload: number;
  keyword: string;
  utilities: string[];
}) {
  const [data, setData] = useState<TRoomView[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<TRooms | null>(null);
  const [filteredData, setFilteredData] = useState<TRooms[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [roomRes, cityRes] = await Promise.all([
        api.get<TApiResponse<TRooms>>("/phong-thue"),
        api.get<TApiResponse<TCity>>("/vi-tri"),
      ]);
      const roomData = roomRes.data.content;
      const cityData = cityRes.data.content;

      const data = roomData.map((room) => {
        const city = cityData.find((city) => city.id === room.maViTri);
        return {
          ...room,
          tenViTri: city?.tenViTri || "Unknown",
        };
      });

      console.log(data);

      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: TRooms) => {
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
        (room) =>
          room.tenPhong.toLowerCase().includes(lower) ||
          room.moTa.toLowerCase().includes(lower),
      );
    }

    if (utilities.length > 0) {
      result = result.filter((room) =>
        utilities.every((u) => room[u as keyof TRooms] === true),
      );
    }

    setFilteredData(result);
  }, [keyword, utilities, data]);

  const getColor = (key: string): string => {
    switch (key) {
      case "mayGiat":
        return "cyan";
      case "banLa":
        return "purple";
      case "tivi":
        return "blue";
      case "dieuHoa":
        return "yellow";
      case "wifi":
        return "geekblue";
      case "bep":
        return "red";
      case "doXe":
        return "green";
      case "hoBoi":
        return "volcano";
      case "banUi":
        return "orange";
      default:
        return "default";
    }
  };

  const columns: TableProps<TRooms>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "tenPhong",
      key: "tenPhong",
      width: 280,
    },
    {
      title: "Guest",
      dataIndex: "khach",
      key: "khach",
      width: 100,
    },
    {
      title: "Bedroom",
      dataIndex: "phongNgu",
      key: "phongNgu",
      width: 100,
    },
    {
      title: "Bed",
      dataIndex: "giuong",
      key: "giuong",
      width: 100,
    },
    {
      title: "Bathroom",
      dataIndex: "phongTam",
      key: "phongTam",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "moTa",
      key: "moTa",
      width: 400,
    },
    {
      title: "Price",
      dataIndex: "giaTien",
      key: "giaTien",
      width: 180,
    },
    {
      title: "Location",
      dataIndex: "tenViTri",
      key: "tenViTri",
      width: 180,
    },
    {
      title: "Utilities",
      key: "tags",
      width: 300,
      render: (_, record: TRooms) => (
        <Flex gap="small" wrap>
          {[
            "mayGiat",
            "banLa",
            "tivi",
            "dieuHoa",
            "wifi",
            "bep",
            "doXe",
            "hoBoi",
            "banUi",
          ]
            .filter((key) => record[key as keyof TRooms])
            .map((key) => (
              <Tag color={getColor(key)} key={key}>
                {key}
              </Tag>
            ))}
        </Flex>
      ),
    },
    {
      title: "Image",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (hinhAnh: string) => (
        <img
          src={hinhAnh || "/img/default/default.png"}
          alt="room"
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
          <DelList id={record.id} onSuccess={() => fetchUsers()}>
            <a style={{ color: "red" }}>Delete</a>
          </DelList>
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
      <EditList
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
