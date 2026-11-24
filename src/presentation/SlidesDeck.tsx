import React from "react"
import {
  FileSpreadsheet,
  FileWarning,
  Smartphone,
  DatabaseBackup,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  Users,
  WalletCards,
  Settings,
  RefreshCw,
  Cloud,
  CheckCircle2,
  XCircle,
  WifiOff,
  Database,
  UserCheck,
  Lock,
  ShieldCheck,
} from "lucide-react"
import logo from "../assets/logo.png"

export const TOTAL_SLIDES = 11

function MinimalSlideHeader({
  step,
  title,
}: {
  step: string
  title: string
}) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-slate-200/90 shrink-0">
      <div className="space-y-1">
        <p className="text-lg font-extrabold uppercase tracking-widest text-[#F56C00] font-heading">
          {step}
        </p>
        <h2 className="text-5xl font-extrabold text-[#0B2B4C] font-heading tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
        <img
          src={logo}
          alt="TecnoMundo"
          className="h-8 w-auto object-contain"
        />
        <div className="h-7 w-px bg-slate-200" />
        <span className="text-lg font-extrabold tracking-widest text-[#0B2B4C] font-heading">
          MEJ
        </span>
      </div>
    </div>
  )
}

export default function renderSlide(slideId: number): React.ReactNode {
  switch (slideId) {
    /* ======================================================================
       SLIDE 1 — PORTADA
       ====================================================================== */
    case 1:
      return (
        <div className="w-full h-full bg-[#0B2B4C] text-white relative overflow-hidden flex flex-col justify-between px-24 py-20">
          <div className="absolute -top-40 -right-24 w-[620px] h-[620px] rounded-full bg-[#00559D]/35 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-48 -left-24 w-[520px] h-[520px] rounded-full bg-[#F56C00]/20 blur-3xl pointer-events-none" />

          {/* Top Brand Row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-white px-6 py-3.5 rounded-2xl shadow-lg">
              <img
                src={logo}
                alt="TecnoMundo"
                className="h-12 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-6 py-3 rounded-2xl">
              <span className="w-3 h-3 rounded-full bg-[#F56C00]" />
              <span className="text-xl font-extrabold tracking-wider font-heading">
                CONSULTORA MEJ · NOVIEMBRE 2026
              </span>
            </div>
          </div>

          {/* Center Hero */}
          <div className="relative z-10 max-w-[1320px] space-y-7 my-auto">
            <h1 className="text-[72px] leading-[1.06] font-extrabold font-heading tracking-tight">
              SIG-Tecnomundo:{" "}
              <span className="text-[#FF8524]">
                Control total en tiempo real
              </span>
            </h1>

            <p className="text-3xl text-blue-100/90 font-normal leading-snug">
              Gestión unificada para las sucursales{" "}
              <strong className="text-white font-bold">Yofre Norte</strong> y{" "}
              <strong className="text-white font-bold">Alta Córdoba</strong>.
            </p>
          </div>

          {/* Clean Footer Line (sin tarjetas densas) */}
          <div className="relative z-10 pt-8 border-t border-white/15 flex items-center justify-between text-xl text-blue-100/90">
            <p>
              <span className="text-blue-300 font-semibold">Para:</span>{" "}
              <strong className="text-white font-bold">
                Roberto Arrieta y Sofía García
              </strong>{" "}
              <span className="text-blue-200/80">(Dirección General)</span>
            </p>
            <p className="font-medium text-white">
              Juan Segundo Dealbera · Mateo Bergagna · Emiliano Espeche
            </p>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 2 — QUIÉNES SOMOS Y OBJETIVO
       ====================================================================== */
    case 2:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Consultora MEJ"
            title="Quiénes Somos y Nuestro Objetivo"
          />

          <div className="grid grid-cols-3 gap-8 my-auto py-6">
            {[
              {
                initials: "JD",
                name: "Juan Segundo Dealbera",
                role: "Líder de Proyecto",
                area: "Contrato de alcance y gestión",
                accent: "bg-[#0B2B4C]",
              },
              {
                initials: "MB",
                name: "Mateo Bergagna",
                role: "Frontend y UX",
                area: "Interfaz e ingeniería de software",
                accent: "bg-[#00559D]",
              },
              {
                initials: "EE",
                name: "Emiliano Espeche",
                role: "Backend y Cloud",
                area: "Datos, seguridad y capacitación",
                accent: "bg-[#F56C00]",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl border border-slate-200 p-9 shadow-xs flex flex-col justify-between gap-6"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${member.accent} text-white flex items-center justify-center text-2xl font-extrabold font-heading`}
                >
                  {member.initials}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                    {member.name}
                  </h3>
                  <p className="text-xl font-bold text-[#00559D]">
                    {member.role}
                  </p>
                  <p className="text-lg text-slate-600">{member.area}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0B2B4C] text-white rounded-3xl px-12 py-9 shadow-md text-center">
            <p className="text-3xl font-extrabold font-heading leading-snug">
              Unificar{" "}
              <span className="text-[#FF8524]">
                Yofre Norte y Alta Córdoba
              </span>{" "}
              en tiempo real sin frenar un minuto la atención.
            </p>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 3 — EL PROBLEMA HOY (DIAGNÓSTICO)
       ====================================================================== */
    case 3:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Diagnóstico Actual"
            title="El Problema Hoy en Ambas Sucursales"
          />

          <div className="grid grid-cols-2 gap-8 flex-1 pt-10">
            {[
              {
                icon: FileSpreadsheet,
                iconStyle: "bg-rose-50 text-rose-600 border-rose-200",
                title: "Stock en planillas",
                desc: "Fórmulas borradas, desfases y quiebres entre sucursales.",
              },
              {
                icon: FileWarning,
                iconStyle: "bg-rose-50 text-rose-600 border-rose-200",
                title: "Taller en papel",
                desc: "Sin seguimiento de equipos ni control de repuestos.",
              },
              {
                icon: Smartphone,
                iconStyle: "bg-amber-50 text-amber-600 border-amber-200",
                title: "Garantías manuales por IMEI",
                desc: "Búsqueda lenta de comprobantes viejos en mostrador.",
              },
              {
                icon: DatabaseBackup,
                iconStyle: "bg-rose-50 text-rose-600 border-rose-200",
                title: "Backups manuales riesgosos",
                desc: "Copias diarias en Moyex sujetas a error humano.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xs flex items-center gap-7"
                >
                  <div
                    className={`w-20 h-20 rounded-3xl border ${item.iconStyle} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xl text-slate-600 font-medium leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 4 — 3 METAS CONCRETAS
       ====================================================================== */
    case 4:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Impacto de Negocio"
            title="3 Metas Concretas"
          />

          <div className="grid grid-cols-3 gap-9 flex-1 pt-10">
            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xs flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2.5 bg-emerald-500" />
              <p className="text-[104px] leading-none font-extrabold text-[#0B2B4C] font-heading tracking-tight">
                0%
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-6 leading-snug">
                Diferencia de stock físico vs. sistema en 3 meses.
              </p>
            </div>

            <div className="bg-[#0B2B4C] text-white rounded-3xl p-10 shadow-lg flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2.5 bg-[#F56C00]" />
              <p className="text-[104px] leading-none font-extrabold text-[#FF8524] font-heading tracking-tight">
                -50%
              </p>
              <p className="text-2xl font-bold text-blue-50 mt-6 leading-snug">
                Tiempo de recepción de equipos en Servicio Técnico.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xs flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2.5 bg-[#00559D]" />
              <p className="text-[104px] leading-none font-extrabold text-[#00559D] font-heading tracking-tight">
                100%
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-6 leading-snug">
                Respaldos automáticos diarios en la nube sin intervención.
              </p>
            </div>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 5 — LA SOLUCIÓN: SIG-TECNOMUNDO
       ====================================================================== */
    case 5:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Plataforma Privada Unificada"
            title="La Solución: SIG-Tecnomundo"
          />

          <div className="flex-1 flex flex-col justify-between pt-8 gap-8">
            {/* 7 Módulos integrados en grilla limpia */}
            <div className="space-y-4">
              <p className="text-xl font-bold text-slate-500 uppercase tracking-wider">
                7 Módulos Integrados en Tiempo Real
              </p>
              <div className="grid grid-cols-7 gap-4">
                {[
                  { icon: LayoutDashboard, label: "Dashboard" },
                  { icon: Package, label: "Inventario" },
                  { icon: ShoppingCart, label: "Ventas" },
                  { icon: Wrench, label: "Servicio Técnico" },
                  { icon: Users, label: "Clientes" },
                  { icon: WalletCards, label: "Caja" },
                  { icon: Settings, label: "Administración" },
                ].map((mod) => {
                  const Icon = mod.icon
                  return (
                    <div
                      key={mod.label}
                      className="bg-white rounded-3xl border border-slate-200 py-9 px-4 shadow-xs flex flex-col items-center justify-center text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#00559D] flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 font-heading leading-tight">
                        {mod.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3 Roles claros */}
            <div className="bg-[#0B2B4C] text-white rounded-3xl p-8 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="w-7 h-7 text-[#FF8524]" />
                <span className="text-xl font-extrabold uppercase tracking-wider font-heading">
                  3 Perfiles de Seguridad por Rol y Sucursal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 border border-white/15 rounded-2xl px-6 py-5 flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-xl bg-[#F56C00] text-white text-lg font-extrabold font-mono">
                    ADMIN
                  </span>
                  <span className="text-xl font-semibold text-white">
                    Control global y costos
                  </span>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl px-6 py-5 flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-xl bg-[#00559D] text-white text-lg font-extrabold font-mono">
                    VENTAS
                  </span>
                  <span className="text-xl font-semibold text-white">
                    Mostrador en sede fija
                  </span>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl px-6 py-5 flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-lg font-extrabold font-mono">
                    TÉCNICO
                  </span>
                  <span className="text-xl font-semibold text-white">
                    Taller en sede fija
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 6 — CÓMO TRABAJAMOS (SCRUM + WEB EN LA NUBE)
       ====================================================================== */
    case 6:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Ejecución y Tecnología"
            title="Cómo Trabajamos"
          />

          <div className="grid grid-cols-2 gap-10 flex-1 pt-10">
            {/* Izquierda: Scrum */}
            <div className="bg-white rounded-3xl border border-slate-200 p-11 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F56C00] flex items-center justify-center shrink-0">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-[#0B2B4C] font-heading">
                  Metodología Scrum
                </h3>
              </div>

              <ul className="space-y-7 my-auto py-4">
                {[
                  "Entregas funcionales cada 2 semanas sin frenar locales.",
                  "Prioridad inicial en stock y ventas de mostrador.",
                  "Avances validados en vivo junto a Dirección.",
                ].map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-4 text-2xl font-medium text-slate-800"
                  >
                    <CheckCircle2 className="w-7 h-7 text-[#F56C00] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Derecha: Tecnología Web */}
            <div className="bg-[#0B2B4C] text-white rounded-3xl p-11 shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-5 pb-6 border-b border-white/15">
                <div className="w-16 h-16 rounded-2xl bg-white/12 text-[#FF8524] flex items-center justify-center shrink-0">
                  <Cloud className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold font-heading">
                  Tecnología Web en la Nube
                </h3>
              </div>

              <ul className="space-y-7 my-auto py-4">
                {[
                  "Corre directo en sus 3 PC actuales (Windows 10).",
                  "Cero gasto en servidores locales ni redes VPN.",
                  "Compatible hoy con sus lectores e impresoras.",
                ].map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-4 text-2xl font-medium text-blue-50"
                  >
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 7 — ALCANCE CLARO (QUÉ SÍ VS. QUÉ NO)
       ====================================================================== */
    case 7:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Reglas Transparentes"
            title="Alcance Claro del Proyecto"
          />

          <div className="grid grid-cols-2 gap-10 flex-1 pt-9">
            {/* Qué SÍ */}
            <div className="bg-white rounded-3xl border-2 border-emerald-500/45 p-10 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-4 pb-5 border-b border-emerald-100">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 shrink-0" />
                <h3 className="text-3xl font-extrabold text-emerald-950 font-heading">
                  Qué SÍ Incluye
                </h3>
              </div>

              <ul className="space-y-5 my-auto py-2">
                {[
                  "7 módulos privados multi-sucursal con roles.",
                  "Ventas con código de barras y Pago Mixto.",
                  "Alertas de stock con reposición directa.",
                  "Taller SAT con señas, presupuestos y garantías.",
                  "Arqueo diario, backups en nube y capacitación.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-xl font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Qué NO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-4 pb-5 border-b border-slate-200">
                <XCircle className="w-9 h-9 text-rose-500 shrink-0" />
                <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
                  Qué NO Incluye en Fase 1
                </h3>
              </div>

              <ul className="space-y-5 my-auto py-2">
                {[
                  "Tienda online pública ni portal de clientes.",
                  "Sincronización automática con Mercado Libre.",
                  "Facturación fiscal directa con ARCA / AFIP.",
                  "Envío automático de WhatsApp o emails.",
                  "Compra de hardware ni soporte post-garantía.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-xl font-medium text-slate-600"
                  >
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 8 — PLAN DE TRABAJO (12 SEMANAS)
       ====================================================================== */
    case 8:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="16 Noviembre 2026 — 5 Febrero 2027"
            title="Plan de Trabajo · 12 Semanas"
          />

          <div className="flex-1 flex flex-col justify-center gap-8 pt-6">
            {/* Línea conectora superior */}
            <div className="grid grid-cols-6 gap-4 items-stretch">
              {[
                {
                  num: "S1",
                  dates: "16–27 nov",
                  focus: "Diseño, roles y reglas",
                  highlight: false,
                },
                {
                  num: "S2",
                  dates: "30 nov–11 dic",
                  focus: "Login, panel e inventario",
                  highlight: false,
                },
                {
                  num: "S3",
                  dates: "14–25 dic",
                  focus: "Ventas, pagos y clientes",
                  highlight: true,
                },
                {
                  num: "S4",
                  dates: "28 dic–8 ene",
                  focus: "Taller SAT y presupuestos",
                  highlight: false,
                },
                {
                  num: "S5",
                  dates: "11–22 ene",
                  focus: "Caja, cierres y reportes",
                  highlight: false,
                },
                {
                  num: "S6",
                  dates: "25 ene–5 feb",
                  focus: "Pruebas, backups y entrega",
                  highlight: false,
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`rounded-3xl p-7 flex flex-col justify-between min-h-[380px] ${
                    s.highlight
                      ? "bg-[#0B2B4C] text-white border-2 border-[#F56C00] shadow-lg"
                      : "bg-white text-slate-900 border border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-xl text-xl font-extrabold font-mono ${
                        s.highlight
                          ? "bg-[#F56C00] text-white"
                          : "bg-blue-50 text-[#00559D]"
                      }`}
                    >
                      {s.num}
                    </span>
                    <p
                      className={`text-lg font-bold ${
                        s.highlight ? "text-orange-200" : "text-slate-500"
                      }`}
                    >
                      {s.dates}
                    </p>
                  </div>

                  <p
                    className={`text-2xl font-extrabold font-heading leading-snug ${
                      s.highlight ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {s.focus}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border border-[#F56C00]/30 rounded-2xl px-8 py-5 text-center">
              <p className="text-xl font-bold text-slate-800">
                <span className="text-[#D65E00]">Hito clave en Sprint 3:</span>{" "}
                Inventario y Ventas funcionando en ambas sedes antes de Navidad.
              </p>
            </div>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 9 — RIESGOS CUBIERTOS
       ====================================================================== */
    case 9:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Operación Protegida"
            title="Riesgos Cubiertos y Contingencias"
          />

          <div className="grid grid-cols-2 gap-8 flex-1 pt-10">
            {[
              {
                icon: WifiOff,
                style: "bg-rose-50 text-rose-600 border-rose-200",
                risk: "Corte de internet",
                plan: "Conexión inmediata con hotspot móvil 4G/5G tras 5 minutos.",
              },
              {
                icon: Database,
                style: "bg-blue-50 text-[#00559D] border-blue-200",
                risk: "Migración de stock",
                plan: "Prueba previa, auditoría física y respaldo seguro en planillas.",
              },
              {
                icon: UserCheck,
                style: "bg-amber-50 text-amber-600 border-amber-200",
                risk: "Adopción del personal",
                plan: "Interfaz simple, capacitación presencial y Manual de Usuario.",
              },
              {
                icon: Lock,
                style: "bg-emerald-50 text-emerald-600 border-emerald-200",
                risk: "Privacidad de costos",
                plan: "Precios de costo visibles únicamente para perfil Administrador.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.risk}
                  className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xs flex items-center gap-7"
                >
                  <div
                    className={`w-20 h-20 rounded-3xl border ${item.style} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
                      {item.risk}
                    </h3>
                    <p className="text-xl text-slate-600 font-medium leading-snug">
                      {item.plan}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 10 — INVERSIÓN Y CONDICIONES
       ====================================================================== */
    case 10:
      return (
        <div className="w-full h-full bg-slate-50 px-24 py-16 flex flex-col justify-between">
          <MinimalSlideHeader
            step="Propuesta Económica"
            title="Inversión y Condiciones"
          />

          <div className="flex-1 flex flex-col justify-between pt-8 gap-7">
            {/* Monto Total Gigante Arriba */}
            <div className="bg-[#0B2B4C] text-white rounded-3xl px-12 py-9 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-lg font-bold uppercase tracking-widest text-[#FF8524]">
                  Inversión Total Llave en Mano
                </p>
                <p className="text-xl text-blue-100 mt-1">
                  En dólares o pesos argentinos al cambio oficial del día.
                </p>
              </div>
              <p className="text-7xl font-extrabold font-heading tracking-tight">
                USD 3.000
              </p>
            </div>

            {/* 3 Etapas de Pago */}
            <div className="grid grid-cols-3 gap-8 flex-1">
              {[
                {
                  pct: "30%",
                  usd: "USD 900",
                  desc: "Anticipo al iniciar el proyecto.",
                  featured: false,
                },
                {
                  pct: "40%",
                  usd: "USD 1.200",
                  desc: "Con Inventario y Ventas funcionando.",
                  featured: true,
                },
                {
                  pct: "30%",
                  usd: "USD 900",
                  desc: "Contra entrega y aceptación final.",
                  featured: false,
                },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-9 flex flex-col justify-center text-center ${
                    stage.featured
                      ? "border-2 border-[#F56C00] shadow-md"
                      : "border border-slate-200 shadow-xs"
                  }`}
                >
                  <p className="text-6xl font-extrabold text-[#0B2B4C] font-heading">
                    {stage.pct}
                  </p>
                  <p className="text-2xl font-extrabold text-[#00559D] font-mono mt-2">
                    {stage.usd}
                  </p>
                  <p className="text-xl text-slate-600 font-medium mt-4">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Línea limpia al pie */}
            <div className="bg-white border border-slate-200 rounded-2xl px-8 py-4 text-center">
              <p className="text-xl font-semibold text-slate-700">
                <strong className="text-[#0B2B4C]">
                  30 días de garantía sin cargo
                </strong>{" "}
                · Datos{" "}
                <strong className="text-[#0B2B4C]">
                  100% propiedad de TecnoMundo
                </strong>{" "}
                (Ley 25.326).
              </p>
            </div>
          </div>
        </div>
      )

    /* ======================================================================
       SLIDE 11 — CIERRE FINAL (LIMPIO)
       ====================================================================== */
    case 11:
      return (
        <div className="w-full h-full bg-[#0B2B4C] text-white relative overflow-hidden flex flex-col items-center justify-between px-24 py-20 text-center">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[#00559D]/30 blur-3xl pointer-events-none" />

          {/* Logos */}
          <div className="relative z-10 flex items-center gap-5">
            <div className="bg-white px-6 py-3.5 rounded-2xl shadow-lg">
              <img
                src={logo}
                alt="TecnoMundo"
                className="h-11 w-auto object-contain"
              />
            </div>
            <div className="h-10 w-px bg-white/25" />
            <span className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 text-lg font-extrabold tracking-widest font-heading">
              CONSULTORA MEJ
            </span>
          </div>

          {/* Mensaje Central */}
          <div className="relative z-10 space-y-5 my-auto">
            <h2 className="text-[84px] leading-none font-extrabold font-heading tracking-tight">
              Muchas gracias
            </h2>
            <p className="text-3xl text-[#FF8524] font-semibold">
              SIG-Tecnomundo · Presentación del sistema a continuación
            </p>
          </div>

          {/* Integrantes del Equipo */}
          <div className="relative z-10 pt-8 border-t border-white/15 w-full max-w-4xl">
            <p className="text-2xl text-blue-100/95 font-medium tracking-wide">
              Juan Segundo Dealbera · Mateo Bergagna · Emiliano Espeche
            </p>
          </div>
        </div>
      )

    default:
      return null
  }
}
