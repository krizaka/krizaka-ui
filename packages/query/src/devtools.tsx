/**
 * The TanStack devtools, wired once: `<KrizakaDevtools />` beside the provider. They render nothing in production
 * (TanStack's own guard); the future panels (Table, Form, Pacer) join here.
 */
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ComponentProps } from "react";

export { ReactQueryDevtools };

export type KrizakaDevtoolsProps = ComponentProps<typeof ReactQueryDevtools>;

export function KrizakaDevtools(props: KrizakaDevtoolsProps) {
  return <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" {...props} />;
}
