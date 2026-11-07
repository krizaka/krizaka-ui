"use client";

/**
 * @file ChatShowcase.tsx
 * @description Self-playing, sovereign AI-chat showcase — Calm Obsidian 2026.
 *
 * A code-driven mockup of the Orazaka engine answering a query *locally*.
 * Dramatizes the product's value prop (deterministic interceptor pipeline +
 * on-prem inference + zero data egress). Token-driven,
 * roles only (--kz-* utilities),
 * reduced-motion safe, and framework-agnostic on copy (all strings via props
 * so each app localizes through its own i18n).
 *
 * Shared by orazaka-web-client (its operator console included) (AGENTS.md §8).
 */

import { MessageComposer } from "@krizaka/ui/chat";
import { cn } from "@krizaka/ui/cn";
import * as React from "react";

import { Icon } from "../icon";
import { CHAT_SHOWCASE_CSS } from "./chat-showcase.css";

/** Localizable, non-conversational chrome labels. */
export interface ChatShowcaseLabels {
  agent: string;
  status: string;
  model: string;
  routed: string;
  privacy: string;
  placeholder: string;
  /** The send button's name inside the composer (inert here, so it is never read); defaults to "Send". */
  send?: string;
}

/** Props for {@link ChatShowcase}. */
export interface ChatShowcaseProps {
  /** The chrome's words, translated: the agent's name, its status, the model, the "answered locally" tag, the privacy line, the composer's placeholder. */
  labels: ChatShowcaseLabels;
  /** The user's scripted question. */
  question: string;
  /** The assistant's scripted answer (typed out char-by-char). */
  answer: string;
  /** Interceptor pipeline steps rendered as chips once the answer lands. */
  pipeline: string[];
  /** Extra classes on the wrapper (width, placement), merged last. */
  className?: string;
}

const noop = () => {};

type Phase = 0 | 1 | 2 | 3 | 4; // idle · user · typing · answering · done

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (notify: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return noop;
  const query = window.matchMedia(REDUCE);
  query.addEventListener?.("change", notify);
  return () => query.removeEventListener?.("change", notify);
};
const readReduce = () => typeof window !== "undefined" && Boolean(window.matchMedia?.(REDUCE).matches);

/** `true` when the person asked for less motion; read on the client only (the server renders the first frame). */
function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribeReduce, readReduce, () => false);
}

/**
 * Renders the animated sovereign-chat card.
 *
 * @param props - {@link ChatShowcaseProps}
 * @returns The showcase React element.
 */
