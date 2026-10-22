// Platform-neutral React (web and React Native): the engine of a Krizaka form, TanStack Form v1 behind the facade
// (ADR-001: a product never imports @tanstack/*). A form = a Standard Schema (zod 4) + its default values; the schema
// validates every change, an error shows once the person leaves the field or tries to send (and goes as soon as it is
// fixed), a field may check a value on the server (debounced, aborted when the value changes), and a refusal of the
// server (Problem Details `fields`) lands under its fields. The fields themselves are the platform's (web.tsx, native).
import { type AnyFieldApi, type AnyFormApi, type DeepKeys, type StandardSchemaV1, useField, useForm, useStore } from "@tanstack/react-form";
import * as React from "react";

import { type FormFieldError, type FormI18n, formMessage, type FormProblem, isFormProblem, issuesToFields, problemToErrors, type SchemaIssue } from "./errors";

/** A schema the form validates with: any Standard Schema — zod 4 (`z.object`), valibot, arktype. */
export type FormSchema<Input = unknown, Output = Input> = StandardSchemaV1<Input, Output>;
/** The values a form holds: the schema's input. */
export type FormValues<S> = S extends { readonly "~standard": { readonly types?: { readonly input: infer I } } } ? I : never;
/** The values a form sends: the schema's output (zod transforms applied). */
export type FormOutput<S> = S extends { readonly "~standard": { readonly types?: { readonly output: infer O } } } ? O : never;
/** A field's name: `email`, `address.city`, `links[0].url`. */
export type FieldName<V> = DeepKeys<V> & string;

/** What a Server Action (or any submit) answers: done, or a refusal the form shows. */
export type FormActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; problem: FormProblem };

/** A value checked on the server as it is typed: an error (or its key), or nothing when the value is fine. */
export type FieldCheck<T = unknown> = (value: T, signal: AbortSignal) => Promise<FormFieldError | string | null | undefined> | FormFieldError | string | null | undefined;

export interface KrizakaFormDefinition<S extends FormSchema> {
  /** The schema of the values (zod 4): the same one the server parses with. */
  schema: S;
  /** The values at first: every field of the schema. */
  defaultValues: FormValues<S>;
  /** The words: the app's translate function, the key prefixes, the locale. */
  i18n?: FormI18n;
}

export interface UseKrizakaFormOptions<S extends FormSchema, R = unknown> {
  /** Sends the values (the schema's output): a mutation of @krizaka/query, a Server Action. Throw a `KrizakaApiError` or
   * return `{ ok: false, problem }` to refuse: its `fields` go under their fields, the rest above the button. */
  onSubmit?: (values: FormOutput<S>) => R | Promise<R>;
  /** Called after a successful submit with what `onSubmit` returned (`data` of a `{ ok: true, data }`). */
  onSuccess?: (result: R extends FormActionResult<infer T> ? T | undefined : R) => void;
  /** Values that replace the definition's (a profile loaded from the server). */
  defaultValues?: FormValues<S>;
  /** Overrides the definition's words (the translate function of a hook). */
  i18n?: FormI18n;
  /** The server's codes that belong to a field (`{ UNDERAGE: "dateOfBirth", USERNAME_RESERVED: "username" }`): a refusal
   * with that code shows under the field, as `form.errors.<CODE>`, instead of above the button. */
  codeFields?: Readonly<Record<string, string>>;
}

/** The state of a form, for its fields and its button. */
export interface FormContextValue {
  /** TanStack's form, through the facade: never import @tanstack/* in a product. */
  readonly api: AnyFormApi;
  readonly i18n: FormI18n;
  /** The whole form's error (a refusal without a field), or null. */
  readonly error: FormFieldError | null;
  /** Sends the form: validates, focuses (web) or announces (native) the first error, else calls `onSubmit`. */
  readonly submit: () => Promise<boolean>;
}

export const FormContext = React.createContext<FormContextValue | null>(null);

/** The form around a field: inside `form.Form`. */
export function useFormContext(): FormContextValue {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error("A Krizaka form field must be inside its form's `form.Form`.");
  return ctx;
}

type StandardResult = { readonly value?: unknown; readonly issues?: readonly SchemaIssue[] };

