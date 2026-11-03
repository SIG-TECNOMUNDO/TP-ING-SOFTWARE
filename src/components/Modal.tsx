import { X } from "lucide-react"

export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-lg max-h-[90vh] overflow-y-auto transition-all">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 font-heading">
            {title}
          </h2>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
