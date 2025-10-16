import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  RefreshCw,
  Filter,
  Calendar,
  Package,
  TrendingDown,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO, isToday, isYesterday, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Alertas = ({ apiUrl }) => {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos')

  useEffect(() => {
    fetchAlertas()
  }, [])

  const fetchAlertas = async () => {
    try {
      setLoading(true)
      
      // Buscar alertas de estoque baixo
      const estoqueResponse = await fetch(`${apiUrl}/alertas/estoque-baixo`)
      const estoqueData = await estoqueResponse.json()
      
      // Buscar dados do estoque atual para alertas em tempo real
      const estoqueAtualResponse = await fetch(`${apiUrl}/estoque`)
      const estoqueAtualData = await estoqueAtualResponse.json()
      
      // Processar alertas de estoque baixo do arquivo
      const alertasEstoque = estoqueData.alertas?.map(alerta => {
        const match = alerta.match(/\[(.*?)\] ESTOQUE BAIXO - (.*?) \((.*?)\): (\d+) unidades restantes/)
        if (match) {
          return {
            id: `estoque-${match[2]}-${match[1]}`,
            tipo: 'estoque_baixo',
            titulo: 'Estoque Baixo',
            descricao: `${match[3]} (${match[2]}) - ${match[4]} unidades restantes`,
            timestamp: match[1],
            severidade: parseInt(match[4]) === 0 ? 'critica' : 'alta',
            sku: match[2],
            produto: match[3],
            quantidade: parseInt(match[4])
          }
        }
        return null
      }).filter(Boolean) || []
      
      // Adicionar alertas em tempo real do estoque atual
      const alertasTempoReal = estoqueAtualData.produtos?.filter(p => p.alerta_estoque_baixo).map(produto => ({
        id: `tempo-real-${produto.sku}`,
        tipo: 'estoque_critico',
        titulo: produto.estoque === 0 ? 'Produto Esgotado' : 'Estoque Crítico',
        descricao: `${produto.nome} (${produto.sku}) - ${produto.estoque} unidades`,
        timestamp: new Date().toISOString(),
        severidade: produto.estoque === 0 ? 'critica' : 'alta',
        sku: produto.sku,
        produto: produto.nome,
        quantidade: produto.estoque,
        tempoReal: true
      })) || []
      
      // Combinar todos os alertas
      const todosAlertas = [...alertasEstoque, ...alertasTempoReal]
      
      // Ordenar por timestamp (mais recente primeiro)
      todosAlertas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setAlertas(todosAlertas)
      
    } catch (error) {
      console.error('Erro ao buscar alertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeveridadeColor = (severidade) => {
    switch (severidade) {
      case 'critica':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'alta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'media':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeveridadeIcon = (severidade) => {
    switch (severidade) {
      case 'critica':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'alta':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'media':
        return <Bell className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatarDataRelativa = (timestamp) => {
    try {
      const data = parseISO(timestamp)
      
      if (isToday(data)) {
        return `Hoje às ${format(data, 'HH:mm', { locale: ptBR })}`
      } else if (isYesterday(data)) {
        return `Ontem às ${format(data, 'HH:mm', { locale: ptBR })}`
      } else {
        const diasAtras = differenceInDays(new Date(), data)
        if (diasAtras <= 7) {
          return `${diasAtras} dias atrás`
        } else {
          return format(data, 'dd/MM/yyyy HH:mm', { locale: ptBR })
        }
      }
    } catch (error) {
      return 'Data inválida'
    }
  }

  const filtrarAlertas = () => {
    let alertasFiltrados = alertas

    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      alertasFiltrados = alertasFiltrados.filter(alerta => alerta.tipo === filtroTipo)
    }

    // Filtrar por período
    if (filtroPeriodo !== 'todos') {
      const agora = new Date()
      alertasFiltrados = alertasFiltrados.filter(alerta => {
        const dataAlerta = parseISO(alerta.timestamp)
        const diferencaDias = differenceInDays(agora, dataAlerta)
        
        switch (filtroPeriodo) {
          case 'hoje':
            return isToday(dataAlerta)
          case 'ontem':
            return isYesterday(dataAlerta)
          case 'semana':
            return diferencaDias <= 7
          case 'mes':
            return diferencaDias <= 30
          default:
            return true
        }
      })
    }

    return alertasFiltrados
  }

  const alertasFiltrados = filtrarAlertas()
  const alertasCriticos = alertas.filter(a => a.severidade === 'critica').length
  const alertasAltos = alertas.filter(a => a.severidade === 'alta').length
  const alertasHoje = alertas.filter(a => isToday(parseISO(a.timestamp))).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      {/* Resumo dos Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Alertas Críticos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{alertasCriticos}</div>
            <p className="text-xs text-red-700">Requerem ação imediata</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Alertas Importantes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{alertasAltos}</div>
            <p className="text-xs text-yellow-700">Precisam de atenção</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Alertas Hoje</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{alertasHoje}</div>
            <p className="text-xs text-blue-700">Gerados nas últimas 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Central de Alertas</CardTitle>
          <CardDescription>
            Monitore todos os alertas e notificações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="estoque_baixo">Estoque Baixo</SelectItem>
                <SelectItem value="estoque_critico">Estoque Crítico</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
              <SelectTrigger className="w-full md:w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Períodos</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Último Mês</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchAlertas} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <CardContent className="p-0">
          {alertasFiltrados.length > 0 ? (
            <div className="divide-y">
              {alertasFiltrados.map((alerta) => (
                <div key={alerta.id} className={`p-6 hover:bg-gray-50 transition-colors ${
                  alerta.tempoReal ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getSeveridadeIcon(alerta.severidade)}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{alerta.titulo}</h3>
                          {alerta.tempoReal && (
                            <Badge variant="outline" className="text-xs">
                              Tempo Real
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-2">{alerta.descricao}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatarDataRelativa(alerta.timestamp)}
                          </span>
                          
                          {alerta.sku && (
                            <span className="flex items-center">
                              <Package className="h-3 w-3 mr-1" />
                              SKU: {alerta.sku}
                            </span>
                          )}
                          
                          {alerta.quantidade !== undefined && (
                            <span className="flex items-center">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {alerta.quantidade} unidades
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeveridadeColor(alerta.severidade)}>
                        {alerta.severidade === 'critica' ? 'Crítico' :
                         alerta.severidade === 'alta' ? 'Alto' :
                         alerta.severidade === 'media' ? 'Médio' : 'Baixo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum alerta encontrado
              </h3>
              <p className="text-gray-500">
                {filtroTipo !== 'todos' || filtroPeriodo !== 'todos'
                  ? 'Tente ajustar os filtros para ver mais alertas'
                  : 'Não há alertas no momento. Tudo funcionando perfeitamente!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas Críticos em Destaque */}
      {alertasCriticos > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Ação Urgente Necessária
            </CardTitle>
            <CardDescription className="text-red-700">
              Os seguintes itens requerem atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertas
                .filter(a => a.severidade === 'critica')
                .slice(0, 5)
                .map((alerta) => (
                  <div key={alerta.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="font-medium text-red-900">{alerta.produto}</p>
                        <p className="text-sm text-red-700">SKU: {alerta.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-900">{alerta.quantidade} unidades</p>
                      <p className="text-xs text-red-600">{formatarDataRelativa(alerta.timestamp)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Alertas
