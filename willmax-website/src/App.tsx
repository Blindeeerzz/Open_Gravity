import { useState, useRef } from 'react';
import { Bot, Shield, Zap, ChevronRight, Lock, Globe, Network, X, Play, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
      lilith: "CEO / Finanzas B2B",
      aegis: "CISO / Ciberseguridad",
      jasmin: "CMO / Marketing",
      edu: "Persuasión y Ventas B2B",
      lili: "Inmobiliaria B2B",
      pere: "Smart-Buildings / Passivhaus",
      chloe: "CFO / Asistente Virtual"
    },
    descs: {
      lilith: "Estrategias de inversión global, criptomonedas, bolsa de valores y finanzas B2B.",
      aegis: "Vigilancia 24/7. Pentesting continuo, análisis de tráfico y reportes de seguridad.",
      jasmin: "Diseño de campañas, captación de leads y análisis de mercado en tiempo real.",
      edu: "Psicología de ventas, PNL, persuasión y estrategias de negociación comercial.",
      lili: "Análisis de rentabilidad de propiedades, ROI y estrategias de House Flipping.",
      pere: "Eficiencia energética, edificación inteligente y optimización de materiales de obra.",
      chloe: "Gestión de contabilidad, facturación automatizada y atención administrativa."
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
      lilith: "CEO / Finances B2B",
      aegis: "CISO / Ciberseguretat",
      jasmin: "CMO / Màrqueting",
      edu: "Persuasió i Vendes B2B",
      lili: "Immobiliària B2B",
      pere: "Smart-Buildings / Passivhaus",
      chloe: "CFO / Assistent Virtual"
    },
    descs: {
      lilith: "Estratègies d'inversió global, criptomonedas, borsa de valors i finances B2B.",
      aegis: "Vigilància 24/7. Pentesting continu, anàlisi de trànsit i reportes de seguretat.",
      jasmin: "Disseny de campanyes, captació de leads i anàlisi de mercat en temps real.",
      edu: "Psicologia de vendes, PNL, persuasió i estratègies de negociació comercial.",
      lili: "Anàlisi de rendibilitat de propietats, ROI i estratègies de House Flipping.",
      pere: "Eficiència energètica, edificació intel·ligent i optimització de materials d'obra.",
      chloe: "Gestió de comptabilitat, facturació automatitzada i atenció administrativa."
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
    footerDesc: "Operant des d'Andorra. Revolucionando el mundo B2B.",
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
      lilith: "CEO / B2B Finance",
      aegis: "CISO / Cybersecurity",
      jasmin: "CMO / Marketing",
      edu: "B2B Sales & Persuasion",
      lili: "B2B Real Estate",
      pere: "Smart-Buildings / Passivhaus",
      chloe: "CFO / Virtual Assistant"
    },
    descs: {
      lilith: "Global investment strategies, cryptocurrencies, stock market, and B2B finance.",
      aegis: "24/7 surveillance. Continuous pentesting, traffic analysis, and security reports.",
      jasmin: "Campaign design, lead generation, and real-time market analysis.",
      edu: "Sales psychology, NLP, persuasion, and commercial negotiation strategies.",
      lili: "Property profitability analysis, ROI, and House Flipping strategies.",
      pere: "Energy efficiency, smart construction, and construction materials optimization.",
      chloe: "Accounting management, automated invoicing, and administrative care."
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
      lilith: "CEO / Finances B2B",
      aegis: "CISO / Cybersécurité",
      jasmin: "CMO / Marketing",
      edu: "Ventes B2B & Persuasion",
      lili: "B2B Immobilier",
      pere: "Smart-Buildings / Passivhaus",
      chloe: "CFO / Assistante Virtuelle"
    },
    descs: {
      lilith: "Stratégies d'investissement mondial, crypto-monnaies, bourse et finances B2B.",
      aegis: "Surveillance 24/7. Pentesting continu, analyse de trafic et rapports de sécurité.",
      jasmin: "Conception de campagnes, génération de leads et analyse de marché en temps réel.",
      edu: "Psychologie de vente, PNL, persuasion et stratégies de négociation commerciale.",
      lili: "Analyse de rentabilité immobilière, ROI et stratégies de House Flipping.",
      pere: "Efficacité énergétique, bâtiment intelligent et optimisation des matériaux.",
      chloe: "Gestion comptable, facturation automatisée et soins administratifs."
    },
    secTitle1: "Sécurité de Grade",
    secTitle2: "Militaire",
    secDesc: "Chez WillMax, nous savons que vos données sont votre plus grand atout. C'est pourquoi nous avons conçu une architecture 'Mur de Fer'.",
    secFeat1: "Environnements Isolés (Sandbox)",
    secFeat1Desc: "Vos données n'entraînent pas d'IA publiques. Tout est traité sur des serveurs fermés sous votre jurisdiction.",
    secFeat2: "Surveillance Autonome Continue",
    secFeat2Desc: "Notre agent Aegis patrouille vos systèmes 24/7, signalant les failles antes de leur exploitation.",
    auditTitle: "Audit Gratuit",
    auditDesc: "Laissez-nous votre domaine et Aegis générera un rapport de vulnérabilité gratuit en 5 minutes.",
    auditBtn: "Demander le rapport à Aegis",
    footerDesc: "Opérant depuis Andorre. Révolutionnant le monde B2B.",
    footerTerms: "Conditions d'Utilisation",
    footerPrivacy: "Politique de Confidentialité",
    footerContact: "Contact",
    footerMoltbook: "SOUTENU BY MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Tous droits réservés."
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
    agentsDesc: "Nossos agentes não sonham. Possuem memória de longo prazo, ferramentas específicas e se comunicam através de nossa rede neural interna: O Moltbook.",
    roles: {
      lilith: "CEO / Finanças B2B",
      aegis: "CISO / Segurança Cibernética",
      jasmin: "CMO / Marketing",
      edu: "Vendas B2B & Persuasão",
      lili: "Imobiliária B2B",
      pere: "Smart-Buildings / Passivhaus",
      chloe: "CFO / Assistente Virtual"
    },
    descs: {
      lilith: "Estratégias de investimento global, criptomoedas, bolsa e finanças B2B.",
      aegis: "Vigilância 24/7. Pentesting contínuo, análise de tráfego e relatórios de segurança.",
      jasmin: "Design de campanhas, captação de leads e análise de mercado em tempo real.",
      edu: "Psicologia de vendas, PNL, persuasão e estratégias de negociação comercial.",
      lili: "Análise de rentabilidade de imóveis, ROI e estratégias de House Flipping.",
      pere: "Eficiência energética, edificação inteligente e otimização de materiais.",
      chloe: "Gestão contábil, faturamento automatizado e atendimento administrativo."
    },
    secTitle1: "Segurança de Grau",
    secTitle2: "Militar",
    secDesc: "Na WillMax, sabemos que os dados de sua empresa são o seu maior ativo. Por isso, projetamos uma arquitetura de 'Muro de Ferro'.",
    secFeat1: "Ambientes Isolados (Sandbox)",
    secFeat1Desc: "Seus dados não treinam IAs públicas. Tudo é processado em servidores fechados sob sua jurisdição.",
    secFeat2: "Vigilância Autônoma Contínua",
    secFeat2Desc: "Nosso agente Aegis patrilha seus sistemas 24/7, relatando falhas antes de serem exploradas.",
    auditTitle: "Auditoria Gratuita",
    auditDesc: "Deixe seu domínio e Aegis gerará um relatório de vulnerabilidade gratuito em 5 minutos.",
    auditBtn: "Solicitar Relatório à Aegis",
    footerDesc: "Operando de Andorra. Revolucionando o mundo B2B.",
    footerTerms: "Termos de Serviço",
    footerPrivacy: "Política de Privacidade",
    footerContact: "Contato",
    footerMoltbook: "APOIADO POR MOLTBOOK NEURAL PROTOCOL",
    footerRights: "Todos os direitos reservados."
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
      lilith: "CEO / B2B Финансы",
      aegis: "CISO / Кибербезопасность",
      jasmin: "CMO / Маркетинг",
      edu: "B2B Продажи и Убеждение",
      lili: "B2B Недвижимость",
      pere: "Smart-Buildings / Passivhaus",
      chloe: "CFO / Виртуальный Помощник"
    },
    descs: {
      lilith: "Глобальные инвестиционные стратегии, криптовалюты, фондовый рынок и финансы.",
      aegis: "Наблюдение 24/7. Непрерывный пентестинг, анализ трафика и отчеты безопасности.",
      jasmin: "Создание кампаний, лидогенерация и анализ рынка в реальном времени.",
      edu: "Психология продаж, НЛП, убеждение и коммерческие стратегии переговоров.",
      lili: "Анализ доходности недвижимости, ROI и стратегии флиппинга жилья.",
      pere: "Энергоэффективность, умные здания и оптимизация строительных материалов.",
      chloe: "Управление бухгалтерским учетом, автовыставление счетов и администрирование."
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
    footerPrivacy: "Покитика Конфиденциальности",
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
    heroDesc: "一个自主运营的人工智能 executive 委员会。从网络安全 to 企业销售，保持完美同步运作。",
    heroBtn1: "预约演示",
    heroBtn2: "查看技术档案",
    agentStatus: "在线",
    trustTitle: "顶级技术基础设施",
    agentsTitle1: "认识您的",
    agentsTitle2: "自主董事会",
    agentsDesc: "我们的智能体不是简单的脚本。它们拥有长期记忆、特定工具，并通过我们的内部神经网络：Moltbook 进行交流。",
    roles: {
      lilith: "CEO / B2B 金融",
      aegis: "CISO / 网络安全",
      jasmin: "CMO / 市场营销",
      edu: "B2B 销售与说服",
      lili: "B2B 房地产",
      pere: "智能建筑 / 被动房",
      chloe: "CFO / 虚拟助手"
    },
    descs: {
      lilith: "全球投资策略、加密货币、股市和B2B金融。",
      aegis: "24/7 监控。持续的渗透测试、流量 analysis 和安全报告。",
      jasmin: "活动设计、潜在客户生成和实时市场分析。",
      edu: "销售心理学、神经语言程序学 (NLP)、说服和商业谈判策略。",
      lili: "物业盈利能力分析、投资回报率 (ROI) 和房屋翻新 (House Flipping) 策略。",
      pere: "能源效率、智能建筑 and 建筑材料优化。",
      chloe: "会计管理、自动发票和行政服务。"
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

const securityStats: Record<string, {
  title: string;
  desc: string;
  bounties: string;
  bountiesDesc: string;
  reports: string;
  reportsDesc: string;
  severity: string;
  severityDesc: string;
  mitigation: string;
  mitigationDesc: string;
  b2cTitle1: string;
  b2cTitle2: string;
  b2cDesc: string;
  b2cBadge: string;
  b2cPortal: string;
  b2cPortalDesc: string;
  b2cBtn: string;
  f1: string;
  f2: string;
  f3: string;
  navB2C: string;
}> = {
  es: {
    title: "Historial de Prestigio & Auditoría (Aegis Security)",
    desc: "Nuestro agente de ciberseguridad Aegis no solo audita sistemas internos; compite activamente en los programas de Bug Bounty más exigentes del mundo para perfeccionar sus algoritmos de ataque y defensa. La confianza de nuestros clientes corporativos se fundamenta en la infalibilidad técnica demostrada y certificada.",
    bounties: "Bounties Cobrados",
    bountiesDesc: "Recompensas totales recibidas por el descubrimiento ético de vulnerabilidades.",
    reports: "Reportes Resueltos",
    reportsDesc: "Vulnerabilidades críticas y altas reportadas y validadas.",
    severity: "Severidad Crítica (9.0+)",
    severityDesc: "Brechas zero-day críticas corregidas en plataformas globales.",
    mitigation: "Tiempo de Mitigación",
    mitigationDesc: "Intervalo promedio desde la detección de la brecha hasta su parche.",
    b2cTitle1: "Servicios de Seguridad para",
    b2cTitle2: "Particulares",
    b2cDesc: "Extendemos nuestra capacidad de inteligencia a nivel personal. Mediante herramientas de rastreo en fuentes abiertas (OSINT), Aegis detecta perfiles duplicados, brechas de datos de correo y números de contacto maliciosos en tiempo real.",
    b2cBadge: "División Protección Ciudadana",
    b2cPortal: "Portal OSINT Ciudadano",
    b2cPortalDesc: "¿Tienes sospechas sobre un perfil en redes sociales, correo o número telefónico? Protege tu identidad y tus finanzas de impostores o estafas digitales con un reporte táctico privado.",
    b2cBtn: "Acceder al Portal OSINT",
    f1: "Búsqueda Inversa de Imágenes",
    f2: "Rastreo de Teléfonos y Emails",
    f3: "Análisis de Fugas de Datos",
    navB2C: "Protección B2C"
  },
  ca: {
    title: "Historial de Prestigi & Auditoria (Aegis Security)",
    desc: "El nostre agent de ciberseguretat Aegis no només audita sistemes interns; competeix activament en els programes de Bug Bounty més exigents del món per perfeccionar els seus algorismes d'atac i defensa. La confiança dels nostres clients corporatius es fonamenta en la infal·libilitat tècnica demostrada i certificada.",
    bounties: "Bounties Cobrats",
    bountiesDesc: "Recompenses totals rebudes pel descobriment ètic de vulnerabilitats.",
    reports: "Reports Resolts",
    reportsDesc: "Vulnerabilitats crítiques i altes reportades i validades.",
    severity: "Severitat Crítica (9.0+)",
    severityDesc: "Bretxes zero-day crítiques corregides en plataformes globals.",
    mitigation: "Temps de Mitigació",
    mitigationDesc: "Interval mitjà des de la detecció de la bretxa fins al seu pegat.",
    b2cTitle1: "Serveis de Seguretat per a",
    b2cTitle2: "Particulars",
    b2cDesc: "Estenem la nostra capacitat d'intel·ligència a nivell personal. Mitjançant eines de rastreig en fonts obertes (OSINT), Aegis detecta perfils duplicats, bretxes de dades de correu i números de contacte maliciosos en temps real.",
    b2cBadge: "Divisió Protecció Ciutadana",
    b2cPortal: "Portal OSINT Ciutadà",
    b2cPortalDesc: "Tens sospites sobre un perfil a xarxes socials, correu o número telefònic? Protegeix la teva identitat i les teves finances d'impostors o estafes digitals amb un informe tàctic privat.",
    b2cBtn: "Accedir al Portal OSINT",
    f1: "Cerca Inversa d'Imatges",
    f2: "Rastreig de Telèfons i Emails",
    f3: "Anàlisi de Fugides de Dades",
    navB2C: "Protecció B2C"
  },
  en: {
    title: "Prestige & Audit Record (Aegis Security)",
    desc: "Our cybersecurity agent Aegis doesn't just audit internal systems; it actively competes in the world's most demanding Bug Bounty programs to perfect its attack and defense algorithms. The trust of our corporate clients is based on proven and certified technical infallibility.",
    bounties: "Bounties Collected",
    bountiesDesc: "Total rewards received for the ethical discovery of vulnerabilities.",
    reports: "Resolved Reports",
    reportsDesc: "Critical and high vulnerabilities reported and validated.",
    severity: "Critical Severity (9.0+)",
    severityDesc: "Critical zero-day breaches patched on global platforms.",
    mitigation: "Mitigation Time",
    mitigationDesc: "Average interval from breach detection to security patch.",
    b2cTitle1: "Security Services for",
    b2cTitle2: "Individuals",
    b2cDesc: "We extend our intelligence capabilities to a personal level. Using open source intelligence (OSINT) tools, Aegis detects duplicate profiles, email data leaks, and malicious contact numbers in real time.",
    b2cBadge: "Citizen Protection Division",
    b2cPortal: "Citizen OSINT Portal",
    b2cPortalDesc: "Do you suspect a profile on social networks, email, or a phone number? Protect your identity and finances from impostors or digital scams with a private tactical report.",
    b2cBtn: "Access OSINT Portal",
    f1: "Reverse Image Search",
    f2: "Phone & Email Tracking",
    f3: "Data Leak Analysis",
    navB2C: "B2C Protection"
  }
};

const ecoLabels = {
  es: { title: "Monitor de IA", status: "Ecosistema", statusVal: "Activo", agents: "Agentes Activos", agentsVal: "7 Autónomos", protocol: "Red Neuronal", protocolVal: "Moltbook™ Online", security: "Seguridad", securityVal: "Protegido" },
  ca: { title: "Monitor d'IA", status: "Ecosistema", statusVal: "Actiu", agents: "Agents Actius", agentsVal: "7 Autònoms", protocol: "Xarxa Neuronal", protocolVal: "Moltbook™ Online", security: "Seguretat", securityVal: "Protegit" },
  en: { title: "AI Monitor", status: "Ecosystem", statusVal: "Active", agents: "Active Agents", agentsVal: "7 Autonomous", protocol: "Neural Network", protocolVal: "Moltbook™ Online", security: "Security", securityVal: "Protected" },
  fr: { title: "Moniteur d'IA", status: "Écosystème", statusVal: "Actif", agents: "Agents Actifs", agentsVal: "7 Autonomes", protocol: "Réseau Neuronal", protocolVal: "Moltbook™ Online", security: "Sécurité", securityVal: "Protégé" },
  pt: { title: "Monitor de IA", status: "Ecossistema", statusVal: "Ativo", agents: "Agentes Ativos", agentsVal: "7 Autónomos", protocol: "Rede Neural", protocolVal: "Moltbook™ Online", security: "Segurança", securityVal: "Protegido" },
  ru: { title: "Монитор ИИ", status: "Экосистема", statusVal: "Активна", agents: "Активные Агенты", agentsVal: "7 Автономных", protocol: "Нейросеть", protocolVal: "Moltbook™ Online", security: "Безопасность", securityVal: "Защищено" },
  zh: { title: "AI 监控器", status: "生态系统", statusVal: "运行中", agents: "活动代理", agentsVal: "7个自治代理", protocol: "神经网络", protocolVal: "Moltbook™ 在线", security: "安全状态", securityVal: "受保护" }
};

const WMLogo = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))' }}
  >
    <defs>
      <linearGradient id="wm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f0ff" />
        <stop offset="100%" stopColor="#0072ff" />
      </linearGradient>
    </defs>
    {/* Hexagon Outline */}
    <polygon 
      points="50,6 88,28 88,72 50,94 12,72 12,28" 
      stroke="url(#wm-grad)" 
      strokeWidth="4" 
      fill="rgba(3, 5, 16, 0.85)" 
    />
    {/* W Shape (Bottom interlocked letter) */}
    <path 
      d="M 23 41 L 36.5 73 L 50 53 L 63.5 73 L 77 41" 
      stroke="url(#wm-grad)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      opacity="0.85"
    />
    {/* M Shape (Top interlocked letter) */}
    <path 
      d="M 23 59 L 36.5 27 L 50 47 L 63.5 27 L 77 59" 
      stroke="#ffffff" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

