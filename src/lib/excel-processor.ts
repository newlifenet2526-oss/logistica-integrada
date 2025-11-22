import * as XLSX from 'xlsx';

export interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

export interface ProcessedData {
  headers: string[];
  rows: ExcelRow[];
  totalRows: number;
  fileName: string;
}

export interface ImportResult {
  success: boolean;
  data?: ProcessedData;
  error?: string;
}

/**
 * Processa arquivo Excel e retorna dados estruturados
 */
export async function processExcelFile(file: File): Promise<ImportResult> {
  try {
    // Validar tipo de arquivo
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return {
        success: false,
        error: 'Formato de arquivo inválido. Use .xlsx, .xls ou .csv',
      };
    }

    // Validar tamanho (máx 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Arquivo muito grande. Tamanho máximo: 10MB',
      };
    }

    // Ler arquivo
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Pegar primeira planilha
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Converter para JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: null,
      blankrows: false 
    }) as any[][];

    if (jsonData.length === 0) {
      return {
        success: false,
        error: 'Planilha vazia ou sem dados válidos',
      };
    }

    // Extrair headers (primeira linha)
    const headers = jsonData[0].map((h: any) => String(h || '').trim());
    
    // Validar headers
    if (headers.length === 0 || headers.every(h => !h)) {
      return {
        success: false,
        error: 'Planilha sem cabeçalhos válidos',
      };
    }

    // Processar linhas de dados
    const rows: ExcelRow[] = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowData: ExcelRow = {};
      
      headers.forEach((header, index) => {
        const value = row[index];
        rowData[header] = value !== undefined && value !== null ? value : null;
      });

      // Adicionar apenas linhas com pelo menos um valor não-nulo
      if (Object.values(rowData).some(v => v !== null && v !== '')) {
        rows.push(rowData);
      }
    }

    if (rows.length === 0) {
      return {
        success: false,
        error: 'Nenhum dado válido encontrado na planilha',
      };
    }

    return {
      success: true,
      data: {
        headers,
        rows,
        totalRows: rows.length,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error('Erro ao processar Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao processar arquivo',
    };
  }
}

/**
 * Mapeia dados do Excel para registros de galeras
 */
export function mapToTruckRecords(data: ProcessedData): any[] {
  const trucks: any[] = [];

  data.rows.forEach((row, index) => {
    try {
      // Tentar mapear campos comuns
      const truck = {
        id: row['ID'] || row['id'] || `imported-${index + 1}`,
        placa: row['Placa'] || row['placa'] || row['PLACA'] || '',
        motorista: row['Motorista'] || row['motorista'] || row['MOTORISTA'] || 'Não informado',
        status: normalizeStatus(row['Status'] || row['status'] || row['STATUS']),
        localizacao: row['Localização'] || row['localizacao'] || row['LOCALIZAÇÃO'] || 'Não informado',
        destino: row['Destino'] || row['destino'] || row['DESTINO'] || '',
        carga: row['Carga'] || row['carga'] || row['CARGA'] || '',
        progresso: parseFloat(String(row['Progresso'] || row['progresso'] || row['PROGRESSO'] || 0)),
        ultimaAtualizacao: row['Última Atualização'] || row['ultimaAtualizacao'] || new Date().toISOString(),
      };

      trucks.push(truck);
    } catch (error) {
      console.warn(`Erro ao processar linha ${index + 1}:`, error);
    }
  });

  return trucks;
}

/**
 * Normaliza status para valores válidos do sistema
 */
function normalizeStatus(status: any): string {
  const statusStr = String(status || '').toLowerCase().trim();
  
  const statusMap: { [key: string]: string } = {
    'em transito': 'em_transito',
    'em trânsito': 'em_transito',
    'transito': 'em_transito',
    'disponivel': 'disponivel',
    'disponível': 'disponivel',
    'livre': 'disponivel',
    'carregando': 'carregando',
    'carga': 'carregando',
    'manutencao': 'manutencao',
    'manutenção': 'manutencao',
    'reparo': 'manutencao',
  };

  return statusMap[statusStr] || 'disponivel';
}

/**
 * Valida estrutura mínima para importação de galeras
 */
export function validateTruckData(data: ProcessedData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = ['placa', 'motorista'];

  // Verificar se headers contêm campos obrigatórios (case-insensitive)
  const headersLower = data.headers.map(h => h.toLowerCase());
  
  requiredFields.forEach(field => {
    if (!headersLower.some(h => h.includes(field))) {
      errors.push(`Campo obrigatório ausente: ${field}`);
    }
  });

  // Validar dados das linhas
  if (data.rows.length === 0) {
    errors.push('Nenhum registro encontrado');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