const run = (schema: FormSchema, value: unknown) => schema["~standard"].validate(value) as StandardResult | Promise<StandardResult>;

/** The engine of a form: TanStack's form wired to the schema, the server's refusals and the submit. */
export function useKrizakaFormCore<S extends FormSchema, R>(definition: KrizakaFormDefinition<S>, options: UseKrizakaFormOptions<S, R> = {}): FormContextValue {
  const i18n = { ...definition.i18n, ...options.i18n };
  const latest = React.useRef({ options, i18n });
  // The latest options for the engine's callbacks (a submit, a change), which outlive the render that made them.
  React.useLayoutEffect(() => {
    latest.current = { options, i18n };
  });
  const [error, setError] = React.useState<FormFieldError | null>(null);
  const refused = React.useRef(false);

  const api = useForm({
    defaultValues: options.defaultValues ?? definition.defaultValues,
    validators: {
      // Every change: the schema, synchronously (an async refinement waits for the submit). Errors are computed for
      // every field; each field shows its own once the person left it or tried to send.
      onChange: ({ value }: { value: unknown }) => {
        const result = run(definition.schema, value);
        if (result instanceof Promise || !result.issues?.length) return undefined;
        const fields = issuesToFields(result.issues, latest.current.i18n.prefix);
        delete fields[""];
        return { fields };
      },
    },
    onSubmit: async ({ value }: { value: unknown }) => {
      const parsed = await run(definition.schema, value);
      if (parsed.issues?.length) {
        apply({ fields: issuesToFields(parsed.issues, latest.current.i18n.prefix) as FormProblem["fields"] });
        return;
      }
      let result: unknown;
      try {
        result = await latest.current.options.onSubmit?.(parsed.value as FormOutput<S>);
      } catch (thrown) {
        apply(isFormProblem(thrown) ? thrown : { code: "server" });
        return;
      }
      if (result && typeof result === "object" && "ok" in result && (result as FormActionResult).ok === false) {
        apply((result as unknown as { problem: FormProblem }).problem);
        return;
      }
      const data = result && typeof result === "object" && "ok" in result ? (result as { data?: unknown }).data : result;
      latest.current.options.onSuccess?.(data as never);
    },
  });

  const known = (name: string) => name in api.fieldInfo;
  function apply(problem: FormProblem) {
    refused.current = true;
    const { fields, form } = problemToErrors(problem, latest.current.i18n, known, latest.current.options.codeFields);
    for (const [name, fieldError] of Object.entries(fields)) {
      api.setFieldMeta(name as never, (meta) => ({ ...meta, isBlurred: true, errorMap: { ...meta.errorMap, onServer: fieldError } }));
    }
    setError(form);
  }

  const submit = React.useCallback(async () => {
    setError(null);
    refused.current = false;
    for (const name of Object.keys(api.fieldInfo)) {
      if ((api.getFieldMeta(name as never) as { errorMap?: Record<string, unknown> } | undefined)?.errorMap?.onServer) api.setFieldMeta(name as never, (meta) => ({ ...meta, errorMap: { ...meta.errorMap, onServer: undefined } }));
    }
    await api.handleSubmit();
    const state = api.state;
    return !refused.current && state.isSubmitSuccessful && state.isValid && !(Object.values(state.fieldMeta) as { errorMap?: Record<string, unknown> }[]).some((meta) => meta?.errorMap?.onServer);
  }, [api]);

  return React.useMemo(() => ({ api, i18n, error, submit }), [api, error, submit, i18n.t, i18n.prefix, i18n.apiPrefix, i18n.locale]); // eslint-disable-line react-hooks/exhaustive-deps
}

const UNCHECKED = Symbol("unchecked");

export interface FieldOptions<T> {
  /** Checks the value on the server as it is typed (a username's availability): debounced, aborted when it changes. */
  validateAsync?: FieldCheck<T>;
  /** The wait, in ms, between the last change and `validateAsync`. Default 350. */
  asyncDebounceMs?: number;
}