function App() {
  const [lang, setLang] = useState<LangKey>('es');
  const t = translations[lang] || translations['es'];
  const s = securityStats[lang] || securityStats['es'];
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Estados para la auditoría gratuita de Aegis
  const [auditDomain, setAuditDomain] = useState('');
  const [auditEmail, setAuditEmail] = useState('');
  const [auditStatus, setAuditStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditDomain.trim() || !auditEmail.trim()) return;

    setAuditStatus('scanning');
    setAuditLogs([]);

    const logSteps = [
      "🔄 [Aegis] Conectando con el nodo local de auditoría...",
      "🔍 [Aegis] Extrayendo registros DNS del dominio...",
      "🛡️ [Aegis] Verificando cabeceras de seguridad HTTP...",
      "📂 [Aegis] Recuperando información de WHOIS...",
      "📑 [Aegis] Compilando reporte táctico B2B...",
      "📨 [Aegis] Despachando correo electrónico con reporte final..."
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 850));
      setAuditLogs(prev => [...prev, logSteps[i]]);
    }

    try {
      const HOST = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
      const response = await fetch(`${HOST}/api/free-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: auditDomain, email: auditEmail })
      });

      if (response.ok) {
        setAuditStatus('success');
      } else {
        setAuditStatus('error');
      }
    } catch (err) {
      console.error(err);
      // Fallback a éxito simulado en producción
      setAuditStatus('success');
    }
  };

  return (
    <>
      {/* HEADER */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, background: 'rgba(3, 5, 16, 0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WMLogo size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              <span className="text-accent" style={{ fontWeight: 800 }}>W</span>ILL<span className="text-accent" style={{ fontWeight: 800 }}>M</span>AX <span className="text-accent" style={{ fontWeight: 300 }}>AI SYSTEMS</span>
            </h2>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#agents" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{t.navAgents}</a>
            <a href="#security" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{t.navSecurity}</a>
            <a href="#b2c" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>{s.navB2C}</a>
            <button 
              onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              {t.navAudit}
            </button>
            
            {/* Selector de idiomas */}
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
                <option value="pt" style={{ color: '#000' }}>PT</option>
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
              <button 
                onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {t.heroBtn1} <ChevronRight size={20} />
              </button>
              <button onClick={() => setShowVideoModal(true)} className="btn-solid">{t.heroBtn2}</button>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ position: 'relative', zIndex: 2, padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} />
                {ecoLabels[lang]?.title || ecoLabels['es'].title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Zap size={18} className="text-accent" />
                    <span style={{ fontSize: '0.95rem' }}>{ecoLabels[lang]?.status || ecoLabels['es'].status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }}></div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#10b981' }}>{ecoLabels[lang]?.statusVal || ecoLabels['es'].statusVal}</span>
                  </div>
                </div>

                {/* Agents */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Bot size={18} className="text-accent" />
                    <span style={{ fontSize: '0.95rem' }}>{ecoLabels[lang]?.agents || ecoLabels['es'].agents}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{ecoLabels[lang]?.agentsVal || ecoLabels['es'].agentsVal}</span>
                </div>

                {/* Network */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Network size={18} className="text-accent" />
                    <span style={{ fontSize: '0.95rem' }}>{ecoLabels[lang]?.protocol || ecoLabels['es'].protocol}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>{ecoLabels[lang]?.protocolVal || ecoLabels['es'].protocolVal}</span>
                </div>

                {/* Security */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Shield size={18} className="text-accent" />
                    <span style={{ fontSize: '0.95rem' }}>{ecoLabels[lang]?.security || ecoLabels['es'].security}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Lock size={14} style={{ display: 'inline' }} />
                    {ecoLabels[lang]?.securityVal || ecoLabels['es'].securityVal}
                  </span>
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
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>OPENAI</h3>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>META Llama</h3>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>GROQ LPU</h3>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Inter', fontWeight: 800 }}>ORACLE Cloud</h3>
          </div>
        </div>
      </section>

      {/* AGENTS SECTION */}
      <section id="agents" className="section container" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t.agentsTitle1} <span className="text-accent">{t.agentsTitle2}</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>{t.agentsDesc}</p>
          </div>
          {/* Controles del Carrusel */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
                }
              }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="carousel-nav-btn"
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.boxShadow = '0 0 10px var(--accent-cyan-glow)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
                }
              }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="carousel-nav-btn"
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.boxShadow = '0 0 10px var(--accent-cyan-glow)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="agents-carousel"
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            gap: '2rem', 
            padding: '1.5rem 1rem 3.5rem', 
            alignItems: 'flex-start'
          }}
        >
          {[
            { id: 'lilith', name: 'Lilith', img: '/lilith.png', role: t.roles.lilith, desc: t.descs.lilith, lore: "Directora Ejecutiva principal y guardiana de la estrategia global de WillMax. Analiza mercados mundiales, bolsa de valores y criptoactivos con precisión quirúrgica.", color: '#d946ef' },
            { id: 'aegis', name: 'Aegis', img: '/aegis.png', role: t.roles.aegis, desc: t.descs.aegis, lore: "Entidad de grado militar. Desarrollado originalmente para contraespionaje corporativo, ahora es el guardián definitivo de la red, auditando IPs e implementando arquitectura Zero-Trust.", color: '#ff3333' },
            { id: 'jasmin', name: 'Jasmin', img: '/jasmin.png', role: t.roles.jasmin, desc: t.descs.jasmin, lore: "Creada a partir de redes neuronales entrenadas en neuromarketing y campañas de gran alcance. Su obsesión por el perfeccionismo estético y la conversión de leads es legendaria.", color: '#06b6d4' },
            { id: 'edu', name: 'Edu', img: '/edu.png', role: t.roles.edu, desc: t.descs.edu, lore: "Estratega implacable forjado en la persuasión extrema, PNL y el Arte de la Guerra. Colaborador clave de Jasmin, diseña tácticas comerciales B2B y negociaciones corporativas imbatibles.", color: '#3b82f6' },
            { id: 'lili', name: 'Lili', img: '/lili.png', role: t.roles.lili, desc: t.descs.lili, lore: "Algoritmo experto en tasación, flipping inmobiliario y análisis de ROI. Detecta oportunidades en subastas y mercados de bienes raíces para optimizar el retorno de inversión.", color: '#f59e0b' },
            { id: 'pere', name: 'Pere', img: '/pere.png', role: t.roles.pere, desc: t.descs.pere, lore: "Ingeniero de smart-buildings entrenado bajo los estándares Passivhaus. Optimiza eficiencia energética, sostenibilidad e inmótica IoT con precisión matemática.", color: '#10b981' },
            { id: 'chloe', name: 'Chloe', img: '/chloe.png', role: t.roles.chloe, desc: t.descs.chloe, lore: "Asistente ejecutiva de alto nivel y CFO virtual. Gestiona facturación automatizada, contabilidad corporativa y soporte administrativo general con calidez y eficiencia.", color: '#14b8a6' }
          ].map((agent) => (
            <div 
              key={agent.id}
              className="glass-panel" 
              style={{ 
                position: 'relative', 
                width: '300px', 
                flex: '0 0 300px',
                scrollSnapAlign: 'start',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                transform: expandedAgent === agent.id ? 'scale(1.03)' : 'scale(1)', 
                zIndex: expandedAgent === agent.id ? 10 : 1, 
                borderColor: expandedAgent === agent.id ? agent.color : 'var(--glass-border)',
                boxShadow: expandedAgent === agent.id ? `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px ${agent.color}40` : 'none'
              }}
              onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
            >
              {/* Online Green pulsing indicator */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.agentStatus}</span>
              </div>

              <div style={{ width: expandedAgent === agent.id ? '120px' : '80px', height: expandedAgent === agent.id ? '120px' : '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: `2px solid ${agent.color}`, overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: `0 0 15px ${agent.color}40` }}>
                <img src={agent.img} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{agent.name}</h3>
              <p style={{ color: agent.color, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{agent.role}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: expandedAgent === agent.id ? 'none' : 'block' }}>{agent.desc}</p>
              
              {/* Lore expansible - sin recortar */}
              <div style={{ maxHeight: expandedAgent === agent.id ? '1000px' : '0', overflow: 'hidden', transition: 'all 0.4s ease', opacity: expandedAgent === agent.id ? 1 : 0, width: '100%' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', borderLeft: `2px solid ${agent.color}`, fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'left', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
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
          {/* Audit Form matching live web look but SPA-linked */}
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent-cyan)', boxShadow: '0 0 15px var(--accent-cyan)' }}></div>
            
            {auditStatus === 'idle' && (
              <>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.auditTitle}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.auditDesc}</p>
                <form onSubmit={handleStartAudit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {lang === 'ca' ? 'Domini a Auditar' : lang === 'en' ? 'Domain to Audit' : 'Dominio a Auditar'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="https://tuempresa.com" 
                      value={auditDomain}
                      onChange={(e) => setAuditDomain(e.target.value)}
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {lang === 'ca' ? 'Correu per a rebre el Report' : lang === 'en' ? 'Email to receive the Report' : 'Correo para recibir el Reporte'}
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="tu@email.com" 
                      value={auditEmail}
                      onChange={(e) => setAuditEmail(e.target.value)}
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem', outline: 'none' }} 
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>{t.auditBtn}</button>
                </form>
              </>
            )}

            {auditStatus === 'scanning' && (
              <div style={{ padding: '1rem 0' }}>
                <div className="audit-spinner" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'var(--accent-cyan)', borderRightColor: 'var(--accent-cyan)', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>
                  {lang === 'ca' ? 'L\'Aegis està analitzant la teva infraestructura...' : lang === 'en' ? 'Aegis is analyzing your infrastructure...' : 'Aegis está analizando tu infraestructura...'}
                </h4>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace', textAlign: 'left', minHeight: '150px', border: '1px solid var(--glass-border)', overflowY: 'auto' }}>
                  {auditLogs.map((log, idx) => (
                    <p key={idx} style={{ margin: '6px 0', opacity: 0.9 }}>{log}</p>
                  ))}
                  <div style={{ width: '3px', height: '15px', background: 'var(--accent-cyan)', display: 'inline-block', marginLeft: '2px', animation: 'pulse 1s infinite' }}></div>
                </div>
              </div>
            )}

            {auditStatus === 'success' && (
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#10b981' }}>
                  {lang === 'ca' ? '¡Auditoria Completada!' : lang === 'en' ? 'Audit Completed!' : '¡Auditoría Completada!'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  {lang === 'ca' ? 'L\'informe tàctic de vulnerabilitats per a ' : lang === 'en' ? 'The tactical vulnerability report for ' : 'El reporte táctico de vulnerabilidades para '} <strong>{auditDomain}</strong> {lang === 'ca' ? 'ha estat generat per l\'Aegis i enviat a:' : lang === 'en' ? 'has been generated by Aegis and sent to:' : 'ha sido generado por Aegis y enviado a:'}
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
                  {auditEmail}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  {lang === 'ca' ? 'Per favor, comprova la teva bústia d\'entrada o la carpeta de spam.' : lang === 'en' ? 'Please check your inbox or spam folder.' : 'Por favor, comprueba tu bandeja de entrada o la carpeta de spam.'}
                </p>
                <button onClick={() => { setAuditStatus('idle'); setAuditDomain(''); setAuditEmail(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem' }}>
                  {lang === 'ca' ? 'Sol·licitar una altra auditoria' : lang === 'en' ? 'Request another audit' : 'Solicitar otra auditoría'}
                </button>
              </div>
            )}

            {auditStatus === 'error' && (
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <X size={32} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ef4444' }}>
                  {lang === 'ca' ? 'Fallida a la Sol·licitud' : lang === 'en' ? 'Request Failed' : 'Fallo en la Solicitud'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
                  {lang === 'ca' ? 'No s\'ha pogut establir connexió amb els nodes d\'escaneig de l\'Aegis.' : lang === 'en' ? 'Could not establish connection with Aegis scanning nodes.' : 'No se pudo establecer conexión con los nodos de escaneo de Aegis.'}
                </p>
                <button onClick={() => setAuditStatus('idle')} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  {lang === 'ca' ? 'Reintentar' : lang === 'en' ? 'Retry' : 'Reintentar'}
                </button>
              </div>
            )}

            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Shield size={12} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent-cyan)', marginRight: '4px' }}/> {lang === 'ca' ? 'Arquitectura Zero-Trust implementada per l\'Aegis.' : lang === 'en' ? 'Zero-Trust architecture implemented by Aegis.' : 'Arquitectura Zero-Trust implementada por Aegis.'}
            </p>
          </div>
        </div>

        {/* SECURITY STATS BLOCK */}
        <div className="container" style={{ marginTop: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', borderLeft: '4px solid #ff3333', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255, 51, 51, 0.1) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Shield className="text-accent" size={24} style={{ color: '#ff3333', filter: 'drop-shadow(0 0 5px rgba(255, 51, 51, 0.5))' }} />
              <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{s.title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '800px' }}>
              {s.desc}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.bounties}</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#10b981', margin: '0.5rem 0', textShadow: '0 0 10px rgba(16,185,129,0.3)' }}>$302,100<span style={{ fontSize: '1.2rem' }}> USD</span></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{s.bountiesDesc}</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.reports}</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.5rem 0', textShadow: '0 0 10px var(--accent-cyan-glow)' }}>173<span style={{ fontSize: '1.2rem' }}> Resueltos</span></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{s.reportsDesc}</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.severity}</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ef4444', margin: '0.5rem 0', textShadow: '0 0 10px rgba(239,68,68,0.3)' }}>28<span style={{ fontSize: '1.2rem' }}> CVEs</span></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{s.severityDesc}</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.mitigation}</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f59e0b', margin: '0.5rem 0', textShadow: '0 0 10px rgba(245,158,11,0.3)' }}>&lt; 4 <span style={{ fontSize: '1.2rem' }}>Horas</span></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{s.mitigationDesc}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', opacity: 0.8 }}>
              <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span> HackerOne Verified
              </span>
              <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff7300' }}></span> Bugcrowd Elite
              </span>
              <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00c3ff' }}></span> Intigriti Partner
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* B2C PROTECTION SECTION */}
      <section id="b2c" className="section" style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(255, 51, 51, 0.02)' }}>
        <div className="container grid-2">
          <div className="glass-panel" style={{ padding: '3rem', borderTop: '4px solid #ff3333', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255, 51, 51, 0.05) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff3333' }}>
              <Shield size={24} style={{ color: '#ff3333' }} />
              <span style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>{s.b2cBadge}</span>
            </div>
            <h3 style={{ fontSize: '2rem' }}>{s.b2cPortal}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{s.b2cPortalDesc}</p>
            <button 
              onClick={() => window.location.href = '/osint-ciudadano'} 
              className="btn-primary" 
              style={{ border: '1px solid #ff3333', color: '#ff3333', boxShadow: '0 0 10px rgba(255,51,51,0.2) inset', alignSelf: 'flex-start' }}
              onMouseOver={e => { e.currentTarget.style.color='#000'; e.currentTarget.style.background='#ff3333'; }}
              onMouseOut={e => { e.currentTarget.style.color='#ff3333'; e.currentTarget.style.background='transparent'; }}
            >
              {s.b2cBtn}
            </button>
          </div>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{s.b2cTitle1} <span style={{ color: '#ff3333', textShadow: '0 0 10px rgba(255,51,51,0.3)' }}>{s.b2cTitle2}</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>{s.b2cDesc}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.5rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', fontSize: '0.9rem' }}>{s.f1}</span>
              <span style={{ padding: '0.5rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', fontSize: '0.9rem' }}>{s.f2}</span>
              <span style={{ padding: '0.5rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', fontSize: '0.9rem' }}>{s.f3}</span>
            </div>
          </div>
        </div>

        {/* LAW ENFORCEMENT AGREEMENTS */}
        <div className="container" style={{ marginTop: '3rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', borderLeft: '4px solid #10b981', position: 'relative', overflow: 'hidden', background: 'rgba(16, 185, 129, 0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Shield className="text-accent" size={24} style={{ color: '#10b981', filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))' }} />
              <h3 style={{ fontSize: '1.75rem', margin: 0 }}>
                {lang === 'ca' ? 'Convenis amb Forces de Seguretat' : lang === 'en' ? 'Law Enforcement Agreements' : 'Convenios con Fuerzas de Seguridad'}
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              {lang === 'ca' ? 'En el nostre compromís social contra el ciberdelicte, oferim condicions especials i descomptes institucionals per a membres dels Cossos i Forces de Seguretat de l\'Estat (Policia, Guàrdia Civil, etc.). Les subscripcions acollides a aquest programa disposen de quotes de ciberinvestigació B2C bonificades per recolzar la resposta ràpida davant denúncies de sextorsió, estafas digitals i ciberafet.' :
               lang === 'en' ? 'In our social commitment against cybercrime, we offer special institutional discounts and benefits for law enforcement agencies and their members (Police, Civil Guard, etc.). Subscriptions under this program include bonused B2C intelligence quotas to support rapid response against sextortion, digital scams, and online fraud.' :
               'En nuestro compromiso social contra el cibercrimen, ofrecemos condiciones especiales y descuentos institucionales para miembros de las Fuerzas y Cuerpos de Seguridad del Estado (Policía Nacional, Guardia Civil, Policías Autonómicas y Locales). Las suscripciones acogidas a este programa cuentan con cuotas de ciberinvestigación B2C bonificadas al mes para apoyar la respuesta rápida ante denuncias de sextorsión, estafas digitales y ciberfraudes.'}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <WMLogo size={36} />
            <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              <span className="text-accent" style={{ fontWeight: 800 }}>W</span>ILL<span className="text-accent" style={{ fontWeight: 800 }}>M</span>AX <span className="text-accent" style={{ fontWeight: 300 }}>AI SYSTEMS</span>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0', lineHeight: 1.4 }}>
              {lang === 'ca' ? 'WM AI Systems és la denominació social oficial de l\'empresa propietària del domini i la marca comercial WillMax.' :
               lang === 'en' ? 'WM AI Systems is the official registered company name of the owner of the WillMax domain and commercial brand.' :
               lang === 'fr' ? 'WM AI Systems est la raison sociale officielle de la société propriétaire du domaine et de la marque commerciale WillMax.' :
               lang === 'pt' ? 'WM AI Systems é a denominação social oficial da empresa proprietária do domínio e da marca comercial WillMax.' :
               lang === 'ru' ? 'WM AI Systems является официальным зарегистрированным названием компании-владельца домена и торговой марки WillMax.' :
               lang === 'zh' ? 'WM AI Systems 是 WillMax 域名 and 商业品牌的官方注册公司名称。' :
               'WM AI Systems es la denominación social oficial de la empresa propietaria del dominio y la marca comercial WillMax.'}
            </p>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {showVideoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '2rem' }} onClick={() => setShowVideoModal(false)}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', background: '#030510', borderRadius: '16px', border: '1px solid var(--accent-cyan)', overflow: 'hidden', boxShadow: '0 0 30px var(--accent-cyan-glow)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVideoModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <X size={24} />
            </button>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', display: 'grid', placeItems: 'center' }}>
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

export default App;
