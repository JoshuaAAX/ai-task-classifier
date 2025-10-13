"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Palette, Shield, Database, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/api"
import { SettingsModalProps } from "@/types/user"


type SettingsSection = "general" | "account" | "security" | "data"

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general")
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("es")
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  })
  const [loading, setLoading] = useState(true)

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
    if (open) fetchUser()
  }, [open, router])

  const sections = [
    { id: "general" as const, label: "General", icon: Settings },
    { id: "account" as const, label: "Cuenta", icon: UserCircle },
    { id: "security" as const, label: "Seguridad", icon: Shield },
    { id: "data" as const, label: "Datos", icon: Database },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] h-[600px] p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="flex h-full">
          <div className="w-45 border-r border-border bg-muted/30 p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg">Configuración</DialogTitle>
            </DialogHeader>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                      ? "bg-background text-foreground font-medium"
                      : "text-muted-foreground hover:bg-background/50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeSection === "general" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">General</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <Label htmlFor="theme" className="text-sm font-medium">
                      Tema
                    </Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">Sistema</SelectItem>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <Label htmlFor="language" className="text-sm font-medium">
                      Idioma
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="auto">Auto-detectar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}



            {activeSection === "account" && (
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Cuenta</h2>
                  <p className="text-sm text-muted-foreground">Información de tu cuenta personal</p>
                </div>

                {loading ? (
                  <p className="text-sm text-muted-foreground">Cargando datos...</p>
                ) : (
                  <div className="space-y-4">
                    <div className="py-3 border-b border-border">
                      <p className="text-sm font-medium">Nombre</p>
                      <p className="text-sm text-muted-foreground">{formData.name}</p>
                    </div>
                    <div className="py-3 border-b border-border">
                      <p className="text-sm font-medium">Usuario</p>
                      <p className="text-sm text-muted-foreground">{formData.username}</p>
                    </div>
                    <div className="py-3 border-b border-border">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Seguridad</h2>
                  <p className="text-sm text-muted-foreground">Protege tu cuenta y datos personales.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">Cambiar contraseña</p>
                      <p className="text-xs text-muted-foreground">Actualiza tu contraseña regularmente</p>
                    </div>
                    <Button onClick={() => router.push("/dashboard/password")}

                      size="sm"
                      className="bg-[#E30613] hover:bg-[#E30613]/90 text-white hover:text-white">
                      Cambiar
                    </Button>
                  </div>

                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Control de datos</h2>
                  <p className="text-sm text-muted-foreground">Administra cómo se usan tus datos.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">Exportar datos</p>
                      <p className="text-xs text-muted-foreground">Descarga una copia de tus datos</p>
                    </div>
                    <Button variant="outline" size="sm"
                      className="bg-[#E30613] hover:bg-[#E30613]/90 text-white hover:text-white">
                      Exportar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">Eliminar cuenta</p>
                      <p className="text-xs text-muted-foreground">Elimina permanentemente tu cuenta</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
