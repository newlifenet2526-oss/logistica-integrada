'use client';

import { useState, useEffect } from 'react';
import { UserWithPermissions, ALL_PERMISSIONS, ROLE_LABELS } from '@/types/user';
import { getUserPermissions, resetToDefaultPermissions } from '@/lib/permissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, RotateCcw, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithPermissions;
  onSave: (userId: string, permissions: string[]) => void;
}

export function UserPermissionsModal({ isOpen, onClose, user, onSave }: UserPermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentPermissions = getUserPermissions(user.role, user.permissions);
      setSelectedPermissions(currentPermissions);
      setHasChanges(false);
    }
  }, [isOpen, user]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => {
      const newPermissions = prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId];
      setHasChanges(true);
      return newPermissions;
    });
  };

  const handleResetToDefault = () => {
    const defaultPermissions = resetToDefaultPermissions(user.role);
    setSelectedPermissions(defaultPermissions);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(user.id, selectedPermissions);
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('Você tem alterações não salvas. Deseja descartar?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Agrupar permissões por categoria
  const permissionsByCategory = ALL_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof ALL_PERMISSIONS>);

  const categoryLabels = {
    dashboard: 'Dashboard',
    operations: 'Operações',
    management: 'Gestão',
    reports: 'Relatórios',
  };

  const categoryIcons = {
    dashboard: '📊',
    operations: '🚚',
    management: '👥',
    reports: '📈',
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="w-6 h-6 text-purple-600" />
            Gerenciar Permissões
          </DialogTitle>
          <DialogDescription>
            Configure as permissões de acesso para <strong>{user.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Usuário */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{user.nome}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {selectedPermissions.length} de {ALL_PERMISSIONS.length} permissões selecionadas
              </Badge>
              {hasChanges && (
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  Alterações não salvas
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>

          <Separator />

          {/* Tabs por Categoria */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <span>{categoryIcons[key as keyof typeof categoryIcons]}</span>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(permissionsByCategory).map(([category, permissions]) => (
              <TabsContent key={category} value={category}>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={permission.id}
                            className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
