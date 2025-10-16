import { useState, useEffect } from 'react'
import { 
  Package, 
  AlertTriangle, 
  Edit, 
  Save, 
  X, 
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus
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
import { Label } from '@/components/ui/label'

const Estoque = ({ apiUrl }) => {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [newStock, setNewStock] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchEstoque()
  }, [])

  const fetchEstoque = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/estoque`)
      const data = await response.json()
      setProdutos(data.produtos || [])
    } catch (error) {
      console.error('Erro ao buscar estoque:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEstoque = async (sku, novoEstoque) => {
    try {
      setUpdating(sku)
      const response = await fetch(`${apiUrl}/estoque/${sku}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estoque: parseInt(novoEstoque) })
      })

      if (response.ok) {
        await fetchEstoque() // Recarregar dados
        setEditingProduct(null)
        setNewStock('')
      } else {
        const error = await response.json()
        alert(`Erro ao atualizar estoque: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error)
      alert('Erro ao atualizar estoque')
    } finally {
      setUpdating(null)
    }
  }

  const adjustStock = async (sku, currentStock, adjustment) => {
    const newStock = Math.max(0, currentStock + adjustment)
    await updateEstoque(sku, newStock)
  }

  const getStockStatus = (estoque) => {
    if (estoque === 0) {
      return { 
        label: 'Esgotado', 
        color: 'bg-red-100 text-red-800',
        icon: <X className="h-3 w-3" />
      }
    } else if (estoque <= 3) {
      return { 
        label: 'Estoque Baixo', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertTriangle className="h-3 w-3" />
      }
    } else if (estoque <= 10) {
      return { 
        label: 'Estoque Médio', 
        color: 'bg-blue-100 text-blue-800',
        icon: <TrendingDown className="h-3 w-3" />
      }
    } else {
      return { 
        label: 'Estoque Alto', 
        color: 'bg-green-100 text-green-800',
        icon: <TrendingUp className="h-3 w-3" />
      }
    }
  }

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalProdutos = produtos.length
  const produtosComEstoqueBaixo = produtos.filter(p => p.estoque <= 3).length
  const produtosEsgotados = produtos.filter(p => p.estoque === 0).length
  const estoqueTotal = produtos.reduce((total, p) => total + p.estoque, 0)

  const EditStockDialog = ({ produto }) => {
    const [tempStock, setTempStock] = useState(produto.estoque.toString())
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Estoque</DialogTitle>
            <DialogDescription>
              Atualize a quantidade em estoque para {produto.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={produto.sku} disabled />
            </div>
            
            <div>
              <Label htmlFor="nome">Produto</Label>
              <Input id="nome" value={produto.nome} disabled />
            </div>
            
            <div>
              <Label htmlFor="estoque-atual">Estoque Atual</Label>
              <Input id="estoque-atual" value={produto.estoque} disabled />
            </div>
            
            <div>
              <Label htmlFor="novo-estoque">Novo Estoque</Label>
              <Input
                id="novo-estoque"
                type="number"
                min="0"
                value={tempStock}
                onChange={(e) => setTempStock(e.target.value)}
                placeholder="Digite a nova quantidade"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => updateEstoque(produto.sku, tempStock)}
                disabled={updating === produto.sku || !tempStock}
              >
                {updating === produto.sku ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
      {/* Métricas do Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-gray-500">Produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estoqueTotal}</div>
            <p className="text-xs text-gray-500">Unidades em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosComEstoqueBaixo}</div>
            <p className="text-xs text-gray-500">Produtos ≤ 3 unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esgotados</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosEsgotados}</div>
            <p className="text-xs text-gray-500">Produtos sem estoque</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Controle de Estoque</CardTitle>
          <CardDescription>
            Gerencie o estoque dos seus produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button onClick={fetchEstoque} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardContent className="p-0">
          {filteredProdutos.length > 0 ? (
            <div className="divide-y">
              {filteredProdutos.map((produto) => {
                const status = getStockStatus(produto.estoque)
                
                return (
                  <div key={produto.sku} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-semibold">{produto.nome}</h3>
                            <p className="text-sm text-gray-600">SKU: {produto.sku}</p>
                            <p className="text-xs text-gray-500">Peso: {produto.peso}kg</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Status Badge */}
                        <Badge className={status.color}>
                          {status.icon}
                          <span className="ml-1">{status.label}</span>
                        </Badge>
                        
                        {/* Quantidade */}
                        <div className="text-center">
                          <div className="text-2xl font-bold">{produto.estoque}</div>
                          <div className="text-xs text-gray-500">unidades</div>
                        </div>
                        
                        {/* Controles Rápidos */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustStock(produto.sku, produto.estoque, -1)}
                            disabled={produto.estoque === 0 || updating === produto.sku}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustStock(produto.sku, produto.estoque, 1)}
                            disabled={updating === produto.sku}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          
                          <EditStockDialog produto={produto} />
                        </div>
                      </div>
                    </div>
                    
                    {updating === produto.sku && (
                      <div className="mt-3 flex items-center text-sm text-blue-600">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Atualizando estoque...
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar o termo de busca' 
                  : 'Nenhum produto cadastrado no sistema'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produtos com Estoque Baixo */}
      {produtosComEstoqueBaixo > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Atenção: Produtos com Estoque Baixo
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Os seguintes produtos precisam de reposição urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {produtos
                .filter(p => p.estoque <= 3)
                .map((produto) => (
                  <div key={produto.sku} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-sm text-gray-600">SKU: {produto.sku}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={produto.estoque === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {produto.estoque} unidades
                      </Badge>
                      <EditStockDialog produto={produto} />
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

export default Estoque
