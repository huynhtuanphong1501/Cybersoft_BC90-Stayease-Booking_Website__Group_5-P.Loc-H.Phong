"use client";
import { Input } from "antd";
import type { SearchCmpsProps } from "@/app/type";

const { Search } = Input;

export default function SearchCmps({ placeholder, onSearch }: SearchCmpsProps) {
  return (
    <Search
      className="mr-2"
      placeholder={placeholder}
      allowClear
      onChange={(e) => onSearch(e.target.value)}
      style={{ maxWidth: 320 }}
    />
  );
}
