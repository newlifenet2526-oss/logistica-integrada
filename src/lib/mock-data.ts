// Dados mock para demonstração do sistema
import { Truck, Alert, Metrics } from './types';

export const mockTrucks: Truck[] = [
  {
    id: 'GAL-001',
    placa: 'AB-12-CD',
    motorista: 'João Silva',
    status: 'em_transito',
    localizacao: {
      latitude: 38.7223,
      longitude: -9.1393,
      endereco: 'A1, Lisboa'
    },
    origem: 'Centro Distribuição Lisboa',
    destino: 'Pingo Doce Porto',
    carga: {
      tipo: 'Produtos Frescos',
      peso: 18500,
      volume: 45
    },
    horarios: {
      saida: '2024-01-15T06:00:00',
      chegadaPrevista: '2024-01-15T09:30:00'
    },
    progresso: 65,
    temperatura: 4,
    combustivel: 78
  },
  {
    id: 'GAL-002',
    placa: 'EF-34-GH',
    motorista: 'Maria Santos',
    status: 'carregando',
    localizacao: {
      latitude: 38.7436,
      longitude: -9.2302,
      endereco: 'Armazém Central, Amadora'
    },
    origem: 'Centro Distribuição Amadora',
    destino: 'Recheio Coimbra',
    carga: {
      tipo: 'Mercearia',
      peso: 22000,
      volume: 60
    },
    horarios: {
      saida: '2024-01-15T08:00:00',
      chegadaPrevista: '2024-01-15T11:00:00'
    },
    progresso: 15,
    combustivel: 95
  },
  {
    id: 'GAL-003',
    placa: 'IJ-56-KL',
    motorista: 'Carlos Ferreira',
    status: 'descarregando',
    localizacao: {
      latitude: 41.1579,
      longitude: -8.6291,
      endereco: 'Pingo Doce Matosinhos'
    },
    origem: 'Centro Distribuição Porto',
    destino: 'Pingo Doce Matosinhos',
    carga: {
      tipo: 'Bebidas',
      peso: 15000,
      volume: 38
    },
    horarios: {
      saida: '2024-01-15T05:30:00',
      chegadaPrevista: '2024-01-15T07:45:00',
      chegadaReal: '2024-01-15T07:40:00'
    },
    progresso: 95,
    combustivel: 42
  },
  {
    id: 'GAL-004',
    placa: 'MN-78-OP',
    motorista: 'Ana Costa',
    status: 'manutencao',
    localizacao: {
      latitude: 38.7071,
      longitude: -9.1364,
      endereco: 'Oficina Central, Lisboa'
    },
    origem: 'Oficina Central',
    destino: 'Oficina Central',
    carga: {
      tipo: 'Vazio',
      peso: 0,
      volume: 0
    },
    horarios: {
      saida: '2024-01-15T14:00:00',
      chegadaPrevista: '2024-01-15T14:00:00'
    },
    progresso: 0,
    combustivel: 25
  },
  {
    id: 'GAL-005',
    placa: 'QR-90-ST',
    motorista: 'Pedro Alves',
    status: 'disponivel',
    localizacao: {
      latitude: 38.7436,
      longitude: -9.2302,
      endereco: 'Centro Distribuição Amadora'
    },
    origem: 'Centro Distribuição Amadora',
    destino: 'Aguardando atribuição',
    carga: {
      tipo: 'Vazio',
      peso: 0,
      volume: 0
    },
    horarios: {
      saida: '2024-01-15T10:00:00',
      chegadaPrevista: '2024-01-15T10:00:00'
    },
    progresso: 0,
    combustivel: 88
  },
  {
    id: 'GAL-006',
    placa: 'UV-12-WX',
    motorista: 'Ricardo Mendes',
    status: 'em_transito',
    localizacao: {
      latitude: 40.2033,
      longitude: -8.4103,
      endereco: 'A1, Coimbra'
    },
    origem: 'Centro Distribuição Lisboa',
    destino: 'Recheio Aveiro',
    carga: {
      tipo: 'Congelados',
      peso: 19500,
      volume: 50
    },
    horarios: {
      saida: '2024-01-15T07:00:00',
      chegadaPrevista: '2024-01-15T10:15:00'
    },
    progresso: 45,
    temperatura: -18,
    combustivel: 65
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    tipo: 'atraso',
    prioridade: 'alta',
    titulo: 'Atraso na Entrega',
    mensagem: 'GAL-003 com 15 minutos de atraso devido a tráfego intenso na A1',
    truckId: 'GAL-003',
    timestamp: '2024-01-15T08:45:00',
    lida: false
  },
  {
    id: 'ALT-002',
    tipo: 'manutencao',
    prioridade: 'media',
    titulo: 'Manutenção Programada',
    mensagem: 'GAL-004 em manutenção preventiva - previsão de conclusão às 16h',
    truckId: 'GAL-004',
    timestamp: '2024-01-15T08:30:00',
    lida: false
  },
  {
    id: 'ALT-003',
    tipo: 'urgente',
    prioridade: 'critica',
    titulo: 'Combustível Baixo',
    mensagem: 'GAL-003 com nível de combustível crítico (25%) - reabastecimento necessário',
    truckId: 'GAL-003',
    timestamp: '2024-01-15T08:50:00',
    lida: false
  },
  {
    id: 'ALT-004',
    tipo: 'info',
    prioridade: 'baixa',
    titulo: 'Entrega Concluída',
    mensagem: 'GAL-001 concluiu entrega em Pingo Doce Cascais com sucesso',
    truckId: 'GAL-001',
    timestamp: '2024-01-15T08:20:00',
    lida: true
  }
];

export const mockMetrics: Metrics = {
  totalGaleras: 24,
  emTransito: 12,
  disponiveis: 8,
  emManutencao: 4,
  entregas24h: 47,
  eficienciaMedia: 94.5,
  kmPercorridos: 3847,
  alertasAtivos: 3
};
