// Configuração da API
export const API_CONFIG = {
  // URL base da API - ajustar conforme o ambiente
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://sua-api-producao.com' 
    : 'http://localhost:3000',
  
  // Timeout para requisições (em ms)
  timeout: 10000,
  
  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`
  
  const config = {
    timeout: API_CONFIG.timeout,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers
    },
    ...options
  }
  
  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error)
    throw error
  }
}

// Endpoints específicos
export const API_ENDPOINTS = {
  // Pedidos
  pedidos: '/pedidos',
  pedido: (id) => `/pedidos/${id}`,
  reenviarNotificacao: (id) => `/pedidos/${id}/reenviar-notificacao`,
  
  // Estoque
  estoque: '/estoque',
  atualizarEstoque: (sku) => `/estoque/${sku}`,
  
  // Alertas
  alertasEstoqueBaixo: '/alertas/estoque-baixo',
  
  // Sistema
  health: '/health'
}
