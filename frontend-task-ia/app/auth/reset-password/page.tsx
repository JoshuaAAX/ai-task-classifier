"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { resetPassword } from "@/lib/api"
import { useLanguage } from "@/components/language-provider"


function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    token: searchParams.get("token") || "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("passMismatch"))
      setIsLoading(false)
      return
    }
    if (formData.newPassword.length < 8) {
      setError(t("passMin"))
      setIsLoading(false)
      return
    }
    if (!/\d/.test(formData.newPassword)) {
      setError(t("passNumber"))
      setIsLoading(false)
      return
    }
    if (!/[A-Z]/.test(formData.newPassword)) {
      setError(t("passUpper"))
      setIsLoading(false)
      return
    }

    try {
      await resetPassword(formData.token, formData.newPassword)
      setTimeout(() => router.push("/auth/login"), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorProcessing"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="w-24 h-24 bg-[#E30613]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <div className="w-16 h-16 bg-[#E30613] rounded flex items-center justify-center">
            <span className="text-white font-bold text-2xl">UV</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-foreground">{t("resetTitle")}</CardTitle>
        <CardDescription>{t("resetDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="token">{t("tokenLabel")}</Label>
            <Input
              id="token"
              type="text"
              placeholder={t("tokenPlaceholder")}
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("newPassword")}</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("confirmNewPasswordPlaceholder")}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mt-7">
            <Button
              type="submit"
              className="w-full bg-[#E30613] hover:bg-[#E30613]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("resetting")}
                </>
              ) : (
                t("resetPasswordBtn")
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-foreground/60">
            <Link href="/auth/login" className="text-[#E30613] hover:underline font-medium">
              {t("backToLogin")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


export default function ResetPasswordPage() {
  const { t } = useLanguage()
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
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}