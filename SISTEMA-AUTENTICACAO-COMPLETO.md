# Sistema de Autenticação Completo

## Visão Geral

O sistema de e-commerce e entrega automatizada agora conta com um **sistema de autenticação completo e seguro** que permite o gerenciamento de usuários administrativos e clientes da loja virtual. A implementação utiliza **JSON Web Tokens (JWT)** para autenticação stateless e **bcrypt** para criptografia de senhas.

## Arquitetura de Autenticação

### Backend (Node.js + Express)

O backend implementa uma arquitetura de autenticação robusta com os seguintes componentes principais:

**Middleware de Autenticação**
- `authenticateToken`: Verifica a validade do token JWT em rotas protegidas
- `requireAdmin`: Garante que apenas administradores acessem rotas administrativas
- Configuração CORS adequada para permitir requisições dos frontends

**Endpoints de Autenticação**
- `POST /auth/admin/login`: Login específico para administradores
- `POST /auth/cliente/login`: Login para clientes da loja virtual
- `POST /auth/cliente/cadastro`: Registro de novos clientes
- `GET /auth/verify`: Verificação de validade do token
- `POST /auth/logout`: Logout (invalidação no frontend)

**Rotas Protegidas para Administradores**
- `GET /admin/usuarios`: Listagem de todos os usuários
- `PUT /admin/usuarios/:id`: Atualização de dados de usuário
- `DELETE /admin/usuarios/:id`: Remoção de usuário
- `GET /admin`: Página de redirecionamento para o painel administrativo

### Frontend Administrativo (React + Vite)

O painel administrativo implementa um sistema de autenticação completo com:

**Página de Login**
- Interface moderna e responsiva com gradientes e animações
- Validação de formulário em tempo real
- Feedback visual para estados de loading e erro
- Credenciais de demonstração visíveis para facilitar testes

**Sistema de Sessão**
- Verificação automática de autenticação ao carregar a aplicação
- Armazenamento seguro do token no localStorage
- Redirecionamento automático para login quando não autenticado
- Logout com limpeza completa da sessão

**Gerenciamento de Usuários**
- Interface completa para visualização de todos os usuários
- Filtros por tipo (admin/cliente) e status (ativo/inativo)
- Busca em tempo real por nome, email ou username
- Edição inline de informações de usuário
- Ativação/desativação de contas
- Remoção segura com confirmação

### Frontend da Loja Virtual (React + Vite)

A loja virtual integra autenticação de clientes com:

**Modal de Autenticação**
- Interface unificada para login e cadastro
- Alternância fluida entre modos de login e registro
- Validação completa de formulários
- Campos opcionais para informações adicionais do cliente

**Gerenciamento de Estado**
- Store Zustand com persistência de dados
- Verificação automática de autenticação
- Integração com carrinho de compras
- Logout com limpeza de dados sensíveis

## Estrutura de Dados

### Usuários Administrativos

```json
{
  "id": "admin001",
  "username": "admin",
  "email": "admin@suplementsstore.com",
  "password": "$2a$10$...", // Hash bcrypt
  "role": "admin",
  "name": "Administrador",
  "created_at": "2024-01-01T00:00:00.000Z",
  "last_login": "2025-10-11T16:33:31.206Z",
  "active": true
}
```

### Clientes da Loja

```json
{
  "id": "cliente001",
  "email": "joao@email.com",
  "password": "$2a$10$...", // Hash bcrypt
  "name": "João da Silva",
  "cpf": "123.456.789-00",
  "phone": "11999887766",
  "birth_date": "1990-05-15",
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 101",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipcode": "01234-567"
  },
  "created_at": "2024-01-15T10:30:00.000Z",
  "last_login": null,
  "active": true,
  "newsletter": true
}
```

## Segurança Implementada

### Criptografia de Senhas
- Utilização do **bcrypt** com salt de 10 rounds
- Senhas nunca armazenadas em texto plano
- Verificação segura durante o login

