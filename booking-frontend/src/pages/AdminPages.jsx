import { useState, useEffect } from 'react'
import { bookingsAPI, servicesAPI } from '../services/api'
import { showToast } from '../components/Toast'

// ─── Admin Dashboard (Stats) ──────────────────────────────────────────────────
export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([bookingsAPI.getStats(), bookingsAPI.getAll()])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data.data)
        setRecent(bookingsRes.data.data.slice(0, 5))
      })
      .catch(() => showToast('Failed to load data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Admin Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: 36 }}>System overview and recent activity</p>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Bookings', value: stats.total,     bg: '#ede9fe', color: '#4f46e5', icon: '📊' },
            { label: 'Confirmed',      value: stats.confirmed, bg: '#dcfce7', color: '#166534', icon: '✅' },
            { label: 'Pending',        value: stats.pending,   bg: '#fef9c3', color: '#854d0e', icon: '⏳' },
            { label: 'Cancelled',      value: stats.cancelled, bg: '#fee2e2', color: '#991b1b', icon: '❌' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Recent Bookings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recent.map(b => <BookingRow key={b.id} booking={b} showUser />)}
      </div>
    </div>
  )
}

// ─── Admin Bookings ───────────────────────────────────────────────────────────
export function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getAll()
      setBookings(res.data.data)
    } catch {
      showToast('Failed to load bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status)
      showToast('Status updated ✓')
      fetchBookings()
    } catch {
      showToast('Update failed', 'error')
    }
  }

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>All Bookings</h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>View and manage every booking in the system</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 16px', borderRadius: 999, border: '2px solid',
            fontWeight: 600, fontSize: 12, cursor: 'pointer',
            background: filter === s ? '#4f46e5' : 'white',
            borderColor: filter === s ? '#4f46e5' : '#e5e7eb',
            color: filter === s ? 'white' : '#6b7280'
          }}>{s}</button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 28 }}>{b.serviceIcon || '🔧'}</span>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{b.serviceName}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>👤 {b.userName} · {b.userEmail}</div>
                <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>📅 {b.bookingDate}</div>
              </div>
              <select
                value={b.status}
                onChange={e => handleStatusChange(b.id, e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: 10, border: '2px solid #e5e7eb',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'white',
                  color: '#374151', outline: 'none'
                }}>
                {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 50, color: '#6b7280' }}>No bookings found</div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Admin Services ───────────────────────────────────────────────────────────
export function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', category: '', icon: '', duration: '', price: '' })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      const res = await servicesAPI.getAllAdmin()
      setServices(res.data.data)
    } catch {
      showToast('Failed to load services', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.name || !form.description) return showToast('Name and description are required', 'error')
    setSaving(true)
    try {
      await servicesAPI.create(form)
      showToast('Service added! ✅')
      setForm({ name: '', description: '', category: '', icon: '', duration: '', price: '' })
      setShowForm(false)
      fetchServices()
    } catch {
      showToast('Failed to create service', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (id) => {
    if (!confirm('Deactivate this service?')) return
    try {
      await servicesAPI.deactivate(id)
      showToast('Service deactivated')
      fetchServices()
    } catch {
      showToast('Failed', 'error')
    }
  }

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Manage Services</h1>
          <p style={{ color: '#6b7280' }}>Add, edit or deactivate services</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(p => !p)}>
          {showForm ? '✕ Close Form' : '➕ Add Service'}
        </button>
      </div>

      {/* Add Service Form */}
      {showForm && (
        <div className="card fade-in" style={{ marginBottom: 32, maxWidth: 600 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>New Service</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {[
              { label: 'Service Name *', key: 'name',     placeholder: 'e.g. Eye Checkup'   },
              { label: 'Category',       key: 'category', placeholder: 'e.g. Healthcare'     },
              { label: 'Duration',       key: 'duration', placeholder: 'e.g. 30 min'         },
              { label: 'Price',          key: 'price',    placeholder: 'e.g. ₹400'            },
              { label: 'Icon (emoji)',   key: 'icon',     placeholder: '🔧'                   },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input className="input-field" placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} />
              </div>
            ))}
          </div>
          <label style={labelStyle}>Description *</label>
          <textarea className="input-field" rows={3} placeholder="Describe the service..."
            value={form.description} onChange={set('description')} style={{ marginBottom: 18, resize: 'vertical' }} />
          <button className="btn-primary" onClick={handleAdd} disabled={saving}>
            {saving ? 'Saving...' : 'Add Service'}
          </button>
        </div>
      )}

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {services.map(s => (
            <div key={s.id} className="card" style={{ opacity: s.isActive ? 1 : 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{s.icon || '🔧'}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {s.category && <span style={{ background: '#ede9fe', color: '#4f46e5', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{s.category}</span>}
                  <span style={{ background: s.isActive ? '#dcfce7' : '#fee2e2', color: s.isActive ? '#166534' : '#991b1b', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.name}</h3>
              <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{s.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {s.duration && <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>⏱ {s.duration}</span>}
                {s.price    && <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>💰 {s.price}</span>}
              </div>
              {s.isActive && (
                <button onClick={() => handleDeactivate(s.id)} style={{
                  width: '100%', background: 'none', border: '1.5px solid #fca5a5', color: '#dc2626',
                  padding: '8px', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer'
                }}>
                  Deactivate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BookingRow({ booking: b, showUser }) {
  const STATUS_COLOR = {
    CONFIRMED: '#22c55e', PENDING: '#eab308', CANCELLED: '#ef4444', COMPLETED: '#6366f1'
  }
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px' }}>
      <span style={{ fontSize: 24 }}>{b.serviceIcon || '🔧'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
        {showUser && <div style={{ color: '#6b7280', fontSize: 13 }}>👤 {b.userName}</div>}
        <div style={{ color: '#9ca3af', fontSize: 12 }}>📅 {b.bookingDate}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, background: STATUS_COLOR[b.status] || '#6b7280', borderRadius: '50%' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{b.status}</span>
      </div>
    </div>
  )
}

const labelStyle = { fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6, color: '#374151' }
