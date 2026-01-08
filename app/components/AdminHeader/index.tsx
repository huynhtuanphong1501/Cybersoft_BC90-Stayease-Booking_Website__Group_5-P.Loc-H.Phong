"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex items-center px-4 py-3 rounded-xl text-sm sm:text-base font-medium transition cursor-pointer ${
      pathname === path
        ? "bg-white text-black shadow-sm"
        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
    }`;

  return (
    <>
      <aside className="hidden lg:flex w-60 xl:w-70 bg-black text-white flex-col">
        <div className="flex items-center justify-center h-20 border-b border-neutral-800">
          <Link href="/admin/dashboard">
            <img
              src="/img/logo.png"
              className="h-12 cursor-pointer select-none"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/admin/dashboard"
            className={linkClass("/admin/dashboard")}
          >
            Dashboard
          </Link>
          <Link href="/admin/user" className={linkClass("/admin/user")}>
            User
          </Link>
          <Link href="/admin/location" className={linkClass("/admin/location")}>
            Location
          </Link>
          <Link href="/admin/listing" className={linkClass("/admin/listing")}>
            Rooms
          </Link>
          <Link href="/admin/booking" className={linkClass("/admin/booking")}>
            Booking
          </Link>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-black text-white flex flex-col">
            <div className="flex items-center justify-between h-20 px-4 border-b border-neutral-800">
              <span className="text-lg font-bold tracking-wide">LockWind</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                onClick={() => setSidebarOpen(false)}
                href="/admin/dashboard"
                className={linkClass("/admin/dashboard")}
              >
                Dashboard
              </Link>
              <Link
                onClick={() => setSidebarOpen(false)}
                href="/admin/user"
                className={linkClass("/admin/user")}
              >
                User
              </Link>
              <Link
                onClick={() => setSidebarOpen(false)}
                href="/admin/location"
                className={linkClass("/admin/location")}
              >
                Location
              </Link>
              <Link
                onClick={() => setSidebarOpen(false)}
                href="/admin/listing"
                className={linkClass("/admin/listing")}
              >
                Listing
              </Link>
              <Link
                onClick={() => setSidebarOpen(false)}
                href="/admin/booking"
                className={linkClass("/admin/booking")}
              >
                Booking
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
