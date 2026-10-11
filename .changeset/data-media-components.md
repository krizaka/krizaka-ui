---
"@krizaka/ui": minor
---

The data and media primitives (epic #49, wave W2b), web and React Native where it makes sense:

- **Data** — `@krizaka/ui/pagination` (pages or cursor, links or buttons, folded into "Page 3 of 12" on a phone; native
  `Pagination`), `@krizaka/ui/data-table` (sort, selection, loading / empty / error, cards in a narrow container,
  windowing), `@krizaka/ui/filter-bar` (`FilterBar`, `FilterMenu`, the filters in the address),
  `@krizaka/ui/combobox` (ARIA 1.2 autocomplete: static or fetched with a debounced, aborted `onSearch`, several values
  as chips, creatable), `@krizaka/ui/tag-input`, `@krizaka/ui/date-picker` (`DatePicker`, `DateRangePicker` with
  presets, `Calendar`: ISO dates, the locale's names through `@krizaka/intl`), `@krizaka/ui/search-field` (⌘K,
  suggestions; native `SearchField`).
- **Media** — `@krizaka/ui/video-player` (accessible controls and keyboard, HLS through an hls.js the app loads only
  where needed, signed sources, subtitles, speed, full screen, pause off screen; native on expo-video at
  `@krizaka/ui/native/video-player`), `@krizaka/ui/file-upload` (`Dropzone`, `UploadList`, `useUploadQueue`: pause and
  resume through an AbortSignal, Tus-ready without depending on it), `@krizaka/ui/media-capture` (camera photo or clip,
  permission on a gesture, file-picker fallback; native on expo-camera at `@krizaka/ui/native/media-capture`),
  `@krizaka/ui/video-trimmer` (edge handles over a filmstrip, a playhead, every part stylable — closes #44),
  `@krizaka/ui/audio-player` (a seekable waveform), `@krizaka/ui/image-cropper` (a focus point and a zoom, `cropRect`).
- A new catalogue category, `media`. hls.js, expo-video and expo-camera are optional peers.
