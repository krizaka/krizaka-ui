---
"@krizaka/ui": minor
---

media-grid: the whole `VideoCard` opens the video (the title's stretched link now covers the picture too; badges and duration let the click through), the animated preview is requested only after the pointer or focus rests `previewDelay` (200 ms), fades in over the poster and is removed on leave (on a phone only the most visible card plays it, never under Save-Data or reduced motion; none for a blurred picture), `posterPriority` for the first row, and new `VideoCardSkeleton`, `MediaGridSkeleton` (the real 16:9 and 9:16 shapes) and `LoadMore` (infinite scroll a screenful ahead, with the button as fallback).
