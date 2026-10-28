import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { messages } from "../../registry/examples/schema-form/default";
import { axeViolations } from "../test/axe";
import { checkValues, fieldsFromSchema, initialValues, payloadOf, SchemaForm } from "./index";

const schema = {
  type: "object",
  required: ["title", "format"],
  properties: {
    title: { type: "string", title: "Raw title", maxLength: 10, "x-i18n": { en: { title: "Title" }, fr: { title: "Titre", description: "Sur la carte." } } },
    format: { oneOf: [{ const: "sq", title: "Square" }, { const: "wide", title: "Wide" }], default: "sq", "x-i18n": { fr: { title: "Format", options: { sq: "Carré" } } } },
    price: { type: "integer", "x-money": { currency: "CAD" } },
    copies: { type: "integer", minimum: 1, maximum: 10, default: 1 },
    tags: { type: "array", items: { type: "string" }, maxItems: 2 },
    live: { type: "boolean" },
    nested: { type: "object", properties: {} },
    notes: { type: "string", "x-advanced": true },
    when: { type: "string", format: "date" },
  },
};

describe("fieldsFromSchema", () => {
  it("reads kinds, words by language, required, advanced and closed lists; leaves a nested object out", () => {
    const fr = fieldsFromSchema(schema, "fr-CA");
    expect(fr.map((f) => f.kind)).toEqual(["text", "select", "money", "integer", "list", "boolean", "text", "date"]);
    expect(fr[0]).toMatchObject({ title: "Titre", description: "Sur la carte.", required: true });
    expect(fr[1]!.options).toEqual([{ value: "sq", label: "Carré" }, { value: "wide", label: "Wide" }]);
    expect(fieldsFromSchema(schema, "en")[0]!.title).toBe("Title");
    expect(fr.find((f) => f.key === "notes")!.advanced).toBe(true);
    expect(fieldsFromSchema(JSON.stringify(schema), "en")).toHaveLength(8);
    expect(fieldsFromSchema("not json", "en")).toEqual([]);
  });
  it("turns a long text into a text area", () => {
    expect(fieldsFromSchema({ properties: { a: { type: "string", maxLength: 900 } } }, "en")[0]!.kind).toBe("textarea");
  });
});

describe("checkValues and payloadOf", () => {
  const fields = fieldsFromSchema(schema, "en");
  it("applies the schema's rules", () => {
    const errors = checkValues(fields, { ...initialValues(fields), title: "far too long a title", copies: "11", tags: "a, b, c", format: "" }, messages);
    expect(errors).toEqual({ title: "At most 10 characters.", format: "Required.", copies: "Not above 10.", tags: "At most 2 items." });
    expect(checkValues(fields, { ...initialValues(fields), title: "" }, messages).title).toBe("Required.");
    expect(checkValues(fields, { ...initialValues(fields), title: "ok", copies: "1.5" }, messages).copies).toBe("Not a number.");
  });
  it("hands over a typed payload: numbers, lists, cents; empty left out", () => {
    const values = { ...initialValues(fields), title: " Hello ", price: 1250, copies: "3", tags: "a, b", live: true };
    expect(payloadOf(fields, values)).toEqual({ title: "Hello", format: "sq", price: 1250, copies: 3, tags: ["a", "b"], live: true });
  });
});

describe("SchemaForm", () => {
  const props = { schema, locale: "en", words: { submit: "Create", advanced: "More options" }, messages };
  it("shows no refusal while typing, then the message on submit with focus on the first failing field, and no payload", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(<SchemaForm {...props} onSubmit={onSubmit} />);
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(onSubmit).not.toHaveBeenCalled();
    const title = screen.getByLabelText(/Title/);
    expect(document.activeElement).toBe(title);
    expect(title.getAttribute("aria-invalid")).toBe("true");
    expect(title.getAttribute("aria-describedby")).toBe(screen.getByText("Required.").id);
    expect(await axeViolations(container)).toEqual([]);
  });
  it("submits the typed payload, the money in cents, and folds the advanced fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SchemaForm {...props} onSubmit={onSubmit} />);
    expect(screen.getByText("More options").closest("details")!.open).toBe(false);
    await user.type(screen.getByLabelText(/Title/), "Hello");
    await user.type(screen.getByLabelText("price"), "12.50");
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(onSubmit).toHaveBeenCalledWith({ title: "Hello", format: "sq", price: 1250, copies: 1, live: false });
  });
  it("lets the host draw a field, blocks the fields while submitting", async () => {
    render(<SchemaForm {...props} submitting renderField={(f, ctx) => (f.key === "title" ? <output data-testid="own">{ctx.id}</output> : undefined)} onSubmit={() => {}} />);
    expect(screen.getByTestId("own")).toBeTruthy();
    expect((screen.getByLabelText("copies") as HTMLInputElement).disabled).toBe(true);
  });
});
