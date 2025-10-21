// Endpoints adicionais para integração com a loja virtual
// Adicionar ao arquivo index.js existente

// Produtos da loja (expandido do produtos.json)
const produtosLoja = [
  {
    id: 'WHEY001',
    name: 'Whey Protein Concentrado 1kg',
    description: 'Whey protein de alta qualidade para ganho de massa muscular. Rico em aminoácidos essenciais.',
    price: 89.90,
    originalPrice: 119.90,
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
    },
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ]
  },
  {
    id: 'CREAT001',
    name: 'Creatina Monohidratada 300g',
    description: 'Creatina pura para aumento de força e performance nos treinos. Produto nacional de alta qualidade.',
    price: 49.90,
    originalPrice: 69.90,
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
    },
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ]
  },
  {
    id: 'BCAA003',
    name: 'BCAA 2:1:1 120 cápsulas',
    description: 'Aminoácidos de cadeia ramificada para recuperação muscular e redução do catabolismo.',
    price: 39.90,
    originalPrice: 59.90,
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
    },
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ]
  },
  // Produtos adicionais para a loja
  {
    id: 'GLUT001',
    name: 'Glutamina 300g',
    description: 'L-Glutamina pura para recuperação muscular e fortalecimento do sistema imunológico.',
    price: 45.90,
    originalPrice: 65.90,
    category: 'aminoacidos',
    brand: 'SuplementsStore',
    rating: 4.6,
    reviews: 78,
    stock: 8,
    weight: 0.35,
    features: [
      'L-Glutamina pura',
      'Recuperação muscular',
      'Fortalece imunidade',
      'Sem sabor'
    ],
    nutritionalInfo: {
      serving: '5g',
      glutamine: '5g',
      carbs: '0g',
      fat: '0g',
      calories: '0'
    },
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ]
  },
  {
    id: 'VITA001',
    name: 'Multivitamínico 60 cápsulas',
    description: 'Complexo vitamínico completo com minerais essenciais para saúde e performance.',
    price: 35.90,
    originalPrice: 49.90,
    category: 'vitaminas',
    brand: 'SuplementsStore',
    rating: 4.5,
    reviews: 124,
    stock: 15,
    weight: 0.2,
    features: [
      '26 vitaminas e minerais',
      '60 cápsulas',
      'Fórmula completa',
      'Absorção otimizada'
    ],
    nutritionalInfo: {
      serving: '1 cápsula',
      vitamins: 'Complexo completo',
      minerals: 'Essenciais',
      calories: '2'
    },
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ]
  },
  {
    id: 'BURN001',
    name: 'Termogênico 60 cápsulas',
    description: 'Queimador de gordura natural com cafeína e extratos vegetais para acelerar o metabolismo.',
    price: 55.90,
    originalPrice: 79.90,
    category: 'queimadores',
    brand: 'SuplementsStore',
    rating: 4.4,
    reviews: 95,
    stock: 7,
    weight: 0.25,
    features: [
      'Acelera metabolismo',
      'Queima gordura',
      'Aumenta energia',
      'Ingredientes naturais'
    ],
    nutritionalInfo: {
      serving: '2 cápsulas',
      caffeine: '200mg',
      extracts: 'Vegetais',
      calories: '5'
    },
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ]
  }
]

// Endpoints da API da loja
app.get('/api/produtos', (req, res) => {
  try {
    const { category, search, sortBy, minPrice, maxPrice } = req.query
    let produtos = [...produtosLoja]

    // Filtro por categoria
    if (category && category !== 'all') {
      produtos = produtos.filter(p => p.category === category)
    }

    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase()
      produtos = produtos.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por preço
    if (minPrice) {
      produtos = produtos.filter(p => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      produtos = produtos.filter(p => p.price <= parseFloat(maxPrice))
    }

    // Ordenação
    switch (sortBy) {
      case 'price-low':
        produtos.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        produtos.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        produtos.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
      default:
        produtos.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    res.json({
      success: true,
      produtos,
      total: produtos.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos'
    })
  }
})

app.get('/api/produtos/:id', (req, res) => {
  try {
    const produto = produtosLoja.find(p => p.id === req.params.id)
    
    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      })
    }

    res.json({
      success: true,
      produto
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto'
    })
  }
})

app.get('/api/produtos/buscar', (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.json({
        success: true,
        produtos: [],
        total: 0
      })
    }

    const searchLower = q.toLowerCase()
    const produtos = produtosLoja.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.features.some(f => f.toLowerCase().includes(searchLower))
    )

    res.json({
      success: true,
      produtos,
      total: produtos.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro na busca'
    })
  }
})

// Cálculo de frete
app.post('/api/frete/calcular', (req, res) => {
  try {
    const { cep_destino, produtos } = req.body
    
    // Simular cálculo de frete
    let pesoTotal = 0
    let valorTotal = 0
    
    produtos.forEach(item => {
      const produto = produtosLoja.find(p => p.id === item.sku)
      if (produto) {
        pesoTotal += produto.weight * item.quantidade
        valorTotal += produto.price * item.quantidade
      }
    })

    // Frete grátis acima de R$ 99
    const freteGratis = valorTotal >= 99
    const valorFrete = freteGratis ? 0 : 15.90
    const prazoEntrega = freteGratis ? '2-3 dias úteis' : '3-5 dias úteis'

    res.json({
      success: true,
      frete: {
        valor: valorFrete,
        prazo: prazoEntrega,
        gratis: freteGratis,
        peso_total: pesoTotal,
        valor_total: valorTotal
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao calcular frete'
    })
  }
})

// Newsletter
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email } = req.body
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      })
    }

    // Aqui você salvaria no banco de dados
    console.log('Newsletter subscription:', email)

    res.json({
      success: true,
      message: 'Inscrição realizada com sucesso!'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao inscrever no newsletter'
    })
  }
})

// Contato
app.post('/api/contato', (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body
    
    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios não preenchidos'
      })
    }

    // Aqui você processaria a mensagem de contato
    console.log('Mensagem de contato:', { nome, email, assunto, mensagem })

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso!'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem'
    })
  }
})

// Rastreamento de pedido
app.get('/pedidos/:id/rastreamento', (req, res) => {
  try {
    const pedidoId = req.params.id
    
    // Simular dados de rastreamento
    const rastreamento = {
      codigo: 'BR175978197996BBR',
      status: 'Em trânsito',
      eventos: [
        {
          data: new Date().toISOString(),
          status: 'Objeto postado',
          local: 'São Paulo - SP'
        },
        {
          data: new Date(Date.now() - 86400000).toISOString(),
          status: 'Objeto em trânsito',
          local: 'Centro de Distribuição - SP'
        },
        {
          data: new Date(Date.now() - 172800000).toISOString(),
          status: 'Objeto saiu para entrega',
          local: 'Unidade de Entrega - SP'
        }
      ]
    }

    res.json({
      success: true,
      rastreamento
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar rastreamento'
    })
  }
})

// Placeholder para imagens
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params
  const { text } = req.query
  
  // Redirecionar para serviço de placeholder
  res.redirect(`https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(text || 'Produto')}`)
})
