import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Contract from './pages/Contract';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import CitizenOsint from './pages/CitizenOsint';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/osint-ciudadano" element={<CitizenOsint />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
