import { useState, useEffect } from 'react';
import { Monitor, Users, Clock, Activity, Trash2, RefreshCw, Shield, Smartphone, Globe } from 'lucide-react';

const Sessoes = ({ apiUrl, token }) => {
  const [sessoes, setSessoes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Carregar sessões
  const carregarSessoes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/admin/sessoes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessoes(data.sessoes || []);
      } else {
        setError('Erro ao carregar sessões');
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas
  const carregarStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/sessoes/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Invalidar sessão
  const invalidarSessao = async (sessionId) => {
    if (!confirm('Tem certeza que deseja invalidar esta sessão?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/sessoes/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await carregarSessoes();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao invalidar sessão');
      }
    } catch (error) {
      console.error('Erro ao invalidar sessão:', error);
      setError('Erro de conexão');
    }
  };

  // Invalidar todas as sessões de um usuário
  const invalidarSessoesUsuario = async (userId) => {
    if (!confirm('Tem certeza que deseja invalidar todas as sessões deste usuário?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/usuarios/${userId}/sessoes`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await carregarSessoes();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao invalidar sessões');
      }
    } catch (error) {
      console.error('Erro ao invalidar sessões:', error);
      setError('Erro de conexão');
    }
  };

  useEffect(() => {
    if (token) {
      carregarSessoes();
      carregarStats();
    }
  }, [apiUrl, token]);

  // Auto refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      carregarSessoes();
      carregarStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, apiUrl, token]);

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <Globe className="w-4 h-4" />;
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const getBrowser = (userAgent) => {
    if (!userAgent) return 'Desconhecido';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Outro';
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-gray-600 bg-gray-100';
  };

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? 'text-purple-600 bg-purple-100' 
      : 'text-blue-600 bg-blue-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Sessões</h1>
          <p className="text-gray-600">Monitore usuários ativos e gerencie sessões do sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button
            onClick={() => {
              carregarSessoes();
              carregarStats();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Monitor className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Sessões</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_sessoes || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sessões Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.sessoes_ativas || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Usuários Únicos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.usuarios_unicos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sessão Mais Longa</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDuration(stats.sessao_mais_longa || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Tipo</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Administradores</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.sessoes_admin || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Clientes</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.sessoes_cliente || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade por Hora</h3>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(stats.atividade_por_hora || {}).slice(0, 12).map(([hora, count]) => (
              <div key={hora} className="text-center">
                <div className="text-xs text-gray-500">{hora}h</div>
                <div className="text-sm font-semibold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sessões Ativas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessoes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Nenhuma sessão ativa encontrada</p>
                  </td>
                </tr>
              ) : (
                sessoes.map((sessao, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {sessao.userName}
                        </div>
                        <div className="text-sm text-gray-500">{sessao.userEmail}</div>
                        <div className="text-xs text-gray-400">ID: {sessao.sessionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(sessao.userRole)}`}>
                        {sessao.userRole === 'admin' ? 'Admin' : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sessao.isActive)}`}>
                        {sessao.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(sessao.userAgent)}
                        <div>
                          <div className="text-sm text-gray-900">{getBrowser(sessao.userAgent)}</div>
                          <div className="text-xs text-gray-500">{sessao.ipAddress}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(sessao.loginTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Última atividade: {formatDateTime(sessao.lastActivity)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDuration(sessao.duration)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => invalidarSessao(sessao.sessionId.split('...')[0])}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Invalidar sessão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => invalidarSessoesUsuario(sessao.userId)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Invalidar todas as sessões do usuário"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sessoes;
