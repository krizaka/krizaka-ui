/**
 * @krizaka/ui/app-header — `AppHeader` (`name`, `mark`, `chips`, then the slots `search` · `language` · `actions` · `messages` ·
 * `notifications` · `primary` · `account`), `appHeader`, and `AppHeaderCount` (an icon control with its unread count): the
 * family's top bar beside a `RailNav`. Server-safe; the search trigger (a hook: ⌘K) is `@krizaka/ui/app-header/search`.
 */
export { AppHeader, appHeader, type AppHeaderProps } from "./app-header";
export { AppHeaderCount, appHeaderCount, type AppHeaderCountProps } from "./count";
export { countName, countText } from "./count-text";
