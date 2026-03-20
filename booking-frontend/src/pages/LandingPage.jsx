import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user, isAdmin } = useAuth()

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '90px 32px 110px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 400, height: 400, background: 'radial-gradient(circle, rgba(79,70,229,0.25), transparent)', borderRadius: '50%' }} />

        <div className="fade-in" style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 999, padding: '6px 18px',
            marginBottom: 24, fontSize: 13,
            fontWeight: 600, color: '#c4b5fd'
          }}>
            🚀 Skip the Queue. Book Smarter.
          </div>

          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Your Services,<br /><span style={{ color: '#a78bfa' }}>Booked Instantly</span>
          </h1>

          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            Doctor visits, government appointments, salon sessions — all in one place. No waiting rooms. No phone calls.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to={isAdmin ? '/admin' : '/services'}>
                <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
                  {isAdmin ? 'Go to Admin Panel →' : 'Browse Services →'}
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>Get Started Free</button>
                </Link>
                <Link to="/login">
                  <button style={{ background: 'transparent', border: '2px solid #6366f1', color: '#a78bfa', fontSize: 16, padding: '14px 36px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 52 }}>Three simple steps to your booking</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { step: '01', icon: '👤', title: 'Create Account', desc: 'Register with your name and email. Secure and instant.' },
            { step: '02', icon: '🔍', title: 'Browse Services', desc: 'Explore available services — healthcare, government, lifestyle.' },
            { step: '03', icon: '✅', title: 'Book & Track', desc: 'Pick a date, confirm your booking, and track its status.' },
          ].map(item => (
            <div key={item.step} className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 12, fontWeight: 800, color: '#e5e7eb' }}>{item.step}</div>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ background: '#1a1a2e', padding: '60px 32px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to book smarter?</h2>
        <p style={{ color: '#94a3b8', marginBottom: 28 }}>Join thousands of users saving time every day.</p>
        <Link to="/register">
          <button className="btn-primary">Create Free Account →</button>
        </Link>
      </div>
    </div>
  )
}
