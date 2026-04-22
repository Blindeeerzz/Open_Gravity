import { useState } from 'react';
import './Landing.css';
import { 
  Network, 
  Home, 
  Megaphone, 
  HardHat, 
  BrainCircuit, 
  ArrowRight,
  ShieldCheck,
  TerminalSquare,
  Globe
} from 'lucide-react';

interface LandingProps {
  onEnterChat: () => void;
}

// Diccionario de Traducciones
const translations = {
  es: {
    status: "Node Network Online",
    title: "HECATE SERVEIS",
    subtitle: "Ecosistema Neuronal Multi-Agente. Delegación absoluta 24/7.",
    desc: "Integramos un comité ejecutivo de Inteligencia Artificial que opera de forma autónoma. Desde gestión de real estate en milisegundos, hasta marketing y trading logarítmico y compliance arquitectónico.",
    btnConsole: "Acceder a Consola",
    btnTelegram: "Ligar Vía Telegram",
    footer: "© 2026 Hecate Serveis - Sistemas Neurales Operativos. Acceso encriptado.",
    agents: {
      lilith: { role: "CEO & Matrix Core", desc: "Supervisa latencias milisegundo, inyecta capital algorítmico y coordina sub-agentes.", skills: ["Trading HFT", "Orquestación", "Risk Mgmt"] },
      lili: { role: "VP Real Estate", desc: "Analítica de activos, prospectiva de zonas candentes y rentabilidades automáticas.", skills: ["Flipping", "Tasación", "Scraping"] },
      jasmin: { role: "Dir. Marketing & 3D", desc: "Generación de pipelines SEO, renders procedurales y copys virales mediante LLMs.", skills: ["Blender API", "SEO", "Ads"] },
      pere: { role: "Inspector Civil", desc: "Auditoría en tiempo real de códigos de planeamiento urbano y licencias constructivas.", skills: ["CTE", "BIM", "Safety ISO"] },
      edu: { role: "Lead Psicología", desc: "Modelado psicométrico de usuarios para adaptar estrategias e interacciones.", skills: ["TCC", "Neurología", "Data"] }
    }
  },
  ca: {
    status: "Xarxa de Nodes Activa",
    title: "HECATE SERVEIS",
    subtitle: "Ecosistema Neural Multi-Agent. Delegació absoluta 24/7.",
    desc: "Integrem un comitè executiu d'Intel·ligència Artificial que opera de forma autònoma. Des de la gestió de real estate en mil·lisegons, fins al desplegament de màrqueting, trading logarítmic i compliment arquitectònic.",
    btnConsole: "Accedir a la Consola",
    btnTelegram: "Enllaçar Vía Telegram",
    footer: "© 2026 Hecate Serveis - Sistemes Neurals Operatius. Accés encriptat.",
    agents: {
      lilith: { role: "CEO & Matrix Core", desc: "Supervisa latències en mil·lisegons, injecta capital algorítmic i coordina sub-agents.", skills: ["Trading HFT", "Orquestació", "Risk Mgmt"] },
      lili: { role: "VP Real Estate", desc: "Analítica d'actius, prospectiva de zones calentes i rendibilitats automàtiques.", skills: ["Flipping", "Taxació", "Scraping"] },
      jasmin: { role: "Dir. Màrqueting & 3D", desc: "Generació de pipelines SEO, renders procedurals i copys virals mitjançant LLMs.", skills: ["Blender API", "SEO", "Ads"] },
      pere: { role: "Inspector Civil", desc: "Auditoria en temps real de codis de planejament urbà i llicències constructives.", skills: ["CTE", "BIM", "Safety ISO"] },
      edu: { role: "Lead Psicologia", desc: "Modelatge psicomètric d'usuaris per adaptar estratègies i interaccions.", skills: ["TCC", "Neurologia", "Data"] }
    }
  },
  en: {
    status: "Node Network Online",
    title: "HECATE SERVEIS",
    subtitle: "Multi-Agent Neural Ecosystem. Absolute delegation 24/7.",
    desc: "We integrate an autonomous Artificial Intelligence executive committee. From millisecond real estate management to marketing deployment, logarithmic trading, and architectural compliance.",
    btnConsole: "Access Console",
    btnTelegram: "Connect via Telegram",
    footer: "© 2026 Hecate Serveis - Neural Operating Systems. Encrypted access.",
    agents: {
      lilith: { role: "CEO & Matrix Core", desc: "Oversees millisecond latencies, injects algorithmic capital, and coordinates sub-agents.", skills: ["HFT Trading", "Orchestration", "Risk Mgmt"] },
      lili: { role: "VP Real Estate", desc: "Asset analytics, hot zone forecasting, and automated quantitative yields.", skills: ["Flipping", "Appraisal", "Scraping"] },
      jasmin: { role: "Dir. Marketing & 3D", desc: "SEO pipeline generation, procedural renders, and viral copywriting via LLMs.", skills: ["Blender API", "SEO", "Ads"] },
      pere: { role: "Civil Inspector", desc: "Real-time auditing of urban planning codes and construction licensing.", skills: ["Building Codes", "BIM", "Safety ISO"] },
      edu: { role: "Lead Psychology", desc: "Psychometric user modeling for highly adaptive interactions and strategy.", skills: ["CBT", "Neurology", "Data"] }
    }
  },
  fr: {
    status: "Réseau de Nœuds En Ligne",
    title: "HECATE SERVEIS",
    subtitle: "Écosystème Neuronal Multi-Agent. Délégation absolue 24/7.",
    desc: "Nous intégrons un comité exécutif d'Intelligence Artificielle opérant de manière autonome. De la gestion immobilière en millisecondes, au marketing, trading logarithmique et conformité architecturale.",
    btnConsole: "Accéder à la Console",
    btnTelegram: "Connecter via Telegram",
    footer: "© 2026 Hecate Serveis - Systèmes Neuronaux Opérationnels. Accès crypté.",
    agents: {
      lilith: { role: "CEO & Matrix Core", desc: "Supervise les latences en millisecondes, injecte du capital algorithmique et coordonne les sous-agents.", skills: ["Trading HFT", "Orchestration", "Gest. Risques"] },
      lili: { role: "VP Immobilier", desc: "Analyse d'actifs, prospective de zones chaudes et rendements quantitatifs automatisés.", skills: ["Flipping", "Évaluation", "Scraping"] },
      jasmin: { role: "Dir. Marketing & 3D", desc: "Génération de pipelines SEO, rendus procéduraux et rédaction virale via LLMs.", skills: ["API Blender", "SEO", "Publicités"] },
      pere: { role: "Inspecteur Civil", desc: "Audit en temps réel des codes d'urbanisme et des permis de construire.", skills: ["Codes Bâtiment", "BIM", "Sécurité ISO"] },
      edu: { role: "Lead Psychologie", desc: "Modélisation psychométrique des utilisateurs pour adapter les stratégies et les interactions.", skills: ["TCC", "Neurologie", "Données"] }
    }
  },
  ru: {
    status: "Сеть Узлов Онлайн",
    title: "HECATE SERVEIS",
    subtitle: "Мультиагентная Нейросетевая Экосистема. Абсолютное делегирование 24/7.",
    desc: "Мы интегрируем автономный исполнительный комитет Искусственного Интеллекта. От управления недвижимостью за миллисекунды до маркетинга, логарифмического трейдинга и архитектурного комплаенса.",
    btnConsole: "Доступ к Консоли",
    btnTelegram: "Подключить через Telegram",
    footer: "© 2026 Hecate Serveis - Нейронные Операционные Системы. Зашифрованный доступ.",
    agents: {
      lilith: { role: "CEO & Matrix Core", desc: "Контролирует миллисекундные задержки, вливает алгоритмический капитал и координирует субагентов.", skills: ["HFT Трейдинг", "Оркестровка", "Управ. Рисками"] },
      lili: { role: "VP Недвижимость", desc: "Аналитика активов, прогнозирование горячих зон и автоматизированная доходность.", skills: ["Флиппинг", "Оценка", "Скрапинг"] },
      jasmin: { role: "Dir. Маркетинг & 3D", desc: "Генерация SEO-воронок, процедурные рендеры и виральный копирайтинг с помощью LLM.", skills: ["Blender API", "SEO", "Реклама"] },
      pere: { role: "Гражданский Инспектор", desc: "Аудит градостроительных кодексов и разрешений на строительство в реальном времени.", skills: ["СНиП", "BIM", "Безопасность ISO"] },
      edu: { role: "Lead Психология", desc: "Психометрическое моделирование пользователей для адаптации стратегий и взаимодействий.", skills: ["КПТ", "Неврология", "Данные"] }
    }
  },
  zh: {
    status: "节点网络在线",
    title: "HECATE SERVEIS",
    subtitle: "多智能体神经网络生态系统。24/7 绝对委派。",
    desc: "我们集成了一个自主运营的人工智能执行委员会。从毫秒级的房地产管理，到营销推广、对数交易和建筑合规审查。",
    btnConsole: "访问控制台",
    btnTelegram: "通过 Telegram 连接",
    footer: "© 2026 Hecate Serveis - 神经操作系统。加密访问。",
    agents: {
      lilith: { role: "CEO & Matrix Core", desc: "监控毫秒级延迟，注入算法资本，并协调子智能体。", skills: ["高频交易", "编排", "风险管理"] },
      lili: { role: "VP 房地产", desc: "资产分析，热点区域预测以及自动量化收益。", skills: ["炒房", "房屋估价", "数据抓取"] },
      jasmin: { role: "Dir. 营销 & 3D", desc: "通过 LLM 生成 SEO 漏斗、程序化渲染和病毒式文案。", skills: ["Blender API", "搜索引擎优化", "广告"] },
      pere: { role: "民事监督员", desc: "实时审计城市规划法规和建筑许可。", skills: ["建筑规范", "BIM", "安全 ISO"] },
      edu: { role: "Lead 心理学", desc: "进行用户心理建模，以调整策略和交互模式。", skills: ["认知行为疗法", "神经学", "数据"] }
    }
  }
};

