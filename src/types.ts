export enum Poder {
  EXECUTIVO = "Executivo",
  LEGISLATIVO = "Legislativo",
  JUDICIARIO = "Judiciário"
}

export type CategoriaUnificada = 
  | "MANUTENÇÃO E OPERAÇÃO"
  | "TRANSPORTE E VIAGENS"
  | "HOSPEDAGEM"
  | "ALIMENTAÇÃO"
  | "SEGURANÇA E LOGÍSTICA"
  | "OUTROS GASTOS CORPORATIVOS";

export interface Autoridade {
  id: string;
  nome: string;
  cargo: string;
  poder: Poder;
  orgao_instituicao: string;
  estado: string; // Ex: "PR", "SP", "Federal"
  foto_url?: string;
  ativo: boolean;
}

export interface GastoUnificado {
  id: string;
  autoridade_id: string;
  data_gasto: string; // YYYY-MM-DD
  valor: number;
  categoria_unificada: CategoriaUnificada;
  descricao_original: string;
  documento_fiscal?: string; // CNPJ ou ID do bilhete
  fornecedor_nome?: string;
  fonte_dados: string; // Ex: "portal_transparencia_fed", "dados_abertos_camara"
}

export interface DashboardStats {
  executivoTotal: number;
  legislativoTotal: number;
  judiciarioTotal: number;
  totalAcumulado: number;
}
