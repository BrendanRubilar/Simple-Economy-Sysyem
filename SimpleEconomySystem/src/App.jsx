import { Routes, Route, Link } from 'react-router-dom';
import MainPanel from './Views/AdminView/MainPanel.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <h1>Bienvenido a la aplicación</h1>
          <Link to="/admin">
            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Ir al Panel de Administración
            </button>
          </Link>
        </div>
      } />
      <Route path="/admin" element={<MainPanel />} />
    </Routes>
  );
}

export default App;