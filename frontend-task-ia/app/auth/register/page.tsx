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
import { registerUser } from "@/lib/api"
import type { RegisterData } from "@/types/user"


export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Validacion si las contraseñas no coinciden
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    // Validación al menos 8 caracteres
     if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      setIsLoading(false)
      return
    }

    // Validación al menos un número
    if (!/\d/.test(formData.password)) {
      setError("La contraseña debe incluir al menos un número")
      setIsLoading(false)
      return
    }

    try {
      const data: RegisterData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      }

      await registerUser(data)
      setSuccess(true)
      setTimeout(() => router.push("/auth/login"), 1500)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white flex flex-col">
      {/* Header */}
      <header className="bg-[#E30613] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-[#E30613] font-bold text-xl">UV</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Universidad del Valle</h1>
              <p className="text-xs opacity-90">IA Task Classifier</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="w-24 h-24 bg-[#E30613]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 bg-[#E30613] rounded flex items-center justify-center">
                <span className="text-white font-bold text-2xl">UV</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-[#2C2C2C]">Crear cuenta</CardTitle>
            <CardDescription>Regístrate para acceder al clasificador de tareas IA</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>¡Registro exitoso! Redirigiendo al inicio de sesión...</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Elige un nombre de usuario"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crea una contraseña segura"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
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
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-[#2C2C2C]/60">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="text-[#E30613] hover:underline font-medium">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div >
  )
}
