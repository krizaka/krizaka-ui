// EntityHeader on React Native: the same data as the web — picture, name and description edited in place, tags, a refusal
// `code` said with the product's words. The picture is a button (`onAvatarPress`): the app opens its own picker.
import * as React from "react";
import { Pressable, TextInput, View, type ViewProps } from "react-native";

import { type EditableBase, editName, type EntityHeaderBase, useEditable, useRefusal } from "../entity-header/shared";
import { Avatar } from "./avatar";
import { TagMarker } from "./tag-chip";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type EntityHeaderProps = Omit<ViewProps, "children"> &
  EntityHeaderBase & {
    /** Makes the picture a button; the app opens its picker. */
    onAvatarPress?: () => void;
    /** The accessible name of the picture's button (“Change the picture”), passed translated. */
    avatarLabel?: string;
  };

function Editable({ value, label, placeholder, onCommit, onRefusal, variant, required }: EditableBase & { variant: "title" | "body" }) {
  const { theme } = useTheme();
  const { editing, draft, setDraft, pending, open, commit } = useEditable(value, onCommit, onRefusal, required);
  const tone = variant === "body" ? "secondary" : "text";
  if (!onCommit) return value ? <Txt variant={variant} tone={tone}>{value}</Txt> : null;
  if (!editing) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={editName(value, placeholder, label)} onPress={open} style={{ minHeight: 44, justifyContent: "center" }}>
        <Txt variant={variant} tone={value ? tone : "muted"}>{value || placeholder}</Txt>
      </Pressable>
    );
  }
  return (
    <TextInput
      accessibilityLabel={label}
      value={draft}
      editable={!pending}
      autoFocus
      onChangeText={setDraft}
      onSubmitEditing={() => void commit()}
      onBlur={() => void commit()}
      returnKeyType="done"
      style={{ minHeight: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, borderColor: theme.borderControl, backgroundColor: theme.surface1, color: theme.textTitle, fontSize: variant === "title" ? 20 : 14 }}
    />
  );
}

/** The head of an entity: picture, name and description editable in place, tags, a refusal said in words, actions. */
export function EntityHeader({
  avatar, onAvatarPress, avatarLabel, style, actions, refusal, refusals, tags,
  description, onDescriptionChange, descriptionLabel = "Description", descriptionPlaceholder,
  name, nameLabel = name, onNameChange, ...props
}: EntityHeaderProps) {
  const { message, setLocal } = useRefusal(refusal, refusals);
  const { theme } = useTheme();
  const picture = <Avatar size="xl" alt="" {...avatar} />;

  return (
    <View {...props} style={[{ flexDirection: "row", alignItems: "flex-start", columnGap: 16 }, style]}>
      {onAvatarPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel={avatarLabel} onPress={onAvatarPress}>
          {picture}
        </Pressable>
      ) : avatar ? (
        picture
      ) : null}
      <View style={{ flex: 1, rowGap: 4 }}>
        <Editable value={name} label={nameLabel} onCommit={onNameChange} onRefusal={setLocal} variant="title" required />
        {description || onDescriptionChange ? (
          <Editable value={description ?? ""} label={descriptionLabel} placeholder={descriptionPlaceholder} onCommit={onDescriptionChange} onRefusal={setLocal} variant="body" />
        ) : null}
        {tags?.length ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {tags.map((tag) => (
              <View
                key={tag.id}
                accessible
                accessibilityLabel={tag.label}
                style={{ flexDirection: "row", alignItems: "center", columnGap: 6, borderWidth: 1, borderRadius: 999, borderColor: theme.borderDefault, paddingHorizontal: 10, paddingVertical: 2 }}
              >
                <TagMarker marker={tag.marker} />
                <Txt variant="caption">{tag.label}</Txt>
              </View>
            ))}
          </View>
        ) : null}
        {message ? (
          <Txt variant="caption" tone="danger" accessibilityRole="alert">
            {message}
          </Txt>
        ) : null}
      </View>
      {actions ? <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>{actions}</View> : null}
    </View>
  );
}
