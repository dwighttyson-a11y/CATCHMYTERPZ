const VAULT_CREDS_KEY    = 'cmt_vault_pw'
const LEGACY_DEFAULT     = '123456789'
const DEFAULT_VAULT_PASSWORD = '069069'

export function getVaultPassword(): string {
  try {
    const stored = localStorage.getItem(VAULT_CREDS_KEY)
    // Ignore any leftover legacy default so the new default takes effect
    if (stored && stored !== LEGACY_DEFAULT) return stored
  } catch { /* ignore */ }
  return DEFAULT_VAULT_PASSWORD
}

export function changeVaultPassword(currentPassword: string, newPassword: string): boolean {
  if (currentPassword.trim() !== getVaultPassword()) return false
  try {
    localStorage.setItem(VAULT_CREDS_KEY, newPassword.trim())
    return true
  } catch {
    return false
  }
}
