/**
 * ═══════════════════════════════════════════════════════════════════
 * ADAPTA CORE STUDIO - DICIONÁRIO DE TRADUÇÃO COMPLETO
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Sistema de tradução PT/EN para toda a plataforma
 * Versão: 2026.1
 * 
 * ⚠️ REGRA: Apenas textos de interface - NÃO mexe em cores, layouts, estilos
 * ═══════════════════════════════════════════════════════════════════
 */

export type Language = 'pt' | 'en' | 'de';

export interface Translation {
  pt: string;
  en: string;
  de?: string; // Alemão é opcional para permitir adoção gradual
}

export const translations = {
  // ═══════════════════════════════════════════════════════════════════
  // ACTIONS & BUTTONS
  // ═══════════════════════════════════════════════════════════════════
  actions: {
    // Generic actions
    create: { pt: 'Criar', en: 'Create' },
    edit: { pt: 'Editar', en: 'Edit' },
    delete: { pt: 'Excluir', en: 'Delete' },
    save: { pt: 'Salvar', en: 'Save' },
    cancel: { pt: 'Cancelar', en: 'Cancel' },
    close: { pt: 'Fechar', en: 'Close' },
    confirm: { pt: 'Confirmar', en: 'Confirm' },
    submit: { pt: 'Enviar', en: 'Submit' },
    reset: { pt: 'Redefinir', en: 'Reset' },
    clear: { pt: 'Limpar', en: 'Clear' },
    search: { pt: 'Buscar', en: 'Search' },
    filter: { pt: 'Filtrar', en: 'Filter' },
    sort: { pt: 'Ordenar', en: 'Sort' },
    export: { pt: 'Exportar', en: 'Export' },
    import: { pt: 'Importar', en: 'Import' },
    download: { pt: 'Baixar', en: 'Download' },
    upload: { pt: 'Upload', en: 'Upload' },
    back: { pt: 'Voltar', en: 'Back' },
    next: { pt: 'Próximo', en: 'Next' },
    previous: { pt: 'Anterior', en: 'Previous' },
    finish: { pt: 'Finalizar', en: 'Finish' },
    
    // Copy/Paste actions
    copy: { pt: 'Copiar', en: 'Copy' },
    copied: { pt: 'Copiado', en: 'Copied' },
    copyCode: { pt: 'Copiar Código', en: 'Copy Code' },
    copyHtml: { pt: 'Copiar HTML', en: 'Copy HTML' },
    paste: { pt: 'Colar', en: 'Paste' },
    
    // View actions
    view: { pt: 'Visualizar', en: 'View' },
    preview: { pt: 'Pré-visualizar', en: 'Preview' },
    fullscreen: { pt: 'Tela Cheia', en: 'Fullscreen' },
    expand: { pt: 'Expandir', en: 'Expand' },
    collapse: { pt: 'Recolher', en: 'Collapse' },
    
    // Settings actions
    settings: { pt: 'Configurações', en: 'Settings' },
    preferences: { pt: 'Preferências', en: 'Preferences' },
    customize: { pt: 'Personalizar', en: 'Customize' },
    
    // Other
    help: { pt: 'Ajuda', en: 'Help' },
    about: { pt: 'Sobre', en: 'About' },
    feedback: { pt: 'Feedback', en: 'Feedback' },
    share: { pt: 'Compartilhar', en: 'Share' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // GLOBAL / COMUM
  // ═══════════════════════════════════════════════════════════════════
  global: {
    platformName: { pt: 'ADAPTA CORE STUDIO', en: 'ADAPTA CORE STUDIO' },
    adapta: { pt: 'ADAPTA', en: 'ADAPTA' },
    coreStudio: { pt: 'CORE STUDIO', en: 'CORE STUDIO' },
    welcome: { pt: 'Bem-vindo', en: 'Welcome' },
    loading: { pt: 'Carregando...', en: 'Loading...' },
    delete: { pt: 'Excluir', en: 'Delete' },
    edit: { pt: 'Editar', en: 'Edit' },
    create: { pt: 'Criar', en: 'Create' },
    search: { pt: 'Buscar', en: 'Search' },
    filter: { pt: 'Filtrar', en: 'Filter' },
    close: { pt: 'Fechar', en: 'Close' },
    open: { pt: 'Abrir', en: 'Open' },
    settings: { pt: 'Configurações', en: 'Settings' },
    help: { pt: 'Ajuda', en: 'Help' },
    back: { pt: 'Voltar', en: 'Back' },
    next: { pt: 'Próximo', en: 'Next' },
    previous: { pt: 'Anterior', en: 'Previous' },
    confirm: { pt: 'Confirmar', en: 'Confirm' },
    viewAll: { pt: 'Ver Tudo', en: 'View All' },
    seeMore: { pt: 'Ver Mais', en: 'See More' },
    seeLess: { pt: 'Ver Menos', en: 'See Less' },
    export: { pt: 'Exportar', en: 'Export' },
    import: { pt: 'Importar', en: 'Import' },
    download: { pt: 'Baixar', en: 'Download' },
    upload: { pt: 'Enviar', en: 'Upload' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // NAVEGAÇÃO / SIDEBAR
  // ═══════════════════════════════════════════════════════════════════
  navigation: {
    navigation: { pt: 'Navegação', en: 'Navigation' },
    dashboard: { pt: 'Dashboard', en: 'Dashboard' },
    home: { pt: 'Início', en: 'Home' },
    overview: { pt: 'Visão Geral', en: 'Overview' },
    
    // Módulos principais
    brand: { pt: 'Brand', en: 'Brand' },
    marketing: { pt: 'Marketing', en: 'Marketing' },
    tools: { pt: 'Tools', en: 'Tools' },
    coreact: { pt: 'CoreAct', en: 'CoreAct' },
    
    // Brand submenu
    identity: { pt: 'Identidade', en: 'Identity' },
    guidelines: { pt: 'Guidelines', en: 'Guidelines' },
    cartilhas: { pt: 'Cartilhas', en: 'Guides' },
    brandManual: { pt: 'Manual da Marca', en: 'Brand Manual' },
    
    // Marketing submenu
    campaigns: { pt: 'Campanhas', en: 'Campaigns' },
    activeCampaigns: { pt: 'Campanhas Ativas', en: 'Active Campaigns' },
    futureCampaigns: { pt: 'Campanhas Futuras', en: 'Future Campaigns' },
    pastCampaigns: { pt: 'Campanhas Passadas', en: 'Past Campaigns' },
    history: { pt: 'Histórico', en: 'History' },
    documents: { pt: 'Documentos', en: 'Documents' },
    communication: { pt: 'Marketing & Comunicação', en: 'Marketing & Communication' },
    products: { pt: 'Produtos', en: 'Products' },
    visual: { pt: 'Comunicação Visual', en: 'Visual Communication' },
    
    // Tools submenu
    logoCores: { pt: 'Logo & Cores', en: 'Logo & Colors' },
    documentos: { pt: 'Documentos', en: 'Documents' },
    produtosEmbalagens: { pt: 'Produtos & Embalagens', en: 'Products & Packaging' },
    comunicacaoVisual: { pt: 'Comunicação Visual', en: 'Visual Communication' },
    colors: { pt: 'Cores', en: 'Colors' },
    gradients: { pt: 'Gradientes', en: 'Gradients' },
    mascots: { pt: 'Mascotes', en: 'Mascots' },
    instagramPreview: { pt: 'Preview do Insta', en: 'Instagram Preview' },
    analysis: { pt: 'Análise Gráfica', en: 'Graphic Analysis' },
    verdeVoxCore: { pt: 'VerdeVox Core', en: 'VerdeVox Core' },
    operationMap: { pt: 'Mapa da Operação ADAPTA', en: 'ADAPTA Operation Map' },
    sitemap: { pt: 'Mapa do Site', en: 'Site Map' },
    
    // Footer
    backlogControl: { pt: 'Backlog Control', en: 'Backlog Control' },
    toggleSidebar: { pt: 'Alternar Menu', en: 'Toggle Menu' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // STATUS & BADGES
  // ═══════════════════════════════════════════════════════════════════
  status: {
    active: { pt: 'Ativo', en: 'Active' },
    inactive: { pt: 'Inativo', en: 'Inactive' },
    pending: { pt: 'Pendente', en: 'Pending' },
    completed: { pt: 'Concluído', en: 'Completed' },
    inProgress: { pt: 'Em Andamento', en: 'In Progress' },
    draft: { pt: 'Rascunho', en: 'Draft' },
    published: { pt: 'Publicado', en: 'Published' },
    archived: { pt: 'Arquivado', en: 'Archived' },
    new: { pt: 'Novo', en: 'New' },
    comingSoon: { pt: 'em breve', en: 'coming soon' },
    beta: { pt: 'Beta', en: 'Beta' },
    surprise: { pt: 'surpresa', en: 'surprise' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════
  dashboard: {
    title: { pt: 'Central Adapta', en: 'ADAPTA Central' },
    subtitle: { pt: 'Painel unificado de controle e monitoramento', en: 'Unified control and monitoring panel' },
    welcome: { pt: 'Bem-vindo à Central Adapta', en: 'Welcome to Adapta Central' },
    quickAccess: { pt: 'Acesso Rápido', en: 'Quick Access' },
    recentActivity: { pt: 'Atividade Recente', en: 'Recent Activity' },
    statistics: { pt: 'Estatísticas', en: 'Statistics' },
    modules: { pt: 'Módulos', en: 'Modules' },
    
    // Panel & Controls
    panel: { pt: 'Painel', en: 'Panel' },
    controlCenter: { pt: 'Centro de Controle', en: 'Control Center' },
    openPanel: { pt: 'Abrir Painel', en: 'Open Panel' },
    
    // Stats Cards
    activeProjects: { pt: 'Projetos Ativos', en: 'Active Projects' },
    activeCampaigns: { pt: 'Campanhas Ativas', en: 'Active Campaigns' },
    assetsCreated: { pt: 'Assets Criados', en: 'Assets Created' },
    
    // Time periods
    thisWeek: { pt: 'esta semana', en: 'this week' },
    thisMonth: { pt: 'este mês', en: 'this month' },
    planned: { pt: 'planejadas', en: 'planned' },
    
    // Activity
    recentActivities: { pt: 'Atividades Recentes', en: 'Recent Activities' },
    recentActivitiesDesc: { pt: 'Últimas ações na plataforma', en: 'Latest actions on the platform' },
    
    // Backlog section
    backlogControl: { pt: 'Backlog Control Panel', en: 'Backlog Control Panel' },
    backlogDesc: { pt: 'Verificar status de todas as funcionalidades antes da apresentação', en: 'Check status of all features before presentation' },
    features: { pt: 'Funcionalidades', en: 'Features' },
    online: { pt: 'Online', en: 'Online' },
    placeholder: { pt: 'Placeholder', en: 'Placeholder' },
    successRate: { pt: 'Taxa de Sucesso', en: 'Success Rate' },
    
    // Status
    platformStatus: { pt: 'Status da Plataforma', en: 'Platform Status' },
    allModules: { pt: 'Todos os módulos', en: 'All modules' },
    operational: { pt: 'Operacional', en: 'Operational' },
    
    // Productivity
    productivity: { pt: 'Produtividade em Alta', en: 'High Productivity' },
    productivityDesc: { pt: '42% mais assets criados em comparação ao mês anterior. Continue assim!', en: '42% more assets created compared to previous month. Keep it up!' },
    
    // Actions
    nextActions: { pt: 'Próximas Ações', en: 'Next Actions' },
    summerCampaign: { pt: 'Campanha Verão 2026', en: 'Summer Campaign 2026' },
    summerCampaignDesc: { pt: 'Inicia em 5 dias • 3 materiais pendentes', en: 'Starts in 5 days • 3 pending materials' },
    brandReview: { pt: 'Revisão de Brand', en: 'Brand Review' },
    brandReviewDesc: { pt: 'Atualizar guidelines até sexta-feira', en: 'Update guidelines by Friday' },
    
    // Module Cards
    coreactTitle: { pt: 'CoreAct', en: 'CoreAct' },
    coreactDesc: { pt: 'Gestão de projetos com Timeline, Gantt, Kanban e Budget', en: 'Project management with Timeline, Gantt, Kanban and Budget' },
    brandTitle: { pt: 'Brand', en: 'Brand' },
    brandDesc: { pt: 'Identidade visual, guidelines e cartilhas cromáticas', en: 'Visual identity, guidelines and color guides' },
    marketingTitle: { pt: 'Marketing', en: 'Marketing' },
    marketingDesc: { pt: 'Campanhas, documentos e produtos integrados', en: 'Integrated campaigns, documents and products' },
    toolsTitle: { pt: 'Tools', en: 'Tools' },
    toolsDesc: { pt: 'Ferramentas de design, análise e automação', en: 'Design, analysis and automation tools' },
    
    // Module Stats
    projectsActive: { pt: 'projetos ativos', en: 'active projects' },
    tasksInProgress: { pt: 'tarefas em progresso', en: 'tasks in progress' },
    brandAssets: { pt: 'assets de marca', en: 'brand assets' },
    guidelinesUpdated: { pt: 'guidelines atualizadas', en: 'updated guidelines' },
    campaignsRunning: { pt: 'campanhas ativas', en: 'running campaigns' },
    documentsCreated: { pt: 'documentos criados', en: 'created documents' },
    toolsAvailable: { pt: 'ferramentas', en: 'available tools' },
    automationsActive: { pt: 'automações ativas', en: 'active automations' },
    
    // Quick Access
    exploreModule: { pt: 'Explorar Módulo', en: 'Explore Module' },
    viewDetails: { pt: 'Ver Detalhes', en: 'View Details' },
    platformOverview: { pt: 'Visão Geral da Plataforma', en: 'Platform Overview' },
    unifiedEcosystem: { pt: 'Ecossistema unificado de gestão de marca e marketing', en: 'Unified brand and marketing management ecosystem' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // BRAND MODULE
  // ═══════════════════════════════════════════════════════════════════
  brand: {
    title: { pt: 'Brand', en: 'Brand' },
    subtitle: { pt: 'Gestão de Identidade Visual', en: 'Visual Identity Management' },
    description: { pt: 'Gerencie a identidade visual da marca', en: 'Manage brand visual identity' },
    
    // Identity
    identityTitle: { pt: 'Identidade Visual', en: 'Visual Identity' },
    identityDescription: { pt: 'Elementos fundamentais da marca ADAPTA', en: 'ADAPTA brand fundamental elements' },
    downloadBrandKit: { pt: 'Baixar Brand Kit', en: 'Download Brand Kit' },
    
    // Logo Section
    logoVariations: { pt: 'Variações de Logo', en: 'Logo Variations' },
    allFormats: { pt: 'Todos os formatos', en: 'All formats' },
    brandColors: { pt: 'Cores da Marca', en: 'Brand Colors' },
    mainPalette: { pt: 'Paleta principal', en: 'Main palette' },
    typographies: { pt: 'Tipografias', en: 'Typographies' },
    fontFamilies: { pt: 'Famílias de fontes', en: 'Font families' },
    lastUpdate: { pt: 'Última Atualização', en: 'Last Update' },
    
    // Logo Types
    mainLogo: { pt: 'Logo Principal', en: 'Main Logo' },
    mainLogoDesc: { pt: 'Logo completo para uso geral', en: 'Complete logo for general use' },
    horizontalLogo: { pt: 'Logo Horizontal', en: 'Horizontal Logo' },
    horizontalLogoDesc: { pt: 'Versão horizontal para espaços reduzidos', en: 'Horizontal version for reduced spaces' },
    symbol: { pt: 'Símbolo', en: 'Symbol' },
    symbolDesc: { pt: 'Marca isolada sem texto', en: 'Isolated mark without text' },
    monoLogo: { pt: 'Logo Monocromático', en: 'Monochrome Logo' },
    monoLogoDesc: { pt: 'Versão monocromática para impressão', en: 'Monochrome version for printing' },
    
    // Logo Usage
    mainUsage: { pt: 'Aplicações principais, site, documentos oficiais', en: 'Main applications, website, official documents' },
    emailUsage: { pt: 'Assinaturas de email, banners horizontais', en: 'Email signatures, horizontal banners' },
    iconUsage: { pt: 'App icons, favicons, redes sociais', en: 'App icons, favicons, social media' },
    printUsage: { pt: 'Impressão offset, gravação, bordado', en: 'Offset printing, engraving, embroidery' },
    
    // Tabs
    logos: { pt: 'Logos', en: 'Logos' },
    colorsTab: { pt: 'Cores', en: 'Colors' },
    typography: { pt: 'Tipografia', en: 'Typography' },
    
    // Logo Details
    variations: { pt: 'variações', en: 'variations' },
    logoPreview: { pt: 'Preview do Logo', en: 'Logo Preview' },
    availableFormats: { pt: 'Formatos Disponíveis', en: 'Available Formats' },
    recommendedUse: { pt: 'Uso Recomendado', en: 'Recommended Use' },
    download: { pt: 'Download', en: 'Download' },
    view: { pt: 'Visualizar', en: 'View' },
    
    // Color Palette
    brandColorPalette: { pt: 'Paleta de Cores da Marca', en: 'Brand Color Palette' },
    colorPaletteDesc: { pt: 'Cores oficiais para manter consistência visual em todas as aplicações', en: 'Official colors to maintain visual consistency across all applications' },
    primaryColor: { pt: 'Cor principal da marca', en: 'Main brand color' },
    secondaryColor: { pt: 'Backgrounds e elementos secundários', en: 'Backgrounds and secondary elements' },
    accent1: { pt: 'Destaques e CTAs', en: 'Highlights and CTAs' },
    accent2: { pt: 'Textos secundários', en: 'Secondary texts' },
    
    // Typography
    mainFont: { pt: 'Principal', en: 'Main' },
    monoFont: { pt: 'Monoespaçada', en: 'Monospaced' },
    mainFontUsage: { pt: 'Títulos, corpo de texto, interface', en: 'Titles, body text, interface' },
    monoFontUsage: { pt: 'Códigos, dados técnicos, tabelas', en: 'Codes, technical data, tables' },
    availableWeights: { pt: 'Pesos Disponíveis', en: 'Available Weights' },
    weightsPreview: { pt: 'Preview dos Pesos', en: 'Weights Preview' },
    
    // Guidelines
    guidelinesTitle: { pt: 'Guidelines', en: 'Guidelines' },
    guidelinesDescription: { pt: 'Manual de uso e aplicação da identidade visual', en: 'Visual identity usage and application manual' },
    totalSections: { pt: 'Total de Seções', en: 'Total Sections' },
    comprehensiveManual: { pt: 'Manual completo', en: 'Comprehensive manual' },
    totalPages: { pt: 'Total de Páginas', en: 'Total Pages' },
    detailedContent: { pt: 'Conteúdo detalhado', en: 'Detailed content' },
    avgReadingTime: { pt: 'Tempo Médio', en: 'Avg. Time' },
    minutesReading: { pt: 'min de leitura', en: 'min reading' },
    downloadComplete: { pt: 'Download Completo', en: 'Download Complete' },
    downloadPdf: { pt: 'Baixar PDF Completo', en: 'Download Complete PDF' },
    allSections: { pt: 'Todas as Seções', en: 'All Sections' },
    pages: { pt: 'páginas', en: 'pages' },
    viewSection: { pt: 'Ver Seção', en: 'View Section' },
    documented: { pt: 'Documentadas', en: 'Documented' },
    currentVersion: { pt: 'Versão Atual', en: 'Current Version' },
    approved: { pt: 'Aprovada', en: 'Approved' },
    manualSections: { pt: 'Seções do Manual', en: 'Manual Sections' },
    navigateSections: { pt: 'Navegue pelas diferentes seções do brand guideline', en: 'Navigate through different brand guideline sections' },
    topicsCovered: { pt: 'Tópicos Abordados', en: 'Topics Covered' },
    updatedOn: { pt: 'Atualizado em', en: 'Updated on' },
    visualize: { pt: 'Visualizar', en: 'View' },
    
    // Guidelines sections
    logoUsageTitle: { pt: 'Uso do Logo', en: 'Logo Usage' },
    logoUsageDesc: { pt: 'Regras de aplicação, espaçamento mínimo e versões', en: 'Application rules, minimum spacing and versions' },
    colorPaletteTitle: { pt: 'Paleta de Cores', en: 'Color Palette' },
    colorPaletteDesc2: { pt: 'Cores primárias, secundárias e aplicações corretas', en: 'Primary, secondary colors and correct applications' },
    typographyTitle: { pt: 'Tipografia', en: 'Typography' },
    typographyDesc: { pt: 'Hierarquia tipográfica e uso de fontes', en: 'Typographic hierarchy and font usage' },
    toneOfVoice: { pt: 'Tom de Voz', en: 'Tone of Voice' },
    toneOfVoiceDesc: { pt: 'Linguagem e estilo de comunicação da marca', en: 'Brand communication language and style' },
    
    // Status
    updated: { pt: 'Atualizado', en: 'Updated' },
    inReview: { pt: 'Em revisão', en: 'In review' },
    
    // Best Practices
    bestPractices: { pt: 'Boas Práticas', en: 'Best Practices' },
    essentialRules: { pt: 'Regras essenciais de uso da marca', en: 'Essential brand usage rules' },
    doThis: { pt: 'Faça', en: 'Do' },
    dontDoThis: { pt: 'Não Faça', en: "Don't" },
    logo: { pt: 'Logo', en: 'Logo' },
    
    // Cartilhas/Guides
    cartilhasTitle: { pt: 'Cartilhas', en: 'Brand Guides' },
    cartilhasDescription: { pt: 'Guias especializados para aplicação da marca', en: 'Specialized guides for brand application' },
    downloadAll: { pt: 'Baixar Todas', en: 'Download All' },
    totalGuides: { pt: 'Total de Cartilhas', en: 'Total Guides' },
    activeDocuments: { pt: 'Documentos ativos', en: 'Active documents' },
    totalPagesAll: { pt: 'Páginas Totais', en: 'Total Pages' },
    completeContent: { pt: 'Conteúdo completo', en: 'Complete content' },
    categories: { pt: 'Categorias', en: 'Categories' },
    areasCovered: { pt: 'Áreas cobertas', en: 'Areas covered' },
    alwaysUpdated: { pt: 'Sempre atualizado', en: 'Always updated' },
    
    // Guide Details
    newBadge: { pt: 'Novo', en: 'New' },
    version: { pt: 'Versão', en: 'Version' },
    format: { pt: 'Formato', en: 'Format' },
    type: { pt: 'Tipo', en: 'Type' },
    size: { pt: 'Tamanho', en: 'Size' },
    targetAudience: { pt: 'Público-alvo', en: 'Target Audience' },
    tones: { pt: 'Tons', en: 'Tones' },
    colorsLower: { pt: 'cores', en: 'colors' },
    interactive: { pt: 'Interativo', en: 'Interactive' },
    openManual: { pt: 'Abrir Manual', en: 'Open Manual' },
    downloadLower: { pt: 'Baixar', en: 'Download' },
    
    // Guide Titles
    visualIdentityManual: { pt: 'Manual de Identidade Visual', en: 'Visual Identity Manual' },
    visualIdentityManualDesc: { pt: 'Guia completo sobre uso correto da marca, logos, cores e tipografia', en: 'Complete guide on correct brand, logo, color and typography usage' },
    toneOfVoiceGuide: { pt: 'Guia de Tom de Voz', en: 'Tone of Voice Guide' },
    toneOfVoiceGuideDesc: { pt: 'Diretrizes de comunicação e linguagem da marca', en: 'Brand communication and language guidelines' },
    corporateApplicationsManual: { pt: 'Manual de Aplicações Corporativas', en: 'Corporate Applications Manual' },
    corporateApplicationsDesc: { pt: 'Padrões para documentos, apresentações e materiais institucionais', en: 'Standards for documents, presentations and institutional materials' },
    socialMediaGuide: { pt: 'Guia de Redes Sociais', en: 'Social Media Guide' },
    socialMediaGuideDesc: { pt: 'Templates, dimensões e boas práticas para conteúdo digital', en: 'Templates, dimensions and best practices for digital content' },
    eventsManual: { pt: 'Manual de Eventos e Ativações', en: 'Events and Activations Manual' },
    eventsManualDesc: { pt: 'Guidelines para materiais de eventos, feiras e ativações', en: 'Guidelines for event, trade show and activation materials' },
    complianceGuide: { pt: 'Cartilha de Compliance Visual', en: 'Visual Compliance Guide' },
    complianceGuideDesc: { pt: 'Normas e regulamentações para uso da marca', en: 'Brand usage norms and regulations' },
    neutralPaletteManual: { pt: 'Manual da Paleta Neutral', en: 'Neutral Palette Manual' },
    neutralPaletteManualDesc: { pt: 'Sistema de cores Verde Petróleo com nomenclatura canábica e guia completo de aplicação', en: 'Petrol Green color system with cannabis nomenclature and complete application guide' },
    
    // Categories
    identity: { pt: 'Identidade', en: 'Identity' },
    communication: { pt: 'Comunicação', en: 'Communication' },
    corporate: { pt: 'Corporativo', en: 'Corporate' },
    digital: { pt: 'Digital', en: 'Digital' },
    events: { pt: 'Eventos', en: 'Events' },
    compliance: { pt: 'Compliance', en: 'Compliance' },
    
    // Footer
    officialDocuments: { pt: 'Documentos Oficiais e Confidenciais', en: 'Official and Confidential Documents' },
    officialDocumentsDesc: { pt: 'Todas as cartilhas são documentos oficiais da marca ADAPTA e devem ser utilizadas como referência exclusiva. O uso inadequado ou fora das diretrizes estabelecidas pode comprometer a integridade da marca.', en: 'All guides are official ADAPTA brand documents and must be used as exclusive reference. Improper use or outside established guidelines may compromise brand integrity.' },
    
    // Stats
    visualElements: { pt: 'Elementos visuais', en: 'Visual elements' },
    activeGuidelines: { pt: 'Guidelines ativas', en: 'Active guidelines' },
    availableGuides: { pt: 'Cartilhas disponíveis', en: 'Available guides' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // MARKETING MODULE
  // ═══════════════════════════════════════════════════════════════════
  marketing: {
    title: { pt: 'Marketing', en: 'Marketing' },
    subtitle: { pt: 'Gestão de Campanhas', en: 'Campaign Management' },
    description: { pt: 'Gerencie campanhas e materiais de marketing', en: 'Manage campaigns and marketing materials' },
    
    // Campaigns
    campaignsTitle: { pt: 'Campanhas', en: 'Campaigns' },
    createCampaign: { pt: 'Criar Campanha', en: 'Create Campaign' },
    editCampaign: { pt: 'Editar Campanha', en: 'Edit Campaign' },
    campaignName: { pt: 'Nome da Campanha', en: 'Campaign Name' },
    campaignStatus: { pt: 'Status da Campanha', en: 'Campaign Status' },
    campaignDates: { pt: 'Datas da Campanha', en: 'Campaign Dates' },
    startDate: { pt: 'Data de Início', en: 'Start Date' },
    endDate: { pt: 'Data de Término', en: 'End Date' },
    budget: { pt: 'Orçamento', en: 'Budget' },
    target: { pt: 'Público-Alvo', en: 'Target Audience' },
    objectives: { pt: 'Objetivos', en: 'Objectives' },
    deliverables: { pt: 'Entregáveis', en: 'Deliverables' },
    
    // Campaign Types
    activeCampaignsTitle: { pt: 'Campanhas Ativas', en: 'Active Campaigns' },
    futureCampaignsTitle: { pt: 'Campanhas Futuras', en: 'Future Campaigns' },
    pastCampaignsTitle: { pt: 'Campanhas Passadas', en: 'Past Campaigns' },
    
    // Documents
    documentsTitle: { pt: 'Documentos', en: 'Documents' },
    uploadDocument: { pt: 'Enviar Documento', en: 'Upload Document' },
    
    // Products
    productsTitle: { pt: 'Produtos', en: 'Products' },
    addProduct: { pt: 'Adicionar Produto', en: 'Add Product' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // TOOLS MODULE
  // ═══════════════════════════════════════════════════════════════════
  tools: {
    // ToolsHome
    title: { pt: 'Ferramentas', en: 'Tools' },
    homeSubtitle: { pt: 'Central de ferramentas produtivas ADAPTA', en: 'ADAPTA productive tools center' },
    access: { pt: 'Acessar', en: 'Access' },
    
    // Tools cards
    logoColorsTitle: { pt: 'Logo & Cores', en: 'Logo & Colors' },
    logoColorsDescription: { pt: 'Sistema de identidade e paleta de cores', en: 'Identity system and color palette' },
    documentsTitle: { pt: 'Documentos', en: 'Documents' },
    documentsDescription: { pt: 'Templates e documentos corporativos', en: 'Corporate templates and documents' },
    productsTitle: { pt: 'Produtos', en: 'Products' },
    productsDescription: { pt: 'Catálogo e materiais de produtos', en: 'Product catalog and materials' },
    visualTitle: { pt: 'Comunicação Visual', en: 'Visual Communication' },
    visualDescription: { pt: 'Materiais de comunicação visual', en: 'Visual communication materials' },
    colorsTitle: { pt: 'Paleta de Cores', en: 'Color Palette' },
    colorsDescription: { pt: 'Sistema completo de cores da marca', en: 'Complete brand color system' },
    gradientsTitle: { pt: 'Gradientes', en: 'Gradients' },
    gradientsDescription: { pt: 'Motor de gradientes automáticos', en: 'Automatic gradient engine' },
    mascotsTitle: { pt: 'Mascotes', en: 'Mascots' },
    mascotsDescription: { pt: 'Editor de mascotes ADAPTA', en: 'ADAPTA mascot editor' },
    instagramTitle: { pt: 'Preview Instagram', en: 'Instagram Preview' },
    instagramDescription: { pt: 'Pré-visualização de posts Instagram', en: 'Instagram post preview' },
    analysisTitle: { pt: 'Análise de Peças', en: 'Piece Analysis' },
    analysisDescription: { pt: 'Análise automatizada de materiais gráficos', en: 'Automated graphic material analysis' },
    verdeVoxTitle: { pt: 'VerdeVox Core', en: 'VerdeVox Core' },
    verdeVoxDescription: { pt: 'Sistema de áudio e voz', en: 'Audio and voice system' },
    operationMapTitle: { pt: 'Mapa da Operação', en: 'Operation Map' },
    operationMapDescription: { pt: 'Visão estratégica da operação', en: 'Strategic operation overview' },
    shareTitle: { pt: 'Social & Compartilhamento', en: 'Social & Sharing' },
    shareDescription: { pt: 'Gestão de redes sociais com mLabs integrado', en: 'Social media management with integrated mLabs' },
    
    // Colors page
    colorPaletteTitle: { pt: 'Paleta de Cores', en: 'Color Palette' },
    colorSystemDescription: { pt: 'Sistema completo de cores da marca ADAPTA', en: 'Complete ADAPTA brand color system' },
    newPalette: { pt: 'Nova Paleta', en: 'New Palette' },
    totalPalettes: { pt: 'Paletas Totais', en: 'Total Palettes' },
    
    // Brand Studio - Documentos Corporativos
    corporateDocumentsTitle: { pt: 'Documentos Corporativos', en: 'Corporate Documents' },
    corporateDocumentsDescription: { pt: 'Crie contratos, certificados e documentação oficial com a identidade visual ADAPTA', en: 'Create contracts, certificates and official documentation with ADAPTA visual identity' },
    documentsTip: { pt: 'Dica', en: 'Tip' },
    documentsAutoGenerated: { pt: 'Todos os documentos são gerados automaticamente usando as informações da marca configuradas no contexto da aplicação.', en: 'All documents are automatically generated using the brand information configured in the application context.' },
    
    // Brand Studio - Produtos & Embalagens
    productsPackagingTitle: { pt: 'Produtos & Embalagens', en: 'Products & Packaging' },
    productsPackagingDescription: { pt: 'Catálogo de produtos e sistema de etiquetas profissionais', en: 'Product catalog and professional label system' },
    
    // Brand Studio - Comunicação Visual
    visualCommunicationTitle: { pt: 'Comunicação Visual', en: 'Visual Communication' },
    visualCommunicationDescription: { pt: 'Materiais gráficos para comunicação visual da marca', en: 'Graphic materials for brand visual communication' },
    visualCommunicationAutoGenerated: { pt: 'Todos os materiais são gerados automaticamente com a identidade visual ADAPTA aplicada.', en: 'All materials are automatically generated with ADAPTA visual identity applied.' },
    organized: { pt: 'Organizadas', en: 'Organized' },
    totalColors: { pt: 'Cores Totais', en: 'Total Colors' },
    cataloged: { pt: 'Catalogadas', en: 'Cataloged' },
    systemColors: { pt: 'Cores do Sistema', en: 'System Colors' },
    tealForest: { pt: 'Floresta Petróleo', en: 'Teal Forest' },
    lastUpdate: { pt: 'Última Atualização', en: 'Last Update' },
    palettes: { pt: 'Paletas', en: 'Palettes' },
    generator: { pt: 'Gerador', en: 'Generator' },
    recent: { pt: 'Recentes', en: 'Recent' },
    
    // Neutral System
    neutralSystem: { pt: 'Sistema Neutral', en: 'Neutral System' },
    neutralSystemDescription: { pt: 'Escala completa de 12 tons verde petróleo', en: 'Complete 12-tone teal scale' },
    system: { pt: 'Sistema', en: 'System' },
    
    // Color names (Neutral System)
    pineMist: { pt: 'Névoa de Pinheiro', en: 'Pine Mist' },
    hempCanvas: { pt: 'Tela de Cânhamo', en: 'Hemp Canvas' },
    sageWhisper: { pt: 'Sussurro de Sálvia', en: 'Sage Whisper' },
    leafFrost: { pt: 'Geada de Folha', en: 'Leaf Frost' },
    forestDew: { pt: 'Orvalho Florestal', en: 'Forest Dew' },
    greenSmoke: { pt: 'Fumaça Verde', en: 'Green Smoke' },
    emeraldHaze: { pt: 'Neblina Esmeralda', en: 'Emerald Haze' },
    deepPine: { pt: 'Pinheiro Profundo', en: 'Deep Pine' },
    forestShadow: { pt: 'Sombra Florestal', en: 'Forest Shadow' },
    midnightGarden: { pt: 'Jardim da Meia-Noite', en: 'Midnight Garden' },
    darkForest: { pt: 'Floresta Escura', en: 'Dark Forest' },
    blackEarth: { pt: 'Terra Negra', en: 'Black Earth' },
    
    // Color usages
    ultraLightBackgrounds: { pt: 'Fundos ultra claros', en: 'Ultra light backgrounds' },
    mainBackground: { pt: 'Fundo principal', en: 'Main background' },
    neutralBackgrounds: { pt: 'Fundos neutros', en: 'Neutral backgrounds' },
    bordersAndDividers: { pt: 'Bordas e divisores', en: 'Borders and dividers' },
    tertiaryTexts: { pt: 'Textos terciários', en: 'Tertiary texts' },
    secondaryTexts: { pt: 'Textos secundários', en: 'Secondary texts' },
    placeholdersMax20: { pt: 'Placeholders (máx 20%)', en: 'Placeholders (max 20%)' },
    mediumTexts: { pt: 'Textos médios', en: 'Medium texts' },
    primaryElements: { pt: 'Elementos primários', en: 'Primary elements' },
    cardsAndContainers: { pt: 'Cards e containers', en: 'Cards and containers' },
    darkBackgrounds: { pt: 'Fundos escuros', en: 'Dark backgrounds' },
    mainBackgroundDark: { pt: 'Fundo principal escuro', en: 'Main dark background' },
    
    // Color utilities
    yesterday: { pt: 'Ontem', en: 'Yesterday' },
    colorsLowercase: { pt: 'cores', en: 'colors' },
    updatedOn: { pt: 'Atualizado em', en: 'Updated on' },
    colorGenerator: { pt: 'Gerador de Cores', en: 'Color Generator' },
    colorGeneratorDescription: { pt: 'Crie e teste novas cores personalizadas', en: 'Create and test custom colors' },
    colorPicker: { pt: 'Seletor de Cor', en: 'Color Picker' },
    conversions: { pt: 'Conversões', en: 'Conversions' },
    preview: { pt: 'Pré-visualização', en: 'Preview' },
    add: { pt: 'Adicionar', en: 'Add' },
    recentColors: { pt: 'Cores Recentes', en: 'Recent Colors' },
    recentColorsDescription: { pt: 'Histórico de cores utilizadas recentemente', en: 'Recently used color history' },
    
    // Lang property for inline checks (usado em alguns componentes)
    lang: { pt: 'pt', en: 'en' },
    
    // ═══════════════════════════════════════════════════════════════════
    // TIMELINE - Sistema de cronograma e gerenciamento de tarefas
    // ══════════════════════════��════════════════════════════════════════
    
    // Main navigation
    timelineHome: { pt: 'Home', en: 'Home' },
    timelineSchedule: { pt: 'Cronograma', en: 'Schedule' },
    timelineBudget: { pt: 'Orçamento', en: 'Budget' },
    timelineTeam: { pt: 'Time', en: 'Team' },
    
    // Header actions
    timelineFilters: { pt: 'Filtros', en: 'Filters' },
    timelineNewTask: { pt: 'Nova Tarefa', en: 'New Task' },
    
    // View modes
    timelineViewGantt: { pt: 'Gantt', en: 'Gantt' },
    timelineViewKanban: { pt: 'Kanban', en: 'Kanban' },
    timelineViewDay: { pt: 'Dia', en: 'Day' },
    timelineViewWeek: { pt: 'Semana', en: 'Week' },
    timelineViewMonth: { pt: 'Mês', en: 'Month' },
    timelineViewList: { pt: 'Lista', en: 'List' },
    
    // Filters
    timelineFilterProject: { pt: 'Projeto:', en: 'Project:' },
    timelineFilterAllProjects: { pt: 'Todos os projetos', en: 'All projects' },
    timelineFilterStatus: { pt: 'Status:', en: 'Status:' },
    timelineFilterAllStatus: { pt: 'Todos os status', en: 'All statuses' },
    timelineFilterPriority: { pt: 'Prioridade:', en: 'Priority:' },
    timelineFilterAllPriorities: { pt: 'Todas as prioridades', en: 'All priorities' },
    
    // Status labels
    timelineStatusBacklog: { pt: 'Backlog', en: 'Backlog' },
    timelineStatusTodo: { pt: 'A Fazer', en: 'To Do' },
    timelineStatusInProgress: { pt: 'Em Progresso', en: 'In Progress' },
    timelineStatusReview: { pt: 'Revisão', en: 'Review' },
    timelineStatusDone: { pt: 'Concluído', en: 'Done' },
    
    // Priority labels
    timelinePriorityLow: { pt: 'Baixa', en: 'Low' },
    timelinePriorityMedium: { pt: 'Média', en: 'Medium' },
    timelinePriorityHigh: { pt: 'Alta', en: 'High' },
    timelinePriorityUrgent: { pt: 'Urgente', en: 'Urgent' },
    
    // Toast messages
    timelineTaskCreated: { pt: 'Tarefa criada!', en: 'Task created!' },
    timelineTaskUpdated: { pt: 'Tarefa atualizada!', en: 'Task updated!' },
    timelineTaskDeleted: { pt: 'Tarefa excluída!', en: 'Task deleted!' },
    timelineTasksImported: { pt: 'tarefas importadas!', en: 'tasks imported!' },
    
    // Home Dashboard
    timelineOverview: { pt: 'Visão Geral', en: 'Overview' },
    timelineProjectSituation: { pt: 'Situação dos projetos em', en: 'Project situation on' },
    timelineActiveProjects: { pt: 'Projetos Ativos', en: 'Active Projects' },
    timelineOverallProgress: { pt: 'Progresso Geral', en: 'Overall Progress' },
    timelineOpenTasks: { pt: 'Tarefas Abertas', en: 'Open Tasks' },
    timelineOverdueTasks: { pt: 'Atrasadas', en: 'Overdue' },
    timelineTasksInProgress: { pt: 'Em Andamento', en: 'In Progress' },
    timelineTotalBudget: { pt: 'Orçamento Total', en: 'Total Budget' },
    timelineSpent: { pt: 'Gasto', en: 'Spent' },
    timelineRemaining: { pt: 'Restante', en: 'Remaining' },
    timelineCriticalAlerts: { pt: 'Alertas Críticos', en: 'Critical Alerts' },
    timelineWarnings: { pt: 'Avisos', en: 'Warnings' },
    timelineUpcomingEvents: { pt: 'Próximos Eventos', en: 'Upcoming Events' },
    timelineNext7Days: { pt: 'Próximos 7 dias', en: 'Next 7 days' },
    timelineRecentActivity: { pt: 'Atividade Recente', en: 'Recent Activity' },
    timelineLast5Actions: { pt: 'Últimas 5 ações', en: 'Last 5 actions' },
    timelineDaysLeft: { pt: 'dias restantes', en: 'days left' },
    timelineViewDetails: { pt: 'Ver Detalhes', en: 'View Details' },
    timelineViewAll: { pt: 'Ver Todos', en: 'View All' },
    
    // List View
    timelineTask: { pt: 'Tarefa', en: 'Task' },
    timelineProject: { pt: 'Projeto', en: 'Project' },
    timelineStatus: { pt: 'Status', en: 'Status' },
    timelinePriority: { pt: 'Prioridade', en: 'Priority' },
    timelineStartDate: { pt: 'Início', en: 'Start' },
    timelineEndDate: { pt: 'Fim', en: 'End' },
    timelineProgress: { pt: 'Progresso', en: 'Progress' },
    timelineActions: { pt: 'Ações', en: 'Actions' },
    timelineNoTasks: { pt: 'Nenhuma tarefa encontrada', en: 'No tasks found' },
    
    // Budget Control
    timelineBudgetControl: { pt: 'Controle de Orçamento', en: 'Budget Control' },
    timelineBudgetManagement: { pt: 'Gestão financeira de projetos', en: 'Project financial management' },
    timelineProjectBudgets: { pt: 'Orçamentos por Projeto', en: 'Project Budgets' },
    timelineTotalAllocated: { pt: 'Total Alocado', en: 'Total Allocated' },
    timelineUtilization: { pt: 'Utilização', en: 'Utilization' },
    timelineBudgetOverview: { pt: 'Visão Geral do Orçamento', en: 'Budget Overview' },
    timelineAvailable: { pt: 'Disponível', en: 'Available' },
    timelineAllocated: { pt: 'Alocado', en: 'Allocated' },
    timelineBudgetItems: { pt: 'Itens de Orçamento', en: 'Budget Items' },
    timelineCategory: { pt: 'Categoria', en: 'Category' },
    timelineAmount: { pt: 'Valor', en: 'Amount' },
    timelineDate: { pt: 'Data', en: 'Date' },
    budgetFinancialManagement: { pt: 'Gestão financeira por projeto e centro de custo', en: 'Financial management by project and cost center' },
    budgetExport: { pt: 'Exportar', en: 'Export' },
    budgetNewItem: { pt: 'Novo Item', en: 'New Item' },
    budgetTotalPlanned: { pt: 'Previsto Total', en: 'Total Planned' },
    budgetItems: { pt: 'itens', en: 'items' },
    budgetItem: { pt: 'item', en: 'item' },
    budgetContracted: { pt: 'Contratado', en: 'Contracted' },
    budgetOfPlanned: { pt: 'do previsto', en: 'of planned' },
    budgetPaid: { pt: 'Pago', en: 'Paid' },
    budgetOfContracted: { pt: 'do contratado', en: 'of contracted' },
    budgetPending: { pt: 'Pendente', en: 'Pending' },
    budgetPendingPayments: { pt: 'pagamentos pendentes', en: 'pending payments' },
    budgetFilters: { pt: 'Filtros:', en: 'Filters:' },
    budgetAllProjects: { pt: 'Todos os projetos', en: 'All projects' },
    budgetCategoryInfra: { pt: 'infraestrutura', en: 'infrastructure' },
    budgetCategoryCommunication: { pt: 'comunicacao', en: 'communication' },
    budgetCategoryEvent: { pt: 'evento', en: 'event' },
    budgetCategoryOperation: { pt: 'operacao', en: 'operation' },
    budgetNoItems: { pt: 'Nenhum item encontrado', en: 'No items found' },
    budgetPlanned: { pt: 'Previsto', en: 'Planned' },
    budgetByCategory: { pt: 'Por Categoria', en: 'By Category' },
    budgetByProject: { pt: 'Por Projeto', en: 'By Project' },
    budgetBudget: { pt: 'Orçamento', en: 'Budget' },
    budgetCurrent: { pt: 'Atual', en: 'Current' },
    budgetStatusPaid: { pt: 'pago', en: 'paid' },
    budgetStatusContracted: { pt: 'contratado', en: 'contracted' },
    budgetStatusPlanned: { pt: 'previsto', en: 'planned' },
    budgetStatusCanceled: { pt: 'cancelado', en: 'canceled' },
    
    // Team Management
    timelineTeamManagement: { pt: 'Gestão de Time', en: 'Team Management' },
    timelineTeamCollaboration: { pt: 'Colaboração e alocação de equipe', en: 'Team collaboration and allocation' },
    timelineTeamMembers: { pt: 'Membros do Time', en: 'Team Members' },
    timelineActiveMembersCount: { pt: 'membros ativos', en: 'active members' },
    timelineTotalCapacity: { pt: 'Capacidade Total', en: 'Total Capacity' },
    timelineHoursWeek: { pt: 'horas/semana', en: 'hours/week' },
    timelineTasksAssigned: { pt: 'Tarefas Atribuídas', en: 'Tasks Assigned' },
    timelineDistributed: { pt: 'Distribuídas', en: 'Distributed' },
    timelineMemberName: { pt: 'Membro', en: 'Member' },
    timelineRole: { pt: 'Função', en: 'Role' },
    timelineCapacity: { pt: 'Capacidade', en: 'Capacity' },
    timelineCurrentTasks: { pt: 'Tarefas Atuais', en: 'Current Tasks' },
    timelineWorkload: { pt: 'Carga', en: 'Workload' },
    teamWorkloadAllocation: { pt: 'Carga de trabalho e alocação de tarefas', en: 'Workload and task allocation' },
    teamAddMember: { pt: 'Adicionar Membro', en: 'Add Member' },
    teamTotalMembers: { pt: 'Total de Membros', en: 'Total Members' },
    teamWeekAvailable: { pt: 'h/semana disponível', en: 'h/week available' },
    teamAvgUtilization: { pt: 'Utilização Média', en: 'Average Utilization' },
    teamAllocatedHours: { pt: 'h alocadas', en: 'h allocated' },
    teamOverload: { pt: 'Sobrecarga', en: 'Overload' },
    teamAbove100: { pt: 'acima de 100%', en: 'above 100%' },
    teamUnderutilized: { pt: 'Subutilizados', en: 'Underutilized' },
    teamBelow50: { pt: 'abaixo de 50%', en: 'below 50%' },
    teamMembersTitle: { pt: 'Membros da Equipe', en: 'Team Members' },
    teamClickForDetails: { pt: 'Clique em um membro para ver detalhes', en: 'Click on a member to see details' },
    teamOverloadBadge: { pt: 'Sobrecarga', en: 'Overload' },
    teamAvailableBadge: { pt: 'Disponível', en: 'Available' },
    teamUtilization: { pt: 'Utilização', en: 'Utilization' },
    teamAllocated: { pt: 'Alocado', en: 'Allocated' },
    teamTasks: { pt: 'Tarefas', en: 'Tasks' },
    teamWeeklyHours: { pt: 'Horas semanais', en: 'Weekly hours' },
    teamActiveTasks: { pt: 'Tarefas ativas', en: 'Active tasks' },
    teamOverdueTasks: { pt: 'Atrasadas', en: 'Overdue' },
    teamActiveTasksTitle: { pt: 'Tarefas Ativas', en: 'Active Tasks' },
    teamNoActiveTasks: { pt: 'Nenhuma tarefa ativa', en: 'No active tasks' },
    teamEstimated: { pt: 'h estimadas', en: 'h estimated' },
    teamSelectMember: { pt: 'Selecione um membro para ver detalhes', en: 'Select a member to see details' },
    
    // mLabs Integration
    mlabsIntegration: { pt: 'mLabs - Social Media', en: 'mLabs - Social Media' },
    mlabsDescription: { pt: 'Gestão de redes sociais integrada', en: 'Integrated social media management' },
    mlabsRefresh: { pt: 'Atualizar', en: 'Refresh' },
    mlabsOpenExternal: { pt: 'Abrir em nova aba', en: 'Open in new tab' },
    mlabsScheduled: { pt: 'Agendados', en: 'Scheduled' },
    mlabsThisWeek: { pt: 'esta semana', en: 'this week' },
    mlabsPublished: { pt: 'Publicados', en: 'Published' },
    mlabsThisMonth: { pt: 'este mês', en: 'this month' },
    mlabsEngagement: { pt: 'Engajamento', en: 'Engagement' },
    mlabsInteractions: { pt: 'interações', en: 'interactions' },
    mlabsGrowth: { pt: 'Crescimento', en: 'Growth' },
    mlabsVsLastMonth: { pt: 'vs mês anterior', en: 'vs last month' },
    mlabsEmbedWarning: { pt: 'O mLabs pode bloquear a visualização por segurança. Use o botão \'Abrir em nova aba\' para acessar a plataforma completa.', en: 'mLabs may block embedded view for security. Use the \'Open in new tab\' button to access the full platform.' },
    mlabsLoading: { pt: 'Carregando mLabs...', en: 'Loading mLabs...' },
    mlabsEmbedBlocked: { pt: 'Visualização bloqueada', en: 'View blocked' },
    mlabsEmbedBlockedDesc: { pt: 'Por questões de segurança, o mLabs não permite visualização incorporada. Clique no botão abaixo para acessar em uma nova janela.', en: 'For security reasons, mLabs does not allow embedded view. Click the button below to access in a new window.' },
    mlabsAccessPlatform: { pt: 'Acessar mLabs', en: 'Access mLabs' },
    mlabsQuickAccess: { pt: 'Acesso Rápido', en: 'Quick Access' },
    mlabsSchedulePosts: { pt: 'Agendar Publicações', en: 'Schedule Posts' },
    mlabsViewAnalytics: { pt: 'Ver Analytics', en: 'View Analytics' },
    mlabsInbox: { pt: 'Caixa de Entrada', en: 'Inbox' },
    mlabsTips: { pt: 'Dicas', en: 'Tips' },
    mlabsTip1: { pt: 'Use \'Abrir em nova aba\' para acessar todas as funcionalidades', en: 'Use \'Open in new tab\' to access all features' },
    mlabsTip2: { pt: 'Faça login no mLabs para visualizar seus dados reais', en: 'Log in to mLabs to view your real data' },
    mlabsTip3: { pt: 'As métricas acima são exemplos - conecte sua conta para dados reais', en: 'The metrics above are examples - connect your account for real data' },
    timelineMlabs: { pt: 'mLabs', en: 'mLabs' },
    
    // Notifications
    timelineNotifications: { pt: 'Notificações', en: 'Notifications' },
    timelineMarkAsRead: { pt: 'Marcar como lida', en: 'Mark as read' },
    timelineClearAll: { pt: 'Limpar tudo', en: 'Clear all' },
    timelineNoNotifications: { pt: 'Nenhuma notificação', en: 'No notifications' },
    
    // Task Dialog
    timelineCreateTask: { pt: 'Criar Tarefa', en: 'Create Task' },
    timelineEditTask: { pt: 'Editar Tarefa', en: 'Edit Task' },
    timelineTaskTitle: { pt: 'Título da Tarefa', en: 'Task Title' },
    timelineTaskDescription: { pt: 'Descrição', en: 'Description' },
    timelineTaskProject: { pt: 'Projeto', en: 'Project' },
    timelineTaskStatus: { pt: 'Status', en: 'Status' },
    timelineTaskPriority: { pt: 'Prioridade', en: 'Priority' },
    timelineTaskStartDate: { pt: 'Data de Início', en: 'Start Date' },
    timelineTaskEndDate: { pt: 'Data de Término', en: 'End Date' },
    timelineTaskAssignee: { pt: 'Responsável', en: 'Assignee' },
    timelineTaskDependencies: { pt: 'Dependências', en: 'Dependencies' },
    timelineTaskNotes: { pt: 'Notas', en: 'Notes' },
    timelineSelectProject: { pt: 'Selecione um projeto', en: 'Select a project' },
    timelineSelectAssignee: { pt: 'Selecione um responsável', en: 'Select an assignee' },
    timelineDeleteTask: { pt: 'Excluir Tarefa', en: 'Delete Task' },
    timelineDeleteConfirm: { pt: 'Tem certeza que deseja excluir esta tarefa?', en: 'Are you sure you want to delete this task?' },
    
    // Bulk Import
    timelineBulkImport: { pt: 'Importação em Massa', en: 'Bulk Import' },
    timelineImportTasks: { pt: 'Importar Tarefas', en: 'Import Tasks' },
    timelineUploadFile: { pt: 'Enviar Arquivo', en: 'Upload File' },
    timelineFileFormat: { pt: 'Formato do Arquivo', en: 'File Format' },
    
    // Context Menu
    timelineEdit: { pt: 'Editar', en: 'Edit' },
    timelineDelete: { pt: 'Excluir', en: 'Delete' },
    timelineDuplicate: { pt: 'Duplicar', en: 'Duplicate' },
    timelineChangeStatus: { pt: 'Alterar Status', en: 'Change Status' },
    timelineChangePriority: { pt: 'Alterar Prioridade', en: 'Change Priority' },
    
    // Dependencies
    timelineDependencies: { pt: 'Dependências', en: 'Dependencies' },
    timelineBlockedBy: { pt: 'Bloqueada por', en: 'Blocked by' },
    timelineBlocking: { pt: 'Bloqueando', en: 'Blocking' },
    timelineNoDependencies: { pt: 'Sem dependências', en: 'No dependencies' },
    timelineAddDependency: { pt: 'Adicionar Dependência', en: 'Add Dependency' },
    timelineRemoveDependency: { pt: 'Remover Dependência', en: 'Remove Dependency' },
    timelineDependencyRemoved: { pt: 'Dependência removida', en: 'Dependency removed' },
    timelineOverdue: { pt: 'Atrasada', en: 'Overdue' },
    timelineAssigned: { pt: 'Atribuído', en: 'Assigned' },
    timelineHours: { pt: 'Horas', en: 'Hours' },
    
    // Create/Edit Task Dialog
    timelineCreateNewTask: { pt: 'Crie uma nova tarefa para o seu projeto.', en: 'Create a new task for your project.' },
    timelineEditTaskDescription: { pt: 'Edite as informações da tarefa.', en: 'Edit task information.' },
    timelineRequired: { pt: '*', en: '*' },
    timelineFillRequired: { pt: 'Preencha todos os campos obrigatórios', en: 'Fill in all required fields' },
    timelineTaskCreatedSuccess: { pt: 'Tarefa criada com sucesso!', en: 'Task created successfully!' },
    timelineTaskUpdatedSuccess: { pt: 'Tarefa atualizada com sucesso!', en: 'Task updated successfully!' },
    timelineTaskDeletedSuccess: { pt: 'Tarefa excluída com sucesso!', en: 'Task deleted successfully!' },
    timelineSendNotification: { pt: 'Enviar notificação', en: 'Send notification' },
    timelineNotifyBefore: { pt: 'Notificar com', en: 'Notify before' },
    timelineDaysBefore: { pt: 'dias de antecedência', en: 'days in advance' },
    timelineEstimatedHours: { pt: 'Horas estimadas', en: 'Estimated hours' },
    timelineAssignMembers: { pt: 'Atribuir membros', en: 'Assign members' },
    timelineAddDependencies: { pt: 'Adicionar dependências', en: 'Add dependencies' },
    timelineSelectDependencies: { pt: 'Selecione tarefas que devem ser concluídas antes', en: 'Select tasks that must be completed before' },
    
    // Calendar Views
    timelineSelectDate: { pt: 'Selecionar data', en: 'Select date' },
    timelineWeekView: { pt: 'Visão Semanal', en: 'Week View' },
    timelineMonthView: { pt: 'Visão Mensal', en: 'Month View' },
    timelineDayView: { pt: 'Visão Diária', en: 'Day View' },
    timelineAllDay: { pt: 'Dia Todo', en: 'All Day' },
    timelineNoTasksToday: { pt: 'Nenhuma tarefa para hoje', en: 'No tasks for today' },
    timelineNoTasksThisWeek: { pt: 'Nenhuma tarefa esta semana', en: 'No tasks this week' },
    timelineNoTasksThisMonth: { pt: 'Nenhuma tarefa este mês', en: 'No tasks this month' },
    
    // Gantt View
    timelineGanttView: { pt: 'Gráfico de Gantt', en: 'Gantt Chart' },
    timelineTimeline: { pt: 'Timeline', en: 'Timeline' },
    timelineZoomIn: { pt: 'Ampliar', en: 'Zoom In' },
    timelineZoomOut: { pt: 'Reduzir', en: 'Zoom Out' },
    timelineAutoSchedule: { pt: 'Auto-agendar', en: 'Auto-schedule' },
    timelineManual: { pt: 'Manual', en: 'Manual' },
    timelineAutomatic: { pt: 'Automático', en: 'Automatic' },
    
    // Calendar interactions
    timelineDurationAdjusted: { pt: 'Duração ajustada', en: 'Duration adjusted' },
    timelineTaskRepositioned: { pt: 'Tarefa reposicionada', en: 'Task repositioned' },
    timelineTasksOrganized: { pt: 'Tarefas organizadas em colunas', en: 'Tasks organized in columns' },
    timelineTaskMoved: { pt: 'tarefa afastada', en: 'task moved' },
    timelineTasksMoved: { pt: 'tarefas afastadas', en: 'tasks moved' },
    timelineDependencyCreated: { pt: 'Dependência criada', en: 'Dependency created' },
    timelineTaskReturned: { pt: 'Tarefa retornou para posição original', en: 'Task returned to original position' },
    timelineConflictDetected: { pt: 'Conflito de Horário Detectado', en: 'Time Conflict Detected' },
    timelineConflictWith: { pt: 'A nova posição conflita com', en: 'The new position conflicts with' },
    timelineOtherTask: { pt: 'outra tarefa', en: 'another task' },
    timelineOtherTasks: { pt: 'outras tarefas', en: 'other tasks' },
    timelineChooseAction: { pt: 'Escolha uma ação:', en: 'Choose an action:' },
    timelineOverlapTasks: { pt: 'Sobrepor (organizar em colunas)', en: 'Overlap (organize in columns)' },
    timelineOverlapDescription: { pt: 'Tarefas ficarão lado a lado sem empurrar outras', en: 'Tasks will be side by side without pushing others' },
    timelinePushTasks: { pt: 'Empurrar Tarefas', en: 'Push Tasks' },
    timelinePushDescription: { pt: 'Afasta automaticamente as tarefas conflitantes', en: 'Automatically moves conflicting tasks away' },
    timelineWorkingHours: { pt: 'Horário de Trabalho', en: 'Working Hours' },
    timelineClickToCreateTask: { pt: 'Clique para criar tarefa', en: 'Click to create task' },
    timelineDragToReschedule: { pt: 'Arraste para reagendar', en: 'Drag to reschedule' },
    timelineTasksOnDay: { pt: 'tarefas neste dia', en: 'tasks on this day' },
    timelineMoreTasks: { pt: 'mais tarefas', en: 'more tasks' },
    timelineTodayMarker: { pt: 'Hoje', en: 'Today' },
    timelineCurrentTime: { pt: 'Horário Atual', en: 'Current Time' },
    
    // Gantt View specific
    timelineYearly: { pt: 'Anual', en: 'Yearly' },
    timelineSemester: { pt: 'Semestral', en: 'Semester' },
    timelineQuarterly: { pt: 'Trimestral', en: 'Quarterly' },
    timelineMonthly: { pt: 'Mensal', en: 'Monthly' },
    timelineWeekly: { pt: 'Semanal', en: 'Weekly' },
    timelineTaskBar: { pt: 'Barra de Tarefa', en: 'Task Bar' },
    timelineProgressBar: { pt: 'Barra de Progresso', en: 'Progress Bar' },
    timelineMilestone: { pt: 'Marco', en: 'Milestone' },
    timelineBaseline: { pt: 'Linha de Base', en: 'Baseline' },
    
    // Stats & Dashboard
    timelineTotalTasks: { pt: 'Total de Tarefas', en: 'Total Tasks' },
    timelineActiveTasks: { pt: 'Tarefas Ativas', en: 'Active Tasks' },
    timelineCompletedTasks: { pt: 'Tarefas Concluídas', en: 'Completed Tasks' },
    timelineUpcomingTasks: { pt: 'Próximas Tarefas', en: 'Upcoming Tasks' },
    timelineCompletionRate: { pt: 'Taxa de Conclusão', en: 'Completion Rate' },
    timelineProjectProgress: { pt: 'Progresso do Projeto', en: 'Project Progress' },
    timelineTeamProductivity: { pt: 'Produtividade do Time', en: 'Team Productivity' },
    timelineAverageCompletionTime: { pt: 'Tempo Médio de Conclusão', en: 'Average Completion Time' },
    timelineOnTrack: { pt: 'No Prazo', en: 'On Track' },
    timelineAtRisk: { pt: 'Em Risco', en: 'At Risk' },
    timelineDelayed: { pt: 'Atrasado', en: 'Delayed' },
    
    // Dependency specific
    timelineDependencyType: { pt: 'Tipo de Dependência', en: 'Dependency Type' },
    timelineFinishToStart: { pt: 'Término-Início', en: 'Finish-to-Start' },
    timelineStartToStart: { pt: 'Início-Início', en: 'Start-to-Start' },
    timelineFinishToFinish: { pt: 'Término-Término', en: 'Finish-to-Finish' },
    timelineStartToFinish: { pt: 'Início-Término', en: 'Start-to-Finish' },
    timelineCreateDependency: { pt: 'Criar Dependência', en: 'Create Dependency' },
    timelineManageDependencies: { pt: 'Gerenciar Dependências', en: 'Manage Dependencies' },
    timelineDependsOn: { pt: 'Depende de', en: 'Depends on' },
    timelineRequiredBy: { pt: 'Requerida por', en: 'Required by' },
    timelineCriticalPath: { pt: 'Caminho Crítico', en: 'Critical Path' },
    timelineCircularDependency: { pt: 'Dependência Circular Detectada', en: 'Circular Dependency Detected' },
    timelineInvalidDependency: { pt: 'Dependência Inválida', en: 'Invalid Dependency' },
    
    // Notifications & Alerts
    timelineNewNotification: { pt: 'Nova Notificação', en: 'New Notification' },
    timelineTaskDueSoon: { pt: 'Tarefa com prazo próximo', en: 'Task due soon' },
    timelineTaskOverdue: { pt: 'Tarefa atrasada', en: 'Task overdue' },
    timelineDependencyBlocked: { pt: 'Tarefa bloqueada por dependência', en: 'Task blocked by dependency' },
    timelineAssignedToYou: { pt: 'Atribuída a você', en: 'Assigned to you' },
    timelineStatusChanged: { pt: 'Status alterado', en: 'Status changed' },
    timelineCommentAdded: { pt: 'Comentário adicionado', en: 'Comment added' },
    
    // Home Dashboard
    timelineWelcome: { pt: 'Bem-vindo ao Timeline', en: 'Welcome to Timeline' },
    timelineYourTasks: { pt: 'Suas Tarefas', en: 'Your Tasks' },
    timelineProjectSummary: { pt: 'Resumo de Projetos', en: 'Project Summary' },
    timelineQuickActions: { pt: 'Ações Rápidas', en: 'Quick Actions' },
    timelineNoRecentActivity: { pt: 'Nenhuma atividade recente', en: 'No recent activity' },
    
    // Bulk Import
    timelineTasksValidated: { pt: 'tarefas validadas com sucesso!', en: 'tasks validated successfully!' },
    timelineErrorProcessingFile: { pt: 'Erro ao processar arquivo. Verifique o formato.', en: 'Error processing file. Check the format.' },
    timelineNoValidTasks: { pt: 'Nenhuma tarefa válida para importar', en: 'No valid tasks to import' },
    timelineTasksImportedSuccess: { pt: 'tarefas importadas com sucesso!', en: 'tasks imported successfully!' },
    timelineValidTasks: { pt: 'Tarefas Válidas', en: 'Valid Tasks' },
    timelineInvalidTasks: { pt: 'Tarefas Inválidas', en: 'Invalid Tasks' },
    timelineValidationResults: { pt: 'Resultados da Validação', en: 'Validation Results' },
    timelineSelectFile: { pt: 'Selecionar Arquivo', en: 'Select File' },
    timelineDropFile: { pt: 'ou arraste e solte', en: 'or drag and drop' },
    timelineCsvJsonSupported: { pt: 'CSV ou JSON (máx. 10MB)', en: 'CSV or JSON (max. 10MB)' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // FORMS & VALIDATION
  // ═══════════════════════════════════════════════════════════════════
  forms: {
    required: { pt: 'Campo obrigatório', en: 'Required field' },
    invalidEmail: { pt: 'Email inválido', en: 'Invalid email' },
    invalidDate: { pt: 'Data inválida', en: 'Invalid date' },
    invalidFormat: { pt: 'Formato inválido', en: 'Invalid format' },
    tooShort: { pt: 'Muito curto', en: 'Too short' },
    tooLong: { pt: 'Muito longo', en: 'Too long' },
    
    // Field labels
    name: { pt: 'Nome', en: 'Name' },
    title: { pt: 'Título', en: 'Title' },
    description: { pt: 'Descrição', en: 'Description' },
    category: { pt: 'Categoria', en: 'Category' },
    tags: { pt: 'Tags', en: 'Tags' },
    notes: { pt: 'Notas', en: 'Notes' },
    attachments: { pt: 'Anexos', en: 'Attachments' },
    objective: { pt: 'Objetivo', en: 'Objective' },
    targetAudience: { pt: 'Público-Alvo', en: 'Target Audience' },
    briefing: { pt: 'Briefing', en: 'Briefing' },
    startDate: { pt: 'Data de Início', en: 'Start Date' },
    endDate: { pt: 'Data de Fim', en: 'End Date' },
    priority: { pt: 'Prioridade', en: 'Priority' },
    status: { pt: 'Status', en: 'Status' },
    project: { pt: 'Projeto', en: 'Project' },
    team: { pt: 'Equipe', en: 'Team' },
    assignedTo: { pt: 'Atribuído a', en: 'Assigned to' },
    
    // Placeholders
    searchPlaceholder: { pt: 'Buscar...', en: 'Search...' },
    searchFunctionalityPlaceholder: { pt: 'Buscar funcionalidade...', en: 'Search functionality...' },
    searchProductsPlaceholder: { pt: 'Buscar produtos...', en: 'Search products...' },
    searchByTitleDescTags: { pt: 'Buscar por título, descrição ou tags...', en: 'Search by title, description or tags...' },
    enterCampaignName: { pt: 'Digite o nome da campanha', en: 'Enter campaign name' },
    enterObjective: { pt: 'Digite o objetivo da campanha', en: 'Enter campaign objective' },
    describeTargetAudience: { pt: 'Descreva o público-alvo', en: 'Describe target audience' },
    enterBriefing: { pt: 'Digite o briefing completo', en: 'Enter complete briefing' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // MESSAGES & NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════
  messages: {
    success: { pt: 'Sucesso!', en: 'Success!' },
    error: { pt: 'Erro', en: 'Error' },
    warning: { pt: 'Atenção', en: 'Warning' },
    info: { pt: 'Informação', en: 'Info' },
    
    saveSuccess: { pt: 'Salvo com sucesso', en: 'Saved successfully' },
    deleteSuccess: { pt: 'Excluído com sucesso', en: 'Deleted successfully' },
    updateSuccess: { pt: 'Atualizado com sucesso', en: 'Updated successfully' },
    createSuccess: { pt: 'Criado com sucesso', en: 'Created successfully' },
    
    saveFailed: { pt: 'Falha ao salvar', en: 'Failed to save' },
    deleteFailed: { pt: 'Falha ao excluir', en: 'Failed to delete' },
    updateFailed: { pt: 'Falha ao atualizar', en: 'Failed to update' },
    createFailed: { pt: 'Falha ao criar', en: 'Failed to create' },
    
    confirmDelete: { pt: 'Tem certeza que deseja excluir?', en: 'Are you sure you want to delete?' },
    unsavedChanges: { pt: 'Alterações não salvas', en: 'Unsaved changes' },
    noData: { pt: 'Nenhum dado disponível', en: 'No data available' },
    noResults: { pt: 'Nenhum resultado encontrado', en: 'No results found' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SITEMAP
  // ═══════════════════════════════════════════════════════════════════
  sitemap: {
    title: { pt: 'Mapa do Site', en: 'Site Map' },
    architecture: { pt: 'Arquitetura da Plataforma', en: 'Platform Architecture' },
    description: { pt: 'Navegação completa e estrutura hierárquica do sistema', en: 'Complete navigation and hierarchical system structure' },
    totalPages: { pt: 'páginas', en: 'pages' },
    publicRoute: { pt: 'Rota Pública', en: 'Public Route' },
    protectedRoute: { pt: 'Rota Protegida', en: 'Protected Route' },
    authenticationRequired: { pt: 'Autenticação obrigatória', en: 'Authentication required' },
    accessibleToAll: { pt: 'Acessível a todos', en: 'Accessible to all' },
    platformCore: { pt: 'NÚCLEO DA PLATAFORMA', en: 'PLATFORM CORE' },
    brandModule: { pt: 'MÓDULO BRAND', en: 'BRAND MODULE' },
    toolsModule: { pt: 'MÓDULO TOOLS', en: 'TOOLS MODULE' },
    marketingModule: { pt: 'MÓDULO MARKETING', en: 'MARKETING MODULE' },
    brandStudio: { pt: 'Brand Studio', en: 'Brand Studio' },
    designTools: { pt: 'Ferramentas de Design', en: 'Design Tools' },
    projectManagement: { pt: 'Gestão de Projetos', en: 'Project Management' },
    campaigns: { pt: 'Campanhas', en: 'Campaigns' },
    contentCreation: { pt: 'Criação de Conteúdo', en: 'Content Creation' },
    documentation: { pt: 'Documentação', en: 'Documentation' },
    visualCommunication: { pt: 'Comunicação Visual', en: 'Visual Communication' },
    products: { pt: 'Produtos', en: 'Products' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // TIME & DATES
  // ═══════════════════════════════════════════════════════════════════
  time: {
    today: { pt: 'Hoje', en: 'Today' },
    yesterday: { pt: 'Ontem', en: 'Yesterday' },
    tomorrow: { pt: 'Amanhã', en: 'Tomorrow' },
    thisWeek: { pt: 'Esta Semana', en: 'This Week' },
    thisMonth: { pt: 'Este Mês', en: 'This Month' },
    thisYear: { pt: 'Este Ano', en: 'This Year' },
    
    // Months
    january: { pt: 'Janeiro', en: 'January' },
    february: { pt: 'Fevereiro', en: 'February' },
    march: { pt: 'Março', en: 'March' },
    april: { pt: 'Abril', en: 'April' },
    may: { pt: 'Maio', en: 'May' },
    june: { pt: 'Junho', en: 'June' },
    july: { pt: 'Julho', en: 'July' },
    august: { pt: 'Agosto', en: 'August' },
    september: { pt: 'Setembro', en: 'September' },
    october: { pt: 'Outubro', en: 'October' },
    november: { pt: 'Novembro', en: 'November' },
    december: { pt: 'Dezembro', en: 'December' },
    
    // Days of week
    monday: { pt: 'Segunda', en: 'Monday' },
    tuesday: { pt: 'Terça', en: 'Tuesday' },
    wednesday: { pt: 'Quarta', en: 'Wednesday' },
    thursday: { pt: 'Quinta', en: 'Thursday' },
    friday: { pt: 'Sexta', en: 'Friday' },
    saturday: { pt: 'Sábado', en: 'Saturday' },
    sunday: { pt: 'Domingo', en: 'Sunday' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // ERROR PAGES
  // ═══════════════════════════════════════════════════════════════════
  errors: {
    notFound: { pt: 'Página não encontrada', en: 'Page not found' },
    notFoundDescription: { pt: 'A página que você procura não existe', en: 'The page you are looking for does not exist' },
    goHome: { pt: 'Ir para Início', en: 'Go to Home' },
    serverError: { pt: 'Erro no servidor', en: 'Server error' },
    serverErrorDescription: { pt: 'Ocorreu um erro no servidor', en: 'A server error occurred' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // BACKLOG CONTROL
  // ═══════════════════════════════════════════════════════════════════
  backlog: {
    title: { pt: 'Backlog Control', en: 'Backlog Control' },
    subtitle: { pt: 'Mapeamento Completo de Funcionalidades', en: 'Complete Feature Mapping' },
    allModules: { pt: 'Todos os Módulos', en: 'All Modules' },
    allStatus: { pt: 'Todos os Status', en: 'All Status' },
    showing: { pt: 'Mostrando', en: 'Showing' },
    of: { pt: 'de', en: 'of' },
    functionalities: { pt: 'funcionalidades', en: 'functionalities' },
    noResults: { pt: 'Nenhum resultado encontrado', en: 'No results found' },
    tryDifferentFilter: { pt: 'Tente ajustar seus filtros', en: 'Try adjusting your filters' },
    
    // Status específicos do backlog
    online: { pt: 'Online', en: 'Online' },
    offline: { pt: 'Offline', en: 'Offline' },
    placeholder: { pt: 'Placeholder', en: 'Placeholder' },
    pending: { pt: 'Pendente', en: 'Pending' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // CAMPANHAS (específico)
  // ═════════════════════════════════════════════════════���═════════════
  campaigns: {
    // Active campaigns
    campaignsRunning: { pt: 'campanhas em execução', en: 'campaigns running' },
    thisMonth: { pt: 'este mês', en: 'this month' },
    
    // Titles and descriptions
    activeCampaignsTitle: { pt: 'Campanhas Ativas', en: 'Active Campaigns' },
    activeCampaignsDescription: { pt: 'campanha em andamento', en: 'campaign in progress' },
    activeCampaignsDescriptionPlural: { pt: 'campanhas em andamento', en: 'campaigns in progress' },
    newCampaign: { pt: 'Nova Campanha', en: 'New Campaign' },
    
    // Stats
    totalReachStat: { pt: 'Total de Alcance', en: 'Total Reach' },
    averageEngagement: { pt: 'Engajamento Médio', en: 'Average Engagement' },
    totalInvestment: { pt: 'Investimento Total', en: 'Total Investment' },
    activePlatforms: { pt: 'Plataformas Ativas', en: 'Active Platforms' },
    activeBudget: { pt: 'Orçamento ativo', en: 'Active budget' },
    multiChannel: { pt: 'Multi-canal', en: 'Multi-channel' },
    
    // Campaign status
    inProgress: { pt: 'Em andamento', en: 'In progress' },
    
    // Campaign fields
    progress: { pt: 'Progresso', en: 'Progress' },
    platforms: { pt: 'Plataformas', en: 'Platforms' },
    
    // Actions
    viewMetrics: { pt: 'Ver Métricas', en: 'View Metrics' },
    manage: { pt: 'Gerenciar', en: 'Manage' },
    viewDetails: { pt: 'Ver Detalhes', en: 'View Details' },
    
    // Future campaigns
    futureCampaignsTitle: { pt: 'Campanhas Futuras', en: 'Future Campaigns' },
    futureCampaignsDescription: { pt: 'Planejamento e preparação de campanhas agendadas', en: 'Planning and preparation of scheduled campaigns' },
    plannedCampaigns: { pt: 'Campanhas Planejadas', en: 'Planned Campaigns' },
    projectedBudget: { pt: 'Orçamento Projetado', en: 'Projected Budget' },
    nextLaunch: { pt: 'Próximo Lançamento', en: 'Next Launch' },
    days: { pt: 'dias', en: 'days' },
    saved: { pt: 'salva(s)', en: 'saved' },
    campaigns: { pt: 'campanhas', en: 'campaigns' },
    pendingTasks: { pt: 'Tarefas Pendentes', en: 'Pending Tasks' },
    distributedAmongTeams: { pt: 'Distribuídas entre equipes', en: 'Distributed among teams' },
    createdCampaigns: { pt: 'Campanhas Criadas', en: 'Created Campaigns' },
    createdByAutomaticSystem: { pt: 'Campanhas criadas pelo sistema de criação automática', en: 'Campaigns created by the automatic creation system' },
    planCampaign: { pt: 'Planejar Campanha', en: 'Plan Campaign' },
    for2026: { pt: 'Para 2026', en: 'For 2026' },
    
    // Past campaigns
    pastCampaignsTitle: { pt: 'Campanhas Passadas', en: 'Past Campaigns' },
    pastCampaignsDescription: { pt: 'Histórico e análise de campanhas concluídas', en: 'History and analysis of completed campaigns' },
    pastCampaignsDescriptionAlt: { pt: 'Histórico e análise de campanhas finalizadas', en: 'History and analysis of finished campaigns' },
    completedCampaigns: { pt: 'Campanhas Concludas', en: 'Completed Campaigns' },
    totalBudgetUsed: { pt: 'Orçamento Total Usado', en: 'Total Budget Used' },
    totalInvested: { pt: 'Total Investido', en: 'Total Invested' },
    averagePerformance: { pt: 'Performance Média', en: 'Average Performance' },
    averageRoi: { pt: 'ROI Médio', en: 'Average ROI' },
    conversionRate: { pt: 'Taxa de Conversão', en: 'Conversion Rate' },
    exportReport: { pt: 'Exportar Relatório', en: 'Export Report' },
    in2025: { pt: 'Em 2025', en: 'In 2025' },
    overGoal: { pt: 'acima da meta', en: 'over goal' },
    excellentPerformance: { pt: 'Excelente performance', en: 'Excellent performance' },
    totalReach: { pt: 'Alcance Total', en: 'Total Reach' },
    uniqueImpressions: { pt: 'Impressões únicas', en: 'Unique impressions' },
    goal: { pt: 'Meta', en: 'Goal' },
    period: { pt: 'Período', en: 'Period' },
    spent: { pt: 'Gasto', en: 'Spent' },
    reach: { pt: 'Alcance', en: 'Reach' },
    engagement: { pt: 'Engajamento', en: 'Engagement' },
    conversion: { pt: 'Conversão', en: 'Conversion' },
    viewReport: { pt: 'Ver Relatório', en: 'View Report' },
    completed: { pt: 'Concluída', en: 'Completed' },
    excellent: { pt: 'Excelente', en: 'Excellent' },
    good: { pt: 'Bom', en: 'Good' },
    regular: { pt: 'Regular', en: 'Regular' },
    
    // Saved campaigns
    savedCampaigns: { pt: 'Campanhas Salvas', en: 'Saved Campaigns' },
    scheduledFor: { pt: 'Agendada para', en: 'Scheduled for' },
    materials: { pt: 'materiais', en: 'materials' },
    createdAt: { pt: 'Criada em', en: 'Created at' },
    noCampaigns: { pt: 'Nenhuma campanha encontrada', en: 'No campaigns found' },
    noCampaignsDescription: { pt: 'Crie sua primeira campanha para começar', en: 'Create your first campaign to get started' },
    
    // Campaign creation
    createCampaignTitle: { pt: 'Criar Nova Campanha', en: 'Create New Campaign' },
    saveDraft: { pt: 'Salvar Rascunho', en: 'Save Draft' },
    createCampaignButton: { pt: 'Criar Campanha', en: 'Create Campaign' },
    basicInfo: { pt: 'Informações Básicas', en: 'Basic Information' },
    strategyAndGoals: { pt: 'Estratégia e Objetivos', en: 'Strategy and Goals' },
    
    // Advanced campaign
    generateMaterialsAndCreate: { pt: 'Gerar Materiais e Criar Campanha', en: 'Generate Materials and Create Campaign' },
    backAndEdit: { pt: 'Voltar e Editar', en: 'Back and Edit' },
    nextSteps: { pt: 'Próximos Passos', en: 'Next Steps' },
    saveCampaignWithMaterials: { pt: 'Salve a campanha com os materiais gerados', en: 'Save the campaign with generated materials' },
    fillCampaignName: { pt: 'Por favor, preencha o nome da campanha', en: 'Please fill in the campaign name' },
    previewMaterials: { pt: 'Pré-visualizar Materiais', en: 'Preview Materials' },
    generatedMaterials: { pt: 'Materiais Gerados', en: 'Generated Materials' },
    materialsGeneratedSuccess: { pt: 'materiais gerados com sucesso', en: 'materials generated successfully' },
    
    // Comparisons
    vsPreviousMonth: { pt: 'vs mês anterior', en: 'vs previous month' },
    vsLastYear: { pt: 'vs. ano anterior', en: 'vs. last year' },
    aboveAverage: { pt: 'Acima da média', en: 'Above average' },
    day: { pt: 'Dia', en: 'Day' },
    
    // Campaign examples (data)
    newYear2026: { pt: 'Ano Novo 2026', en: 'New Year 2026' },
    newYearDescription: { pt: 'Campanha de lançamento do ano com promoções especiais', en: 'Year launch campaign with special promotions' },
    christmas2025: { pt: 'Natal 2025', en: 'Christmas 2025' },
    christmasDescription: { pt: 'Campanha de fim de ano com foco em presentes', en: 'End of year campaign focused on gifts' },
    blackFriday2025: { pt: 'Black Friday 2025', en: 'Black Friday 2025' },
    blackFridayDescription: { pt: 'Maior campanha do ano com descontos agressivos', en: 'Biggest campaign of the year with aggressive discounts' },
    mothersDay2025: { pt: 'Dia das Mães 2025', en: "Mother's Day 2025" },
    mothersDay2026: { pt: 'Dia das Mães 2026', en: "Mother's Day 2026" },
    mothersDayDescription: { pt: 'Campanha emocional com storytelling', en: 'Emotional campaign with storytelling' },
    easter2025: { pt: 'Páscoa 2025', en: 'Easter 2025' },
    easterDescription: { pt: 'Campanha sazonal com produtos temáticos', en: 'Seasonal campaign with thematic products' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // DOCUMENTOS (específico)
  // ═══════════════════════════════════════════════════════════════════
  documents: {
    // Titles
    title: { pt: 'Documentos & Materiais', en: 'Documents & Materials' },
    description: { pt: 'Biblioteca central de todos os materiais corporativos', en: 'Central library of all corporate materials' },
    uploadMaterial: { pt: 'Upload Material', en: 'Upload Material' },
    
    // Stats
    totalFiles: { pt: 'Total de Arquivos', en: 'Total Files' },
    multipleFormats: { pt: 'Múltiplos formatos', en: 'Multiple formats' },
    totalSize: { pt: 'Tamanho Total', en: 'Total Size' },
    storageUsed: { pt: 'Armazenamento usado', en: 'Storage used' },
    downloads30d: { pt: 'Downloads (30d)', en: 'Downloads (30d)' },
    lastMonth: { pt: 'Último mês', en: 'Last month' },
    favorites: { pt: 'Favoritos', en: 'Favorites' },
    mostAccessed: { pt: 'Mais acessados', en: 'Most accessed' },
    
    // Search and filters
    searchPlaceholder: { pt: 'Buscar por título, descrição ou tags...', en: 'Search by title, description or tags...' },
    filters: { pt: 'Filtros', en: 'Filters' },
    
    // Categories
    allCategories: { pt: 'Todos', en: 'All' },
    identity: { pt: 'Identidade', en: 'Identity' },
    campaigns: { pt: 'Campanhas', en: 'Campaigns' },
    templates: { pt: 'Templates', en: 'Templates' },
    institutional: { pt: 'Institucional', en: 'Institutional' },
    commercial: { pt: 'Comercial', en: 'Commercial' },
    reports: { pt: 'Relatórios', en: 'Reports' },
    
    // Document details
    uploadedOn: { pt: 'Enviado em', en: 'Uploaded on' },
    view: { pt: 'Ver', en: 'View' },
    download: { pt: 'Baixar', en: 'Download' },
    
    // Empty state
    noDocuments: { pt: 'Nenhum documento encontrado com os filtros selecionados', en: 'No documents found with selected filters' },
    
    // Data examples
    performanceReportJanuary: { pt: 'Relatório de Performance - Janeiro', en: 'Performance Report - January' },
    performanceReportDescription: { pt: 'Análise completa de métricas e resultados de janeiro', en: 'Complete analysis of metrics and January results' },
    
    // Tags
    tagSummer: { pt: 'Verão', en: 'Summer' },
    tagImages: { pt: 'Imagens', en: 'Images' },
    tagSocialMedia: { pt: 'Social Media', en: 'Social Media' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // PRODUTOS (específico)
  // ═══════════════════════════════════════════════════════════════════
  products: {
    // Titles
    title: { pt: 'Produtos & Embalagens', en: 'Products & Packaging' },
    description: { pt: 'Gestão de produtos e design de embalagens', en: 'Product management and packaging design' },
    newProduct: { pt: 'Novo Produto', en: 'New Product' },
    
    // Stats
    activeProducts: { pt: 'Produtos Ativos', en: 'Active Products' },
    inCatalog: { pt: 'Em catálogo', en: 'In catalog' },
    totalVariations: { pt: 'Total de Variações', en: 'Total Variations' },
    differentSkus: { pt: 'SKUs diferentes', en: 'Different SKUs' },
    unitsProduced: { pt: 'Unidades Produzidas', en: 'Units Produced' },
    vsLastYear: { pt: 'vs. ano anterior', en: 'vs. last year' },
    inDevelopment: { pt: 'Em Desenvolvimento', en: 'In Development' },
    newReleases: { pt: 'Novos lançamentos', en: 'New releases' },
    
    // Search and filters
    searchPlaceholder: { pt: 'Buscar produtos...', en: 'Search products...' },
    filters: { pt: 'Filtros', en: 'Filters' },
    
    // Categories
    all: { pt: 'Todos', en: 'All' },
    premiumLine: { pt: 'Linha Premium', en: 'Premium Line' },
    sustainable: { pt: 'Sustentável', en: 'Sustainable' },
    specialEdition: { pt: 'Edição Especial', en: 'Special Edition' },
    corporate: { pt: 'Corporativo', en: 'Corporate' },
    baseLine: { pt: 'Linha Base', en: 'Base Line' },
    gifts: { pt: 'Presentes', en: 'Gifts' },
    
    // Product status
    active: { pt: 'Ativo', en: 'Active' },
    inProduction: { pt: 'Em produção', en: 'In production' },
    planned: { pt: 'Planejado', en: 'Planned' },
    
    // Product details
    packaging: { pt: 'Embalagem', en: 'Packaging' },
    colorPalette: { pt: 'Paleta de Cores', en: 'Color Palette' },
    dimensions: { pt: 'Dimensões', en: 'Dimensions' },
    weight: { pt: 'Peso', en: 'Weight' },
    variations: { pt: 'Variações', en: 'Variations' },
    produced: { pt: 'Produzidas', en: 'Produced' },
    updatedOn: { pt: 'Atualizado em', en: 'Updated on' },
    
    // Actions
    view: { pt: 'Ver', en: 'View' },
    edit: { pt: 'Editar', en: 'Edit' },
    
    // Empty state
    noProducts: { pt: 'Nenhum produto encontrado com os filtros selecionados', en: 'No products found with selected filters' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // TIMELINE / COREACT (específico)
  // ═══════════════════════════════════════════════════════════════════
  timeline: {
    title: { pt: 'CoreAct Timeline', en: 'CoreAct Timeline' },
    
    // Views
    calendar: { pt: 'Calendário', en: 'Calendar' },
    timeline: { pt: 'Timeline', en: 'Timeline' },
    kanban: { pt: 'Kanban', en: 'Kanban' },
    budget: { pt: 'Orçamento', en: 'Budget' },
    team: { pt: 'Equipe', en: 'Team' },
    
    // Tasks
    task: { pt: 'Tarefa', en: 'Task' },
    tasks: { pt: 'Tarefas', en: 'Tasks' },
    createTask: { pt: 'Criar Tarefa', en: 'Create Task' },
    editTask: { pt: 'Editar Tarefa', en: 'Edit Task' },
    deleteTask: { pt: 'Excluir Tarefa', en: 'Delete Task' },
    taskTitle: { pt: 'Título da Tarefa', en: 'Task Title' },
    taskDescription: { pt: 'Descrição da Tarefa', en: 'Task Description' },
    
    // Projects
    project: { pt: 'Projeto', en: 'Project' },
    projects: { pt: 'Projetos', en: 'Projects' },
    selectProject: { pt: 'Selecione um projeto', en: 'Select a project' },
    
    // Priority
    priorityHigh: { pt: 'Alta', en: 'High' },
    priorityMedium: { pt: 'Média', en: 'Medium' },
    priorityLow: { pt: 'Baixa', en: 'Low' },
    
    // Team management
    overload: { pt: 'Sobrecarga', en: 'Overload' },
    workload: { pt: 'Carga de Trabalho', en: 'Workload' },
    capacity: { pt: 'Capacidade', en: 'Capacity' },
    availability: { pt: 'Disponibilidade', en: 'Availability' },
    
    // Budget
    budgetControl: { pt: 'Controle Orçamentário', en: 'Budget Control' },
    totalBudget: { pt: 'Orçamento Total', en: 'Total Budget' },
    spent: { pt: 'Gasto', en: 'Spent' },
    remaining: { pt: 'Restante', en: 'Remaining' },
    
    // Import/Export
    bulkImport: { pt: 'Importação em Lote', en: 'Bulk Import' },
    importTasks: { pt: 'Importar Tarefas', en: 'Import Tasks' },
    helpAndTemplates: { pt: 'Ajuda & Templates', en: 'Help & Templates' },
    
    // Dialog messages
    saveChanges: { pt: 'Salvar Alterações', en: 'Save Changes' },
    editTaskDescription: { pt: 'Edite os detalhes da tarefa abaixo', en: 'Edit task details below' },
  },

  // ══════════════════════════════════════════════════════════════════
  // PLACEHOLDER PAGE
  // ═══════════════════════════════════════════════════════════════════
  placeholder: {
    moduleStatus: { pt: 'Status do Módulo', en: 'Module Status' },
    nextSteps: { pt: 'Próximos Passos', en: 'Next Steps' },
    comingSoon: { pt: 'Em Breve', en: 'Coming Soon' },
    underDevelopment: { pt: 'Em Desenvolvimento', en: 'Under Development' },
  },

  // ═══════════════════════════════════════════════════════════════════
  // AUTHENTICATION & USER
  // ═══════════════════════════════════════════════════════════════════
  auth: {
    // Login page
    signInTitle: { pt: 'Entre na sua conta', en: 'Sign in to your account' },
    signUpTitle: { pt: 'Crie sua conta', en: 'Create your account' },
    email: { pt: 'Email', en: 'Email' },
    password: { pt: 'Senha', en: 'Password' },
    name: { pt: 'Nome', en: 'Name' },
    emailPlaceholder: { pt: 'seu@email.com', en: 'your@email.com' },
    passwordPlaceholder: { pt: '••••••••', en: '••••••••' },
    namePlaceholder: { pt: 'Seu nome', en: 'Your name' },
    signIn: { pt: 'Entrar', en: 'Sign In' },
    signUp: { pt: 'Criar Conta', en: 'Sign Up' },
    signOut: { pt: 'Sair', en: 'Sign Out' },
    signingIn: { pt: 'Entrando...', en: 'Signing in...' },
    signingUp: { pt: 'Criando conta...', en: 'Creating account...' },
    
    // Account actions
    noAccount: { pt: 'Não tem uma conta?', en: "Don't have an account?" },
    hasAccount: { pt: 'Já tem uma conta?', en: 'Already have an account?' },
    signUpLink: { pt: 'Criar conta', en: 'Sign up' },
    signInLink: { pt: 'Fazer login', en: 'Sign in' },
    forgotPassword: { pt: 'Esqueceu a senha?', en: 'Forgot password?' },
    resetPassword: { pt: 'Redefinir senha', en: 'Reset password' },
    
    // User menu
    myAccount: { pt: 'Minha Conta', en: 'My Account' },
    profile: { pt: 'Perfil', en: 'Profile' },
    
    // Messages
    loginSuccess: { pt: 'Login realizado com sucesso!', en: 'Successfully logged in!' },
    logoutSuccess: { pt: 'Logout realizado com sucesso!', en: 'Successfully logged out!' },
    signUpSuccess: { pt: 'Conta criada! Faça login para continuar.', en: 'Account created! Sign in to continue.' },
    authError: { pt: 'Erro ao autenticar. Tente novamente.', en: 'Authentication error. Try again.' },
    invalidCredentials: { pt: 'Email ou senha inválidos', en: 'Invalid email or password' },
    emailInUse: { pt: 'Este email já está em uso', en: 'This email is already in use' },
    weakPassword: { pt: 'Senha muito fraca. Use pelo menos 6 caracteres.', en: 'Password too weak. Use at least 6 characters.' },
  },

} as const;

// Helper type para autocomplete
export type TranslationKey = keyof typeof translations;
export type TranslationSubKey<T extends TranslationKey> = keyof typeof translations[T];