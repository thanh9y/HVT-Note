// src/screens/RecorderScreen.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase/firebaseConfig";
import { startRecording, stopRecording } from "../services/audioService";

const RecorderScreen: React.FC = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (!user) {
    router.replace("/login");
    return null;
  }

  const onStart = async () => {
    try {
      await startRecording();
      setIsRecording(true);
    } catch (err: any) {
      alert("Không thể bắt đầu ghi âm: " + err.message);
    }
  };

  const onStop = async () => {
    try {
      const result = await stopRecording(user.uid);
      setIsRecording(false);
      if (result) {
        setAudioUrl(result.url);
        alert("Đã upload audio lên Firebase");
      }
    } catch (err: any) {
      setIsRecording(false);
      alert("Lỗi khi dừng ghi âm: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ghi âm</Text>
      <Button
        title={isRecording ? "Đang ghi..." : "Bắt đầu ghi"}
        onPress={onStart}
        disabled={isRecording}
      />
      <Button
        title="Dừng ghi và upload"
        onPress={onStop}
        disabled={!isRecording}
      />
      {audioUrl && <Text style={{ marginTop: 16 }}>URL: {audioUrl}</Text>}
    </View>
  );
};

export default RecorderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16 },
});
