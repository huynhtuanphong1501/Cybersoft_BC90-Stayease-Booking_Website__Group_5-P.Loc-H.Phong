"use client";
import { Form, Input, Select, message } from "antd";
import ModalCmps from "../../_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { EditProps } from "@/app/type";
import { useEffect } from "react";

export default function EditUser({
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
      await api.put(`/users/${target?.id}`, values);
      message.success("Update user success");
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalCmps
      open={open}
      title="Edit User"
      okText="Update"
      onOk={handleUpdate}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="birthday"
          label="Birthday"
          rules={[{ required: true }]}
        >
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
  );
}
