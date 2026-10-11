import { DatePicker } from "@krizaka/ui/date-picker";

// fr-CA: “11 oct. 2026”, the months and days in French, the week as Canada counts it.
export default function DatePickerFrench() {
  return (
    <DatePicker
      label="Date du rendez-vous"
      locale="fr-CA"
      defaultValue="2026-10-11"
      today="2026-10-11"
      labels={{ previousMonth: "Mois précédent", nextMonth: "Mois suivant", clear: "Effacer la date" }}
    />
  );
}
