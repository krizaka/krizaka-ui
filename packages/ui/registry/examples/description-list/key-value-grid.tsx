import { KeyValueGrid } from "@krizaka/ui/description-list";

// Key figures as cards that wrap: an account's limits in the console.
export default function DescriptionListKeyValueGrid() {
  return (
    <KeyValueGrid
      minWidth={9}
      items={[
        { term: "Requests / min", details: "600" },
        { term: "Concurrent jobs", details: "8" },
        { term: "Storage", details: "50 GB", hint: "18 GB used" },
        { term: "Retention", details: "30 days" },
      ]}
    />
  );
}
