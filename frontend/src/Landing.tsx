import './Landing.css';

interface LandingProps {
  onEnterChat: () => void;
}

function Landing({ onEnterChat }: LandingProps) {
  // Datos de los 5 agentes
  const agents = [
    {
      id: 'lilith',
      name: 'Lilith',
      role: 'CEO & Directora de Trading',
      description: 'Lidera la agencia ejecutando análisis financiero e inversión en milisegundos con control total del sistema.',
      icon: '👑',
      accent: '#8a2be2'
    },
    {
      id: 'lili',
      name: 'Lili',
      role: 'VP Real Estate',
      description: 'Tasación de propiedades, captación de inmuebles premium y estrategias analíticas de house flipping.',
      icon: '🏡',
      accent: '#ff007f'
    },
    {
      id: 'jasmin',
      name: 'Jasmin',
      role: 'Productora 3D & Marketing',
      description: 'Diseño de campañas altamente persuasivas, modelado y estrategias SEO rompedoras.',
      icon: '📢',
      accent: '#00ff88'
    },
    {
      id: 'pere',
      name: 'Pere',
      role: 'Inspector de Calidad',
      description: 'Normativa arquitectónica, ISO de resistencia y estrictos check-lists de seguridad civil.',
      icon: '🏗️',
      accent: '#ff8c00'
    },
    {
      id: 'edu',
      name: 'Edu',
      role: 'Consultor Psicológico',
      description: 'Asistencia y diseño motriz enfocado a psicología infantil, TDAH y capacidades especiales.',
      icon: '🎓',
      accent: '#00bfff'
    }
  ];

  return (
    <div className="landing-container">
      {/* Background Decorators */}
      <div className="bg-glow purple-glow"></div>
      <div className="bg-glow pink-glow"></div>

      <header className="landing-header">
        <h1 className="main-title">HECATE SERVEIS</h1>
        <p className="subtitle">El Futuro de la Agencia Corporativa Autónoma.</p>
        <p className="description">
          Integramos un comité ejecutivo de Inteligencia Artificial 24/7 capaz de gestionar activos inmobiliarios, auditar el mercado bursátil, ejecutar campañas masivas y velar por la estructura arquitectónica y psicosocial de tus proyectos.
        </p>
        
        <button className="cta-button pulse-effect" onClick={onEnterChat}>
          Acceder al Lobby Central
        </button>
      </header>

      <section className="agents-grid">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-icon" style={{ boxShadow: `0 0 20px ${agent.accent}40` }}>
              {agent.icon}
            </div>
            <h2 className="agent-name" style={{ color: agent.accent }}>{agent.name}</h2>
            <h3 className="agent-role">{agent.role}</h3>
            <p className="agent-description">{agent.description}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        © 2026 Hecate Serveis - Sistemas Neurales Operativos
      </footer>
    </div>
  );
}

export default Landing;
