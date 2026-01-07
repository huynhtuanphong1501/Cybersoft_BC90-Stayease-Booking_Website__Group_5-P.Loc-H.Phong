"use client";
import { Form, Input, Select, message } from "antd";
import ModalCmps from "../../_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { EditProps } from "@/app/type";
import { useEffect } from "react";

export default function EditLocation({
  open,
  target,
  onCancel,
  onSuccess,
}: EditProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (target && open) {
      form.setFieldsValue(target);
    }
  }, [target, open, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`/vi-tri/${target?.id}`, values);
      message.success("Update location success");
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalCmps
      open={open}
      title="Edit Location"
      okText="Update"
      onOk={handleUpdate}
      onCancel={() => {
        form.resetFields();
        onCancel();
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
  );
}
