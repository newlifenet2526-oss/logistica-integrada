'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Truck, TruckStatus, SecaoArmazem } from '@/lib/types';
import { Save, X, AlertCircle, Plus, Anchor, Navigation } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logAudit } from '@/lib/audit-logger';

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  truck: Truck | null;
  onSave: (updatedTruck: Truck) => void;
  userRole: string;
  userName: string;
  isNewRecord?: boolean; // NOVO: Indica se é um novo registro
}

export function EditRecordModal({ 
  isOpen, 
  onClose, 
  truck, 
  onSave,
  userRole,
  userName,
  isNewRecord = false
}: EditRecordModalProps) {
  const [formData, setFormData] = useState<Partial<Truck>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Verificar permissão
  const canEdit = userRole === 'admin' || userRole === 'coordenador';

  useEffect(() => {
    if (truck) {
      setFormData(truck);
      setErrors({});
    } else if (isNewRecord) {
      // Inicializar novo registro com valores padrão
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      setFormData({
        id: `truck-${Date.now()}`,
        placa: '',
        motorista: '',
        operadorResponsavel: '',
        cais: '',
        proximoCaisDestino: undefined,
        numeroCaisDestino: '',
        status: 'disponivel',
        localizacao: {
          latitude: 0,
          longitude: 0,
          endereco: ''
        },
        origem: '',
        destino: '',
        carga: {
          tipo: '',
          peso: 0,
          volume: 0
        },
        horarios: {
          saida: new Date().toISOString(),
          chegadaPrevista: new Date().toISOString()
        },
        progresso: 0,
        combustivel: 100,
        pallets: {
          carga: 0,
          descarga: 0
        },
        dataRegistro: today // Data de hoje por padrão
      });
      setErrors({});
    }
  }, [truck, isNewRecord]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.placa || formData.placa.trim() === '') {
      newErrors.placa = 'Placa é obrigatória';
    }

    if (!formData.motorista || formData.motorista.trim() === '') {
      newErrors.motorista = 'Motorista é obrigatório';
    }

    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }

    // Validar cais (aceita números, letras e emoticons - até 10 caracteres)
    if (formData.cais && formData.cais.trim() !== '') {
      if (formData.cais.length > 10) {
        newErrors.cais = 'Cais deve ter no máximo 10 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!canEdit) {
      alert('Você não tem permissão para editar registros.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedTruck = {
        ...truck,
        ...formData,
        ultimaAtualizacao: new Date().toISOString()
      } as Truck;

      // Registrar auditoria
      await logAudit({
        action: isNewRecord ? 'CREATE' : 'UPDATE',
        entityType: 'TRUCK',
        entityId: updatedTruck.id,
        userId: userName,
        userRole: userRole,
        changes: {
          before: truck,
          after: updatedTruck
        },
        timestamp: new Date().toISOString()
      });

      onSave(updatedTruck);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions: { value: TruckStatus; label: string }[] = [
    { value: 'disponivel', label: 'Disponível' },
    { value: 'em_transito', label: 'Em Trânsito' },
    { value: 'carregando', label: 'Carregando' },
    { value: 'descarregando', label: 'Descarregando' },
    { value: 'manutencao', label: 'Manutenção' }
  ];

  // Opções de seções do armazém
  const secaoArmazemOptions: { value: SecaoArmazem; label: string; icon: string }[] = [
    { value: 'nao_pereciveis', label: 'Não Perecíveis', icon: '📦' },
    { value: 'frescos', label: 'Frescos', icon: '🥬' },
    { value: 'congelados', label: 'Congelados', icon: '❄️' },
    { value: 'frutas', label: 'Frutas', icon: '🍎' },
    { value: 'peixe', label: 'Peixe', icon: '🐟' },
    { value: 'carnes', label: 'Carnes', icon: '🥩' },
    { value: 'laticinios', label: 'Laticínios', icon: '🥛' },
    { value: 'bebidas', label: 'Bebidas', icon: '🥤' },
    { value: 'higiene', label: 'Higiene', icon: '🧼' },
    { value: 'outros', label: 'Outros', icon: '📋' }
  ];

  if (!truck && !isNewRecord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              {isNewRecord ? <Plus className="w-5 h-5 text-white" /> : <Save className="w-5 h-5 text-white" />}
            </div>
            {isNewRecord ? 'Adicionar Nova Galera' : 'Editar Informações da Galera'}
          </DialogTitle>
          <DialogDescription>
            {isNewRecord 
              ? 'Preencha as informações da nova galera. Todas as informações serão registradas no sistema.'
              : 'Atualize as informações da galera. Todas as alterações serão registradas no sistema.'}
          </DialogDescription>
        </DialogHeader>

        {!canEdit && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para editar registros. Apenas Administradores e Coordenadores podem realizar alterações.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-4">
          {/* Data de Registro */}
          <div className="space-y-2">
            <Label htmlFor="dataRegistro" className="text-sm font-semibold">
              Data de Registro <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dataRegistro"
              type="date"
              value={formData.dataRegistro || ''}
              onChange={(e) => setFormData({ ...formData, dataRegistro: e.target.value })}
              disabled={!canEdit}
              className="bg-gray-50 dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📅 Data em que a galera foi registrada no sistema
            </p>
          </div>

          {/* Placa - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="placa" className="text-sm font-semibold">
              Placa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="placa"
              value={formData.placa || ''}
              onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
              placeholder="Ex: ABC-1234, 🚛 123, Galera A1"
              disabled={!canEdit}
              className={errors.placa ? 'border-red-500' : ''}
            />
            {errors.placa && (
              <p className="text-sm text-red-500">{errors.placa}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Aceita letras, números e emoticons
            </p>
          </div>

          {/* Motorista - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="motorista" className="text-sm font-semibold">
              Motorista <span className="text-red-500">*</span>
            </Label>
            <Input
              id="motorista"
              value={formData.motorista || ''}
              onChange={(e) => setFormData({ ...formData, motorista: e.target.value })}
              placeholder="Ex: João Silva, 👨‍✈️ Carlos, Motorista 42"
              disabled={!canEdit}
              className={errors.motorista ? 'border-red-500' : ''}
            />
            {errors.motorista && (
              <p className="text-sm text-red-500">{errors.motorista}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Aceita letras, números e emoticons
            </p>
          </div>

          {/* Operador Responsável - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="operadorResponsavel" className="text-sm font-semibold">
              Operador Responsável
            </Label>
            <Input
              id="operadorResponsavel"
              value={formData.operadorResponsavel || ''}
              onChange={(e) => setFormData({ ...formData, operadorResponsavel: e.target.value })}
              placeholder="Ex: Maria Santos, 👷 Pedro, Operador 15"
              disabled={!canEdit}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Operador responsável pela operação de carga ou descarga (aceita letras, números e emoticons)
            </p>
          </div>

          {/* Cais Atual e Próximo Cais de Destino - Grid 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cais Atual - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
            <div className="space-y-2">
              <Label htmlFor="cais" className="text-sm font-semibold flex items-center gap-2">
                <Anchor className="w-4 h-4 text-blue-600" />
                Cais Atual
              </Label>
              <Input
                id="cais"
                value={formData.cais || ''}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 10);
                  setFormData({ ...formData, cais: value });
                }}
                placeholder="Ex: 001, A5, ⚓ 42"
                disabled={!canEdit}
                maxLength={10}
                className={errors.cais ? 'border-red-500' : ''}
              />
              {errors.cais && (
                <p className="text-sm text-red-500">{errors.cais}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Localização atual (máx 10 caracteres)
              </p>
            </div>

            {/* Seção do Armazém de Destino */}
            <div className="space-y-2">
              <Label htmlFor="proximoCaisDestino" className="text-sm font-semibold flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                Seção de Destino
              </Label>
              <Select
                value={formData.proximoCaisDestino}
                onValueChange={(value) => setFormData({ ...formData, proximoCaisDestino: value as SecaoArmazem })}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a seção" />
                </SelectTrigger>
                <SelectContent>
                  {secaoArmazemOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Seção do armazém de destino
              </p>
            </div>

            {/* Número do Cais de Destino */}
            <div className="space-y-2">
              <Label htmlFor="numeroCaisDestino" className="text-sm font-semibold flex items-center gap-2">
                <Anchor className="w-4 h-4 text-emerald-600" />
                Nº Cais Destino
              </Label>
              <Input
                id="numeroCaisDestino"
                value={formData.numeroCaisDestino || ''}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 10);
                  setFormData({ ...formData, numeroCaisDestino: value });
                }}
                placeholder="Ex: 015, B3, 🎯 7"
                disabled={!canEdit}
                maxLength={10}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Número do cais de destino (máx 10 caracteres)
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as TruckStatus })}
              disabled={!canEdit}
            >
              <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Contador de Pallets */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Contador de Pallets
              </Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Pallets para Carga */}
              <div className="space-y-2">
                <Label htmlFor="palletsCarga" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Pallets para Carga
                </Label>
                <Input
                  id="palletsCarga"
                  type="number"
                  min="0"
                  value={formData.pallets?.carga || 0}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    pallets: { 
                      ...formData.pallets, 
                      carga: parseInt(e.target.value) || 0 
                    } 
                  })}
                  placeholder="0"
                  disabled={!canEdit}
                  className="bg-white dark:bg-gray-900"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quantidade de pallets que podem ser carregados
                </p>
              </div>

              {/* Pallets para Descarga */}
              <div className="space-y-2">
                <Label htmlFor="palletsDescarga" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Pallets para Descarga
                </Label>
                <Input
                  id="palletsDescarga"
                  type="number"
                  min="0"
                  value={formData.pallets?.descarga || 0}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    pallets: { 
                      ...formData.pallets, 
                      descarga: parseInt(e.target.value) || 0 
                    } 
                  })}
                  placeholder="0"
                  disabled={!canEdit}
                  className="bg-white dark:bg-gray-900"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quantidade de pallets que serão descarregados
                </p>
              </div>
            </div>
          </div>

          {/* Localização Atual - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="localizacaoAtual" className="text-sm font-semibold">
              Localização Atual
            </Label>
            <Input
              id="localizacaoAtual"
              value={formData.localizacao?.endereco || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                localizacao: { 
                  ...formData.localizacao!, 
                  endereco: e.target.value 
                } 
              })}
              placeholder="Ex: Lisboa, 📍 Zona A, Setor 3"
              disabled={!canEdit}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Aceita letras, números e emoticons
            </p>
          </div>

          {/* Origem - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="origem" className="text-sm font-semibold">
              Origem
            </Label>
            <Input
              id="origem"
              value={formData.origem || ''}
              onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
              placeholder="Ex: Armazém Central, 🏭 Fábrica 2, Origem A"
              disabled={!canEdit}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Aceita letras, números e emoticons
            </p>
          </div>

          {/* Destino - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="destino" className="text-sm font-semibold">
              Destino
            </Label>
            <Input
              id="destino"
              value={formData.destino || ''}
              onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              placeholder="Ex: Porto, 🎯 Loja 15, Destino B"
              disabled={!canEdit}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Aceita letras, números e emoticons
            </p>
          </div>

          {/* Tipo de Carga - ACEITA NÚMEROS, LETRAS E EMOTICONS */}
          <div className="space-y-2">
            <Label htmlFor="cargaTipo" className="text-sm font-semibold">
              Tipo de Carga
            </Label>
            <Input
              id="cargaTipo"
              value={formData.carga?.tipo || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                carga: { 
                  ...formData.carga!, 
                  tipo: e.target.value 
                } 
              })}
              placeholder="Ex: Alimentos perecíveis, 🥦 Frescos, Carga 7"
              disabled={!canEdit}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Aceita letras, números e emoticons
            </p>
          </div>

          {/* Peso (kg) */}
          <div className="space-y-2">
            <Label htmlFor="peso" className="text-sm font-semibold">
              Peso (kg)
            </Label>
            <Input
              id="peso"
              type="number"
              value={formData.carga?.peso || 0}
              onChange={(e) => setFormData({ 
                ...formData, 
                carga: { 
                  ...formData.carga!, 
                  peso: parseFloat(e.target.value) || 0 
                } 
              })}
              placeholder="Ex: 15000"
              disabled={!canEdit}
            />
          </div>

          {/* Volume (m³) */}
          <div className="space-y-2">
            <Label htmlFor="volume" className="text-sm font-semibold">
              Volume (m³)
            </Label>
            <Input
              id="volume"
              type="number"
              value={formData.carga?.volume || 0}
              onChange={(e) => setFormData({ 
                ...formData, 
                carga: { 
                  ...formData.carga!, 
                  volume: parseFloat(e.target.value) || 0 
                } 
              })}
              placeholder="Ex: 50"
              disabled={!canEdit}
            />
          </div>
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
            disabled={!canEdit || isSaving}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                {isNewRecord ? <Plus className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isNewRecord ? 'Adicionar Galera' : 'Salvar Alterações'}
              </>
            )}
          </Button>
        </div>

        {/* Informação de Auditoria */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>ℹ️ Auditoria:</strong> Todas as alterações são registradas automaticamente com data, hora e usuário responsável.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
