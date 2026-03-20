import { useState, useEffect } from 'react'
import { bookingsAPI } from '../services/api'
import { showToast } from '../components/Toast'
import { Link } from 'react-router-dom'

const STATUS = {
  CONFIRMED: { bg: '#dcfce7', text: '#166534', dot: '#22c55e', label: 'Confirmed' },
  PENDING:   { bg: '#fef9c3', text: '#854d0e', dot: '#eab308', label: 'Pending'   },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', label: 'Cancelled' },
  COMPLETED: { bg: '#ede9fe', text: '#4338ca', dot: '#6366f1', label: 'Completed' },
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getMyBookings()
      setBookings(res.data.data)
    } catch {
      showToast('Failed to load bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await bookingsAPI.cancel(id)
      showToast('Booking cancelled')
      fetchBookings()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel', 'error')
    } finally {
      setCancelling(null)
    }
  }

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending:   bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>My Bookings</h1>
        <p style={{ color: '#6b7280' }}>Track and manage all your appointments</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, marginBottom: 36 }}>
        {[
          { label: 'Total',     value: stats.total,     bg: '#ede9fe', color: '#4f46e5', icon: '📋' },
          { label: 'Confirmed', value: stats.confirmed,  bg: '#dcfce7', color: '#166534', icon: '✅' },
          { label: 'Pending',   value: stats.pending,    bg: '#fef9c3', color: '#854d0e', icon: '⏳' },
          { label: 'Cancelled', value: stats.cancelled,  bg: '#fee2e2', color: '#991b1b', icon: '❌' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '22px 20px' }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 500, opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? <div className="spinner" /> : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No bookings yet</h3>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Browse our services and make your first booking</p>
          <Link to="/services"><button className="btn-primary">Browse Services</button></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookings.map(b => {
            const sc = STATUS[b.status] || STATUS.PENDING
            const canCancel = b.status === 'PENDING' || b.status === 'CONFIRMED'
            return (
              <div key={b.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{b.serviceIcon || '🔧'}</div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{b.serviceName}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>
                    📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  {b.notes && <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 3 }}>📝 {b.notes}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: sc.bg, color: sc.text, padding: '7px 14px', borderRadius: 999 }}>
                    <div style={{ width: 7, height: 7, background: sc.dot, borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{sc.label}</span>
                  </div>
                  {canCancel && (
                    <button onClick={() => handleCancel(b.id)} disabled={cancelling === b.id} style={{
                      background: 'none', border: '1.5px solid #fee2e2', color: '#dc2626',
                      padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                      {cancelling === b.id ? '...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
