import { ShieldCheck, Server, Key, ExternalLink, Activity } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  // Dummy token for the mockup. In production, this comes from the backend after payment.
  const authCode = "WLLMX-90X-2026-B2B";

  const copyToken = () => {
    navigator.clipboard.writeText(authCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity color="var(--accent-cyan)" />
          <h2>Command Center</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 255, 100, 0.1)', color: '#00ff64', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}>
            <Server size={14} /> Servidor Oracle (Conectado)
          </div>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        
        {/* Token Area */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Key color="var(--accent-cyan)" />
            <h3 style={{ margin: 0 }}>Llave Criptográfica B2B</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Este token único autentica tu identidad frente a los Agentes. Cópialo e introdúcelo al abrir Telegram.
          </p>
          
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px', color: 'var(--accent-cyan)' }}>{authCode}</span>
            <button onClick={copyToken} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              {copied ? '¡Copiado!' : 'Copiar Token'}
            </button>
          </div>
        </div>

        {/* Access Links */}
        <div className="glass-panel animate-fade-in delay-1" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="var(--accent-cyan)" /> Enlaces de Despliegue Directo
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Aegis Link */}
            <a href="https://t.me/Aegis_Security_Bot" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(255,51,51,0.05)', border: '1px solid rgba(255,51,51,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,51,51,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,51,51,0.05)'}>
                <div>
                  <h4 style={{ color: '#ff3333', margin: 0 }}>AEGIS (Ciberseguridad)</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Pentesting y Agent Zero</p>
                </div>
                <ExternalLink color="#ff3333" />
              </div>
            </a>

            {/* Edu Link */}
            <a href="https://t.me/Edu_Ventas_Bot" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,243,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,243,255,0.05)'}>
                <div>
                  <h4 style={{ color: 'var(--accent-cyan)', margin: 0 }}>EDU (Ventas y Estrategia)</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Psicología de Negociación</p>
                </div>
                <ExternalLink color="var(--accent-cyan)" />
              </div>
            </a>
            
            {/* Jasmin Link */}
            <a href="https://t.me/Jasmin_Marketing_Bot" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,243,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,243,255,0.05)'}>
                <div>
                  <h4 style={{ color: 'var(--accent-cyan)', margin: 0 }}>JASMIN (Marketing IA)</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Estrategia 3D y SEO</p>
                </div>
                <ExternalLink color="var(--accent-cyan)" />
              </div>
            </a>

            {/* Pere Link */}
            <a href="https://t.me/Pere_Arquitectura_Bot" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,243,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,243,255,0.05)'}>
                <div>
                  <h4 style={{ color: 'var(--accent-cyan)', margin: 0 }}>PERE (Ingeniería Inmótica)</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Smart Buildings y ROI</p>
                </div>
                <ExternalLink color="var(--accent-cyan)" />
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
