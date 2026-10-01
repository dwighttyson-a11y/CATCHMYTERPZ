import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error'

interface ToastState {
  text: string
  type: ToastType
  key: number
}

interface ToastCtxValue {
  show: (text: string, type?: ToastType) => void
}

const ToastCtx = createContext<ToastCtxValue | null>(null)

export function useToast(): ToastCtxValue {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

function ToastBanner({ toast, onDone }: { toast: ToastState; onDone: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10)
    const t2 = setTimeout(() => setVisible(false), 2600)
    const t3 = setTimeout(onDone, 3100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [toast.key])

  const isSuccess = toast.type !== 'error'
  const colour = isSuccess ? '#A8CE2C' : '#EF4444'

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#1A1628',
        border: `1px solid ${colour}44`,
        borderLeft: `3px solid ${colour}`,
        padding: '13px 20px',
        boxShadow: `0 6px 32px rgba(0,0,0,0.55), 0 0 24px ${colour}1a`,
        minWidth: 220,
        pointerEvents: 'none',
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.32s cubic-bezier(0.34,1.4,0.64,1), opacity 0.28s ease',
      }}
    >
      {isSuccess
        ? <CheckCircle size={16} color={colour} strokeWidth={2.5} style={{ flexShrink: 0 }} />
        : <XCircle    size={16} color={colour} strokeWidth={2.5} style={{ flexShrink: 0 }} />
      }
      <span style={{
        fontSize: '0.8rem', fontWeight: 700,
        color: '#F0EBF8', letterSpacing: '0.02em', whiteSpace: 'nowrap',
      }}>
        {toast.text}
      </span>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const show = useCallback((text: string, type: ToastType = 'success') => {
    setToast({ text, type, key: Date.now() })
  }, [])

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {toast && <ToastBanner toast={toast} onDone={() => setToast(null)} />}
    </ToastCtx.Provider>
  )
}
