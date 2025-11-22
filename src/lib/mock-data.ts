// Dados mock para demonstração do sistema
import { Truck, Alert, Metrics } from './types';

// Função auxiliar para gerar datas de registro variadas
const getDateRegistro = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

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
    combustivel: 78,
    dataRegistro: getDateRegistro(0) // Hoje
  },
  {
    id: 'GAL-002',
    placa: 'EF-34-GH',
    motorista: 'Maria Santos',
    operadorResponsavel: 'Carlos Operador',
    cais: '042',
    proximoCaisDestino: 'frescos',
    numeroCaisDestino: '015',
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
    combustivel: 95,
    pallets: {
      carga: 24,
      descarga: 0
    },
    dataRegistro: getDateRegistro(0) // Hoje
  },
  {
    id: 'GAL-003',
    placa: 'IJ-56-KL',
    motorista: 'Carlos Ferreira',
    operadorResponsavel: 'Ana Operadora',
    cais: '015',
    proximoCaisDestino: 'bebidas',
    numeroCaisDestino: '023',
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
    combustivel: 42,
    pallets: {
      carga: 0,
      descarga: 18
    },
    dataRegistro: getDateRegistro(1) // Ontem
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
    combustivel: 25,
    dataRegistro: getDateRegistro(2) // 2 dias atrás
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
    combustivel: 88,
    dataRegistro: getDateRegistro(0) // Hoje
  },
  {
    id: 'GAL-006',
    placa: 'UV-12-WX',
    motorista: 'Ricardo Mendes',
    cais: '007',
    proximoCaisDestino: 'congelados',
    numeroCaisDestino: '008',
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
    combustivel: 65,
    pallets: {
      carga: 30,
      descarga: 0
    },
    dataRegistro: getDateRegistro(1) // Ontem
  },
  {
    id: 'GAL-007',
    placa: '👨‍✈️ Miguel Santos',
    motorista: '👨‍✈️ Miguel Santos',
    operadorResponsavel: '👷 Paula Silva',
    cais: '⚓ 101',
    proximoCaisDestino: 'frutas',
    numeroCaisDestino: '🎯 7',
    status: 'carregando',
    localizacao: {
      latitude: 38.7436,
      longitude: -9.2302,
      endereco: '📍 Zona A - Setor 3'
    },
    origem: '🏭 Fábrica Central',
    destino: '🎯 Loja Premium',
    carga: {
      tipo: '🥦 Produtos Frescos',
      peso: 12000,
      volume: 35
    },
    horarios: {
      saida: '2024-01-15T09:00:00',
      chegadaPrevista: '2024-01-15T12:00:00'
    },
    progresso: 25,
    combustivel: 92,
    pallets: {
      carga: 20,
      descarga: 0
    },
    dataRegistro: getDateRegistro(0) // Hoje
  },
  {
    id: 'GAL-008',
    placa: '🚛 Galera 42',
    motorista: 'Motorista 15',
    operadorResponsavel: 'Operador 7',
    cais: 'A5',
    proximoCaisDestino: 'carnes',
    numeroCaisDestino: 'B3',
    status: 'descarregando',
    localizacao: {
      latitude: 41.1579,
      longitude: -8.6291,
      endereco: 'Cais B - Descarga'
    },
    origem: 'Origem A',
    destino: 'Destino B',
    carga: {
      tipo: 'Carga Especial 7',
      peso: 16000,
      volume: 42
    },
    horarios: {
      saida: '2024-01-15T06:30:00',
      chegadaPrevista: '2024-01-15T09:00:00',
      chegadaReal: '2024-01-15T08:55:00'
    },
    progresso: 88,
    combustivel: 55,
    pallets: {
      carga: 0,
      descarga: 22
    },
    dataRegistro: getDateRegistro(3) // 3 dias atrás
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
