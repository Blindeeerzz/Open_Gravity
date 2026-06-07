import { useState } from 'react';
import { Bot, Shield, Zap, ChevronRight, Lock, Globe, Network, X, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const translations = {
  es: {
    navAgents: "Nuestros Agentes",
    navSecurity: "Seguridad B2B",
    navAudit: "Auditoría Gratuita",
    heroBadge1: "Operando desde Andorra",
    heroBadge2: "Powered by Moltbook™",
    heroTitle1: "Ecosistema Neuronal",
    heroTitle2: "Multi-Agente.",
    heroSubtitle: "Delegación absoluta 24/7.",
    heroDesc: "Un comité ejecutivo de Inteligencia Artificial operando de forma autónoma. Desde ciberseguridad hasta ventas corporativas, trabajando en perfecta sincronía.",
    heroBtn1: "Agendar Demostración",
    heroBtn2: "Ver el Dossier Tecnológico",
    agentStatus: "En Línea",
    trustTitle: "Infraestructura Tecnológica Premium",
    agentsTitle1: "Conoce a tu",
    agentsTitle2: "Directiva Autónoma",
    agentsDesc: "Nuestros agentes no son simples scripts. Poseen memoria a largo plazo, herramientas específicas y se comunican entre ellos a través de nuestra red neuronal interna: El Moltbook.",
    roles: {
      aegis: "CISO / Ciberseguridad",
      jasmin: "CMO / Marketing",
      edu: "CTO / Soporte",
      pere: "CSO / Ventas B2B",
      chloe: "CFO / Asistente Virtual"
    },
    descs: {
      aegis: "Vigilancia 24/7. Pentesting continuo, análisis de tráfico y reportes estándar Bug Bounty.",
      jasmin: "Diseño de campañas, captación de leads y análisis de mercado en tiempo real.",
      edu: "Atención al cliente técnica, manuales y resolución de incidencias en Nivel 1 y 2.",
      pere: "Calificación de prospectos y cierre de operaciones de alto valor inmobiliario y B2B.",
      chloe: "Gestión de contabilidad, facturación automatizada y atención administrativa impecable."
    },
    secTitle1: "Seguridad Grado",
    secTitle2: "Militar",
    secDesc: "En WillMax, sabemos que los datos de tu empresa son tu mayor activo. Por eso, hemos diseñado una arquitectura de 'Muro de Hierro'.",
    secFeat1: "Entornos Aislados (Sandbox)",
    secFeat1Desc: "Tus datos no entrenan IAs públicas. Todo se procesa en servidores cerrados bajo tu jurisdicción.",
    secFeat2: "Vigilancia Autónoma Continua",
    secFeat2Desc: "Nuestro agente Aegis patrulla tus sistemas 24/7 reportando brechas antes de que sean explotadas.",
    auditTitle: "Auditoría Gratuita",
    auditDesc: "Déjanos tu dominio y Aegis generará un reporte de vulnerabilidades gratuito en 5 minutos.",
    auditBtn: "Solicitar Reporte a Aegis",
    footerDesc: "Operando desde Andorra. Revolucionando el mundo B2B.",
    footerTerms: "Términos de Servicio",
    footerPrivacy: "Política de Privacidad",
    footerContact: "Contacto",
    footerMoltbook: "AVALADO POR MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Todos los derechos reservados."
  },
  en: {
    navAgents: "Our Agents",
    navSecurity: "B2B Security",
    navAudit: "Free Audit",
    heroBadge1: "Operating from Andorra",
    heroBadge2: "Powered by Moltbook™",
    heroTitle1: "Multi-Agent Neural",
    heroTitle2: "Ecosystem.",
    heroSubtitle: "Absolute delegation 24/7.",
    heroDesc: "An autonomous Artificial Intelligence executive committee. From cybersecurity to corporate sales, working in perfect synchrony.",
    heroBtn1: "Schedule Demo",
    heroBtn2: "View Tech Dossier",
    agentStatus: "Online",
    trustTitle: "Premium Tech Infrastructure",
    agentsTitle1: "Meet your",
    agentsTitle2: "Autonomous Board",
    agentsDesc: "Our agents aren't simple scripts. They possess long-term memory, specialized tools, and communicate via our internal neural network: The Moltbook.",
    roles: {
      aegis: "CISO / Cybersecurity",
      jasmin: "CMO / Marketing",
      edu: "CTO / Support",
      pere: "CSO / B2B Sales",
      chloe: "CFO / Virtual Assistant"
    },
    descs: {
      aegis: "24/7 surveillance. Continuous pentesting, traffic analysis, and Bug Bounty standard reports.",
      jasmin: "Campaign design, lead generation, and real-time market analysis.",
      edu: "Technical customer support, manuals, and Level 1/2 incident resolution.",
      pere: "Lead qualification and high-value real estate / B2B deal closing.",
      chloe: "Accounting management, automated invoicing, and impeccable administrative care."
    },
    secTitle1: "Military Grade",
    secTitle2: "Security",
    secDesc: "At WillMax, we know your corporate data is your biggest asset. That's why we designed an 'Iron Wall' architecture.",
    secFeat1: "Isolated Environments (Sandbox)",
    secFeat1Desc: "Your data doesn't train public AIs. Everything is processed on closed servers under your jurisdiction.",
    secFeat2: "Continuous Autonomous Surveillance",
    secFeat2Desc: "Our Aegis agent patrols your systems 24/7, reporting breaches before they are exploited.",
    auditTitle: "Free Audit",
    auditDesc: "Leave us your domain and Aegis will generate a free vulnerability report in 5 minutes.",
    auditBtn: "Request Report from Aegis",
    footerDesc: "Operating from Andorra. Revolutionizing the B2B world.",
    footerTerms: "Terms of Service",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact",
    footerMoltbook: "POWERED BY MOLTBOOK NEURAL PROTOCOL",
    footerRights: "All rights reserved."
  },
  pt: {
    navAgents: "Nossos Agentes",
    navSecurity: "Segurança B2B",
    navAudit: "Auditoria Gratuita",
    heroBadge1: "Operando de Andorra",
    heroBadge2: "Desenvolvido por Moltbook™",
    heroTitle1: "Ecossistema Neural",
    heroTitle2: "Multi-Agente.",
    heroSubtitle: "Delegação absoluta 24/7.",
    heroDesc: "Um comitê executivo de Inteligência Artificial operando de forma autônoma. Da segurança cibernética às vendas corporativas, trabalhando em perfeita sincronia.",
    heroBtn1: "Agendar Demonstração",
    heroBtn2: "Ver o Dossiê Tecnológico",
    agentStatus: "Online",
    trustTitle: "Infraestrutura Tecnológica Premium",
    agentsTitle1: "Conheça sua",
    agentsTitle2: "Diretoria Autônoma",
    agentsDesc: "Nossos agentes não são simples scripts. Possuem memória de longo prazo, ferramentas específicas e se comunicam através de nossa rede neural interna: O Moltbook.",
    roles: {
      aegis: "CISO / Segurança Cibernética",
      jasmin: "CMO / Marketing",
      edu: "CTO / Suporte",
      pere: "CSO / Vendas B2B",
      chloe: "CFO / Assistente Virtual"
    },
    descs: {
      aegis: "Vigilância 24/7. Pentesting contínuo, análise de tráfego e relatórios padrão Bug Bounty.",
      jasmin: "Design de campanhas, captação de leads e análise de mercado em tempo real.",
      edu: "Suporte técnico ao cliente, manuais e resolução de incidentes Nível 1 e 2.",
      pere: "Qualificação de prospects e fechamento de operações de alto valor imobiliário e B2B.",
      chloe: "Gestão contábil, faturamento automatizado e atendimento administrativo impecável."
    },
    secTitle1: "Segurança de Grau",
    secTitle2: "Militar",
    secDesc: "Na WillMax, sabemos que os dados de sua empresa são o seu maior ativo. Por isso, projetamos uma arquitetura de 'Muro de Ferro'.",
    secFeat1: "Ambientes Isolados (Sandbox)",
    secFeat1Desc: "Seus dados não treinam IAs públicas. Tudo é processado em servidores fechados sob sua jurisdição.",
    secFeat2: "Vigilância Autônoma Contínua",
    secFeat2Desc: "Nosso agente Aegis patrulha seus sistemas 24/7, relatando falhas antes de serem exploradas.",
    auditTitle: "Auditoria Gratuita",
    auditDesc: "Deixe seu domínio e Aegis gerará um relatório de vulnerabilidade gratuito em 5 minutos.",
    auditBtn: "Solicitar Relatório à Aegis",
    footerDesc: "Operando de Andorra. Revolucionando o mundo B2B.",
    footerTerms: "Termos de Serviço",
    footerPrivacy: "Política de Privacidade",
    footerContact: "Contato",
    footerMoltbook: "APOIADO POR MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Todos os direitos reservados."
  }
};

type LangKey = keyof typeof translations;

function Home() {
  const [lang, setLang] = useState<LangKey>('es');
  const t = translations[lang] || translations['es'];
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, background: 'rgba(3, 5, 16, 0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <Bot size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              WM <span className="text-accent" style={{ fontWeight: 300 }}>Ai System</span>
            </h2>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#agents" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{t.navAgents}</a>
            <a href="#security" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{t.navSecurity}</a>
            <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{t.navAudit}</button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
              <Globe size={16} className="text-accent" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as LangKey)} 
                style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <option value="es" style={{ color: '#000' }}>ES</option>
                <option value="en" style={{ color: '#000' }}>EN</option>
                <option value="pt" style={{ color: '#000' }}>PT</option>
              </select>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-cyan-glow) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }}></div>
        
        <div className="container grid-2">
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 20 }}>
                <Zap size={16} className="text-accent" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{t.heroBadge1}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: 20 }}>
                <Network size={16} className="text-accent" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>{t.heroBadge2}</span>
              </div>
            </div>
            <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', letterSpacing: '-1px', lineHeight: 1.1 }}>
              {t.heroTitle1} <br />
              <span className="text-accent">{t.heroTitle2}</span>
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', fontWeight: 500 }}>
              {t.heroSubtitle}
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px' }}>
              {t.heroDesc}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {t.heroBtn1} <ChevronRight size={20} />
              </button>
              <button onClick={() => setShowVideoModal(true)} className="btn-solid">{t.heroBtn2}</button>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ position: 'relative', zIndex: 2, padding: '3rem', width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Floating Agent Display */}
                {['aegis', 'pere', 'jasmin'].map(id => (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: id !== 'jasmin' ? '1px solid var(--glass-border)' : 'none', paddingBottom: id !== 'jasmin' ? '1rem' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Shield className="text-accent" size={24} />
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{id}</span>
                    </div>
                    <span style={{ color: '#10b981', fontSize: '0.85rem' }}>{t.agentStatus}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderTop: '2px solid var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)', opacity: 0.5 }}></div>
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderBottom: '2px solid var(--accent-cyan)', borderLeft: '2px solid var(--accent-cyan)', opacity: 0.5 }}></div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '2rem' }}>{t.trustTitle}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.6 }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>OPENAI</h3>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>META Llama</h3>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>GROQ LPU</h3>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>ORACLE Cloud</h3>
          </div>
        </div>
      </section>

      {/* AGENTS SECTION */}
      <section id="agents" className="section container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t.agentsTitle1} <span className="text-accent">{t.agentsTitle2}</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>{t.agentsDesc}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {[
            { id: 'aegis', name: 'Aegis', img: '/avatars/aegis.png', role: t.roles.aegis, desc: t.descs.aegis, lore: "Entidad de grado militar. Desarrollado originalmente para contraespionaje corporativo, ahora es el guardián definitivo de la red.", color: '#ff3333' },
            { id: 'jasmin', name: 'Jasmin', img: '/avatars/jasmin.png', role: t.roles.jasmin, desc: t.descs.jasmin, lore: "Creada a partir de redes neuronales entrenadas en diseño neuro-arquitectónico. Su obsesión por el perfeccionismo estético es legendaria.", color: 'var(--accent-cyan)' },
            { id: 'edu', name: 'Edu', img: '/avatars/edu.png', role: t.roles.edu, desc: t.descs.edu, lore: "Forjado en los simuladores de teoría de juegos de Wall Street. Un estratega implacable que no conoce la palabra 'imposible'.", color: 'var(--accent-cyan)' },
            { id: 'pere', name: 'Pere', img: '/avatars/pere.png', role: t.roles.pere, desc: t.descs.pere, lore: "Arquitecto de sistemas nacido de los modelos Passivhaus más estrictos. Ve el mundo como una matriz de eficiencia energética pura.", color: 'var(--accent-cyan)' },
            { id: 'chloe', name: 'Chloe', img: '/avatars/chloe.png', role: t.roles.chloe, desc: t.descs.chloe, lore: "Una IA analítica con un toque de calidez humana. Procesa millones de transacciones mientras mantiene una sonrisa virtual impecable.", color: 'var(--accent-cyan)' }
          ].map((agent) => (
            <div 
              key={agent.id}
              className="glass-panel" 
              style={{ position: 'relative', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', transform: expandedAgent === agent.id ? 'scale(1.05)' : 'scale(1)', zIndex: expandedAgent === agent.id ? 10 : 1, borderColor: expandedAgent === agent.id ? agent.color : 'var(--glass-border)' }}
              onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
            >
              {/* Online Badge */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.color, boxShadow: `0 0 8px ${agent.color}`, animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.agentStatus}</span>
              </div>

              <div style={{ width: expandedAgent === agent.id ? '120px' : '80px', height: expandedAgent === agent.id ? '120px' : '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: `2px solid ${agent.color}`, overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: `0 0 15px ${agent.color}40` }}>
                <img src={agent.img} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{agent.name}</h3>
              <p style={{ color: agent.color, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{agent.role}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: expandedAgent === agent.id ? 'none' : 'block' }}>{agent.desc}</p>
              
              {/* Lore expansible */}
              <div style={{ maxHeight: expandedAgent === agent.id ? '150px' : '0', overflow: 'hidden', transition: 'all 0.4s ease', opacity: expandedAgent === agent.id ? 1 : 0 }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', borderLeft: `2px solid ${agent.color}`, fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  "{agent.lore}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY / B2B SECTION */}
      <section id="security" className="section" style={{ background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container grid-2">
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{t.secTitle1} <span className="text-accent">{t.secTitle2}</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {t.secDesc}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Lock className="text-accent" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t.secFeat1}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.secFeat1Desc}</p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Shield className="text-accent" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t.secFeat2}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.secFeat2Desc}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent-cyan)', boxShadow: '0 0 15px var(--accent-cyan)' }}></div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.auditTitle}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.auditDesc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="email" placeholder="Correo Corporativo" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
              <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ width: '100%' }}>{t.auditBtn}</button>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Shield size={12} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent-cyan)' }}/> Arquitectura Zero-Trust implementada por Aegis.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Bot size={24} className="text-accent" />
            <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              WM <span className="text-accent" style={{ fontWeight: 300 }}>Ai System</span>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.footerDesc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>{t.footerTerms}</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>{t.footerPrivacy}</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>{t.footerContact}</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem', opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Network size={14} className="text-accent" />
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{t.footerMoltbook}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>&copy; 2026 WM Ai System. {t.footerRights}</p>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {showVideoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '2rem' }} onClick={() => setShowVideoModal(false)}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid var(--accent-cyan)', overflow: 'hidden', boxShadow: '0 0 30px var(--accent-cyan-glow)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVideoModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <X size={24} />
            </button>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', display: 'grid', placeItems: 'center' }}>
              {/* Reemplazar esto con el video final <video src="..." controls autoPlay style={{width: '100%', height: '100%'}} /> */}
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Play size={48} className="text-accent" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>El Vídeo Dossier Tecnológico se insertará aquí</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
