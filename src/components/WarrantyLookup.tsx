import React, { useState } from "react"
import { ShieldCheck, ShieldAlert, Search } from "lucide-react"
import { Card, Button, Input, Badge } from "./ui"
import {
  findSoldDevice,
  isValidImei,
  warrantyInfo,
  WARRANTY_DAYS,
  type SoldDevice,
} from "../data/soldDevices"

type FoundResult = {
  kind: "found"
  device: SoldDevice
}
type LookupResult = FoundResult | { kind: "not_found" } | { kind: "invalid" }

export default function WarrantyLookup() {
  const [imei, setImei] = useState("")
  const [result, setResult] = useState<LookupResult | null>(null)

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValidImei(imei)) {
      setResult({ kind: "invalid" })
      return
    }
    const device = findSoldDevice(imei)
    setResult(device ? { kind: "found", device } : { kind: "not_found" })
  }

  const warranty = result?.kind === "found" ? warrantyInfo(result.device) : null

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
            Consultar garantía por IMEI
          </h2>
          <p className="text-2xs text-slate-400">
            Busca la venta del equipo y valida los {WARRANTY_DAYS} días de
            garantía
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <Input
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          placeholder="IMEI de 15 dígitos"
          inputMode="numeric"
          maxLength={20}
          className="font-mono"
        />
        <Button type="submit" variant="outline" className="shrink-0">
          <Search className="w-4 h-4 mr-1.5" />
          Consultar
        </Button>
      </form>

      {result?.kind === "invalid" && (
        <p className="text-xs font-semibold text-rose-600">
          El IMEI debe tener exactamente 15 dígitos.
        </p>
      )}

      {result?.kind === "not_found" && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          No hay ninguna venta registrada con ese IMEI. El equipo no fue vendido
          por Tecnomundo o el IMEI es incorrecto.
        </div>
      )}

      {result?.kind === "found" && warranty && (
        <div
          className={`rounded-xl border p-3 text-xs space-y-1.5 ${
            warranty.active
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-sm">
              {result.device.productName}
            </span>
            <Badge variant={warranty.active ? "green" : "red"}>
              {warranty.active
                ? `En garantía (${warranty.daysLeft} días restantes)`
                : "Garantía vencida"}
            </Badge>
          </div>
          <p>
            <strong>Venta:</strong> {result.device.saleId} del{" "}
            {new Date(result.device.soldAt).toLocaleDateString("es-AR")} en{" "}
            {result.device.branch}
          </p>
          <p>
            <strong>Cliente:</strong> {result.device.client}
          </p>
          <p>
            <strong>Vendió:</strong> {result.device.seller} ·{" "}
            <strong>Vence:</strong>{" "}
            {warranty.expiresAt.toLocaleDateString("es-AR")}
          </p>
        </div>
      )}
    </Card>
  )
}
