import { useState, useCallback } from 'react'
import { getVaultPassword } from './vaultConfig'

export type LockState = 'locked' | 'unlocking' | 'unlocked'

const UNLOCK_ANIM_MS = 1900

export function useVaultAuth() {
  const [lockState, setLockState] = useState<LockState>('locked')

  const tryUnlock = useCallback((password: string): boolean => {
    if (password !== getVaultPassword()) return false
    setLockState('unlocking')
    setTimeout(() => setLockState('unlocked'), UNLOCK_ANIM_MS)
    return true
  }, [])

  return { lockState, tryUnlock }
}
