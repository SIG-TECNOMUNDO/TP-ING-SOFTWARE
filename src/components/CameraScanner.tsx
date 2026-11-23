import React, { useEffect, useRef, useState } from "react"
import { Camera, X } from "lucide-react"

/**
 * Escáner con la cámara del dispositivo (QR y códigos de barras).
 * Sigue leyendo hasta que se cierra, para cargar varios equipos seguidos.
 */
export default function CameraScanner({
  onDetected,
  onClose,
}: {
  onDetected: (text: string) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastRead = useRef({ text: "", at: 0 })
  // Siempre llama a la versión más reciente del callback
  const onDetectedRef = useRef(onDetected)
  onDetectedRef.current = onDetected
  const [error, setError] = useState<string | null>(null)
  const [lastText, setLastText] = useState<string | null>(null)

  useEffect(() => {
    let stop: (() => void) | null = null
    let cancelled = false
    ;(async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser")
        if (cancelled || !videoRef.current) return
        const reader = new BrowserMultiFormatReader()
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current,
          (result) => {
            if (!result) return
            const text = result.getText()
            const now = Date.now()
            // Evita leer el mismo código muchas veces seguidas
            if (text === lastRead.current.text && now - lastRead.current.at < 2500)
              return
            lastRead.current = { text, at: now }
            setLastText(text)
            onDetectedRef.current(text)
          },
        )
        if (cancelled) controls.stop()
        else stop = () => controls.stop()
      } catch {
        setError(
          "No se pudo abrir la cámara. Revisá que el navegador tenga permiso o usá el lector de código de barras.",
        )
      }
    })()
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-900 p-2 space-y-2">
      <div className="flex items-center justify-between px-1 text-white">
        <span className="flex items-center gap-1.5 text-xs font-bold">
          <Camera className="w-4 h-4" />
          Apuntá al QR o al código de barras del IMEI
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          aria-label="Cerrar cámara"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error ? (
        <p className="px-1 pb-1 text-xs text-rose-200">{error}</p>
      ) : (
        <video
          ref={videoRef}
          className="w-full max-h-56 rounded-lg bg-black object-cover"
          muted
          playsInline
        />
      )}
      {lastText && (
        <p className="px-1 text-2xs text-slate-300 font-mono truncate">
          Último leído: {lastText}
        </p>
      )}
    </div>
  )
}
