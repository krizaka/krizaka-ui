/** @krizaka/ui/genui — data-driven UI on A2UI v0.9 (ADR-082): `GenUiStream`, `GenUiSurface`, `baseGenUiCatalog`, the validator (`validateMessage`), the store (`readStream`, `applyMessage`, `applyLine`, `extractGenUi`), the shared checks for catalog entries. Client ("use client"). */
export { baseGenUiCatalog, formatGenUiValue } from "./catalog";
export {
  allowKeys,
  checkBinding,
  checkChildren,
  checkCurrency,
  checkEnum,
  checkId,
  checkNumber,
  checkText,
  GENUI_CATALOG_ID,
  GENUI_FORMATS,
  GENUI_LIMITS,
  GENUI_VERSION,
  type GenUiBinding,
  type GenUiComponent,
  type GenUiFormat,
  type GenUiMessage,
  type GenUiPropsCheck,
  type GenUiResult,
  isBinding,
  parsePath,
  sanitizeData,
  validateMessage,
} from "./spec";
export { applyLine, applyMessage, emptyGenUiState, extractGenUi, type GenUiExtract, type GenUiState, type GenUiSurfaceState, readPath, readStream } from "./store";
export {
  type GenUiCatalog,
  type GenUiEntry,
  type GenUiLabels,
  genUiLabels,
  type GenUiRenderContext,
  GenUiStream,
  type GenUiStreamProps,
  GenUiSurface,
  type GenUiSurfaceProps,
} from "./surface";
