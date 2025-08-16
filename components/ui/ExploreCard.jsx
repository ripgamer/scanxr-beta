"use client";
import { Card, Image, Text, Stack } from "@mantine/core";
import { QRCodeCanvas } from "qrcode.react";
import ModelViewer from "../ModelViewer";

export default function ExploreCard({ title, modelUrl, qrUrl, thumbnail }) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {/* 3D Preview */}
      <ModelViewer src={modelUrl} />

      {/* Post title */}
      <Text fw={500} mt="sm">{title}</Text>

      {/* QR Code */}
      <Stack align="center" mt="sm">
        <QRCodeCanvas value={qrUrl} size={64} />
      </Stack>
    </Card>
  );
}
