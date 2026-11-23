import { useEffect, useRef } from "react"

let openLocks = 0
let savedScrollY = 0
let previousStyle = ""

/**
 * Bloquea el scroll de la página mientras un modal está abierto.
 * Fija el body en su posición actual (funciona también en celulares)
 * y al cerrar vuelve al mismo lugar.
 */
export default function useBodyScrollLock(active = true) {
  // Se toma la posición al abrir, antes de que el foco automático del
  // formulario pueda mover la página
  const scrollAtOpen = useRef(0)
  const wasActive = useRef(false)
  if (active && !wasActive.current) scrollAtOpen.current = window.scrollY
  wasActive.current = active

  useEffect(() => {
    if (!active) return
    const body = document.body
    if (openLocks === 0) {
      savedScrollY = scrollAtOpen.current
      previousStyle = body.getAttribute("style") ?? ""
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      Object.assign(body.style, {
        position: "fixed",
        top: `-${savedScrollY}px`,
        left: "0",
        right: "0",
        width: "100%",
        overflow: "hidden",
        paddingRight: scrollbar > 0 ? `${scrollbar}px` : body.style.paddingRight,
      })
    }
    openLocks += 1
    return () => {
      openLocks -= 1
      if (openLocks === 0) {
        if (previousStyle) body.setAttribute("style", previousStyle)
        else body.removeAttribute("style")
        window.scrollTo(0, savedScrollY)
      }
    }
  }, [active])
}
