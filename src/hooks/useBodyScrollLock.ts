import { useEffect } from "react"

let openLocks = 0
let previous = { overflow: "", paddingRight: "" }

/** Bloquea el scroll de la página mientras un modal está abierto. */
export default function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return
    const body = document.body
    if (openLocks === 0) {
      previous = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      }
      // Compensa el ancho de la barra de scroll para que la página no "salte"
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      body.style.overflow = "hidden"
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    }
    openLocks += 1
    return () => {
      openLocks -= 1
      if (openLocks === 0) {
        body.style.overflow = previous.overflow
        body.style.paddingRight = previous.paddingRight
      }
    }
  }, [active])
}
