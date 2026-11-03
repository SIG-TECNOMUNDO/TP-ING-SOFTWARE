import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Lock, Mail, Eye, EyeOff, Sun, Moon, ShieldCheck, Sparkles } from "lucide-react"
import { Card, Button, Label } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function Login() {
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/")
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "No se pudo iniciar sesión.",
      )
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (userEmail: string, userPass: string = "admin") => {
    setEmail(userEmail)
    setPassword(userPass)
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Luces y degradados decorativos modernos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent blur-3xl pointer-events-none -z-10 dark:from-primary/20 dark:via-secondary/10"></div>
      <div className="absolute -top-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-400/10 dark:bg-primary/20 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-orange-400/10 dark:bg-secondary/15 blur-3xl pointer-events-none -z-10"></div>

      {/* Botón flotante para alternar Modo Oscuro / Claro en la esquina superior */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-semibold"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-600 transition-transform -rotate-12 hover:rotate-0" />
              <span className="hidden sm:inline">Modo Oscuro</span>
            </>
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Contenedor del Logo de TecnoMundo con soporte óptimo para claro y oscuro */}
        <div className="inline-flex items-center justify-center bg-white p-3.5 sm:p-4 rounded-2xl shadow-md shadow-slate-900/5 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-700/80 mb-5 transition-transform hover:scale-[1.02]">
          <img
            src="/logo.png"
            alt="TecnoMundo"
            className="h-9 sm:h-11 w-auto object-contain max-w-[210px] sm:max-w-[240px]"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Acceso Seguro al Sistema</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
          Sistema Integral de Gestión
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Inventario, ventas, caja y servicio técnico
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full">
        <Card className="px-5 py-7 sm:px-9 sm:py-8 border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.4)] backdrop-blur-xl">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3.5 rounded-xl animate-shake">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="ml-2.5">
                    <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                Correo Electrónico
              </Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@tecnomundo.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                  Contraseña
                </Label>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-sm font-semibold rounded-xl shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Ingresar al Sistema"
              )}
            </Button>
          </form>

          {/* Accesos rápidos de prueba */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xs text-slate-400 dark:text-slate-500 mb-2.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              <span>Accesos rápidos de prueba:</span>
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => fillCredentials("admin@tecnomundo.com")}
                className="px-2.5 py-1 text-2xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("ventas.yofre@tecnomundo.com")}
                className="px-2.5 py-1 text-2xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                Ventas Yofre
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("tec.altacba@tecnomundo.com")}
                className="px-2.5 py-1 text-2xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                Técnico
              </button>
            </div>
          </div>
        </Card>
      </div>

      <footer className="mt-8 text-center text-2xs text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} SIG-TecnoMundo. Todos los derechos reservados.
      </footer>
    </div>
  )
}
