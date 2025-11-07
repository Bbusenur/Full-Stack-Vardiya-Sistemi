import { useState, useEffect } from 'react'
import { usersApi } from '../services/api'

function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll()
      setUsers(response.data)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id, formData)
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla güncellendi' })
      } else {
        await usersApi.create(formData)
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla oluşturuldu' })
      }
      setShowForm(false)
      setSelectedUser(null)
      setFormData({ name: '', email: '', password: '', role: 'employee' })
      loadUsers()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Bir hata oluştu'
      setMessage({ type: 'error', text: errorMsg })
      if (errorMsg.includes('email') || errorMsg.includes('Email')) {
        setMessage({ type: 'error', text: 'Geçerli bir email adresi giriniz' })
      } else if (errorMsg.includes('password') || errorMsg.includes('Password')) {
        setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır' })
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      try {
        await usersApi.delete(id)
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla silindi' })
        loadUsers()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (error) {
        setMessage({ type: 'error', text: 'Silme işlemi başarısız oldu' })
      }
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    })
  }

  return (
    <div style={{ padding: '2rem' }} data-testid="users-page">
      <h1>Kullanıcı Yönetimi</h1>
      
      {message.text && (
        <div 
          data-testid={message.type === 'success' ? 'success-message' : 'error-message'}
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            borderRadius: '4px',
          }}
        >
          {message.text}
        </div>
      )}

      <button
        data-testid="create-user-button"
        onClick={() => {
          setShowForm(!showForm)
          setSelectedUser(null)
          setFormData({ name: '', email: '', password: '', role: 'employee' })
        }}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
      >
        {showForm ? 'Formu Kapat' : 'Yeni Kullanıcı Oluştur'}
      </button>

      {showForm && (
        <form data-testid="user-form" onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>İsim: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Şifre: </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!selectedUser}
              minLength={6}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Rol: </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="employee">Çalışan</option>
              <option value="manager">Yönetici</option>
            </select>
          </div>
          <button type="submit" data-testid="submit-user-button" style={{ padding: '0.5rem 1rem' }}>
            {selectedUser ? 'Güncelle' : 'Oluştur'}
          </button>
        </form>
      )}

      <div data-testid="users-list">
        {users.length === 0 ? (
          <p>Henüz kullanıcı bulunmamaktadır.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              data-testid="user-item"
              onClick={() => handleUserClick(user)}
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Rol: {user.role}</p>
              <button
                data-testid="edit-user-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUserClick(user)
                  setShowForm(true)
                }}
                style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
              >
                Düzenle
              </button>
              <button
                data-testid="delete-user-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(user.id)
                }}
                style={{ padding: '0.25rem 0.5rem', background: '#dc3545', color: 'white', border: 'none' }}
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Users

