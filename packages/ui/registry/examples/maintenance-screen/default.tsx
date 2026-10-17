import { ProductLogo } from "@krizaka/ui";
import { MaintenanceScreen } from "@krizaka/ui/maintenance-screen";

// Maintenance is on in the backend's parameters; the operator wrote the message.
export default function MaintenanceScreenDefault() {
  return (
    <MaintenanceScreen
      className="min-h-0"
      mark={<ProductLogo id="orazaka" size={96} animated={false} />}
      title="Back in a few minutes"
      message="We are upgrading our servers. Your work is safe."
      retryLabel="Try again"
      onRetry={() => undefined}
    />
  );
}
