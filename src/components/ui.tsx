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
      className={`bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-2xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-800/80 transition-all ${className}`}
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
      "border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs focus:ring-[#1565A9]",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-xs shadow-rose-900/15 focus:ring-rose-500",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:ring-slate-400",
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
      className={`block w-full rounded-xl border-slate-200 dark:border-slate-700/80 border bg-white dark:bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
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
      className={`block w-full rounded-xl border-slate-200 dark:border-slate-700/80 border bg-white dark:bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${className}`}
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
    gray: "bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/20 dark:border-slate-500/30",
    green: "bg-emerald-500/12 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30",
    blue: "bg-blue-500/12 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30",
    yellow: "bg-amber-500/12 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30",
    red: "bg-rose-500/12 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30",
    orange: "bg-orange-500/12 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/20 dark:border-orange-500/30",
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
      className={`block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
