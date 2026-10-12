// CSV (RFC 4180) from rows and columns: the header of each column, then each row's values — what `value` returns (or
// `row[id]`), never the rendered cell. Dates as ISO 8601; a value that a spreadsheet would run as a formula is quoted
// with a leading apostrophe (CSV injection).
import type { CellValue } from "./engine";

type CsvColumn<T> = { id: string; header: string; value?: (row: T) => CellValue };

const FORMULA = /^[=+\-@\t\r]/;

function field(value: CellValue): string {
  let text = value == null ? "" : value instanceof Date ? value.toISOString() : String(value);
  if (typeof value === "string" && FORMULA.test(text)) text = `'${text}`;
  return /[",\n\r;]/.test(text) || text !== text.trim() ? `"${text.replace(/"/g, '""')}"` : text;
}

/** The rows as CSV text: a header line, then one line per row, separated by `\r\n`. */
export function dataTableCsv<T>(rows: readonly T[], columns: readonly CsvColumn<T>[], separator = ","): string {
  const lines = [columns.map((column) => field(column.header)).join(separator)];
  for (const row of rows) {
    lines.push(columns.map((column) => field(column.value ? column.value(row) : ((row as Record<string, unknown>)[column.id] as CellValue))).join(separator));
  }
  return lines.join("\r\n");
}
