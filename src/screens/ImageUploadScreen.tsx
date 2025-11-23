// src/screens/ImageUploadScreen.tsx
import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../firebase/firebaseConfig";
import { uploadFileAsync } from "../services/storageService";

const ImageUploadScreen: React.FC = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  if (!user) {
    router.replace("/login");
    return null;
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Cần quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;
    try {
      const filename = `img_${Date.now()}.jpg`;
      const path = `images/${user.uid}/${filename}`;
      const url = await uploadFileAsync(imageUri, path);
      setImageUrl(url);
      alert("Đã upload ảnh, Cloud Functions sẽ xử lý AI mô tả!");
    } catch (err: any) {
      alert("Lỗi upload ảnh: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload ảnh để AI mô tả</Text>
      <Button title="Chọn ảnh" onPress={pickImage} />
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Button title="Upload ảnh" onPress={uploadImage} />
        </>
      )}
      {imageUrl && <Text style={{ marginTop: 16 }}>Image URL: {imageUrl}</Text>}
    </View>
  );
};

export default ImageUploadScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12 },
  image: { width: "100%", height: 200, marginVertical: 12 },
});
