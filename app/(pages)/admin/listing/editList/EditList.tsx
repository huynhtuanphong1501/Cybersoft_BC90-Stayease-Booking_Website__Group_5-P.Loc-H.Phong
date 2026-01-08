"use client";
import { Checkbox, Form, Input, InputNumber, Select, message } from "antd";
import ModalCmps from "../../_cmps/modal/ModalCmps";
import api from "@/app/service/api";
import type { EditProps } from "@/app/type";
import { useEffect } from "react";

export default function EditList({
  open,
  target,
  onCancel,
  onSuccess,
}: EditProps) {
  const [form] = Form.useForm();

  const UTILITIES = [
    { label: "Máy giặt", value: "mayGiat" },
    { label: "Bàn là", value: "banLa" },
    { label: "TV", value: "tivi" },
    { label: "Điều hòa", value: "dieuHoa" },
    { label: "WiFi", value: "wifi" },
    { label: "Bếp", value: "bep" },
    { label: "Đỗ xe", value: "doXe" },
    { label: "Hồ bơi", value: "hoBoi" },
    { label: "Bàn ủi", value: "banUi" },
  ];

  useEffect(() => {
    if (target && open) {
      if (target && open) {
        const ulti = UTILITIES.map((item) => item.value).filter(
          (key) => target[key as keyof typeof target]
        );

        form.setFieldsValue({
          ...target,
          ulti,
        });
      }
    }
  }, [target, open, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const selected = values.ulti as string[];

      const payload = {
        ...values,

        mayGiat: selected.includes("mayGiat"),
        banLa: selected.includes("banLa"),
        tivi: selected.includes("tivi"),
        dieuHoa: selected.includes("dieuHoa"),
        wifi: selected.includes("wifi"),
        bep: selected.includes("bep"),
        doXe: selected.includes("doXe"),
        hoBoi: selected.includes("hoBoi"),
        banUi: selected.includes("banUi"),
      };

      delete payload.ulti;
      await api.put(`/phong-thue/${target?.id}`, payload);
      message.success("Update room success");
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalCmps
      open={open}
      title="Edit room"
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
          name="tenPhong"
          label="Name"
          rules={[{ required: true, message: "Please input name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="khach"
          label="Guest"
          rules={[
            { required: true, message: "Please input guest number" },
            {
              type: "number",
              min: 1,
              message: "Guest must be greater than 0",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="phongNgu"
          label="Bedroom"
          rules={[
            { required: true, message: "Please input bedroom number" },
            {
              type: "number",
              min: 1,
              message: "Bedroom must be greater than 0",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="giuong"
          label="Bed"
          rules={[
            { required: true, message: "Please input bed number" },
            {
              type: "number",
              min: 1,
              message: "Bed must be greater than 0",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="phongTam"
          label="Bathroom"
          rules={[
            { required: true, message: "Please input bathroom number" },
            {
              type: "number",
              min: 1,
              message: "Bathroom must be greater than 0",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Description"
          rules={[{ required: true, message: "Please input description" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="giaTien"
          label="Price"
          rules={[
            { required: true, message: "Please input price" },
            {
              type: "number",
              min: 0,
              message: "Price must be greater than 0",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="ulti"
          label="Utilities"
          rules={[
            { required: true, message: "Please select at least one utility" },
          ]}
        >
          <Checkbox.Group options={UTILITIES} />
        </Form.Item>

        <Form.Item
          name="maViTri"
          label="Index Location"
          rules={[
            { required: true, message: "Please input index location number" },
            {
              type: "number",
              min: 0,
              message: "Index Location must be greater than 0",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
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
