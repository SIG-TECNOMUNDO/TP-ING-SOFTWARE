import React from "react"
import { LucideIcon } from "lucide-react"

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.03)] border border-slate-200/80 transition-all ${className}`}
    >
      {children}
    </div>
  )
}

export function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost"
  icon?: LucideIcon
}) {
  const baseStyle =
    "inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
  const variants = {
    primary:
      "bg-gradient-to-r from-[#1565A9] to-[#1E78C2] text-white hover:from-[#11528A] hover:to-[#1766A6] shadow-xs shadow-blue-900/15 focus:ring-[#1565A9]",
    secondary:
      "bg-gradient-to-r from-[#F28C28] to-[#F59E0B] text-white hover:from-[#D97706] hover:to-[#D97706] shadow-xs shadow-orange-900/15 focus:ring-[#F28C28]",
    outline:
      "border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs focus:ring-[#1565A9]",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-xs shadow-rose-900/15 focus:ring-rose-500",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
      {children}
    </button>
  )
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`block w-full rounded-xl border-slate-200 border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  )
}

export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`block w-full rounded-xl border-slate-200 border bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Badge({
  children,
  variant = "gray",
  className = "",
}: {
  children: React.ReactNode
  variant?: "gray" | "green" | "blue" | "yellow" | "red" | "orange"
  className?: string
}) {
  const variants = {
    gray: "bg-slate-500/10 text-slate-700 border border-slate-500/20",
    green: "bg-emerald-500/12 text-emerald-700 border border-emerald-500/20",
    blue: "bg-blue-500/12 text-blue-700 border border-blue-500/20",
    yellow: "bg-amber-500/12 text-amber-800 border border-amber-500/20",
    red: "bg-rose-500/12 text-rose-700 border border-rose-500/20",
    orange: "bg-orange-500/12 text-orange-700 border border-orange-500/20",
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Label({
  children,
  className = "",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
