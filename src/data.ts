import { Autoridade, GastoUnificado, Poder, CategoriaUnificada } from "./types";

export const AUTORIDADES: Autoridade[] = [
  {
    id: "lula-123",
    nome: "Luiz Inácio Lula da Silva",
    cargo: "Presidente da República",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Presidência da República",
    estado: "Federal",
    foto_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200", // Placeholder elegant profile
    ativo: true
  },
  {
    id: "lira-456",
    nome: "Arthur Lira",
    cargo: "Presidente da Câmara dos Deputados",
    poder: Poder.LEGISLATIVO,
    orgao_instituicao: "Câmara dos Deputados",
    estado: "AL",
    foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  },
  {
    id: "barroso-789",
    nome: "Luís Roberto Barroso",
    cargo: "Presidente do STF",
    poder: Poder.JUDICIARIO,
    orgao_instituicao: "Supremo Tribunal Federal",
    estado: "Federal",
    foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  },
  {
    id: "pacheco-101",
    nome: "Rodrigo Pacheco",
    cargo: "Presidente do Senado",
    poder: Poder.LEGISLATIVO,
    orgao_instituicao: "Senado Federal",
    estado: "MG",
    foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  },
  {
    id: "leite-202",
    nome: "Eduardo Leite",
    cargo: "Governador do Rio Grande do Sul",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do RS",
    estado: "RS",
    foto_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  },
  {
    id: "tarcisio-303",
    nome: "Tarcísio de Freitas",
    cargo: "Governador de São Paulo",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de SP",
    estado: "SP",
    foto_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  },
  {
    id: "haddad-404",
    nome: "Fernando Haddad",
    cargo: "Ministro da Fazenda",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Ministério da Fazenda",
    estado: "Federal",
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  },
  {
    id: "moraes-505",
    nome: "Alexandre de Moraes",
    cargo: "Ministro do STF",
    poder: Poder.JUDICIARIO,
    orgao_instituicao: "Supremo Tribunal Federal",
    estado: "Federal",
    foto_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    ativo: true
  }
];

