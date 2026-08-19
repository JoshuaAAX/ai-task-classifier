import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { LanguageProvider, useLanguage } from "@/components/language-provider"

function Probe() {
  const { t, setLanguage, lang } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="text">{t("loginTitle")}</span>
      <button onClick={() => setLanguage("en")}>to-en</button>
      <button onClick={() => setLanguage("es")}>to-es</button>
    </div>
  )
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    cleanup()
    window.localStorage.clear()
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "en-US",
    })
  })

  it("traduce al idioma seleccionado", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    expect(screen.getByTestId("text").textContent).toBe("Log in")
    fireEvent.click(screen.getByText("to-es"))
    expect(screen.getByTestId("lang").textContent).toBe("es")
    expect(screen.getByTestId("text").textContent).toBe("Iniciar sesión")
  })

  it("persiste la preferencia en localStorage", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    fireEvent.click(screen.getByText("to-en"))
    expect(window.localStorage.getItem("app_language")).toBe("en")
  })

  it("lanza error si se usa fuera del provider", () => {
    expect(() => render(<Probe />)).toThrow(/LanguageProvider/)
  })
})