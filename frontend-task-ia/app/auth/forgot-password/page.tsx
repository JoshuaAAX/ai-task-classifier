"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { forgotPassword } from "@/lib/api"
import { useLanguage } from "@/components/language-provider"


export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [sentMsg, setSentMsg] = useState("")
  const [resetLink, setResetLink] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSentMsg("")
    setResetLink("")

    const email = new FormData(e.currentTarget).get("email") as string

    try {
      const data = await forgotPassword(email)
      setSentMsg(data.msg)
      if (data.dev_mode && data.reset_link) {
        setResetLink(data.reset_link)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorProcessing"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="w-24 h-24 bg-[#E30613]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 bg-[#E30613] rounded flex items-center justify-center">
                <span className="text-white font-bold text-2xl">UV</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">{t("forgotTitle")}</CardTitle>
            <CardDescription>{t("forgotDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {sentMsg && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>{sentMsg}</AlertDescription>
                </Alert>
              )}

              {resetLink && (
                <div className="space-y-2">
                  <p className="text-xs text-foreground/70">{t("devModeHint")}</p>
                  <a
                    href={resetLink}
                    className="block break-all rounded-md border border-border bg-muted p-3 text-sm text-[#E30613] hover:underline"
                  >
                    {resetLink}
                  </a>
                </div>
              )}

              {!sentMsg && (
                <div className="space-y-2">
                  <Label htmlFor="email">{t("emailRealLabel")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailRealPlaceholder")}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {!sentMsg && (
                <div className="mt-7">
                  <Button
                    type="submit"
                    className="w-full bg-[#E30613] hover:bg-[#E30613]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      t("sendLink")
                    )}
                  </Button>
                </div>
              )}

              <div className="text-center text-sm text-foreground/60">
                <Link href="/auth/login" className="text-[#E30613] hover:underline font-medium">
                  {t("backToLogin")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}