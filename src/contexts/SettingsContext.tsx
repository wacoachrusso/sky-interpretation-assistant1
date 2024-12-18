import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface Settings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
  autoSave: boolean
  typewriterSpeed: number
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  notifications: true,
  autoSave: true,
  typewriterSpeed: 20
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings')
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) }
    }
    return defaultSettings
  })
  const { setTheme } = useTheme()

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
    
    // Apply settings
    setTheme(settings.theme)

    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[settings.fontSize]
  }, [settings, setTheme])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)