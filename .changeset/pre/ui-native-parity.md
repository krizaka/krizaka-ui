---
"@krizaka/ui": patch
---

`@krizaka/ui/native` reaches parity with the web for the React Native apps: `ThemeProvider` / `useTheme` (`mode`
dark·light·system through `useColorScheme`, the `@krizaka/tokens/native` roles with a product's `overrides`, `fonts`,
`useReducedMotion`), `Txt`, `Button`, `IconButton`, `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer`,
`Badge`, `Chip` + `Chip.Group`, `Avatar` + `Avatar.Group`, `Skeleton`, `EmptyState`, `Spinner`, `Countdown` (the web's
clock, `countdown/core`), `Segmented`, `Progress` (bar and ring, react-native-svg) and `Toaster` / `toast`. Same prop
names as the web where the concept is the same, `StyleSheet` only, accessibility through `role` and `aria-*`, every
animation still under reduced motion. No new dependency for an app: the token values are inlined, the peers stay
`react-native` ≥ 0.76 and `react-native-svg` ≥ 15. `dist/native.js` is checked to carry no `"use client"`, no DOM and
no other import.
