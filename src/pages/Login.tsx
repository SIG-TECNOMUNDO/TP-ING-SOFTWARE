import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Lock, Mail, Eye, EyeOff } from "lucide-react"
import { Card, Button, Label } from "../components/ui"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Card className="px-6 py-8 sm:px-10 sm:py-10 border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.35)]">
          {/* Logo centrado sin fondo */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <img
              src="/logo.png"
              alt="TecnoMundo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto mb-3 dark:brightness-110"
            />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Sistema Integral de Gestión
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3.5 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <p className="ml-2.5 text-xs font-semibold text-rose-800 dark:text-rose-300">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
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
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
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
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
              className="w-full py-2.5 text-sm font-semibold rounded-xl shadow-sm"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Ingresar al Sistema"}
            </Button>
          </form>

          {/* Accesos de prueba ordenados */}
          <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-2xs text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider font-semibold mb-3">
              Accesos de prueba
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@tecnomundo.com")}
                className="py-2 px-2 text-xs font-medium rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("ventas.yofre@tecnomundo.com")}
                className="py-2 px-2 text-xs font-medium rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer text-center"
              >
                Ventas
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("tec.altacba@tecnomundo.com")}
                className="py-2 px-2 text-xs font-medium rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer text-center"
              >
                Técnico
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
