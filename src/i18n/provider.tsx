"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate } from "./dictionary";

export type Lang = "en" | "ur";

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
  pick: (en?: string | null, ur?: string | null) => string;
};

const I18nContext = createContext<I18nValue | null>(null);
export const LANG_STORAGE_KEY = "alnoor.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "ur" || stored === "en") setLangState(stored);
  }, []);

  const applyLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable */
    }
    const root = document.documentElement;
    root.lang = next;
    root.dir = next === "ur" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir: lang === "ur" ? "rtl" : "ltr",
      setLang: applyLang,
      toggle: () => applyLang(lang === "en" ? "ur" : "en"),
      t: (key: string) => translate(key, lang),
      pick: (en?: string | null, ur?: string | null) => {
        const primary = lang === "ur" ? ur : en;
        return (primary && primary.trim()) || en || ur || "";
      },
    }),
    [lang, applyLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }
  return ctx;
}

export const langInitScript = `(function(){try{var l=localStorage.getItem('${LANG_STORAGE_KEY}');if(l!=='ur'&&l!=='en'){l='en';}document.documentElement.lang=l;document.documentElement.dir=(l==='ur')?'rtl':'ltr';}catch(e){}})();`;
