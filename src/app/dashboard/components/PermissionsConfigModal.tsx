'use client';

import { useState } from 'react';
import { usePermissions, PermissionConfig } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Settings,
  Eye,
  EyeOff,
  Edit,
  Upload,
  Download,
  Trash2,
  User,
  MapPin,
  Clock,
  BarChart3,
  AlertTriangle,
  Filter,
  FileText,
  RefreshCw,
  Save,
  Shield
} from 'lucide-react';

interface PermissionsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PermissionsConfigModal({ isOpen, onClose }: PermissionsConfigModalProps) {
  const { operatorPermissions, updateOperatorPermissions, resetToDefaults } = usePermissions();
  const [localPermissions, setLocalPermissions] = useState<PermissionConfig>(operatorPermissions);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof PermissionConfig) => {
    const newPermissions = { ...localPermissions, [key]: !localPermissions[key] };
    setLocalPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateOperatorPermissions(localPermissions);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    resetToDefaults();
    setLocalPermissions(operatorPermissions);
    setHasChanges(false);
  };

  const permissionGroups = [
    {
      title: 'Visualização de Dados',
      icon: Eye,
      color: 'from-blue-500 to-cyan-600',
      permissions: [
        { key: 'showMetrics' as keyof PermissionConfig, label: 'Métricas e Estatísticas', icon: BarChart3, description: 'Total de galeras, entregas, eficiência' },
        { key: 'showAlerts' as keyof PermissionConfig, label: 'Painel de Alertas', icon: AlertTriangle, description: 'Notificações e avisos importantes' },
        { key: 'showFilters' as keyof PermissionConfig, label: 'Filtros de Status', icon: Filter, description: 'Filtrar galeras por status' },
        { key: 'showTruckDetails' as keyof PermissionConfig, label: 'Detalhes das Galeras', icon: FileText, description: 'Informações completas dos veículos' },
      ]
    },
    {
      title: 'Informações Específicas',
      icon: MapPin,
      color: 'from-purple-500 to-pink-600',
      permissions: [
        { key: 'showDriverInfo' as keyof PermissionConfig, label: 'Dados do Motorista', icon: User, description: 'Nome e informações do condutor' },
        { key: 'showLocationInfo' as keyof PermissionConfig, label: 'Localização e Destino', icon: MapPin, description: 'Origem, destino e rotas' },
        { key: 'showStatusHistory' as keyof PermissionConfig, label: 'Histórico de Status', icon: Clock, description: 'Mudanças de status ao longo do tempo' },
      ]
    },
    {
      title: 'Ações e Operações',
      icon: Edit,
      color: 'from-orange-500 to-red-600',
      permissions: [
        { key: 'canEdit' as keyof PermissionConfig, label: 'Editar Registros', icon: Edit, description: 'Modificar informações das galeras' },
        { key: 'canImport' as keyof PermissionConfig, label: 'Importar Excel', icon: Upload, description: 'Fazer upload de planilhas' },
        { key: 'canExport' as keyof PermissionConfig, label: 'Exportar Dados', icon: Download, description: 'Baixar relatórios e dados' },
        { key: 'canDelete' as keyof PermissionConfig, label: 'Excluir Registros', icon: Trash2, description: 'Remover galeras do sistema' },
      ]
    }
  ];

  const activeCount = Object.values(localPermissions).filter(Boolean).length;
  const totalCount = Object.keys(localPermissions).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Configurar Permissões de Operadores</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Defina quais informações e funcionalidades os operadores podem acessar
              </DialogDescription>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl mt-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                {activeCount}/{totalCount} Permissões Ativas
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="border-orange-500 text-orange-600 dark:text-orange-400">
                  Alterações não salvas
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {permissionGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.title} className="space-y-4">
                {/* Group Header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${group.color}`}>
                    <GroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {group.title}
                  </h3>
                </div>

                {/* Permissions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.permissions.map((permission) => {
                    const PermIcon = permission.icon;
                    const isActive = localPermissions[permission.key];

                    return (
                      <div
                        key={permission.key}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-500 shadow-lg shadow-emerald-500/10'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${
                              isActive 
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <PermIcon className={`w-4 h-4 ${
                                isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <Label 
                                htmlFor={permission.key}
                                className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
                              >
                                {permission.label}
                              </Label>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                          <Switch
                            id={permission.key}
                            checked={isActive}
                            onCheckedChange={() => handleToggle(permission.key)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
