"use client";
import { useState } from "react";
import TableData from "./table/TableData";
import AddList from "./addList/AddList";
import SearchCmps from "../_cmps/search/SearchCmps";
import SearchList from "./searchByUltilies/SeachList";

const Listings = () => {
  const [reload, setReload] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [utilities, setUtilities] = useState<string[]>([]);

  return (
    <div className="space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Listing
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-nowrap w-full sm:w-auto">
          <SearchList value={utilities} onChange={setUtilities} />
          <SearchCmps placeholder="Search by listing" onSearch={setKeyword} />
          <AddList onSuccess={() => setReload((k) => k + 1)} />
        </div>
      </div>

      <TableData reload={reload} keyword={keyword} utilities={utilities} />
    </div>
  );
};

export default Listings;
