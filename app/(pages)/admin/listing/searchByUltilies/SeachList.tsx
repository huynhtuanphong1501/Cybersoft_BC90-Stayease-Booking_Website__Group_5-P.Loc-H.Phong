"use client";
import { Select } from "antd";

const OPTIONS = [
  { label: "Wifi", value: "wifi" },
  { label: "Máy giặt", value: "mayGiat" },
  { label: "Bàn là", value: "banLa" },
  { label: "TV", value: "tivi" },
  { label: "Hồ bơi", value: "hoBoi" },
  { label: "Đỗ xe", value: "doXe" },
  { label: "Bàn ủi", value: "banUi" },
];

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
};

export default function SearchList({ value, onChange }: Props) {
  return (
    <Select
      className=""
      mode="multiple"
      allowClear
      placeholder="Select utilities"
      options={OPTIONS}
      value={value}
      onChange={onChange}
      style={{ minWidth: 260 }}
    />
  );
}
