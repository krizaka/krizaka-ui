import { EnvironmentNotice } from "@krizaka/ui/environment-notice";

// Any stage but production shows the notice; the words come from the app's messages.
export default function EnvironmentNoticeStaging() {
  return <EnvironmentNotice stage="staging" title="Staging version" message="Data can be reset at any time. Not a commercial offer." />;
}
