import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react"

export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-white text-slate-900 rounded-2xl shadow-sm border border-slate-200/80 transition-all ${className}`}
      {...props}
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
    "inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 enabled:active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    primary:
      "bg-gradient-to-r from-[#00559D] to-[#1565A9] text-white enabled:hover:from-[#0B2B4C] enabled:hover:to-[#00559D] shadow-xs shadow-blue-900/15 focus:ring-[#00559D]",
    secondary:
      "bg-gradient-to-r from-[#F56C00] to-[#FF8524] text-white enabled:hover:from-[#D65E00] enabled:hover:to-[#F56C00] shadow-xs shadow-orange-900/15 focus:ring-[#F56C00]",
    outline:
      "border border-slate-200/90 bg-white text-slate-700 enabled:hover:bg-slate-50 enabled:hover:border-slate-300 shadow-2xs focus:ring-[#00559D]",
    danger:
      "bg-rose-600 text-white enabled:hover:bg-rose-700 shadow-xs shadow-rose-900/15 focus:ring-rose-500",
    ghost:
      "bg-transparent text-slate-600 enabled:hover:bg-slate-100 enabled:hover:text-slate-900 focus:ring-slate-400",
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
  variant?: "gray" | "green" | "blue" | "yellow" | "red" | "orange" | "purple"
  className?: string
}) {
  const variants = {
    gray: "bg-slate-500/10 text-slate-700 border border-slate-500/20",
    green: "bg-emerald-500/12 text-emerald-700 border border-emerald-500/20",
    blue: "bg-blue-500/12 text-blue-700 border border-blue-500/20",
    yellow: "bg-amber-500/12 text-amber-800 border border-amber-500/20",
    red: "bg-rose-500/12 text-rose-700 border border-rose-500/20",
    orange: "bg-orange-500/12 text-orange-700 border border-orange-500/20",
    purple: "bg-purple-500/12 text-purple-700 border border-purple-500/20",
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

export function TableScrollContainer({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const checkOverflow = () => {
      if (!containerRef.current) return
      setHasOverflow(
        containerRef.current.scrollWidth > containerRef.current.clientWidth + 1,
      )
    }

    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(el)
    window.addEventListener("resize", checkOverflow)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", checkOverflow)
    }
  }, [children])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el || !hasOverflow || e.button !== 0) return

    const target = e.target as HTMLElement
    if (
      target.closest(
        'button, a, input, select, textarea, label, [role="button"]',
      )
    ) {
      return
    }

    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el || !dragState.current.isDown) return

    const x = e.pageX - el.offsetLeft
    const walk = x - dragState.current.startX
    if (Math.abs(walk) > 5) {
      if (!dragState.current.moved) {
        dragState.current.moved = true
        setIsDragging(true)
      }
      e.preventDefault()
      el.scrollLeft = dragState.current.scrollLeft - walk
    }
  }

  const endDrag = () => {
    if (!dragState.current.isDown) return
    dragState.current.isDown = false
    setIsDragging(false)
  }

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.moved) {
      e.stopPropagation()
      e.preventDefault()
      dragState.current.moved = false
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onClickCapture={handleClickCapture}
      className={`overflow-x-auto ${
        hasOverflow
          ? isDragging
            ? "cursor-grabbing select-none"
            : "cursor-grab"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function TablePagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemLabel = "registros",
}: {
  currentPage: number
  totalItems: number
  pageSize?: number
  onPageChange: (page: number) => void
  itemLabel?: string
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endItem = Math.min(safePage * pageSize, totalItems)

  const canGoPrev = safePage > 1 && totalItems > 0
  const canGoNext = safePage < totalPages && totalItems > 0

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1)

  return (
    <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
      <p className="text-xs text-slate-500">
        {totalItems === 0 ? (
          <>
            Mostrando <strong>0</strong> de <strong>0</strong> {itemLabel}
          </>
        ) : (
          <>
            Mostrando{" "}
            <strong>
              {startItem}–{endItem}
            </strong>{" "}
            de <strong>{totalItems}</strong> {itemLabel}
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => canGoPrev && onPageChange(safePage - 1)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 enabled:hover:bg-slate-50 enabled:hover:border-slate-300 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Anterior
        </button>

        {pages.map((page) => {
          const isActive = page === safePage
          return (
            <button
              key={page}
              type="button"
              disabled={totalItems === 0}
              onClick={() => onPageChange(page)}
              className={`min-w-8 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                  ? "bg-blue-50 text-[#00559D] border-[#00559D]/30 shadow-2xs"
                  : "bg-white text-slate-700 border-slate-200 enabled:hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          )
        })}

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => canGoNext && onPageChange(safePage + 1)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 enabled:hover:bg-slate-50 enabled:hover:border-slate-300 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
