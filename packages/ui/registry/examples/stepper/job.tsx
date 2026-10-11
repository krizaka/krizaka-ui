import { Progress } from "@krizaka/ui/progress";
import { Stepper } from "@krizaka/ui/stepper";

const labels = { done: "Done", current: "In progress", upcoming: "Upcoming", error: "Failed" };

// A video job in steps: done ones checked, the current one traced and growing to its value with its own progress and
// time left, the next ones waiting. Every state is said in words for assistive technology.
export default function StepperJob() {
  return (
    <Stepper
      aria-label="Publishing “Night walk”"
      labels={labels}
      current={2}
      className="w-full max-w-sm"
      steps={[
        { title: "Uploaded", description: "1.2 GB in 48 s" },
        { title: "Checked", description: "Format, rights, safety" },
        {
          title: "Transcoding",
          description: "4K, 1080p, 720p",
          value: 0.58,
          content: <Progress label="Transcoding" value={58} eta="About 2 min left" showLabel size="sm" />,
        },
        { title: "Published", description: "Visible to your supporters" },
      ]}
    />
  );
}
