// src/screens/ExportScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet, Share } from "react-native";
// ⬇️ BỎ LỖI TS Ở ĐÂY – thư viện vẫn chạy bình thường
// @ts-ignore
import RNHTMLtoPDF from "react-native-html-to-pdf";

const htmlContent = `
  <h1>Ghi chú của tôi</h1>
  <p>Đây là nội dung demo được export sang PDF.</p>
`;

const ExportScreen: React.FC = () => {
  const exportPDF = async () => {
    try {
      const options = {
        html: htmlContent,
        fileName: "ghi_chu_demo",
        directory: "Documents",
      };

      // ⬇️ TS không có kiểu, nên cứ cho nó any
      const file = await (RNHTMLtoPDF as any).convert(options);

      await Share.share({
        url: file.filePath,
        message: "File PDF",
      });
    } catch (err: any) {
      alert("Lỗi export PDF: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xuất file</Text>
      <Button title="Xuất PDF" onPress={exportPDF} />
    </View>
  );
};

export default ExportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12 },
});
