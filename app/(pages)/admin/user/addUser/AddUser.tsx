"use client";
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import ModalCmps from "@/app/(pages)/admin/_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { AddProps } from "@/app/type";

export default function AddUser({ onSuccess }: AddProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await api.post("/users", {
        ...values,
        role: "USER",
      });

      message.success("Create user success");
      onSuccess();
      setOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          form.resetFields();
        }}
      >
        Create User
      </Button>

      <ModalCmps
        open={open}
        title="Create User"
        okText="Create"
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            gender: false,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input password" },
              {
                pattern:
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="birthday"
            label="Birthday"
            rules={[
              { required: true, message: "Please input birthday" },
              {
                pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
                message: "Birthday must be in format YYYY-MM-DD",
              },
            ]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Gender" className="mb-10">
            <Select
              options={[
                { label: "Male", value: true },
                { label: "Female", value: false },
              ]}
            />
          </Form.Item>
        </Form>
      </ModalCmps>
    </>
  );
}
