import axios from 'axios'

// Base axios instance
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token automatically to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally (token expired → logout)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll:   ()         => api.get('/services'),
  getById:  (id)       => api.get(`/services/${id}`),

  // Admin
  getAllAdmin:  ()      => api.get('/admin/services'),
  create:      (data)  => api.post('/admin/services', data),
  update:      (id, data) => api.put(`/admin/services/${id}`, data),
  deactivate:  (id)    => api.delete(`/admin/services/${id}`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  create:    (data)  => api.post('/bookings', data),
  getMyBookings: ()  => api.get('/bookings/my'),
  getById:   (id)    => api.get(`/bookings/${id}`),
  cancel:    (id)    => api.patch(`/bookings/${id}/cancel`),

  // Admin
  getAll:    ()      => api.get('/admin/bookings'),
  updateStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
  getStats:  ()      => api.get('/admin/bookings/stats'),
}

export default api