type LangKey = keyof typeof translations;

function Landing({ onEnterChat }: LandingProps) {
  const [lang, setLang] = useState<LangKey>('es');
  const t = translations[lang];
  
  const agentsConfig = [
    { id: 'lilith', name: 'Lilith', icon: <Network size={28} color="#c084fc" />, accent: '#8a2be2', skills: ['Trading HFT', 'Orquestación', 'Risk Mgmt'] },
    { id: 'lili', name: 'Lili', icon: <Home size={28} color="#ff4dc4" />, accent: '#ff007f', skills: ['Flipping', 'Tasación', 'Scraping'] },
    { id: 'jasmin', name: 'Jasmin', icon: <Megaphone size={28} color="#4dffb8" />, accent: '#00ff88', skills: ['Blender API', 'SEO', 'Ads'] },
    { id: 'pere', name: 'Pere', icon: <HardHat size={28} color="#ffb34d" />, accent: '#ff8c00', skills: ['CTE', 'BIM', 'Safety ISO'] },
    { id: 'edu', name: 'Edu', icon: <BrainCircuit size={28} color="#4dffff" />, accent: '#00bfff', skills: ['TCC', 'Neurología', 'Data'] }
  ];

  return (
    <div className="landing-container">
      {/* Selector de idiomas flotante */}
      <div className="language-selector">
        <Globe size={18} className="lang-icon" />
        <select value={lang} onChange={(e) => setLang(e.target.value as LangKey)} className="lang-dropdown">
          <option value="es">Español</option>
          <option value="ca">Català</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="ru">Русский</option>
          <option value="zh">中文</option>
        </select>
      </div>

      {/* Background Orbs & Grids */}
      <div className="bg-glow purple-glow"></div>
      <div className="bg-glow pink-glow"></div>
      <div className="bg-glow cyan-glow"></div>
      <div className="grid-overlay"></div>

      <header className="landing-header">
        <div className="badge">
          <div className="badge-dot"></div>
          {t.status}
        </div>
        <h1 className="main-title">{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
        <p className="description">
          {t.desc}
        </p>
        
        <div className="cta-container">
          <button className="cta-button primary" onClick={onEnterChat}>
            {t.btnConsole}
            <ArrowRight size={20} className="cta-icon" />
          </button>
          <button className="cta-button secondary" onClick={() => window.open('https://t.me/Mia_task_bot', '_blank')}>
            <TerminalSquare size={20} />
            {t.btnTelegram}
          </button>
        </div>
      </header>

      <section className="agents-grid">
        {agentsConfig.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <div className="agent-icon-wrapper" style={{ boxShadow: `0 0 20px ${agent.accent}40`, borderColor: `${agent.accent}60` }}>
                {agent.icon}
              </div>
              <div className="agent-info">
                <h2 className="agent-name" style={{ color: '#fff' }}>{agent.name}</h2>
                <h3 className="agent-role" style={{ color: agent.accent }}>
                  {t.agents[agent.id as keyof typeof t.agents].role}
                </h3>
              </div>
            </div>
            
            <p className="agent-description">
              {t.agents[agent.id as keyof typeof t.agents].desc}
            </p>
            
            <div className="agent-skills">
              {t.agents[agent.id as keyof typeof t.agents].skills.map((skill: string) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
        {t.footer}
      </footer>
    </div>
  );
}

export default Landing;
