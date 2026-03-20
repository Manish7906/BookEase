import { useState, useEffect } from 'react'
import { servicesAPI, bookingsAPI } from '../services/api'
import { showToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [bookingModal, setBookingModal] = useState(null)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [booking, setBooking] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await servicesAPI.getAll()
      setServices(res.data.data)
    } catch {
      showToast('Failed to load services', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBook = async () => {
    if (!bookingDate) return showToast('Please select a date', 'error')
    setBooking(true)
    try {
      await bookingsAPI.create({ serviceId: bookingModal.id, bookingDate, notes: bookingNotes })
      showToast('Booking confirmed! 🎉')
      setBookingModal(null)
      setBookingDate('')
      setBookingNotes('')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed', 'error')
    } finally {
      setBooking(false)
    }
  }

  const categories = ['All', ...new Set(services.map(s => s.category).filter(Boolean))]
  const filtered = filter === 'All' ? services : services.filter(s => s.category === filter)

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

      {/* Booking Modal */}
      {bookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}
          onClick={() => setBookingModal(null)}>
          <div className="card fade-in" style={{ maxWidth: 420, width: '90%', padding: 36 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{bookingModal.icon || '🔧'}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{bookingModal.name}</h2>
            <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>{bookingModal.description}</p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {bookingModal.duration && <Chip icon="⏱" label={bookingModal.duration} color="#4f46e5" bg="#ede9fe" />}
              {bookingModal.price    && <Chip icon="💰" label={bookingModal.price}    color="#166534" bg="#dcfce7" />}
            </div>

            <label style={labelStyle}>Select Date</label>
            <input type="date" className="input-field" value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ marginBottom: 14 }} />

            <label style={labelStyle}>Notes (optional)</label>
            <textarea className="input-field" rows={2} placeholder="Any special requests..."
              value={bookingNotes} onChange={e => setBookingNotes(e.target.value)}
              style={{ marginBottom: 20, resize: 'vertical' }} />

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleBook} disabled={booking}>
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button className="btn-ghost" onClick={() => setBookingModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Available Services</h1>
        <p style={{ color: '#6b7280' }}>Choose a service and book your appointment instantly</p>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '8px 18px', borderRadius: 999, border: '2px solid',
            fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
            background: filter === cat ? '#4f46e5' : 'white',
            borderColor: filter === cat ? '#4f46e5' : '#e5e7eb',
            color: filter === cat ? 'white' : '#6b7280'
          }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No services found</h3>
          <p style={{ color: '#6b7280' }}>Try a different category</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filtered.map(service => (
            <div key={service.id} className="card" style={{ transition: 'all 0.25s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 40 }}>{service.icon || '🔧'}</span>
                {service.category && <span style={{ background: '#ede9fe', color: '#4f46e5', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{service.category}</span>}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{service.name}</h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{service.description}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {service.duration && <Chip icon="⏱" label={service.duration} color="#374151" bg="#f3f4f6" />}
                {service.price    && <Chip icon="💰" label={service.price}    color="#166534" bg="#f0fdf4" />}
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => setBookingModal(service)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({ icon, label, color, bg }) {
  return (
    <span style={{ background: bg, color, padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
      {icon} {label}
    </span>
  )
}

const labelStyle = { fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6, color: '#374151' }
