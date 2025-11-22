// Sistema de notificações personalizadas por usuário

export interface UserNotificationPreferences {
  userId: string;
  email: string;
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  notifyOnStatusChange: boolean;
  notifyOnDelays: boolean;
  notifyOnMaintenance: boolean;
  notifyOnRouteChange: boolean;
  notifyOnCriticalAlerts: boolean;
  quietHoursStart?: string; // HH:MM format
  quietHoursEnd?: string; // HH:MM format
}

export interface PersonalizedNotification {
  id: string;
  userId: string;
  type: 'status_change' | 'delay' | 'maintenance' | 'route_change' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  truckId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Preferências padrão para novos usuários
export const defaultNotificationPreferences: Omit<UserNotificationPreferences, 'userId' | 'email'> = {
  enableEmailNotifications: true,
  enablePushNotifications: true,
  notifyOnStatusChange: true,
  notifyOnDelays: true,
  notifyOnMaintenance: true,
  notifyOnRouteChange: true,
  notifyOnCriticalAlerts: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

// Função para verificar se está em horário de silêncio
export function isQuietHours(preferences: UserNotificationPreferences): boolean {
  if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const start = preferences.quietHoursStart;
  const end = preferences.quietHoursEnd;

  // Se o horário de fim é menor que o de início, significa que passa da meia-noite
  if (end < start) {
    return currentTime >= start || currentTime <= end;
  }
  
  return currentTime >= start && currentTime <= end;
}

// Função para filtrar notificações baseadas nas preferências do usuário
export function shouldSendNotification(
  notification: PersonalizedNotification,
  preferences: UserNotificationPreferences
): boolean {
  // Sempre enviar notificações críticas
  if (notification.priority === 'critical' && preferences.notifyOnCriticalAlerts) {
    return true;
  }

  // Verificar horário de silêncio
  if (isQuietHours(preferences) && notification.priority !== 'critical') {
    return false;
  }

  // Verificar preferências específicas por tipo
  switch (notification.type) {
    case 'status_change':
      return preferences.notifyOnStatusChange;
    case 'delay':
      return preferences.notifyOnDelays;
    case 'maintenance':
      return preferences.notifyOnMaintenance;
    case 'route_change':
      return preferences.notifyOnRouteChange;
    case 'critical':
      return preferences.notifyOnCriticalAlerts;
    default:
      return true;
  }
}

// Função para criar notificação personalizada
export function createPersonalizedNotification(
  userId: string,
  type: PersonalizedNotification['type'],
  title: string,
  message: string,
  priority: PersonalizedNotification['priority'],
  truckId?: string
): PersonalizedNotification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    truckId,
    priority,
  };
}

// Simulação de armazenamento de preferências (em produção, usar banco de dados)
const userPreferencesStore = new Map<string, UserNotificationPreferences>();

export function getUserNotificationPreferences(userId: string): UserNotificationPreferences {
  const stored = userPreferencesStore.get(userId);
  if (stored) {
    return stored;
  }

  // Retornar preferências padrão se não existir
  return {
    userId,
    email: '', // Deve ser preenchido com o email real do usuário
    ...defaultNotificationPreferences,
  };
}

export function updateUserNotificationPreferences(
  userId: string,
  preferences: Partial<UserNotificationPreferences>
): void {
  const current = getUserNotificationPreferences(userId);
  const updated = { ...current, ...preferences };
  userPreferencesStore.set(userId, updated);
}

// Simulação de armazenamento de notificações (em produção, usar banco de dados)
const notificationsStore = new Map<string, PersonalizedNotification[]>();

export function getUserNotifications(userId: string): PersonalizedNotification[] {
  return notificationsStore.get(userId) || [];
}

export function addUserNotification(notification: PersonalizedNotification): void {
  const userNotifications = getUserNotifications(notification.userId);
  userNotifications.unshift(notification);
  notificationsStore.set(notification.userId, userNotifications);
}

export function markNotificationAsRead(userId: string, notificationId: string): void {
  const userNotifications = getUserNotifications(userId);
  const notification = userNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    notificationsStore.set(userId, userNotifications);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const userNotifications = getUserNotifications(userId);
  userNotifications.forEach(n => n.read = true);
  notificationsStore.set(userId, userNotifications);
}

export function deleteNotification(userId: string, notificationId: string): void {
  const userNotifications = getUserNotifications(userId);
  const filtered = userNotifications.filter(n => n.id !== notificationId);
  notificationsStore.set(userId, filtered);
}
