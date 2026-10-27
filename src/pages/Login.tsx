import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MonitorSmartphone, AlertCircle } from "lucide-react"
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
    event.preventDefault(); setError(""); setLoading(true)
    try { await login(email, password); navigate("/") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión.") }
    finally { setLoading(false) }
  }
  return <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"><div className="sm:mx-auto sm:w-full sm:max-w-md"><div className="flex justify-center text-primary"><MonitorSmartphone className="w-12 h-12" /></div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">SIG-Tecnomundo</h2><p className="mt-2 text-center text-sm text-gray-600">Sistema Integral de Gestión</p></div><div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"><Card className="px-4 py-8 sm:px-10"><form className="space-y-6" onSubmit={handleLogin}>{error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"><div className="flex"><AlertCircle className="h-5 w-5 text-red-500" /><div className="ml-3"><p className="text-sm text-red-700">{error}</p></div></div></div>}<div><Label htmlFor="email">Correo electrónico o Usuario</Label><div className="mt-1"><Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ejemplo@tecnomundo.com" /></div></div><div><Label htmlFor="password">Contraseña</Label><div className="mt-1"><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></div></div><Button type="submit" className="w-full py-2.5 text-base" disabled={loading}>{loading ? "Iniciando sesión..." : "Iniciar sesión"}</Button></form><div className="mt-6 text-center"><p className="text-xs text-gray-500">Usa <span className="font-semibold">admin@tecnomundo.com</span> / <span className="font-semibold">admin</span> para probar</p></div></Card></div></div>
}
