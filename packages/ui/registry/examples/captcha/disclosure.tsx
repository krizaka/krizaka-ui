import { CaptchaDisclosure } from "@krizaka/ui/captcha";

// The line Cloudflare's terms ask for under the submit button when the widget is hidden.
export default function CaptchaDisclosureExample() {
  return (
    <div className="flex flex-col gap-2">
      <CaptchaDisclosure />
      <CaptchaDisclosure locale="fr" />
    </div>
  );
}
