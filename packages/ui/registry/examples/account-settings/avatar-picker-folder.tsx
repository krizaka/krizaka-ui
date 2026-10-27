import { AVATAR_NONE, AvatarPicker, builtInAvatarOptions } from "@krizaka/ui/account-settings";
import * as React from "react";

const OPTIONS = builtInAvatarOptions("folder", "yomizaka", (tone) => `Teinte ${tone}`);

// A folder's picture: the set of the folder kind (never a person), the « no picture » tile and the library's upload control.
export default function AvatarPickerFolderExample() {
  const [value, setValue] = React.useState("folder-2");
  return (
    <div className="w-full max-w-md">
      <AvatarPicker
        label="Photo du dossier"
        showLabel
        kind="folder"
        noneLabel="Aucune photo"
        options={OPTIONS}
        value={value}
        onValueChange={(id) => setValue(id === AVATAR_NONE ? AVATAR_NONE : id)}
        uploadFile={{ title: "Déposez une image", browseLabel: "Choisir une image", hint: "PNG ou JPEG, 2 Mo au plus", accept: "image/png,image/jpeg", maxSize: 2_000_000, onFile: () => {} }}
      />
    </div>
  );
}
