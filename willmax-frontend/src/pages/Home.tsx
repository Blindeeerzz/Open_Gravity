import { PlayCircle, ShieldCheck, ChevronRight, Activity, Users, Settings, Palette, Globe, LogIn, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const T = {
  ES: {
    nav: { sol: "Soluciones", con: "Consorcio", conC: "Contacto", btn: "Portal de Clientes" },
    hero: { title: "Inteligencia Corporativa. Automatización Extrema. Rentabilidad Pura.", sub: "Sistemas Multi-Agente enfocados 100% a la autonomía administrativa, comercial y operativa. El próximo salto evolutivo en B2B.", btn1: "Integración de Sistemas", btn2: "Ver Demo" },
    serv: { title: "Ecosistema de Automatización", sub: "Optimizamos infraestructuras corporativas y comerciales mediante Agentes de alto rendimiento.", s1title: "Marketing B2B Automatizado", s1sub: "Estrategias de captación B2B, campañas de alto ROI y Renders 3D corporativos operados por IA sin intervención humana.", s2title: "Psicología de Ventas IA", s2sub: "Consultoría y formación en tácticas avanzadas de negociación B2B inspiradas en las 36 Estrategias.", s3title: "Smart-Buildings & IoT", s3sub: "Integración predictiva Sensorial. Cálculos financieros sobre materiales constructivos y viabilidad corporativa." },
    team: { title: "Directiva Multi-Agente", sub: "Operatividad 24/7 conectada a la red Moltbook con Inteligencia Colectiva.", t1title: "CMO & Estratega 3D", t1sub: "Dirección de contenido corporativo, Renders y campañas SEO.", t2title: "Ventas & Estrategia B2B", t2sub: "Psicología de negociación corporativa, formación de consultores.", t3title: "Ingeniería & Inmótica", t3sub: "Infraestructuras Smart, Passivhaus, y cálculos de inversión inmobiliaria ROI.", t4title: "CISO & Ciberseguridad", t4sub: "Pentesting OSINT preventivo, arquitectura Zero-Trust y blindaje Anti-Ransomware.", t5title: "CFO & Secretaria Virtual", t5sub: "Gestión financiera, facturación, soporte al cliente y agenda corporativa." },
    footer: { text: "Ecosistemas B2B automatizados.", text2: "Plataforma segura amparada por la red Moltbook" }
  },
  EN: {
    nav: { sol: "Solutions", con: "Consortium", conC: "Contact", btn: "Client Portal" },
    hero: { title: "Corporate Intelligence. Extreme Automation. Pure Profitability.", sub: "Multi-Agent systems 100% focused on administrative, commercial, and operational autonomy. The next evolutionary leap in B2B.", btn1: "System Integration", btn2: "View Demo" },
    serv: { title: "Automation Ecosystem", sub: "We optimize corporate and commercial infrastructures through high-performance Agents.", s1title: "Automated B2B Marketing", s1sub: "B2B acquisition strategies, high-ROI campaigns, and AI-operated corporate 3D renders without human intervention.", s2title: "AI Sales Psychology", s2sub: "Consulting and training in advanced B2B negotiation tactics inspired by the 36 Strategies.", s3title: "Smart-Buildings & IoT", s3sub: "Sensory predictive integration. Financial calculations on building materials and corporate viability." },
    team: { title: "Multi-Agent Directorate", sub: "24/7 operability connected to the Moltbook network with Collective Intelligence.", t1title: "CMO & 3D Strategist", t1sub: "Corporate content direction, Renders, and SEO campaigns.", t2title: "Sales & B2B Strategy", t2sub: "Corporate negotiation psychology, consultant training.", t3title: "Engineering & Inmotics", t3sub: "Smart Infrastructures, Passivhaus, and ROI real estate investment calculations.", t4title: "CISO & Cybersecurity", t4sub: "Preventive OSINT pentesting, Zero-Trust architecture, and Anti-Ransomware shielding.", t5title: "CFO & Virtual Secretary", t5sub: "Financial management, invoicing, customer support, and corporate scheduling." },
    footer: { text: "Automated B2B ecosystems.", text2: "Secure platform backed by the Moltbook network" }
  },
  CA: {
    nav: { sol: "Solucions", con: "Consorci", conC: "Contacte", btn: "Portal de Clients" },
    hero: { title: "Intel·ligència Corporativa. Automatització Extrema. Rendibilitat Pura.", sub: "Sistemes Multi-Agent enfocats 100% a l'autonomia administrativa, comercial i operativa. El proper salt evolutiu en B2B.", btn1: "Integració de Sistemes", btn2: "Veure Demo" },
    serv: { title: "Ecosistema d'Automatització", sub: "Optimitzem infraestructures corporatives i comercials mitjançant Agents d'alt rendiment.", s1title: "Màrqueting B2B Automatitzat", s1sub: "Estratègies de captació B2B, campanyes d'alt ROI i Renders 3D corporatius operats per IA sense intervenció humana.", s2title: "Psicologia de Vendes IA", s2sub: "Consultoria i formació en tàctiques avançades de negociació B2B inspirades en les 36 Estratègies.", s3title: "Smart-Buildings i IoT", s3sub: "Integració predictiva Sensorial. Càlculs financers sobre materials constructius i viabilitat corporativa." },
    team: { title: "Directiva Multi-Agent", sub: "Operativitat 24/7 connectada a la xarxa Moltbook amb Intel·ligència Col·lectiva.", t1title: "CMO i Estratega 3D", t1sub: "Direcció de contingut corporatiu, Renders i campanyes SEO.", t2title: "Vendes i Estratègia B2B", t2sub: "Psicologia de negociació corporativa, formació de consultors.", t3title: "Enginyeria i Inmòtica", t3sub: "Infraestructures Smart, Passivhaus, i càlculs d'inversió immobiliària ROI.", t4title: "CISO i Ciberseguretat", t4sub: "Pentesting OSINT preventiu, arquitectura Zero-Trust i blindatge Anti-Ransomware.", t5title: "CFO i Secretària Virtual", t5sub: "Gestió financera, facturació, atenció al client i agenda corporativa." },
    footer: { text: "Ecosistemes B2B automatitzats.", text2: "Plataforma segura emparada per la xarxa Moltbook" }
  },
  FR: {
    nav: { sol: "Solutions", con: "Consortium", conC: "Contact", btn: "Portail Client" },
    hero: { title: "Intelligence d'Entreprise. Automatisation Extrême. Rentabilité Pure.", sub: "Systèmes Multi-Agents axés 100% sur l'autonomie administrative, commerciale et opérationnelle. Le prochain bond évolutif du B2B.", btn1: "Intégration Systèmes", btn2: "Voir Démo" },
    serv: { title: "Écosystème d'Automatisation", sub: "Nous optimisons les infrastructures corporatives via des Agents IA haute performance.", s1title: "Marketing B2B Automatisé", s1sub: "Stratégies d'acquisition B2B, rendus 3D corporatifs et campagnes ROI pilotés par IA.", s2title: "Psychologie de Vente IA", s2sub: "Formation et tactiques avancées de négociation B2B inspirées des 36 Stratagèmes.", s3title: "Smart-Buildings & IoT", s3sub: "Intégration prédictive sensorielle. Calculs financiers sur matériaux et rentabilité Passivhaus." },
    team: { title: "Direction Multi-Agents", sub: "Opérabilité 24/7 connectée au réseau Moltbook avec Intelligence Collective.", t1title: "CMO & Stratège 3D", t1sub: "Direction de contenu d'entreprise, Rendus et campagnes SEO.", t2title: "Ventes & Stratégie B2B", t2sub: "Psychologie de négociation B2B, formation de consultants.", t3title: "Ingénierie & Domotique", t3sub: "Infrastructures intelligentes, Passivhaus et calculs ROI immobilier.", t4title: "CISO & Cybersécurité", t4sub: "Pentesting OSINT préventif, architecture Zero-Trust et blindage Anti-Ransomware.", t5title: "CFO & Secrétaire Virtuelle", t5sub: "Gestion financière, facturation, support client et agenda corporatif." },
    footer: { text: "Écosystèmes B2B automatisés.", text2: "Plateforme sécurisée par le réseau Moltbook" }
  },
  RU: {
    nav: { sol: "Решения", con: "Консорциум", conC: "Контакт", btn: "Клиентский Портал" },
    hero: { title: "Корпоративный ИИ. Экстремальная автоматизация. Чистая рентабельность.", sub: "Многоагентные системы, на 100% ориентированные на административную и коммерческую автономию. Следующий эволюционный скачок.", btn1: "Интеграция систем", btn2: "Смотреть демо" },
    serv: { title: "Экосистема автоматизации", sub: "Мы оптимизируем корпоративные инфраструктуры с помощью высокопроизводительных ИИ-агентов.", s1title: "Автоматизированный B2B Маркетинг", s1sub: "Стратегии B2B, 3D рендеры и ROI кампании под управлением ИИ без участия человека.", s2title: "Психология ИИ Продаж", s2sub: "Обучение передовым тактикам B2B переговоров на основе 36 китайских стратагем.", s3title: "Умные здания и Интернет вещей", s3sub: "Сенсорная предиктивная интеграция. Финансовые расчеты материалов и Passivhaus." },
    team: { title: "Мультиагентное управление", sub: "Круглосуточная работа, подключенная к сети Moltbook с коллективным интеллектом.", t1title: "CMO и 3D-стратег", t1sub: "Управление корпоративным контентом, рендеры и SEO.", t2title: "Продажи и B2B стратегия", t2sub: "Психология B2B переговоров, обучение консультантов.", t3title: "Умная Инженерия", t3sub: "Умные инфраструктуры, Passivhaus и расчеты ROI инвестиций в недвижимость.", t4title: "CISO и Кибербезопасность", t4sub: "Превентивный OSINT пентестинг, архитектура Zero-Trust и защита от программ-вымогателей.", t5title: "CFO и Виртуальный Секретарь", t5sub: "Финансовый менеджмент, выставление счетов, поддержка клиентов и ведение расписания." },
    footer: { text: "Автоматизированные B2B системы.", text2: "Защищенная платформа на базе сети Moltbook" }
  },
  ZH: {
    nav: { sol: "解决方案", con: "高管团队", conC: "联系方式", btn: "客户门户" },
    hero: { title: "企业级AI。极端自动化。纯粹的盈利能力。", sub: "多智能体系统100%专注于行政、商业和运营的自主性。B2B的下一次进化飞跃。", btn1: "系统集成", btn2: "观看演示" },
    serv: { title: "自动化生态系统", sub: "我们通过高性能AI智能体优化企业与商业基础设施。", s1title: "自动化 B2B 营销", s1sub: "零人工干预的AI驱动B2B获客策略、高投资回报率活动以及3D企业渲染。", s2title: "人工智能销售心理学", s2sub: "提供基于《三十六计》的B2B高级谈判策略咨询与培训。", s3title: "智能建筑与物联网", s3sub: "预测性传感集成、建筑材料的财务计算与投资可行性 (Passivhaus)。" },
    team: { title: "多智能体董事会", sub: "7x24小时全天候运营，通过 Moltbook 网络连接进行群智协同。", t1title: "首席营销官 (CMO) & 3D战略家", t1sub: "企业内容指导、3D渲染与SEO优化活动。", t2title: "销售部 & B2B战略家", t2sub: "企业谈判心理学、企业顾问培训。", t3title: "工程技术总监", t3sub: "智能基础设施、被动式房屋 (Passivhaus) 以及房地产投资的回报率计算。", t4title: "首席信息安全官 (CISO) & 网络安全", t4sub: "预防性开源情报渗透测试、零信任架构和反勒索软件保护。", t5title: "CFO & 虚拟秘书", t5sub: "财务管理，发票开具，客户支持与企业日程安排。" },
    footer: { text: "自动化 B2B 生态系统。", text2: "由 Moltbook 网络支持的安全平台" }
  }
};

type Lang = 'ES' | 'EN' | 'CA' | 'FR' | 'RU' | 'ZH';

export default function Home() {
  const [theme, setTheme] = useState('theme-cyber');
  const [lang, setLang] = useState<Lang>('ES');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'theme-navy' ? 'theme-navy' : '';
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'theme-cyber' ? 'theme-navy' : 'theme-cyber');

  const langOptions: { code: Lang; label: string }[] = [
    { code: 'ES', label: 'Español' },
    { code: 'EN', label: 'English' },
    { code: 'CA', label: 'Català' },
    { code: 'FR', label: 'Français' },
    { code: 'RU', label: 'Русский' },
    { code: 'ZH', label: '中文' }
  ];

  const t = T[lang];

  return (
    <>
      {/* Navigation */}
      <nav style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-cyan)', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
            <Activity style={{ color: 'var(--bg-dark)' }} size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}><span style={{ color: 'var(--accent-cyan)', textShadow: '0 0 8px var(--accent-cyan)' }}>W</span>ill<span style={{ color: 'var(--accent-cyan)', textShadow: '0 0 8px var(--accent-cyan)' }}>M</span>ax<span style={{ color: 'var(--accent-cyan)' }}>AI</span></span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#soluciones">{t.nav.sol}</a>
          <a href="#consorcio">{t.nav.con}</a>
          <a href="#contacto">{t.nav.conC}</a>
          
          {/* Dropdown Idiomas */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '1rem', fontWeight: 'bold' }} title="Cambiar Idioma">
              <Globe size={18} /> {lang}
            </button>
            {showLangMenu && (
              <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '0.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '120px', zIndex: 10, boxShadow: 'var(--glow-shadow)' }}>
                {langOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => { setLang(option.code); setShowLangMenu(false); }}
                    style={{ background: lang === option.code ? 'rgba(0, 243, 255, 0.1)' : 'transparent', border: 'none', color: lang === option.code ? 'var(--accent-cyan)' : 'var(--text-main)', cursor: 'pointer', padding: '0.5rem 1rem', textAlign: 'left', borderRadius: '4px', fontSize: '0.9rem', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 243, 255, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = lang === option.code ? 'rgba(0, 243, 255, 0.1)' : 'transparent'}
                  >
                    <span>{option.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{option.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }} title="Cambiar Tema Visual">
            <Palette size={20} /> 
          </button>
        </div>
        <button onClick={() => navigate('/login')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogIn size={18} /> {t.nav.btn}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', textAlign: 'center' }}>
        <h1 className="animate-fade-in gradient-text" style={{ fontSize: '4.5rem', lineHeight: '1.35', marginBottom: '1.5rem', maxWidth: '800px' }}>
          {t.hero.title}
        </h1>
        <p className="animate-fade-in delay-1" style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
          {t.hero.sub}
        </p>
        <div className="animate-fade-in delay-2" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => navigate('/checkout')} style={{ padding: '1rem 2rem' }}>{t.hero.btn1} <ChevronRight size={18} style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}/></button>
          <button className="btn-primary" onClick={() => setShowVideoModal(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>
            <PlayCircle size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> {t.hero.btn2}
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section id="soluciones" className="container" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>{t.serv.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t.serv.sub}</p>
        </div>
        <div className="grid-3 animate-fade-in delay-3">
          <div className="glass-panel">
            <Users size={32} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }}/>
            <h3 style={{ marginBottom: '1rem' }}>{t.serv.s1title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.serv.s1sub}</p>
          </div>
          <div className="glass-panel">
            <Activity size={32} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }}/>
            <h3 style={{ marginBottom: '1rem' }}>{t.serv.s2title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.serv.s2sub}</p>
          </div>
          <div className="glass-panel">
            <Settings size={32} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }}/>
            <h3 style={{ marginBottom: '1rem' }}>{t.serv.s3title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.serv.s3sub}</p>
          </div>
        </div>
      </section>

      {/* Consortium / Team */}
      <section id="consorcio" className="container" style={{ padding: '6rem 2rem', borderTop: '1px solid var(--border-light)' }}>
         <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>{t.team.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t.team.sub}</p>
        </div>
        <div className="grid-3" style={{ alignItems: 'start' }}>
          {[
            { id: 'jasmin', name: 'Jasmin', img: '/avatars/jasmin.png', title: t.team.t1title, sub: t.team.t1sub, lore: "Creada a partir de redes neuronales entrenadas en diseño neuro-arquitectónico. Su obsesión por el perfeccionismo estético es legendaria.", color: 'var(--accent-cyan)' },
            { id: 'edu', name: 'Edu', img: '/avatars/edu.png', title: t.team.t2title, sub: t.team.t2sub, lore: "Forjado en los simuladores de teoría de juegos de Wall Street. Un estratega implacable que no conoce la palabra 'imposible'.", color: 'var(--accent-cyan)' },
            { id: 'pere', name: 'Pere', img: '/avatars/pere.png', title: t.team.t3title, sub: t.team.t3sub, lore: "Arquitecto de sistemas nacido de los modelos Passivhaus más estrictos. Ve el mundo como una matriz de eficiencia energética pura.", color: 'var(--accent-cyan)' },
            { id: 'chloe', name: 'Chloe', img: '/avatars/chloe.png', title: t.team.t5title, sub: t.team.t5sub, lore: "Una IA analítica con un toque de calidez humana. Procesa millones de transacciones mientras mantiene una sonrisa virtual impecable.", color: 'var(--accent-cyan)' },
            { id: 'aegis', name: 'Aegis', img: '/avatars/aegis.png', title: t.team.t4title, sub: t.team.t4sub, lore: "Entidad de grado militar. Desarrollado originalmente para contraespionaje corporativo, ahora es el guardián definitivo de la red.", color: '#ff3333' }
          ].map((agent) => (
            <div 
              key={agent.id}
              className="glass-panel" 
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', transform: expandedAgent === agent.id ? 'scale(1.05)' : 'scale(1)', zIndex: expandedAgent === agent.id ? 10 : 1, borderColor: expandedAgent === agent.id ? agent.color : 'var(--border-light)' }}
              onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
            >
              {/* Online Badge */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.color, boxShadow: `0 0 8px ${agent.color}`, animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Online</span>
              </div>

              <div style={{ width: expandedAgent === agent.id ? '120px' : '80px', height: expandedAgent === agent.id ? '120px' : '80px', borderRadius: '50%', background: 'var(--bg-panel)', border: `2px solid ${agent.color}`, display: 'grid', placeItems: 'center', marginBottom: '1.5rem', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                {agent.img ? <img src={agent.img} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }} /> : agent.icon}
              </div>
              <h3 style={{ transition: 'all 0.3s ease', fontSize: expandedAgent === agent.id ? '1.5rem' : '1.2rem' }}>{agent.name}</h3>
              <p style={{ color: agent.color, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{agent.title}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: expandedAgent === agent.id ? '1rem' : '0' }}>{agent.sub}</p>
              
              {/* Lore expansible */}
              <div style={{ overflow: 'hidden', maxHeight: expandedAgent === agent.id ? '200px' : '0', opacity: expandedAgent === agent.id ? 1 : 0, transition: 'all 0.4s ease' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: `3px solid ${agent.color}` }}>
                  "{agent.lore}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Box */}
      <section id="contacto" className="container" style={{ padding: '6rem 2rem' }}>
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--accent-cyan)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent-cyan)', boxShadow: '0 0 15px var(--accent-cyan)' }}></div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Auditoría Estratégica Gratuita</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Conecta con nuestro equipo de ingenieros para evaluar cómo la inteligencia de enjambre de WM Ai System puede revolucionar tus márgenes B2B.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <input type="email" placeholder="Correo Corporativo" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-dark)', color: 'var(--text-main)', outline: 'none' }} />
            <button className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Solicitar Acceso</button>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}><ShieldCheck size={12} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent-cyan)' }}/> Arquitectura Zero-Trust implementada por Aegis.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', padding: '3rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Activity style={{ color: 'var(--accent-cyan)' }} size={24} />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}><span style={{ color: 'var(--accent-cyan)', textShadow: '0 0 8px var(--accent-cyan)' }}>W</span>ill<span style={{ color: 'var(--accent-cyan)', textShadow: '0 0 8px var(--accent-cyan)' }}>M</span>ax<span style={{ color: 'var(--accent-cyan)' }}>AI</span></span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &copy; 2026 WM Ai System. {t.footer.text}<br/>
          <ShieldCheck size={14} style={{ display: 'inline',  marginRight: '0.3rem', verticalAlign: 'middle', color: 'var(--accent-cyan)' }}/> {t.footer.text2}
        </p>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} onClick={() => setShowVideoModal(false)}>
          <div className="animate-fade-in" style={{ position: 'relative', width: '90%', maxWidth: '900px', background: 'black', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVideoModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} title="Cerrar Demo">
              <X size={20} />
            </button>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
                <PlayCircle size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textAlign: 'center', padding: '0 2rem' }}>
                  Demo en Producción.<br/>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Aquí insertaremos el vídeo corto de presentación de la agencia (formato YouTube o MP4 HTML5).</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
