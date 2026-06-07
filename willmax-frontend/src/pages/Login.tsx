import { Lock, ArrowRight, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'WILLMAX2026') {
      navigate('/contract');
    } else {
      setError('Código de acceso denegado. Contacte al administrador.');
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(0, 243, 255, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--accent-cyan)' }}>
            <Lock size={32} color="var(--accent-cyan)" />
          </div>
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Portal Autorizado</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Introduzca su llave criptográfica para acceder a la red B2B de WillMax.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input 
              type="password" 
              placeholder="Código de Acceso" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                border: error ? '1px solid #ff3333' : '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.3s'
              }}
            />
            {error && <p style={{ color: '#ff3333', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'left' }}>{error}</p>}
          </div>
          <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            Autenticar <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Shield size={14} /> Conexión Cifrada P2P
        </div>
      </div>
    </div>
  );
}
