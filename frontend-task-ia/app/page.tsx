"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Sparkles, Zap, Github } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#E30613] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-[#E30613] font-bold text-xl">UV</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{t("university")}</h1>
              <p className="text-xs opacity-90">{t("appName")}</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="hover:opacity-80 transition-opacity">
              {t("howItWorks")}
            </a>
            <a href="#tecnologia" className="hover:opacity-80 transition-opacity">
              {t("technology")}
            </a>
            <a href="#acerca" className="hover:opacity-80 transition-opacity">
              {t("about")}
            </a>
            <Link href="/auth/login">
              <Button variant="secondary" size="sm" className="text-[#2C2C2C]">
                {t("login")}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="sm" className="text-[#2C2C2C]">
                {t("register")}
              </Button>
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#E30613]/10 text-[#E30613] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t("thesisBadge")}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">{t("appName")}</h1>

          <p className="text-xl text-foreground/70 mb-4 text-pretty">{t("heroSubtitle")}</p>

          <p className="text-base text-foreground/60 mb-8 max-w-2xl mx-auto text-pretty">{t("heroDesc")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-[#E30613] hover:bg-[#E30613]/90 text-white">
                {t("startNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">{t("howItWorksTitle")}</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-[#E30613]/20 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#E30613]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-[#E30613]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t("step1Title")}</h3>
                <p className="text-foreground/60 text-sm">{t("step1Desc")}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#E30613]/20 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#E30613]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#E30613]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t("step2Title")}</h3>
                <p className="text-foreground/60 text-sm">{t("step2Desc")}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#E30613]/20 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#E30613]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#E30613]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t("step3Title")}</h3>
                <p className="text-foreground/60 text-sm">{t("step3Desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="tecnologia" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">{t("techTitle")}</h2>
          <p className="text-center text-foreground/60 mb-12 max-w-2xl mx-auto">{t("techDesc")}</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-foreground">{t("modelsTitle")}</h3>
                <ul className="space-y-2 text-sm text-foreground/70">

                  <li>• SVM</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-foreground">{t("languagesTitle")}</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Python</li>
                  <li>• TypeScript</li>
                  <li>• FastAPI</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-foreground">{t("frameworksTitle")}</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
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
      <section id="acerca" className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#E30613] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">UV</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("aboutTitle")}</h2>
            <p className="text-lg text-foreground/70 mb-6">{t("aboutDesc1")}</p>
            <p className="text-foreground/60 max-w-2xl mx-auto">{t("aboutDesc2")}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">{t("footerText")}</p>
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