/**
 * Sistema de Auditoria
 * Registra todas as alterações realizadas no sistema para transparência e segurança
 */

export interface AuditLog {
  id?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'TRUCK' | 'ALERT' | 'USER' | 'OTHER';
  entityId: string;
  userId: string;
  userRole: string;
  changes?: {
    before?: any;
    after?: any;
  };
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Armazenamento local dos logs (em produção, isso seria enviado para um backend)
const AUDIT_STORAGE_KEY = 'jm_audit_logs';

/**
 * Registra uma ação de auditoria
 */
export async function logAudit(log: AuditLog): Promise<void> {
  try {
    // Gerar ID único
    const auditLog: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: log.timestamp || new Date().toISOString()
    };

    // Obter logs existentes
    const existingLogs = getAuditLogs();

    // Adicionar novo log
    existingLogs.push(auditLog);

    // Limitar a 1000 logs mais recentes (para não sobrecarregar localStorage)
    const limitedLogs = existingLogs.slice(-1000);

    // Salvar no localStorage
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(limitedLogs));

    // Em produção, você enviaria para um backend:
    // await fetch('/api/audit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(auditLog)
    // });

    console.log('✅ Auditoria registrada:', auditLog);
  } catch (error) {
    console.error('❌ Erro ao registrar auditoria:', error);
    // Não bloquear a operação principal se auditoria falhar
  }
}

/**
 * Obtém todos os logs de auditoria
 */
export function getAuditLogs(): AuditLog[] {
  try {
    const logs = localStorage.getItem(AUDIT_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Erro ao obter logs de auditoria:', error);
    return [];
  }
}

/**
 * Obtém logs filtrados por entidade
 */
export function getAuditLogsByEntity(entityType: string, entityId: string): AuditLog[] {
  const allLogs = getAuditLogs();
  return allLogs.filter(log => 
    log.entityType === entityType && log.entityId === entityId
  );
}

/**
 * Obtém logs filtrados por usuário
 */
export function getAuditLogsByUser(userId: string): AuditLog[] {
  const allLogs = getAuditLogs();
  return allLogs.filter(log => log.userId === userId);
}

/**
 * Obtém logs filtrados por período
 */
export function getAuditLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
  const allLogs = getAuditLogs();
  return allLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}

/**
 * Limpa logs antigos (manter apenas últimos 30 dias)
 */
export function cleanOldAuditLogs(daysToKeep: number = 30): void {
  try {
    const allLogs = getAuditLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const recentLogs = allLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= cutoffDate;
    });

    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(recentLogs));
    console.log(`🧹 Logs de auditoria limpos. Mantidos: ${recentLogs.length}`);
  } catch (error) {
    console.error('Erro ao limpar logs antigos:', error);
  }
}

/**
 * Exporta logs de auditoria para JSON
 */
export function exportAuditLogs(): string {
  const logs = getAuditLogs();
  return JSON.stringify(logs, null, 2);
}

/**
 * Formata log de auditoria para exibição
 */
export function formatAuditLog(log: AuditLog): string {
  const date = new Date(log.timestamp).toLocaleString('pt-PT');
  const action = {
    CREATE: 'Criou',
    UPDATE: 'Atualizou',
    DELETE: 'Deletou'
  }[log.action];

  return `[${date}] ${log.userId} (${log.userRole}) ${action} ${log.entityType} #${log.entityId}`;
}
