// Client (the state of the check). A promo code: type it, apply it, see the result. Controlled by its caller: the
// check is `onApply` (the caller validates, this component never fetches); the result is an applied chip with the
// effect and "Remove", or a message under the field (aria-describedby) with the input kept. Enter applies; the
// result is announced politely. Words arrive as props.
import * as React from "react";

import { Button } from "../button/button";
import { Chip } from "../chip/chip";
import { cn } from "../cn";
import { Field, Input } from "../field/field";

export type PromoCodeResult = { ok: true; effect: string } | { ok: false; message: string; expired?: boolean };

export type PromoCodeFieldProps = {
  /** The field's label, passed translated: "Promo code". */
  label: string;
  /** The button, translated: "Apply". */
  applyLabel: string;
  /** The applied chip's remove button, translated: "Remove". */
  removeLabel: string;
  /** Checks the code (the caller's: a request, a rule). Never rejects: say a failure as `{ ok: false, message }`. */
  onApply: (code: string) => Promise<PromoCodeResult>;
  /** Runs when the applied code is removed. */
  onRemove?: () => void;
  /** A code already applied (an order resumed). */
  applied?: { code: string; effect: string };
  /** The input's placeholder, translated. */
  placeholder?: string;
  /** Disables the input and the button. */
  disabled?: boolean;
  /** Added to the root. */
  className?: string;
};

type State = { step: "idle" } | { step: "checking" } | { step: "applied"; code: string; effect: string } | { step: "invalid" | "expired"; message: string };

/** A promo code field. State: `data-state` = idle | checking | applied | invalid | expired. */
export function PromoCodeField({ label, applyLabel, removeLabel, onApply, onRemove, applied, placeholder, disabled, className }: PromoCodeFieldProps) {
  const id = React.useId();
  const [code, setCode] = React.useState("");
  const [state, setState] = React.useState<State>(applied ? { step: "applied", ...applied } : { step: "idle" });
  const apply = async () => {
    const value = code.trim();
    if (!value || state.step === "checking") return;
    setState({ step: "checking" });
    const result = await onApply(value);
    setState(result.ok ? { step: "applied", code: value, effect: result.effect } : { step: result.expired ? "expired" : "invalid", message: result.message });
  };
  const refused = state.step === "invalid" || state.step === "expired";
  return (
    <div className={cn("flex flex-col gap-1.5", className)} data-state={state.step}>
      {state.step === "applied" ? (
        <>
          <span className="text-xs font-semibold text-fg-secondary">{label}</span>
          <Chip
            removable
            removeLabel={`${removeLabel} ${state.code}`}
            onRemove={() => {
              setState({ step: "idle" });
              setCode("");
              onRemove?.();
            }}
          >
            <b className="font-semibold">{state.code}</b> · {state.effect}
          </Chip>
        </>
      ) : (
        <form
          className="flex flex-col gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void apply();
          }}
        >
          <Field.Label htmlFor={id}>{label}</Field.Label>
          <div className="flex items-stretch gap-2">
            <Input
              id={id}
              value={code}
              placeholder={placeholder}
              disabled={disabled}
              invalid={refused}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-describedby={refused ? `${id}-message` : undefined}
              onChange={(event) => setCode(event.target.value)}
            />
            <Button type="submit" variant="secondary" loading={state.step === "checking"} disabled={disabled || !code.trim()}>
              {applyLabel}
            </Button>
          </div>
        </form>
      )}
      <div aria-live="polite">
        {refused && (
          <p id={`${id}-message`} className="text-xs font-medium text-fg-danger">
            {state.message}
          </p>
        )}
        {state.step === "applied" && <span className="sr-only">{`${state.code} · ${state.effect}`}</span>}
      </div>
    </div>
  );
}
