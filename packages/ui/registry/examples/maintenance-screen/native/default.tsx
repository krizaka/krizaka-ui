import { MaintenanceScreen, ProductMark } from "@krizaka/ui/native";

// Maintenance is on in the backend's parameters; the operator wrote the message.
export default function NativeMaintenanceScreenDefault() {
  return (
    <MaintenanceScreen
      fill={false}
      mark={<ProductMark id="sovkora" size={96} animated={false} />}
      title="Back in a few minutes"
      message="We are upgrading our servers. Your work is safe."
      retryLabel="Try again"
      onRetry={() => undefined}
    />
  );
}
