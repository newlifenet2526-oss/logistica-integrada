'use client';

import { Truck } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Truck as TruckIcon, MapPin, Package, Thermometer, Fuel, User, Edit, Clock, Calendar, UserCog, PackageOpen, Anchor, Navigation } from 'lucide-react';

interface TruckCardProps {
  truck: Truck;
  onEdit?: (truck: Truck) => void;
  canEdit?: boolean;
  showDriverInfo?: boolean;
  showLocationInfo?: boolean;
}

const statusConfig = {
  em_transito: { label: 'Em Trânsito', color: 'bg-blue-500' },
  carregando: { label: 'Carregando', color: 'bg-yellow-500' },
  descarregando: { label: 'Descarregando', color: 'bg-orange-500' },
  parado: { label: 'Parado', color: 'bg-gray-500' },
  manutencao: { label: 'Manutenção', color: 'bg-red-500' },
  disponivel: { label: 'Disponível', color: 'bg-green-500' }
};

// Labels para seções do armazém
const secaoArmazemLabels: Record<string, { label: string; icon: string }> = {
  nao_pereciveis: { label: 'Não Perecíveis', icon: '📦' },
  frescos: { label: 'Frescos', icon: '🥬' },
  congelados: { label: 'Congelados', icon: '❄️' },
  frutas: { label: 'Frutas', icon: '🍎' },
  peixe: { label: 'Peixe', icon: '🐟' },
  carnes: { label: 'Carnes', icon: '🥩' },
  laticinios: { label: 'Laticínios', icon: '🥛' },
  bebidas: { label: 'Bebidas', icon: '🥤' },
  higiene: { label: 'Higiene', icon: '🧼' },
  outros: { label: 'Outros', icon: '📋' }
};

export function TruckCard({ 
  truck, 
  onEdit, 
  canEdit = false,
  showDriverInfo = true,
  showLocationInfo = true
}: TruckCardProps) {
  const status = statusConfig[truck.status];
  
  // Processar horários
  const horarioSaida = new Date(truck.horarios.saida);
  const horarioChegadaPrevista = new Date(truck.horarios.chegadaPrevista);
  const horarioChegadaReal = truck.horarios.chegadaReal ? new Date(truck.horarios.chegadaReal) : null;

  const formatarHorario = (date: Date) => {
    return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  };

  const formatarData = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card className="p-4 hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-800 relative">
      {/* Layout Horizontal */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Seção 1: Identificação e Status */}
        <div className="flex items-center gap-3 lg:w-48 flex-shrink-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
            <TruckIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 truncate">
              {truck.id}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{truck.placa}</p>
            <Badge className={`${status.color} text-white border-0 text-xs mt-1`}>
              {status.label}
            </Badge>
            {/* Cais Atual */}
            {truck.cais && (
              <div className="flex items-center gap-1 mt-1">
                <Anchor className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  Cais {truck.cais}
                </span>
              </div>
            )}
            {/* Próximo Cais de Destino - Seção e Número */}
            {(truck.proximoCaisDestino || truck.numeroCaisDestino) && (
              <div className="flex items-center gap-1 mt-1">
                <Navigation className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {truck.proximoCaisDestino && secaoArmazemLabels[truck.proximoCaisDestino]?.icon}
                  {truck.proximoCaisDestino && ` ${secaoArmazemLabels[truck.proximoCaisDestino]?.label}`}
                  {truck.proximoCaisDestino && truck.numeroCaisDestino && ' - '}
                  {truck.numeroCaisDestino && `Cais ${truck.numeroCaisDestino}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2: Horários */}
        <div className="flex flex-col gap-2 lg:w-56 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 pl-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Saída</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatarHorario(horarioSaida)} <span className="text-xs text-gray-500">({formatarData(horarioSaida)})</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Chegada Prevista</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatarHorario(horarioChegadaPrevista)} <span className="text-xs text-gray-500">({formatarData(horarioChegadaPrevista)})</span>
              </p>
            </div>
          </div>
          {horarioChegadaReal && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Chegada Real</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {formatarHorario(horarioChegadaReal)} <span className="text-xs text-gray-500">({formatarData(horarioChegadaReal)})</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Seção 3: Motorista, Operador e Rota */}
        <div className="flex-1 border-l border-gray-200 dark:border-gray-700 pl-4">
          {/* Motorista e Operador Responsável */}
          {showDriverInfo && (
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Motorista</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{truck.motorista}</p>
                </div>
              </div>
              {truck.operadorResponsavel && (
                <div className="flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Operador Responsável</p>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{truck.operadorResponsavel}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rota */}
          {showLocationInfo && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Origem</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {truck.origem}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Destino</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {truck.destino}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progresso (se em trânsito) */}
          {truck.status === 'em_transito' && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Progresso</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {truck.progresso}%
                </span>
              </div>
              <Progress value={truck.progresso} className="h-2" />
            </div>
          )}
        </div>

        {/* Seção 4: Informações da Carga, Pallets e Combustível */}
        <div className="flex flex-col gap-3 lg:w-48 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 pl-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Carga</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {truck.carga.peso / 1000}t
              </p>
            </div>
          </div>

          {/* Contador de Pallets */}
          {truck.pallets && (truck.pallets.carga || truck.pallets.descarga) ? (
            <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1.5 mb-1.5">
                <PackageOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Pallets</p>
              </div>
              <div className="space-y-1">
                {truck.pallets.carga !== undefined && truck.pallets.carga > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Carga:</span>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                      {truck.pallets.carga}
                    </span>
                  </div>
                )}
                {truck.pallets.descarga !== undefined && truck.pallets.descarga > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Descarga:</span>
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                      {truck.pallets.descarga}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
          
          {truck.temperatura !== undefined && (
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Temp.</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {truck.temperatura}°C
                </p>
              </div>
            </div>
          )}

          {/* Combustível */}
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Combustível</span>
                <span className={`text-xs font-semibold ${
                  truck.combustivel < 30 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {truck.combustivel}%
                </span>
              </div>
              <Progress 
                value={truck.combustivel} 
                className={`h-1.5 ${truck.combustivel < 30 ? '[&>div]:bg-red-600' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Botão de Edição */}
        {canEdit && onEdit && (
          <div className="flex items-center lg:w-12 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(truck)}
              className="h-10 w-10 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-110"
              title="Editar informações"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
