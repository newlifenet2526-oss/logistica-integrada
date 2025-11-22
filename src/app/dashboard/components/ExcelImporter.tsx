'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { processExcelFile, validateTruckData, mapToTruckRecords, type ProcessedData } from '@/lib/excel-processor';

interface ExcelImporterProps {
  onImportComplete?: (data: any[]) => void;
  onClose?: () => void;
}

export function ExcelImporter({ onImportComplete, onClose }: ExcelImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProcessedData(null);

    try {
      const result = await processExcelFile(file);

      if (!result.success || !result.data) {
        setError(result.error || 'Erro ao processar arquivo');
        return;
      }

      // Validar dados
      const validation = validateTruckData(result.data);
      if (!validation.valid) {
        setError(`Dados inválidos: ${validation.errors.join(', ')}`);
        return;
      }

      setProcessedData(result.data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (processedData && onImportComplete) {
      const trucks = mapToTruckRecords(processedData);
      onImportComplete(trucks);
      setSuccess(false);
      setProcessedData(null);
      if (onClose) onClose();
    }
  };

  const handleReset = () => {
    setProcessedData(null);
    setError(null);
    setSuccess(false);
  };

  const downloadTemplate = () => {
    // Criar template CSV
    const template = `Placa,Motorista,Status,Localização,Destino,Carga,Progresso
ABC-1234,João Silva,em transito,Lisboa,Porto,Alimentos,75
XYZ-5678,Maria Santos,disponivel,Porto,Lisboa,Eletrônicos,0
DEF-9012,Pedro Costa,carregando,Braga,Faro,Bebidas,25`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_galeras.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Importar Planilha Excel
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Faça upload de arquivos .xlsx, .xls ou .csv com dados de galeras
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Template Download */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
              Primeira vez importando?
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Baixe nosso template para garantir que sua planilha tenha a estrutura correta
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate}
              className="mt-2 border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Upload Area */}
      {!processedData && !success && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
            ${isDragging 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 scale-105' 
              : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          <div className="space-y-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-16 h-16 mx-auto text-emerald-600 animate-spin" />
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Processando arquivo...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aguarde enquanto analisamos seus dados
                </p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 mx-auto flex items-center justify-center">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Arraste seu arquivo aqui
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ou clique para selecionar
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Formatos aceitos: .xlsx, .xls, .csv (máx. 10MB)</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm">
                Erro ao processar arquivo
              </h3>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="mt-2 border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success Preview */}
      {success && processedData && (
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">
                  Arquivo processado com sucesso!
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                  {processedData.fileName}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Total de Registros
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {processedData.totalRows}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Campos Detectados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {processedData.headers.length}
                </p>
              </div>
            </div>

            {/* Headers Preview */}
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Campos identificados:
              </p>
              <div className="flex flex-wrap gap-2">
                {processedData.headers.map((header, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-white dark:bg-gray-800"
                  >
                    {header}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleConfirmImport}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar Importação
              </Button>
              <Button 
                variant="outline"
                onClick={handleReset}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!processedData && !error && !isProcessing && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">
            Campos esperados na planilha:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800">
                Obrigatório
              </Badge>
              <span className="text-gray-700 dark:text-gray-300">Placa</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800">
                Obrigatório
              </Badge>
              <span className="text-gray-700 dark:text-gray-300">Motorista</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Opcional</Badge>
              <span className="text-gray-700 dark:text-gray-300">Status</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Opcional</Badge>
              <span className="text-gray-700 dark:text-gray-300">Localização</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Opcional</Badge>
              <span className="text-gray-700 dark:text-gray-300">Destino</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Opcional</Badge>
              <span className="text-gray-700 dark:text-gray-300">Carga</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
