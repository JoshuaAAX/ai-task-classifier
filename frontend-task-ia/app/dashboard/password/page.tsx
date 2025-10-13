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

export default function CambiarContrasenaPage() {
    const router = useRouter()
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
            setError("Las contraseñas nuevas no coinciden")
            setIsLoading(false)
            return
        }

        if (formData.newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            setIsLoading(false)
            return
        }

        if (!/\d/.test(formData.newPassword)) {
            setError("La contraseña debe incluir al menos un número")
            setIsLoading(false)
            return
        }

        if (!/[A-Z]/.test(formData.newPassword)) {
            setError("La contraseña debe incluir al menos una letra mayúscula")
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
                            Cambiar contraseña
                        </h1>
                        <p className="text-xs opacity-90 cursor-pointer">Actualiza tu contraseña de acceso</p>
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
                                <AlertDescription>Contraseña actualizada exitosamente. Redirigiendo...</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Contraseña actual</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder="Ingresa tu contraseña actual"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva contraseña</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
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
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading || success}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
                                ) : (
                                    "Cambiar contraseña"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
