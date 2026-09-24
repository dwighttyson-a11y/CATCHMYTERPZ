import { useState } from 'react'
import { HardDrive, Key, Clock, Info, ShieldCheck, Smartphone, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { useMobileSettings } from '../../context/MobileSettingsContext'
import type { MobileSettings } from '../../context/MobileSettingsContext'
import { changeAdminCredentials } from '../auth/adminAuth'
import { changeVaultPassword } from '../../auth/vaultConfig'

// ─── Helpers ────────────────────────────────────────────────────────────────

function storageSize(): string {
  try {
    let bytes = 0
    for (const key of ['cmt_product_images', 'cmt_catalog_sections', 'cmt_product_overrides', 'cmt_mobile_settings']) {
      const raw = localStorage.getItem(key)
      if (raw) bytes += new Blob([raw]).size
    }
    if (bytes === 0) return '0 KB'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } catch {
    return 'Unknown'
  }
}

// ─── Primitives ──────────────────────────────────────────────────────────────

/** Thin horizontal rule with a centred uppercase label */
function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 14px' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(45,37,80,0.8)' }} />
      <span style={{
        fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.2em',
        color: '#5B4A8A', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'rgba(45,37,80,0.8)' }} />
    </div>
  )
}

/** Outer card shell used by every section */
function Card({ children, accentColor = '#7C3AED' }: {
  children: React.ReactNode
  accentColor?: string
}) {
  return (
    <div style={{
      background: '#1A1628',
      border: '1px solid #2D2550',
      borderTop: `2px solid ${accentColor}`,
      padding: '20px',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

/** Card title row with icon + title + subtitle */
function CardHeader({ icon, title, subtitle }: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6, flexShrink: 0,
        background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F0EBF8', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.63rem', color: '#6B5E99', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

/** Inline info / warning banner */
function Banner({ color, children }: { color: 'green' | 'red' | 'yellow'; children: React.ReactNode }) {
  const map = {
    green:  { bg: 'rgba(168,206,44,0.06)',  border: 'rgba(168,206,44,0.22)',  text: '#A8CE2C' },
    red:    { bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)',   text: '#F87171' },
    yellow: { bg: 'rgba(250,200,60,0.07)',  border: 'rgba(250,200,60,0.22)',  text: '#FBC94C' },
  }
  const c = map[color]
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start', padding: '9px 12px',
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, fontSize: '0.72rem', lineHeight: 1.5,
    }}>
      <Info size={13} style={{ marginTop: 1, flexShrink: 0 }} />
      {children}
    </div>
  )
}

/** One labelled field row inside a settings card */
function SettingRow({ label, description, children }: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '12px 0', borderBottom: '1px solid rgba(45,37,80,0.5)',
    }}>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F0EBF8', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: '0.64rem', color: '#6B5E99' }}>{description}</div>
      </div>
      {children}
    </div>
  )
}

/** Toggle switch */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 46, height: 26, borderRadius: 13, flexShrink: 0, cursor: 'pointer', position: 'relative',
        background: value ? '#7C3AED' : '#2D2550',
        border: `1px solid ${value ? 'rgba(124,58,237,0.6)' : 'rgba(45,37,80,0.8)'}`,
        boxShadow: value ? '0 0 10px rgba(124,58,237,0.35)' : 'none',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: value ? 25 : 3,
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

