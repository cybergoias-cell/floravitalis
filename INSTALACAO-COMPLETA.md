# 🚀 Guia de Instalação Completa - Sistema de Automação de Entrega

## 📦 **Conteúdo do Pacote**

Este pacote contém o sistema completo de automação de entrega com:

- **Backend API** (Node.js + Express)
- **Loja Virtual** (React + Vite)
- **Painel Administrativo** (React + Vite)
- **Documentação Completa**
- **Arquivos de Configuração**

## 🛠️ **Pré-requisitos**

### **Software Necessário**
```bash
# Node.js 18+ (recomendado 20+)
# npm ou pnpm
# Git (opcional)
```

### **Verificar Versões**
```bash
node --version  # v18.0.0 ou superior
npm --version   # 8.0.0 ou superior
```

## 📥 **Instalação**

### **1. Descompactar o Projeto**
```bash
# Extrair o arquivo
tar -xzf sistema-completo-loja-virtual.tar.gz

# Entrar no diretório
cd sistema-entrega
```

### **2. Instalar Dependências do Backend**
```bash
# No diretório raiz (sistema-entrega)
npm install
```

### **3. Instalar Dependências da Loja Virtual**
```bash
# Entrar no diretório da loja
cd loja-virtual

# Instalar dependências
pnpm install
# ou se não tiver pnpm: npm install

# Voltar ao diretório raiz
cd ..
```

### **4. Instalar Dependências do Painel Admin**
```bash
# Entrar no diretório do admin
cd admin-frontend

# Instalar dependências
pnpm install
# ou se não tiver pnpm: npm install

# Voltar ao diretório raiz
cd ..
```

## ⚙️ **Configuração**

### **1. Configurar Variáveis de Ambiente**
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env com suas credenciais
nano .env
```

### **2. Configurações Necessárias no .env**
```env
# Servidor
PORT=3000
NODE_ENV=development

# PagSeguro
PAGSEGURO_TOKEN=seu_token_pagseguro_aqui
PAGSEGURO_SANDBOX=true

# Melhor Envio
MELHOR_ENVIO_TOKEN=seu_token_melhor_envio_aqui
MELHOR_ENVIO_SANDBOX=true

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_AUTH_TOKEN=seu_auth_token_aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Dados da Empresa
COMPANY_NAME=Sua Empresa
COMPANY_ADDRESS=Seu Endereço Completo
COMPANY_ZIPCODE=00000-000
COMPANY_PHONE=11999999999
```

## 🚀 **Executar o Sistema**

### **Opção 1: Script Automático (Recomendado)**
```bash
# Executar script de inicialização
./start-dev.sh
```

### **Opção 2: Executar Manualmente**
```bash
# Terminal 1 - Backend (porta 3000)
node index.js

# Terminal 2 - Loja Virtual (porta 5174)
cd loja-virtual
pnpm run dev

# Terminal 3 - Painel Admin (porta 5173)
cd admin-frontend
pnpm run dev
```

## 🌐 **Acessar o Sistema**

Após inicializar, acesse:

- **Loja Virtual**: http://localhost:5174
- **Painel Admin**: http://localhost:5173
- **API Backend**: http://localhost:3000
- **Documentação API**: http://localhost:3000 (página inicial)

## 🧪 **Testar o Sistema**

### **1. Testar Webhook PagSeguro**
```bash
curl -X POST http://localhost:3000/webhook/pagseguro \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TESTE001",
    "status": "PAID",
    "amount": 159.90,
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
    "items": [
      {
        "sku": "WHEY001",
        "name": "Whey Protein",
        "quantity": 1
      }
    ]
  }'
```

### **2. Verificar APIs**
```bash
# Verificar saúde da API
curl http://localhost:3000/health

# Listar produtos
curl http://localhost:3000/api/produtos

# Listar pedidos
curl http://localhost:3000/pedidos
```

## 🔧 **Configuração para Produção**

### **1. Variáveis de Ambiente de Produção**
```env
NODE_ENV=production
PORT=3000

# Usar tokens de produção
PAGSEGURO_SANDBOX=false
MELHOR_ENVIO_SANDBOX=false

