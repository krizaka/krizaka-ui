"use client";
import { Rich } from "@krizaka/i18n/rich";
import { useI18n } from "./I18nProvider";

export function Lead() {
  const { t } = useI18n();
  return (
    <p>
      <Rich text={t("home.lead")} />
    </p>
  );
}
