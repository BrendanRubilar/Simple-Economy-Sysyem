import { Routes, Route } from 'react-router-dom';
import MainPanel from './Views/MainPanel/MainPanel.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPanel />} />
    </Routes>
  );
}

export default App;