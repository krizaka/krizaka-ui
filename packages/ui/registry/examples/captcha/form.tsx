"use client";

import { Button } from "@krizaka/ui/button";
import { Captcha, CaptchaDisclosure } from "@krizaka/ui/captcha";
import { useState } from "react";

// Nothing shows for a normal visitor; the button unlocks when the token arrives. 1x00000000000000000000AA is Cloudflare's always-passing test key.
export default function CaptchaForm() {
  const [token, setToken] = useState<string | null>(null);
  return (
    <form className="flex w-80 max-w-full flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
      <Captcha siteKey="1x00000000000000000000AA" onToken={setToken} />
      <Button type="submit" disabled={!token}>Send</Button>
      <CaptchaDisclosure />
    </form>
  );
}
