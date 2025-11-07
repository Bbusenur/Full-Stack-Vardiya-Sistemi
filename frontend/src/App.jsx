import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Shifts from './pages/Shifts'
import Users from './pages/Users'
import Departments from './pages/Departments'
import ShiftAssignments from './pages/ShiftAssignments'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar" data-testid="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            Vardiya Yönetim Sistemi
          </Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Ana Sayfa</Link></li>
            <li><Link to="/shifts" className="nav-link">Vardiyalar</Link></li>
            <li><Link to="/users" className="nav-link">Kullanıcılar</Link></li>
            <li><Link to="/departments" className="nav-link">Departmanlar</Link></li>
            <li><Link to="/shift-assignments" className="nav-link">Vardiya Atamaları</Link></li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/shift-assignments" element={<ShiftAssignments />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

