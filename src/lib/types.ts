// Tipos do sistema de logística Jerónimo Martins

export type TruckStatus = 'em_transito' | 'carregando' | 'descarregando' | 'parado' | 'manutencao' | 'disponivel';
export type AlertType = 'atraso' | 'manutencao' | 'rota_alterada' | 'urgente' | 'info';
export type Priority = 'baixa' | 'media' | 'alta' | 'critica';

export interface Truck {
  id: string;
  placa: string;
  motorista: string;
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
