import { Checkbox } from "@krizaka/ui/checkbox";

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox disabled>Email me the receipts</Checkbox>
      <Checkbox disabled defaultChecked>
        Keep me signed in
      </Checkbox>
    </div>
  );
}
