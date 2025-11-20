'use client';

import { Truck } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Truck as TruckIcon, MapPin, Package, Thermometer, Fuel, User } from 'lucide-react';

interface TruckCardProps {
  truck: Truck;
}

const statusConfig = {
  em_transito: { label: 'Em Trânsito', color: 'bg-blue-500' },
  carregando: { label: 'Carregando', color: 'bg-yellow-500' },
  descarregando: { label: 'Descarregando', color: 'bg-orange-500' },
  parado: { label: 'Parado', color: 'bg-gray-500' },
  manutencao: { label: 'Manutenção', color: 'bg-red-500' },
  disponivel: { label: 'Disponível', color: 'bg-green-500' }
};

export function TruckCard({ truck }: TruckCardProps) {
  const status = statusConfig[truck.status];
  const chegadaPrevista = new Date(truck.horarios.chegadaPrevista);
  const horaChegada = chegadaPrevista.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
            <TruckIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {truck.id}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{truck.placa}</p>
          </div>
        </div>
        <Badge className={`${status.color} text-white border-0`}>
          {status.label}
        </Badge>
      </div>

      {/* Motorista */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <User className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700 dark:text-gray-300">{truck.motorista}</span>
      </div>

      {/* Rota */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-start gap-2 mb-2">
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

      {/* Progresso */}
      {truck.status === 'em_transito' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              {truck.progresso}%
            </span>
          </div>
          <Progress value={truck.progresso} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Chegada prevista: {horaChegada}
          </p>
        </div>
      )}

      {/* Informações da Carga */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Carga</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {truck.carga.peso / 1000}t
            </p>
          </div>
        </div>
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
      </div>

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
    </Card>
  );
}
