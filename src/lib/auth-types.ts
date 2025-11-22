// Tipos para sistema de autenticação

export type UserRole = 'admin' | 'coordenador' | 'operador' | 'motorista';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  telefone?: string;
  departamento?: string;
  ativo: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
