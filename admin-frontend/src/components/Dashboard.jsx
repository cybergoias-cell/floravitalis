import { useState, useEffect } from 'react'
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const Dashboard = ({ apiUrl }) => {
  const [metrics, setMetrics] = useState({
    totalPedidos: 0,
    pedidosHoje: 0,
    estoqueTotal: 0,
    alertasEstoque: 0,
    faturamentoMes: 0,
    pedidosProcessando: 0
  })

  const [pedidosRecentes, setPedidosRecentes] = useState([])
  const [estoqueStatus, setEstoqueStatus] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados mock para demonstração dos gráficos
  const vendaSemanais = [
    { dia: 'Seg', vendas: 12, faturamento: 2400 },
    { dia: 'Ter', vendas: 19, faturamento: 3800 },
    { dia: 'Qua', vendas: 8, faturamento: 1600 },
    { dia: 'Qui', vendas: 15, faturamento: 3000 },
    { dia: 'Sex', vendas: 22, faturamento: 4400 },
    { dia: 'Sáb', vendas: 18, faturamento: 3600 },
    { dia: 'Dom', vendas: 9, faturamento: 1800 }
  ]

  const statusPedidos = [
    { name: 'Processados', value: 65, color: '#10B981' },
    { name: 'Pendentes', value: 20, color: '#F59E0B' },
    { name: 'Enviados', value: 15, color: '#3B82F6' }
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Buscar pedidos
      const pedidosResponse = await fetch(`${apiUrl}/pedidos`)
      const pedidosData = await pedidosResponse.json()
      
      // Buscar estoque
      const estoqueResponse = await fetch(`${apiUrl}/estoque`)
      const estoqueData = await estoqueResponse.json()

      // Calcular métricas
      const hoje = new Date().toDateString()
      const pedidosHoje = pedidosData.pedidos?.filter(p => 
        new Date(p.timestamp).toDateString() === hoje
      ).length || 0

      const faturamentoMes = pedidosData.pedidos?.reduce((total, pedido) => 
        total + (pedido.valor || 0), 0
      ) || 0

      const pedidosProcessando = pedidosData.pedidos?.filter(p => 
        p.status === 'pagamento_confirmado' || p.status === 'processando'
      ).length || 0

      setMetrics({
        totalPedidos: pedidosData.total || 0,
        pedidosHoje,
        estoqueTotal: estoqueData.produtos?.length || 0,
        alertasEstoque: estoqueData.alertas || 0,
        faturamentoMes: faturamentoMes / 100, // Converter centavos para reais
        pedidosProcessando
      })

      setPedidosRecentes(pedidosData.pedidos?.slice(0, 5) || [])
      setEstoqueStatus(estoqueData.produtos || [])

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, icon: Icon, description, trend, color = "text-blue-600" }) => (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total de Pedidos"
          value={metrics.totalPedidos}
          icon={ShoppingCart}
          description="Todos os pedidos processados"
          trend="+12% este mês"
          color="text-blue-600"
        />
        
        <MetricCard
          title="Pedidos Hoje"
          value={metrics.pedidosHoje}
          icon={TrendingUp}
          description="Pedidos recebidos hoje"
          color="text-green-600"
        />
        
        <MetricCard
          title="Faturamento do Mês"
          value={`R$ ${metrics.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="Receita total do mês"
          trend="+8% vs mês anterior"
          color="text-emerald-600"
        />
        
        <MetricCard
          title="Produtos em Estoque"
          value={metrics.estoqueTotal}
          icon={Package}
          description="Diferentes produtos cadastrados"
          color="text-purple-600"
        />
        
        <MetricCard
          title="Alertas de Estoque"
          value={metrics.alertasEstoque}
          icon={AlertTriangle}
          description="Produtos com estoque baixo"
          color="text-red-600"
        />
        
        <MetricCard
          title="Pedidos Processando"
          value={metrics.pedidosProcessando}
          icon={Users}
          description="Aguardando processamento"
          color="text-orange-600"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas da Semana */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas da Semana</CardTitle>
            <CardDescription>Número de pedidos por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendaSemanais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusPedidos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPedidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 space-x-4">
              {statusPedidos.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faturamento Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Semanal</CardTitle>
          <CardDescription>Receita em reais por dia da semana</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vendaSemanais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
              />
              <Line 
                type="monotone" 
                dataKey="faturamento" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos 5 pedidos processados</CardDescription>
        </CardHeader>
        <CardContent>
          {pedidosRecentes.length > 0 ? (
            <div className="space-y-4">
              {pedidosRecentes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-medium">Pedido #{pedido.id}</div>
                    <div className="text-sm text-gray-500">{pedido.cliente?.nome}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(pedido.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {((pedido.valor || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      pedido.status === 'processado' ? 'bg-green-100 text-green-800' :
                      pedido.status === 'erro' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pedido.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum pedido encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
