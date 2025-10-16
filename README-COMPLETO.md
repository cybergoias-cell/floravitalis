# Sistema Completo de Automação de Entrega

Este projeto é um sistema completo de automação de entrega para uma distribuidora de suplementos alimentares, construído com **Node.js + Express** (backend) e **React + Vite** (frontend administrativo).

## 🚀 Funcionalidades

### Backend (API)
- **Webhook de Pagamento**: Escuta confirmações de pagamento (PagSeguro) para iniciar o fluxo de automação
- **Geração de Etiqueta**: Integra-se com a API da Melhor Envio (ambiente de sandbox) para gerar etiquetas de envio (PAC)
- **Controle de Estoque**: Atualiza o estoque dos produtos em um arquivo JSON local (`produtos.json`) após cada venda
- **Alertas de Estoque Baixo**: Registra um aviso em `estoque_baixo.txt` quando o estoque de um produto atinge 3 unidades ou menos
- **Notificação ao Cliente**: Envia uma mensagem via WhatsApp (Twilio) com o código de rastreamento do pedido
- **API REST**: Fornece endpoints para consultar o status dos pedidos, o estoque atual e outras informações relevantes

### Frontend (Interface Administrativa)
- **Dashboard**: Visão geral com métricas, gráficos de vendas e faturamento
- **Gerenciamento de Pedidos**: Lista, filtra e visualiza detalhes completos dos pedidos
- **Controle de Estoque**: Interface para monitorar e atualizar o estoque dos produtos
- **Central de Alertas**: Monitora alertas de estoque baixo e notificações do sistema
- **Relatórios**: Analytics avançados com gráficos e exportação de dados
- **Design Responsivo**: Interface moderna e adaptável para desktop e mobile

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express.js**
- **APIs Externas**: PagSeguro, Melhor Envio, Twilio
- **Dependências**: `express`, `axios`, `dotenv`

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Recharts** para gráficos
- **Lucide Icons** para ícones
- **date-fns** para manipulação de datas

---

## 📦 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/exemplo/sistema-automacao-entrega.git
cd sistema-automacao-entrega
```

### 2. Configurar Backend

```bash
# Instalar dependências do backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o arquivo .env com suas credenciais
```

### 3. Configurar Frontend

```bash
# Navegar para o diretório do frontend
cd admin-frontend

# Instalar dependências
pnpm install
```

### 4. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto com suas credenciais:

```dotenv
# Porta da aplicação
PORT=3000

# --- Credenciais Melhor Envio (Sandbox) ---
MELHOR_ENVIO_TOKEN="SEU_TOKEN_DO_MELHOR_ENVIO_SANDBOX"

# --- Credenciais Twilio ---
TWILIO_ACCOUNT_SID="SEU_ACCOUNT_SID_DA_TWILIO"
TWILIO_AUTH_TOKEN="SEU_AUTH_TOKEN_DA_TWILIO"
TWILIO_WHATSAPP_FROM="+14155238886"

# --- Dados do Remetente (Sua Empresa) ---
REMETENTE_NOME="Sua Distribuidora"
REMETENTE_TELEFONE="11999999999"
REMETENTE_EMAIL="contato@suaempresa.com"
REMETENTE_CNPJ="00000000000100"
REMETENTE_IE="ISENTO"
REMETENTE_ENDERECO="Sua Rua"
REMETENTE_NUMERO="123"
REMETENTE_BAIRRO="Seu Bairro"
REMETENTE_CIDADE="Sua Cidade"
REMETENTE_CEP="00000000"
```

**Onde obter as credenciais:**
- **Melhor Envio (Sandbox)**: [sandbox.melhorenvio.com.br](https://sandbox.melhorenvio.com.br/) → Painel → Gerenciar → Tokens
- **Twilio**: [console.twilio.com](https://www.twilio.com/console) → Account SID e Auth Token

---

## 🚀 Executando o Sistema

### Opção 1: Executar Separadamente

**Terminal 1 - Backend:**
```bash
# Na raiz do projeto
npm start
# ou
node index.js
```

**Terminal 2 - Frontend:**
```bash
# No diretório admin-frontend
cd admin-frontend
pnpm run dev
```

### Opção 2: Script de Desenvolvimento (Recomendado)

Crie um arquivo `start-dev.sh`:

```bash
#!/bin/bash
echo "🚀 Iniciando Sistema de Automação de Entrega..."

# Iniciar backend em background
echo "📡 Iniciando backend na porta 3000..."
node index.js &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Iniciar frontend
echo "🎨 Iniciando frontend na porta 5173..."
cd admin-frontend
pnpm run dev --host &
FRONTEND_PID=$!

echo "✅ Sistema iniciado!"
echo "📡 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Para parar o sistema, pressione Ctrl+C"

# Aguardar interrupção
trap "echo '🛑 Parando sistema...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 🧪 Como Testar

### 1. Testar Interface Administrativa

