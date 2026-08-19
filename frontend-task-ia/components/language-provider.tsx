"use client"

import * as React from "react"
import { messages, detectLanguage, resolveLanguage, type Language, type MessageKey } from "@/lib/i18n"

interface LanguageContextValue {
  lang: "es" | "en"
  preference: Language
  setLanguage: (pref: Language) => void
  t: (key: MessageKey) => string
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "app_language"

function getInitialPreference(): Language {
  if (typeof window === "undefined") return "auto"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "es" || stored === "en" || stored === "auto" ? stored : "auto"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = React.useState<Language>(getInitialPreference)
  const [lang, setLang] = React.useState<"es" | "en">("es")

  React.useEffect(() => {
    const detected = detectLanguage()
    setLang(resolveLanguage(preference, detected))
  }, [preference])

  const setLanguage = React.useCallback((pref: Language) => {
    setPreference(pref)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, pref)
    }
  }, [])

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      lang,
      preference,
      setLanguage,
      t: (key: MessageKey) => messages[lang][key],
    }),
    [lang, preference, setLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>")
  return ctx
}