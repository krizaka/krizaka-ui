/** @krizaka/ui/environment-notice — `EnvironmentNotice`, the « development version » band, and `environmentNotice(config)`, the rule that production shows nothing. Server-safe. */
export { EnvironmentNotice, environmentNoticeStyles, type EnvironmentNoticeProps } from "./environment-notice";
export { type EnvironmentNoticeConfig, type EnvironmentNoticeContent, environmentNotice, isProductionStage, PRODUCTION_STAGES } from "./model";
