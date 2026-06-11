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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { id: 'lilith', name: 'LILITH', role: 'CEO / Finanzas B2B', user: 'Mia_task_bot', desc: 'Inversión y Estrategia', color: '#d946ef' },
              { id: 'aegis', name: 'AEGIS', role: 'Ciberseguridad', user: 'Aegis_SecurityBot', desc: 'Pentesting y Agent Zero', color: '#ff3333' },
              { id: 'jasmin', name: 'JASMIN', role: 'Marketing IA', user: 'MarkAnim_Bot', desc: 'Estrategia 3D y SEO', color: '#06b6d4' },
              { id: 'edu', name: 'EDU', role: 'Ventas B2B', user: 'MarcoGonz_bot', desc: 'Persuasión y Negociación', color: '#3b82f6' },
              { id: 'lili', name: 'LILI', role: 'Inmobiliaria B2B', user: 'B_Raices_Bot', desc: 'Flipping y Rentabilidad', color: '#f59e0b' },
              { id: 'pere', name: 'PERE', role: 'Ing. Inmótica', user: 'PerePiri_bot', desc: 'Smart Buildings y Passivhaus', color: '#10b981' },
              { id: 'chloe', name: 'CHLOE', role: 'Asistente CFO', user: 'Chloeadmin_bot', desc: 'Contabilidad y Facturación', color: '#14b8a6' },
              { id: 'kendo', name: 'KENDO', role: 'Soporte Técnico', user: 'Kendo_asist_bot', desc: 'Configuración y Sistemas', color: '#a855f7' }
            ].map((agent) => (
              <a 
                key={agent.id}
                href={`https://t.me/${agent.user}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none' }}
              >
                <div 
                  style={{ 
                    background: `rgba(${parseInt(agent.color.slice(1,3), 16)}, ${parseInt(agent.color.slice(3,5), 16)}, ${parseInt(agent.color.slice(5,7), 16)}, 0.03)`, 
                    border: `1px solid rgba(${parseInt(agent.color.slice(1,3), 16)}, ${parseInt(agent.color.slice(3,5), 16)}, ${parseInt(agent.color.slice(5,7), 16)}, 0.15)`, 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    transition: 'all 0.2s ease',
                    height: '100%'
                  }} 
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = `rgba(${parseInt(agent.color.slice(1,3), 16)}, ${parseInt(agent.color.slice(3,5), 16)}, ${parseInt(agent.color.slice(5,7), 16)}, 0.08)`;
                    e.currentTarget.style.borderColor = agent.color;
                    e.currentTarget.style.boxShadow = `0 0 10px ${agent.color}30`;
                  }} 
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = `rgba(${parseInt(agent.color.slice(1,3), 16)}, ${parseInt(agent.color.slice(3,5), 16)}, ${parseInt(agent.color.slice(5,7), 16)}, 0.03)`;
                    e.currentTarget.style.borderColor = `rgba(${parseInt(agent.color.slice(1,3), 16)}, ${parseInt(agent.color.slice(3,5), 16)}, ${parseInt(agent.color.slice(5,7), 16)}, 0.15)`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <h4 style={{ color: agent.color, margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{agent.name}</h4>
                    <p style={{ color: 'var(--text-main)', margin: '0.2rem 0', fontSize: '0.8rem', fontWeight: 500 }}>{agent.role}</p>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.75rem' }}>{agent.desc}</p>
                  </div>
                  <ExternalLink size={16} color={agent.color} style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

