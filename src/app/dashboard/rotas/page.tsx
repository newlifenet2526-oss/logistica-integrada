'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Truck, 
  Clock, 
  TrendingDown, 
  Route,
  ArrowLeft,
  Play,
  Navigation,
  Package,
  Loader2,
  Edit2,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Tipos
interface Loja {
  id: string;
  nome: string;
  coordenadas: { lat: number; lng: number };
  janelaTempo: { inicio: string; fim: string };
  demanda: number;
}

interface Veiculo {
  id: string;
  capacidade: number;
  disponivel: boolean;
}

interface Rota {
  veiculoId: string;
  sequenciaEntregas: string[];
  tempoTotal: number;
  distanciaTotal: number;
  custoEstimado: number;
}

// Dados mock - Lojas Pingo Doce no Algarve e Alentejo
const lojasMock: Loja[] = [
  { id: 'L001', nome: 'Pingo Doce Albufeira', coordenadas: { lat: 37.0887, lng: -8.2508 }, janelaTempo: { inicio: '08:00', fim: '12:00' }, demanda: 150 },
  { id: 'L002', nome: 'Pingo Doce Portimão', coordenadas: { lat: 37.1364, lng: -8.5376 }, janelaTempo: { inicio: '09:00', fim: '13:00' }, demanda: 200 },
  { id: 'L003', nome: 'Pingo Doce Lagos', coordenadas: { lat: 37.1028, lng: -8.6742 }, janelaTempo: { inicio: '10:00', fim: '14:00' }, demanda: 180 },
  { id: 'L004', nome: 'Pingo Doce Faro', coordenadas: { lat: 37.0194, lng: -7.9304 }, janelaTempo: { inicio: '08:30', fim: '12:30' }, demanda: 220 },
  { id: 'L005', nome: 'Pingo Doce Olhão', coordenadas: { lat: 37.0272, lng: -7.8408 }, janelaTempo: { inicio: '09:00', fim: '13:00' }, demanda: 160 },
  { id: 'L006', nome: 'Pingo Doce Tavira', coordenadas: { lat: 37.1271, lng: -7.6484 }, janelaTempo: { inicio: '10:00', fim: '14:00' }, demanda: 140 },
  { id: 'L007', nome: 'Pingo Doce Évora', coordenadas: { lat: 38.5714, lng: -7.9087 }, janelaTempo: { inicio: '08:00', fim: '12:00' }, demanda: 250 },
  { id: 'L008', nome: 'Pingo Doce Beja', coordenadas: { lat: 38.0151, lng: -7.8632 }, janelaTempo: { inicio: '09:00', fim: '13:00' }, demanda: 190 },
];

const veiculosMock: Veiculo[] = [
  { id: 'V001', capacidade: 500, disponivel: true },
  { id: 'V002', capacidade: 500, disponivel: true },
  { id: 'V003', capacidade: 400, disponivel: true },
  { id: 'V004', capacidade: 400, disponivel: true },
];

