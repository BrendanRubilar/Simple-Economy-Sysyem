import { Routes, Route } from 'react-router-dom';
import MainPanel from './Views/AdminView/MainPanel.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Bienvenido a la aplicación</h1>} />
      <Route path="/admin" element={<MainPanel />} />
    </Routes>
  );
}

export default App;