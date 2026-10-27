import { EntityHeader } from "@krizaka/ui/entity-header";
import * as React from "react";

// A collection's head: rename it in place (Enter saves, Escape gives it back). A taken name comes back as a code, and the page says it in its words.
export default function EntityHeaderBasic() {
  const [name, setName] = React.useState("Spring bookings");
  return (
    <EntityHeader
      name={name}
      nameLabel="Rename the collection"
      onNameChange={async (next) => {
        if (next === "Archive") throw Object.assign(new Error("taken"), { code: "NAME_TAKEN" });
        setName(next);
      }}
      description="Everything booked from March to May."
      avatar={{ defaultAvatar: { brand: "krizaka", kind: "folder", tone: 3 } }}
      tags={[
        { id: "1", label: "Seasonal", marker: "blue" },
        { id: "2", label: "Priority", marker: "amber" },
      ]}
      tagsLabel="Tags"
      refusals={{ NAME_TAKEN: "Another collection already has this name." }}
    />
  );
}
