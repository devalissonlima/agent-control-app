import * as React from 'react'
import { cn } from '@/utils/cn'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component')
  }
  return context
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value: controlledValue, defaultValue = '', onValueChange, className, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const activeValue = isControlled ? controlledValue : uncontrolledValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange]
    )

    return (
      <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-start rounded-xl bg-slate-100 p-1 text-slate-500 border border-slate-200/80',
        className
      )}
      role="tablist"
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue, onValueChange } = useTabs()
    const isActive = activeValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => onValueChange(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          isActive
            ? 'bg-white text-slate-900 shadow-2xs font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue } = useTabs()
    const isActive = activeValue === value

    if (!isActive) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn('mt-4 ring-offset-white focus-visible:outline-none', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = 'TabsContent'
