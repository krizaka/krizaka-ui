// Testing Library's matchers (toBeOnTheScreen, toBeChecked…) on Jest's `expect` from @jest/globals, for tsc: the
// library augments `@jest/expect`, which pnpm does not expose here; `expect` is the module that declares `Matchers`.
import type { JestNativeMatchers } from "@testing-library/react-native/dist/matchers/types";

declare module "expect" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void>, T = unknown> extends JestNativeMatchers<R> {}
}
