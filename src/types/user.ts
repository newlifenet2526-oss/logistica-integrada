// Tipos de usuários do sistema
export type UserRole = 
  | 'admin' 
  | 'coordenador' 
  | 'operador' 
  | 'motorista' 
  | 'shunter' 
  | 'supervisor';

// Permissões disponíveis no sistema
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'operations' | 'management' | 'reports';
}

// Configuração de permissões por role
export interface RolePermissions {
  role: UserRole;
  permissions: string[]; // IDs das permissões
  canModifyPermissions: boolean;
}

// Usuário completo com permissões
export interface UserWithPermissions {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Permissões padrão do sistema
export const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_dashboard',
    'view_metrics',
    'view_alerts',
    'view_trucks',
    'edit_trucks',
    'delete_trucks',
    'import_data',
    'export_data',
    'manage_users',
    'manage_permissions',
    'view_reports',
    'manage_routes',
    'view_driver_info',
    'view_location_info',
    'view_status_history',
  ],
  coordenador: [
    'view_dashboard',
    'view_metrics',
    'view_alerts',
    'view_trucks',
    'edit_trucks',
    'import_data',
    'export_data',
    'view_reports',
    'manage_routes',
    'view_driver_info',
    'view_location_info',
    'view_status_history',
  ],
  operador: [
    'view_dashboard',
    'view_metrics',
    'view_alerts',
    'view_trucks',
    'edit_trucks',
    'view_driver_info',
    'view_location_info',
  ],
  motorista: [
    'view_dashboard',
    'view_trucks',
    'view_routes',
    'view_delivery_status',
    'update_delivery_status',
    'view_driver_info',
    'view_location_info',
  ],
  shunter: [
    'view_dashboard',
    'view_trucks',
    'view_yard_movements',
    'update_yard_status',
    'view_location_info',
  ],
  supervisor: [
    'view_dashboard',
    'view_metrics',
    'view_alerts',
    'view_trucks',
    'edit_trucks',
    'import_data',
    'export_data',
    'manage_permissions',
    'view_reports',
    'manage_routes',
    'view_driver_info',
    'view_location_info',
    'view_status_history',
  ],
};

// Lista de todas as permissões disponíveis
export const ALL_PERMISSIONS: Permission[] = [
  // Dashboard
  { id: 'view_dashboard', name: 'Ver Dashboard', description: 'Acesso ao painel principal', category: 'dashboard' },
  { id: 'view_metrics', name: 'Ver Métricas', description: 'Visualizar métricas e estatísticas', category: 'dashboard' },
  { id: 'view_alerts', name: 'Ver Alertas', description: 'Visualizar alertas e notificações', category: 'dashboard' },
  
  // Operações
  { id: 'view_trucks', name: 'Ver Galeras', description: 'Visualizar lista de galeras', category: 'operations' },
  { id: 'edit_trucks', name: 'Editar Galeras', description: 'Editar informações de galeras', category: 'operations' },
  { id: 'delete_trucks', name: 'Deletar Galeras', description: 'Remover galeras do sistema', category: 'operations' },
  { id: 'import_data', name: 'Importar Dados', description: 'Importar dados via Excel', category: 'operations' },
  { id: 'export_data', name: 'Exportar Dados', description: 'Exportar dados do sistema', category: 'operations' },
  { id: 'view_routes', name: 'Ver Rotas', description: 'Visualizar rotas de entrega', category: 'operations' },
  { id: 'manage_routes', name: 'Gerenciar Rotas', description: 'Criar e editar rotas', category: 'operations' },
  { id: 'view_delivery_status', name: 'Ver Status de Entrega', description: 'Visualizar status de entregas', category: 'operations' },
  { id: 'update_delivery_status', name: 'Atualizar Status de Entrega', description: 'Atualizar status de entregas', category: 'operations' },
  { id: 'view_yard_movements', name: 'Ver Movimentações de Pátio', description: 'Visualizar movimentações no pátio', category: 'operations' },
  { id: 'update_yard_status', name: 'Atualizar Status de Pátio', description: 'Atualizar status de veículos no pátio', category: 'operations' },
  
  // Gestão
  { id: 'manage_users', name: 'Gerenciar Usuários', description: 'Criar, editar e remover usuários', category: 'management' },
  { id: 'manage_permissions', name: 'Gerenciar Permissões', description: 'Configurar permissões de usuários', category: 'management' },
  
  // Relatórios
  { id: 'view_reports', name: 'Ver Relatórios', description: 'Visualizar relatórios do sistema', category: 'reports' },
  { id: 'view_driver_info', name: 'Ver Info de Motoristas', description: 'Visualizar informações de motoristas', category: 'reports' },
  { id: 'view_location_info', name: 'Ver Info de Localização', description: 'Visualizar informações de localização', category: 'reports' },
  { id: 'view_status_history', name: 'Ver Histórico de Status', description: 'Visualizar histórico de mudanças de status', category: 'reports' },
];

// Labels amigáveis para roles
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  coordenador: 'Coordenador',
  operador: 'Operador',
  motorista: 'Motorista',
  shunter: 'Shunter',
  supervisor: 'Supervisor',
};

// Descrições dos roles
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Acesso total a todas as funcionalidades e configurações do sistema',
  coordenador: 'Gestão operacional com permissões para monitorar e coordenar equipes',
  operador: 'Acesso às funções operacionais básicas do dia a dia',
  motorista: 'Acesso completo às informações de rotas e status de entrega',
  shunter: 'Acesso às informações de movimentação de veículos no pátio',
  supervisor: 'Acesso amplo para monitorar, analisar dados e ajustar permissões',
};
