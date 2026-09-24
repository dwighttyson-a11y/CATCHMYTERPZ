import { createContext, useCallback, useContext, useState } from 'react'

export interface MobileSettings {
  productGridCols: 2 | 3
  showSocialBubbles: boolean
  showHero: boolean
}

interface MobileSettingsContextValue {
  mobileSettings: MobileSettings
  updateMobileSetting: <K extends keyof MobileSettings>(key: K, value: MobileSettings[K]) => void
}

const DEFAULTS: MobileSettings = {
  productGridCols: 3,
  showSocialBubbles: true,
  showHero: true,
}

const STORAGE_KEY = 'cmt_mobile_settings'

function load(): MobileSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULTS
}

const MobileSettingsContext = createContext<MobileSettingsContextValue | null>(null)

export function MobileSettingsProvider({ children }: { children: React.ReactNode }) {
  const [mobileSettings, setMobileSettings] = useState<MobileSettings>(load)

  const updateMobileSetting = useCallback(<K extends keyof MobileSettings>(
    key: K,
    value: MobileSettings[K],
  ) => {
    setMobileSettings(prev => {
      const next = { ...prev, [key]: value }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  return (
    <MobileSettingsContext.Provider value={{ mobileSettings, updateMobileSetting }}>
      {children}
    </MobileSettingsContext.Provider>
  )
}

export function useMobileSettings(): MobileSettingsContextValue {
  const ctx = useContext(MobileSettingsContext)
  if (!ctx) throw new Error('useMobileSettings must be inside MobileSettingsProvider')
  return ctx
}
