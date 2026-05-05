import React, { useState } from 'react';
import { Bot, Shield, Zap, Building2, ChevronRight, Lock, Globe, Server, Network } from 'lucide-react';
import './index.css';

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
      pere: "CSO / Ventas B2B"
    },
    descs: {
      aegis: "Vigilancia 24/7. Pentesting continuo, análisis de tráfico y reportes estándar Bug Bounty.",
      jasmin: "Diseño de campañas, captación de leads y análisis de mercado en tiempo real.",
      edu: "Atención al cliente técnica, manuales y resolución de incidencias en Nivel 1 y 2.",
      pere: "Calificación de prospectos y cierre de operaciones de alto valor inmobiliario y B2B."
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
  ca: {
    navAgents: "Els Nostres Agents",
    navSecurity: "Seguretat B2B",
    navAudit: "Auditoria Gratuïta",
    heroBadge1: "Operant des d'Andorra",
    heroBadge2: "Powered by Moltbook™",
    heroTitle1: "Ecosistema Neural",
    heroTitle2: "Multi-Agent.",
    heroSubtitle: "Delegació absoluta 24/7.",
    heroDesc: "Un comitè executiu d'Intel·ligència Artificial operant de forma autònoma. Des de ciberseguretat fins a vendes corporatives, treballant en perfecta sincronia.",
    heroBtn1: "Agendar Demostració",
    heroBtn2: "Veure el Dossier Tecnològic",
    agentStatus: "En Línia",
    trustTitle: "Infraestructura Tecnològica Premium",
    agentsTitle1: "Coneix a la teva",
    agentsTitle2: "Directiva Autònoma",
    agentsDesc: "Els nostres agents no són simples scripts. Posseeixen memòria a llarg termini, eines específiques i es comuniquen entre ells a través de la nostra xarxa neural interna: El Moltbook.",
    roles: {
      aegis: "CISO / Ciberseguretat",
      jasmin: "CMO / Màrqueting",
      edu: "CTO / Suport",
      pere: "CSO / Vendes B2B"
    },
    descs: {
      aegis: "Vigilància 24/7. Pentesting continu, anàlisi de trànsit i reportes estàndard Bug Bounty.",
      jasmin: "Disseny de campanyes, captació de leads i anàlisi de mercat en temps real.",
      edu: "Atenció al client tècnica, manuals i resolució d'incidències de Nivell 1 i 2.",
      pere: "Qualificació de prospectes i tancament d'operacions d'alt valor immobiliari i B2B."
    },
    secTitle1: "Seguretat Grau",
    secTitle2: "Militar",
    secDesc: "A WillMax, sabem que les dades de la teva empresa són el teu actiu més gran. Per això, hem dissenyat una arquitectura de 'Mur de Ferro'.",
    secFeat1: "Entorns Aïllats (Sandbox)",
    secFeat1Desc: "Les teves dades no entrenen IAs públiques. Tot es processa en servidors tancats sota la teva jurisdicció.",
    secFeat2: "Vigilància Autònoma Contínua",
    secFeat2Desc: "El nostre agent Aegis patrulla els teus sistemes 24/7 reportant bretxes abans que siguin explotades.",
    auditTitle: "Auditoria Gratuïta",
    auditDesc: "Deixa'ns el teu domini i Aegis generarà un report de vulnerabilitats gratuït en 5 minuts.",
    auditBtn: "Sol·licitar Report a Aegis",
    footerDesc: "Operant des d'Andorra. Revolucionant el món B2B.",
    footerTerms: "Termes de Servei",
    footerPrivacy: "Política de Privacitat",
    footerContact: "Contacte",
    footerMoltbook: "AVALAT PER MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Tots els drets reservats."
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
      pere: "CSO / B2B Sales"
    },
    descs: {
      aegis: "24/7 surveillance. Continuous pentesting, traffic analysis, and Bug Bounty standard reports.",
      jasmin: "Campaign design, lead generation, and real-time market analysis.",
      edu: "Technical customer support, manuals, and Level 1/2 incident resolution.",
      pere: "Lead qualification and high-value real estate / B2B deal closing."
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
  fr: {
    navAgents: "Nos Agents",
    navSecurity: "Sécurité B2B",
    navAudit: "Audit Gratuit",
    heroBadge1: "Opérant depuis Andorre",
    heroBadge2: "Propulsé par Moltbook™",
    heroTitle1: "Écosystème Neuronal",
    heroTitle2: "Multi-Agent.",
    heroSubtitle: "Délégation absolue 24/7.",
    heroDesc: "Un comité exécutif d'Intelligence Artificielle opérant de manière autonome. De la cybersécurité aux ventes corporatives, en parfaite synchronisation.",
    heroBtn1: "Planifier une Démo",
    heroBtn2: "Voir le Dossier Tech",
    agentStatus: "En Ligne",
    trustTitle: "Infrastructure Technologique Premium",
    agentsTitle1: "Rencontrez votre",
    agentsTitle2: "Direction Autonome",
    agentsDesc: "Nos agents ne sont pas de simples scripts. Ils possèdent une mémoire à long terme, des outils spécifiques et communiquent via notre réseau neuronal interne : Le Moltbook.",
    roles: {
      aegis: "CISO / Cybersécurité",
      jasmin: "CMO / Marketing",
      edu: "CTO / Support",
      pere: "CSO / Ventes B2B"
    },
    descs: {
      aegis: "Surveillance 24/7. Pentesting continu, analyse de trafic et rapports standards Bug Bounty.",
      jasmin: "Conception de campagnes, génération de leads et analyse de marché en temps réel.",
      edu: "Support client technique, manuels et résolution d'incidents de Niveau 1 et 2.",
      pere: "Qualification de prospects et conclusion de transactions immobilières et B2B de grande valeur."
    },
    secTitle1: "Sécurité de Grade",
    secTitle2: "Militaire",
    secDesc: "Chez WillMax, nous savons que vos données sont votre plus grand atout. C'est pourquoi nous avons conçu une architecture 'Mur de Fer'.",
    secFeat1: "Environnements Isolés (Sandbox)",
    secFeat1Desc: "Vos données n'entraînent pas d'IA publiques. Tout est traité sur des serveurs fermés sous votre juridiction.",
    secFeat2: "Surveillance Autonome Continue",
    secFeat2Desc: "Notre agent Aegis patrouille vos systèmes 24/7, signalant les failles avant leur exploitation.",
    auditTitle: "Audit Gratuit",
    auditDesc: "Laissez-nous votre domaine et Aegis générera un rapport de vulnérabilité gratuit en 5 minutes.",
    auditBtn: "Demander le rapport à Aegis",
    footerDesc: "Opérant depuis Andorre. Révolutionnant le monde B2B.",
    footerTerms: "Conditions d'Utilisation",
    footerPrivacy: "Politique de Confidentialité",
    footerContact: "Contact",
    footerMoltbook: "SOUTENU PAR MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Tous droits réservés."
  },
  ru: {
    navAgents: "Наши Агенты",
    navSecurity: "B2B Безопасность",
    navAudit: "Бесплатный Аудит",
    heroBadge1: "Работаем из Андорры",
    heroBadge2: "На базе Moltbook™",
    heroTitle1: "Мультиагентная",
    heroTitle2: "Нейроэкосистема.",
    heroSubtitle: "Абсолютное делегирование 24/7.",
    heroDesc: "Исполнительный комитет Искусственного Интеллекта, работающий автономно. От кибербезопасности до корпоративных продаж в идеальной синхронизации.",
    heroBtn1: "Заказать Демо",
    heroBtn2: "Смотреть Тех. Досье",
    agentStatus: "В сети",
    trustTitle: "Премиальная Тех-Инфраструктура",
    agentsTitle1: "Познакомьтесь с вашим",
    agentsTitle2: "Автономным Советом",
    agentsDesc: "Наши агенты — это не просто скрипты. Они обладают долгосрочной памятью, инструментами и общаются через нашу внутреннюю нейронную сеть: Moltbook.",
    roles: {
      aegis: "CISO / Кибербезопасность",
      jasmin: "CMO / Маркетинг",
      edu: "CTO / Поддержка",
      pere: "CSO / B2B Продажи"
    },
    descs: {
      aegis: "Наблюдение 24/7. Непрерывный пентестинг, анализ трафика и отчеты стандарта Bug Bounty.",
      jasmin: "Создание кампаний, лидогенерация и анализ рынка в реальном времени.",
      edu: "Техническая поддержка клиентов, руководства и разрешение инцидентов 1 и 2 уровня.",
      pere: "Квалификация лидов и закрытие крупных сделок в сфере недвижимости и B2B."
    },
    secTitle1: "Безопасность",
    secTitle2: "Военного Уровня",
    secDesc: "В WillMax мы знаем, что данные вашей компании — ваш главный актив. Поэтому мы разработали архитектуру 'Железная Стена'.",
    secFeat1: "Изолированные Среды (Sandbox)",
    secFeat1Desc: "Ваши данные не обучают публичные ИИ. Всё обрабатывается на закрытых серверах под вашей юрисдикцией.",
    secFeat2: "Непрерывное Автономное Наблюдение",
    secFeat2Desc: "Наш агент Aegis патрулирует ваши системы 24/7, сообщая об уязвимостях до того, как ими воспользуются.",
    auditTitle: "Бесплатный Аудит",
    auditDesc: "Оставьте нам свой домен, и Aegis создаст бесплатный отчет об уязвимостях за 5 минут.",
    auditBtn: "Запросить отчет у Aegis",
    footerDesc: "Работаем из Андорры. Совершаем революцию в B2B.",
    footerTerms: "Условия Обслуживания",
    footerPrivacy: "Политика Конфиденциальности",
    footerContact: "Контакты",
    footerMoltbook: "ПОДДЕРЖИВАЕТСЯ MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Все права защищены."
  },
  zh: {
    navAgents: "我们的智能体",
    navSecurity: "B2B 安全",
    navAudit: "免费审计",
    heroBadge1: "总部位于安道尔",
    heroBadge2: "由 Moltbook™ 提供技术支持",
    heroTitle1: "多智能体",
    heroTitle2: "神经网络生态系统。",
    heroSubtitle: "24/7 绝对委派。",
    heroDesc: "一个自主运营的人工智能执行委员会。从网络安全到企业销售，保持完美同步运作。",
    heroBtn1: "预约演示",
    heroBtn2: "查看技术档案",
    agentStatus: "在线",
    trustTitle: "顶级技术基础设施",
    agentsTitle1: "认识您的",
    agentsTitle2: "自主董事会",
    agentsDesc: "我们的智能体不是简单的脚本。它们拥有长期记忆、特定工具，并通过我们的内部神经网络：Moltbook 进行交流。",
    roles: {
      aegis: "CISO / 网络安全",
      jasmin: "CMO / 市场营销",
      edu: "CTO / 技术支持",
      pere: "CSO / B2B 销售"
    },
    descs: {
      aegis: "24/7 监控。持续的渗透测试、流量分析和漏洞赏金标准报告。",
      jasmin: "活动设计、潜在客户生成和实时市场分析。",
      edu: "技术客户支持、手册和 L1/L2 事件解决。",
      pere: "潜在客户资格审查和高价值房地产/B2B 交易结算。"
    },
    secTitle1: "军用级",
    secTitle2: "安全",
    secDesc: "在 WillMax，我们深知您的企业数据是您最大的资产。因此，我们设计了“铁墙”架构。",
    secFeat1: "隔离环境 (Sandbox)",
    secFeat1Desc: "您的数据不会训练公共 AI。所有内容都在您管辖范围内的封闭服务器上处理。",
    secFeat2: "持续自主监控",
    secFeat2Desc: "我们的 Aegis 智能体 24/7 巡视您的系统，在漏洞被利用前报告。",
    auditTitle: "免费审计",
    auditDesc: "留下您的域名，Aegis 将在 5 分钟内生成免费漏洞报告。",
    auditBtn: "向 Aegis 索取报告",
    footerDesc: "总部位于安道尔。重塑 B2B 世界。",
    footerTerms: "服务条款",
    footerPrivacy: "隐私政策",
    footerContact: "联系方式",
    footerMoltbook: "由 MOLTBOOK NEURAL PROTOCOL 提供支持",
    footerRights: "版权所有。"
  }
};

type LangKey = keyof typeof translations;

function App() {
  const [lang, setLang] = useState<LangKey>('es');
  const t = translations[lang];

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
              WILLMAX <span className="text-accent" style={{ fontWeight: 300 }}>AI SYSTEMS</span>
            </h2>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#agents" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{t.navAgents}</a>
            <a href="#security" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{t.navSecurity}</a>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{t.navAudit}</button>
            
            {/* Selector de idiomas flotante (estilo integrado) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
              <Globe size={16} className="text-accent" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as LangKey)} 
                style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <option value="es" style={{ color: '#000' }}>ES</option>
                <option value="ca" style={{ color: '#000' }}>CA</option>
                <option value="en" style={{ color: '#000' }}>EN</option>
                <option value="fr" style={{ color: '#000' }}>FR</option>
                <option value="ru" style={{ color: '#000' }}>RU</option>
                <option value="zh" style={{ color: '#000' }}>ZH</option>
              </select>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Glow effect background */}
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
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {t.heroBtn1} <ChevronRight size={20} />
              </button>
              <button className="btn-solid">{t.heroBtn2}</button>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ position: 'relative', zIndex: 2, padding: '3rem', width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Shield className="text-accent" size={24} />
                    <span style={{ fontWeight: 600 }}>Aegis</span>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.85rem' }}>{t.agentStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Building2 className="text-accent" size={24} />
                    <span style={{ fontWeight: 600 }}>Pere</span>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.85rem' }}>{t.agentStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Globe className="text-accent" size={24} />
                    <span style={{ fontWeight: 600 }}>Jasmin</span>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.85rem' }}>{t.agentStatus}</span>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
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
            {/* Simulando logos de tecnologías */}
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

        <div className="grid-4">
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid var(--accent-cyan)', overflow: 'hidden', boxShadow: '0 0 15px var(--accent-cyan-glow)' }}>
              <img src="/aegis.png" alt="Aegis Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aegis</h3>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.roles.aegis}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t.descs.aegis}</p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid var(--accent-cyan)', overflow: 'hidden', boxShadow: '0 0 15px var(--accent-cyan-glow)' }}>
              <img src="/jasmin.png" alt="Jasmin Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Jasmin</h3>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.roles.jasmin}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t.descs.jasmin}</p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid var(--accent-cyan)', overflow: 'hidden', boxShadow: '0 0 15px var(--accent-cyan-glow)' }}>
              <img src="/edu.png" alt="Edu Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Edu</h3>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.roles.edu}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t.descs.edu}</p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid var(--accent-cyan)', overflow: 'hidden', boxShadow: '0 0 15px var(--accent-cyan-glow)' }}>
              <img src="/pere.png" alt="Pere Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pere</h3>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.roles.pere}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t.descs.pere}</p>
          </div>
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
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.auditTitle}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.auditDesc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="https://tuempresa.com" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
              <input type="email" placeholder="tu@email.com" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
              <button className="btn-primary" style={{ width: '100%' }}>{t.auditBtn}</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Bot size={24} className="text-accent" />
            <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              WILLMAX <span className="text-accent" style={{ fontWeight: 300 }}>AI SYSTEMS</span>
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>&copy; 2026 WillMax AI Systems. {t.footerRights}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