export const GASTOS: GastoUnificado[] = [
  // Arthur Lira
  {
    id: "g1",
    autoridade_id: "lira-456",
    data_gasto: "2026-05-12",
    valor: 450000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação de aeronave para deslocamentos parlamentares e oficiais",
    documento_fiscal: "12.345.678/0001-90",
    fornecedor_nome: "AeroTaxi Alagoas S/A",
    fonte_dados: "dados_abertos_camara"
  },
  {
    id: "g2",
    autoridade_id: "lira-456",
    data_gasto: "2026-05-28",
    valor: 320000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Contratação de consultoria de comunicação técnica e apoio legislativo",
    documento_fiscal: "98.765.432/0001-10",
    fornecedor_nome: "Estratégia & Diálogo Institucional Ltda",
    fonte_dados: "dados_abertos_camara"
  },
  {
    id: "g3",
    autoridade_id: "lira-456",
    data_gasto: "2026-06-02",
    valor: 185450.22,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Serviço de apoio logístico integrado e segurança privada em eventos",
    documento_fiscal: "45.678.901/0001-23",
    fornecedor_nome: "Guardião Logística Federal",
    fonte_dados: "dados_abertos_camara"
  },
  {
    id: "g4",
    autoridade_id: "lira-456",
    data_gasto: "2026-06-15",
    valor: 112000.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Despesas de hospedagem comitivas oficiais no exterior",
    documento_fiscal: "E-1029384",
    fornecedor_nome: "Grand Hyatt Luxury Paris",
    fonte_dados: "dados_abertos_camara"
  },
  {
    id: "g5",
    autoridade_id: "lira-456",
    data_gasto: "2026-06-25",
    valor: 75000.00,
    categoria_unificada: "OUTROS GASTOS CORPORATIVOS",
    descricao_original: "Serviços técnicos de assessoria jurídica extraordinária",
    documento_fiscal: "33.221.109/0001-88",
    fornecedor_nome: "Advocacia Associada Alagoana",
    fonte_dados: "dados_abertos_camara"
  },

  // Luiz Inácio Lula da Silva
  {
    id: "g6",
    autoridade_id: "lula-123",
    data_gasto: "2026-04-10",
    valor: 384120.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Abastecimento e apoio de solo - comitiva oficial - Viagem Internacional",
    documento_fiscal: "AA-998812",
    fornecedor_nome: "Petrobras Distribuidora e Infra de Solo",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g7",
    autoridade_id: "lula-123",
    data_gasto: "2026-05-14",
    valor: 280000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Contratação emergencial de infraestrutura de transmissão segura",
    documento_fiscal: "77.665.544/0001-33",
    fornecedor_nome: "Telecomunicações Brasileiras Telebras",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g8",
    autoridade_id: "lula-123",
    data_gasto: "2026-05-20",
    valor: 152000.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Reserva de pavilhão e hospedagem diplomática oficial em Genebra",
    documento_fiscal: "CHF-93021",
    fornecedor_nome: "Hotel InterContinental Geneva",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g9",
    autoridade_id: "lula-123",
    data_gasto: "2026-06-10",
    valor: 98000.00,
    categoria_unificada: "ALIMENTAÇÃO",
    descricao_original: "Fornecimento de refeições e catering oficial - Banquetes de Estado",
    documento_fiscal: "11.222.333/0001-44",
    fornecedor_nome: "Banqueteria Palácio do Planalto",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g10",
    autoridade_id: "lula-123",
    data_gasto: "2026-06-18",
    valor: 70000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Serviços extraordinários de manutenção predial - Palácio da Alvorada",
    documento_fiscal: "55.443.322/0001-99",
    fornecedor_nome: "Brasília Reformas e Conservações",
    fonte_dados: "portal_transparencia_fed"
  },

  // Luís Roberto Barroso
  {
    id: "g11",
    autoridade_id: "barroso-789",
    data_gasto: "2026-04-15",
    valor: 185000.15,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Emissão de bilhetes aéreos internacionais em classe executiva - Conferência das Cortes",
    documento_fiscal: "LH-938201",
    fornecedor_nome: "Lufthansa Airlines",
    fonte_dados: "portal_transparencia_stf"
  },
  {
    id: "g12",
    autoridade_id: "barroso-789",
    data_gasto: "2026-05-02",
    valor: 120000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Serviços técnicos de tradução simultânea e sistemas de áudio em seminário internacional do STF",
    documento_fiscal: "88.990.112/0001-45",
    fornecedor_nome: "Traduzir Global Consultores S/A",
    fonte_dados: "portal_transparencia_stf"
  },
  {
    id: "g13",
    autoridade_id: "barroso-789",
    data_gasto: "2026-05-22",
    valor: 85901.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Diárias de hospedagem em Nova York para reuniões de cooperação jurídica internacional",
    documento_fiscal: "NY-49201",
    fornecedor_nome: "The Plaza Hotel NY",
    fonte_dados: "portal_transparencia_stf"
  },
  {
    id: "g14",
    autoridade_id: "barroso-789",
    data_gasto: "2026-06-05",
    valor: 42000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Locação de veículos blindados de escolta extraordinária",
    documento_fiscal: "12.093.847/0001-11",
    fornecedor_nome: "Security Armor Rentals Brasília",
    fonte_dados: "portal_transparencia_stf"
  },
  {
    id: "g15",
    autoridade_id: "barroso-789",
    data_gasto: "2026-06-20",
    valor: 20000.00,
    categoria_unificada: "ALIMENTAÇÃO",
    descricao_original: "Refeições e jantares de trabalho oficiais com delegações estrangeiras",
    documento_fiscal: "74.839.201/0001-52",
    fornecedor_nome: "Le Jardin Gastronomia de Brasília",
    fonte_dados: "portal_transparencia_stf"
  },

  // Eduardo Leite
  {
    id: "g16",
    autoridade_id: "leite-202",
    data_gasto: "2026-03-12",
    valor: 145000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Deslocamentos em helicóptero para vistoria de áreas de enchente no interior do Estado",
    documento_fiscal: "92.831.029/0001-44",
    fornecedor_nome: "Helisul Aviação Comercial",
    fonte_dados: "transparencia_rs"
  },
  {
    id: "g17",
    autoridade_id: "leite-202",
    data_gasto: "2026-04-18",
    valor: 95450.88,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Desenvolvimento de plataforma unificada de Defesa Civil de Porto Alegre",
    documento_fiscal: "52.839.210/0001-10",
    fornecedor_nome: "SulTech Sistemas Web Ltda",
    fonte_dados: "transparencia_rs"
  },
  {
    id: "g18",
    autoridade_id: "leite-202",
    data_gasto: "2026-05-15",
    valor: 50000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Serviço emergencial de monitoramento satelital e alerta climático corporativo",
    documento_fiscal: "10.293.484/0001-20",
    fornecedor_nome: "Orbis Satellite Alertas",
    fonte_dados: "transparencia_rs"
  },
  {
    id: "g19",
    autoridade_id: "leite-202",
    data_gasto: "2026-05-29",
    valor: 30000.00,
    categoria_unificada: "ALIMENTAÇÃO",
    descricao_original: "Fornecimento de refeições para centros integrados de monitoramento",
    documento_fiscal: "02.938.471/0001-55",
    fornecedor_nome: "Refeições do Sul Alimentos",
    fonte_dados: "transparencia_rs"
  },

  // Rodrigo Pacheco
  {
    id: "g20",
    autoridade_id: "pacheco-101",
    data_gasto: "2026-04-18",
    valor: 135000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Assinatura de base de dados jurídica global e periódicos para assessoria do Senado",
    documento_fiscal: "38.293.001/0001-44",
    fornecedor_nome: "Thomson Reuters Brasil Ltda",
    fonte_dados: "dados_abertos_senado"
  },
  {
    id: "g21",
    autoridade_id: "pacheco-101",
    data_gasto: "2026-05-12",
    valor: 110005.50,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Fretamento de voo de representação institucional para assembleia internacional",
    documento_fiscal: "44.112.321/0001-99",
    fornecedor_nome: "Líder Aviação Executiva",
    fonte_dados: "dados_abertos_senado"
  },
  {
    id: "g22",
    autoridade_id: "pacheco-101",
    data_gasto: "2026-05-24",
    valor: 45000.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Acomodação oficial para missão diplomática - Presidência do Senado",
    documento_fiscal: "EU-123910",
    fornecedor_nome: "Bruxelles Grand Palace Hotel",
    fonte_dados: "dados_abertos_senado"
  },
  {
    id: "g23",
    autoridade_id: "pacheco-101",
    data_gasto: "2026-06-02",
    valor: 28000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Serviço complementar de rastreamento de segurança física do gabinete oficial",
    documento_fiscal: "09.123.456/0001-30",
    fornecedor_nome: "Security Tracker Brasília S/A",
    fonte_dados: "dados_abertos_senado"
  },

  // Tarcísio de Freitas
  {
    id: "g24",
    autoridade_id: "tarcisio-303",
    data_gasto: "2026-04-20",
    valor: 198000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação de veículos oficiais para deslocamentos de vistoria de obras rodoviárias",
    documento_fiscal: "49.201.201/0001-52",
    fornecedor_nome: "Localiza Rent a Car S/A",
    fonte_dados: "transparencia_sp"
  },
  {
    id: "g25",
    autoridade_id: "tarcisio-303",
    data_gasto: "2026-05-08",
    valor: 85000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Assessoria técnica predial de engenharia extraordinária do Palácio dos Bandeirantes",
    documento_fiscal: "02.391.821/0001-33",
    fornecedor_nome: "SP Engenharia & Projetos Ltda",
    fonte_dados: "transparencia_sp"
  },
  {
    id: "g26",
    autoridade_id: "tarcisio-303",
    data_gasto: "2026-05-18",
    valor: 64000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Serviço técnico de rádio-criptografia militar para telecomunicações de emergência",
    documento_fiscal: "11.239.028/0001-77",
    fornecedor_nome: "CriptoNet Telecom S/A",
    fonte_dados: "transparencia_sp"
  },
  {
    id: "g27",
    autoridade_id: "tarcisio-303",
    data_gasto: "2026-06-03",
    valor: 18000.00,
    categoria_unificada: "ALIMENTAÇÃO",
    descricao_original: "Despesa corporativa com alimentação de brigadistas em comitê de crise",
    documento_fiscal: "03.203.948/0001-12",
    fornecedor_nome: "Sabor de SP Refeições Industriais",
    fonte_dados: "transparencia_sp"
  },

  // Fernando Haddad
  {
    id: "g28",
    autoridade_id: "haddad-404",
    data_gasto: "2026-04-12",
    valor: 110000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Passagens aéreas internacionais - Delegação G20 Financeiro",
    documento_fiscal: "LAT-129031",
    fornecedor_nome: "LATAM Airlines Brasil",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g29",
    autoridade_id: "haddad-404",
    data_gasto: "2026-05-10",
    valor: 65000.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Hospedagem oficial da delegação econômica brasileira em Washington",
    documento_fiscal: "US-938210",
    fornecedor_nome: "The Ritz-Carlton Georgetown",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g30",
    autoridade_id: "haddad-404",
    data_gasto: "2026-05-25",
    valor: 45000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Assinaturas institucionais e licença corporativa de banco de dados financeiro global Bloomberg",
    documento_fiscal: "BB-928310",
    fornecedor_nome: "Bloomberg Finance L.P.",
    fonte_dados: "portal_transparencia_fed"
  },

  // Alexandre de Moraes
  {
    id: "g31",
    autoridade_id: "moraes-505",
    data_gasto: "2026-04-22",
    valor: 92000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Aquisição extra de sistema de blindagem automotiva de alto impacto para escolta oficial",
    documento_fiscal: "18.392.102/0001-44",
    fornecedor_nome: "Defesa Blindados do Brasil Ltda",
    fonte_dados: "portal_transparencia_stf"
  },
  {
    id: "g32",
    autoridade_id: "moraes-505",
    data_gasto: "2026-05-05",
    valor: 85000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Diárias de viagem nacional aérea e terrestre - Atividade de cooperação eleitoral",
    documento_fiscal: "G3-203912",
    fornecedor_nome: "GOL Linhas Aéreas S/A",
    fonte_dados: "portal_transparencia_stf"
  },
  {
    id: "g33",
    autoridade_id: "moraes-505",
    data_gasto: "2026-05-19",
    valor: 35000.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Hospedagem de comissão técnica em vistorias oficiais",
    documento_fiscal: "SP-93821",
    fornecedor_nome: "Hotel Unique São Paulo",
    fonte_dados: "portal_transparencia_stf"
  }
];
