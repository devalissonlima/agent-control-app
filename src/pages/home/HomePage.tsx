import React from 'react'
import { useHomeData } from './hooks/useHomeData'
import { WelcomeBanner } from './components/WelcomeBanner'
import { ShortcutsGrid } from './components/ShortcutsGrid'

export const HomePage: React.FC = () => {
  const { greetingData, metrics } = useHomeData()

  return (
    <div className="space-y-8">
      {/* Saudação com date-fns */}
      <WelcomeBanner
        greeting={greetingData.greeting}
        userName={greetingData.userName}
        dateString={greetingData.dateString}
        agentName={metrics?.agentName}
      />

      {/* Grid de Atalhos Rápidos com Métricas */}
      <ShortcutsGrid metrics={metrics} />
    </div>
  )
}

export default HomePage
