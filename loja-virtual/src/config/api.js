// Configuração da API para integração com o backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.suplementsstore.com' 
  : 'http://localhost:3000'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Produtos
  async getProducts() {
    return this.request('/api/produtos')
  }

  async getProduct(id) {
    return this.request(`/api/produtos/${id}`)
  }

  async searchProducts(query) {
    return this.request(`/api/produtos/buscar?q=${encodeURIComponent(query)}`)
  }

  // Pedidos
  async createOrder(orderData) {
    return this.request('/webhook/pagseguro', {
      method: 'POST',
      body: JSON.stringify({
        reference: `PED${Date.now()}`,
        status: 'PAID',
        amount: orderData.totals.total,
        customer: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone
        },
        address: {
          street: orderData.address.street,
          number: orderData.address.number,
          complement: orderData.address.complement,
          neighborhood: orderData.address.neighborhood,
          city: orderData.address.city,
          state: orderData.address.state,
          zipCode: orderData.address.zipCode
        },
        items: orderData.items
      })
    })
  }

  async getOrder(orderId) {
    return this.request(`/pedidos/${orderId}`)
  }

  async trackOrder(orderId) {
    return this.request(`/pedidos/${orderId}/rastreamento`)
  }

  // CEP
  async getAddressByZipCode(zipCode) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      throw error
    }
  }

  // Frete
  async calculateShipping(zipCode, items) {
    return this.request('/api/frete/calcular', {
      method: 'POST',
      body: JSON.stringify({
        cep_destino: zipCode,
        produtos: items.map(item => ({
          sku: item.id,
          quantidade: item.quantity
        }))
      })
    })
  }

  // Newsletter
  async subscribeNewsletter(email) {
    return this.request('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }

  // Contato
  async sendContactMessage(data) {
    return this.request('/api/contato', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// Instância singleton
const apiService = new ApiService()

// Funções de conveniência
export const api = {
  // Produtos
  getProducts: () => apiService.getProducts(),
  getProduct: (id) => apiService.getProduct(id),
  searchProducts: (query) => apiService.searchProducts(query),
  
  // Pedidos
  createOrder: (orderData) => apiService.createOrder(orderData),
  getOrder: (orderId) => apiService.getOrder(orderId),
  trackOrder: (orderId) => apiService.trackOrder(orderId),
  
  // Utilitários
  getAddressByZipCode: (zipCode) => apiService.getAddressByZipCode(zipCode),
  calculateShipping: (zipCode, items) => apiService.calculateShipping(zipCode, items),
  subscribeNewsletter: (email) => apiService.subscribeNewsletter(email),
  sendContactMessage: (data) => apiService.sendContactMessage(data)
}

export default apiService
