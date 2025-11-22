// src/screens/ExportScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet, Share } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";  // import như vầy mới đúng

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

      // phải ép kiểu vì TS không có type chính xác
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
