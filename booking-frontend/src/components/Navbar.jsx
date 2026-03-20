import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <span style={{ fontSize: 22 }}>📅</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#4f46e5' }}>BookEase</span>
      </Link>

      {/* Nav Links */}
      {user && (
        <div style={{ display: 'flex', gap: 4 }}>
          {!isAdmin && (
            <>
              <NavLink to="/services" active={isActive('/services')}>Services</NavLink>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>My Bookings</NavLink>
            </>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin" active={isActive('/admin')}>Dashboard</NavLink>
              <NavLink to="/admin/services" active={isActive('/admin/services')}>Services</NavLink>
              <NavLink to="/admin/bookings" active={isActive('/admin/bookings')}>Bookings</NavLink>
            </>
          )}
        </div>
      )}

      {/* User */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: '#ede9fe', width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#4f46e5', fontSize: 15
          }}>
            {user.name[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{user.name}</span>
          {isAdmin && (
            <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>ADMIN</span>
          )}
          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/login"><button className="btn-ghost" style={{ padding: '8px 20px', fontSize: 14 }}>Sign In</button></Link>
          <Link to="/register"><button className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>Register</button></Link>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button style={{
        background: active ? '#ede9fe' : 'none',
        border: 'none',
        color: active ? '#4f46e5' : '#6b7280',
        fontSize: 14, fontWeight: 500,
        cursor: 'pointer', padding: '8px 16px',
        borderRadius: 8, transition: 'all 0.2s'
      }}>
        {children}
      </button>
    </Link>
  )
}
