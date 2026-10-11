import { Meter, MeterValue } from "@krizaka/ui/meter";

// A balance, where high is good (`optimum="high"`): it turns to danger as it runs low.
export default function MeterBalance() {
  return (
    <div className="flex items-center gap-6">
      <Meter variant="ring" label="Credits left" value={12} max={100} valueText="12 credits of 100" thresholds={{ low: 0.25, high: 0.6 }} optimum="high">
        <MeterValue value="12" caption="credits" />
      </Meter>
      <Meter variant="ring" label="Credits left" value={80} max={100} valueText="80 credits of 100" thresholds={{ low: 0.25, high: 0.6 }} optimum="high">
        <MeterValue value="80" caption="credits" />
      </Meter>
    </div>
  );
}
