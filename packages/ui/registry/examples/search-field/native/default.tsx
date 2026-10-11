import { SearchField } from "@krizaka/ui/native";
import * as React from "react";

export default function NativeSearchFieldDefault() {
  const [query, setQuery] = React.useState("sunset");
  return <SearchField label="Search videos" placeholder="Search videos" value={query} onValueChange={setQuery} clearLabel="Clear search" />;
}
