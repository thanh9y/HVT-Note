// src/services/notificationService.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Cấu hình cách hiển thị thông báo khi app đang mở
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // 2 field mới mà type NotificationBehavior yêu cầu
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Hàm xin quyền nhận thông báo (chỉ local, chưa đăng ký FCM)
export async function requestNotificationPermission() {
  if (!Device.isDevice) {
    console.log("Phải dùng thiết bị thật để test notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Không có quyền thông báo");
    return;
  }

  // ⚠️ QUAN TRỌNG:
  // Tạm thời KHÔNG gọi getExpoPushTokenAsync trên Android
  // vì bạn chưa cấu hình FCM → sẽ lỗi FirebaseApp.initializeApp
  if (Platform.OS === "android") {
    console.log(
      "Bỏ qua đăng ký push token FCM trên Android vì chưa cấu hình Firebase/FCM."
    );
    return;
  }

  // Sau này cấu hình xong FCM thì bật lại đoạn này:
  // const tokenData = await Notifications.getExpoPushTokenAsync();
  // console.log("Expo push token:", tokenData.data);
}

// Hàm tạo 1 notification local sau X giây
export async function scheduleLocalNotification(
  seconds: number,
  title: string,
  body: string
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      seconds,
      repeats: false,
      // TS yêu cầu field 'type' cho time interval trigger
      type: "timeInterval",
    } as Notifications.NotificationTriggerInput,
  });
}
