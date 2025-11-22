'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  UserNotificationPreferences, 
  getUserNotificationPreferences, 
  updateUserNotificationPreferences 
} from '@/lib/notifications';
import { Bell, Mail, Clock, AlertCircle, Save, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export function NotificationSettingsModal({ 
  isOpen, 
  onClose, 
  userId,
  userEmail 
}: NotificationSettingsModalProps) {
  const [preferences, setPreferences] = useState<UserNotificationPreferences>({
    userId,
    email: userEmail,
    enableEmailNotifications: true,
    enablePushNotifications: true,
    notifyOnStatusChange: true,
    notifyOnDelays: true,
    notifyOnMaintenance: true,
    notifyOnRouteChange: true,
    notifyOnCriticalAlerts: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const userPrefs = getUserNotificationPreferences(userId);
      setPreferences({ ...userPrefs, email: userEmail });
    }
  }, [isOpen, userId, userEmail]);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simular salvamento (em produção, fazer chamada à API)
    setTimeout(() => {
      updateUserNotificationPreferences(userId, preferences);
      setIsSaving(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 500);
  };

  const handleToggle = (key: keyof UserNotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTimeChange = (key: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Configurações de Notificações
          </DialogTitle>
          <DialogDescription>
            Personalize como e quando você deseja receber notificações do sistema.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              ✅ Preferências salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-4">
          {/* Canais de Notificação */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <Label className="text-base font-bold text-gray-900 dark:text-gray-100">
                Canais de Notificação
              </Label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-semibold">
                    Notificações por Email
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receber alertas importantes por email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.enableEmailNotifications}
                  onCheckedChange={() => handleToggle('enableEmailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-semibold">
                    Notificações Push
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receber notificações em tempo real no navegador
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={preferences.enablePushNotifications}
                  onCheckedChange={() => handleToggle('enablePushNotifications')}
                />
              </div>
            </div>
          </div>

          {/* Tipos de Notificações */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              <Label className="text-base font-bold text-gray-900 dark:text-gray-100">
                Tipos de Notificações
              </Label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="status-change" className="text-sm font-semibold">
                    Mudanças de Status
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notificar quando o status de uma galera mudar
                  </p>
                </div>
                <Switch
                  id="status-change"
                  checked={preferences.notifyOnStatusChange}
                  onCheckedChange={() => handleToggle('notifyOnStatusChange')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="delays" className="text-sm font-semibold">
                    Atrasos
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notificar sobre atrasos nas entregas
                  </p>
                </div>
                <Switch
                  id="delays"
                  checked={preferences.notifyOnDelays}
                  onCheckedChange={() => handleToggle('notifyOnDelays')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="maintenance" className="text-sm font-semibold">
                    Manutenção
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notificar sobre necessidades de manutenção
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={preferences.notifyOnMaintenance}
                  onCheckedChange={() => handleToggle('notifyOnMaintenance')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="route-change" className="text-sm font-semibold">
                    Alterações de Rota
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notificar quando houver mudanças nas rotas
                  </p>
                </div>
                <Switch
                  id="route-change"
                  checked={preferences.notifyOnRouteChange}
                  onCheckedChange={() => handleToggle('notifyOnRouteChange')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-red-200 dark:border-red-800">
                <div>
                  <Label htmlFor="critical-alerts" className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Alertas Críticos
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sempre notificar sobre situações críticas (recomendado)
                  </p>
                </div>
                <Switch
                  id="critical-alerts"
                  checked={preferences.notifyOnCriticalAlerts}
                  onCheckedChange={() => handleToggle('notifyOnCriticalAlerts')}
                />
              </div>
            </div>
          </div>

          {/* Horário de Silêncio */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-bold text-gray-900 dark:text-gray-100">
                Horário de Silêncio
              </Label>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Durante este período, você não receberá notificações não críticas.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiet-start" className="text-sm font-semibold">
                  Início
                </Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={preferences.quietHoursStart || '22:00'}
                  onChange={(e) => handleTimeChange('quietHoursStart', e.target.value)}
                  className="bg-white dark:bg-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiet-end" className="text-sm font-semibold">
                  Fim
                </Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={preferences.quietHoursEnd || '07:00'}
                  onChange={(e) => handleTimeChange('quietHoursEnd', e.target.value)}
                  className="bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Informação sobre Personalização */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <strong>ℹ️ Personalização:</strong> Suas preferências são salvas individualmente e aplicadas apenas à sua conta.
            </AlertDescription>
          </Alert>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Preferências
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
