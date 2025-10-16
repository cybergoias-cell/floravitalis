import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Autenticação
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, userToken) => {
        localStorage.setItem('user_token', userToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        set({
          user: userData,
          token: userToken,
          isAuthenticated: true
        });
      },

      logout: () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          cart: [] // Limpar carrinho ao fazer logout
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('user_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({
              user,
              token,
              isAuthenticated: true
            });
          } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_data');
          }
        }
      },

      // Produtos
      products: [
        {
          id: 'WHEY001',
          name: 'Whey Protein Concentrado 1kg',
          description: 'Whey protein de alta qualidade para ganho de massa muscular. Rico em aminoácidos essenciais.',
          price: 89.90,
          originalPrice: 119.90,
          image: '/api/placeholder/400/400',
          category: 'proteinas',
          brand: 'SuplementsStore',
          rating: 4.8,
          reviews: 156,
          stock: 13,
          weight: 1.2,
          features: [
            '25g de proteína por dose',
            'Rico em BCAA',
            'Fácil digestão',
            'Sabor chocolate'
          ],
          nutritionalInfo: {
            serving: '30g',
            protein: '25g',
            carbs: '2g',
            fat: '1g',
            calories: '120'
          }
        },
        {
          id: 'CREAT001',
          name: 'Creatina Monohidratada 300g',
          description: 'Creatina pura para aumento de força e performance nos treinos. Produto nacional de alta qualidade.',
          price: 49.90,
          originalPrice: 69.90,
          image: '/api/placeholder/400/400',
          category: 'creatina',
          brand: 'SuplementsStore',
          rating: 4.9,
          reviews: 89,
          stock: 6,
          weight: 0.4,
          features: [
            '100% pura',
            'Sem sabor',
            'Fácil mistura',
            'Testada em laboratório'
          ],
          nutritionalInfo: {
            serving: '3g',
            creatine: '3g',
            carbs: '0g',
            fat: '0g',
            calories: '0'
          }
        },
        {
          id: 'BCAA003',
          name: 'BCAA 2:1:1 120 cápsulas',
          description: 'Aminoácidos de cadeia ramificada para recuperação muscular e redução do catabolismo.',
          price: 39.90,
          originalPrice: 59.90,
          image: '/api/placeholder/400/400',
          category: 'aminoacidos',
          brand: 'SuplementsStore',
          rating: 4.7,
          reviews: 203,
          stock: 5,
          weight: 0.3,
          features: [
            'Proporção 2:1:1',
            '120 cápsulas',
            'Fácil consumo',
            'Recuperação muscular'
          ],
          nutritionalInfo: {
            serving: '3 cápsulas',
            leucine: '1000mg',
            isoleucine: '500mg',
            valine: '500mg',
            calories: '8'
          }
        }
      ],

      // Carrinho
      cart: [],
      
      // Adicionar produto ao carrinho
      addToCart: (product, quantity = 1) => {
        const cart = get().cart
        const existingItem = cart.find(item => item.id === product.id)
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            cart: [...cart, { ...product, quantity }]
          })
        }
      },

      // Remover produto do carrinho
      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter(item => item.id !== productId)
        })
      },

      // Atualizar quantidade no carrinho
      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        
        set({
          cart: get().cart.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },

      // Limpar carrinho
      clearCart: () => {
        set({ cart: [] })
      },

      // Calcular total do carrinho
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      // Calcular quantidade total de itens
      getCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },

      // Filtros
      filters: {
        category: 'all',
        priceRange: [0, 200],
        sortBy: 'name'
      },

      setFilters: (newFilters) => {
        set({
          filters: { ...get().filters, ...newFilters }
        })
      },

      // Busca
      searchQuery: '',
      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      // Produtos filtrados
      getFilteredProducts: () => {
        const { products, filters, searchQuery } = get()
        let filtered = [...products]

        // Filtro por categoria
        if (filters.category !== 'all') {
          filtered = filtered.filter(product => product.category === filters.category)
        }

        // Filtro por preço
        filtered = filtered.filter(product => 
          product.price >= filters.priceRange[0] && 
          product.price <= filters.priceRange[1]
        )

        // Filtro por busca
        if (searchQuery) {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        // Ordenação
        switch (filters.sortBy) {
          case 'price-low':
            filtered.sort((a, b) => a.price - b.price)
            break
          case 'price-high':
            filtered.sort((a, b) => b.price - a.price)
            break
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating)
            break
          case 'name':
          default:
            filtered.sort((a, b) => a.name.localeCompare(b.name))
            break
        }

        return filtered
      }
    }),
    {
      name: 'supplements-store',
      partialize: (state) => ({ cart: state.cart })
    }
  )
)

export default useStore
