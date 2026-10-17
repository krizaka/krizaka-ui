import { OpeningHours } from "@krizaka/ui/opening-hours";

// Open now, closes at 5 pm — and the week, today marked. The app computes the status and formats the times.
export default function OpeningHoursWeek() {
  return (
    <OpeningHours
      label="Hours"
      today="tue"
      status={{ open: true, label: "Open now", detail: "Closes at 5 pm" }}
      days={[
        { id: "mon", label: "Monday", hours: "8 am – 12 pm, 1 pm – 5 pm" },
        { id: "tue", label: "Tuesday", hours: "8 am – 12 pm, 1 pm – 5 pm" },
        { id: "wed", label: "Wednesday", hours: "8 am – 12 pm, 1 pm – 5 pm" },
        { id: "thu", label: "Thursday", hours: "8 am – 12 pm, 1 pm – 5 pm" },
        { id: "fri", label: "Friday", hours: "8 am – 12 pm, 1 pm – 5 pm" },
        { id: "sat", label: "Saturday", hours: "9 am – 12 pm" },
        { id: "sun", label: "Sunday", hours: "Closed" },
      ]}
      open
    />
  );
}
