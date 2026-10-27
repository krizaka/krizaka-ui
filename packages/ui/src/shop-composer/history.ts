// Undo / redo (ADR-007 §5): the document before and after every command, 100 steps. Documents are immutable and share their
// untouched sections, so keeping a hundred of them costs a few kilobytes. A command that changes nothing is not a step; a new
// command forgets what was undone.
import type { ShopPage } from "../shop/schema";
import { applyCommand, type Command } from "./commands";

/** The most steps kept. */
// @fixed: ADR-007 §5 — the composer's undo depth, a product decision of the editor, not a shop setting.
export const HISTORY_LIMIT = 100;

export type History = { readonly past: readonly ShopPage[]; readonly present: ShopPage; readonly future: readonly ShopPage[]; /** The key of the burst the last step belongs to (typing in one field). */ readonly merge?: string };

export const createHistory = (page: ShopPage): History => ({ past: [], present: page, future: [] });

/**
 * Runs a command: a new step, unless it changes nothing. Commands with the same `merge` key in a row (the keystrokes of one field)
 * make one step, so a hundred letters do not use the hundred steps of undo.
 */
export function run(history: History, cmd: Command, merge?: string): History {
  const next = applyCommand(history.present, cmd);
  if (next === history.present) return history;
  if (merge && history.merge === merge && history.past.length > 0) return { ...history, present: next, future: [] };
  return { past: [...history.past, history.present].slice(-HISTORY_LIMIT), present: next, future: [], merge };
}

export const canUndo = (h: History) => h.past.length > 0;
export const canRedo = (h: History) => h.future.length > 0;

export function undo(h: History): History {
  const previous = h.past.at(-1);
  if (!previous) return h;
  return { past: h.past.slice(0, -1), present: previous, future: [h.present, ...h.future] };
}

export function redo(h: History): History {
  const [next, ...rest] = h.future;
  if (!next) return h;
  return { past: [...h.past, h.present], present: next, future: rest };
}

/** Replaces the document without a step (a reload from the server, a discarded draft). */
export const reset = (page: ShopPage): History => createHistory(page);
