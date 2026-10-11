import { Funnel } from "@krizaka/charts/funnel";

const stages = [
  { stage: "Visited the creator page", people: 48_200 },
  { stage: "Created an account", people: 9_640 },
  { stage: "Verified their identity", people: 6_170 },
  { stage: "Published a first video", people: 3_210 },
  { stage: "Made a first sale", people: 1_180 },
];

export default function Signup() {
  return (
    <Funnel
      title="Creator sign-up, September"
      data={stages}
      label="stage"
      value="people"
      stageLabel="Stage"
      valueLabel="Creators"
      fromFirstLabel="% of visits"
      fromPreviousLabel="% of previous"
    />
  );
}
