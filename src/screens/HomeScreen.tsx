// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { listenAuthChange, logout } from "../services/authService";
import {
  addNote,
  listenUserNotes,
  Note,
} from "../services/firestoreService";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const unsub = listenAuthChange((user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setUserId(user.uid);
        setEmail(user.email ?? null);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const unsub = listenUserNotes(userId, setNotes);
    return () => unsub();
  }, [userId]);

  const createDemoNote = async () => {
    if (!userId) return;
    await addNote(userId, { title: "Note demo", content: "Nội dung demo" });
  };

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.note}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào, {email}</Text>

      <Button title="Tạo note demo" onPress={createDemoNote} />
      <Button title="Ghi âm mới" onPress={() => router.push("/recorder")} />
      <Button
        title="Upload ảnh (AI mô tả)"
        onPress={() => router.push("/image-upload")}
      />
      <Button title="Xuất PDF" onPress={() => router.push("/export")} />

      <Text style={styles.subtitle}>Danh sách note:</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id!}
        renderItem={renderItem}
      />

      <Button title="Đăng xuất" onPress={onLogout} color="red" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
  subtitle: { marginTop: 16, fontWeight: "bold" },
  note: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  noteTitle: { fontWeight: "bold" },
});
