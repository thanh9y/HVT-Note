// src/services/audioService.ts
import { Audio } from "expo-av";
import { uploadFileAsync } from "./storageService";

let recordingInstance: Audio.Recording | null = null;

export const startRecording = async () => {
  const { granted } = await Audio.requestPermissionsAsync();
  if (!granted) {
    throw new Error("Không có quyền sử dụng micro");
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  await recording.startAsync();
  recordingInstance = recording;
};

export const stopRecording = async (userId: string) => {
  if (!recordingInstance) return null;

  await recordingInstance.stopAndUnloadAsync();
  const uri = recordingInstance.getURI();
  recordingInstance = null;

  if (!uri) return null;

  const filename = `audio_${Date.now()}.m4a`;
  const path = `audio/${userId}/${filename}`;
  const url = await uploadFileAsync(uri, path);

  return { uri, url };
};
