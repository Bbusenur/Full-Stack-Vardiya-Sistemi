import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Shifts from './pages/Shifts'
import Users from './pages/Users'
import Departments from './pages/Departments'
import ShiftAssignments from './pages/ShiftAssignments'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '2rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Ana Sayfa</Link>
          <Link to="/shifts" style={{ marginRight: '1rem' }}>Vardiyalar</Link>
          <Link to="/users" style={{ marginRight: '1rem' }}>Kullanıcılar</Link>
          <Link to="/departments" style={{ marginRight: '1rem' }}>Departmanlar</Link>
          <Link to="/shift-assignments">Vardiya Atamaları</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/shift-assignments" element={<ShiftAssignments />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

