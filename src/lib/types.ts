// Tipos do sistema de logística Jerónimo Martins

export type TruckStatus = 'em_transito' | 'carregando' | 'descarregando' | 'parado' | 'manutencao' | 'disponivel';
export type AlertType = 'atraso' | 'manutencao' | 'rota_alterada' | 'urgente' | 'info';
export type Priority = 'baixa' | 'media' | 'alta' | 'critica';

// Seções do armazém para próximo cais de destino
export type SecaoArmazem = 
  | 'nao_pereciveis' 
  | 'frescos' 
  | 'congelados' 
  | 'frutas' 
  | 'peixe' 
  | 'carnes' 
  | 'laticinios' 
  | 'bebidas' 
  | 'higiene' 
  | 'outros';

export interface Truck {
  id: string;
  placa: string;
  motorista: string;
  operadorResponsavel?: string; // Operador responsável pela carga/descarga
  cais?: string; // Número do cais de localização atual (até 10 caracteres)
  proximoCaisDestino?: SecaoArmazem; // Próximo cais de destino (seção do armazém)
  numeroCaisDestino?: string; // NOVO: Número do cais de destino (até 10 caracteres)
  status: TruckStatus;
  localizacao: {
    latitude: number;
    longitude: number;
    endereco: string;
  };
  origem: string;
  destino: string;
  carga: {
    tipo: string;
    peso: number;
    volume: number;
  };
  horarios: {
    saida: string;
    chegadaPrevista: string;
    chegadaReal?: string;
  };
  progresso: number; // 0-100
  temperatura?: number;
  combustivel: number; // 0-100
  // Contador de Pallets
  pallets?: {
    carga?: number; // Número de pallets que podem ser carregados
    descarga?: number; // Número de pallets que serão descarregados
  };
  // NOVO: Data de registro para consultas históricas
  dataRegistro: string; // ISO 8601 format (YYYY-MM-DD)
}

export interface Alert {
  id: string;
  tipo: AlertType;
  prioridade: Priority;
  titulo: string;
  mensagem: string;
  truckId?: string;
  timestamp: string;
  lida: boolean;
}

export interface Metrics {
  totalGaleras: number;
  emTransito: number;
  disponiveis: number;
  emManutencao: number;
  entregas24h: number;
  eficienciaMedia: number;
  kmPercorridos: number;
  alertasAtivos: number;
}
