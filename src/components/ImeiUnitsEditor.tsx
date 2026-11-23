import React, { useRef, useState } from "react"
import { Camera, Check, Pencil, Plus, ScanLine, X } from "lucide-react"
import CameraScanner from "./CameraScanner"
import { isValidImei, normalizeImei } from "../data/soldDevices"

export interface ImeiUnitDraft {
  imei: string
  branchId: string
}

/** Toma el IMEI de lo que se escribió o se escaneó (un QR puede traer más texto). */
export function extractImei(raw: string) {
  const match = raw.match(/\d{15}/)
  return match ? match[0] : normalizeImei(raw.trim())
}

/**
 * Carga de IMEI por unidad: un campo para escribir o escanear (lector de
 * código de barras o cámara), y la lista de IMEI cargados como etiquetas
 * que se pueden editar o quitar.
 */
export default function ImeiUnitsEditor({
  units,
  onChange,
  branches,
  checkImei,
}: {
  units: ImeiUnitDraft[]
  onChange: (units: ImeiUnitDraft[]) => void
  branches: { id: string; label: string }[]
  /** Valida contra otros productos o equipos vendidos. */
  checkImei: (imei: string) => string | null
}) {
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "")
  const [value, setValue] = useState("")
  const [message, setMessage] = useState<{
    type: "error" | "success"
    text: string
  } | null>(null)
  const [editing, setEditing] = useState<{ imei: string; value: string } | null>(
    null,
  )
  const [cameraOpen, setCameraOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Copia al día de la lista para lecturas seguidas de la cámara
  const unitsRef = useRef(units)
  unitsRef.current = units

  const problemOf = (imei: string, current: ImeiUnitDraft[], ignore?: string) => {
    if (!isValidImei(imei)) return "debe tener 15 dígitos"
    if (current.some((u) => u.imei === imei && u.imei !== ignore))
      return "ya está en la lista"
    const external = checkImei(imei)
    return external
  }

  const addImeis = (rawValues: string[]) => {
    const current = [...unitsRef.current]
    const added: string[] = []
    const failed: { imei: string; reason: string }[] = []
    for (const raw of rawValues) {
      if (!raw.trim()) continue
      const imei = extractImei(raw)
      const problem = problemOf(imei, current)
      if (problem) failed.push({ imei: imei || raw, reason: problem })
      else {
        current.push({ imei, branchId })
        added.push(imei)
      }
    }
    if (added.length) onChange(current)
    if (failed.length === 1)
      setMessage({
        type: "error",
        text: `El IMEI ${failed[0]!.imei} no se agregó: ${failed[0]!.reason}.`,
      })
    else if (failed.length > 1)
      setMessage({
        type: "error",
        text: `No se agregaron ${failed.length} IMEI: ${failed
          .map((f) => `${f.imei} (${f.reason})`)
          .join(", ")}.`,
      })
    else if (added.length)
      setMessage({
        type: "success",
        text:
          added.length === 1
            ? `IMEI ${added[0]} agregado.`
            : `Se agregaron ${added.length} IMEI.`,
      })
  }

  const submitInput = () => {
    addImeis(value.split(/[\s,;]+/))
    setValue("")
    inputRef.current?.focus()
  }

  const saveEdit = () => {
    if (!editing) return
    const imei = extractImei(editing.value)
    const problem =
      imei === editing.imei ? null : problemOf(imei, units, editing.imei)
    if (problem) {
      setMessage({ type: "error", text: `El IMEI ${imei} no se guardó: ${problem}.` })
      return
    }
    onChange(units.map((u) => (u.imei === editing.imei ? { ...u, imei } : u)))
    setMessage(null)
    setEditing(null)
  }

  const remove = (imei: string) => {
    onChange(units.filter((u) => u.imei !== imei))
    setMessage(null)
  }

  return (
    <div className="space-y-3">
      {/* Sucursal donde entra el stock */}
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
        {branches.map((branch) => (
          <button
            key={branch.id}
            type="button"
            onClick={() => setBranchId(branch.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              branchId === branch.id
                ? "bg-[#00559D] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {branch.label}
          </button>
        ))}
      </div>

      {/* Campo único: teclado, lector de código de barras o pegar varios */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              // El lector de código de barras manda Enter al terminar
              if (e.key === "Enter") {
                e.preventDefault()
                submitInput()
              }
            }}
            placeholder="Escaneá o escribí el IMEI y apretá Enter"
            aria-label="Agregar IMEI"
            className="block w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={submitInput}
          className="inline-flex items-center gap-1 px-3 rounded-xl bg-[#00559D] text-white text-xs font-bold cursor-pointer hover:bg-[#0B2B4C]"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
        <button
          type="button"
          onClick={() => setCameraOpen((open) => !open)}
          className={`inline-flex items-center gap-1 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
            cameraOpen
              ? "border-[#00559D] bg-blue-50 text-[#00559D]"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          aria-label="Escanear con la cámara"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cámara</span>
        </button>
      </div>

      {cameraOpen && (
        <CameraScanner
          onDetected={(text) => addImeis([text])}
          onClose={() => setCameraOpen(false)}
        />
      )}

      {message && (
        <p
          className={`text-xs font-semibold ${
            message.type === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* IMEI cargados, agrupados por sucursal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {branches.map((branch) => {
          const list = units.filter((u) => u.branchId === branch.id)
          return (
            <div key={branch.id}>
              <span className="block text-2xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                {branch.label} ({list.length} un.)
              </span>
              {list.length === 0 ? (
                <p className="text-2xs text-slate-400">Sin unidades cargadas</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {list.map((unit) =>
                    editing?.imei === unit.imei ? (
                      <li key={unit.imei} className="flex items-center gap-1">
                        <input
                          autoFocus
                          value={editing.value}
                          onChange={(e) =>
                            setEditing({ ...editing, value: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              saveEdit()
                            }
                            if (e.key === "Escape") setEditing(null)
                          }}
                          aria-label={`Editar IMEI ${unit.imei}`}
                          className="w-40 px-2 py-1 text-xs font-mono rounded-lg border border-[#00559D] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          aria-label="Guardar IMEI"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 cursor-pointer"
                          aria-label="Cancelar edición"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ) : (
                      <li
                        key={unit.imei}
                        className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white pl-2 text-xs font-mono text-slate-800"
                      >
                        {unit.imei}
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({ imei: unit.imei, value: unit.imei })
                          }
                          className="p-1 text-slate-400 hover:text-[#00559D] cursor-pointer"
                          aria-label={`Editar IMEI ${unit.imei}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(unit.imei)}
                          className="p-1 pr-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          aria-label={`Quitar IMEI ${unit.imei}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
