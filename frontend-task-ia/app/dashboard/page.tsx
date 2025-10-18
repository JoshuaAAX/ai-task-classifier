"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, LogOut, Settings, User, Send, PanelLeft } from "lucide-react"
import Cookies from "js-cookie"
import { SettingsModal } from "@/components/settings-modal"
import { getCurrentUser, analyzeTask, recommendTools } from "@/lib/api"
import ReactMarkdown from "react-markdown"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function DashboardPage() {
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [task, setTask] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [result, setResult] = useState<{ requiresAI: boolean; text: string } | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [userEmail, setUserEmail] = useState<string>("")


  const [messages, setMessages] = useState<
    Array<{ text: string; from: "user" | "ai"; requiresAI?: boolean }>
  >([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  /*
  const [conversations, setConversations] = useState<Array<{ id: string; title: string; date: string }>>([
    { id: "1", title: "Sistema de recomendación", date: "Hoy" },
    { id: "2", title: "Clasificación de imágenes", date: "Ayer" },
    { id: "3", title: "Análisis de sentimientos", date: "Hace 2 días" },
  ])
  */


  /*
    useEffect(() => {
      // Check if user is authenticated
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
      }
    }, [router])
  */

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        setUserEmail(user.email)
      } catch (error) {
        console.error("Error verificando autenticación:", error)
        localStorage.removeItem("auth_token")
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  const handleAnalyze = async () => {
    if (!task.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    const currentTask = task
    setTask("")

    // Mostrar mensaje del usuario
    setMessages((prev) => [...prev, { text: currentTask, from: "user" }])

    try {
      // Paso 1️⃣ → Clasificar la tarea
      const data = await analyzeTask(currentTask)

      // Mostrar si requiere IA
      setMessages((prev) => [
        ...prev,
        { text: data.text, from: "ai", requiresAI: data.requiresAI },
      ])

      // Paso 2️⃣ → Si requiere IA, pedir recomendaciones
      if (data.requiresAI) {
        const rec = await recommendTools(currentTask)
        console.log(rec)

        const formattedResponse = `
###  Descripción de la tarea: ${rec.respuesta_formateada?.descripcion_tarea || "Sin descripción"}

###  Herramientas recomendadas:
${rec.respuesta_formateada?.herramientas_recomendadas
            ?.map(
              (h: any, i: number) => `
${i + 1}. **${h.nombre}**
   -  Descripción: ${h.descripcion}
   -  Enlace: [${h.link_verificado}](${h.link_verificado})
   -  Motivo: ${h.motivo}`
            )
            .join("\n\n") || "No se encontraron herramientas."}

---

###  Modelos sugeridos (Hugging Face):
${rec.huggingface_sugeridos?.length
            ? rec.huggingface_sugeridos
              .map(
                (m: any, i: number) =>
                  `${i + 1}. [${m.name}](${m.url}) — ${m.description || "Sin descripción"}`
              )
              .join("\n")
            : "Ninguno encontrado."}
`

        setMessages((prev) => [
          ...prev,
          { text: formattedResponse.trim(), from: "ai" },
        ])
      }
    } catch (error) {
      console.error("Error analizando o recomendando:", error)
      setMessages((prev) => [
        ...prev,
        { text: "Error al procesar la tarea o las recomendaciones.", from: "ai" },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }


  {/*

  const handleAnalyze = async () => {
    if (!task.trim()) return

    const currentTask = task
    setTask("")

    // Agregar mensaje del usuario inmediatamente
    setMessages((prev) => [...prev, { text: currentTask, from: "user" }])

    try {
      const data = await analyzeTask(currentTask)
      console.log(data)

      // Agregar mensaje de IA como otro mensaje normal
      setMessages((prev) => [
        ...prev,
        { text: data.text, from: "ai", requiresAI: data.requiresAI },
      ])
    } catch (error) {
      console.error("Error analizando tarea:", error)
      setMessages((prev) => [
        ...prev,
        { text: "Error al procesar la tarea.", from: "ai" },
      ])
    }
  }

  */}

  const handleLogout = () => {
    Cookies.remove("auth_token")
    localStorage.removeItem("auth_token")
    router.push("/")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-13"
          } bg-muted border-r border-border flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="p-2 border-b border-border flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-muted flex-shrink-0"
          >
            {sidebarOpen ? <PanelLeft className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>
          {sidebarOpen && (
            <div className="flex items-center gap-2 flex-1 min-w-0">

              <h2 className="font-bold text-sm text-foreground truncate">IA Task Classifier</h2>
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Conversations List 
          {sidebarOpen ? (
            <div className="space-y-1 px-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{conv.title}</p>
                      <p className="text-xs text-muted-foreground">{conv.date}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2 px-2">
              {conversations.slice(0, 3).map((conv) => (
                <button
                  key={conv.id}
                  className="w-full p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
            */}
        </div>

        {/* User Menu */}
        <div className="border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`w-full ${sidebarOpen ? "px-2 py-4" : "px-2 py-4"
                  } rounded-lg hover:bg-background/50 transition-colors flex items-center gap-3`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">UV</AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{userEmail || "Cargando..."}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12 space-y-6">
            {messages.length === 0 && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Ingresa tu tarea para comenzar</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 items-end ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "ai" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      <Brain className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`inline-block px-4 py-3 rounded-2xl break-words
  ${msg.from === "user"
                      ? "bg-blue-400 text-white max-w-md"
                      : msg.requiresAI
                        ? "bg-green-100 text-green-800 max-w-4xl"
                        : "bg-red-100 text-red-800 max-w-3xl"
                    }`}
                >
                  {msg.from === "ai" && msg.requiresAI !== undefined ? (
                    <p className="text-sm font-semibold">
                      {msg.requiresAI ? "Requiere IA" : "No requiere IA"}
                    </p>
                  ) : (
                    <div className="prose prose-sm max-w-none text-sm">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {msg.from === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">UV</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>


        {/* Input Area */}
        <div className="bg-background">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="relative">
              <Textarea
                placeholder="Ingresa tu tarea aquí..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="resize-none pr-12 min-h-[52px] max-h-[200px] border-0 shadow-none focus-visible:ring-0 bg-muted"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!task.trim() || isAnalyzing}
                size="icon"
                className="absolute right-2 bottom-2 bg-primary hover:bg-primary/10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              IA Task Classifier.
            </p>
          </div>
        </div>
      </main>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
