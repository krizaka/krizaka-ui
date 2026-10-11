import { Combobox } from "@krizaka/ui/combobox";

// A required choice left empty: the error is shown and read with the field.
export default function ComboboxInvalid() {
  return (
    <Combobox
      label="Country of residence"
      placeholder="Choose a country"
      options={[
        { value: "CA", label: "Canada" },
        { value: "FR", label: "France" },
        { value: "BE", label: "Belgium" },
      ]}
      error="Choose your country to receive payouts."
    />
  );
}