/** A field as its component draws it: the value, its setter, its error in words, its state. */
export interface KrizakaField<T = unknown> {
  /** The id of the control (`htmlFor` of its label). */
  readonly id: string;
  readonly name: string;
  readonly value: T;
  /** Sets the value (clears a refusal of the server on it). */
  setValue(value: T): void;
  /** Call when the control loses focus: from then on, its errors show. */
  readonly onBlur: () => void;
  /** The error to show, in words — only once it should show. */
  readonly error: string | undefined;
  /** The error itself, with its suggestion. */
  readonly errorDetail: FormFieldError | undefined;
  /** A check (`validateAsync`) is running. */
  readonly validating: boolean;
  /** The check passed for the current value. */
  readonly available: boolean;
  /** The ids of the hint and the error (`aria-describedby`). */
  readonly hintId: string;
  readonly errorId: string;
  /** The form's locale (numbers, money, dates). */
  readonly locale: string;
  /** TanStack's field, through the facade. */
  readonly api: AnyFieldApi;
}

/** Binds a field of the form around it (inside `form.Form`): what the platform's field components are made of. */
export function useKrizakaField<T = unknown>(name: string, options: FieldOptions<T> = {}): KrizakaField<T> {
  const ctx = useFormContext();
  const id = React.useId();
  const [checked, setChecked] = React.useState<unknown>(UNCHECKED);
  const check = options.validateAsync;
  const field = useField({
    form: ctx.api,
    name: name as never,
    ...(check
      ? {
          asyncDebounceMs: options.asyncDebounceMs ?? 350,
          validators: {
            onChangeAsyncDebounceMs: options.asyncDebounceMs ?? 350,
            onChangeAsync: async ({ value, signal }: { value: T; signal: AbortSignal }) => {
              const answer = await check(value, signal);
              if (signal.aborted) return undefined;
              if (!answer) {
                setChecked(value);
                return undefined;
              }
              setChecked(UNCHECKED);
              const error = typeof answer === "string" ? { key: answer } : answer;
              return { ...error, immediate: true, source: "check" } satisfies FormFieldError;
            },
          },
        }
      : {}),
  } as never) as unknown as AnyFieldApi;
  const attempts = useStore(ctx.api.store, (state: { submissionAttempts: number }) => state.submissionAttempts);
  const meta = field.state.meta;
  const map = meta.errorMap as Record<string, unknown>;
  const all = [map.onServer, map.onChange, map.onBlur, map.onSubmit, map.onMount].filter(Boolean) as (FormFieldError | string)[];
  const first = all[0];
  const detail = typeof first === "string" ? { key: first } : first;
  const visible = detail && (detail.immediate || detail.source === "server" || meta.isBlurred || attempts > 0) ? detail : undefined;
  const value = field.state.value as T;

  return {
    id,
    name,
    value,
    setValue: (next: T) => {
      if (map.onServer) ctx.api.setFieldMeta(name as never, (m: { errorMap: Record<string, unknown> }) => ({ ...m, errorMap: { ...m.errorMap, onServer: undefined } }) as never);
      field.handleChange(next as never);
    },
    onBlur: () => field.handleBlur(),
    error: visible ? formMessage(visible, ctx.i18n) : undefined,
    errorDetail: visible,
    validating: Boolean(meta.isValidating),
    available: Boolean(check) && checked !== UNCHECKED && Object.is(checked, value) && !meta.isValidating && all.length === 0,
    hintId: `${id}-hint`,
    errorId: `${id}-error`,
    locale: ctx.i18n.locale ?? "en",
    api: field,
  };
}

/** The array of a field array, with its operations (`form.FieldArray`). */
export interface KrizakaFieldArray<T = unknown> {
  readonly name: string;
  readonly items: readonly T[];
  /** Adds an item at the end. */
  readonly push: (item: T) => void;
  /** Removes the item at `index`. */
  readonly remove: (index: number) => void;
  /** Moves an item. */
  readonly move: (from: number, to: number) => void;
  /** The name of a sub-field of an item: `name(0, "url")` → `links[0].url`. */
  readonly fieldName: (index: number, key?: string) => string;
  /** The error of the array itself (too few, too many), in words, once it should show. */
  readonly error: string | undefined;
}

