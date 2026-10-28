import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Lock, Mail } from "lucide-react"
import { Card, Button, Input, Label } from "../components/ui"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elementos decorativos sutiles de fondo */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-100/50 blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Logo TecnoMundo */}
        <div className="inline-flex items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 mb-4 transition-transform hover:scale-[1.02]">
          <img
            src="/logo.png"
            alt="TecnoMundo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
          Sistema Integral de Gestión
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Control de inventario, ventas y servicio técnico
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Card className="px-6 py-8 sm:px-10 border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)]">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  <div className="ml-2.5">
                    <p className="text-xs font-semibold text-rose-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Correo electrónico o Usuario</Label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@tecnomundo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-sm font-semibold shadow-md shadow-blue-900/20"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Ingresar al Sistema"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-2xs text-slate-400">
              Credenciales de prueba:{" "}
              <span className="font-semibold text-slate-600">
                admin@tecnomundo.com
              </span>{" "}
              / <span className="font-semibold text-slate-600">admin</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