export function ChatShowcase({ labels, question, answer, pipeline, className }: Readonly<ChatShowcaseProps>) {
  const reduce = usePrefersReducedMotion();
  const [played, setPlayed] = React.useState({ answer, phase: 0 as Phase, typed: "" });
  // The sequence restarts when the copy (locale) changes: the state is reset while rendering, never in an effect.
  if (played.answer !== answer) setPlayed({ answer, phase: 0, typed: "" });
  const setPhase = React.useCallback((next: Phase) => setPlayed((p) => ({ ...p, phase: next })), []);
  const setTyped = React.useCallback((next: string) => setPlayed((p) => ({ ...p, typed: next })), []);
  // Under reduced motion the final state is shown at once, and nothing is scheduled.
  const phase: Phase = reduce ? 4 : played.phase;
  const typed = reduce ? answer : played.typed;

  // Orchestrate the scripted sequence (timers only: their callbacks move the state).
  React.useEffect(() => {
    if (reduce) return;
    const timers = [
      setTimeout(() => setPhase(1), 650),
      setTimeout(() => setPhase(2), 1350),
      setTimeout(() => setPhase(3), 2450),
    ];
    return () => timers.forEach(clearTimeout);
  }, [answer, reduce, setPhase]);

  React.useEffect(() => {
    if (phase !== 3) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(answer.slice(0, i));
      if (i >= answer.length) {
        clearInterval(id);
        setPhase(4);
      }
    }, 16);
    return () => clearInterval(id);
  }, [phase, answer, setPhase, setTyped]);

  const renderConversation = (ph: Phase, text: string) => {
    const shownText = ph === 4 ? answer : text;
    return (
      <>
        {/* User */}
        <div
          className="flex justify-end transition-all duration-300"
          style={{ opacity: ph >= 1 ? 1 : 0, transform: ph >= 1 ? "none" : "translateY(8px)" }}
        >
          <div className="max-w-[84%] rounded-2xl rounded-br-[5px] bg-accent px-3 py-2.5 text-[13px] font-medium leading-[1.55] text-on-accent">
            {question}
          </div>
        </div>

        {/* Typing */}
        {ph === 2 && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-[5px] border border-border-subtle bg-surface-2 px-3 py-3">
              <span className="kzc-typing h-1.5 w-1.5 rounded-full bg-fg-muted" />
              <span className="kzc-typing h-1.5 w-1.5 rounded-full bg-fg-muted" />
              <span className="kzc-typing h-1.5 w-1.5 rounded-full bg-fg-muted" />
            </div>
          </div>
        )}

        {/* Assistant */}
        {ph >= 3 && (
          <div className="flex justify-start">
            <div className="max-w-[84%] rounded-2xl rounded-bl-[5px] border border-border-subtle bg-surface-2 px-3 py-2.5 text-[13px] leading-[1.55] text-fg">
              <span className="mb-[7px] inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.04em] text-success">
                <Icon name="checkCircle" size={11} />
                {labels.routed}
              </span>
              <p className="m-0">
                {shownText}
                {ph === 3 && (
                  <span className="kzc-caret ml-px inline-block h-[1em] w-0.5 translate-y-[2px] bg-accent align-text-bottom" />
                )}
              </p>
              <div
                className="mt-[11px] flex flex-wrap gap-1.5 border-t border-border-subtle pt-[11px] transition-opacity duration-300"
                style={{ opacity: ph >= 4 ? 1 : 0 }}
              >
                {pipeline.map((step, i) => (
                  <span
                    key={step}
                    className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-accent"
                  >
                    <Icon name="check" size={10} />
                    {step}
                    {i < pipeline.length - 1 && <span className="ml-0.5 opacity-50">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={cn("relative w-full max-w-[440px]", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -top-10 -bottom-14 rounded-xl"
        style={{
          background: "radial-gradient(60% 55% at 60% 35%, var(--kz-accent-soft) 0%, transparent 70%)",
        }}
      />

      <div
        role="img"
        aria-label={`${question} — ${answer}`}
        className="relative flex flex-col overflow-hidden rounded-xl border border-border-default bg-surface-1 shadow-lg"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-2 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon name="shield" size={17} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-display text-[13px] font-bold tracking-tight text-fg">{labels.agent}</span>
              <span className="flex items-center gap-1.5 text-[10.5px] text-fg-secondary">
                <span className="kzc-dot h-1.5 w-1.5 rounded-full bg-success" />
                {labels.status}
              </span>
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border-subtle bg-surface-1 px-2.5 py-1 font-mono text-[10px] font-semibold text-fg-secondary">
            <Icon name="model" size={11} />
            {labels.model}
          </span>
        </div>

        {/* ── Conversation ──
            Sized by its FINAL state: an invisible copy shares the grid cell with the live one (no layout shift). */}
        <div className="grid min-h-[268px]">
          <div
            aria-hidden
            data-chat-ghost
            className="invisible col-start-1 row-start-1 flex flex-col gap-3 px-4 py-[18px]"
          >
            {renderConversation(4, answer)}
          </div>
          <div className="col-start-1 row-start-1 flex flex-col gap-3 px-4 py-[18px]">
            {renderConversation(phase, typed)}
          </div>
        </div>

        {/* ── Footer ── the very composer of the app (MessageComposer, pill): the card is an instance of the real component, inert. */}
        <div className="flex flex-col border-t border-border-subtle bg-surface-2 px-4 pb-3 pt-[13px]" aria-hidden inert>
          <MessageComposer
            variant="pill"
            value=""
            onValueChange={noop}
            onSend={noop}
            placeholder={labels.placeholder}
            sendLabel={labels.send ?? "Send"}
            inputProps={{ tabIndex: -1, readOnly: true }}
            status={
              <>
                <span className="text-success">
                  <Icon name="shield" size={12} />
                </span>
                {labels.privacy}
              </>
            }
          />
        </div>
      </div>

      <style>{CHAT_SHOWCASE_CSS}</style>
    </div>
  );
}

ChatShowcase.displayName = "ChatShowcase";
