"use client";
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import ModalCmps from "@/app/(pages)/admin/_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { AddProps } from "@/app/type";

export default function AddLocation({ onSuccess }: AddProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await api.post("/vi-tri", {
        ...values,
      });

      message.success("Create location success");
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
        Create Location
      </Button>

      <ModalCmps
        open={open}
        title="Create Location"
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
            name="tenViTri"
            label="Location"
            rules={[{ required: true, message: "Please input location" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tinhThanh"
            label="Province"
            rules={[{ required: true, message: "Please input province" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="quocGia"
            label="Country"
            rules={[{ required: true, message: "Please input country" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hinhAnh"
            label="Image"
            rules={[{ required: true, message: "Please input image" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </ModalCmps>
    </>
  );
}
