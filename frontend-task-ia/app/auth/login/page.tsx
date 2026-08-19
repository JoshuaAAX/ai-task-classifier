"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Cookies from "js-cookie"
import { loginUser } from "@/lib/api"
import { useLanguage } from "@/components/language-provider"


export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await loginUser(formData)

      // Guardar token en cookie y localStorage
      Cookies.set("auth_token", data.access_token, { expires: 1 })
      localStorage.setItem("auth_token", data.access_token)

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-[#E30613] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-[#E30613] font-bold text-xl">UV</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{t("university")}</h1>
              <p className="text-xs opacity-90">{t("appName")}</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="w-24 h-24 bg-[#E30613]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 bg-[#E30613] rounded flex items-center justify-center">
                <span className="text-white font-bold text-2xl">UV</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">{t("loginTitle")}</CardTitle>
            <CardDescription>{t("loginDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Espacio entre el campo de contraseña y el botón */}
              <div className="mt-7">
                <Button
                  type="submit"
                  className="w-full bg-[#E30613] hover:bg-[#E30613]/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loggingIn")}
                    </>
                  ) : (
                    t("enter")
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-foreground/60">
                {t("noAccount")}{" "}
                <Link href="/auth/register" className="text-[#E30613] hover:underline font-medium">
                  {t("registerHere")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
