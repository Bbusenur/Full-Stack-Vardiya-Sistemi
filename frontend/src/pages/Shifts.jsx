import { useState, useEffect } from 'react'
import { shiftsAPI, departmentsAPI, shiftAssignmentsAPI, usersAPI } from '../services/api'

function Shifts() {
  const [shifts, setShifts] = useState([])
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
    department_id: ''
  })
  const [assignmentData, setAssignmentData] = useState({
    user_id: '',
    shift_id: '',
    status: 'pending'
  })

  useEffect(() => {
    loadShifts()
    loadDepartments()
    loadUsers()
  }, [])

  const loadShifts = async () => {
    try {
      const response = await shiftsAPI.getAll()
      setShifts(response.data)
    } catch (error) {
      console.error('Vardiyalar yüklenirken hata:', error)
    }
  }

  const loadDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('Departmanlar yüklenirken hata:', error)
    }
  }

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
    
    try {
      await shiftsAPI.create({
        ...formData,
        department_id: parseInt(formData.department_id)
      })
      setMessage({ type: 'success', text: 'Vardiya başarıyla oluşturuldu' })
      // Önce modal'ı kapat
      setShowForm(false)
      setFormData({ date: '', start_time: '', end_time: '', department_id: '' })
      // Sonra vardiyaları yükle
      await loadShifts()
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Bir hata oluştu'
      setMessage({ type: 'error', text: errorMsg })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu vardiyayı silmek istediğinize emin misiniz?')) {
      try {
        await shiftsAPI.delete(id)
        setMessage({ type: 'success', text: 'Vardiya başarıyla silindi' })
        loadShifts()
      } catch (error) {
        setMessage({ type: 'error', text: 'Silme işlemi başarısız oldu' })
      }
    }
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    
    // Validasyon
    if (!assignmentData.user_id || !assignmentData.shift_id) {
      setMessage({ type: 'error', text: 'Lütfen kullanıcı ve vardiya seçiniz' })
      return
    }
    
    try {
      const response = await shiftAssignmentsAPI.create({
        ...assignmentData,
        user_id: parseInt(assignmentData.user_id),
        shift_id: parseInt(assignmentData.shift_id)
      })
      console.log('Assignment created successfully:', response.data)
      // Önce modal'ı kapat
      setShowAssignmentForm(false)
      setAssignmentData({ user_id: '', shift_id: '', status: 'pending' })
      setSelectedShift(null)
      // Sonra mesajı göster ve vardiyaları yükle
      setMessage({ type: 'success', text: 'Vardiya ataması başarıyla oluşturuldu' })
      await loadShifts()
    } catch (error) {
      console.error('Assignment create error:', error.response?.data)
      const errors = error.response?.data?.errors || []
      const errorMsg = Array.isArray(errors) ? errors.join(', ') : (error.response?.data?.error || 'Bir hata oluştu')
      setMessage({ type: 'error', text: errorMsg })
    }
  }

  return (
    <div style={{ color: '#2c3e50' }}>
      <div className="page-header">
        <h1 className="page-title">Vardiya Yönetimi</h1>
        <button 
          className="button" 
          data-testid="create-shift-button"
          onClick={() => setShowForm(true)}
        >
          Yeni Vardiya
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
              <h2 className="modal-title">Yeni Vardiya</h2>
              <button className="modal-close" onClick={() => {
                setShowForm(false)
                setFormData({ date: '', start_time: '', end_time: '', department_id: '' })
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit} data-testid="shift-form">
              <div className="form-group">
                <label className="form-label">Tarih</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Başlangıç Saati</label>
                <input
                  type="time"
                  name="start_time"
                  className="form-input"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bitiş Saati</label>
                <input
                  type="time"
                  name="end_time"
                  className="form-input"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Departman</label>
                <select
                  name="department_id"
                  className="form-select"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  required
                >
                  <option value="">Seçiniz</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={String(dept.id)}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="button button-secondary" onClick={() => {
                  setShowForm(false)
                  setFormData({ date: '', start_time: '', end_time: '', department_id: '' })
                }}>
                  İptal
                </button>
                <button type="submit" className="button" data-testid="submit-shift-button">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignmentForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Vardiya Ataması</h2>
              <button className="modal-close" onClick={() => {
                setShowAssignmentForm(false)
                setAssignmentData({ user_id: '', shift_id: '', status: 'pending' })
              }}>×</button>
            </div>
            <form onSubmit={handleAssignSubmit} data-testid="assignment-form">
              <div className="form-group">
                <label className="form-label">Kullanıcı</label>
                <select
                  name="user_id"
                  className="form-select"
                  value={assignmentData.user_id}
                  onChange={(e) => setAssignmentData({ ...assignmentData, user_id: e.target.value })}
                  required
                >
                  <option value="">Seçiniz</option>
                  {users.map((user) => (
                    <option key={user.id} value={String(user.id)}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vardiya</label>
                <select
                  name="shift_id"
                  className="form-select"
                  value={assignmentData.shift_id}
                  onChange={(e) => setAssignmentData({ ...assignmentData, shift_id: e.target.value })}
                  required
                >
                  <option value="">Seçiniz</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={String(shift.id)}>
                      {shift.date} - {shift.start_time} / {shift.end_time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Durum</label>
                <select
                  name="status"
                  className="form-select"
                  value={assignmentData.status}
                  onChange={(e) => setAssignmentData({ ...assignmentData, status: e.target.value })}
                  required
                >
                  <option value="pending">Beklemede</option>
                  <option value="confirmed">Onaylandı</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="button button-secondary" onClick={() => {
                  setShowAssignmentForm(false)
                  setAssignmentData({ user_id: '', shift_id: '', status: 'pending' })
                }}>
                  İptal
                </button>
                <button type="submit" className="button" data-testid="submit-assignment-button">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="list" data-testid="shifts-list" style={{ color: '#2c3e50' }}>
        {shifts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
            Henüz vardiya bulunmamaktadır.
          </div>
        ) : (
          shifts.map((shift) => (
          <div key={shift.id} className="list-item" data-testid="shift-item">
            <div className="list-item-content">
              <div className="list-item-title">
                {shift.date} - {shift.start_time} / {shift.end_time}
              </div>
              <div className="list-item-meta">
                Departman: {shift.department?.name || 'N/A'}
              </div>
            </div>
            <div className="list-item-actions">
              <button 
                className="button"
                data-testid="assign-user-button"
                onClick={() => {
                  setSelectedShift(shift)
                  setAssignmentData({ ...assignmentData, shift_id: String(shift.id) })
                  setShowAssignmentForm(true)
                }}
              >
                Çalışan Ata
              </button>
              <button 
                className="button button-danger"
                onClick={() => handleDelete(shift.id)}
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

export default Shifts

