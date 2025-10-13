"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Save, ArrowLeft } from "lucide-react"
import { getCurrentUser, updateUser } from "@/lib/api"

export default function PerfilPage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  })

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser()
        setFormData({
          name: user.name,
          email: user.email,
          username: user.username,
        })
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        username: formData.username,
      })
      setIsEditing(false)
      console.log("Perfil actualizado correctamente")
    } catch (error) {
      console.log("Error al actualizar perfil")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#E30613] text-white shadow-md">
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
            <h1
              className="font-bold text-lg leading-tight cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Mi Perfil
            </h1>
            <p
              className="text-xs opacity-90 cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Administra tu información personal
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {loading ? (
                  <Skeleton className="w-28 h-28 rounded-full" />
                ) : (
                  <div className="w-28 h-28 bg-[#E30613]/10 rounded-full flex items-center justify-center">
                    <div className="w-22 h-22 bg-[#E30613] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {loading ? (
                  <>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-56" />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-foreground">
                      {formData.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                  </>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input
                    id="nombre"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="disabled:opacity-100"
                  />
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={!isEditing}
                    className="disabled:opacity-100"
                  />
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="disabled:opacity-100"
                />
              )}
            </div>



            {/* Buttons */}
            {!loading && (
              <div className="flex justify-end gap-3 pt-4">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#E30613] hover:bg-[#E30613]/90"
                  >
                    Editar perfil
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-[#E30613] hover:bg-[#E30613]/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
