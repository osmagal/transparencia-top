import { Autoridade, GastoUnificado, Poder, CategoriaUnificada } from "./types";

export const AUTORIDADES: Autoridade[] = [
  {
    id: "lula-123",
    nome: "Luiz Inácio Lula da Silva",
    cargo: "Presidente da República",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Presidência da República",
    estado: "Federal",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_%28ombros%29_denoise.jpg",
    ativo: true
  },
  {
    id: "lira-456",
    nome: "Arthur Lira",
    cargo: "Presidente da Câmara dos Deputados",
    poder: Poder.LEGISLATIVO,
    orgao_instituicao: "Câmara dos Deputados",
    estado: "AL",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVyuOqu2ygyCHx03TiAOUvhRZEmwuq5xUScC0ZrQeP3Q&s=10",
    ativo: true
  },
  {
    id: "barroso-789",
    nome: "Luís Roberto Barroso",
    cargo: "Presidente do STF",
    poder: Poder.JUDICIARIO,
    orgao_instituicao: "Supremo Tribunal Federal",
    estado: "Federal",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Luis_Roberto_Barroso_2014.jpg",
    ativo: true
  },
  {
    id: "pacheco-101",
    nome: "Rodrigo Pacheco",
    cargo: "Presidente do Senado",
    poder: Poder.LEGISLATIVO,
    orgao_instituicao: "Senado Federal",
    estado: "MG",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuIVPcp6J22CqtJRO27uWfdKTGur2HzqfjLDhCDAGdiw&s=10",
    ativo: true
  },
  {
    id: "leite-202",
    nome: "Eduardo Leite",
    cargo: "Governador do Rio Grande do Sul",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do RS",
    estado: "RS",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/09.02.2026_%E2%80%93_Eduardo_Leite_in_February_2026_-_55087496770_%283x4%29.jpg/960px-09.02.2026_%E2%80%93_Eduardo_Leite_in_February_2026_-_55087496770_%283x4%29.jpg",
    ativo: true
  },
  {
    id: "tarcisio-303",
    nome: "Tarcísio de Freitas",
    cargo: "Governador de São Paulo",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de SP",
    estado: "SP",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx6JtKf6mYFDoOiKdW8CIlwbTaUI9OWpod371Bt5rzPg&s",
    ativo: true
  },
  {
    id: "haddad-404",
    nome: "Fernando Haddad",
    cargo: "Ministro da Fazenda",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Ministério da Fazenda",
    estado: "Federal",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNVwaYOctu_sSj1Xoe9I4xqpcschtHhCa_hHFaOAs51w&s=10",
    ativo: true
  },
  {
    id: "moraes-505",
    nome: "Alexandre de Moraes",
    cargo: "Ministro do STF",
    poder: Poder.JUDICIARIO,
    orgao_instituicao: "Supremo Tribunal Federal",
    estado: "Federal",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvAoxavL-Q0C2e6wMPOdXiE5i5T_rL7Dj4sLApkc9Usg&s=10",
    ativo: true
  },
  // Região Norte
  {
    id: "cameli-ac",
    nome: "Gladson Cameli",
    cargo: "Governador do Acre",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do AC",
    estado: "AC",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Gladson_Cameli_%28foto_oficial%29.jpg",
    ativo: true
  },
  {
    id: "clecio-ap",
    nome: "Clécio Luiz",
    cargo: "Governador do Amapá",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do AP",
    estado: "AP",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Cl%C3%A9cio_Lu%C3%ADz_oficial_cropped.jpg",
    ativo: true
  },
  {
    id: "lima-am",
    nome: "Wilson Lima",
    cargo: "Governador do Amazonas",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do AM",
    estado: "AM",
    foto_url: "https://s2-oglobo.glbimg.com/zdlOclqqlc1hMzd4Uf0OjuViE3s=/0x0:660x493/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2023/2/D/B6Kf8dQbaUgTxeDFSxNg/2023-07-15-08-33-07-entrevista-nao-podemos-prescindir-do-governo-federal-diz-wilson-lima-govern.png",
    ativo: true
  },
  {
    id: "barbalho-pa",
    nome: "Helder Barbalho",
    cargo: "Governador do Pará",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do PA",
    estado: "PA",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Helder_Barbalho%2C_January_2023_%28cropped%29.jpg",
    ativo: true
  },
  {
    id: "rocha-ro",
    nome: "Coronel Marcos Rocha",
    cargo: "Governador de Rondônia",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do RO",
    estado: "RO",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/0/09/Coronel_Marcos_Rocha.jpg",
    ativo: true
  },
  {
    id: "denarium-rr",
    nome: "Antonio Denarium",
    cargo: "Governador de Roraima",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do RR",
    estado: "RR",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Antonio_Denarium_em_2022.jpg",
    ativo: true
  },
  {
    id: "barbosa-to",
    nome: "Wanderlei Barbosa",
    cargo: "Governador de Tocantins",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do TO",
    estado: "TO",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Wanderlei_Barbosa_%28foto_oficial%29.jpg",
    ativo: true
  },
  // Região Nordeste
  {
    id: "dantas-al",
    nome: "Paulo Dantas",
    cargo: "Governador de Alagoas",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de AL",
    estado: "AL",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Paulo_Dantas_%28cropped%29.jpg",
    ativo: true
  },
  {
    id: "rodrigues-ba",
    nome: "Jerônimo Rodrigues",
    cargo: "Governador da Bahia",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo da BA",
    estado: "BA",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ThwEa0F9rgKMVqP1g1Ws_urb1GzJoIByvzK7pnTFkA&s=10",
    ativo: true
  },
  {
    id: "freitas-ce",
    nome: "Elmano de Freitas",
    cargo: "Governador do Ceará",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do CE",
    estado: "CE",
    foto_url: "https://imagens.ebc.com.br/OvDubuVcbZg0YEM1pxKEEuPXjzE=/770x0/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/vac_abr0911235050.jpg?itok=mllvS88X",
    ativo: true
  },
  {
    id: "brandao-ma",
    nome: "Carlos Brandão",
    cargo: "Governador do Maranhão",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do MA",
    estado: "MA",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Carlos_Brand%C3%A3o_%28foto_oficial%29.jpg",
    ativo: true
  },
  {
    id: "azevedo-pb",
    nome: "João Azevêdo",
    cargo: "Governador da Paraíba",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo da PB",
    estado: "PB",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Jo%C3%A3o_Azev%C3%AAdo_em_2019.jpg",
    ativo: true
  },
  {
    id: "lyra-pe",
    nome: "Raquel Lyra",
    cargo: "Governadora de Pernambuco",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de PE",
    estado: "PE",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfmbAnYG8lUNCItfjZIjWMKBOUL-wefQP7G2-DmEyPfAHIlrprK5oOBf8&s=10",
    ativo: true
  },
  {
    id: "fonteles-pi",
    nome: "Rafael Fonteles",
    cargo: "Governador do Piauí",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do PI",
    estado: "PI",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Rafael_Fonteles_%28cropped%29.jpg",
    ativo: true
  },
  {
    id: "bezerra-rn",
    nome: "Fátima Bezerra",
    cargo: "Governadora do Rio Grande do Norte",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do RN",
    estado: "RN",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/F%C3%A1tima_Bezerra_%28cropped%29.jpg",
    ativo: true
  },
  {
    id: "mitidieri-se",
    nome: "Fábio Mitidieri",
    cargo: "Governador de Sergipe",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de SE",
    estado: "SE",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/4/43/F%C3%A1bio_Mitidieri_%28cropped%29.jpg",
    ativo: true
  },
  // Região Centro-Oeste
  {
    id: "rocha-df",
    nome: "Ibaneis Rocha",
    cargo: "Governador do Distrito Federal",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do DF",
    estado: "DF",
    foto_url: "https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2023/08/forum-governadores_mcamgo_abr_24052023-11-e1693844558355.jpg?w=419&h=283&crop=0",
    ativo: true
  },
  {
    id: "caiado-go",
    nome: "Ronaldo Caiado",
    cargo: "Governador de Goiás",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de GO",
    estado: "GO",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ronaldo_Caiado_%28cropped%29.jpg",
    ativo: true
  },
  {
    id: "mendes-mt",
    nome: "Mauro Mendes",
    cargo: "Governador de Mato Grosso",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do MT",
    estado: "MT",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/2019_Reuni%C3%A3o_com_Ministros_da_Casa_Civil%2C_Defesa%2C_Rela%C3%A7%C3%B5es_Exteriores%2C_Meio_Ambiente%2C_Secretaria-Geral%2C_Secretaria_de_Governo%2C_GSI_e_Governadores_da_Amaz%C3%B4nia_Legal_-_48630502003_%28cropped%29_Mauro_Mendes.jpg",
    ativo: true
  },
  {
    id: "riedel-ms",
    nome: "Eduardo Riedel",
    cargo: "Governador de Mato Grosso do Sul",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do MS",
    estado: "MS",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Eduardo_Riedel_%28cropped%29.jpg",
    ativo: true
  },
  // Região Sudeste
  {
    id: "casagrande-es",
    nome: "Renato Casagrande",
    cargo: "Governador do Espírito Santo",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do ES",
    estado: "ES",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Renato_Casagrande_em_2019.jpg",
    ativo: true
  },
  {
    id: "zema-mg",
    nome: "Romeu Zema",
    cargo: "Governador de Minas Gerais",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de MG",
    estado: "MG",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Romeu_Zema%2C_December_2024_%28cropped%29.jpg",
    ativo: true
  },
  {
    id: "castro-rj",
    nome: "Cláudio Castro",
    cargo: "Governador do Rio de Janeiro",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do RJ",
    estado: "RJ",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Claudio_Castro_como_Vice_Governador_do_Rio_de_Janeiro.jpg",
    ativo: true
  },
  // Região Sul
  {
    id: "junior-pr",
    nome: "Ratinho Junior",
    cargo: "Governador do Paraná",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo do PR",
    estado: "PR",
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5f4Er1vSsnWcIQRegKVHaPU4yUZpy27T-42I5X5pyyBwOiT1VZ9JE2P96&s=10",
    ativo: true
  },
  {
    id: "mello-sc",
    nome: "Jorginho Mello",
    cargo: "Governador de Santa Catarina",
    poder: Poder.EXECUTIVO,
    orgao_instituicao: "Governo de SC",
    estado: "SC",
    foto_url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Jorginho_Mello_em_2019.jpg",
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
  },
  // Gastos dos novos Governadores
  {
    id: "g34",
    autoridade_id: "cameli-ac",
    data_gasto: "2026-05-10",
    valor: 48000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação de aeronave de pequeno porte para vistoria técnica de ramais rodoviários isolados",
    documento_fiscal: "12.384.921/0001-99",
    fornecedor_nome: "AeroTaxi Acreano Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g35",
    autoridade_id: "clecio-ap",
    data_gasto: "2026-05-18",
    valor: 25000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Manutenção extraordinária preventiva e corretiva em sistema de refrigeração escolar",
    documento_fiscal: "88.391.029/0001-44",
    fornecedor_nome: "Refrigeração Norte S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g36",
    autoridade_id: "lima-am",
    data_gasto: "2026-06-05",
    valor: 125000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Adiantamento para compra de óleo diesel e combustível para embarcações de atendimento à saúde",
    documento_fiscal: "09.391.203/0001-52",
    fornecedor_nome: "Amazonas Distribuidora de Combustíveis S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g37",
    autoridade_id: "barbalho-pa",
    data_gasto: "2026-05-22",
    valor: 145000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Desenvolvimento técnico e suporte de plataforma para transparência e monitoramento ambiental",
    documento_fiscal: "41.932.102/0001-88",
    fornecedor_nome: "Sistemas Integrados Belém Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g38",
    autoridade_id: "rocha-ro",
    data_gasto: "2026-04-12",
    valor: 38000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Aquisição de transceptores digitais criptografados para escolta militar",
    documento_fiscal: "02.391.821/0001-22",
    fornecedor_nome: "Comunicações Rondônia S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g39",
    autoridade_id: "denarium-rr",
    data_gasto: "2026-05-26",
    valor: 42000.00,
    categoria_unificada: "ALIMENTAÇÃO",
    descricao_original: "Fornecimento emergencial de refeições preparadas para rede de abrigos estaduais",
    documento_fiscal: "11.239.028/0001-15",
    fornecedor_nome: "Boa Vista Alimentos S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g40",
    autoridade_id: "barbosa-to",
    data_gasto: "2026-06-08",
    valor: 31000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação de veículos utilitários tracionados para vistorias em obras rurais",
    documento_fiscal: "22.391.029/0001-44",
    fornecedor_nome: "Tocantins Rent a Car S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g41",
    autoridade_id: "dantas-al",
    data_gasto: "2026-05-15",
    valor: 62000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Desenvolvimento e customização do novo portal de serviços estaduais unificados",
    documento_fiscal: "33.491.201/0001-10",
    fornecedor_nome: "Alagoas Digital S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g42",
    autoridade_id: "rodrigues-ba",
    data_gasto: "2026-06-02",
    valor: 195000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação emergencial de aeronave bimotor para atendimento logístico de comissões técnicas",
    documento_fiscal: "55.201.391/0001-77",
    fornecedor_nome: "Aero Salvador S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g43",
    autoridade_id: "freitas-ce",
    data_gasto: "2026-05-20",
    valor: 115000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Estudos de engenharia e modelagem hidráulica para bacias de irrigação regional",
    documento_fiscal: "08.391.202/0001-99",
    fornecedor_nome: "Ceará Recursos Hídricos Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g44",
    autoridade_id: "brandao-ma",
    data_gasto: "2026-06-11",
    valor: 75000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Implantação de monitoramento remoto eletrônico em postos avançados de assistência social",
    documento_fiscal: "99.028.192/0001-44",
    fornecedor_nome: "Maranhão Segurança Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g45",
    autoridade_id: "azevedo-pb",
    data_gasto: "2026-05-14",
    valor: 53000.00,
    categoria_unificada: "ALIMENTAÇÃO",
    descricao_original: "Serviço de fornecimento contínuo de refeições preparadas para batalhões volantes de segurança",
    documento_fiscal: "12.392.102/0001-33",
    fornecedor_nome: "Sabor da Paraíba Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g46",
    autoridade_id: "lyra-pe",
    data_gasto: "2026-05-29",
    valor: 138000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Emissão de passagens aéreas e taxas para comissão internacional de promoção industrial",
    documento_fiscal: "77.102.391/0001-11",
    fornecedor_nome: "Nordeste Linhas Executivas",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g47",
    autoridade_id: "fonteles-pi",
    data_gasto: "2026-06-04",
    valor: 48000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Serviço de migração e reestruturação da nuvem governamental corporativa da fazenda",
    documento_fiscal: "03.203.948/0001-12",
    fornecedor_nome: "Piauí Tech Solutions S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g48",
    autoridade_id: "bezerra-rn",
    data_gasto: "2026-05-25",
    valor: 34000.00,
    categoria_unificada: "HOSPEDAGEM",
    descricao_original: "Hospedagem e diárias de equipes de auditoria fiscal e controle do estado",
    documento_fiscal: "55.443.322/0001-10",
    fornecedor_nome: "Natal Palace Hotel S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g49",
    autoridade_id: "mitidieri-se",
    data_gasto: "2026-06-15",
    valor: 29000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Contratação de licenças corporativas de segurança e criptografia de dados públicos",
    documento_fiscal: "01.293.484/0001-20",
    fornecedor_nome: "Sergipe Softwares Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g50",
    autoridade_id: "rocha-df",
    data_gasto: "2026-05-12",
    valor: 165000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação de veículos executivos blindados para translado de representações consulares",
    documento_fiscal: "02.391.821/0001-33",
    fornecedor_nome: "Brasília Rent Cars S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g51",
    autoridade_id: "caiado-go",
    data_gasto: "2026-05-08",
    valor: 110000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Apoio logístico extraordinário integrado para ações de contingência ambiental no interior",
    documento_fiscal: "88.391.029/0001-52",
    fornecedor_nome: "Goiás Defesa & Segurança",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g52",
    autoridade_id: "mendes-mt",
    data_gasto: "2026-06-02",
    valor: 142000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Fretamento de aeronave de asa rotativa para monitoramento florestal integrado do bioma",
    documento_fiscal: "11.239.028/0001-44",
    fornecedor_nome: "Pantanal Aero S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g53",
    autoridade_id: "riedel-ms",
    data_gasto: "2026-05-19",
    valor: 78000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Habilitação e suporte técnico de módulo regional de processamento eletrônico fazendário",
    documento_fiscal: "92.831.029/0001-22",
    fornecedor_nome: "Campo Grande Sistemas S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g54",
    autoridade_id: "casagrande-es",
    data_gasto: "2026-04-18",
    valor: 54000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Manutenção técnica estrutural em unidades hospitalares de alta complexidade",
    documento_fiscal: "03.203.948/0001-99",
    fornecedor_nome: "Vix Serviços Prediais Ltda",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g55",
    autoridade_id: "zema-mg",
    data_gasto: "2026-05-24",
    valor: 182000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Fretamento aéreo intermunicipal para transporte de comitivas fazendárias e fiscais",
    documento_fiscal: "45.678.901/0001-23",
    fornecedor_nome: "Minas AeroTaxi S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g56",
    autoridade_id: "castro-rj",
    data_gasto: "2026-06-10",
    valor: 195000.00,
    categoria_unificada: "SEGURANÇA E LOGÍSTICA",
    descricao_original: "Consultoria técnica qualificada em desenho de segurança corporativa preventiva",
    documento_fiscal: "33.221.109/0001-88",
    fornecedor_nome: "Rio Segurança Integrada S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g57",
    autoridade_id: "junior-pr",
    data_gasto: "2026-05-15",
    valor: 128000.00,
    categoria_unificada: "MANUTENÇÃO E OPERAÇÃO",
    descricao_original: "Consultoria para expansão do sistema tributário e emissão unificada de faturas",
    documento_fiscal: "98.765.432/0001-10",
    fornecedor_nome: "Curitiba Software Integrado S/A",
    fonte_dados: "portal_transparencia_fed"
  },
  {
    id: "g58",
    autoridade_id: "mello-sc",
    data_gasto: "2026-06-12",
    valor: 95000.00,
    categoria_unificada: "TRANSPORTE E VIAGENS",
    descricao_original: "Locação de frotas rodoviárias para equipes de infraestrutura e engenharia civil do estado",
    documento_fiscal: "12.345.678/0001-90",
    fornecedor_nome: "Santa Catarina Rent a Car S/A",
    fonte_dados: "portal_transparencia_fed"
  }
];
