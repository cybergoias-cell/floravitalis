require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware CORS para permitir requisições do frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Servir arquivos estáticos
app.use(express.static('public'));

// Configurações de autenticação
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_2024';
const JWT_EXPIRES_IN = '24h';

// Carregar dados
let produtos = JSON.parse(fs.readFileSync('produtos.json', 'utf8'));
let usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf8'));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Função para salvar usuários
const salvarUsuarios = () => {
  fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));
};

// Produtos da loja (expandido)
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
    }
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
    }
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
    }
  },
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
    }
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
    }
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
    }
  }
];

// Armazenar pedidos em memória (em produção usar banco de dados)
const pedidos = {};

// Webhook do PagSeguro
app.post('/webhook/pagseguro', async (req, res) => {
  try {
    console.log('Webhook PagSeguro recebido:', req.body);
    
    // Extrair dados do pagamento
    const { 
      id: pedidoId, 
      amount: valor, 
      customer, 
      items 
    } = req.body;

    // Validar se pagamento foi aprovado
    if (req.body.status !== 'PAID') {
      return res.status(200).json({ message: 'Pagamento não aprovado ainda' });
    }

    // Extrair dados do cliente
    const cliente = {
      nome: customer.name,
      email: customer.email,
      telefone: customer.phone,
      endereco: {
        rua: customer.address.street,
        numero: customer.address.number,
        complemento: customer.address.complement || '',
        bairro: customer.address.district,
        cidade: customer.address.city,
        estado: customer.address.state,
        cep: customer.address.postal_code
      }
    };

    // Extrair produtos do pedido
    const produtosPedido = items.map(item => ({
      sku: item.reference_id,
      nome: item.name,
      quantidade: item.quantity
    }));

    // Salvar pedido
    pedidos[pedidoId] = {
      id: pedidoId,
      valor,
      cliente,
      produtos: produtosPedido,
      status: 'pagamento_confirmado',
      timestamp: new Date().toISOString()
    };

    console.log(`Pedido ${pedidoId} salvo com sucesso`);

    // Processar automação
    await processarPedido(pedidoId);

    res.status(200).json({ message: 'Webhook processado com sucesso' });
  } catch (error) {
    console.error('Erro no webhook PagSeguro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função principal de processamento do pedido
async function processarPedido(pedidoId) {
  try {
    console.log(`Iniciando processamento do pedido ${pedidoId}`);
    
    const pedido = pedidos[pedidoId];
    
    // 1. Gerar etiqueta de envio
    await gerarEtiquetaEnvio(pedidoId);
    
    // 2. Atualizar estoque
    await atualizarEstoque(pedido.produtos);
    
    // 3. Notificar cliente
    await notificarCliente(pedidoId);
    
    // 4. Atualizar status do pedido
    pedidos[pedidoId].status = 'processado';
    
    console.log(`Pedido ${pedidoId} processado com sucesso`);
  } catch (error) {
    console.error(`Erro ao processar pedido ${pedidoId}:`, error);
    pedidos[pedidoId].status = 'erro';
  }
}

// Gerar etiqueta de envio via Melhor Envio
async function gerarEtiquetaEnvio(pedidoId) {
  try {
    console.log(`Gerando etiqueta para pedido ${pedidoId}`);
    
    const pedido = pedidos[pedidoId];
    
    // Calcular peso total
    let pesoTotal = 0;
    for (const item of pedido.produtos) {
      const produto = produtos[item.sku];
      if (produto) {
        pesoTotal += produto.peso * item.quantidade;
      }
    }
    
    // Dados para a API Melhor Envio (sandbox)
    const dadosEnvio = {
      service: 1, // PAC
      agency: 49, // Agência dos Correios
      from: {
        name: process.env.REMETENTE_NOME || "Distribuidora Suplementos",
        phone: process.env.REMETENTE_TELEFONE || "11999999999",
        email: process.env.REMETENTE_EMAIL || "contato@distribuidora.com",
        document: process.env.REMETENTE_CNPJ || "12345678000199",
        company_document: process.env.REMETENTE_CNPJ || "12345678000199",
        state_register: process.env.REMETENTE_IE || "123456789",
        address: process.env.REMETENTE_ENDERECO || "Rua das Empresas, 123",
        complement: process.env.REMETENTE_COMPLEMENTO || "",
        number: process.env.REMETENTE_NUMERO || "123",
        district: process.env.REMETENTE_BAIRRO || "Centro",
        city: process.env.REMETENTE_CIDADE || "São Paulo",
        country_id: "BR",
        postal_code: process.env.REMETENTE_CEP || "01000000",
        note: ""
      },
      to: {
        name: pedido.cliente.nome,
        phone: pedido.cliente.telefone,
        email: pedido.cliente.email,
        document: "00000000000", // CPF padrão para teste
        address: pedido.cliente.endereco.rua,
        complement: pedido.cliente.endereco.complemento,
        number: pedido.cliente.endereco.numero,
        district: pedido.cliente.endereco.bairro,
        city: pedido.cliente.endereco.cidade,
        state_abbr: pedido.cliente.endereco.estado,
        country_id: "BR",
        postal_code: pedido.cliente.endereco.cep,
        note: ""
      },
      products: pedido.produtos.map(item => ({
        name: item.nome,
        quantity: item.quantidade,
        unitary_value: 10.00 // Valor unitário padrão para cálculo
      })),
      volumes: [{
        height: 10,
        width: 20,
        length: 30,
        weight: pesoTotal
      }],
      options: {
        insurance_value: pedido.valor / 100, // Converter centavos para reais
        receipt: false,
        own_hand: false,
        reverse: false,
        non_commercial: false,
        invoice: {
          key: pedidoId
        },
        platform: "Sistema Automação Entrega"
      }
    };

    // Fazer requisição para Melhor Envio (sandbox)
    const response = await axios.post(
      'https://sandbox.melhorenvio.com.br/api/v2/me/cart',
      dadosEnvio,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Sistema Automação Entrega'
        }
      }
    );

    const etiqueta = response.data;
    
    // Salvar dados da etiqueta no pedido
    pedidos[pedidoId].etiqueta = {
      id: etiqueta.id,
      protocol: etiqueta.protocol,
      tracking: etiqueta.tracking,
      price: etiqueta.price,
      status: etiqueta.status,
      created_at: etiqueta.created_at
    };

    // Comprar a etiqueta (necessário para gerar o PDF)
    await axios.post(
      `https://sandbox.melhorenvio.com.br/api/v2/me/shipment/checkout`,
      { orders: [etiqueta.id] },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Gerar etiqueta PDF
    const pdfResponse = await axios.post(
      `https://sandbox.melhorenvio.com.br/api/v2/me/shipment/print`,
      { orders: [etiqueta.id] },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    pedidos[pedidoId].etiqueta.url_pdf = pdfResponse.data.url;
    
    console.log(`Etiqueta gerada para pedido ${pedidoId}: ${etiqueta.tracking}`);
    
  } catch (error) {
    console.error(`Erro ao gerar etiqueta para pedido ${pedidoId}:`, error.response?.data || error.message);
    
    // Em caso de erro, criar dados mock para continuar o fluxo
    pedidos[pedidoId].etiqueta = {
      id: `mock_${Date.now()}`,
      protocol: `MOCK${pedidoId}`,
      tracking: `BR${Date.now()}BR`,
      price: 15.50,
      status: 'posted',
      url_pdf: 'https://exemplo.com/etiqueta.pdf',
      created_at: new Date().toISOString()
    };
    
    console.log(`Usando dados mock para pedido ${pedidoId}`);
  }
}

async function atualizarEstoque(produtosPedido) {
  try {
    console.log('Atualizando estoque');
    
    const alertasEstoque = [];
    
    // Atualizar estoque de cada produto
    for (const item of produtosPedido) {
      const produto = produtos[item.sku];
      
      if (produto) {
        // Diminuir estoque
        produto.estoque -= item.quantidade;
        
        console.log(`${item.sku}: ${produto.estoque + item.quantidade} -> ${produto.estoque}`);
        
        // Verificar se estoque está baixo
        if (produto.estoque <= 3) {
          alertasEstoque.push({
            sku: item.sku,
            nome: produto.nome,
            estoque_atual: produto.estoque,
            timestamp: new Date().toISOString()
          });
        }
        
        // Evitar estoque negativo
        if (produto.estoque < 0) {
          produto.estoque = 0;
        }
      } else {
        console.warn(`Produto ${item.sku} não encontrado no estoque`);
      }
    }
    
    // Salvar produtos atualizados
    fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
    
    // Gravar alertas de estoque baixo
    if (alertasEstoque.length > 0) {
      const alertaTexto = alertasEstoque.map(alerta => 
        `[${alerta.timestamp}] ESTOQUE BAIXO - ${alerta.sku} (${alerta.nome}): ${alerta.estoque_atual} unidades restantes`
      ).join('\n') + '\n';
      
      fs.appendFileSync('estoque_baixo.txt', alertaTexto);
      
      console.log(`⚠️  ${alertasEstoque.length} produto(s) com estoque baixo registrado(s)`);
    }
    
    console.log('Estoque atualizado com sucesso');
    
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
  }
}

async function notificarCliente(pedidoId) {
  try {
    console.log(`Notificando cliente do pedido ${pedidoId}`);
    
    const pedido = pedidos[pedidoId];
    const etiqueta = pedido.etiqueta;
    
    if (!etiqueta || !etiqueta.tracking) {
      console.error(`Não foi possível notificar cliente: etiqueta não encontrada para pedido ${pedidoId}`);
      return;
    }
    
    // Formatar telefone para WhatsApp (remover caracteres especiais e adicionar código do país)
    let telefone = pedido.cliente.telefone.replace(/\D/g, '');
    if (!telefone.startsWith('55')) {
      telefone = '55' + telefone;
    }
    
    // Mensagem personalizada
    const mensagem = `Olá ${pedido.cliente.nome}, seu pedido ${pedidoId} foi enviado! Código de rastreamento: ${etiqueta.tracking}. Acompanhe em: https://melhorenvio.com.br/rastrear/${etiqueta.tracking}`;
    
    // Enviar via Twilio WhatsApp API
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        To: `whatsapp:+${telefone}`,
        Body: mensagem
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    // Salvar dados da notificação
    pedidos[pedidoId].notificacao = {
      sid: response.data.sid,
      status: response.data.status,
      enviado_em: new Date().toISOString(),
      telefone: telefone,
      mensagem: mensagem
    };
    
    console.log(`✅ Cliente notificado via WhatsApp para pedido ${pedidoId} (SID: ${response.data.sid})`);
    
  } catch (error) {
    console.error(`Erro ao notificar cliente do pedido ${pedidoId}:`, error.response?.data || error.message);
    
    // Em caso de erro, registrar tentativa
    pedidos[pedidoId].notificacao = {
      erro: error.response?.data || error.message,
      tentativa_em: new Date().toISOString(),
      status: 'falhou'
    };
    
    console.log(`❌ Falha na notificação do pedido ${pedidoId} - dados salvos para retry manual`);
  }
}

// Endpoints do painel admin

// Obter detalhes de um pedido específico
app.get('/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;
  const pedido = pedidos[pedidoId];
  
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  
  // Adicionar informações do estoque atual
  const response = {
    ...pedido,
    estoque_atual: {}
  };
  
  // Incluir estoque atual dos produtos do pedido
  pedido.produtos.forEach(item => {
    const produto = produtos[item.sku];
    if (produto) {
      response.estoque_atual[item.sku] = produto.estoque;
    }
  });
  
  res.json(response);
});

// Listar todos os pedidos com filtros opcionais
app.get('/pedidos', (req, res) => {
  let resultado = Object.values(pedidos);
  
  // Filtro por status
  if (req.query.status) {
    resultado = resultado.filter(pedido => pedido.status === req.query.status);
  }
  
  // Filtro por data (últimos N dias)
  if (req.query.dias) {
    const diasAtras = new Date();
    diasAtras.setDate(diasAtras.getDate() - parseInt(req.query.dias));
    resultado = resultado.filter(pedido => new Date(pedido.timestamp) >= diasAtras);
  }
  
  // Ordenar por data (mais recente primeiro)
  resultado.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json({
    total: resultado.length,
    pedidos: resultado
  });
});

// Endpoint para consultar estoque atual
app.get('/estoque', (req, res) => {
  const estoqueComAlertas = Object.entries(produtos).map(([sku, produto]) => ({
    sku,
    nome: produto.nome,
    peso: produto.peso,
    estoque: produto.estoque,
    alerta_estoque_baixo: produto.estoque <= 3
  }));
  
  res.json({
    produtos: estoqueComAlertas,
    alertas: estoqueComAlertas.filter(p => p.alerta_estoque_baixo).length
  });
});

// Endpoint para reenviar notificação WhatsApp
app.post('/pedidos/:id/reenviar-notificacao', async (req, res) => {
  const pedidoId = req.params.id;
  const pedido = pedidos[pedidoId];
  
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  
  try {
    await notificarCliente(pedidoId);
    res.json({ message: 'Notificação reenviada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao reenviar notificação' });
  }
});

// Endpoint para atualizar estoque manualmente
app.put('/estoque/:sku', (req, res) => {
  const sku = req.params.sku;
  const { estoque } = req.body;
  
  if (!produtos[sku]) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  if (typeof estoque !== 'number' || estoque < 0) {
    return res.status(400).json({ error: 'Estoque deve ser um número positivo' });
  }
  
  const estoqueAnterior = produtos[sku].estoque;
  produtos[sku].estoque = estoque;
  
  // Salvar alteração
  fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
  
  res.json({
    message: 'Estoque atualizado com sucesso',
    sku,
    estoque_anterior: estoqueAnterior,
    estoque_atual: estoque
  });
});

// Endpoint para consultar alertas de estoque baixo
app.get('/alertas/estoque-baixo', (req, res) => {
  try {
    let alertas = [];
    
    if (fs.existsSync('estoque_baixo.txt')) {
      const conteudo = fs.readFileSync('estoque_baixo.txt', 'utf8');
      alertas = conteudo.trim().split('\n').filter(linha => linha.length > 0);
    }
    
    res.json({
      total: alertas.length,
      alertas: alertas.slice(-50) // Últimos 50 alertas
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar alertas' });
  }
});

// Endpoints da API da loja virtual

// Listar produtos da loja
app.get('/api/produtos', (req, res) => {
  try {
    const { category, search, sortBy, minPrice, maxPrice } = req.query;
    let produtosFiltrados = [...produtosLoja];

    // Filtro por categoria
    if (category && category !== 'all') {
      produtosFiltrados = produtosFiltrados.filter(p => p.category === category);
    }

    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase();
      produtosFiltrados = produtosFiltrados.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por preço
    if (minPrice) {
      produtosFiltrados = produtosFiltrados.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      produtosFiltrados = produtosFiltrados.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Ordenação
    switch (sortBy) {
      case 'price-low':
        produtosFiltrados.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        produtosFiltrados.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        produtosFiltrados.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        produtosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    res.json({
      success: true,
      produtos: produtosFiltrados,
      total: produtosFiltrados.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos'
    });
  }
});

// Obter produto específico
app.get('/api/produtos/:id', (req, res) => {
  try {
    const produto = produtosLoja.find(p => p.id === req.params.id);
    
    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      produto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto'
    });
  }
});

// Buscar produtos
app.get('/api/produtos/buscar', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({
        success: true,
        produtos: [],
        total: 0
      });
    }

    const searchLower = q.toLowerCase();
    const produtosFiltrados = produtosLoja.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.features.some(f => f.toLowerCase().includes(searchLower))
    );

    res.json({
      success: true,
      produtos: produtosFiltrados,
      total: produtosFiltrados.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro na busca'
    });
  }
});

// Calcular frete
app.post('/api/frete/calcular', (req, res) => {
  try {
    const { cep_destino, produtos: itens } = req.body;
    
    let pesoTotal = 0;
    let valorTotal = 0;
    
    itens.forEach(item => {
      const produto = produtosLoja.find(p => p.id === item.sku);
      if (produto) {
        pesoTotal += produto.weight * item.quantidade;
        valorTotal += produto.price * item.quantidade;
      }
    });

    // Frete grátis acima de R$ 99
    const freteGratis = valorTotal >= 99;
    const valorFrete = freteGratis ? 0 : 15.90;
    const prazoEntrega = freteGratis ? '2-3 dias úteis' : '3-5 dias úteis';

    res.json({
      success: true,
      frete: {
        valor: valorFrete,
        prazo: prazoEntrega,
        gratis: freteGratis,
        peso_total: pesoTotal,
        valor_total: valorTotal
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao calcular frete'
    });
  }
});

// Newsletter
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    console.log('Newsletter subscription:', email);

    res.json({
      success: true,
      message: 'Inscrição realizada com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao inscrever no newsletter'
    });
  }
});

