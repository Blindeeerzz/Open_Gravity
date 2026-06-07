import { CreditCard, Lock, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'corporate' | 'ultra' | null>(null);
  const [extraAgent, setExtraAgent] = useState<'edu' | 'jasmin' | 'chloe'>('chloe');
  const navigate = useNavigate();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  if (selectedPlan) {
    const planNames = { starter: 'Starter B2B', corporate: 'Corporate', ultra: 'Ultra Enterprise' };
    const planPrices = { starter: '599,00 €', corporate: '2.499,00 €', ultra: '4.999,00 €' };

    return (
      <div className="container flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '600px', width: '100%', background: 'rgba(20,20,30,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <CreditCard size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.5rem' }}>Pago Seguro - {planNames[selectedPlan]}</h2>
          </div>

          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Nombre en la tarjeta</label>
              <input type="text" placeholder="Empresa S.L." required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Número de Tarjeta</label>
              <input type="text" placeholder="0000 0000 0000 0000" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Fecha (MM/AA)</label>
                <input type="text" placeholder="12/28" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CVC</label>
                <input type="text" placeholder="123" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', color: 'white' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setSelectedPlan(null)} style={{ flex: 1, padding: '1.2rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                Volver
              </button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, display: 'flex', justifyContent: 'center', padding: '1.2rem' }}>
                {loading ? 'Procesando...' : `Pagar ${planPrices[selectedPlan]}`}
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <Lock size={12} /> Transacción encriptada por Stripe AES-256
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Suscripciones B2B</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Selecciona el nivel de autonomía y potencia cognitiva que tu infraestructura requiere.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Starter Plan */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Starter</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>599€<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mes</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', flexGrow: 1 }}>Perfecto para pymes que necesitan protección y automatización básica.</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Modelos Base (Llama/Mistral)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Aegis (Ciberseguridad) INCLUIDO</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> 200.000 Tokens/mes</li>
            <li style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Elige tu Agente Acompañante:</label>
              <div style={{ position: 'relative' }}>
                <select value={extraAgent} onChange={(e) => setExtraAgent(e.target.value as any)} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', color: 'white', borderRadius: '8px', appearance: 'none' }}>
                  <option value="chloe">Chloe (Contabilidad/Admin)</option>
                  <option value="edu">Edu (Ventas B2B)</option>
                  <option value="jasmin">Jasmin (Marketing IA)</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </li>
          </ul>
          
          <button className="btn-primary" onClick={() => setSelectedPlan('starter')} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--accent-cyan)' }}>Seleccionar Starter</button>
        </div>

        {/* Corporate Plan */}
        <div className="glass-panel animate-fade-in delay-1" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', borderColor: 'var(--accent-cyan)', background: 'rgba(0,243,255,0.02)' }}>
          <div style={{ background: 'var(--accent-cyan)', color: 'black', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: '1rem' }}>MÁS POPULAR</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Corporate</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>2.499€<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mes</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', flexGrow: 1 }}>Infraestructura Multi-Agente completa para empresas en expansión.</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Modelos Base (Llama/Mistral)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> <strong>Todos los 5 Agentes Incluidos</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> 1.000.000 Tokens/mes</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> 50 Auditorías Aegis</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> 200 Renders Jasmin</li>
          </ul>
          
          <button className="btn-primary" onClick={() => setSelectedPlan('corporate')} style={{ width: '100%', padding: '1rem' }}>Seleccionar Corporate</button>
        </div>

        {/* Ultra Plan */}
        <div className="glass-panel animate-fade-in delay-2" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Ultra Enterprise</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>4.999€<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mes</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', flexGrow: 1 }}>Modelos Premium y máxima capacidad cognitiva para corporaciones.</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="#ffaa00" /> <strong>Modelos Premium (GPT-4o, Claude 3.5)</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Todos los 5 Agentes Incluidos</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> 5.000.000 Tokens/mes</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Auditorías y Renders Ilimitados*</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Canal de Soporte Directo 24/7</li>
          </ul>
          
          <button className="btn-primary" onClick={() => setSelectedPlan('ultra')} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--border-light)' }}>Contactar Ventas</button>
        </div>

      </div>
    </div>
  );
}