/** Binds an array of the form (a list of links, of tiers): its items and their operations. */
export function useKrizakaFieldArray<T = unknown>(name: string): KrizakaFieldArray<T> {
  const ctx = useFormContext();
  const field = useField({ form: ctx.api, name: name as never, mode: "array" } as never) as unknown as AnyFieldApi;
  const attempts = useStore(ctx.api.store, (state: { submissionAttempts: number }) => state.submissionAttempts);
  const map = field.state.meta.errorMap as Record<string, FormFieldError | undefined>;
  const first = map.onServer ?? map.onChange ?? map.onSubmit;
  return {
    name,
    items: (field.state.value as T[] | undefined) ?? [],
    push: (item) => field.pushValue(item as never),
    remove: (index) => void field.removeValue(index),
    move: (from, to) => field.moveValue(from, to),
    fieldName: (index, key) => `${name}[${index}]${key ? `.${key}` : ""}`,
    error: first && (attempts > 0 || first.source === "server" || field.state.meta.isDirty) ? formMessage(first, ctx.i18n) : undefined,
  };
}

/** The value of a field, kept up to date (`form.Watch`): show a part of the form only when a box is ticked. */
export function useFormValue<T = unknown>(name: string): T {
  const ctx = useFormContext();
  return useStore(ctx.api.store, (state: { values: unknown }) => getPath(state.values, name)) as T;
}

export type FormFieldProps<T = unknown> = {
  /** The field's name in the schema (typed by the form). */
  name: string;
  /** Checks the value on the server as it changes. */
  validateAsync?: FieldCheck<T>;
  /** The wait, in ms, before `validateAsync`. */
  asyncDebounceMs?: number;
  /** Draws the field: its value, setter, error (and the ids, on the web) (`useKrizakaField`). */
  children: (field: KrizakaField<T>) => React.ReactNode;
};

/** A field drawn by the app (a control the package does not have): the form's value and errors, any markup. */
export function FormField({ name, validateAsync, asyncDebounceMs, children }: FormFieldProps) {
  return <>{children(useKrizakaField(name, { validateAsync, asyncDebounceMs }))}</>;
}

export type FieldArrayProps<T = unknown> = {
  /** The array's name in the schema (typed by the form). */
  name: string;
  /** Draws the items: `items`, `push`, `remove`, `move`, `fieldName(i, "url")` for the fields of an item. */
  children: (array: KrizakaFieldArray<T>) => React.ReactNode;
};

/** A list of fields that grows and shrinks (links, tiers, guests): each item's fields named `links[0].url`. */
export function FieldArray({ name, children }: FieldArrayProps) {
  return <>{children(useKrizakaFieldArray(name))}</>;
}

export type WatchProps<T = unknown> = {
  /** The field to follow (typed by the form). */
  name: string;
  /** Draws from its current value: show a part of the form only when a choice is made. */
  children: (value: T) => React.ReactNode;
};

/** Renders from a field's current value (a part shown only when a choice is made, a total). */
export function Watch({ name, children }: WatchProps) {
  return <>{children(useFormValue(name))}</>;
}

/** The state of the submit, for a button: sending, and whether the last try succeeded. */
export function useFormStatus(): { submitting: boolean; succeeded: boolean; attempts: number } {
  const ctx = useFormContext();
  const submitting = useStore(ctx.api.store, (s: { isSubmitting: boolean }) => s.isSubmitting);
  const succeeded = useStore(ctx.api.store, (s: { isSubmitSuccessful: boolean }) => s.isSubmitSuccessful);
  const attempts = useStore(ctx.api.store, (s: { submissionAttempts: number }) => s.submissionAttempts);
  return { submitting, succeeded: succeeded && !ctx.error, attempts };
}

