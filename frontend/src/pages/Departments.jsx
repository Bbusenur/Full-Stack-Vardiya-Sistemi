import { useState, useEffect } from 'react'
import { departmentsAPI } from '../services/api'

function Departments() {
  const [departments, setDepartments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('Departmanlar yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    
    try {
      if (editingDepartment) {
        await departmentsAPI.update(editingDepartment.id, formData)
        setMessage({ type: 'success', text: 'Departman başarıyla güncellendi' })
      } else {
        await departmentsAPI.create(formData)
        setMessage({ type: 'success', text: 'Departman başarıyla oluşturuldu' })
      }
      // Önce modal'ı kapat
      setShowForm(false)
      setEditingDepartment(null)
      setFormData({ name: '', description: '' })
      // Sonra departmanları yükle
      await loadDepartments()
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Bir hata oluştu'
      setMessage({ type: 'error', text: errorMsg })
    }
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu departmanı silmek istediğinize emin misiniz?')) {
      try {
        await departmentsAPI.delete(id)
        setMessage({ type: 'success', text: 'Departman başarıyla silindi' })
        loadDepartments()
      } catch (error) {
        setMessage({ type: 'error', text: 'Silme işlemi başarısız oldu' })
      }
    }
  }

  return (
    <div style={{ color: '#2c3e50' }}>
      <div className="page-header">
        <h1 className="page-title">Departman Yönetimi</h1>
        <button 
          className="button" 
          data-testid="create-department-button"
          onClick={() => {
            setShowForm(true)
            setEditingDepartment(null)
            setFormData({ name: '', description: '' })
          }}
        >
          Yeni Departman
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

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingDepartment ? 'Departman Düzenle' : 'Yeni Departman'}</h2>
              <button className="modal-close" onClick={() => {
                setShowForm(false)
                setEditingDepartment(null)
                setFormData({ name: '', description: '' })
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Departman Adı</label>
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
                <label className="form-label">Açıklama</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="button button-secondary" onClick={() => {
                  setShowForm(false)
                  setEditingDepartment(null)
                  setFormData({ name: '', description: '' })
                }}>
                  İptal
                </button>
                <button type="submit" className="button" data-testid="submit-department-button">
                  {editingDepartment ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="list" data-testid="departments-list" style={{ color: '#2c3e50' }}>
        {departments.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
            Henüz departman bulunmamaktadır.
          </div>
        ) : (
          departments.map((department) => (
          <div key={department.id} className="list-item" data-testid="department-item">
            <div className="list-item-content">
              <div className="list-item-title">{department.name}</div>
              <div className="list-item-meta">{department.description || 'Açıklama yok'}</div>
            </div>
            <div className="list-item-actions">
              <button 
                className="button button-secondary"
                onClick={() => handleEdit(department)}
              >
                Düzenle
              </button>
              <button 
                className="button button-danger"
                onClick={() => handleDelete(department.id)}
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

export default Departments

