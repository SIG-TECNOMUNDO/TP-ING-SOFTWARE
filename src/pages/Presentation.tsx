import React, { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react"
import renderSlide, { TOTAL_SLIDES } from "../presentation/SlidesDeck"

const STAGE_WIDTH = 1600
const STAGE_HEIGHT = 900

export default function Presentation() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialSlideFromUrl = Number(searchParams.get("slide") || "1")
  const [currentSlide, setCurrentSlide] = useState<number>(() =>
    Number.isFinite(initialSlideFromUrl) &&
    initialSlideFromUrl >= 1 &&
    initialSlideFromUrl <= TOTAL_SLIDES
      ? initialSlideFromUrl
      : 1,
  )

  const [isFullscreen, setIsFullscreen] = useState(false)
  const stageWrapperRef = useRef<HTMLDivElement>(null)
  const [stageScale, setStageScale] = useState(1)

  const goToSlide = useCallback(
    (target: number) => {
      const clamped = Math.min(Math.max(1, target), TOTAL_SLIDES)
      setCurrentSlide(clamped)
      setSearchParams({ slide: String(clamped) }, { replace: true })
    },
    [setSearchParams],
  )

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1)
  }, [currentSlide, goToSlide])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Ignore fullscreen restrictions in embedded previews
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  useEffect(() => {
    const el = stageWrapperRef.current
    if (!el) return

    const updateScale = () => {
      if (!stageWrapperRef.current) return
      const rect = stageWrapperRef.current.getBoundingClientRect()
      const availW = Math.max(320, rect.width)
      const availH = Math.max(180, rect.height)
      const nextScale = Math.min(availW / STAGE_WIDTH, availH / STAGE_HEIGHT)
      setStageScale(Number(nextScale.toFixed(4)))
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    window.addEventListener("resize", updateScale)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateScale)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault()
          nextSlide()
          break
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault()
          prevSlide()
          break
        case "Home":
          e.preventDefault()
          goToSlide(1)
          break
        case "End":
          e.preventDefault()
          goToSlide(TOTAL_SLIDES)
          break
        case "f":
        case "F":
          e.preventDefault()
          toggleFullscreen()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, goToSlide, toggleFullscreen])

  const isDarkSlide = currentSlide === 1 || currentSlide === TOTAL_SLIDES

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: 1600px 900px;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .presentation-print-root {
            display: block !important;
            width: 1600px !important;
          }
          .print-slide-page {
            width: 1600px !important;
            height: 900px !important;
            overflow: hidden !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-slide-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>

      <div
        ref={stageWrapperRef}
        className={`h-screen w-screen overflow-hidden flex items-center justify-center relative select-none transition-colors duration-200 print:hidden ${
          isDarkSlide ? "bg-[#0B2B4C]" : "bg-slate-50"
        }`}
      >
        {/* Lienzo 16:9 limpio ocupando prácticamente el 100% de la pantalla */}
        <div
          style={{
            width: `${Math.round(STAGE_WIDTH * stageScale)}px`,
            height: `${Math.round(STAGE_HEIGHT * stageScale)}px`,
          }}
          className="relative overflow-hidden"
        >
          <div
            key={currentSlide}
            style={{
              width: `${STAGE_WIDTH}px`,
              height: `${STAGE_HEIGHT}px`,
              transform: `scale(${stageScale})`,
              transformOrigin: "top left",
            }}
            className="animate-slideTransition select-text"
          >
            {renderSlide(currentSlide)}
          </div>
        </div>

        {/* Único control visible: minimalista y semi-transparente abajo a la derecha */}
        <div className="fixed bottom-5 right-6 z-30 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-900/45 hover:bg-slate-900/80 backdrop-blur-md border border-white/15 text-white/95 shadow-sm transition-all">
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-1.5 rounded-full hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 text-sm font-mono font-bold tracking-tight">
            {String(currentSlide).padStart(2, "0")} /{" "}
            {String(TOTAL_SLIDES).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentSlide === TOTAL_SLIDES}
            className="p-1.5 rounded-full hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-0.5" />

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-white/15 cursor-pointer transition-colors"
            title="Pantalla Completa (F)"
            aria-label="Pantalla Completa"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Soporte limpio de impresión PDF horizontal */}
      <div className="hidden print:block presentation-print-root">
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((id) => (
          <div key={id} className="print-slide-page">
            {renderSlide(id)}
          </div>
        ))}
      </div>
    </>
  )
}
