import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  messages,
  getMessageKeys,
  detectLanguage,
  resolveLanguage,
  type MessageKey,
} from "@/lib/i18n"

describe("i18n dictionary", () => {
  it("es y en tienen exactamente las mismas claves", () => {
    const esKeys = Object.keys(messages.es).sort()
    const enKeys = Object.keys(messages.en).sort()
    expect(esKeys).toEqual(enKeys)
  })

  it("todas las traducciones son strings no vacías", () => {
    const keys = getMessageKeys() as MessageKey[]
    for (const key of keys) {
      expect(messages.es[key]).toBeTruthy()
      expect(messages.en[key]).toBeTruthy()
    }
  })

  it("no deja claves sin traducir (difiere entre idiomas)", () => {
    const keys = getMessageKeys() as MessageKey[]
    const diffs = keys.filter((k) => messages.es[k] === messages.en[k])
    // Claves idénticas aceptables (palabras iguales o nombres propios en ambos idiomas)
    expect(diffs).toEqual([
      "appName",
      "university",
      "frameworksTitle",
      "footerText",
      "general",
      "spanish",
      "english",
    ])
  })
})

describe("detectLanguage", () => {
  const originalLanguage = Object.getOwnPropertyDescriptor(
    window.navigator,
    "language",
  )

  afterEach(() => {
    if (originalLanguage) {
      Object.defineProperty(window.navigator, "language", originalLanguage)
    }
  })

  it("detecta 'en' para navegadores en inglés", () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "en-US",
    })
    expect(detectLanguage()).toBe("en")
  })

  it("detecta 'es' para navegadores en español", () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "es-CO",
    })
    expect(detectLanguage()).toBe("es")
  })

  it("cualquier idioma que no sea inglés cae a español", () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "fr-FR",
    })
    expect(detectLanguage()).toBe("es")
  })
})

describe("resolveLanguage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { navigator: { language: "en-US" } })
  })

  it("preferencia explícita gana", () => {
    expect(resolveLanguage("es", "en")).toBe("es")
    expect(resolveLanguage("en", "es")).toBe("en")
  })

  it("auto usa el idioma detectado", () => {
    expect(resolveLanguage("auto", "en")).toBe("en")
    expect(resolveLanguage("auto", "es")).toBe("es")
  })
})