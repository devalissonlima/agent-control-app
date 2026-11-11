import { useState, useEffect, useCallback } from 'react'

export interface UseMobileNavReturn {
  isOpen: boolean
  openNav: () => void
  closeNav: () => void
  toggleNav: () => void
}

export function useMobileNav(): UseMobileNavReturn {
  const [isOpen, setIsOpen] = useState(false)

  const openNav = useCallback(() => setIsOpen(true), [])
  const closeNav = useCallback(() => setIsOpen(false), [])
  const toggleNav = useCallback(() => setIsOpen((prev) => !prev), [])

  // Fecha o menu móvel ao voltar/avançar no histórico do navegador
  useEffect(() => {
    const handlePopState = () => setIsOpen(false)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Fecha o menu com a tecla ESC e trava o scroll da página no mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeNav()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeNav])

  // Fecha automaticamente se a viewport for redimensionada para desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  return {
    isOpen,
    openNav,
    closeNav,
    toggleNav,
  }
}
