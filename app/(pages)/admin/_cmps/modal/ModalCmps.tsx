"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import type { ModalCmpsProps } from "@/app/type";

export default function ModalCmps({
  open,
  title,
  okText,
  onOk,
  onCancel,
  children,
}: ModalCmpsProps) {
  return (
    <>
      <Modal
        title={title}
        closable={{ "aria-label": "Custom Close Button" }}
        open={open}
        okText={okText}
        onOk={onOk}
        onCancel={onCancel}
      >
        {children}
      </Modal>
    </>
  );
}