/** 2-up column count picker */
function ColPicker({ value, onChange }: {
  value: MobileSettings['productGridCols']
  onChange: (v: MobileSettings['productGridCols']) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      {([2, 3] as const).map(n => (
        <button
          key={n} type="button" onClick={() => onChange(n)}
          style={{
            width: 42, height: 34, cursor: 'pointer', fontFamily: 'inherit',
            background: value === n ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : 'rgba(45,37,80,0.5)',
            border: `1px solid ${value === n ? 'rgba(124,58,237,0.7)' : 'rgba(45,37,80,0.8)'}`,
            color: value === n ? '#fff' : '#9080B4',
            fontSize: '0.78rem', fontWeight: 800,
            boxShadow: value === n ? '0 0 12px rgba(124,58,237,0.35)' : 'none',
            transition: 'all 0.18s',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

/** Password input with show/hide toggle */
function PasswordInput({ label, hint, value, onChange, placeholder }: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9080B4', marginBottom: 5, letterSpacing: '0.04em' }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#5B4A8A', marginLeft: 6 }}>{hint}</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#0C0919', border: '1px solid #2D2550',
            color: '#F0EBF8', fontSize: '0.82rem', padding: '9px 38px 9px 12px',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          type="button" onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: '#5B4A8A', display: 'flex', alignItems: 'center',
          }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

/** Plain PIN input (digits only) */
function PinInput({ label, hint, value, onChange, placeholder }: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9080B4', marginBottom: 5, letterSpacing: '0.04em' }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#5B4A8A', marginLeft: 6 }}>{hint}</span>}
      </label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
        maxLength={4}
        placeholder={placeholder ?? '4 digits'}
        autoComplete="new-password"
        style={{
          width: '100%', boxSizing: 'border-box',
          background: '#0C0919', border: '1px solid #2D2550',
          color: '#F0EBF8', fontSize: '0.82rem', padding: '9px 12px',
          outline: 'none', fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function MobileLayoutCard() {
  const { mobileSettings, updateMobileSetting } = useMobileSettings()
  return (
    <Card accentColor="#A8CE2C">
      <CardHeader
        icon={<Smartphone size={17} color="#A8CE2C" strokeWidth={1.5} />}
        title="Mobile Layout"
        subtitle="Controls how the store looks on phones (≤ 640 px). Desktop is unaffected."
      />
      <SettingRow label="Product grid columns" description="Number of product cards per row on mobile">
        <ColPicker value={mobileSettings.productGridCols} onChange={v => updateMobileSetting('productGridCols', v)} />
      </SettingRow>
      <SettingRow label="Social bubbles" description="Show Instagram / Signal / Viber / Threema icons on mobile">
        <Toggle value={mobileSettings.showSocialBubbles} onChange={v => updateMobileSetting('showSocialBubbles', v)} />
      </SettingRow>
      <SettingRow label="Hero banner" description="Show the banner image on mobile (hiding it puts products first)">
        <Toggle value={mobileSettings.showHero} onChange={v => updateMobileSetting('showHero', v)} />
      </SettingRow>
      <div style={{ marginTop: 14 }}>
        <Banner color="yellow">Changes apply instantly — open the store on your phone to preview.</Banner>
      </div>
    </Card>
  )
}

function SubFormStatus({ status, successMsg, errorMap }: {
  status: string
  successMsg: string
  errorMap: Partial<Record<string, string>>
}) {
  if (status === 'idle') return null
  const isSuccess = status === 'success'
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center', padding: '9px 12px', marginBottom: 14,
      background: isSuccess ? 'rgba(168,206,44,0.06)' : 'rgba(220,38,38,0.08)',
      border: `1px solid ${isSuccess ? 'rgba(168,206,44,0.25)' : 'rgba(220,38,38,0.25)'}`,
      color: isSuccess ? '#A8CE2C' : '#F87171', fontSize: '0.72rem',
    }}>
      {isSuccess ? <CheckCircle2 size={14} style={{ flexShrink: 0 }} /> : <XCircle size={14} style={{ flexShrink: 0 }} />}
      {isSuccess ? successMsg : (errorMap[status] ?? 'Something went wrong.')}
    </div>
  )
}

function SubmitBtn({ label }: { label: string }) {
  return (
    <button
      type="submit"
      style={{
        padding: '9px 24px',
        background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
        border: '1px solid rgba(124,58,237,0.6)',
        color: '#fff', fontSize: '0.78rem', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: '0 0 14px rgba(124,58,237,0.3)',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {label}
    </button>
  )
}

function VerifyRow({ curPassword, setCurPassword, curPin, setCurPin }: {
  curPassword: string; setCurPassword: (v: string) => void
  curPin: string;      setCurPin: (v: string) => void
}) {
  return (
    <div style={{
      background: 'rgba(12,9,25,0.5)', border: '1px solid rgba(45,37,80,0.6)',
      padding: '14px 16px', marginBottom: 16,
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#5B4A8A', textTransform: 'uppercase', marginBottom: 12 }}>
        Step 1 — Verify your identity
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <PasswordInput label="Current Password" value={curPassword} onChange={setCurPassword} placeholder="Your current password" />
        <PinInput      label="Current PIN"      value={curPin}      onChange={setCurPin}      placeholder="Your current PIN" />
      </div>
    </div>
  )
}

function ChangePasswordCard() {
  const [curPassword, setCurPassword]         = useState('')
  const [curPin, setCurPin]                   = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'wrongCurrent' | 'mismatch' | 'weak'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setStatus('mismatch'); return }
    if (newPassword.trim().length < 4)   { setStatus('weak');     return }
    const ok = changeAdminCredentials(curPassword, curPin, { newPassword })
    if (ok) { setStatus('success'); setCurPassword(''); setCurPin(''); setNewPassword(''); setConfirmPassword('') }
    else    { setStatus('wrongCurrent') }
  }

  return (
    <Card>
      <CardHeader
        icon={<Key size={17} color="#7C3AED" strokeWidth={1.5} />}
        title="Change Admin Password"
        subtitle="Updates the password you use to log into the admin panel."
      />
      <form onSubmit={handleSubmit}>
        <VerifyRow curPassword={curPassword} setCurPassword={setCurPassword} curPin={curPin} setCurPin={setCurPin} />
        <div style={{
          background: 'rgba(12,9,25,0.5)', border: '1px solid rgba(45,37,80,0.6)',
          padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#5B4A8A', textTransform: 'uppercase', marginBottom: 12 }}>
            Step 2 — Set new password
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PasswordInput label="New Password" hint="(min. 4 characters)" value={newPassword} onChange={setNewPassword} placeholder="Choose a new password" />
            <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" />
          </div>
        </div>
        <SubFormStatus
          status={status}
          successMsg="Password updated. Use it on your next login."
          errorMap={{ wrongCurrent: 'Current password or PIN is incorrect.', mismatch: 'New passwords do not match.', weak: 'New password must be at least 4 characters.' }}
        />
        <SubmitBtn label="Update Password" />
      </form>
    </Card>
  )
}

function ChangePinCard() {
  const [curPassword, setCurPassword] = useState('')
  const [curPin, setCurPin]           = useState('')
  const [newPin, setNewPin]           = useState('')
  const [confirmPin, setConfirmPin]   = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'wrongCurrent' | 'mismatch' | 'badPin'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPin !== confirmPin)       { setStatus('mismatch'); return }
    if (!/^\d{4}$/.test(newPin))     { setStatus('badPin');   return }
    const ok = changeAdminCredentials(curPassword, curPin, { newPin })
    if (ok) { setStatus('success'); setCurPassword(''); setCurPin(''); setNewPin(''); setConfirmPin('') }
    else    { setStatus('wrongCurrent') }
  }

  return (
    <Card>
      <CardHeader
        icon={<Key size={17} color="#7C3AED" strokeWidth={1.5} />}
        title="Change Admin PIN"
        subtitle="Updates the 4-digit PIN you use to log into the admin panel."
      />
      <form onSubmit={handleSubmit}>
        <VerifyRow curPassword={curPassword} setCurPassword={setCurPassword} curPin={curPin} setCurPin={setCurPin} />
        <div style={{
          background: 'rgba(12,9,25,0.5)', border: '1px solid rgba(45,37,80,0.6)',
          padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#5B4A8A', textTransform: 'uppercase', marginBottom: 12 }}>
            Step 2 — Set new PIN
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PinInput label="New PIN" hint="(4 digits)" value={newPin} onChange={v => { setNewPin(v); if (status !== 'idle') setStatus('idle') }} placeholder="e.g. 1234" />
            <PinInput label="Confirm New PIN" value={confirmPin} onChange={v => { setConfirmPin(v); if (status !== 'idle') setStatus('idle') }} placeholder="Repeat new PIN" />
          </div>
        </div>
        <SubFormStatus
          status={status}
          successMsg="PIN updated. Use it on your next login."
          errorMap={{ wrongCurrent: 'Current password or PIN is incorrect.', mismatch: 'PINs do not match.', badPin: 'PIN must be exactly 4 digits.' }}
        />
        <SubmitBtn label="Update PIN" />
      </form>
    </Card>
  )
}

function SessionSecurityCard() {
  return (
    <Card>
      <CardHeader
        icon={<ShieldCheck size={17} color="#7C3AED" strokeWidth={1.5} />}
        title="Session Security"
        subtitle="How your admin login session works."
      />
      <p style={{ margin: '0 0 12px', color: '#9080B4', fontSize: '0.8rem', lineHeight: 1.6 }}>
        Your session is <strong style={{ color: '#F0EBF8' }}>automatically cleared</strong> every time you
        leave the Admin Panel — navigating to the store, closing the tab, or pressing back. You must log in
        again each visit.
      </p>
      <Banner color="green">No session is ever left open. Every visit requires authentication.</Banner>
    </Card>
  )
}

function DataStorageCard() {
  const { sections, productOverrides } = useCatalog()
  const size = storageSize()

  const rows = [
    { label: 'Product photos',    key: 'cmt_product_images',    note: 'custom images' },
    { label: 'Section config',    key: 'cmt_catalog_sections',  note: `${sections.length} section${sections.length !== 1 ? 's' : ''}` },
    { label: 'Product overrides', key: 'cmt_product_overrides', note: `${Object.keys(productOverrides).length} override${Object.keys(productOverrides).length !== 1 ? 's' : ''}` },
    { label: 'Mobile settings',   key: 'cmt_mobile_settings',   note: 'layout prefs' },
  ]

  return (
    <Card>
      <CardHeader
        icon={<HardDrive size={17} color="#7C3AED" strokeWidth={1.5} />}
        title="Data Storage"
        subtitle="All admin data lives in your browser's localStorage."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {rows.map(({ label, key, note }) => (
          <div key={key} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 8, padding: '8px 12px',
            background: '#0C0919', border: '1px solid #2D2550',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#F0EBF8', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '0.6rem', color: '#5B4A8A', fontFamily: 'monospace', marginTop: 1 }}>{key}</div>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#A8CE2C', fontWeight: 700 }}>{note}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 12px',
          background: '#0C0919', border: '1px solid rgba(124,58,237,0.25)',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#9080B4' }}>Total usage</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#A8CE2C' }}>{size}</span>
        </div>
      </div>
      <p style={{ margin: 0, color: '#6B5E99', fontSize: '0.72rem', lineHeight: 1.6 }}>
        Clearing browser data removes all custom photos, section configs, and overrides.
        Browser localStorage limit is approximately 5–10 MB.
      </p>
    </Card>
  )
}

function AboutCard() {
  return (
    <Card>
      <CardHeader
        icon={<Clock size={17} color="#7C3AED" strokeWidth={1.5} />}
        title="About This Panel"
        subtitle="CatchMyTerpz 069 Admin Panel · Version 2.1"
      />
      <p style={{ margin: 0, color: '#9080B4', fontSize: '0.8rem', lineHeight: 1.6 }}>
        Manage products, photos, sections, categories, and mobile layout entirely from this interface —
        no code changes required. All updates are reflected live on the store.
      </p>
    </Card>
  )
}

function ChangeVaultPasswordCard() {
  const [curPassword, setCurPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'wrongCurrent' | 'mismatch' | 'weak'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setStatus('mismatch'); return }
    if (newPassword.trim().length < 4)   { setStatus('weak');     return }
    const ok = changeVaultPassword(curPassword, newPassword.trim())
    if (ok) {
      setStatus('success')
      setCurPassword(''); setNewPassword(''); setConfirmPassword('')
    } else {
      setStatus('wrongCurrent')
    }
  }

  const errorMessages: Partial<Record<typeof status, string>> = {
    wrongCurrent: 'Current store password is incorrect.',
    mismatch:     'New passwords do not match — please re-enter them.',
    weak:         'New password must be at least 4 characters.',
  }

  return (
    <Card>
      <CardHeader
        icon={<ShieldCheck size={17} color="#7C3AED" strokeWidth={1.5} />}
        title="Change Store Password"
        subtitle="This is the password customers/visitors need to enter to access the store."
      />

      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'rgba(12,9,25,0.5)', border: '1px solid rgba(45,37,80,0.6)',
          padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#5B4A8A', textTransform: 'uppercase', marginBottom: 12 }}>
            Step 1 — Confirm current store password
          </div>
          <div style={{ maxWidth: '48%' }}>
            <PasswordInput
              label="Current Store Password"
              value={curPassword}
              onChange={setCurPassword}
              placeholder="Current password"
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(12,9,25,0.5)', border: '1px solid rgba(45,37,80,0.6)',
          padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#5B4A8A', textTransform: 'uppercase', marginBottom: 12 }}>
            Step 2 — Set new store password
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PasswordInput
              label="New Password"
              hint="(min. 4 characters)"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Choose a new password"
            />
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat new password"
            />
          </div>
        </div>

        {status === 'success' && (
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center', padding: '9px 12px', marginBottom: 14,
            background: 'rgba(168,206,44,0.06)', border: '1px solid rgba(168,206,44,0.25)',
            color: '#A8CE2C', fontSize: '0.72rem',
          }}>
            <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
            Store password updated. Visitors will need the new password from now on.
          </div>
        )}
        {status !== 'idle' && status !== 'success' && (
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center', padding: '9px 12px', marginBottom: 14,
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)',
            color: '#F87171', fontSize: '0.72rem',
          }}>
            <XCircle size={14} style={{ flexShrink: 0 }} />
            {errorMessages[status]}
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '9px 24px',
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            border: '1px solid rgba(124,58,237,0.6)',
            color: '#fff', fontSize: '0.78rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 0 14px rgba(124,58,237,0.3)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Update Store Password
        </button>
      </form>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function AdminSettings() {
  return (
    <div style={{ padding: '24px 16px', maxWidth: 700, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.25em', color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 4 }}>
          Configuration
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#F0EBF8', margin: 0 }}>
          Settings
        </h1>
      </div>

      <SectionLabel>Store Display</SectionLabel>
      <MobileLayoutCard />

      <SectionLabel>Security</SectionLabel>
      <ChangeVaultPasswordCard />
      <ChangePasswordCard />
      <ChangePinCard />
      <SessionSecurityCard />

      <SectionLabel>System</SectionLabel>
      <DataStorageCard />
      <AboutCard />

    </div>
  )
}
