'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface PermissionConfig {
  showMetrics: boolean;
  showAlerts: boolean;
  showFilters: boolean;
  showTruckDetails: boolean;
  canEdit: boolean;
  canImport: boolean;
  canExport: boolean;
  canDelete: boolean;
  showDriverInfo: boolean;
  showLocationInfo: boolean;
  showStatusHistory: boolean;
}

interface PermissionsContextType {
  operatorPermissions: PermissionConfig;
  updateOperatorPermissions: (permissions: Partial<PermissionConfig>) => void;
  resetToDefaults: () => void;
  canConfigurePermissions: (role: string) => boolean;
}

const defaultOperatorPermissions: PermissionConfig = {
  showMetrics: true,
  showAlerts: true,
  showFilters: true,
  showTruckDetails: true,
  canEdit: false,
  canImport: false,
  canExport: false,
  canDelete: false,
  showDriverInfo: true,
  showLocationInfo: true,
  showStatusHistory: false,
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [operatorPermissions, setOperatorPermissions] = useState<PermissionConfig>(defaultOperatorPermissions);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Carregar permissões salvas do localStorage
    const savedPermissions = localStorage.getItem('operator_permissions');
    if (savedPermissions) {
      try {
        setOperatorPermissions(JSON.parse(savedPermissions));
      } catch (error) {
        console.error('Erro ao carregar permissões:', error);
      }
    }
  }, []);

  const updateOperatorPermissions = (permissions: Partial<PermissionConfig>) => {
    const newPermissions = { ...operatorPermissions, ...permissions };
    setOperatorPermissions(newPermissions);
    localStorage.setItem('operator_permissions', JSON.stringify(newPermissions));
  };

  const resetToDefaults = () => {
    setOperatorPermissions(defaultOperatorPermissions);
    localStorage.setItem('operator_permissions', JSON.stringify(defaultOperatorPermissions));
  };

  const canConfigurePermissions = (role: string) => {
    return role === 'admin' || role === 'coordenador';
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PermissionsContext.Provider 
      value={{ 
        operatorPermissions, 
        updateOperatorPermissions, 
        resetToDefaults,
        canConfigurePermissions 
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions deve ser usado dentro de um PermissionsProvider');
  }
  return context;
}