1. Acesse `http://localhost:5173`
2. Navegue pelas diferentes seções:
   - **Dashboard**: Visualize métricas e gráficos
   - **Pedidos**: Veja a lista de pedidos (inicialmente vazia)
   - **Estoque**: Monitore os produtos cadastrados
   - **Alertas**: Verifique notificações do sistema
   - **Relatórios**: Analise dados e exporte relatórios

### 2. Testar Webhook com ngrok

Para testar o fluxo completo de automação:

```bash
# Instalar ngrok
# Baixe em: https://ngrok.com/download

# Expor backend para internet
ngrok http 3000
```

Use a URL gerada pelo ngrok para simular o webhook do PagSeguro:

```bash
curl -X POST \
  https://SUA_URL_DO_NGROK.ngrok.io/webhook/pagseguro \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "PEDIDO12345",
    "status": "PAID",
    "amount": 25990,
    "customer": {
      "name": "João da Silva",
      "email": "joao.silva@example.com",
      "phone": "11987654321",
      "address": {
        "street": "Rua das Flores",
        "number": "10",
        "complement": "Apto 101",
        "district": "Jardim Primavera",
        "city": "São Paulo",
        "state": "SP",
        "postal_code": "01234567"
      }
    },
    "items": [
      {
        "reference_id": "WHEY001",
        "name": "Whey Protein Concentrado 1kg",
        "quantity": 1
      },
      {
        "reference_id": "CREAT002",
        "name": "Creatina Monohidratada 300g",
        "quantity": 2
      }
    ]
  }'
```

Após enviar o webhook, você verá:
1. O pedido aparecer no frontend
2. O estoque ser atualizado automaticamente
3. Alertas de estoque baixo (se aplicável)
4. Logs de processamento no console do backend

---

## 📊 Endpoints da API

### Pedidos
- `GET /pedidos` - Lista todos os pedidos
- `GET /pedidos/:id` - Detalhes de um pedido específico
- `POST /pedidos/:id/reenviar-notificacao` - Reenviar notificação WhatsApp

### Estoque
- `GET /estoque` - Status atual do estoque
- `PUT /estoque/:sku` - Atualizar estoque de um produto

### Alertas
- `GET /alertas/estoque-baixo` - Lista alertas de estoque baixo

### Sistema
- `GET /health` - Status da aplicação

---

## 🎨 Capturas de Tela

### Dashboard
![Dashboard com métricas e gráficos de vendas]

### Gerenciamento de Pedidos
![Interface de listagem e detalhes dos pedidos]

### Controle de Estoque
![Painel de controle de estoque com alertas]

### Central de Alertas
![Sistema de monitoramento de alertas em tempo real]

---

## 🔧 Personalização

### Adicionando Novos Produtos

Edite o arquivo `produtos.json`:

```json
{
  "NOVO001": {
    "nome": "Novo Produto",
    "peso": 0.5,
    "estoque": 20
  }
}
```

### Configurando Novos Alertas

Modifique a função `atualizarEstoque()` em `index.js` para personalizar os limites de alerta.

### Customizando a Interface

O frontend usa Tailwind CSS e shadcn/ui. Para personalizar:

1. **Cores**: Edite `admin-frontend/src/App.css`
2. **Componentes**: Modifique os arquivos em `admin-frontend/src/components/`
3. **Layout**: Ajuste `admin-frontend/src/components/Layout.jsx`

---

## 🚀 Deploy em Produção

### Backend (Node.js)

```bash
# Build otimizado
npm ci --production

# Usar PM2 para gerenciar processo
npm install -g pm2
pm2 start index.js --name "sistema-entrega"
pm2 startup
pm2 save
```

### Frontend (React)

```bash
# Build para produção
cd admin-frontend
pnpm run build

# Servir arquivos estáticos (exemplo com nginx)
sudo cp -r dist/* /var/www/html/
```

### Variáveis de Ambiente de Produção

```dotenv
NODE_ENV=production
PORT=3000
# ... outras variáveis com valores de produção
```

---

## 📝 Estrutura do Projeto

```
sistema-entrega/
├── index.js                 # Backend principal
├── produtos.json            # Base de dados dos produtos
├── estoque_baixo.txt        # Log de alertas de estoque
├── .env.example             # Exemplo de variáveis de ambiente
├── package.json             # Dependências do backend
├── README.md                # Documentação original
├── README-COMPLETO.md       # Esta documentação
└── admin-frontend/          # Frontend React
    ├── src/
    │   ├── components/      # Componentes React
    │   │   ├── Layout.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Pedidos.jsx
    │   │   ├── Estoque.jsx
    │   │   ├── Alertas.jsx
    │   │   └── Relatorios.jsx
    │   ├── config/
    │   │   └── api.js       # Configuração da API
    │   ├── App.jsx          # Componente principal
    │   └── main.jsx         # Ponto de entrada
    ├── package.json         # Dependências do frontend
    └── vite.config.js       # Configuração do Vite
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Consulte os logs do backend e frontend
3. Abra uma issue no GitHub
4. Entre em contato: contato@suaempresa.com

---

**Desenvolvido com ❤️ para automatizar entregas e facilitar a gestão de e-commerce**
