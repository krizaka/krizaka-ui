"use client";

import { createContext, useContext } from "react";

import { type ContentLocale, DEFAULT_CONTENT_LOCALE } from "@/lib/builder-demo";

/* The language the page is being written and shown in, and the page's default language (the one a missing text falls back
   to): read by the fields of the editor and by the blocks of the canvas (the canvas lives in an iframe, drawn by the same
   React tree, so the context reaches it). */
export type ContentLanguages = { readonly locale: ContentLocale; readonly defaultLocale: ContentLocale };

export const ContentLocaleContext = createContext<ContentLanguages>({ locale: DEFAULT_CONTENT_LOCALE, defaultLocale: DEFAULT_CONTENT_LOCALE });

export const useContentLanguages = () => useContext(ContentLocaleContext);
