import { useState } from 'react';
import { Shield, Search, Lock, ShieldAlert, CheckCircle, Upload, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CitizenOsint() {
  const [targetInput, setTargetInput] = useState('');
  const [targetType, setTargetType] = useState('social');
  const [showPayment, setShowPayment] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  const handleSimulatePayment = () => {
    setShowPayment(false);
    setIsScanning(true);
    // Simulate a 4-second scan
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 4000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      {/* HEADER */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--glass-border)', background: 'rgba(3, 5, 16, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Shield size={24} className="text-accent" />
            <h2 style={{ fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
              WM <span className="text-accent" style={{ fontWeight: 300 }}>Protección B2C</span>
            </h2>
          </div>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            Volver a Corporativo
          </button>
        </div>
      </header>

      {/* HERO & SCANNER FORM */}
      <section className="section container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="grid-2">
          {/* Info Side */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255, 51, 51, 0.1)', border: '1px solid rgba(255, 51, 51, 0.3)', borderRadius: 20, marginBottom: '1.5rem', color: '#ff3333' }}>
              <ShieldAlert size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Auditoría OSINT Operada por Aegis</span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Verificación de <span style={{ color: '#ff3333', textShadow: '0 0 15px rgba(255, 51, 51, 0.5)' }}>Identidad</span> y Prevención de Riesgos.
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              ¿Sospechas de un perfil falso en redes, aplicaciones de citas o inversores de criptomonedas? Nuestro agente cibernético **Aegis** rastrea la web profunda, foros de brechas de datos y bases de imágenes para generar un **Reporte Táctico** detallado sobre cualquier objetivo.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <span>Búsqueda inversa de imágenes a nivel global.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <span>Rastreo de correos y teléfonos en brechas de datos.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <span>Protocolo de contención antiboicot y sextorsión.</span>
              </li>
            </ul>
          </div>

          {/* Scanner Side */}
          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', borderTop: '4px solid #ff3333', boxShadow: '0 10px 40px rgba(255, 51, 51, 0.1)' }}>
              
              {!isScanning && !scanComplete && (
                <>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Iniciar Investigación</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Reporte Táctico Privado: <strong>49.99 €</strong></p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px' }}>
                    <button onClick={() => setTargetType('social')} style={{ flex: 1, padding: '0.5rem', background: targetType === 'social' ? 'var(--glass-bg)' : 'transparent', color: targetType === 'social' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>@ Usuario</button>
                    <button onClick={() => setTargetType('email')} style={{ flex: 1, padding: '0.5rem', background: targetType === 'email' ? 'var(--glass-bg)' : 'transparent', color: targetType === 'email' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Email</button>
                    <button onClick={() => setTargetType('phone')} style={{ flex: 1, padding: '0.5rem', background: targetType === 'phone' ? 'var(--glass-bg)' : 'transparent', color: targetType === 'phone' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Teléfono</button>
                  </div>

                  {targetType === 'image' ? (
                    <div style={{ border: '2px dashed var(--glass-border)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem' }}>
                      <Upload size={32} className="text-accent" style={{ margin: '0 auto 1rem' }} />
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Haz clic para subir fotografía del sospechoso.</p>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <input 
                        type="text" 
                        placeholder={targetType === 'social' ? "Ej: @perfil_sospechoso" : targetType === 'email' ? "correo@ejemplo.com" : "+34 600 000 000"} 
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <button onClick={() => setTargetType(targetType === 'image' ? 'social' : 'image')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                      {targetType === 'image' ? 'Usar texto en su lugar' : 'Prefiero subir una foto'}
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowPayment(true)} 
                    disabled={targetType !== 'image' && !targetInput}
                    style={{ width: '100%', padding: '1rem', background: (targetType === 'image' || targetInput) ? '#ff3333' : 'var(--glass-border)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: (targetType === 'image' || targetInput) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.3s' }}
                  >
                    <Search size={18} /> Proceder al Pago (49.99 €)
                  </button>
                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}><Lock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Pasarela cifrada por Stripe.</p>
                </>
              )}

              {isScanning && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#ff3333', borderRightColor: '#ff3333', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff3333' }}>Aegis está analizando...</h3>
                  <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    <p className="typing-text">{">"} Conectando con bases de datos públicas...</p>
                    <p className="typing-text" style={{ animationDelay: '1s' }}>{">"} Extrayendo huella digital del objetivo...</p>
                    <p className="typing-text" style={{ animationDelay: '2s' }}>{">"} Cruzando datos con foros Dark Web...</p>
                    <p className="typing-text" style={{ animationDelay: '3s' }}>{">"} Compilando Reporte Táctico...</p>
                  </div>
                </div>
              )}

              {scanComplete && (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={40} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Investigación Completada</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Aegis ha terminado el análisis OSINT del objetivo. Se ha generado un PDF de 8 páginas con los hallazgos y el protocolo de contención recomendado.</p>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                    <AlertTriangle color="#f59e0b" />
                    <div>
                      <p style={{ fontSize: '0.9rem', margin: 0 }}><strong>Nivel de Riesgo: Medio/Alto</strong></p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Se encontraron 3 coincidencias en foros externos.</p>
                    </div>
                  </div>

                  <button className="btn-solid" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#ff3333', color: '#fff' }}>
                    Descargar Reporte PDF <ArrowRight size={18} />
                  </button>
                  <button onClick={() => { setScanComplete(false); setTargetInput(''); }} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Realizar otra consulta</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>&copy; 2026 WM Ai System - División B2C. Todos los derechos reservados. <br/>Aviso legal: Los datos proporcionados son recopilados de fuentes públicas de acceso abierto (OSINT).</p>
      </footer>

      {/* PAYMENT MODAL (Simulated) */}
      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-dark)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Simulación de Pago</h3>
              <button onClick={() => setShowPayment(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              En producción, esto redirigirá a Stripe Checkout para cobrar los <strong>49.99€</strong> de forma segura.
            </p>
            <button onClick={handleSimulatePayment} style={{ width: '100%', padding: '1rem', background: '#ff3333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Simular Pago Exitoso
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for this page's animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .typing-text {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid transparent;
          margin: 0.5rem 0;
          opacity: 0;
          animation: typing 1s steps(40, end) forwards;
        }
        @keyframes typing {
          from { width: 0; opacity: 1; }
          to { width: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default CitizenOsint;
