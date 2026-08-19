"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Palette, Shield, Database, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { getCurrentUser } from "@/lib/api"
import { SettingsModalProps } from "@/types/user"
import { useLanguage } from "@/components/language-provider"


type SettingsSection = "general" | "account" | "security" | "data"

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general")
  const { theme, setTheme } = useTheme()
  const { preference, setLanguage, t } = useLanguage()
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
    { id: "general" as const, label: t("general"), icon: Settings },
    { id: "account" as const, label: t("account"), icon: UserCircle },
    { id: "security" as const, label: t("security"), icon: Shield },
    { id: "data" as const, label: t("data"), icon: Database },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] h-[600px] p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="flex h-full">
          <div className="w-45 border-r border-border bg-muted/30 p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg">{t("settings")}</DialogTitle>
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
                  <h2 className="text-xl font-semibold text-foreground mb-6">{t("general")}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <Label htmlFor="theme" className="text-sm font-medium">
                      {t("theme")}
                    </Label>
                    <Select value={theme} onValueChange={(v) => setTheme(v)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">{t("system")}</SelectItem>
                        <SelectItem value="light">{t("light")}</SelectItem>
                        <SelectItem value="dark">{t("dark")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <Label htmlFor="language" className="text-sm font-medium">
                      {t("language")}
                    </Label>
                    <Select value={preference} onValueChange={(v) => setLanguage(v as "es" | "en" | "auto")}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">{t("spanish")}</SelectItem>
                        <SelectItem value="en">{t("english")}</SelectItem>
                        <SelectItem value="auto">{t("autoDetect")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}



            {activeSection === "account" && (
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">{t("account")}</h2>
                  <p className="text-sm text-muted-foreground">{t("accountInfo")}</p>
                </div>

                {loading ? (
                  <p className="text-sm text-muted-foreground">{t("loadingData")}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="py-3 border-b border-border">
                      <p className="text-sm font-medium">{t("name")}</p>
                      <p className="text-sm text-muted-foreground">{formData.name}</p>
                    </div>
                    <div className="py-3 border-b border-border">
                      <p className="text-sm font-medium">{t("username")}</p>
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
                  <h2 className="text-xl font-semibold text-foreground mb-2">{t("security")}</h2>
                  <p className="text-sm text-muted-foreground">{t("changePasswordSubtitle")}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">{t("changePassword")}</p>
                      <p className="text-xs text-muted-foreground">{t("updatePasswordRegularly")}</p>
                    </div>
                    <Button onClick={() => router.push("/dashboard/password")}

                      size="sm"
                      className="bg-[#E30613] hover:bg-[#E30613]/90 text-white hover:text-white">
                      {t("change")}
                    </Button>
                  </div>

                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">{t("dataControl")}</h2>
                  <p className="text-sm text-muted-foreground">{t("manageData")}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">{t("exportData")}</p>
                      <p className="text-xs text-muted-foreground">{t("exportDataDesc")}</p>
                    </div>
                    <Button variant="outline" size="sm"
                      className="bg-[#E30613] hover:bg-[#E30613]/90 text-white hover:text-white">
                      {t("export")}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">{t("deleteAccount")}</p>
                      <p className="text-xs text-muted-foreground">{t("deleteAccountDesc")}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                      {t("delete")}
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
