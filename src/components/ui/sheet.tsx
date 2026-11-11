import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

export function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('useSheet must be used within a <Sheet />')
  }
  return context
}

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const { open, onOpenChange } = useSheet()
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
        }, 300)
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

    const sideClasses = {
      right: isAnimating ? 'translate-x-0' : 'translate-x-full',
      left: isAnimating ? 'translate-x-0' : '-translate-x-full',
      top: isAnimating ? 'translate-y-0' : '-translate-y-full',
      bottom: isAnimating ? 'translate-y-0' : 'translate-y-full',
    }

    return createPortal(
      <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
        {/* Backdrop / Overlay com Fade suave */}
        <div
          role="button"
          tabIndex={-1}
          aria-label="Fechar painel"
          onClick={() => onOpenChange(false)}
          className={cn(
            'fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Sheet Content / Drawer ocupando exatamente 100% da altura da viewport */}
        <div
          ref={ref}
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-xl md:max-w-2xl',
            sideClasses[side],
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
SheetContent.displayName = 'SheetContent'

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6 border-b border-slate-100', className)}
      {...props}
    />
  )
}
SheetHeader.displayName = 'SheetHeader'

export const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-slate-100', className)}
      {...props}
    />
  )
}
SheetFooter.displayName = 'SheetFooter'

export const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn('text-lg font-bold text-slate-900', className)}
      {...props}
    />
  )
})
SheetTitle.displayName = 'SheetTitle'

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-xs text-slate-500', className)}
      {...props}
    />
  )
})
SheetDescription.displayName = 'SheetDescription'

export const SheetClose: React.FC<{
  className?: string
  onClick?: () => void
}> = ({ className, onClick }) => {
  const { onOpenChange } = useSheet()
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        onOpenChange(false)
      }}
      aria-label="Fechar"
      className={cn(
        'rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition active:scale-95',
        className
      )}
    >
      <X className="h-5 w-5" />
    </button>
  )
}
SheetClose.displayName = 'SheetClose'
