'use client';

import { useState, useEffect } from 'react';
import { MetricsCard } from '@/components/custom/dashboard/MetricsCard';
import { TruckCard } from '@/components/custom/dashboard/TruckCard';
import { AlertsPanel } from '@/components/custom/dashboard/AlertsPanel';
import { mockTrucks, mockAlerts, mockMetrics } from '@/lib/mock-data';
import { Truck, TruckStatus } from '@/lib/types';
import { 
  Truck as TruckIcon, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Navigation,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [trucks, setTrucks] = useState(mockTrucks);
  const [filtroStatus, setFiltroStatus] = useState<TruckStatus | 'todos'>('todos');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const trucksFiltrados = filtroStatus === 'todos' 
    ? trucks 
    : trucks.filter(t => t.status === filtroStatus);

  const filtros: { label: string; value: TruckStatus | 'todos'; count: number }[] = [
    { label: 'Todos', value: 'todos', count: trucks.length },
    { label: 'Em Trânsito', value: 'em_transito', count: trucks.filter(t => t.status === 'em_transito').length },
    { label: 'Disponíveis', value: 'disponivel', count: trucks.filter(t => t.status === 'disponivel').length },
    { label: 'Carregando', value: 'carregando', count: trucks.filter(t => t.status === 'carregando').length },
    { label: 'Manutenção', value: 'manutencao', count: trucks.filter(t => t.status === 'manutencao').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Jerónimo Martins Logística
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema de Gestão de Galeras
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentTime.toLocaleDateString('pt-PT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentTime.toLocaleTimeString('pt-PT')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricsCard
            title="Total de Galeras"
            value={mockMetrics.totalGaleras}
            icon={TruckIcon}
            color="blue"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricsCard
            title="Em Trânsito"
            value={mockMetrics.emTransito}
            icon={Navigation}
            color="green"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricsCard
            title="Entregas 24h"
            value={mockMetrics.entregas24h}
            icon={Package}
            color="purple"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricsCard
            title="Eficiência Média"
            value={`${mockMetrics.eficienciaMedia}%`}
            icon={TrendingUp}
            color="orange"
            trend={{ value: 2.3, isPositive: true }}
          />
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filtrar Galeras
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filtros.map((filtro) => (
              <Button
                key={filtro.value}
                variant={filtroStatus === filtro.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroStatus(filtro.value)}
                className={`${
                  filtroStatus === filtro.value
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                {filtro.label}
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-white/20 text-current border-0"
                >
                  {filtro.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Lista de Galeras */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Galeras Ativas
              </h2>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                {trucksFiltrados.length} galeras
              </Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {trucksFiltrados.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>
            {trucksFiltrados.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <TruckIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhuma galera encontrada com este filtro
                </p>
              </div>
            )}
          </div>

          {/* Painel de Alertas */}
          <div className="lg:col-span-1">
            <AlertsPanel alerts={mockAlerts} />
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockMetrics.entregas24h}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Entregas Hoje</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
            <Navigation className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockMetrics.kmPercorridos.toLocaleString('pt-PT')} km
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Percorridos Hoje</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockMetrics.alertasAtivos}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Alertas Ativos</p>
          </div>
        </div>
      </main>
    </div>
  );
}
