import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Relatorios = ({ apiUrl }) => {
  const [pedidos, setPedidos] = useState([])
  const [estoque, setEstoque] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('7dias')

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      setLoading(true)
      
      // Buscar pedidos
      const pedidosResponse = await fetch(`${apiUrl}/pedidos`)
      const pedidosData = await pedidosResponse.json()
      
      // Buscar estoque
      const estoqueResponse = await fetch(`${apiUrl}/estoque`)
      const estoqueData = await estoqueResponse.json()
      
      setPedidos(pedidosData.pedidos || [])
      setEstoque(estoqueData.produtos || [])
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtrarPedidosPorPeriodo = () => {
    const agora = new Date()
    let dataInicio
    
    switch (periodo) {
      case '7dias':
        dataInicio = subDays(agora, 7)
        break
      case '30dias':
        dataInicio = subDays(agora, 30)
        break
      case '90dias':
        dataInicio = subDays(agora, 90)
        break
      default:
        dataInicio = subDays(agora, 7)
    }
    
    return pedidos.filter(pedido => {
      const dataPedido = new Date(pedido.timestamp)
      return isWithinInterval(dataPedido, {
        start: startOfDay(dataInicio),
        end: endOfDay(agora)
      })
    })
  }

  const gerarDadosVendasDiarias = () => {
    const pedidosFiltrados = filtrarPedidosPorPeriodo()
    const diasMap = new Map()
    
    // Inicializar todos os dias do período com 0
    const agora = new Date()
    const numeroDias = periodo === '7dias' ? 7 : periodo === '30dias' ? 30 : 90
    
    for (let i = numeroDias - 1; i >= 0; i--) {
      const data = subDays(agora, i)
      const chave = format(data, 'yyyy-MM-dd')
      diasMap.set(chave, {
        data: chave,
        dataFormatada: format(data, 'dd/MM', { locale: ptBR }),
        vendas: 0,
        faturamento: 0,
        pedidos: []
      })
    }
    
    // Agrupar pedidos por dia
    pedidosFiltrados.forEach(pedido => {
      const dataPedido = format(new Date(pedido.timestamp), 'yyyy-MM-dd')
      if (diasMap.has(dataPedido)) {
        const dia = diasMap.get(dataPedido)
        dia.vendas += 1
        dia.faturamento += (pedido.valor || 0) / 100
        dia.pedidos.push(pedido)
      }
    })
    
    return Array.from(diasMap.values())
  }

  const gerarDadosStatusPedidos = () => {
    const pedidosFiltrados = filtrarPedidosPorPeriodo()
    const statusMap = new Map()
    
    pedidosFiltrados.forEach(pedido => {
      const status = pedido.status || 'desconhecido'
      statusMap.set(status, (statusMap.get(status) || 0) + 1)
    })
    
    const cores = {
      'processado': '#10B981',
      'pagamento_confirmado': '#F59E0B',
      'processando': '#3B82F6',
      'erro': '#EF4444',
      'desconhecido': '#6B7280'
    }
    
    return Array.from(statusMap.entries()).map(([status, quantidade]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: quantidade,
      color: cores[status] || '#6B7280'
    }))
  }

  const gerarDadosProdutosMaisVendidos = () => {
    const pedidosFiltrados = filtrarPedidosPorPeriodo()
    const produtosMap = new Map()
    
    pedidosFiltrados.forEach(pedido => {
      pedido.produtos?.forEach(produto => {
        const sku = produto.sku
        if (produtosMap.has(sku)) {
          produtosMap.get(sku).quantidade += produto.quantidade
        } else {
          produtosMap.set(sku, {
            sku,
            nome: produto.nome,
            quantidade: produto.quantidade
          })
        }
      })
    })
    
    return Array.from(produtosMap.values())
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)
  }

  const calcularMetricas = () => {
    const pedidosFiltrados = filtrarPedidosPorPeriodo()
    
    const totalPedidos = pedidosFiltrados.length
    const faturamentoTotal = pedidosFiltrados.reduce((total, pedido) => 
      total + ((pedido.valor || 0) / 100), 0
    )
    const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0
    const pedidosProcessados = pedidosFiltrados.filter(p => p.status === 'processado').length
    const taxaSucesso = totalPedidos > 0 ? (pedidosProcessados / totalPedidos) * 100 : 0
    
    return {
      totalPedidos,
      faturamentoTotal,
      ticketMedio,
      taxaSucesso
    }
  }

  const exportarRelatorio = () => {
    const dados = {
      periodo,
      dataGeracao: new Date().toISOString(),
      metricas: calcularMetricas(),
      vendasDiarias: gerarDadosVendasDiarias(),
      statusPedidos: gerarDadosStatusPedidos(),
      produtosMaisVendidos: gerarDadosProdutosMaisVendidos(),
      estoque: estoque
    }
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${periodo}-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const dadosVendasDiarias = gerarDadosVendasDiarias()
  const dadosStatusPedidos = gerarDadosStatusPedidos()
  const produtosMaisVendidos = gerarDadosProdutosMaisVendidos()
  const metricas = calcularMetricas()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios e Analytics</CardTitle>
          <CardDescription>
            Análise detalhada de vendas, estoque e performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-full md:w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={fetchDados} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button onClick={exportarRelatorio} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalPedidos}</div>
            <p className="text-xs text-gray-500">
              {periodo === '7dias' ? 'Últimos 7 dias' : 
               periodo === '30dias' ? 'Últimos 30 dias' : 'Últimos 90 dias'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metricas.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Receita do período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metricas.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Valor médio por pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.taxaSucesso.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">Pedidos processados com sucesso</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Diárias */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Dia</CardTitle>
            <CardDescription>Número de pedidos ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosVendasDiarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dataFormatada" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Data: ${label}`}
                  formatter={(value, name) => [value, name === 'vendas' ? 'Pedidos' : 'Faturamento']}
                />
                <Area 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
            <CardDescription>Distribuição por status no período</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosStatusPedidos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosStatusPedidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              {dadosStatusPedidos.map((item, index) => (
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

      {/* Faturamento Diário */}
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Diário</CardTitle>
          <CardDescription>Receita em reais por dia</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosVendasDiarias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dataFormatada" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
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

      {/* Produtos Mais Vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Top 10 produtos por quantidade vendida no período</CardDescription>
        </CardHeader>
        <CardContent>
          {produtosMaisVendidos.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={produtosMaisVendidos} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="nome" 
                  type="category" 
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Quantidade Vendida']}
                />
                <Bar dataKey="quantidade" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma venda registrada no período selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo do Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Estoque Atual</CardTitle>
          <CardDescription>Status atual de todos os produtos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {estoque.filter(p => p.estoque > 10).length}
              </div>
              <div className="text-sm text-green-600">Estoque Alto</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {estoque.filter(p => p.estoque > 0 && p.estoque <= 10).length}
              </div>
              <div className="text-sm text-yellow-600">Estoque Baixo</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">
                {estoque.filter(p => p.estoque === 0).length}
              </div>
              <div className="text-sm text-red-600">Esgotados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Relatorios
