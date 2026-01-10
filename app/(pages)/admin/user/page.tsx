"use client";
import TableData from "./table/TableData";
import AddUser from "./addUser/AddUser";
import { useState } from "react";
import SearchCmps from "../_cmps/search/SearchCmps";

export default function User() {
  const [reload, setReload] = useState(0);
  const [keyword, setKeyword] = useState("");
  return (
    <div className="space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 pt-5">
          User
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-nowrap w-full sm:w-auto">
          <SearchCmps
            placeholder="Search by name or email"
            onSearch={setKeyword}
          />
          <AddUser onSuccess={() => setReload((k) => k + 1)} />
        </div>
      </div>
      <TableData reload={reload} keyword={keyword} />
    </div>
  );
}
