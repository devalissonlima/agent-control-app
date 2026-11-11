import React, { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

interface FieldTooltipProps {
  content: string
  label?: string
}

export const FieldTooltip: React.FC<FieldTooltipProps> = ({ content, label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fecha o tooltip ao clicar fora ou pressionar ESC
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label={label ? `Ajuda sobre ${label}` : 'Ajuda sobre este campo'}
        onClick={(e) => {
          e.preventDefault()
          setIsOpen((prev) => !prev)
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      {/* Popover / Tooltip Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-xs leading-relaxed text-slate-100 shadow-xl ring-1 ring-white/10 sm:w-72 animate-in fade-in zoom-in-95 duration-150"
        >
          <p>{content}</p>
          {/* Triângulo / Seta do tooltip */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  )
}

export default FieldTooltip
