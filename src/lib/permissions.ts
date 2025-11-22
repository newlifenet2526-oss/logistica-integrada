import { UserRole, DEFAULT_PERMISSIONS, ALL_PERMISSIONS } from '@/types/user';

// Verificar se usuário tem permissão específica
export function hasPermission(userRole: UserRole, customPermissions: string[] | null, permissionId: string): boolean {
  // Se tem permissões customizadas, usar elas
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions.includes(permissionId);
  }
  
  // Caso contrário, usar permissões padrão do role
  const defaultPerms = DEFAULT_PERMISSIONS[userRole] || [];
  return defaultPerms.includes(permissionId);
}

// Obter todas as permissões de um usuário
export function getUserPermissions(userRole: UserRole, customPermissions: string[] | null): string[] {
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions;
  }
  
  return DEFAULT_PERMISSIONS[userRole] || [];
}

// Verificar se role pode gerenciar permissões
export function canManagePermissions(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'supervisor';
}

// Verificar se role pode gerenciar usuários
export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'admin';
}

// Obter permissões por categoria
export function getPermissionsByCategory(category: string) {
  return ALL_PERMISSIONS.filter(p => p.category === category);
}

// Obter categorias de permissões
export function getPermissionCategories() {
  const categories = new Set(ALL_PERMISSIONS.map(p => p.category));
  return Array.from(categories);
}

// Validar se conjunto de permissões é válido
export function validatePermissions(permissions: string[]): boolean {
  const validPermissionIds = ALL_PERMISSIONS.map(p => p.id);
  return permissions.every(p => validPermissionIds.includes(p));
}

// Comparar permissões (útil para UI)
export function comparePermissions(current: string[], updated: string[]) {
  const added = updated.filter(p => !current.includes(p));
  const removed = current.filter(p => !updated.includes(p));
  const unchanged = current.filter(p => updated.includes(p));
  
  return { added, removed, unchanged };
}

// Resetar para permissões padrão
export function resetToDefaultPermissions(userRole: UserRole): string[] {
  return DEFAULT_PERMISSIONS[userRole] || [];
}
