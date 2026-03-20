import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { showToast } from '../components/Toast'

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.email || !form.password) return showToast('Fill all fields', 'error')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      const { token, ...userData } = res.data.data
      login(userData, token)
      showToast(`Welcome back, ${userData.name}! 👋`)
      navigate(userData.role === 'ADMIN' ? '/admin' : '/services')
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
    <AuthForm form={form} setForm={setForm} mode="login" onSubmit={handleSubmit} loading={loading} />
    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
      Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Register</Link>
    </p>
  </AuthLayout>
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return showToast('Fill all fields', 'error')
    if (form.password.length < 6) return showToast('Password must be at least 6 characters', 'error')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      const { token, ...userData } = res.data.data
      login(userData, token)
      showToast(`Account created! Welcome, ${userData.name} 🎉`)
      navigate('/services')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.data?.email || 'Registration failed'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout title="Create Account" subtitle="Join BookEase today — it's free">
    <AuthForm form={form} setForm={setForm} mode="register" onSubmit={handleSubmit} loading={loading} />
    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
      Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign In</Link>
    </p>
  </AuthLayout>
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ede9fe 0%, #f0f4ff 100%)', padding: 24 }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 440, padding: 44 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 36 }}>📅</span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#4f46e5', marginTop: 8 }}>{title}</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function AuthForm({ form, setForm, mode, onSubmit, loading }) {
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {mode === 'register' && (
        <div>
          <label style={labelStyle}>Full Name</label>
          <input className="input-field" placeholder="John Doe" value={form.name} onChange={set('name')} />
        </div>
      )}
      <div>
        <label style={labelStyle}>Email Address</label>
        <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')}
          onKeyDown={e => e.key === 'Enter' && onSubmit()} />
      </div>
      <div>
        <label style={labelStyle}>Password</label>
        <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')}
          onKeyDown={e => e.key === 'Enter' && onSubmit()} />
      </div>
      <button className="btn-primary" style={{ width: '100%', marginTop: 8, padding: 14 }} onClick={onSubmit} disabled={loading}>
        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
      </button>
    </div>
  )
}

const labelStyle = { fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6, color: '#374151' }
