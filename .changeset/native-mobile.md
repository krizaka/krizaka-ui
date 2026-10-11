---
"@krizaka/ui": minor
---

`@krizaka/ui/native` becomes a mobile platform of its own. Parity with the web (same props where the concept is the
same, the differences in each `meta.ts`): `Loader` (+ `LoaderGlyph`, `useDelayedWait`), `Stepper`, `Meter`,
`NumberTicker`, `Dialog`/`AlertDialog`, `Field`/`Input`/`Textarea`/`Select` (a sheet of options), `Tabs`, `Switch`,
`Checkbox`, `RadioGroup`, `Slider`, `DataTable` (cards, sort, selection). The components of the phone: `TabBar`,
`Header` with a large title that folds (`useCollapsingHeader`), `BottomSheet` (snap points, drag, keyboard-aware),
`ActionSheet`, `List`/`ListItem` (sections, pull to refresh, swipe actions, skeleton rows, empty state), `SwipeableRow`,
`PullToRefresh`, `Fab`, `OtpInput`, `ImageViewer` (pinch and double tap to zoom, swipe between, swipe down to close),
`PermissionPrompt`, `Onboarding`, and `MediaPicker` in its own entry `@krizaka/ui/native/media-picker` (expo-image-picker,
optional peer). `Avatar` takes `presence` and a story `ring`; `EmptyState` a `mascot`; a toast is swiped away and can be a
snackbar; `SearchField` a Cancel button. `ThemeProvider` takes `haptics` (`hapticsFrom(Haptics)` adapts expo-haptics)
and the safe-area `insets` — no new dependency. Gestures run on `PanResponder` and `Animated`.
