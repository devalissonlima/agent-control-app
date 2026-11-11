import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a <Dialog />')
  }
  return context
}

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement>

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useDialog()
    const [isMounted, setIsMounted] = React.useState(open)
    const [isAnimating, setIsAnimating] = React.useState(false)

    if (open && !isMounted) {
      setIsMounted(true)
    }

    React.useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout>
      let rafId: number

      if (open) {
        rafId = requestAnimationFrame(() => {
          setIsAnimating(true)
        })
        document.body.style.overflow = 'hidden'
        return () => {
          cancelAnimationFrame(rafId)
          document.body.style.overflow = ''
        }
      } else {
        rafId = requestAnimationFrame(() => {
          setIsAnimating(false)
        })
        timeoutId = setTimeout(() => {
          setIsMounted(false)
          document.body.style.overflow = ''
        }, 200)
        return () => {
          cancelAnimationFrame(rafId)
          clearTimeout(timeoutId)
          document.body.style.overflow = ''
        }
      }
    }, [open])

    // Fecha ao pressionar ESC
    React.useEffect(() => {
      if (!open) return
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange(false)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, onOpenChange])

    if (!isMounted || typeof document === 'undefined') return null

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
          role="button"
          tabIndex={-1}
          aria-label="Fechar diálogo"
          className={cn(
            'fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 ease-out',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => onOpenChange(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onOpenChange(false)
          }}
        />

        {/* Modal Box */}
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ease-out border border-slate-100',
            isAnimating
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-95 opacity-0 translate-y-2',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    )
  }
)
DialogContent.displayName = 'DialogContent'

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-left pb-4 border-b border-slate-100', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-slate-100',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn('text-lg font-bold text-slate-900 tracking-tight leading-none', className)}
    {...props}
  />
)
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={cn('text-xs sm:text-sm text-slate-500', className)}
    {...props}
  />
)
DialogDescription.displayName = 'DialogDescription'

export const DialogClose: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, onClick, ...props }) => {
  const { onOpenChange } = useDialog()
  return (
    <button
      type="button"
      className={cn(
        'absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none',
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        onOpenChange(false)
      }}
      aria-label="Fechar"
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
}
DialogClose.displayName = 'DialogClose'
