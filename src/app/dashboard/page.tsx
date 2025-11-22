'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { canManageUsers } from '@/lib/permissions';
import { useState, useMemo } from 'react';
import { MetricsCard } from '@/components/custom/dashboard/MetricsCard';
import { TruckCard } from '@/components/custom/dashboard/TruckCard';
import { AlertsPanel } from '@/components/custom/dashboard/AlertsPanel';
import { ExcelImporter } from '@/app/dashboard/components/ExcelImporter';
import { EditRecordModal } from '@/app/dashboard/components/EditRecordModal';
import { PermissionsConfigModal } from '@/app/dashboard/components/PermissionsConfigModal';
import { NotificationSettingsModal } from '@/app/dashboard/components/NotificationSettingsModal';
import { DateFilter } from '@/app/dashboard/components/DateFilter';
import { Sidebar, FilterValue } from '@/app/dashboard/components/Sidebar';
import { mockTrucks, mockAlerts, mockMetrics } from '@/lib/mock-data';
import { Truck, TruckStatus } from '@/lib/types';
import { 
  Truck as TruckIcon, 
  Package, 
  Navigation,
  TrendingUp,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  Upload,
  FileSpreadsheet,
  Settings,
  Shield,
  PackageOpen,
  PackageCheck,
  Plus,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { operatorPermissions, canConfigurePermissions } = usePermissions();
  const [trucks, setTrucks] = useState(mockTrucks);
  const [filtroStatus, setFiltroStatus] = useState<FilterValue>('todos');
  const [filtroData, setFiltroData] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Inicializar horário
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
  }, []);

  // Atualizar horário
  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, [mounted]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleImportComplete = (importedTrucks: any[]) => {
    // Adicionar trucks importados à lista existente
    setTrucks(prev => [...prev, ...importedTrucks]);
    setImportDialogOpen(false);
    
    // Feedback visual (você pode adicionar um toast aqui)
    console.log(`${importedTrucks.length} galeras importadas com sucesso!`);
  };

  const handleEditTruck = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsNewRecord(false);
    setEditModalOpen(true);
  };

  const handleAddNewTruck = () => {
    setSelectedTruck(null);
    setIsNewRecord(true);
    setEditModalOpen(true);
  };

  const handleSaveTruck = (updatedTruck: Truck) => {
    if (isNewRecord) {
      // Adicionar nova galera
      setTrucks(prev => [...prev, updatedTruck]);
      console.log('✅ Nova galera adicionada com sucesso!');
    } else {
      // Atualizar galera existente
      setTrucks(prev => 
        prev.map(t => t.id === updatedTruck.id ? updatedTruck : t)
      );
      console.log('✅ Galera atualizada com sucesso!');
    }
    setEditModalOpen(false);
    setSelectedTruck(null);
    setIsNewRecord(false);
  };

  const handleDateFilterChange = (date: string | null) => {
    setFiltroData(date);
  };

  const handleFilterChange = (filter: FilterValue) => {
    setFiltroStatus(filter);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Verificar permissões baseadas no role
  const isOperator = user.role === 'operador';
  const canManagePermissions = canConfigurePermissions(user.role);
  const canManageUsersPermission = canManageUsers(user.role);
  
  // Aplicar permissões para operadores
  const effectivePermissions = isOperator ? operatorPermissions : {
    showMetrics: true,
    showAlerts: true,
    showFilters: true,
    showTruckDetails: true,
    canEdit: true,
    canImport: true,
    canExport: true,
    canDelete: true,
    showDriverInfo: true,
    showLocationInfo: true,
    showStatusHistory: true,
  };

  // Aplicar filtros (status + data)
  let trucksFiltrados = trucks;

  // Filtro de status
  if (filtroStatus !== 'todos') {
    trucksFiltrados = trucksFiltrados.filter(t => t.status === filtroStatus);
  }

  // Filtro de data
  if (filtroData) {
    trucksFiltrados = trucksFiltrados.filter(t => t.dataRegistro === filtroData);
  }

  // Organizar por categorias
  const trucksCarregando = trucksFiltrados.filter(t => t.status === 'carregando');
  const trucksDescarregando = trucksFiltrados.filter(t => t.status === 'descarregando');
  const trucksOutros = trucksFiltrados.filter(t => t.status !== 'carregando' && t.status !== 'descarregando');

  // Calcular métricas dinâmicas baseadas nos dados reais
  const metricsData = useMemo(() => {
    const totalGaleras = trucks.length;
    const emTransito = trucks.filter(t => t.status === 'em_transito').length;
    
    // Calcular entregas em 24h (galeras que estão em trânsito ou descarregando)
    const entregas24h = trucks.filter(t => 
      t.status === 'em_transito' || t.status === 'descarregando'
    ).length;
    
    // Calcular eficiência (baseado em galeras disponíveis vs total)
    const disponiveis = trucks.filter(t => t.status === 'disponivel').length;
    const eficiencia = totalGaleras > 0 
      ? Math.round((disponiveis / totalGaleras) * 100) 
      : 0;

    return {
      totalGaleras,
      emTransito,
      entregas24h,
      eficiencia
    };
  }, [trucks]);

  // Contadores para a sidebar
  const filterCounts = {
    'todos': trucks.length,
    'em_transito': trucks.filter(t => t.status === 'em_transito').length,
    'disponivel': trucks.filter(t => t.status === 'disponivel').length,
    'carregando': trucks.filter(t => t.status === 'carregando').length,
    'descarregando': trucks.filter(t => t.status === 'descarregando').length,
    'manutencao': trucks.filter(t => t.status === 'manutencao').length,
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      coordenador: 'Coordenador',
      operador: 'Operador',
      motorista: 'Motorista',
      shunter: 'Shunter',
      supervisor: 'Supervisor'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Jerónimo Martins
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Sistema de Gestão Logística
                </p>
              </div>
            </div>

            {/* Menu Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Botão Otimização de Rotas */}
              <Button
                onClick={() => router.push('/dashboard/rotas')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Otimizar Rotas
              </Button>

              {/* Botão Importar Excel */}
              {effectivePermissions.canImport && (
                <Button
                  onClick={() => setImportDialogOpen(true)}
                  variant="outline"
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Excel
                </Button>
              )}

              {/* Botão Adicionar Galera */}
              {effectivePermissions.canEdit && (
                <Button
                  onClick={handleAddNewTruck}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Galera
                </Button>
              )}

              {/* Botão Gestão de Utilizadores */}
              {canManageUsersPermission && (
                <Button
                  onClick={() => router.push('/dashboard/users')}
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Utilizadores
                </Button>
              )}

              {/* Botão Configurar Permissões */}
              {canManagePermissions && (
                <Button
                  onClick={() => setPermissionsModalOpen(true)}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Permissões
                </Button>
              )}

              {/* Botão Tema */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {/* Botão Notificações */}
              <Button 
                variant="outline" 
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <Bell className="h-5 w-5" />
                {mockAlerts.filter(a => !a.lida).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>

              {/* Menu do Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="h-10 w-10 ring-2 ring-emerald-500/20">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                        {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.nome}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setNotificationSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl">
                <Avatar className="w-11 h-11 ring-2 ring-emerald-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                    {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.nome}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </div>

              {/* Botão Otimização de Rotas Mobile */}
              <Button
                onClick={() => {
                  router.push('/dashboard/rotas');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Otimizar Rotas
              </Button>

              {effectivePermissions.canImport && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950" 
                  onClick={() => {
                    setImportDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </Button>
              )}

              {effectivePermissions.canEdit && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950" 
                  onClick={() => {
                    handleAddNewTruck();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Galera
                </Button>
              )}

              {canManageUsersPermission && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950" 
                  onClick={() => {
                    router.push('/dashboard/users');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gestão de Utilizadores
                </Button>
              )}

              {canManagePermissions && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950" 
                  onClick={() => {
                    setPermissionsModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Configurar Permissões
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <><Moon className="mr-2 h-4 w-4" /> Modo Escuro</>
                  ) : (
                    <><Sun className="mr-2 h-4 w-4" /> Modo Claro</>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setShowAlerts(!showAlerts)}
                >
                  <Bell className="h-4 w-4" />
                  {mockAlerts.filter(a => !a.lida).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                onClick={() => setNotificationSettingsOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Vertical */}
      {effectivePermissions.showFilters && (
        <Sidebar
          activeFilter={filtroStatus}
          onFilterChange={handleFilterChange}
          filterCounts={filterCounts}
          canManageFilters={canManagePermissions}
        />
      )}

      <main className="ml-0 lg:ml-64 transition-all duration-300 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Métricas Dinâmicas */}
        {effectivePermissions.showMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <MetricsCard
              title="Total de Galeras"
              value={metricsData.totalGaleras}
              icon={TruckIcon}
              color="blue"
              trend={{ value: 8, isPositive: true }}
            />
            <MetricsCard
              title="Em Trânsito"
              value={metricsData.emTransito}
              icon={Navigation}
              color="green"
              trend={{ value: 12, isPositive: true }}
            />
            <MetricsCard
              title="Entregas 24h"
              value={metricsData.entregas24h}
              icon={Package}
              color="purple"
              trend={{ value: 5, isPositive: true }}
            />
            <MetricsCard
              title="Eficiência"
              value={`${metricsData.eficiencia}%`}
              icon={TrendingUp}
              color="orange"
              trend={{ value: 2.3, isPositive: true }}
            />
          </div>
        )}

        {/* Filtro de Data */}
        <DateFilter 
          onFilterChange={handleDateFilterChange}
          totalRecords={trucks.length}
          filteredRecords={trucksFiltrados.length}
        />

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Lista de Galeras */}
          {effectivePermissions.showTruckDetails && (
            <div className="lg:col-span-2 space-y-8">
              {/* Categoria: Galeras em Carga */}
              {trucksCarregando.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600">
                        <PackageOpen className="w-5 h-5 text-white" />
                      </div>
                      Galeras em Carga
                    </h2>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-lg shadow-yellow-500/30 px-3 py-1">
                      {trucksCarregando.length} galeras
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {trucksCarregando.map((truck) => (
                      <TruckCard 
                        key={truck.id} 
                        truck={truck}
                        onEdit={handleEditTruck}
                        canEdit={effectivePermissions.canEdit}
                        showDriverInfo={effectivePermissions.showDriverInfo}
                        showLocationInfo={effectivePermissions.showLocationInfo}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Categoria: Galeras em Descarga */}
              {trucksDescarregando.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                        <PackageCheck className="w-5 h-5 text-white" />
                      </div>
                      Galeras em Descarga
                    </h2>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg shadow-orange-500/30 px-3 py-1">
                      {trucksDescarregando.length} galeras
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {trucksDescarregando.map((truck) => (
                      <TruckCard 
                        key={truck.id} 
                        truck={truck}
                        onEdit={handleEditTruck}
                        canEdit={effectivePermissions.canEdit}
                        showDriverInfo={effectivePermissions.showDriverInfo}
                        showLocationInfo={effectivePermissions.showLocationInfo}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Outras Galeras */}
              {trucksOutros.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                      Outras Galeras
                    </h2>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/30 px-3 py-1">
                      {trucksOutros.length} galeras
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {trucksOutros.map((truck) => (
                      <TruckCard 
                        key={truck.id} 
                        truck={truck}
                        onEdit={handleEditTruck}
                        canEdit={effectivePermissions.canEdit}
                        showDriverInfo={effectivePermissions.showDriverInfo}
                        showLocationInfo={effectivePermissions.showLocationInfo}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem quando não há galeras */}
              {trucksFiltrados.length === 0 && (
                <div className="text-center py-12">
                  <TruckIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma galera encontrada com os filtros selecionados.</p>
                </div>
              )}
            </div>
          )}

          {/* Painel de Alertas - Exibido apenas quando botão é clicado */}
          {effectivePermissions.showAlerts && showAlerts && (
            <div className="lg:col-span-1">
              <AlertsPanel 
                alerts={mockAlerts} 
                onConfigureNotifications={() => setNotificationSettingsOpen(true)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Dialog de Importação */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ExcelImporter 
            onImportComplete={handleImportComplete}
            onClose={() => setImportDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <EditRecordModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTruck(null);
          setIsNewRecord(false);
        }}
        truck={selectedTruck}
        onSave={handleSaveTruck}
        userRole={user.role}
        userName={user.nome}
        isNewRecord={isNewRecord}
      />

      {/* Modal de Configuração de Permissões */}
      <PermissionsConfigModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
      />

      {/* Modal de Configuração de Notificações */}
      <NotificationSettingsModal
        isOpen={notificationSettingsOpen}
        onClose={() => setNotificationSettingsOpen(false)}
        userId={user.id}
        userEmail={user.email || ''}
      />
    </div>
  );
}
