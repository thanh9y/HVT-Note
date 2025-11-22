// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="index" options={{ title: "Trang chủ" }} />
      <Stack.Screen name="recorder" options={{ title: "Ghi âm" }} />
      <Stack.Screen name="image-upload" options={{ title: "Upload ảnh" }} />
      <Stack.Screen name="export" options={{ title: "Xuất file" }} />
    </Stack>
  );
}
