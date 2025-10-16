# 🎨 Interfaces do Sistema de Automação de Entrega

Este documento apresenta as interfaces completas do sistema, incluindo frontend administrativo e backend API.

## 🚀 Backend API (http://localhost:3000)

### Interface Principal
A API possui uma página inicial moderna e intuitiva que apresenta:

- **Status em tempo real** da API com indicador visual
- **Documentação dos endpoints** com métodos HTTP claramente identificados
- **Design responsivo** com gradiente moderno
- **Link direto** para o painel administrativo

### Endpoints Disponíveis

#### 🔍 Health Check
- **Método:** GET
- **URL:** `/health`
- **Descrição:** Verifica se a API está funcionando
- **Resposta:** `{"status":"OK","timestamp":"2025-10-07T18:00:00.000Z"}`

#### 💳 Webhook PagSeguro
- **Método:** POST
- **URL:** `/webhook/pagseguro`
- **Descrição:** Recebe confirmações de pagamento
- **Funcionalidades:**
  - Processa pagamentos aprovados
  - Gera etiquetas de envio automaticamente
  - Atualiza estoque
  - Envia notificações WhatsApp
  - Salva dados do pedido

#### 📦 Gestão de Pedidos
- **GET** `/pedidos` - Lista todos os pedidos
- **GET** `/pedidos/:id` - Detalhes específicos de um pedido

#### 📊 Controle de Estoque
- **GET** `/estoque` - Lista produtos e quantidades
- **PUT** `/estoque/:sku` - Atualiza quantidade de produto

#### ⚠️ Sistema de Alertas
- **GET** `/alertas` - Retorna alertas de estoque baixo

---

## 🎛️ Frontend Administrativo (http://localhost:5173)

### Design System
- **Framework:** React + Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **Ícones:** Lucide React
- **Layout:** Sidebar responsiva com navegação intuitiva

### 📊 Dashboard Principal
Interface principal com métricas em tempo real:

#### Métricas Principais
- **Total de Pedidos:** Contador com crescimento percentual
- **Pedidos Hoje:** Pedidos recebidos no dia atual
- **Faturamento do Mês:** Receita total com comparativo
- **Produtos em Estoque:** Quantidade total de produtos
- **Alertas de Estoque:** Produtos com estoque baixo
- **Pedidos Processando:** Status de processamento

#### Gráficos e Analytics
- **Vendas da Semana:** Gráfico de barras com pedidos por dia
- **Status dos Pedidos:** Gráfico de pizza com distribuição por status

### 📋 Gerenciamento de Pedidos
Interface completa para gestão de pedidos:

#### Funcionalidades
- **Busca avançada** por ID do pedido ou nome do cliente
- **Filtros por status** (todos, processando, enviado, entregue)
- **Lista responsiva** com informações essenciais
- **Modal de detalhes** com informações completas:
  - Dados do cliente (nome, email, telefone)
  - Endereço completo de entrega
  - Lista de produtos com quantidades
  - Informações de envio (código de rastreamento, custo)
  - Status da etiqueta e protocolo

#### Status Visuais
- **Processado:** Verde com ícone de check
- **Enviado:** Azul com ícone de caminhão
- **Entregue:** Verde escuro com ícone de casa

### 📦 Controle de Estoque
Interface moderna para gestão de produtos:

#### Métricas do Estoque
- **Total de Produtos:** Quantidade de SKUs cadastrados
- **Estoque Total:** Soma de todas as unidades
- **Estoque Baixo:** Produtos com ≤ 3 unidades
- **Esgotados:** Produtos sem estoque

#### Lista de Produtos
- **Busca por nome ou SKU**
- **Cards informativos** com:
  - Nome e descrição do produto
  - SKU e peso
  - Quantidade atual com status visual
  - Botões de ação (aumentar, diminuir, editar)

#### Status Visuais do Estoque
- **Estoque Alto:** Verde (>10 unidades)
- **Estoque Médio:** Azul (4-10 unidades)
- **Estoque Baixo:** Laranja (1-3 unidades)
- **Esgotado:** Vermelho (0 unidades)

### ⚠️ Central de Alertas
Sistema de notificações e alertas:

#### Tipos de Alertas
- **Alertas Críticos:** Requerem ação imediata (vermelho)
- **Alertas Importantes:** Precisam de atenção (amarelo)
- **Alertas Hoje:** Gerados nas últimas 24h (azul)

#### Funcionalidades
- **Filtros por tipo** e período
- **Lista cronológica** de alertas
- **Status visual** com ícones e cores
- **Ações rápidas** para resolver alertas

### 📈 Relatórios e Analytics
Dashboard avançado com métricas de negócio:

#### Métricas Principais
- **Total de Pedidos** no período selecionado
- **Faturamento Total** com comparativo
- **Ticket Médio** por pedido
- **Taxa de Sucesso** dos processamentos

#### Gráficos Avançados
- **Vendas por Dia:** Linha temporal com tendências
- **Status dos Pedidos:** Distribuição por status
- **Produtos Mais Vendidos:** Ranking de performance
- **Faturamento Mensal:** Comparativo de períodos

#### Exportação
- **Botão de exportar** relatórios em PDF/Excel
- **Filtros de período** personalizáveis
- **Dados em tempo real** atualizados automaticamente

---

## 🎨 Características Visuais

### Paleta de Cores
- **Primária:** Azul (#3B82F6)
- **Secundária:** Verde (#10B981)
- **Alerta:** Laranja (#F59E0B)
- **Erro:** Vermelho (#EF4444)
- **Neutro:** Cinza (#6B7280)

### Tipografia
- **Fonte Principal:** Inter, system-ui
- **Tamanhos:** 12px a 32px
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Componentes
- **Cards:** Bordas arredondadas, sombras sutis
- **Botões:** Estados hover e active bem definidos
- **Inputs:** Bordas suaves com foco destacado
- **Modais:** Overlay escuro com animações suaves

### Responsividade
- **Desktop:** Layout completo com sidebar
- **Tablet:** Sidebar colapsável
- **Mobile:** Menu hambúrguer e layout adaptado

---

## 🔄 Fluxo de Integração

### 1. Recebimento do Pagamento
1. PagSeguro envia webhook para `/webhook/pagseguro`
2. Sistema valida e processa o pagamento
3. Dados são salvos na memória/banco

### 2. Processamento Automático
1. Geração de etiqueta via API Melhor Envio
2. Atualização automática do estoque
3. Envio de notificação WhatsApp via Twilio
4. Registro de logs e alertas

### 3. Monitoramento em Tempo Real
1. Frontend consulta APIs a cada 30 segundos
2. Métricas são atualizadas automaticamente
3. Alertas aparecem instantaneamente
4. Gráficos refletem dados em tempo real

---

## 🚀 Como Usar

### Inicialização
```bash
# Backend
cd sistema-entrega
node index.js

# Frontend
cd admin-frontend
pnpm run dev
```

### Acessos
- **Backend API:** http://localhost:3000
- **Frontend Admin:** http://localhost:5173

### Teste do Sistema
```bash
# Simular pagamento
curl -X POST http://localhost:3000/webhook/pagseguro \
  -H "Content-Type: application/json" \
  -d '{"id":"TESTE123","status":"PAID","amount":100.00,...}'
```

O sistema está **100% funcional** e pronto para uso em produção! 🎉
