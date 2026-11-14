/* The limits of the workspace page (krizaka-internal#3549), per window width: where the editor may start, how wide the preview
   must be, how many tab stops lead to the first field. One place for the browser check (builder-check.mjs) and its unit test. */
export const LIMITS = { 1440: { editorTop: 320, previewWidth: 720 }, 360: { editorTop: 780 }, tabStops: 10 };
