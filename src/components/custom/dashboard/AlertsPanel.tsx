'use client';

import { Alert } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wrench, Navigation, Info, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  atraso: { 
    icon: AlertTriangle, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-900'
  },
  manutencao: { 
    icon: Wrench, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-900'
  },
  rota_alterada: { 
    icon: Navigation, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-900'
  },
  urgente: { 
    icon: AlertCircle, 
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-900'
  },
  info: { 
    icon: Info, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    borderColor: 'border-gray-200 dark:border-gray-700'
  }
};

const priorityConfig = {
  critica: { label: 'Crítica', color: 'bg-red-600' },
  alta: { label: 'Alta', color: 'bg-orange-600' },
  media: { label: 'Média', color: 'bg-yellow-600' },
  baixa: { label: 'Baixa', color: 'bg-blue-600' }
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const alertsNaoLidas = alerts.filter(a => !a.lida);

  return (
    <Card className="p-4 sm:p-6 border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Alertas Ativos
        </h2>
        {alertsNaoLidas.length > 0 && (
          <Badge className="bg-red-600 text-white border-0">
            {alertsNaoLidas.length} novos
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum alerta ativo</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const config = alertConfig[alert.tipo];
              const priority = priorityConfig[alert.prioridade];
              const Icon = config.icon;
              const timestamp = new Date(alert.timestamp);
              const hora = timestamp.toLocaleTimeString('pt-PT', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor} 
                    ${!alert.lida ? 'shadow-md' : 'opacity-75'} 
                    transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {alert.titulo}
                        </h3>
                        <Badge className={`${priority.color} text-white border-0 text-xs`}>
                          {priority.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {alert.mensagem}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{hora}</span>
                        {alert.truckId && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{alert.truckId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
