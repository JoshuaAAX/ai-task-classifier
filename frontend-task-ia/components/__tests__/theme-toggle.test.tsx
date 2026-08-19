import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

vi.mock("next-themes", async () => {
  const actual = await vi.importActual<typeof import("next-themes")>("next-themes")
  return {
    ...actual,
  }
})

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe("ThemeToggle", () => {
  it("renderiza el botón de tema", () => {
    renderToggle()
    const btn = screen.getByRole("button", { name: "theme" })
    expect(btn).toBeInTheDocument()
  })

  it("cambia el tema al hacer clic", () => {
    renderToggle()
    const btn = screen.getByRole("button", { name: "theme" })
    fireEvent.click(btn)
    // next-themes marca el html con la clase .dark
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    fireEvent.click(btn)
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
})