'use client';

import { useState } from 'react';
import { UserWithPermissions, UserRole, ROLE_LABELS, ROLE_DESCRIPTIONS, DEFAULT_PERMISSIONS } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Mail, User, Shield } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserWithPermissions, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddUserModal({ isOpen, onClose, onSave }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    role: 'operador' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Criar usuário com permissões padrão do role
    const newUser: Omit<UserWithPermissions, 'id' | 'createdAt' | 'updatedAt'> = {
      nome: formData.nome.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      permissions: DEFAULT_PERMISSIONS[formData.role] || [],
    };

    onSave(newUser);
    
    // Reset form
    setFormData({
      nome: '',
      email: '',
      role: 'operador',
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      email: '',
      role: 'operador',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="w-6 h-6 text-emerald-600" />
            Adicionar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário. As permissões padrão serão aplicadas automaticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome Completo
            </Label>
            <Input
              id="nome"
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, nome: e.target.value }));
                setErrors(prev => ({ ...prev, nome: '' }));
              }}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: joao.silva@jeronimo.pt"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Tipo de Usuário
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div>
                    <p className="font-semibold">{ROLE_LABELS.admin}</p>
                    <p className="text-xs text-gray-600">{ROLE_DESCRIPTIONS.admin}</p>
                  </div>
                </SelectItem>
                <SelectItem value="coordenador">
                  <div>
                    <p className="font-semibold">{ROLE_LABELS.coordenador}</p>
                    <p className="text-xs text-gray-600">{ROLE_DESCRIPTIONS.coordenador}</p>
                  </div>
                </SelectItem>
                <SelectItem value="operador">
                  <div>
                    <p className="font-semibold">{ROLE_LABELS.operador}</p>
                    <p className="text-xs text-gray-600">{ROLE_DESCRIPTIONS.operador}</p>
                  </div>
                </SelectItem>
                <SelectItem value="motorista">
                  <div>
                    <p className="font-semibold">{ROLE_LABELS.motorista}</p>
                    <p className="text-xs text-gray-600">{ROLE_DESCRIPTIONS.motorista}</p>
                  </div>
                </SelectItem>
                <SelectItem value="shunter">
                  <div>
                    <p className="font-semibold">{ROLE_LABELS.shunter}</p>
                    <p className="text-xs text-gray-600">{ROLE_DESCRIPTIONS.shunter}</p>
                  </div>
                </SelectItem>
                <SelectItem value="supervisor">
                  <div>
                    <p className="font-semibold">{ROLE_LABELS.supervisor}</p>
                    <p className="text-xs text-gray-600">{ROLE_DESCRIPTIONS.supervisor}</p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {ROLE_DESCRIPTIONS[formData.role]}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
