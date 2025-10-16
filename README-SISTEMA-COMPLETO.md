# 🚀 Sistema Completo de Automação de Entrega + Loja Virtual

## 📋 Visão Geral

Sistema completo de e-commerce com automação total do processo de vendas e entrega, desenvolvido para distribuidoras de suplementos alimentares. Inclui loja virtual moderna, painel administrativo e integração com APIs de pagamento, frete e notificação.

## ✨ Funcionalidades

### 🛒 **Loja Virtual**
- Interface moderna e responsiva
- Catálogo completo de produtos
- Carrinho de compras inteligente
- Checkout seguro com múltiplas formas de pagamento
- Cálculo automático de frete
- Sistema de busca e filtros

### 🎛️ **Painel Administrativo**
- Dashboard com métricas em tempo real
- Gerenciamento completo de pedidos
- Controle de estoque com alertas
- Sistema de notificações
- Relatórios e analytics
- Interface responsiva

### 🔄 **Sistema de Automação**
- Webhook PagSeguro para processar pagamentos
- Geração automática de etiquetas (Melhor Envio)
- Controle automático de estoque
- Notificações WhatsApp via Twilio
- Rastreamento de pedidos
- Alertas de estoque baixo

## 🚀 Instalação Rápida

### **Método 1: Instalação Automática (Recomendado)**
```bash
# Extrair o projeto
tar -xzf sistema-completo-loja-virtual.tar.gz
cd sistema-entrega

# Executar instalação automática
./install.sh

# Configurar credenciais
nano .env

# Iniciar sistema
./start-dev.sh
```

### **Método 2: Instalação Manual**
```bash
# Extrair e entrar no diretório
tar -xzf sistema-completo-loja-virtual.tar.gz
cd sistema-entrega

# Instalar dependências
npm install
cd loja-virtual && pnpm install && cd ..
cd admin-frontend && pnpm install && cd ..

# Configurar ambiente
cp .env.example .env
nano .env

# Iniciar serviços
node index.js &
cd loja-virtual && pnpm run dev &
cd admin-frontend && pnpm run dev &
```

## 🌐 Acessos

Após a instalação, acesse:

- **🛒 Loja Virtual**: http://localhost:5174
- **🎛️ Painel Admin**: http://localhost:5173  
- **🔧 API Backend**: http://localhost:3000

## ⚙️ Configuração

### **Variáveis de Ambiente Essenciais**
```env
# PagSeguro
PAGSEGURO_TOKEN=seu_token_aqui
PAGSEGURO_SANDBOX=true

# Melhor Envio
MELHOR_ENVIO_TOKEN=seu_token_aqui
MELHOR_ENVIO_SANDBOX=true

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=seu_sid_aqui
TWILIO_AUTH_TOKEN=seu_token_aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## 🧪 Teste Rápido

```bash
# Testar webhook de pagamento
curl -X POST http://localhost:3000/webhook/pagseguro \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TESTE001",
    "status": "PAID",
    "amount": 89.90,
    "customer": {
      "name": "João Teste",
      "email": "joao@teste.com",
      "phone": "11999999999",
      "address": {
        "street": "Rua Teste, 123",
        "city": "São Paulo", 
        "state": "SP",
        "zipcode": "01234-567"
      }
    },
    "items": [{"sku": "WHEY001", "name": "Whey Protein", "quantity": 1}]
  }'
```

## 📁 Estrutura do Projeto

```
sistema-entrega/
├── 🔧 Backend (Node.js + Express)
│   ├── index.js              # Servidor principal
│   ├── produtos.json         # Base de produtos
│   └── public/              # Interface do backend
├── 🛒 Loja Virtual (React)
│   ├── src/                 # Código fonte
│   ├── public/              # Assets
│   └── dist/               # Build de produção
├── 🎛️ Admin Panel (React)
│   ├── src/                 # Código fonte
│   ├── public/              # Assets
│   └── dist/               # Build de produção
└── 📚 Documentação
    ├── README.md            # Este arquivo
    ├── INSTALACAO-COMPLETA.md
    ├── LOJA-VIRTUAL-COMPLETA.md
    └── INTERFACES-UI-COMPLETAS.md
```

## 🛠️ Tecnologias

### **Backend**
- Node.js + Express
- APIs: PagSeguro, Melhor Envio, Twilio
- JSON como banco de dados
- CORS configurado

### **Frontend**
- React 19 + Vite
- Tailwind CSS + shadcn/ui
- Zustand (gerenciamento de estado)
- React Router (navegação)
- React Hook Form + Zod (formulários)

## 📊 Produtos Inclusos

1. **Whey Protein Concentrado 1kg** - R$ 89,90
2. **Creatina Monohidratada 300g** - R$ 49,90
3. **BCAA 2:1:1 120 cápsulas** - R$ 39,90
4. **Glutamina 300g** - R$ 45,90
5. **Multivitamínico 60 cápsulas** - R$ 35,90
6. **Termogênico 60 cápsulas** - R$ 55,90

## 🔄 Fluxo Completo

1. **Cliente** navega na loja e adiciona produtos ao carrinho
2. **Sistema** calcula frete automaticamente
3. **Cliente** finaliza compra com dados pessoais
4. **PagSeguro** processa pagamento e envia webhook
5. **Sistema** automaticamente:
   - Gera etiqueta de envio (Melhor Envio)
   - Atualiza estoque
   - Envia notificação WhatsApp (Twilio)
   - Registra pedido no admin
6. **Admin** monitora tudo em tempo real

## 🚀 Deploy para Produção

### **Build dos Frontends**
```bash
# Loja Virtual
cd loja-virtual
pnpm run build

# Painel Admin  
cd admin-frontend
pnpm run build
```

### **Configurar Nginx**
```nginx
# Exemplo de configuração
server {
    listen 80;
    server_name seudominio.com;
    root /caminho/para/loja-virtual/dist;
    
    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

### **PM2 para Backend**
```bash
npm install -g pm2
pm2 start index.js --name sistema-backend
pm2 startup
pm2 save
```

## 📞 Suporte

### **Documentação Completa**
- `INSTALACAO-COMPLETA.md` - Guia detalhado de instalação
- `LOJA-VIRTUAL-COMPLETA.md` - Documentação da loja
- `INTERFACES-UI-COMPLETAS.md` - Detalhes das interfaces

### **Scripts Úteis**
- `./install.sh` - Instalação automática
- `./start-dev.sh` - Iniciar desenvolvimento
- `npm test` - Executar testes

## ✅ Checklist de Uso

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas
- [ ] Arquivo .env configurado
- [ ] Credenciais das APIs obtidas
- [ ] Sistema testado localmente
- [ ] Pronto para produção

## 🎯 Características

- ✅ **100% Funcional** - Sistema completo testado
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile
- ✅ **Integrado** - APIs reais conectadas
- ✅ **Documentado** - Guias completos inclusos
- ✅ **Pronto para Produção** - Configuração incluída

## 🏆 Sistema Completo

Este é um sistema profissional completo que inclui:
- Loja virtual moderna
- Painel administrativo
- Automação total de entrega
- Integração com APIs reais
- Documentação completa
- Scripts de instalação

**Pronto para usar em produção! 🚀**

---

*Desenvolvido com ❤️ para automatizar seu negócio de suplementos*