// Contato
app.post('/api/contato', (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;
    
    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios não preenchidos'
      });
    }

    console.log('Mensagem de contato:', { nome, email, assunto, mensagem });

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem'
    });
  }
});

// Rastreamento de pedido
app.get('/pedidos/:id/rastreamento', (req, res) => {
  try {
    const pedidoId = req.params.id;
    
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
    };

    res.json({
      success: true,
      rastreamento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar rastreamento'
    });
  }
});

// Placeholder para imagens
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const { text } = req.query;
  
  res.redirect(`https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(text || 'Produto')}`);
});

// ===== ROTAS DE AUTENTICAÇÃO =====

// Login do Admin
app.post('/auth/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    // Buscar admin
    const admin = usuarios.admins.find(a => a.username === username || a.email === username);
    
    if (!admin || !admin.active) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(password, admin.password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Atualizar último login
    admin.last_login = new Date().toISOString();
    salvarUsuarios();

    // Gerar token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        email: admin.email, 
        role: 'admin' 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Erro no login admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cadastro de Cliente
app.post('/auth/cliente/cadastro', async (req, res) => {
  try {
    const { name, email, password, cpf, phone, birth_date, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const emailExiste = usuarios.clientes.find(c => c.email === email);
    if (emailExiste) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(password, 10);

    // Criar novo cliente
    const novoCliente = {
      id: `cliente${Date.now()}`,
      email,
      password: senhaHash,
      name,
      cpf: cpf || '',
      phone: phone || '',
      birth_date: birth_date || '',
      address: address || {},
      created_at: new Date().toISOString(),
      last_login: null,
      active: true,
      newsletter: false
    };

    usuarios.clientes.push(novoCliente);
    salvarUsuarios();

    // Gerar token
    const token = jwt.sign(
      { 
        id: novoCliente.id, 
        email: novoCliente.email, 
        role: 'cliente' 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: novoCliente.id,
        email: novoCliente.email,
        name: novoCliente.name,
        role: 'cliente'
      }
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login de Cliente
app.post('/auth/cliente/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar cliente
    const cliente = usuarios.clientes.find(c => c.email === email);
    
    if (!cliente || !cliente.active) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(password, cliente.password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Atualizar último login
    cliente.last_login = new Date().toISOString();
    salvarUsuarios();

    // Gerar token
    const token = jwt.sign(
      { 
        id: cliente.id, 
        email: cliente.email, 
        role: 'cliente' 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: cliente.id,
        email: cliente.email,
        name: cliente.name,
        role: 'cliente'
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
app.get('/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Logout (invalidar token no frontend)
app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

// ===== ROTAS PROTEGIDAS ADMIN =====

// Listar usuários (apenas admin)
app.get('/admin/usuarios', authenticateToken, requireAdmin, (req, res) => {
  const { tipo } = req.query;
  
  let resultado = [];
  
  if (!tipo || tipo === 'clientes') {
    resultado = resultado.concat(usuarios.clientes.map(c => ({
      ...c,
      password: undefined // Não enviar senha
    })));
  }
  
  if (!tipo || tipo === 'admins') {
    resultado = resultado.concat(usuarios.admins.map(a => ({
      ...a,
      password: undefined // Não enviar senha
    })));
  }
  
  res.json({
    total: resultado.length,
    usuarios: resultado
  });
});

// Atualizar usuário (apenas admin)
app.put('/admin/usuarios/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Buscar usuário
    let usuario = usuarios.clientes.find(c => c.id === id);
    let tipo = 'cliente';
    
    if (!usuario) {
      usuario = usuarios.admins.find(a => a.id === id);
      tipo = 'admin';
    }
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Atualizar campos permitidos
    const camposPermitidos = ['name', 'email', 'active', 'phone', 'cpf'];
    camposPermitidos.forEach(campo => {
      if (updates[campo] !== undefined) {
        usuario[campo] = updates[campo];
      }
    });
    
    salvarUsuarios();
    
    res.json({
      success: true,
      usuario: {
        ...usuario,
        password: undefined
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar usuário (apenas admin)
app.delete('/admin/usuarios/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar e remover cliente
    const clienteIndex = usuarios.clientes.findIndex(c => c.id === id);
    if (clienteIndex !== -1) {
      usuarios.clientes.splice(clienteIndex, 1);
      salvarUsuarios();
      return res.json({ success: true, message: 'Cliente removido com sucesso' });
    }
    
    // Buscar e remover admin (não permitir remover a si mesmo)
    const adminIndex = usuarios.admins.findIndex(a => a.id === id);
    if (adminIndex !== -1) {
      if (usuarios.admins[adminIndex].id === req.user.id) {
        return res.status(400).json({ error: 'Não é possível remover sua própria conta' });
      }
      usuarios.admins.splice(adminIndex, 1);
      salvarUsuarios();
      return res.json({ success: true, message: 'Admin removido com sucesso' });
    }
    
    res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para servir o painel admin
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redirecionando para Painel Admin</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        h1 { color: #333; margin-bottom: 1rem; }
        p { color: #666; margin-bottom: 1.5rem; }
        .btn {
          background: #667eea;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          text-decoration: none;
          display: inline-block;
          transition: background 0.3s;
        }
        .btn:hover { background: #5a67d8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="spinner"></div>
        <h1>Painel Administrativo</h1>
        <p>Redirecionando para o painel de administração...</p>
        <a href="http://localhost:5173" class="btn">Acessar Painel Admin</a>
      </div>
      <script>
        setTimeout(() => {
          window.location.href = 'http://localhost:5173';
        }, 2000);
      </script>
    </body>
    </html>
  `);
});

// Endpoint de teste
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Webhook PagSeguro: http://localhost:${PORT}/webhook/pagseguro`);
  console.log(`Frontend pode acessar a API em: http://localhost:${PORT}`);
});





// ===== ENDPOINTS DE GERENCIAMENTO DE PRODUTOS =====

// Listar produtos para admin
app.get('/admin/produtos', authenticateToken, requireAdmin, (req, res) => {
  try {
    const produtosAdmin = produtosLoja.map(produto => ({
      ...produto,
      estoque_atual: produtos[produto.id]?.estoque || 0
    }));
    
    res.json({
      success: true,
      produtos: produtosAdmin,
      total: produtosAdmin.length
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter produto específico para admin
app.get('/admin/produtos/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const produto = produtosLoja.find(p => p.id === req.params.id);
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    const produtoCompleto = {
      ...produto,
      estoque_atual: produtos[produto.id]?.estoque || 0
    };
    
    res.json({
      success: true,
      produto: produtoCompleto
    });
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo produto
app.post('/admin/produtos', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
      weight,
      features,
      nutritionalInfo
    } = req.body;
    
    // Validações básicas
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, description, price, category' });
    }
    
    // Gerar ID único
    const id = `${category.toUpperCase()}${Date.now()}`;
    
    // Criar novo produto
    const novoProduto = {
      id,
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      category,
      brand: brand || 'SuplementsStore',
      rating: 0,
      reviews: 0,
      stock: parseInt(stock) || 0,
      weight: parseFloat(weight) || 0.5,
      features: features || [],
      nutritionalInfo: nutritionalInfo || {}
    };
    
    // Adicionar ao array de produtos da loja
    produtosLoja.push(novoProduto);
    
    // Adicionar ao controle de estoque
    produtos[id] = {
      nome: name,
      peso: parseFloat(weight) || 0.5,
      estoque: parseInt(stock) || 0
    };
    
    // Salvar produtos
    fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
    
    res.status(201).json({
      success: true,
      produto: novoProduto,
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar produto
app.put('/admin/produtos/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const produtoId = req.params.id;
    const updates = req.body;
    
    // Encontrar produto na lista da loja
    const produtoIndex = produtosLoja.findIndex(p => p.id === produtoId);
    if (produtoIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    // Atualizar produto na loja
    const produtoAtualizado = {
      ...produtosLoja[produtoIndex],
      ...updates,
      price: updates.price ? parseFloat(updates.price) : produtosLoja[produtoIndex].price,
      originalPrice: updates.originalPrice ? parseFloat(updates.originalPrice) : produtosLoja[produtoIndex].originalPrice,
      weight: updates.weight ? parseFloat(updates.weight) : produtosLoja[produtoIndex].weight
    };
    
    produtosLoja[produtoIndex] = produtoAtualizado;
    
    // Atualizar no controle de estoque se necessário
    if (updates.stock !== undefined || updates.name || updates.weight) {
      if (!produtos[produtoId]) {
        produtos[produtoId] = {};
      }
      
      if (updates.name) produtos[produtoId].nome = updates.name;
      if (updates.weight) produtos[produtoId].peso = parseFloat(updates.weight);
      if (updates.stock !== undefined) {
        produtos[produtoId].estoque = parseInt(updates.stock);
        produtoAtualizado.stock = parseInt(updates.stock);
      }
      
      // Salvar produtos
      fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
    }
    
    res.json({
      success: true,
      produto: produtoAtualizado,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar produto
app.delete('/admin/produtos/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const produtoId = req.params.id;
    
    // Encontrar e remover produto da lista da loja
    const produtoIndex = produtosLoja.findIndex(p => p.id === produtoId);
    if (produtoIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    const produtoRemovido = produtosLoja[produtoIndex];
    produtosLoja.splice(produtoIndex, 1);
    
    // Remover do controle de estoque
    if (produtos[produtoId]) {
      delete produtos[produtoId];
      fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
    }
    
    res.json({
      success: true,
      message: 'Produto removido com sucesso',
      produto: produtoRemovido
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar estoque de produto específico
app.put('/admin/produtos/:id/estoque', authenticateToken, requireAdmin, (req, res) => {
  try {
    const produtoId = req.params.id;
    const { estoque } = req.body;
    
    if (typeof estoque !== 'number' || estoque < 0) {
      return res.status(400).json({ error: 'Estoque deve ser um número positivo' });
    }
    
    // Verificar se produto existe
    const produto = produtosLoja.find(p => p.id === produtoId);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    // Atualizar estoque
    if (!produtos[produtoId]) {
      produtos[produtoId] = {
        nome: produto.name,
        peso: produto.weight,
        estoque: 0
      };
    }
    
    const estoqueAnterior = produtos[produtoId].estoque;
    produtos[produtoId].estoque = estoque;
    produto.stock = estoque;
    
    // Salvar alteração
    fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
    
    res.json({
      success: true,
      message: 'Estoque atualizado com sucesso',
      produto_id: produtoId,
      estoque_anterior: estoqueAnterior,
      estoque_atual: estoque
    });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// ===== ENDPOINTS DE GERENCIAMENTO DE SESSÕES =====

// Armazenar sessões ativas em memória (em produção usar Redis)
const sessoesAtivas = new Map();

// Middleware para registrar sessões ativas
const registrarSessao = (req, res, next) => {
  if (req.user) {
    const sessionId = req.headers['authorization']?.split(' ')[1];
    if (sessionId) {
      sessoesAtivas.set(sessionId, {
        userId: req.user.id,
        userEmail: req.user.email,
        userName: req.user.name || req.user.username,
        userRole: req.user.role,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      });
    }
  }
  next();
};

// Aplicar middleware de sessão em rotas autenticadas
app.use('/admin', authenticateToken, registrarSessao);
app.use('/api/auth/me', authenticateToken, registrarSessao);

// Listar sessões ativas
app.get('/admin/sessoes', authenticateToken, requireAdmin, (req, res) => {
  try {
    const sessoes = Array.from(sessoesAtivas.entries()).map(([token, sessao]) => ({
      sessionId: token.substring(0, 10) + '...',
      ...sessao,
      duration: Math.floor((new Date() - new Date(sessao.loginTime)) / 1000 / 60), // em minutos
      isActive: (new Date() - new Date(sessao.lastActivity)) < 30 * 60 * 1000 // ativo se última atividade < 30min
    }));
    
    // Ordenar por última atividade
    sessoes.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    
    res.json({
      success: true,
      sessoes,
      total: sessoes.length,
      ativas: sessoes.filter(s => s.isActive).length
    });
  } catch (error) {
    console.error('Erro ao listar sessões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Invalidar sessão específica
app.delete('/admin/sessoes/:sessionId', authenticateToken, requireAdmin, (req, res) => {
  try {
    const sessionIdPrefix = req.params.sessionId;
    let sessaoRemovida = null;
    
    // Encontrar sessão pelo prefixo do ID
    for (const [token, sessao] of sessoesAtivas.entries()) {
      if (token.startsWith(sessionIdPrefix)) {
        sessaoRemovida = sessao;
        sessoesAtivas.delete(token);
        break;
      }
    }
    
    if (!sessaoRemovida) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Sessão invalidada com sucesso',
      sessao: sessaoRemovida
    });
  } catch (error) {
    console.error('Erro ao invalidar sessão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Invalidar todas as sessões de um usuário
app.delete('/admin/usuarios/:userId/sessoes', authenticateToken, requireAdmin, (req, res) => {
  try {
    const userId = req.params.userId;
    let sessoesRemovidas = 0;
    
    // Remover todas as sessões do usuário
    for (const [token, sessao] of sessoesAtivas.entries()) {
      if (sessao.userId === userId) {
        sessoesAtivas.delete(token);
        sessoesRemovidas++;
      }
    }
    
    res.json({
      success: true,
      message: `${sessoesRemovidas} sessão(ões) invalidada(s) com sucesso`,
      sessoesRemovidas
    });
  } catch (error) {
    console.error('Erro ao invalidar sessões do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de sessões
app.get('/admin/sessoes/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const agora = new Date();
    const sessoes = Array.from(sessoesAtivas.values());
    
    const stats = {
      total_sessoes: sessoes.length,
      sessoes_ativas: sessoes.filter(s => (agora - new Date(s.lastActivity)) < 30 * 60 * 1000).length,
      sessoes_admin: sessoes.filter(s => s.userRole === 'admin').length,
      sessoes_cliente: sessoes.filter(s => s.userRole === 'cliente').length,
      usuarios_unicos: new Set(sessoes.map(s => s.userId)).size,
      sessao_mais_longa: Math.max(...sessoes.map(s => Math.floor((agora - new Date(s.loginTime)) / 1000 / 60)), 0),
      atividade_por_hora: {}
    };
    
    // Atividade por hora nas últimas 24h
    for (let i = 0; i < 24; i++) {
      const hora = new Date(agora.getTime() - i * 60 * 60 * 1000).getHours();
      stats.atividade_por_hora[hora] = sessoes.filter(s => {
        const sessaoHora = new Date(s.lastActivity).getHours();
        return sessaoHora === hora;
      }).length;
    }
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de sessões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Limpeza automática de sessões expiradas (executar a cada 30 minutos)
setInterval(() => {
  const agora = new Date();
  const sessoesExpiradas = [];
  
  for (const [token, sessao] of sessoesAtivas.entries()) {
    // Remover sessões inativas por mais de 24 horas
    if ((agora - new Date(sessao.lastActivity)) > 24 * 60 * 60 * 1000) {
      sessoesAtivas.delete(token);
      sessoesExpiradas.push(sessao);
    }
  }
  
  if (sessoesExpiradas.length > 0) {
    console.log(`🧹 Limpeza automática: ${sessoesExpiradas.length} sessão(ões) expirada(s) removida(s)`);
  }
}, 30 * 60 * 1000); // 30 minutos

// ===== SISTEMA DE PERSONALIZAÇÃO VISUAL =====

const multer = require('multer');


// Carregar configurações visuais
let configuracaoVisual = JSON.parse(fs.readFileSync('configuracoes-visuais.json', 'utf8'));

// Função para salvar configurações visuais
const salvarConfiguracaoVisual = () => {
  fs.writeFileSync('configuracoes-visuais.json', JSON.stringify(configuracaoVisual, null, 2));
};

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (req.originalUrl.includes('/admin/produtos/') && req.originalUrl.includes('/upload-imagem')) {
      uploadPath += 'produtos';
    } else if (req.originalUrl.includes('/admin/upload-logo')) {
      uploadPath += 'logos';
    } else if (req.originalUrl.includes('/admin/upload-banner')) {
      uploadPath += 'banners';
    } else {
      // Fallback para outros tipos de upload, se houver
      uploadPath += 'outros';
    }
    // Criar o diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Servir arquivos estáticos de upload
app.use('/uploads', express.static('uploads'));

// Obter configurações visuais
app.get('/api/configuracoes-visuais', (req, res) => {
  res.json({
    success: true,
    configuracoes: configuracaoVisual
  });
});

// Upload de logo (apenas admin)
app.post('/admin/upload-logo', authenticateToken, requireAdmin, upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    // Atualizar configuração
    configuracaoVisual.logo = {
      url: logoUrl,
      alt: req.body.alt || 'Logo da loja',
      width: parseInt(req.body.width) || 200,
      height: parseInt(req.body.height) || 80
    };

    salvarConfiguracaoVisual();

    res.json({
      success: true,
      logo: configuracaoVisual.logo,
      message: 'Logo atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro no upload da logo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Upload de banner (apenas admin)
app.post('/admin/upload-banner', authenticateToken, requireAdmin, upload.single('banner'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const bannerUrl = `/uploads/banners/${req.file.filename}`;
    const bannerId = `banner${Date.now()}`;
    
    const novoBanner = {
      id: bannerId,
      url: bannerUrl,
      alt: req.body.alt || 'Banner promocional',
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      link: req.body.link || '',
      active: true,
      order: configuracaoVisual.banners.items.length + 1
    };

    // Verificar limite de 5 banners
    if (configuracaoVisual.banners.items.length >= 5) {
      return res.status(400).json({ error: 'Limite máximo de 5 banners atingido' });
    }

    configuracaoVisual.banners.items.push(novoBanner);
    salvarConfiguracaoVisual();

    res.json({
      success: true,
      banner: novoBanner,
      message: 'Banner adicionado com sucesso'
    });
  } catch (error) {
    console.error('Erro no upload do banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar banners (apenas admin)
app.get('/admin/banners', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    banners: configuracaoVisual.banners
  });
});

// Atualizar banner (apenas admin)
app.put('/admin/banners/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const bannerId = req.params.id;
    const updates = req.body;
    
    const bannerIndex = configuracaoVisual.banners.items.findIndex(b => b.id === bannerId);
    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }

    // Atualizar banner
    configuracaoVisual.banners.items[bannerIndex] = {
      ...configuracaoVisual.banners.items[bannerIndex],
      ...updates
    };

    salvarConfiguracaoVisual();

    res.json({
      success: true,
      banner: configuracaoVisual.banners.items[bannerIndex],
      message: 'Banner atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar banner (apenas admin)
app.delete('/admin/banners/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const bannerId = req.params.id;
    
    const bannerIndex = configuracaoVisual.banners.items.findIndex(b => b.id === bannerId);
    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }

    const bannerRemovido = configuracaoVisual.banners.items[bannerIndex];
    configuracaoVisual.banners.items.splice(bannerIndex, 1);

    // Reordenar banners
    configuracaoVisual.banners.items.forEach((banner, index) => {
      banner.order = index + 1;
    });

    salvarConfiguracaoVisual();

    res.json({
      success: true,
      message: 'Banner removido com sucesso',
      banner: bannerRemovido
    });
  } catch (error) {
    console.error('Erro ao deletar banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar configurações do carrossel (apenas admin)
app.put('/admin/carrossel-config', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { enabled, autoplay, interval } = req.body;
    
    if (enabled !== undefined) configuracaoVisual.banners.enabled = enabled;
    if (autoplay !== undefined) configuracaoVisual.banners.autoplay = autoplay;
    if (interval !== undefined) configuracaoVisual.banners.interval = interval;

    salvarConfiguracaoVisual();

    res.json({
      success: true,
      configuracoes: configuracaoVisual.banners,
      message: 'Configurações do carrossel atualizadas'
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Reordenar banners (apenas admin)
app.put('/admin/banners/reorder', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { bannerIds } = req.body;
    
    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({ error: 'Lista de IDs inválida' });
    }

    // Reordenar banners conforme a nova ordem
    const bannersReordenados = [];
    bannerIds.forEach((id, index) => {
      const banner = configuracaoVisual.banners.items.find(b => b.id === id);
      if (banner) {
        banner.order = index + 1;
        bannersReordenados.push(banner);
      }
    });

    configuracaoVisual.banners.items = bannersReordenados;
    salvarConfiguracaoVisual();

    res.json({
      success: true,
      banners: configuracaoVisual.banners.items,
      message: 'Ordem dos banners atualizada'
    });
  } catch (error) {
    console.error('Erro ao reordenar banners:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Endpoint de status para verificar se o servidor está ativo
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "Backend está ativo e funcionando!" });
});

