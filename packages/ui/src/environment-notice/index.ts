/** @krizaka/ui/environment-notice — `EnvironmentNotice`, the « development version » band, and `environmentNotice(config)`, the rule that production shows nothing. Server-safe. */
export { EnvironmentNotice, type EnvironmentNoticeProps,environmentNoticeStyles } from "./environment-notice";
export { environmentNotice, type EnvironmentNoticeConfig, type EnvironmentNoticeContent, isProductionStage, PRODUCTION_STAGES } from "./model";
