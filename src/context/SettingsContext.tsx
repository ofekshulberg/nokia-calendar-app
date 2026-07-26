import { createContext, useContext, useState, useEffect } from 'react'

interface SettingsContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  enableVibration: boolean
  setEnableVibration: (enabled: boolean) => void
  ringtone: string
  setRingtone: (tone: string) => void
  overrideSilentMode: boolean
  setOverrideSilentMode: (enabled: boolean) => void
  showForegroundIndicator: boolean
  setShowForegroundIndicator: (enabled: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [enableVibration, setEnableVibrationState] = useState(true)
  const [ringtone, setRingtoneState] = useState('default')
  const [overrideSilentMode, setOverrideSilentModeState] = useState(true)
  const [showForegroundIndicator, setShowForegroundIndicatorState] = useState(true)

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setIsDarkMode(settings.isDarkMode || false)
        setEnableVibrationState(settings.enableVibration !== false)
        setRingtoneState(settings.ringtone || 'default')
        setOverrideSilentModeState(settings.overrideSilentMode !== false)
        setShowForegroundIndicatorState(settings.showForegroundIndicator !== false)
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev
      saveSettings({ isDarkMode: newValue, enableVibration, ringtone, overrideSilentMode, showForegroundIndicator })
      return newValue
    })
  }

  const setEnableVibration = (enabled: boolean) => {
    setEnableVibrationState(enabled)
    saveSettings({ isDarkMode, enableVibration: enabled, ringtone, overrideSilentMode, showForegroundIndicator })
  }

  const setRingtone = (tone: string) => {
    setRingtoneState(tone)
    saveSettings({ isDarkMode, enableVibration, ringtone: tone, overrideSilentMode, showForegroundIndicator })
  }

  const setOverrideSilentMode = (enabled: boolean) => {
    setOverrideSilentModeState(enabled)
    saveSettings({ isDarkMode, enableVibration, ringtone, overrideSilentMode: enabled, showForegroundIndicator })
  }

  const setShowForegroundIndicator = (enabled: boolean) => {
    setShowForegroundIndicatorState(enabled)
    saveSettings({ isDarkMode, enableVibration, ringtone, overrideSilentMode, showForegroundIndicator: enabled })
  }

  const saveSettings = (settings: any) => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }

  return (
    <SettingsContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        enableVibration,
        setEnableVibration,
        ringtone,
        setRingtone,
        overrideSilentMode,
        setOverrideSilentMode,
        showForegroundIndicator,
        setShowForegroundIndicator,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}