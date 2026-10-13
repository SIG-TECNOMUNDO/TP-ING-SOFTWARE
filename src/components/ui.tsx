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
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
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
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
    secondary:
      "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
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
      className={`block w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
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
      className={`block w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white ${className}`}
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
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
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
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export function Alert({
  children,
  variant = "error",
}: {
  children: React.ReactNode
  variant?: "error" | "success" | "info"
}) {
  const styles = {
    error: "bg-red-50 border-red-500 text-red-700",
    success: "bg-green-50 border-green-500 text-green-700",
    info: "bg-blue-50 border-blue-500 text-blue-700",
  }
  return (
    <div
      role="alert"
      className={`border-l-4 p-4 rounded-md text-sm ${styles[variant]}`}
    >
      {children}
    </div>
  )
}

export function Loading({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="py-12 text-center text-sm text-gray-500" role="status">
      {label}
    </div>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-12 text-center text-sm text-gray-500">{children}</div>
  )
}
