import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Sparkles, Zap, Github } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      {/* Header */}
      <header className="bg-[#E30613] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-[#E30613] font-bold text-xl">UV</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Universidad del Valle</h1>
              <p className="text-xs opacity-90">IA Task Classifier</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="hover:opacity-80 transition-opacity">
              Cómo funciona
            </a>
            <a href="#tecnologia" className="hover:opacity-80 transition-opacity">
              Tecnología
            </a>
            <a href="#acerca" className="hover:opacity-80 transition-opacity">
              Acerca de
            </a>
            <Link href="/auth/login">
              <Button variant="secondary" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="sm">
                Registrarse
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#E30613]/10 text-[#E30613] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Proyecto de Tesis 2025</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#2C2C2C] mb-6 text-balance">IA Task Classifier</h1>

          <p className="text-xl text-[#2C2C2C]/70 mb-4 text-pretty">
            Descubre si una tarea realmente necesita inteligencia artificial
          </p>

          <p className="text-base text-[#2C2C2C]/60 mb-8 max-w-2xl mx-auto text-pretty">
            Proyecto de tesis desarrollado para la Universidad del Valle. Esta herramienta analiza descripciones de tareas
            usando modelos de Machine Learning y predice si requiere IA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-[#E30613] hover:bg-[#E30613]/90 text-white">
                Comenzar ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#2C2C2C] mb-12">Cómo funciona</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-[#E30613]/20 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#E30613]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-[#E30613]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#2C2C2C]">1. Ingresa la tarea</h3>
                <p className="text-[#2C2C2C]/60 text-sm">Describe la tarea que deseas analizar en lenguaje natural</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#E30613]/20 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#E30613]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#E30613]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#2C2C2C]">2. Análisis con IA</h3>
                <p className="text-[#2C2C2C]/60 text-sm">La IA analiza el texto usando modelos de NLP avanzados</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#E30613]/20 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#E30613]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#E30613]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#2C2C2C]">3. Obtén resultados</h3>
                <p className="text-[#2C2C2C]/60 text-sm">Recibe una respuesta clara: Requiere IA o No requiere IA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="tecnologia" className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#2C2C2C] mb-4">Tecnología detrás</h2>
          <p className="text-center text-[#2C2C2C]/60 mb-12 max-w-2xl mx-auto">
            Construido con las últimas tecnologías en inteligencia artificial y desarrollo web
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-[#2C2C2C]">Modelos</h3>
                <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
                  <li>• BERT</li>
                  <li>• Random Forest</li>
                  <li>• SVM</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-[#2C2C2C]">Lenguajes</h3>
                <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
                  <li>• Python</li>
                  <li>• TypeScript</li>
                  <li>• FastAPI</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-[#2C2C2C]">Frameworks</h3>
                <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
                  <li>• Scikit-learn</li>
                  <li>• TensorFlow</li>
                  <li>• Next.js</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="acerca" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#E30613] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">UV</span>
            </div>
            <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">Sobre el proyecto</h2>
            <p className="text-lg text-[#2C2C2C]/70 mb-6">
              Proyecto académico de tesis de la Universidad del Valle (2025)
            </p>
            <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
              Este proyecto forma parte de una investigación sobre la aplicación de técnicas de Machine Learning para la clasificación automática de tareas según si requiere  implementación con
              inteligencia artificial.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">© 2025 Universidad del Valle - IA Task Classifier</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-[#E30613] transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