function getPath(source: unknown, path: string): unknown {
  let current = source;
  for (const part of path.replace(/\[(\d+)\]/g, ".$1").split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** The first visible error of a form, in words (native: announced after a refused submit). */
export function firstVisibleError(ctx: FormContextValue): string | undefined {
  if (ctx.error) return formMessage(ctx.error, ctx.i18n);
  for (const meta of Object.values(ctx.api.state.fieldMeta) as { errorMap?: Record<string, FormFieldError | string | undefined> }[]) {
    const error = meta?.errorMap && Object.values(meta.errorMap).find(Boolean);
    if (error) return formMessage(error, ctx.i18n);
  }
  return undefined;
}

/** The platform's components, typed by the form's field names: `name` completes and is checked against the schema. */
export type BoundFields<C, N extends string> = {
  [K in keyof C]: C[K] extends (props: infer P) => infer R ? (P extends { name: string } ? (props: Omit<P, "name"> & { name: N }) => R : C[K]) : C[K];
};

/** A form in a component: its fields (typed by the schema), its submit and its state. */
export type KrizakaFormInstance<S extends FormSchema, C, RootProps> = BoundFields<C, FieldName<FormValues<S>>> & {
  /** The form element (web) or view (native): renders its fields and provides them the form. */
  Form: (props: RootProps) => React.ReactElement;
  /** Sends the form (what `Submit` does): `true` when it went through. */
  submit: () => Promise<boolean>;
  /** Back to the default values (or the given ones), errors cleared. */
  reset: (values?: FormValues<S>) => void;
  /** Sets a field's value from outside (a suggestion, a preset). */
  setValue: (name: FieldName<FormValues<S>>, value: unknown) => void;
  /** The values now. */
  getValues: () => FormValues<S>;
  /** The whole form's error (a refusal without a field), or null. */
  error: FormFieldError | null;
  /** TanStack's form, the escape hatch — never import @tanstack/* in a product. */
  api: AnyFormApi;
};

/** A form defined once (schema + defaults), used in components: `signUp.useForm({ onSubmit })`. */
export interface KrizakaFormFactory<S extends FormSchema, C, RootProps> {
  readonly schema: S;
  readonly defaultValues: FormValues<S>;
  /** The form in a component: `onSubmit` sends the values (a mutation), a thrown `KrizakaApiError` lands on the fields. */
  useForm<R = unknown>(options?: UseKrizakaFormOptions<S, R>): KrizakaFormInstance<S, C, RootProps>;
  /** The form sent by a Server Action: it receives the values and answers `{ ok: true, data }` or `{ ok: false, problem }`. */
  useFormWithAction<T = unknown>(action: (values: FormOutput<S>) => Promise<FormActionResult<T>>, options?: Omit<UseKrizakaFormOptions<S, FormActionResult<T>>, "onSubmit">): KrizakaFormInstance<S, C, RootProps>;
}

/** Builds a platform's `createKrizakaForm` from its field components and its root (web `<form>`, native `View`). */
export function makeCreateKrizakaForm<C extends object, RootProps extends object>(components: C, Root: (props: RootProps & { value: FormContextValue }) => React.ReactElement) {
  return function createKrizakaForm<S extends FormSchema>(definition: KrizakaFormDefinition<S>): KrizakaFormFactory<S, C, RootProps> {
    function useForm<R>(options?: UseKrizakaFormOptions<S, R>): KrizakaFormInstance<S, C, RootProps> {
      const ctx = useKrizakaFormCore(definition, options);
      // One `Form` for the life of the form (never remounted, so focus and fields stay): it reads the latest state from a
      // small store the hook updates.
      const [store] = React.useState(() => createStore(ctx));
      React.useLayoutEffect(() => store.set(ctx), [store, ctx]);
      const Form = React.useCallback((props: RootProps) => <Bound store={store} Root={Root} props={props} />, [store]);
      return React.useMemo(
        () =>
          ({
            ...components,
            Form,
            submit: ctx.submit,
            reset: (values?: FormValues<S>) => ctx.api.reset(values),
            setValue: (name: string, value: unknown) => ctx.api.setFieldValue(name as never, value as never),
            getValues: () => ctx.api.state.values as FormValues<S>,
            error: ctx.error,
            api: ctx.api,
          }) as unknown as KrizakaFormInstance<S, C, RootProps>,
        [ctx, Form],
      );
    }
    return {
      schema: definition.schema,
      defaultValues: definition.defaultValues,
      useForm,
      useFormWithAction: (action, options) => useForm({ ...options, onSubmit: action }),
    };
  };
}

type Store<T> = { get: () => T; set: (value: T) => void; subscribe: (listener: () => void) => () => void };

function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function Bound<RootProps extends object>({ store, Root, props }: { store: Store<FormContextValue>; Root: (props: RootProps & { value: FormContextValue }) => React.ReactElement; props: RootProps }) {
  const value = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  return <Root {...props} value={value} />;
}
