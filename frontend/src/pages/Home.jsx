import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ color: '#2c3e50' }}>
      <h1 data-testid="home-title" style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '1rem' }}>Vardiya Yönetim Sistemi</h1>
      <p style={{ color: '#2c3e50', fontSize: '1.1rem', marginBottom: '2rem' }}>Vardiya yönetim sistemine hoş geldiniz. Sistem özelliklerine erişmek için menüyü kullanın.</p>
      
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#2c3e50' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Vardiyalar</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>Vardiyaları görüntüleyin ve yönetin</p>
          <Link to="/shifts" className="button">Vardiyalara Git</Link>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#2c3e50' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Kullanıcılar</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>Kullanıcıları görüntüleyin ve yönetin</p>
          <Link to="/users" className="button">Kullanıcılara Git</Link>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#2c3e50' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Departmanlar</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>Departmanları görüntüleyin ve yönetin</p>
          <Link to="/departments" className="button">Departmanlara Git</Link>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#2c3e50' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Vardiya Atamaları</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>Vardiya atamalarını görüntüleyin ve yönetin</p>
          <Link to="/shift-assignments" className="button">Atamalara Git</Link>
        </div>
      </div>
    </div>
  )
}

export default Home