# Configurar domínio
FRONTEND_URL=https://seudominio.com
ADMIN_URL=https://admin.seudominio.com
```

### **2. Build da Loja Virtual**
```bash
cd loja-virtual
pnpm run build
# Arquivos gerados em: dist/
```

### **3. Build do Painel Admin**
```bash
cd admin-frontend
pnpm run build
# Arquivos gerados em: dist/
```

### **4. Configurar Nginx (Exemplo)**
```nginx
# Loja Virtual
server {
    listen 80;
    server_name seudominio.com;
    root /caminho/para/loja-virtual/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Painel Admin
server {
    listen 80;
    server_name admin.seudominio.com;
    root /caminho/para/admin-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API Backend
server {
    listen 80;
    server_name api.seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 **Configurações de Segurança**

### **1. Firewall**
```bash
# Permitir apenas portas necessárias
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # API (apenas se necessário)
ufw enable
```

### **2. SSL/TLS (Let's Encrypt)**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificados
sudo certbot --nginx -d seudominio.com
sudo certbot --nginx -d admin.seudominio.com
sudo certbot --nginx -d api.seudominio.com
```

### **3. PM2 para Produção**
```bash
# Instalar PM2
npm install -g pm2

# Iniciar backend com PM2
pm2 start index.js --name "sistema-backend"

# Configurar auto-start
pm2 startup
pm2 save
```

## 📊 **Monitoramento**

### **1. Logs do Sistema**
```bash
# Ver logs do backend
pm2 logs sistema-backend

# Ver logs em tempo real
tail -f logs/sistema.log
```

### **2. Métricas de Performance**
```bash
# Status dos processos
pm2 status

# Monitoramento
pm2 monit
```

## 🔄 **Backup e Manutenção**

### **1. Backup dos Dados**
```bash
# Backup do banco de dados (arquivos JSON)
tar -czf backup-$(date +%Y%m%d).tar.gz \
  produtos.json \
  pedidos.json \
  estoque_baixo.txt
```

### **2. Atualizações**
```bash
# Atualizar dependências
npm update

# Reiniciar serviços
pm2 restart all
```

## 🆘 **Solução de Problemas**

### **Problemas Comuns**

**1. Erro de Porta em Uso**
```bash
# Verificar processos na porta
lsof -i :3000
# Matar processo se necessário
kill -9 PID
```

**2. Erro de Permissões**
```bash
# Ajustar permissões
chmod +x start-dev.sh
```

**3. Erro de Módulos**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**4. Erro de CORS**
```bash
# Verificar configuração no backend
# Arquivo: index.js, linha com app.use(cors())
```

## 📞 **Suporte**

### **Documentação Adicional**
- `README-COMPLETO.md` - Documentação técnica
- `LOJA-VIRTUAL-COMPLETA.md` - Detalhes da loja
- `INTERFACES-UI-COMPLETAS.md` - Documentação das interfaces

### **Estrutura de Arquivos**
```
sistema-entrega/
├── index.js                 # Backend principal
├── package.json             # Dependências backend
├── .env.example             # Exemplo de configuração
├── produtos.json            # Base de produtos
├── public/                  # Arquivos estáticos backend
├── loja-virtual/            # Frontend da loja
│   ├── src/                 # Código fonte React
│   ├── public/              # Assets públicos
│   └── package.json         # Dependências da loja
├── admin-frontend/          # Painel administrativo
│   ├── src/                 # Código fonte React
│   ├── public/              # Assets públicos
│   └── package.json         # Dependências do admin
└── docs/                    # Documentação completa
```

## ✅ **Checklist de Instalação**

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (backend, loja, admin)
- [ ] Arquivo .env configurado
- [ ] Credenciais das APIs configuradas
- [ ] Sistema iniciado com sucesso
- [ ] Loja virtual acessível
- [ ] Painel admin acessível
- [ ] API backend respondendo
- [ ] Webhook testado
- [ ] Configuração de produção (se aplicável)

**Seu sistema está pronto para uso! 🎉**
