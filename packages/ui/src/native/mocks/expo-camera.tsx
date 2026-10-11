// Storybook and Jest only — never built: expo-camera needs a native module. The permission is not granted yet (the
// state a story documents: why the camera is needed, and the button that asks); the view is an empty frame.
import * as React from "react";
import { View, type ViewStyle } from "react-native";

type Permission = { granted: boolean; canAskAgain: boolean; status: string; expires: string };
const notYet: Permission = { granted: false, canAskAgain: true, status: "undetermined", expires: "never" };
const ask = async (): Promise<Permission> => notYet;

export const useCameraPermissions = (): [Permission | null, () => Promise<Permission>, () => Promise<Permission>] => [notYet, ask, ask];
export const useMicrophonePermissions = useCameraPermissions;

export class CameraView extends React.Component<{ style?: ViewStyle }> {
  async takePictureAsync() {
    return { uri: "file:///photo.jpg", width: 0, height: 0 };
  }
  async recordAsync() {
    return { uri: "file:///clip.mov" };
  }
  stopRecording() {}
  render() {
    return <View testID="expo-camera-view" aria-hidden style={this.props.style} />;
  }
}