export default function RotasPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [lojas, setLojas] = useState<Loja[]>(lojasMock);
  const [veiculos, setVeiculos] = useState<Veiculo[]>(veiculosMock);
  const [rotasOtimizadas, setRotasOtimizadas] = useState<Rota[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  // Estados de edição
  const [editingLoja, setEditingLoja] = useState<string | null>(null);
  const [editingVeiculo, setEditingVeiculo] = useState<string | null>(null);
  const [editFormLoja, setEditFormLoja] = useState<Loja | null>(null);
  const [editFormVeiculo, setEditFormVeiculo] = useState<Veiculo | null>(null);

  // Verificar permissões
  const canEdit = user?.role === 'admin' || user?.role === 'coordenador';

  // Algoritmo de otimização simplificado (Nearest Neighbor)
  const calcularDistancia = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const otimizarRotas = () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);

    // Simular processamento
    setTimeout(() => {
      const baseAlgoz = { lat: 37.1333, lng: -8.2833 }; // Coordenadas de Algoz
      const rotasCalculadas: Rota[] = [];
      const lojasRestantes = [...lojas];
      
      veiculos.filter(v => v.disponivel).forEach((veiculo) => {
        const rota: Rota = {
          veiculoId: veiculo.id,
          sequenciaEntregas: [],
          tempoTotal: 0,
          distanciaTotal: 0,
          custoEstimado: 0,
        };

        let capacidadeRestante = veiculo.capacidade;
        let posicaoAtual = baseAlgoz;

        // Algoritmo Nearest Neighbor
        while (lojasRestantes.length > 0 && capacidadeRestante > 0) {
          let lojaMaisProxima: Loja | null = null;
          let menorDistancia = Infinity;
          let indexLoja = -1;

          lojasRestantes.forEach((loja, index) => {
            if (loja.demanda <= capacidadeRestante) {
              const distancia = calcularDistancia(posicaoAtual, loja.coordenadas);
              if (distancia < menorDistancia) {
                menorDistancia = distancia;
                lojaMaisProxima = loja;
                indexLoja = index;
              }
            }
          });

          if (lojaMaisProxima) {
            rota.sequenciaEntregas.push(lojaMaisProxima.id);
            rota.distanciaTotal += menorDistancia;
            rota.tempoTotal += menorDistancia / 60 * 60; // Assumindo 60 km/h
            capacidadeRestante -= lojaMaisProxima.demanda;
            posicaoAtual = lojaMaisProxima.coordenadas;
            lojasRestantes.splice(indexLoja, 1);
          } else {
            break;
          }
        }

        // Retornar à base
        const distanciaRetorno = calcularDistancia(posicaoAtual, baseAlgoz);
        rota.distanciaTotal += distanciaRetorno;
        rota.tempoTotal += distanciaRetorno / 60 * 60;
        rota.custoEstimado = rota.distanciaTotal * 1.5; // €1.50 por km

        if (rota.sequenciaEntregas.length > 0) {
          rotasCalculadas.push(rota);
        }
      });

      setRotasOtimizadas(rotasCalculadas);
      setIsOptimizing(false);
      setOptimizationComplete(true);
    }, 2000);
  };

  // Funções de edição de lojas
  const startEditLoja = (loja: Loja) => {
    if (!canEdit) return;
    setEditingLoja(loja.id);
    setEditFormLoja({ ...loja });
  };

  const cancelEditLoja = () => {
    setEditingLoja(null);
    setEditFormLoja(null);
  };

  const saveEditLoja = () => {
    if (!editFormLoja || !canEdit) return;
    setLojas(lojas.map(l => l.id === editFormLoja.id ? editFormLoja : l));
    setEditingLoja(null);
    setEditFormLoja(null);
  };

  const deleteLoja = (id: string) => {
    if (!canEdit) return;
    if (confirm('Tem certeza que deseja remover esta loja?')) {
      setLojas(lojas.filter(l => l.id !== id));
    }
  };

  const addLoja = () => {
    if (!canEdit) return;
    const newId = `L${String(lojas.length + 1).padStart(3, '0')}`;
    const newLoja: Loja = {
      id: newId,
      nome: 'Nova Loja',
      coordenadas: { lat: 37.0, lng: -8.0 },
      janelaTempo: { inicio: '08:00', fim: '12:00' },
      demanda: 100
    };
    setLojas([...lojas, newLoja]);
    startEditLoja(newLoja);
  };

  // Funções de edição de veículos
  const startEditVeiculo = (veiculo: Veiculo) => {
    if (!canEdit) return;
    setEditingVeiculo(veiculo.id);
    setEditFormVeiculo({ ...veiculo });
  };

  const cancelEditVeiculo = () => {
    setEditingVeiculo(null);
    setEditFormVeiculo(null);
  };

  const saveEditVeiculo = () => {
    if (!editFormVeiculo || !canEdit) return;
    setVeiculos(veiculos.map(v => v.id === editFormVeiculo.id ? editFormVeiculo : v));
    setEditingVeiculo(null);
    setEditFormVeiculo(null);
  };

  const deleteVeiculo = (id: string) => {
    if (!canEdit) return;
    if (confirm('Tem certeza que deseja remover este veículo?')) {
      setVeiculos(veiculos.filter(v => v.id !== id));
    }
  };

  const addVeiculo = () => {
    if (!canEdit) return;
    const newId = `V${String(veiculos.length + 1).padStart(3, '0')}`;
    const newVeiculo: Veiculo = {
      id: newId,
      capacidade: 500,
      disponivel: true
    };
    setVeiculos([...veiculos, newVeiculo]);
    startEditVeiculo(newVeiculo);
  };

  // Métricas calculadas
  const metricas = useMemo(() => {
    if (rotasOtimizadas.length === 0) return null;

    const totalDistancia = rotasOtimizadas.reduce((acc, r) => acc + r.distanciaTotal, 0);
    const totalTempo = rotasOtimizadas.reduce((acc, r) => acc + r.tempoTotal, 0);
    const totalCusto = rotasOtimizadas.reduce((acc, r) => acc + r.custoEstimado, 0);
    const totalEntregas = rotasOtimizadas.reduce((acc, r) => acc + r.sequenciaEntregas.length, 0);

    return {
      totalDistancia: totalDistancia.toFixed(1),
      totalTempo: (totalTempo / 60).toFixed(1),
      totalCusto: totalCusto.toFixed(2),
      totalEntregas,
      veiculosUsados: rotasOtimizadas.length,
    };
  }, [rotasOtimizadas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <Route className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Otimização de Rotas
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Algoz → Algarve & Alentejo
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={otimizarRotas}
              disabled={isOptimizing}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Otimizando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Otimizar Rotas
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas */}
        {metricas && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Distância Total</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{metricas.totalDistancia} km</p>
                </div>
                <Navigation className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Tempo Total</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{metricas.totalTempo}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Custo Estimado</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">€{metricas.totalCusto}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Entregas</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{metricas.totalEntregas}</p>
                </div>
                <Package className="w-8 h-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Veículos</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{metricas.veiculosUsados}</p>
                </div>
                <Truck className="w-8 h-8 text-indigo-500" />
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configurações */}
          <div className="lg:col-span-1 space-y-6">
            {/* Lojas */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Lojas Pingo Doce
                  </h2>
                </div>
                {canEdit && (
                  <Button
                    onClick={addLoja}
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {lojas.map((loja) => (
                  <div
                    key={loja.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {editingLoja === loja.id && editFormLoja ? (
                      <div className="space-y-2">
                        <Input
                          value={editFormLoja.nome}
                          onChange={(e) => setEditFormLoja({ ...editFormLoja, nome: e.target.value })}
                          className="text-sm"
                          placeholder="Nome da loja"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            step="0.0001"
                            value={editFormLoja.coordenadas.lat}
                            onChange={(e) => setEditFormLoja({ 
                              ...editFormLoja, 
                              coordenadas: { ...editFormLoja.coordenadas, lat: parseFloat(e.target.value) }
                            })}
                            className="text-xs"
                            placeholder="Latitude"
                          />
                          <Input
                            type="number"
                            step="0.0001"
                            value={editFormLoja.coordenadas.lng}
                            onChange={(e) => setEditFormLoja({ 
                              ...editFormLoja, 
                              coordenadas: { ...editFormLoja.coordenadas, lng: parseFloat(e.target.value) }
                            })}
                            className="text-xs"
                            placeholder="Longitude"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="time"
                            value={editFormLoja.janelaTempo.inicio}
                            onChange={(e) => setEditFormLoja({ 
                              ...editFormLoja, 
                              janelaTempo: { ...editFormLoja.janelaTempo, inicio: e.target.value }
                            })}
                            className="text-xs"
                          />
                          <Input
                            type="time"
                            value={editFormLoja.janelaTempo.fim}
                            onChange={(e) => setEditFormLoja({ 
                              ...editFormLoja, 
                              janelaTempo: { ...editFormLoja.janelaTempo, fim: e.target.value }
                            })}
                            className="text-xs"
                          />
                        </div>
                        <Input
                          type="number"
                          value={editFormLoja.demanda}
                          onChange={(e) => setEditFormLoja({ ...editFormLoja, demanda: parseInt(e.target.value) })}
                          className="text-xs"
                          placeholder="Demanda"
                        />
                        <div className="flex gap-2">
                          <Button onClick={saveEditLoja} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Save className="w-3 h-3 mr-1" />
                            Salvar
                          </Button>
                          <Button onClick={cancelEditLoja} size="sm" variant="outline" className="flex-1">
                            <X className="w-3 h-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {loja.nome}
                          </p>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {loja.demanda} un
                            </Badge>
                            {canEdit && (
                              <>
                                <Button
                                  onClick={() => startEditLoja(loja)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  onClick={() => deleteLoja(loja.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {loja.janelaTempo.inicio} - {loja.janelaTempo.fim}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {loja.coordenadas.lat.toFixed(4)}, {loja.coordenadas.lng.toFixed(4)}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Veículos */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Veículos Disponíveis
                  </h2>
                </div>
                {canEdit && (
                  <Button
                    onClick={addVeiculo}
                    size="sm"
                    variant="outline"
                    className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {veiculos.map((veiculo) => (
                  <div
                    key={veiculo.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {editingVeiculo === veiculo.id && editFormVeiculo ? (
                      <div className="space-y-2">
                        <Input
                          value={editFormVeiculo.id}
                          onChange={(e) => setEditFormVeiculo({ ...editFormVeiculo, id: e.target.value })}
                          className="text-sm"
                          placeholder="ID do veículo"
                        />
                        <Input
                          type="number"
                          value={editFormVeiculo.capacidade}
                          onChange={(e) => setEditFormVeiculo({ ...editFormVeiculo, capacidade: parseInt(e.target.value) })}
                          className="text-sm"
                          placeholder="Capacidade"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editFormVeiculo.disponivel}
                            onChange={(e) => setEditFormVeiculo({ ...editFormVeiculo, disponivel: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <Label className="text-sm">Disponível</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveEditVeiculo} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Save className="w-3 h-3 mr-1" />
                            Salvar
                          </Button>
                          <Button onClick={cancelEditVeiculo} size="sm" variant="outline" className="flex-1">
                            <X className="w-3 h-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {veiculo.id}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Capacidade: {veiculo.capacidade} un
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={veiculo.disponivel ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}
                          >
                            {veiculo.disponivel ? 'Disponível' : 'Indisponível'}
                          </Badge>
                          {canEdit && (
                            <>
                              <Button
                                onClick={() => startEditVeiculo(veiculo)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => deleteVeiculo(veiculo.id)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Rotas Otimizadas */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Route className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Rotas Otimizadas
                </h2>
              </div>

              {!optimizationComplete && !isOptimizing && (
                <div className="text-center py-12">
                  <Route className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Clique em "Otimizar Rotas" para calcular as melhores rotas de entrega
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    O sistema utilizará algoritmos de roteirização para encontrar as rotas mais eficientes
                  </p>
                </div>
              )}

              {isOptimizing && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Otimizando rotas...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Calculando as melhores sequências de entrega
                  </p>
                </div>
              )}

              {optimizationComplete && rotasOtimizadas.length > 0 && (
                <div className="space-y-4">
                  {rotasOtimizadas.map((rota, index) => (
                    <div
                      key={rota.veiculoId}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100">
                              Veículo {rota.veiculoId}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {rota.sequenciaEntregas.length} entregas
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                          €{rota.custoEstimado.toFixed(2)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {rota.distanciaTotal.toFixed(1)} km
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {(rota.tempoTotal / 60).toFixed(1)}h
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Sequência de Entregas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700">
                            Algoz (Base)
                          </Badge>
                          {rota.sequenciaEntregas.map((lojaId) => {
                            const loja = lojas.find(l => l.id === lojaId);
                            return (
                              <div key={lojaId} className="flex items-center gap-1">
                                <span className="text-gray-400">→</span>
                                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                                  {loja?.nome.replace('Pingo Doce ', '')}
                                </Badge>
                              </div>
                            );
                          })}
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">→</span>
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700">
                              Algoz (Retorno)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
