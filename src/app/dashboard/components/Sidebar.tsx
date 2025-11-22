'use client';

import { useState, useEffect } from 'react';
import { TruckStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Plus,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type FilterValue = TruckStatus | 'todos';

interface SidebarProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  filterCounts: Record<string, number>;
  canManageFilters?: boolean;
}

interface FilterItem {
  label: string;
  value: FilterValue;
  icon: React.ElementType;
  color: string;
  hoverColor: string;
  activeColor: string;
  keywords?: string[];
}

interface SearchResult {
  type: 'filter' | 'section';
  label: string;
  value: FilterValue | string;
  description?: string;
  keywords: string[];
}

export function Sidebar({ 
  activeFilter, 
  onFilterChange, 
  filterCounts,
  canManageFilters = false 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showNotFound, setShowNotFound] = useState(false);

  const defaultFilters: FilterItem[] = [
    { 
      label: 'Todos', 
      value: 'todos', 
      icon: Truck,
      color: 'text-gray-600 dark:text-gray-400',
      hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      activeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      keywords: ['todos', 'todas', 'galeras', 'veículos', 'caminhões', 'total']
    },
    { 
      label: 'Em Trânsito', 
      value: 'em_transito', 
      icon: Navigation,
      color: 'text-blue-600 dark:text-blue-400',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
      activeColor: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
      keywords: ['trânsito', 'transito', 'viagem', 'rota', 'caminho', 'movimento', 'andamento']
    },
    { 
      label: 'Disponíveis', 
      value: 'disponivel', 
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      hoverColor: 'hover:bg-green-50 dark:hover:bg-green-950/30',
      activeColor: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300',
      keywords: ['disponível', 'disponivel', 'livre', 'pronto', 'aguardando', 'parado']
    },
    { 
      label: 'Carregando', 
      value: 'carregando', 
      icon: Package,
      color: 'text-yellow-600 dark:text-yellow-400',
      hoverColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/30',
      activeColor: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300',
      keywords: ['carregando', 'carga', 'carregamento', 'enchendo', 'abastecendo']
    },
    { 
      label: 'Descarregando', 
      value: 'descarregando', 
      icon: PackageOpen,
      color: 'text-orange-600 dark:text-orange-400',
      hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-950/30',
      activeColor: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300',
      keywords: ['descarregando', 'descarga', 'descarregamento', 'esvaziando', 'entrega']
    },
    { 
      label: 'Manutenção', 
      value: 'manutencao', 
      icon: Wrench,
      color: 'text-red-600 dark:text-red-400',
      hoverColor: 'hover:bg-red-50 dark:hover:bg-red-950/30',
      activeColor: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300',
      keywords: ['manutenção', 'manutencao', 'reparo', 'conserto', 'oficina', 'quebrado', 'problema']
    },
  ];

  // Conteúdos disponíveis para busca
  const searchableContent: SearchResult[] = [
    ...defaultFilters.map(filter => ({
      type: 'filter' as const,
      label: filter.label,
      value: filter.value,
      description: `Filtrar galeras por status: ${filter.label}`,
      keywords: filter.keywords || []
    })),
    {
      type: 'section',
      label: 'Utilizadores',
      value: 'users',
      description: 'Gerenciar usuários do sistema',
      keywords: ['utilizadores', 'usuarios', 'usuários', 'users', 'pessoas', 'equipe', 'time']
    },
    {
      type: 'section',
      label: 'Otimizar Rotas',
      value: 'optimize',
      description: 'Otimizar rotas de entrega',
      keywords: ['otimizar', 'rotas', 'otimização', 'melhorar', 'eficiência', 'trajeto']
    },
    {
      type: 'section',
      label: 'Importar Excel',
      value: 'import',
      description: 'Importar dados de planilha',
      keywords: ['importar', 'excel', 'planilha', 'arquivo', 'dados', 'upload']
    }
  ];

  // Busca inteligente com sugestões
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowNotFound(false);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = searchableContent.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(query);
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      const descriptionMatch = item.description?.toLowerCase().includes(query);
      
      return labelMatch || keywordMatch || descriptionMatch;
    });

    setSearchResults(results);
    setShowNotFound(results.length === 0 && query.length > 2);
    setSelectedIndex(0);
  }, [searchQuery]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchDialogOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Enter' && searchResults.length > 0) {
        e.preventDefault();
        handleSelectResult(searchResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchDialogOpen, searchResults, selectedIndex]);

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'filter') {
      onFilterChange(result.value as FilterValue);
      setSearchDialogOpen(false);
      setSearchQuery('');
      console.log('✅ Navegado para filtro:', result.label);
    } else if (result.type === 'section') {
      // Aqui você pode adicionar navegação para outras seções
      console.log('🔍 Seção selecionada:', result.label);
      setSearchDialogOpen(false);
      setSearchQuery('');
    }
  };

  const handleOpenSearch = () => {
    setSearchDialogOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    setShowNotFound(false);
    setSelectedIndex(0);
  };

  return (
    <>
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
          {defaultFilters.map((filter) => {
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

        {/* Footer da Sidebar - Busca Inteligente */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Button
              variant="outline"
              className="w-full justify-start text-sm border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
              onClick={handleOpenSearch}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Filtro
            </Button>
          </div>
        )}
      </aside>

      {/* Dialog de Busca Inteligente */}
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Search className="w-4 h-4 text-white" />
              </div>
              Busca Inteligente
            </DialogTitle>
            <DialogDescription>
              Digite uma palavra-chave para encontrar filtros, seções ou conteúdos específicos
            </DialogDescription>
          </DialogHeader>

          {/* Campo de Busca */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Digite sua palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Resultados da Busca */}
          <div className="max-h-[400px] overflow-y-auto border-t border-gray-200 dark:border-gray-800">
            {searchQuery.trim() === '' && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  Digite para começar a buscar
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Use ↑↓ para navegar e Enter para selecionar
                </p>
              </div>
            )}

            {searchQuery.trim() !== '' && searchResults.length > 0 && (
              <div className="py-2">
                {searchResults.map((result, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = result.type === 'filter' 
                    ? defaultFilters.find(f => f.value === result.value)?.icon || Search
                    : Search;

                  return (
                    <button
                      key={`${result.type}-${result.value}`}
                      onClick={() => handleSelectResult(result)}
                      className={cn(
                        "w-full flex items-start gap-3 px-6 py-3 transition-colors text-left",
                        isSelected 
                          ? "bg-emerald-50 dark:bg-emerald-950/30" 
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg mt-0.5",
                        isSelected 
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {result.label}
                        </p>
                        {result.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {result.description}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                          Enter ↵
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {showNotFound && (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3">
                  <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Nenhum resultado encontrado
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Não encontramos nada para "{searchQuery}"
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Tente usar palavras-chave diferentes ou mais genéricas
                </p>
              </div>
            )}
          </div>

          {/* Dicas de Uso */}
          {searchQuery.trim() === '' && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                💡 Exemplos de busca:
              </p>
              <div className="flex flex-wrap gap-2">
                {['trânsito', 'disponível', 'manutenção', 'usuários', 'rotas'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchQuery(example)}
                    className="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
