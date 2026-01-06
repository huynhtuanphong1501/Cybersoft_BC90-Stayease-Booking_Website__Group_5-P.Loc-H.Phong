"use client";
import { Button } from "antd";
import { ChangeEvent, useState } from "react";
import ModalCmps from "@/app/(pages)/admin/_cmps/modal/ModalCmps";
import type { TUser } from "@/app/type";
import api from "@/app/service/api";

export default function AddUser({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<TUser>({
    id: 0,
    name: "",
    email: "",
    password: "",
    phone: null,
    birthday: "",
    avatar: null,
    gender: false,
    role: "USER",
  });

  const initState = () => {
    setUser({
      id: 0,
      name: "",
      email: "",
      password: "",
      phone: null,
      birthday: "",
      avatar: null,
      gender: false,
      role: "USER",
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post("/users", user);
    } catch (err) {
      console.error(err);
    }
    onSuccess();
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          initState();
        }}
      >
        Create User
      </Button>

      <ModalCmps
        open={open}
        title="Create User"
        okText="Create"
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
      >
        <form className="flex flex-col">
          <input
            placeholder="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded my-3"
          />
          <input
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <input
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <input
            placeholder="Birthday"
            name="birthday"
            value={user.birthday}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <input
            placeholder="Phone"
            name="phone"
            value={user.phone ?? ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <label htmlFor="">Gender:</label>
          <div className="flex justify-center items-center">
            <div className="mr-10">
              <input
                type="radio"
                id="male"
                name="gender"
                value="true"
                className="mr-2"
                onChange={handleChange}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="">
              <input
                type="radio"
                id="female"
                name="gender"
                value="false"
                className="mr-2"
                onChange={handleChange}
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
        </form>
      </ModalCmps>
    </>
  );
}
