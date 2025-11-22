'use client';

import { useState } from 'react';
import { Calendar, X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateFilterProps {
  onFilterChange: (date: string | null) => void;
  totalRecords: number;
  filteredRecords: number;
}

export function DateFilter({ onFilterChange, totalRecords, filteredRecords }: DateFilterProps) {
  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Gerar opções de dias (1-31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  // Meses
  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  // Gerar anos (últimos 5 anos + próximos 2)
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => (currentYear - 5 + i).toString());

  const handleApplyFilter = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) {
      alert('Por favor, selecione dia, mês e ano para filtrar.');
      return;
    }

    const dateString = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    onFilterChange(dateString);
    setIsActive(true);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
    onFilterChange(null);
    setIsActive(false);
  };

  const handleTodayFilter = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    
    const dateString = `${year}-${month}-${day}`;
    onFilterChange(dateString);
    setIsActive(true);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Ícone de Calendário Discreto */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`
              relative transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <Calendar className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
            <span className="text-sm font-medium">
              {isActive && selectedDay && selectedMonth && selectedYear
                ? `${selectedDay}/${selectedMonth}/${selectedYear}`
                : 'Filtrar por Data'
              }
            </span>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            {isActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-800">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Filtro de Data
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Selecione dia, mês e ano
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Dia */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Dia
                </Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="h-9 text-sm bg-gray-50 dark:bg-gray-800">
                    <SelectValue placeholder="DD" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mês */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Mês
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-9 text-sm bg-gray-50 dark:bg-gray-800">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ano */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Ano
                </Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-9 text-sm bg-gray-50 dark:bg-gray-800">
                    <SelectValue placeholder="AAAA" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleApplyFilter}
                size="sm"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Search className="w-3.5 h-3.5 mr-2" />
                Aplicar Filtro
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleTodayFilter}
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  Hoje
                </Button>

                {isActive && (
                  <Button
                    onClick={handleClearFilter}
                    variant="outline"
                    size="sm"
                    className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Contador de Resultados */}
            {isActive && (
              <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>📊 Resultados:</strong> {filteredRecords} de {totalRecords} galeras
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Badge de Filtro Ativo (opcional, fora do popover) */}
      {isActive && (
        <Badge 
          variant="outline" 
          className="bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
        >
          Filtro Ativo: {selectedDay}/{selectedMonth}/{selectedYear}
        </Badge>
      )}
    </div>
  );
}
