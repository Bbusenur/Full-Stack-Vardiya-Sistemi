import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', { user: data }),
  update: (id, data) => api.patch(`/users/${id}`, { user: data }),
  delete: (id) => api.delete(`/users/${id}`),
}

// Departments API
export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', { department: data }),
  update: (id, data) => api.patch(`/departments/${id}`, { department: data }),
  delete: (id) => api.delete(`/departments/${id}`),
}

// Shifts API
export const shiftsAPI = {
  getAll: () => api.get('/shifts'),
  getById: (id) => api.get(`/shifts/${id}`),
  create: (data) => api.post('/shifts', { shift: data }),
  update: (id, data) => api.patch(`/shifts/${id}`, { shift: data }),
  delete: (id) => api.delete(`/shifts/${id}`),
}

// Shift Assignments API
export const shiftAssignmentsAPI = {
  getAll: () => api.get('/shift_assignments'),
  getById: (id) => api.get(`/shift_assignments/${id}`),
  create: (data) => api.post('/shift_assignments', { shift_assignment: data }),
  update: (id, data) => api.patch(`/shift_assignments/${id}`, { shift_assignment: data }),
  delete: (id) => api.delete(`/shift_assignments/${id}`),
}

export default api

