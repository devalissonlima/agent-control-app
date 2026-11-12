import { useState, useEffect, useCallback } from 'react'

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false)

  const enterFocusMode = useCallback(() => {
    setIsFocusMode(true)
  }, [])

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false)
  }, [])

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev)
  }, [])

  // Tecla ESC para sair imediatamente do Modo Foco
  useEffect(() => {
    if (!isFocusMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitFocusMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocusMode, exitFocusMode])

  return {
    isFocusMode,
    enterFocusMode,
    exitFocusMode,
    toggleFocusMode,
  }
}
