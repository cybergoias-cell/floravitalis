# Sistema de Automação de Entrega

Este projeto é um sistema completo de automação de entrega para uma distribuidora de suplementos alimentares, construído com Node.js e Express. Ele automatiza o processo desde a confirmação do pagamento até a notificação do cliente, incluindo geração de etiquetas de envio e controle de estoque.

## Funcionalidades

- **Webhook de Pagamento**: Escuta confirmações de pagamento (PagSeguro) para iniciar o fluxo de automação.
- **Geração de Etiqueta**: Integra-se com a API da Melhor Envio (ambiente de sandbox) para gerar etiquetas de envio (PAC).
- **Controle de Estoque**: Atualiza o estoque dos produtos em um arquivo JSON local (`produtos.json`) após cada venda.
- **Alertas de Estoque Baixo**: Registra um aviso em `estoque_baixo.txt` quando o estoque de um produto atinge 3 unidades ou menos.
- **Notificação ao Cliente**: Envia uma mensagem via WhatsApp (Twilio) com o código de rastreamento do pedido.
- **Painel de Administração (API)**: Fornece endpoints para consultar o status dos pedidos, o estoque atual e outras informações relevantes.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **APIs Externas**:
  - PagSeguro (para webhooks de pagamento)
  - Melhor Envio (para etiquetas de envio)
  - Twilio (para notificações via WhatsApp)
- **Dependências**: `express`, `axios`, `dotenv`

---

## Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clonar o Repositório

```bash
# (Exemplo, já que os arquivos são fornecidos diretamente)
git clone https://github.com/exemplo/sistema-automacao-entrega.git
cd sistema-automacao-entrega
```

### 2. Instalar Dependências

Certifique-se de ter o Node.js e o npm instalados. Em seguida, instale as dependências do projeto:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`:

```bash
cp .env.example .env
```

Agora, edite o arquivo `.env` com suas credenciais e configurações:

```dotenv
# .env

# Porta da aplicação
PORT=3000

# --- Credenciais Melhor Envio (Sandbox) ---
MELHOR_ENVIO_TOKEN="SEU_TOKEN_DO_MELHOR_ENVIO_SANDBOX"

# --- Credenciais Twilio ---
TWILIO_ACCOUNT_SID="SEU_ACCOUNT_SID_DA_TWILIO"
TWILIO_AUTH_TOKEN="SEU_AUTH_TOKEN_DA_TWILIO"
TWILIO_WHATSAPP_FROM="+14155238886" # Número do sandbox da Twilio

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
- **Melhor Envio (Sandbox)**: Crie uma conta no [sandbox da Melhor Envio](https://sandbox.melhorenvio.com.br/) e gere um token de aplicação em `Painel > Gerenciar > Tokens`.
- **Twilio**: Obtenha o `Account SID` e `Auth Token` no [console da Twilio](https://www.twilio.com/console). Para testar, você pode usar o número do sandbox do WhatsApp da Twilio.

### 4. Iniciar o Servidor

Execute o comando abaixo para iniciar a aplicação:

```bash
npm start
# ou
node index.js
```

O servidor estará rodando em `http://localhost:3000`.

---

## Como Testar

Para testar o fluxo completo, é necessário expor sua máquina local para a internet, permitindo que o webhook do PagSeguro alcance sua aplicação. Usaremos o **ngrok** para isso.

### 1. Instalar e Configurar o ngrok

- Baixe e instale o [ngrok](https://ngrok.com/download).
- Autentique seu cliente ngrok (o token é fornecido no painel do ngrok):
  ```bash
  ngrok config add-authtoken SEU_TOKEN_DO_NGROK
  ```

### 2. Expor a Aplicação

Com o servidor rodando na porta 3000, execute o seguinte comando em um novo terminal:

```bash
ngrok http 3000
```

O ngrok gerará uma URL pública (ex: `https://abcdef123456.ngrok.io`). Esta URL agora aponta para a sua aplicação local.

### 3. Simular o Webhook do PagSeguro

Use uma ferramenta como `curl` ou Postman para enviar uma requisição POST para o endpoint do webhook, usando a URL gerada pelo ngrok.

**Exemplo com `curl`:**

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

**Observação**: Substitua `SUA_URL_DO_NGROK` pela URL fornecida pelo ngrok.

Após enviar a requisição, observe o console onde o servidor Node.js está rodando. Você verá os logs de cada etapa do processo: geração da etiqueta, atualização do estoque e notificação do cliente.

---

## Endpoints da API

O sistema também fornece uma API para administração e consulta.

- `GET /health`
  - **Descrição**: Verifica se a aplicação está no ar.
  - **Resposta**: `{ "status": "OK", "timestamp": "..." }`

- `GET /pedidos`
  - **Descrição**: Lista todos os pedidos processados.
  - **Resposta**: `{ "total": 1, "pedidos": [...] }`

- `GET /pedidos/:id`
  - **Descrição**: Retorna os detalhes de um pedido específico, incluindo o status da etiqueta, notificação e o estoque atual dos produtos.
  - **Resposta**: `{ "id": "...", "status": "processado", "etiqueta": {...}, "notificacao": {...}, "estoque_atual": {...} }`

- `GET /estoque`
  - **Descrição**: Retorna o status atual de todos os produtos no estoque.
  - **Resposta**: `{ "produtos": [...], "alertas": 1 }`

- `GET /alertas/estoque-baixo`
  - **Descrição**: Lista os últimos 50 alertas de estoque baixo registrados.
  - **Resposta**: `{ "total": 1, "alertas": [...] }`

