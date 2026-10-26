// Pure, shared by the web and native components: the rule « production shows nothing », in one place.

/** The stages that are the real offer: the notice renders nothing there. Any other stage (development, staging, preview…) shows it. */
export const PRODUCTION_STAGES: readonly string[] = ["production", "prod"];

export type EnvironmentNoticeConfig = {
  /** The deployment's stage, read once by the app (an `APP_ENVIRONMENT` variable, a setting in its database). Missing = not production: the notice shows. */
  stage: string | null | undefined;
  /** « Development version ». Passed translated; it also names the region. */
  title: string;
  /** « Data can be reset at any time. Not a commercial offer. » Passed translated. */
  message: string;
  /** An optional way to learn more (« What this means »). */
  link?: { label: string; href: string };
};

export type EnvironmentNoticeContent = Omit<EnvironmentNoticeConfig, "stage"> & { stage: string };

/** Is this stage the real offer? Case and spaces do not matter. */
export const isProductionStage = (stage: string | null | undefined): boolean => PRODUCTION_STAGES.includes((stage ?? "").trim().toLowerCase());

/**
 * What to show, or `null` when the stage is production. The app reads its stage once and calls this (or passes the
 * same `stage` to the component, which calls it): never a `if` per page. A missing stage shows the notice, so a
 * deployment that forgets to say it is production is seen, not silent.
 */
export function environmentNotice(config: EnvironmentNoticeConfig): EnvironmentNoticeContent | null {
  if (isProductionStage(config.stage)) return null;
  return { ...config, stage: (config.stage ?? "").trim().toLowerCase() || "unknown" };
}
