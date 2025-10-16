import { useState, useEffect } from 'react';
import { Package, Search, Filter, Edit, Trash2, Plus, Eye, DollarSign, Weight, Star } from 'lucide-react';

const Produtos = ({ apiUrl, token }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Categorias disponíveis
  const categorias = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'proteinas', label: 'Proteínas' },
    { value: 'creatina', label: 'Creatina' },
    { value: 'aminoacidos', label: 'Aminoácidos' },
    { value: 'vitaminas', label: 'Vitaminas' },
    { value: 'queimadores', label: 'Queimadores' }
  ];

  // Carregar produtos
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/admin/produtos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProdutos(data.produtos || []);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      carregarProdutos();
    }
  }, [apiUrl, token]);

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const matchSearch = produto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategory = filterCategory === 'all' || produto.category === filterCategory;

    return matchSearch && matchCategory;
  });

  // Criar produto
  const criarProduto = async (produtoData) => {
    try {
      const response = await fetch(`${apiUrl}/admin/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produtoData)
      });

      if (response.ok) {
        await carregarProdutos();
        setShowCreateModal(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao criar produto');
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setError('Erro de conexão');
    }
  };

  // Atualizar produto
  const atualizarProduto = async (produtoId, updates) => {
    try {
      const response = await fetch(`${apiUrl}/admin/produtos/${produtoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await carregarProdutos();
        setShowEditModal(false);
        setEditingProduct(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar produto');
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setError('Erro de conexão');
    }
  };

  // Deletar produto
  const deletarProduto = async (produtoId) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/produtos/${produtoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await carregarProdutos();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setError('Erro de conexão');
    }
  };

  // Atualizar estoque
  const atualizarEstoque = async (produtoId, novoEstoque) => {
    try {
      const response = await fetch(`${apiUrl}/admin/produtos/${produtoId}/estoque`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estoque: parseInt(novoEstoque) })
      });

      if (response.ok) {
        await carregarProdutos();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar estoque');
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      setError('Erro de conexão');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCategoryLabel = (category) => {
    const cat = categorias.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600 bg-red-100', label: 'Sem Estoque' };
    if (stock <= 5) return { color: 'text-yellow-600 bg-yellow-100', label: 'Estoque Baixo' };
    return { color: 'text-green-600 bg-green-100', label: 'Em Estoque' };
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos da loja</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Produtos</p>
              <p className="text-2xl font-semibold text-gray-900">{produtos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(produtos.reduce((total, p) => total + (p.price * p.estoque_atual), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Em Estoque</p>
              <p className="text-2xl font-semibold text-gray-900">
                {produtos.filter(p => p.estoque_atual > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(produtos.reduce((total, p) => total + p.rating, 0) / produtos.length || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, descrição ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <button
              onClick={carregarProdutos}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => {
                  const stockStatus = getStockStatus(produto.estoque_atual);
                  return (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {produto.name}
                          </div>
                          <div className="text-sm text-gray-500">{produto.brand}</div>
                          <div className="text-xs text-gray-400">ID: {produto.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-blue-800 bg-blue-100">
                          {getCategoryLabel(produto.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(produto.price)}
                        </div>
                        {produto.originalPrice > produto.price && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(produto.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                            {produto.estoque_atual} un.
                          </span>
                          <input
                            type="number"
                            min="0"
                            defaultValue={produto.estoque_atual}
                            onBlur={(e) => {
                              if (e.target.value !== produto.estoque_atual.toString()) {
                                atualizarEstoque(produto.id, e.target.value);
                              }
                            }}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{produto.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({produto.reviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(produto);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar produto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletarProduto(produto.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <ProductModal
          title="Criar Novo Produto"
          onSave={criarProduto}
          onClose={() => setShowCreateModal(false)}
          categorias={categorias}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <ProductModal
          title="Editar Produto"
          produto={editingProduct}
          onSave={(data) => atualizarProduto(editingProduct.id, data)}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          categorias={categorias}
        />
      )}
    </div>
  );
};

// Modal Component for Create/Edit
const ProductModal = ({ title, produto, onSave, onClose, categorias }) => {
  const [formData, setFormData] = useState({
    name: produto?.name || '',
    description: produto?.description || '',
    price: produto?.price || '',
    originalPrice: produto?.originalPrice || '',
    category: produto?.category || 'proteinas',
    brand: produto?.brand || 'SuplementsStore',
    stock: produto?.estoque_atual || 0,
    weight: produto?.weight || 0.5,
    features: produto?.features?.join('\n') || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim())
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Original
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categorias.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estoque Inicial
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Características (uma por linha)
              </label>
              <textarea
                rows={4}
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="25g de proteína por dose&#10;Rico em BCAA&#10;Fácil digestão"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
