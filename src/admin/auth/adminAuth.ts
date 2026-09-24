const SESSION_KEY  = 'cmt_admin_tok'
const EXPIRY_KEY   = 'cmt_admin_exp'
const CREDS_KEY    = 'cmt_admin_creds'
const SESSION_LIFE = 4 * 60 * 60 * 1000

const DEFAULT_PASSWORD = 'CMT069'
const DEFAULT_PIN      = '0069'

function getActiveCreds(): { password: string; pin: string } {
  try {
    const raw = localStorage.getItem(CREDS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { password: DEFAULT_PASSWORD, pin: DEFAULT_PIN }
}

function randomToken(): string {
  // crypto.randomUUID() is only available in Safari 15.4+, so fall back gracefully
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch { /* ignore */ }
  return `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export async function validateAdminCredentials(password: string, pin: string): Promise<boolean> {
  const creds = getActiveCreds()
  return password.trim() === creds.password && pin.trim() === creds.pin
}

export function changeAdminCredentials(
  currentPassword: string,
  currentPin: string,
  updates: { newPassword?: string; newPin?: string },
): boolean {
  const creds = getActiveCreds()
  if (currentPassword.trim() !== creds.password || currentPin.trim() !== creds.pin) return false
  try {
    localStorage.setItem(CREDS_KEY, JSON.stringify({
      password: updates.newPassword?.trim() ?? creds.password,
      pin:      updates.newPin?.trim()      ?? creds.pin,
    }))
    return true
  } catch {
    return false
  }
}

export function createAdminSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, randomToken())
    sessionStorage.setItem(EXPIRY_KEY, String(Date.now() + SESSION_LIFE))
  } catch { /* sessionStorage unavailable — auth state is still set in memory */ }
}

export function isAdminSessionValid(): boolean {
  try {
    const tok    = sessionStorage.getItem(SESSION_KEY)
    const expiry = sessionStorage.getItem(EXPIRY_KEY)
    if (!tok || !expiry) return false
    if (Date.now() > Number(expiry)) {
      clearAdminSession()
      return false
    }
    return true
  } catch {
    return false
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(EXPIRY_KEY)
  } catch { /* ignore */ }
}
