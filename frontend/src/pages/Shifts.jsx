import { useState, useEffect } from 'react'
import { shiftsApi, departmentsApi } from '../services/api'

function Shifts() {
  const [shifts, setShifts] = useState([])
  const [departments, setDepartments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
    department_id: '',
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadShifts()
    loadDepartments()
  }, [])

  const loadShifts = async () => {
    try {
      const response = await shiftsApi.getAll()
      setShifts(response.data)
    } catch (error) {
      console.error('Error loading shifts:', error)
    }
  }

  const loadDepartments = async () => {
    try {
      const response = await departmentsApi.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('Error loading departments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedShift) {
        await shiftsApi.update(selectedShift.id, formData)
        setMessage({ type: 'success', text: 'Vardiya başarıyla güncellendi' })
      } else {
        await shiftsApi.create(formData)
        setMessage({ type: 'success', text: 'Vardiya başarıyla oluşturuldu' })
      }
      setShowForm(false)
      setSelectedShift(null)
      setFormData({ date: '', start_time: '', end_time: '', department_id: '' })
      loadShifts()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.errors?.join(', ') || 'Bir hata oluştu' })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu vardiyayı silmek istediğinize emin misiniz?')) {
      try {
        await shiftsApi.delete(id)
        setMessage({ type: 'success', text: 'Vardiya başarıyla silindi' })
        loadShifts()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (error) {
        setMessage({ type: 'error', text: 'Silme işlemi başarısız oldu' })
      }
    }
  }

  const handleShiftClick = (shift) => {
    setSelectedShift(shift)
    setFormData({
      date: shift.date,
      start_time: shift.start_time.substring(0, 5),
      end_time: shift.end_time.substring(0, 5),
      department_id: shift.department?.id || '',
    })
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vardiyalar</h1>
      
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
        data-testid="create-shift-button"
        onClick={() => {
          setShowForm(!showForm)
          setSelectedShift(null)
          setFormData({ date: '', start_time: '', end_time: '', department_id: '' })
        }}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
      >
        {showForm ? 'Formu Kapat' : 'Yeni Vardiya Oluştur'}
      </button>

      {showForm && (
        <form data-testid="shift-form" onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Tarih: </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Başlangıç Saati: </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Bitiş Saati: </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Departman: </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              required
            >
              <option value="">Seçiniz</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" data-testid="submit-shift-button" style={{ padding: '0.5rem 1rem' }}>
            {selectedShift ? 'Güncelle' : 'Oluştur'}
          </button>
        </form>
      )}

      <div data-testid="shifts-list">
        {shifts.length === 0 ? (
          <p>Henüz vardiya bulunmamaktadır.</p>
        ) : (
          shifts.map((shift) => (
            <div
              key={shift.id}
              data-testid="shift-item"
              onClick={() => handleShiftClick(shift)}
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <h3>Tarih: {shift.date}</h3>
              <p>Saat: {shift.start_time?.substring(0, 5)} - {shift.end_time?.substring(0, 5)}</p>
              <p>Departman: {shift.department?.name}</p>
              <button
                data-testid="assign-user-button"
                onClick={(e) => {
                  e.stopPropagation()
                  // Bu buton shift-assignments sayfasında kullanılacak
                }}
                style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
              >
                Çalışan Ata
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(shift.id)
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

export default Shifts

