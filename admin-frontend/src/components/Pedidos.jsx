import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  RefreshCw, 
  Download,
  MessageSquare,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Pedidos = ({ apiUrl }) => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [reenviarLoading, setReenviarLoading] = useState(null)

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/pedidos`)
      const data = await response.json()
      setPedidos(data.pedidos || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const reenviarNotificacao = async (pedidoId) => {
    try {
      setReenviarLoading(pedidoId)
      const response = await fetch(`${apiUrl}/pedidos/${pedidoId}/reenviar-notificacao`, {
        method: 'POST'
      })
      
      if (response.ok) {
        alert('Notificação reenviada com sucesso!')
        fetchPedidos() // Atualizar lista
      } else {
        alert('Erro ao reenviar notificação')
      }
    } catch (error) {
      console.error('Erro ao reenviar notificação:', error)
      alert('Erro ao reenviar notificação')
    } finally {
      setReenviarLoading(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processado':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'erro':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pagamento_confirmado':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'processado': 'bg-green-100 text-green-800',
      'erro': 'bg-red-100 text-red-800',
      'pagamento_confirmado': 'bg-yellow-100 text-yellow-800',
      'processando': 'bg-blue-100 text-blue-800'
    }
    
    return (
      <Badge className={`${variants[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </Badge>
    )
  }

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || pedido.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const PedidoDetalhes = ({ pedido }) => (
    <div className="space-y-6">
      {/* Informações do Cliente */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Informações do Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nome</label>
            <p className="text-sm">{pedido.cliente?.nome}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm">{pedido.cliente?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Telefone</label>
            <p className="text-sm">{pedido.cliente?.telefone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">{getStatusBadge(pedido.status)}</div>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Endereço de Entrega</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm">
            {pedido.cliente?.endereco?.rua}, {pedido.cliente?.endereco?.numero}
            {pedido.cliente?.endereco?.complemento && `, ${pedido.cliente?.endereco?.complemento}`}
          </p>
          <p className="text-sm">
            {pedido.cliente?.endereco?.bairro} - {pedido.cliente?.endereco?.cidade}/{pedido.cliente?.endereco?.estado}
          </p>
          <p className="text-sm">CEP: {pedido.cliente?.endereco?.cep}</p>
        </div>
      </div>

      {/* Produtos */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Produtos</h3>
        <div className="space-y-2">
          {pedido.produtos?.map((produto, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{produto.nome}</p>
                <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Qtd: {produto.quantidade}</p>
                {pedido.estoque_atual?.[produto.sku] !== undefined && (
                  <p className="text-xs text-gray-500">
                    Estoque atual: {pedido.estoque_atual[produto.sku]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informações de Envio */}
      {pedido.etiqueta && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Informações de Envio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Código de Rastreamento</label>
              <p className="text-sm font-mono">{pedido.etiqueta.tracking}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Protocolo</label>
              <p className="text-sm">{pedido.etiqueta.protocol}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Custo do Frete</label>
              <p className="text-sm">R$ {pedido.etiqueta.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status da Etiqueta</label>
              <p className="text-sm">{pedido.etiqueta.status}</p>
            </div>
          </div>
          
          {pedido.etiqueta.url_pdf && (
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href={pedido.etiqueta.url_pdf} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Etiqueta PDF
                </a>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Notificação */}
      {pedido.notificacao && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Notificação WhatsApp</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-sm">{pedido.notificacao.status || 'Enviado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Enviado em</label>
                <p className="text-sm">
                  {pedido.notificacao.enviado_em ? 
                    new Date(pedido.notificacao.enviado_em).toLocaleString('pt-BR') : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
            {pedido.notificacao.mensagem && (
              <div>
                <label className="text-sm font-medium text-gray-500">Mensagem</label>
                <p className="text-sm mt-1 p-2 bg-white rounded border">
                  {pedido.notificacao.mensagem}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex space-x-2 pt-4 border-t">
        <Button 
          onClick={() => reenviarNotificacao(pedido.id)}
          disabled={reenviarLoading === pedido.id}
          variant="outline"
        >
          {reenviarLoading === pedido.id ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4 mr-2" />
          )}
          Reenviar Notificação
        </Button>
        
        {pedido.etiqueta?.tracking && (
          <Button asChild variant="outline">
            <a 
              href={`https://melhorenvio.com.br/rastrear/${pedido.etiqueta.tracking}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Truck className="h-4 w-4 mr-2" />
              Rastrear Pedido
            </a>
          </Button>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pedidos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pedidos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID do pedido ou nome do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pagamento_confirmado">Pagamento Confirmado</SelectItem>
                <SelectItem value="processando">Processando</SelectItem>
                <SelectItem value="processado">Processado</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={fetchPedidos} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <Card>
        <CardContent className="p-0">
          {filteredPedidos.length > 0 ? (
            <div className="divide-y">
              {filteredPedidos.map((pedido) => (
                <div key={pedido.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(pedido.status)}
                        <div>
                          <h3 className="font-semibold">Pedido #{pedido.id}</h3>
                          <p className="text-sm text-gray-600">{pedido.cliente?.nome}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>
                          {new Date(pedido.timestamp).toLocaleString('pt-BR')}
                        </span>
                        <span>
                          R$ {((pedido.valor || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {pedido.etiqueta?.tracking && (
                          <span className="font-mono text-xs">
                            {pedido.etiqueta.tracking}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(pedido.status)}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPedido(pedido)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pedido #{pedido.id}</DialogTitle>
                            <DialogDescription>
                              Informações completas do pedido e status de processamento
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPedido && <PedidoDetalhes pedido={selectedPedido} />}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Aguardando novos pedidos...'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Pedidos
