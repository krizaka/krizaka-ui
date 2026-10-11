import { Treemap } from "@krizaka/charts/treemap";

// Gigabytes by project, then by kind of file.
const projects = [
  { name: "Documentary “Fleuve”", children: [{ name: "Rushes", value: 412 }, { name: "Exports", value: 96 }, { name: "Audio", value: 38 }] },
  { name: "Weekly vlog", children: [{ name: "Rushes", value: 188 }, { name: "Exports", value: 71 }, { name: "Thumbnails", value: 12 }] },
  { name: "Course “Colour”", children: [{ name: "Lessons", value: 143 }, { name: "Exports", value: 52 }] },
  { name: "Archive", value: 61 },
];

export default function Storage() {
  return <Treemap title="Storage by project" data={projects} format={{ style: "unit", unit: "gigabyte" }} pathLabel="Project › kind" valueLabel="Size" />;
}
