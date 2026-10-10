import { Avatar } from "@krizaka/ui/native";

export default function NativeAvatarGroup() {
  return (
    <Avatar.Group max={3} size="md">
      <Avatar alt="Maya" />
      <Avatar alt="Noor" />
      <Avatar alt="Ines" />
      <Avatar alt="Theo" />
      <Avatar alt="Lou" />
    </Avatar.Group>
  );
}
