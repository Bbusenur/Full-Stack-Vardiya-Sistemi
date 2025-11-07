import { useState, useEffect } from 'react'
import { shiftAssignmentsAPI } from '../services/api'

function ShiftAssignments() {
  const [assignments, setAssignments] = useState([])
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [message, setMessage] = useState(null)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: 'pending'
  })

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      const response = await shiftAssignmentsAPI.getAll()
      setAssignments(response.data)
    } catch (error) {
      console.error('Vardiya atamaları yüklenirken hata:', error)
    }
  }

  const handleUpdateStatus = (assignment) => {
    setEditingAssignment(assignment)
    setUpdateData({ status: assignment.status })
    setShowUpdateForm(true)
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    
    try {
      await shiftAssignmentsAPI.update(editingAssignment.id, updateData)
      setMessage({ type: 'success', text: 'Durum başarıyla güncellendi' })
      // Önce modal'ı kapat
      setShowUpdateForm(false)
      setEditingAssignment(null)
      setUpdateData({ status: 'pending' })
      // Sonra atamaları yükle
      await loadAssignments()
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Bir hata oluştu'
      setMessage({ type: 'error', text: errorMsg })
    }
  }

  return (
    <div style={{ color: '#2c3e50' }}>
      <div className="page-header">
        <h1 className="page-title">Vardiya Atamaları</h1>
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

      {showUpdateForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Durum Güncelle</h2>
              <button className="modal-close" onClick={() => {
                setShowUpdateForm(false)
                setEditingAssignment(null)
                setUpdateData({ status: 'pending' })
              }}>×</button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label className="form-label">Durum</label>
                <select
                  name="status"
                  className="form-select"
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ status: e.target.value })}
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
                  setShowUpdateForm(false)
                  setEditingAssignment(null)
                  setUpdateData({ status: 'pending' })
                }}>
                  İptal
                </button>
                <button type="submit" className="button" data-testid="submit-update-button">
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="list" data-testid="assignments-list" style={{ minHeight: assignments.length === 0 ? '50px' : 'auto', color: '#2c3e50' }}>
        {assignments.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
            Henüz vardiya ataması bulunmamaktadır.
          </div>
        ) : (
          assignments.map((assignment) => (
          <div key={assignment.id} className="list-item" data-testid="assignment-item">
            <div className="list-item-content">
              <div className="list-item-title">
                {assignment.user?.name} - {assignment.shift?.date}
              </div>
              <div className="list-item-meta">
                Vardiya: {assignment.shift?.start_time} / {assignment.shift?.end_time} | 
                Durum: {assignment.status} | 
                Departman: {assignment.shift?.department?.name}
              </div>
            </div>
            <div className="list-item-actions">
              <button 
                className="button"
                data-testid="update-status-button"
                onClick={() => handleUpdateStatus(assignment)}
              >
                Durum Güncelle
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ShiftAssignments

