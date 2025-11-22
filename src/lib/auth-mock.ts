// Dados mock para autenticação (em produção, usar API real)
import { User } from './auth-types';

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    nome: 'Admin Sistema',
    email: 'admin@jeronimomartins.pt',
    role: 'admin',
    telefone: '+351 912 345 678',
    departamento: 'TI',
    ativo: true
  },
  {
    id: 'USR-002',
    nome: 'Carlos Coordenador',
    email: 'coordenador@jeronimomartins.pt',
    role: 'coordenador',
    telefone: '+351 913 456 789',
    departamento: 'Logística',
    ativo: true
  },
  {
    id: 'USR-003',
    nome: 'Maria Operadora',
    email: 'operador@jeronimomartins.pt',
    role: 'operador',
    telefone: '+351 914 567 890',
    departamento: 'Operações',
    ativo: true
  },
  {
    id: 'USR-004',
    nome: 'João Motorista',
    email: 'motorista@jeronimomartins.pt',
    role: 'motorista',
    telefone: '+351 915 678 901',
    departamento: 'Transporte',
    ativo: true
  }
];

// Credenciais mock (em produção, usar hash seguro)
export const mockCredentials = {
  'admin@jeronimomartins.pt': 'admin123',
  'coordenador@jeronimomartins.pt': 'coord123',
  'operador@jeronimomartins.pt': 'oper123',
  'motorista@jeronimomartins.pt': 'motor123'
};

// Simular autenticação
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (mockCredentials[email as keyof typeof mockCredentials] === password) {
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  }
  
  return null;
};
