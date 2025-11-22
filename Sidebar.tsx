'use client';

import { useState } from 'react';
import { TruckStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Truck,
  Navigation,
  CheckCircle2,
  Package,
  PackageOpen,
  Wrench,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeFilter: TruckStatus | 'todos';
  onFilterChange: (filter: TruckStatus | 'todos') => void;
  filterCounts: Record<string, number>;
  canManageFilters?: boolean;
}

interface FilterItem {
  label: string;
  value: TruckStatus | 'todos';
  icon: React.ElementType;
  color: string;
  hoverColor: string;
  activeColor: string;
}

export function Sidebar({ 
  activeFilter, 
  onFilterChange, 
  filterCounts,
  canManageFilters = false 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filters: FilterItem[] = [
    { 
      label: 'Todos', 
      value: 'todos', 
      icon: Truck,
      color: 'text-gray-600 dark:text-gray-400',
      hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      activeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
    },
    { 
      label: 'Em Trânsito', 
      value: 'em_transito', 
      icon: Navigation,
      color: 'text-blue-600 dark:text-blue-400',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
      activeColor: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
    },
    { 
      label: 'Disponíveis', 
      value: 'disponivel', 
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      hoverColor: 'hover:bg-green-50 dark:hover:bg-green-950/30',
      activeColor: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300'
    },
    { 
      label: 'Carregando', 
      value: 'carregando', 
      icon: Package,
      color: 'text-yellow-600 dark:text-yellow-400',
      hoverColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/30',
      activeColor: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300'
    },
    { 
      label: 'Descarregando', 
      value: 'descarregando', 
      icon: PackageOpen,
      color: 'text-orange-600 dark:text-orange-400',
      hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-950/30',
      activeColor: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300'
    },
    { 
      label: 'Manutenção', 
      value: 'manutencao', 
      icon: Wrench,
      color: 'text-red-600 dark:text-red-400',
      hoverColor: 'hover:bg-red-50 dark:hover:bg-red-950/30',
      activeColor: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
    },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 shadow-lg",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Filtros
            </h2>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Lista de Filtros */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-120px)]">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.value;
          const count = filterCounts[filter.value] || 0;

          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive ? filter.activeColor : `${filter.color} ${filter.hoverColor}`,
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? filter.label : undefined}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "opacity-100" : "opacity-70"
              )} />
              
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">
                    {filter.label}
                  </span>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      isActive 
                        ? "bg-white/20 dark:bg-black/20" 
                        : "bg-gray-100 dark:bg-gray-800"
                    )}
                  >
                    {count}
                  </Badge>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer da Sidebar - Adicionar Filtro (Admin/Supervisor) */}
      {canManageFilters && !isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Button
            variant="outline"
            className="w-full justify-start text-sm border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Filtro
          </Button>
        </div>
      )}
    </aside>
  );
}
