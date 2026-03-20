import { useState, useEffect } from 'react'

let showToastFn = null

export function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    showToastFn = (msg, type = 'success') => {
      setToast({ msg, type })
      setTimeout(() => setToast(null), 3500)
    }
  }, [])

  if (!toast) return null

  const bg = toast.type === 'error' ? '#dc2626' : toast.type === 'warning' ? '#d97706' : '#1a1a2e'

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: bg, color: 'white',
      padding: '14px 22px', borderRadius: 14,
      fontWeight: 500, zIndex: 200,
      animation: 'fadeIn 0.3s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      maxWidth: 340, fontSize: 14
    }}>
      {toast.msg}
    </div>
  )
}

export const showToast = (msg, type) => showToastFn?.(msg, type)
