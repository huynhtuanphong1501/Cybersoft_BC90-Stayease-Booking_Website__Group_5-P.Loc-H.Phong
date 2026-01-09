"use client";
import { useState } from "react";
import TableData from "./table/TableData";
import AddBooking from "./addBooking/AddBooking";

const Bookings = () => {
  const [reload, setReload] = useState(0);
  return (
    <div className="space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 pt-5">
          Booking
        </h2>
        <div className="pt-5 w-full sm:w-auto">
          <AddBooking onSuccess={() => setReload((k) => k + 1)} />
        </div>
      </div>
      <TableData reload={reload} />
    </div>
  );
};

export default Bookings;