### Tokens JWT
- Chave secreta configurável via variável de ambiente
- Expiração padrão de 24 horas
- Payload mínimo com informações essenciais do usuário

### Validações
- Verificação de email único durante o registro
- Validação de campos obrigatórios
- Sanitização de dados de entrada
- Prevenção contra tentativas de login com contas inativas

### Controle de Acesso
- Middleware de autenticação em todas as rotas protegidas
- Verificação de role para rotas administrativas
- Proteção contra remoção da própria conta de admin

## Funcionalidades Principais

### Para Administradores
1. **Login Seguro**: Acesso ao painel com credenciais específicas
2. **Dashboard Completo**: Visão geral do sistema com métricas
3. **Gerenciamento de Usuários**: CRUD completo de clientes e admins
4. **Controle de Acesso**: Ativação/desativação de contas
5. **Auditoria**: Visualização de datas de criação e último login

### Para Clientes
1. **Registro Simplificado**: Cadastro rápido com dados mínimos
2. **Login Unificado**: Acesso único para toda a loja virtual
3. **Perfil Persistente**: Dados salvos entre sessões
4. **Integração com Carrinho**: Carrinho vinculado ao usuário logado

## Configuração e Instalação

### Variáveis de Ambiente
```bash
JWT_SECRET=sua_chave_secreta_super_segura_aqui_2024
JWT_EXPIRES_IN=24h
```

### Credenciais de Demonstração

**Administrador:**
- Usuário: `admin`
- Senha: `password`

**Cliente de Teste:**
- Email: `joao@email.com`
- Senha: `password`

### Comandos de Inicialização

```bash
# Backend
cd sistema-entrega
npm install
node index.js

# Painel Administrativo
cd admin-frontend
npm install --legacy-peer-deps
npm run dev

# Loja Virtual
cd loja-virtual
npm install --legacy-peer-deps
npm run dev
```

## URLs de Acesso

- **Backend API**: http://localhost:3000
- **Painel Administrativo**: http://localhost:5173
- **Loja Virtual**: http://localhost:5174
- **Rota Admin Protegida**: http://localhost:3000/admin

## Fluxos de Autenticação

### Fluxo de Login do Administrador
1. Acesso ao painel administrativo
2. Redirecionamento automático para login se não autenticado
3. Validação de credenciais no backend
4. Geração e retorno de token JWT
5. Armazenamento do token no localStorage
6. Redirecionamento para dashboard

### Fluxo de Registro de Cliente
1. Abertura do modal de autenticação na loja
2. Preenchimento do formulário de cadastro
3. Validação de dados no frontend
4. Envio para endpoint de registro
5. Criação do usuário com senha criptografada
6. Login automático após registro bem-sucedido

### Fluxo de Verificação de Sessão
1. Carregamento da aplicação
2. Verificação de token no localStorage
3. Validação do token no backend via `/auth/verify`
4. Restauração do estado de autenticação
5. Redirecionamento apropriado baseado no status

## Melhorias Futuras

### Segurança Avançada
- Implementação de refresh tokens
- Rate limiting para tentativas de login
- Logs de auditoria de segurança
- Autenticação de dois fatores (2FA)

### Funcionalidades Adicionais
- Recuperação de senha via email
- Perfil de usuário editável
- Histórico de pedidos por cliente
- Notificações push para administradores

### Performance
- Cache de sessões ativas
- Otimização de consultas de usuários
- Compressão de tokens JWT

## Conclusão

O sistema de autenticação implementado fornece uma base sólida e segura para o e-commerce de suplementos, com interfaces modernas tanto para administradores quanto para clientes. A arquitetura modular permite fácil expansão e manutenção, enquanto as práticas de segurança implementadas garantem a proteção dos dados dos usuários.

O sistema está pronto para produção e pode ser facilmente integrado com serviços de email, sistemas de pagamento e outras funcionalidades avançadas conforme necessário.
