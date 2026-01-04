"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { fetchAuth } from "./slice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";

const Auth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authData = useSelector((state: RootState) => state.authSlice);
  const { data, loading } = authData;
  const route = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fetchAuth(user));
  };

  useEffect(() => {
    if (data) {
      route.push("/admin");
      console.log(data);
    }
  }, [data, route]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4">
      <img
        src="/img/Auth/AuthBackground.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/25 to-black/40 z-0" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between">
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <div className="w-100 h-100 rounded-full bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 flex items-center justify-center shadow-[0_40px_120px_rgba(56,189,248,0.45)]">
            <div className="w-90 h-90 bg-gray-300 rounded-full flex items-center justify-center shadow-xl relative">
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-800 rounded-full flex items-center justify-center shadow-lg z-20">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 bg-black rounded-full mb-1" />
                  <div className="w-2 h-6 bg-black rounded-full" />
                </div>
              </div>

              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-30 h-30 border-8 border-gray-500 rounded-t-full bg-transparent z-10" />
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
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-lack border-b border-gray-300 py-2.5 px-1 outline-none transition-all focus:border-cyan-400 focus:border-b-2"
                />
                <p className="mt-1 text-xs text-red-500">
                  Username is required.
                </p>
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
                  className="w-full bg-transparent text-lack border-b border-gray-300 py-2.5 px-1 outline-none transition-all focus:border-emerald-400 focus:border-b-2"
                />
                <p className="mt-1 text-xs text-red-500">
                  Password is required.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-3 rounded-full font-semibold tracking-wide text-lack bg-linear-to-r from-cyan-500 via-sky-500 to-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_45px_rgba(56,189,248,0.55)] active:scale-95 cursor-pointer"
              >
                Login
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-red-600 bg-red-500 px-4 py-3 text-sm text-red-200">
              Login failed. Please check your information and try again.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
