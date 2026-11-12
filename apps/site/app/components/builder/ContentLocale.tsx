"use client";

import { createContext, useContext } from "react";

import { type ContentLocale, DEFAULT_CONTENT_LOCALE } from "@/lib/builder-demo";

/* The language the page is being written and shown in: read by the fields of the editor and by the blocks of the canvas
   (the canvas lives in an iframe, drawn by the same React tree, so the context reaches it). */
export const ContentLocaleContext = createContext<ContentLocale>(DEFAULT_CONTENT_LOCALE);

export const useContentLocale = () => useContext(ContentLocaleContext);
