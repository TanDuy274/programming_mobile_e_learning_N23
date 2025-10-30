// app/(auth)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  // Stack này chỉ chứa login và register, ẩn header
  return <Stack screenOptions={{ headerShown: false }} />;
}
