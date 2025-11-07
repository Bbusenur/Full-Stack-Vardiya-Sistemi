import { useState, useEffect } from 'react'
import { usersAPI } from '../services/api'

function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll()
      setUsers(response.data)
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    
    // Client-side validation
    if (!formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Geçerli bir email adresi giriniz' })
      return
    }
    
    if (!editingUser && formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır' })
      return
    }
    
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, formData)
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla güncellendi' })
      } else {
        await usersAPI.create(formData)
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla oluşturuldu' })
      }
      // Önce modal'ı kapat
      setShowForm(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'employee' })
      // Sonra kullanıcıları yükle ve mesajın görünmesini bekle
      await loadUsers()
    } catch (error) {
      console.error('User create/update error:', error.response?.data)
      const errors = error.response?.data?.errors || []
      const errorMsg = Array.isArray(errors) ? errors.join(', ') : (error.response?.data?.error || 'Bir hata oluştu')
      setMessage({ type: 'error', text: errorMsg })
      
      // Email validasyonu için özel mesaj
      if (errorMsg.toLowerCase().includes('email') || (Array.isArray(errors) && errors.some(e => String(e).toLowerCase().includes('email')))) {
        setMessage({ type: 'error', text: 'Geçerli bir email adresi giriniz' })
      }
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowForm(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await usersAPI.delete(userToDelete.id)
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla silindi' })
        setShowDeleteConfirm(false)
        setUserToDelete(null)
        loadUsers()
      } catch (error) {
        setMessage({ type: 'error', text: 'Silme işlemi başarısız oldu' })
      }
    }
  }

  return (
    <div data-testid="users-page" style={{ color: '#2c3e50' }}>
      <div className="page-header">
        <h1 className="page-title">Kullanıcı Yönetimi</h1>
        <button 
          className="button" 
          data-testid="create-user-button"
          onClick={() => {
            setShowForm(true)
            setEditingUser(null)
            setFormData({ name: '', email: '', password: '', role: 'employee' })
          }}
        >
          Yeni Kullanıcı
        </button>
      </div>

      {message && (
        <div 
          className={`message message-${message.type}`}
          data-testid={message.type === 'success' ? 'success-message' : 'error-message'}
          style={{ 
            display: 'block',
            position: 'relative',
            zIndex: 1000,
            margin: '1rem 0',
            padding: '1rem',
            borderRadius: '4px'
          }}
        >
          {message.text}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Kullanıcıyı Sil</h2>
              <button className="modal-close" onClick={() => {
                setShowDeleteConfirm(false)
                setUserToDelete(null)
              }}>×</button>
            </div>
            <p>Bu kullanıcıyı silmek istediğinize emin misiniz?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="button button-secondary" 
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setUserToDelete(null)
                }}
              >
                İptal
              </button>
              <button 
                type="button" 
                className="button button-danger"
                data-testid="confirm-delete-button"
                onClick={handleConfirmDelete}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h2>
              <button className="modal-close" onClick={() => {
                setShowForm(false)
                setEditingUser(null)
                setFormData({ name: '', email: '', password: '', role: 'employee' })
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit} data-testid="user-form">
              <div className="form-group">
                <label className="form-label">Ad Soyad</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                {message && message.type === 'error' && (message.text.includes('email') || message.text.includes('Email')) && (
                  <div className="message message-error" style={{ marginTop: '0.5rem', padding: '0.5rem' }} data-testid="error-message">
                    Geçerli bir email adresi giriniz
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  minLength={6}
                />
                {message && message.type === 'error' && (message.text.includes('password') || message.text.includes('şifre') || message.text.includes('6')) && (
                  <div className="message message-error" style={{ marginTop: '0.5rem', padding: '0.5rem' }} data-testid="error-message">
                    Şifre en az 6 karakter olmalıdır
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="employee">Çalışan</option>
                  <option value="manager">Yönetici</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="button button-secondary" onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                  setFormData({ name: '', email: '', password: '', role: 'employee' })
                }}>
                  İptal
                </button>
                <button type="submit" className="button" data-testid={editingUser ? "submit-update-button" : "submit-user-button"}>
                  {editingUser ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="list" data-testid="users-list" style={{ minHeight: users.length === 0 ? '50px' : 'auto', color: '#2c3e50' }}>
        {users.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
            Henüz kullanıcı bulunmamaktadır.
          </div>
        ) : (
          users.map((user) => (
          <div 
            key={user.id} 
            className="list-item" 
            data-testid="user-item"
          >
            <div 
              className="list-item-content"
              onClick={() => handleEdit(user)}
              style={{ cursor: 'pointer', flex: 1 }}
            >
              <div className="list-item-title">{user.name}</div>
              <div className="list-item-meta">
                {user.email} - {user.role}
              </div>
            </div>
            <div className="list-item-actions">
              <button 
                className="button button-secondary"
                data-testid="edit-user-button"
                onClick={() => handleEdit(user)}
              >
                Düzenle
              </button>
              <button 
                className="button button-danger"
                data-testid="delete-user-button"
                onClick={() => {
                  setUserToDelete(user)
                  setShowDeleteConfirm(true)
                }}
              >
                Sil
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Users

