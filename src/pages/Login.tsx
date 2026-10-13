import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MonitorSmartphone } from "lucide-react"
import { Alert, Button, Card, Input, Label } from "../components/ui"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? "/"

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "No se pudo iniciar sesión",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary">
          <MonitorSmartphone className="w-12 h-12" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SIG-Tecnomundo
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema Integral de Gestión
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <Alert>{error}</Alert>}
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ejemplo@tecnomundo.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
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
            <Button
              type="submit"
              className="w-full py-2.5 text-base"
              disabled={loading}
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-500">
            Datos iniciales:{" "}
            <span className="font-semibold">admin@tecnomundo.com</span> /{" "}
            <span className="font-semibold">admin</span>
          </p>
        </Card>
      </div>
    </div>
  )
}
