import { useState, useEffect } from 'react';
import { Image, Upload, Settings, Eye, EyeOff, Trash2, Edit, Move, Plus, Save } from 'lucide-react';

const Personalizacao = ({ apiUrl, token }) => {
  const [configuracoes, setConfiguracoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Carregar configurações
  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/configuracoes-visuais`);
      
      if (response.ok) {
        const data = await response.json();
        setConfiguracoes(data.configuracoes);
      } else {
        setError('Erro ao carregar configurações');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConfiguracoes();
  }, [apiUrl]);

  // Upload de logo
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('alt', 'Logo da loja');

    try {
      const response = await fetch(`${apiUrl}/admin/upload-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        await carregarConfiguracoes();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao fazer upload da logo');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro de conexão');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Upload de banner
  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingBanner(true);
    const formData = new FormData();
    formData.append('banner', file);
    formData.append('alt', 'Banner promocional');

    try {
      const response = await fetch(`${apiUrl}/admin/upload-banner`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        await carregarConfiguracoes();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao fazer upload do banner');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro de conexão');
    } finally {
      setUploadingBanner(false);
    }
  };

  // Atualizar banner
  const atualizarBanner = async (bannerId, updates) => {
    try {
      const response = await fetch(`${apiUrl}/admin/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await carregarConfiguracoes();
        setShowBannerModal(false);
        setEditingBanner(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar banner');
      }
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      setError('Erro de conexão');
    }
  };

  // Deletar banner
  const deletarBanner = async (bannerId) => {
    if (!confirm('Tem certeza que deseja remover este banner?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await carregarConfiguracoes();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao deletar banner');
      }
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
      setError('Erro de conexão');
    }
  };

  // Atualizar configurações do carrossel
  const atualizarCarrossel = async (updates) => {
    try {
      const response = await fetch(`${apiUrl}/admin/carrossel-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await carregarConfiguracoes();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar configurações');
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      setError('Erro de conexão');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!configuracoes) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar configurações</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personalização Visual</h1>
          <p className="text-gray-600">Gerencie a logo e banners da loja virtual</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Logo da Loja</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Logo Atual</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <img
                src={`${apiUrl}${configuracoes.logo.url}`}
                alt={configuracoes.logo.alt}
                className="mx-auto max-h-20 object-contain"
                onError={(e) => {
                  e.target.src = '/api/placeholder/200/80?text=Logo';
                }}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Alterar Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className={`cursor-pointer flex flex-col items-center ${uploadingLogo ? 'opacity-50' : ''}`}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploadingLogo ? 'Enviando...' : 'Clique para enviar nova logo'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF até 5MB
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Carousel Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Carrossel de Banners</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={configuracoes.banners.enabled}
                onChange={(e) => atualizarCarrossel({ enabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Exibir carrossel</span>
            </label>
          </div>
        </div>

        {/* Carousel Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={configuracoes.banners.autoplay}
                onChange={(e) => atualizarCarrossel({ autoplay: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Reprodução automática</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo (ms)
            </label>
            <input
              type="number"
              min="1000"
              max="10000"
              step="1000"
              value={configuracoes.banners.interval}
              onChange={(e) => atualizarCarrossel({ interval: parseInt(e.target.value) })}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <span className="text-sm text-gray-500">
              {configuracoes.banners.items.length}/5 banners
            </span>
          </div>
        </div>

        {/* Add Banner Button */}
        {configuracoes.banners.items.length < 5 && (
          <div className="mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              disabled={uploadingBanner}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className={`inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${uploadingBanner ? 'opacity-50' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              {uploadingBanner ? 'Enviando...' : 'Adicionar Banner'}
            </label>
          </div>
        )}

        {/* Banners List */}
        <div className="space-y-4">
          {configuracoes.banners.items.map((banner, index) => (
            <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    Banner {index + 1}
                  </span>
                  <button
                    onClick={() => atualizarBanner(banner.id, { active: !banner.active })}
                    className={`p-1 rounded ${banner.active ? 'text-green-600' : 'text-gray-400'}`}
                    title={banner.active ? 'Desativar' : 'Ativar'}
                  >
                    {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setShowBannerModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletarBanner(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <img
                    src={`${apiUrl}${banner.url}`}
                    alt={banner.alt}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/100?text=Banner';
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{banner.title || 'Sem título'}</p>
                    <p className="text-sm text-gray-600">{banner.subtitle || 'Sem subtítulo'}</p>
                    <p className="text-xs text-gray-500">Link: {banner.link || 'Nenhum'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {configuracoes.banners.items.length === 0 && (
          <div className="text-center py-8">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum banner adicionado</p>
          </div>
        )}
      </div>

      {/* Banner Edit Modal */}
      {showBannerModal && editingBanner && (
        <BannerModal
          banner={editingBanner}
          onSave={atualizarBanner}
          onClose={() => {
            setShowBannerModal(false);
            setEditingBanner(null);
          }}
        />
      )}
    </div>
  );
};

// Modal Component for Banner Edit
const BannerModal = ({ banner, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    link: banner.link || '',
    alt: banner.alt || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(banner.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Banner</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título do banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Subtítulo do banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link (opcional)
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/produtos ou https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto alternativo
              </label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => setFormData({...formData, alt: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição da imagem"
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

export default Personalizacao;
