import { MediaCapture } from "@krizaka/ui/native/media-capture";

export default function NativeMediaCapturePhoto() {
  return (
    <MediaCapture
      mode="photo"
      onCapture={({ uri }) => console.info(uri)}
      labels={{
        prompt: "Take a profile picture with your camera.",
        start: "Turn on the camera",
        denied: "Camera access is off. Turn it on in Settings.",
        settings: "Open Settings",
        takePhoto: "Take photo",
        startRecording: "Start recording",
        stopRecording: "Stop recording",
        switchCamera: "Switch camera",
      }}
    />
  );
}
