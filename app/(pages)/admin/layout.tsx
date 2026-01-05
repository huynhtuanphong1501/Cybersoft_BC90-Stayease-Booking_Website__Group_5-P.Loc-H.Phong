"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEnvelope,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("USER_LOGIN");
    if (data) {
      try {
        const obj = JSON.parse(data);
        setUserName(obj?.user?.name || "");
      } catch (err) {
        console.error("Data user error", err);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between h-16 sm:h-18 lg:h-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-neutral-800 
            hover:bg-neutral-700 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faBars} className="text-white" />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={faBell}
              className="text-neutral-600 hover:text-black cursor-pointer"
            />

            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-neutral-600 hover:text-black cursor-pointer"
            />

            <span className="hidden sm:block text-sm md:text-base font-medium text-neutral-700">
              Welcome,{" "}
              <span className="font-semibold text-black">{userName}</span>
            </span>

            {/* AVATAR + DROPDOWN */}
            <div className="relative">
              <div className="group cursor-pointer">
                <div
                  className="w-10 h-10 rounded-full ring-2 ring-amber-400 
                    overflow-hidden"
                >
                  <img
                    src="/img/avatarLogo.jpg"
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="absolute right-0 top-12 w-40 bg-white 
                    rounded-xl shadow-lg border border-neutral-200 
                    opacity-0 scale-95 group-hover:opacity-100 
                    group-hover:scale-100 transition-all origin-top-right"
                >
                  <button
                    className="flex items-center w-full px-4 py-3 
                        text-sm font-medium text-red-600 
                        hover:bg-red-50 transition cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem("TOKEN");
                      localStorage.removeItem("USER_LOGIN");
                      window.location.href = "/auth";
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>

        <AdminFooter />
      </div>
    </div>
  );
}
