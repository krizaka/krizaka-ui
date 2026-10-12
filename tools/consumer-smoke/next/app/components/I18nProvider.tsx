"use client";
import { createI18nReact } from "@krizaka/i18n/react";
import type en from "@/messages/en.json";

export const { I18nProvider, useI18n } = createI18nReact<typeof en, "en" | "fr">({ locales: ["en", "fr"], defaultLocale: "en" });
