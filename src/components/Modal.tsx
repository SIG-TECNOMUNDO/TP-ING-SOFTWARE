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
      className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto transition-all">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
          <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
            {title}
          </h2>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
