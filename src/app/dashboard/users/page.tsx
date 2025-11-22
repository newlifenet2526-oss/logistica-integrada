'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { canManageUsers } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Shield,
  User,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'supervisor' | 'coordenador' | 'operador' | 'motorista' | 'shunter';
  createdAt: string;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'operador' as UserData['role']
  });

  // Redirecionar se não autenticado ou sem permissão
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login');
      return;
    }
    
    if (user && !canManageUsers(user.role)) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive"
      });
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router, toast]);

  // Carregar usuários (mock data por enquanto)
  useEffect(() => {
    // Aqui você carregaria os usuários do banco de dados
    const mockUsers: UserData[] = [
      {
        id: '1',
        nome: 'Admin Sistema',
        email: 'admin@jeronimomartins.pt',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        nome: 'João Silva',
        email: 'joao.silva@jeronimomartins.pt',
        role: 'supervisor',
        createdAt: new Date().toISOString()
      }
    ];
    setUsers(mockUsers);
  }, []);

  const handleCreateUser = () => {
    if (!formData.nome || !formData.email || !formData.password) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email Inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    // Validar senha (mínimo 6 caracteres)
    if (formData.password.length < 6) {
      toast({
        title: "Senha Fraca",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      nome: formData.nome,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    
    toast({
      title: "Utilizador Criado",
      description: `${formData.nome} foi adicionado com sucesso.`,
    });

    // Reset form
    setFormData({
      nome: '',
      email: '',
      password: '',
      role: 'operador'
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!selectedUser || !formData.nome || !formData.email) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, nome: formData.nome, email: formData.email, role: formData.role }
        : u
    ));

    toast({
      title: "Utilizador Atualizado",
      description: `${formData.nome} foi atualizado com sucesso.`,
    });

    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      nome: '',
      email: '',
      password: '',
      role: 'operador'
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (userToDelete?.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
      toast({
        title: "Operação Negada",
        description: "Não é possível remover o último administrador do sistema.",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    
    toast({
      title: "Utilizador Removido",
      description: "O utilizador foi removido com sucesso.",
    });
  };

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      password: '',
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      coordenador: 'Coordenador',
      operador: 'Operador',
      motorista: 'Motorista',
      shunter: 'Shunter'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-500',
      supervisor: 'bg-purple-500',
      coordenador: 'bg-blue-500',
      operador: 'bg-green-500',
      motorista: 'bg-yellow-500',
      shunter: 'bg-orange-500'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user || !canManageUsers(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                Gestão de Utilizadores
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Crie e gerencie utilizadores do sistema
              </p>
            </div>

            <Button
              onClick={() => {
                setFormData({
                  nome: '',
                  email: '',
                  password: '',
                  role: 'operador'
                });
                setIsCreateDialogOpen(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Utilizador
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Utilizadores Registados</CardTitle>
            <CardDescription>
              Total de {users.length} utilizadores no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {userData.nome}
                      </div>
                    </TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(userData.role)} text-white`}>
                        {getRoleLabel(userData.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(userData.createdAt).toLocaleDateString('pt-PT')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(userData)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(userData.id)}
                          className="hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Utilizador</DialogTitle>
              <DialogDescription>
                Defina o nome de utilizador, senha e função no sistema
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao.silva@jeronimomartins.pt"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserData['role'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {user.role === 'admin' && (
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          Administrador
                        </div>
                      </SelectItem>
                    )}
                    <SelectItem value="supervisor">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        Supervisor
                      </div>
                    </SelectItem>
                    <SelectItem value="coordenador">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        Coordenador
                      </div>
                    </SelectItem>
                    <SelectItem value="operador">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        Operador
                      </div>
                    </SelectItem>
                    <SelectItem value="motorista">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-500" />
                        Motorista
                      </div>
                    </SelectItem>
                    <SelectItem value="shunter">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" />
                        Shunter
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUser}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                Criar Utilizador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Utilizador</DialogTitle>
              <DialogDescription>
                Atualize as informações do utilizador
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome Completo</Label>
                <Input
                  id="edit-nome"
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="joao.silva@jeronimomartins.pt"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Função</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserData['role'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {user.role === 'admin' && (
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          Administrador
                        </div>
                      </SelectItem>
                    )}
                    <SelectItem value="supervisor">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        Supervisor
                      </div>
                    </SelectItem>
                    <SelectItem value="coordenador">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        Coordenador
                      </div>
                    </SelectItem>
                    <SelectItem value="operador">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        Operador
                      </div>
                    </SelectItem>
                    <SelectItem value="motorista">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-500" />
                        Motorista
                      </div>
                    </SelectItem>
                    <SelectItem value="shunter">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" />
                        Shunter
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Para alterar a senha, o utilizador deve usar a opção "Esqueci a senha" no login.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditUser}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
