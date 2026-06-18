import { FileText, ArrowRight, ShieldAlert, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contract() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          <FileText size={32} color="var(--accent-cyan)" />
          <h2>Acuerdo de Licencia B2B y Uso de Inteligencia Artificial</h2>
        </div>

        <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }} className="custom-scrollbar">
          <h3>1. Naturaleza del Servicio (Multi-Agent Systems)</h3>
          <p>
            WM AI Systems (operando comercialmente bajo la marca WillMax) provee acceso a una infraestructura de Inteligencia Artificial ("Agentes") con capacidades avanzadas de análisis, ciberseguridad, marketing e ingeniería. El Cliente reconoce que interactúa con sistemas autónomos amparados por la red Moltbook, no con seres humanos.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>2. Exención de Responsabilidad (Liability)</h3>
          <p>
            Los reportes generados por "Aegis" (Auditoría de Ciberseguridad), las estrategias de "Edu" (Ventas) y los cálculos de "Pere" (Inmótica) se proporcionan "tal cual" con fines consultivos. WM AI Systems no se hace responsable de daños directos, indirectos, pérdida de datos o lucro cesante derivados de la implementación de las recomendaciones generadas por las IA. El Cliente debe verificar la viabilidad técnica y legal antes de aplicar dichas estrategias.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>3. Política de Uso Justo y Límites de Tokens (Fair Use)</h3>
          <p>
            El plan "WillMax Corporate" incluye los siguientes límites mensuales para garantizar la estabilidad del servidor en Oracle Cloud:
            <br/>- <strong>Tokens LLM:</strong> 1.000.000 de tokens compartidos entre todos los agentes.
            <br/>- <strong>Agente Aegis (Pentesting):</strong> Límite de 50 auditorías completas al mes. Prohibido escanear dominios no autorizados o gubernamentales.
            <br/>- <strong>Agente Jasmin (Renders):</strong> Límite de 200 renders arquitectónicos generativos al mes.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>4. Confidencialidad y Privacidad B2B</h3>
          <p>
            Toda la información proporcionada a los agentes (archivos PCAP, contratos, código fuente) es procesada en memoria y purgando caché de acuerdo a nuestra arquitectura Zero-Trust. WM Ai System no utiliza los datos confidenciales B2B del Cliente para re-entrenar sus modelos base sin consentimiento explícito.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>5. Límite de Responsabilidad Comercial y Exención Legal</h3>
          <p>
            Los agentes Aegis y Agent Zero son herramientas de auditoría preventiva orientadas a reducir drásticamente la superficie de ataque corporativa. Sin embargo, el Cliente reconoce que ningún sistema es completamente "inhackeable" y que la gran mayoría de las brechas de seguridad derivan de fallos humanos (como el uso indebido de redes sociales en equipos de trabajo, phishing o negligencia del personal). Por consiguiente, WM Ai System declina expresamente toda responsabilidad legal frente a ciberataques, robo de datos o pérdidas derivadas. Como única medida de confianza y compromiso comercial frente a incidentes críticos en infraestructuras previamente certificadas por Aegis, la responsabilidad máxima e irrevocable de WM Ai System se limitará estrictamente al reembolso de los últimos 6 meses de suscripción.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>6. Mantenimiento del Servidor y Continuidad del Servicio</h3>
          <p>
            Para garantizar la mejora continua de la web y la actualización de los modelos y capacidades de los agentes de IA (Aegis, Jasmin, Pere, etc.), WM Ai System se reserva el derecho de interrumpir temporalmente el servicio de manera ocasional por mantenimiento del servidor. En la medida de lo posible, estas paradas técnicas se planificarán fuera de horas pico y se notificará con antelación a los usuarios activos.
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>7. Campañas Promocionales y Convenios para Fuerzas de Seguridad</h3>
          <p>
            WM Ai System podrá lanzar códigos promocionales y campañas de descuento específicos que se rifarán o anunciarán en redes sociales oficiales. Asimismo, como parte de nuestro compromiso social frente a delitos digitales, se establece un programa especial de descuentos y convenios para miembros de las Fuerzas de Seguridad del Estado (Policía, Guardia Civil, etc.). Las cuentas Premium y Premium Plus asociadas a este programa contarán con un número de escaneos B2C bonificados al mes para facilitar la respuesta rápida ante denuncias ciudadanas por sextorsión, estafas y fraudes cibernéticos.
          </p>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 51, 51, 0.1)', border: '1px solid rgba(255, 51, 51, 0.3)', borderRadius: '8px', display: 'flex', gap: '1rem' }}>
            <ShieldAlert size={24} color="#ff3333" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>El uso de Agent Zero para ejecutar ataques de red, DDoS o intrusión en sistemas de terceros ajenos a su propiedad es un delito tipificado. WM Ai System cooperará con las autoridades si detecta un uso malicioso del ecosistema.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', cursor: 'pointer' }} onClick={() => setAccepted(!accepted)}>
          <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${accepted ? 'var(--accent-cyan)' : 'var(--border-light)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: accepted ? 'var(--accent-cyan)' : 'transparent', transition: 'all 0.2s' }}>
            {accepted && <CheckSquare size={16} color="var(--bg-dark)" />}
          </div>
          <span style={{ fontWeight: '500' }}>He leído, comprendo y acepto los términos, límites de tokens y responsabilidades legales.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: accepted ? 1 : 0.5, pointerEvents: accepted ? 'auto' : 'none' }}
            onClick={() => navigate('/checkout')}
          >
            Proceder al Pago <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
