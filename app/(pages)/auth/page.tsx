"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/app/service/api";

const Auth = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("auth/signin", user);

      if (response.data?.content) {
        const userData = response.data.content;
        document.cookie = `TOKEN=${userData.token}; path=/; samesite=lax`;

        localStorage.setItem("USER_LOGIN", JSON.stringify(userData));
        localStorage.setItem("TOKEN", userData.token);

        window.dispatchEvent(new Event("AUTH_SUCCESS"));
        if (userData.user.role === "ADMIN") {
          window.location.href = "/admin/dashboard";
        } else {
          setError("You do not have permission to access this page.");
        }
      }
    } catch (err) {
      const message =
        (err as any).response?.data?.message ||
        "Login failed. Please check your information and try again.";
      setError(message);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4">
      <img
        src="/img/Auth/AuthBackground.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/25 to-black/40" />

      <div className="relative z-1 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between">
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <div className="w-100 h-100 rounded-full bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 flex items-center justify-center shadow-[0_40px_120px_rgba(56,189,248,0.45)]">
            <div className="w-90 h-90 bg-gray-300 rounded-full flex items-center justify-center shadow-xl relative">
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-800 rounded-full flex items-center justify-center shadow-lg z-1">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 bg-black rounded-full mb-1" />
                  <div className="w-2 h-6 bg-black rounded-full" />
                </div>
              </div>
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-30 h-30 border-8 border-gray-500 rounded-t-full bg-transparent z-1" />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
          <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl border-3 border-white bg-white/10 backdrop-blur-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)] px-6 sm:px-8 md:px-10 py-8 sm:py-10">
            <h1 className="text-center font-bold tracking-wide text-black text-2xl sm:text-3xl mb-8">
              Admin Authentication
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                <label className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-gray-600 bg-gray-200/70 backdrop-blur-sm rounded-full">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent text-black border-b border-gray-300 py-2.5 px-1 outline-none transition-all focus:border-cyan-400 focus:border-b-2"
                />
              </div>

              <div className="group relative">
                <label className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-gray-600 bg-gray-200/70 backdrop-blur-sm rounded-full">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent text-black border-b border-gray-300 py-2.5 px-1 outline-none transition-all focus:border-emerald-400 focus:border-b-2"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-3 rounded-full font-semibold tracking-wide text-black bg-linear-to-r from-cyan-500 via-sky-500 to-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_45px_rgba(56,189,248,0.55)] active:scale-95 cursor-pointer"
              >
                Login
              </button>
            </form>

            {error && (
              <div className="mt-6 rounded-xl border border-[#ED1B24] bg-[#a50000] px-4 py-3 text-sm text-white text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
