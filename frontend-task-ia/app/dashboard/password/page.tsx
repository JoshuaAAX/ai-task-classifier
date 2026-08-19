"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { changePassword } from "@/lib/api"
import { useLanguage } from "@/components/language-provider"

export default function CambiarContrasenaPage() {
    const router = useRouter()
    const { t } = useLanguage()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess(false)

        // Validación de contraseñas
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
            await changePassword(formData.currentPassword, formData.newPassword)
            setSuccess(true)
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
            setTimeout(() => router.push("/dashboard"), 1000)


        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cambiar la contraseña")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-[#E30613] text-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="hover:bg-[#E30613]/90 text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="font-bold text-lg leading-tight cursor-pointer"
                            onClick={() => router.push("/dashboard")}>
                            {t("changePasswordTitle")}
                        </h1>
                        <p className="text-xs opacity-90 cursor-pointer">{t("changePasswordSubtitle")}</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-6 py-8">
                <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-success/10 text-success border-success/20">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>{t("passwordUpdated")}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder={t("currentPasswordPlaceholder")}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                required
                                disabled={isLoading || success}
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
                                disabled={isLoading || success}
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
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard")}
                                disabled={isLoading || success}
                                className="flex-1"
                            >
                                {t("cancel")}
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading || success}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("updating")}
                                    </>
                                ) : (
                                    t("changePasswordBtn")
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
