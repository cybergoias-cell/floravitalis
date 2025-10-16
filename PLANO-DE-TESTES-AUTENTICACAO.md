'''
# Plano de Testes: Sistema de Autenticação

Este documento detalha os casos de teste para o novo sistema de autenticação implementado no sistema de e-commerce e entrega automatizada.

## 1. Autenticação do Administrador

| ID | Cenário de Teste | Passos para Execução | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **1.1** | Acesso à página de login | 1. Acessar a URL do painel administrativo (`http://localhost:5173`). | O usuário é redirecionado para a página de login. |
| **1.2** | Login com credenciais inválidas | 1. Inserir um nome de usuário e/ou senha incorretos. <br> 2. Clicar em "Entrar". | Uma mensagem de erro informando "Credenciais inválidas" é exibida. |
| **1.3** | Login com credenciais válidas | 1. Inserir o nome de usuário `admin` e a senha `password`. <br> 2. Clicar em "Entrar". | O login é bem-sucedido e o usuário é redirecionado para o dashboard do painel administrativo. |
| **1.4** | Acesso a rota protegida sem login | 1. Tentar acessar diretamente uma rota do admin (ex: `/pedidos`) sem estar logado. | O usuário é redirecionado para a página de login. |
| **1.5** | Logout do painel | 1. Com o admin logado, clicar no botão "Sair". | O usuário é deslogado, o token de acesso é removido e a página de login é exibida. |

## 2. Autenticação do Cliente (Loja Virtual)

| ID | Cenário de Teste | Passos para Execução | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **2.1** | Registro de novo cliente | 1. Na loja virtual (`http://localhost:5174`), abrir o modal de autenticação. <br> 2. Selecionar a aba "Cadastrar". <br> 3. Preencher os dados com um novo e-mail. <br> 4. Clicar em "Criar Conta". | O usuário é criado, logado automaticamente e o modal é fechado. As informações do usuário aparecem no cabeçalho. |
| **2.2** | Tentativa de registro com e-mail existente | 1. Tentar registrar um novo usuário utilizando um e-mail já cadastrado. | Uma mensagem de erro "Este e-mail já está cadastrado" é exibida. |
| **2.3** | Login de cliente | 1. Abrir o modal de autenticação. <br> 2. Inserir o e-mail e a senha do usuário recém-criado. <br> 3. Clicar em "Entrar". | O login é bem-sucedido e as informações do usuário são exibidas no cabeçalho. |
| **2.4** | Logout da loja | 1. Com o cliente logado, clicar na opção "Sair" no menu do usuário. | O usuário é deslogado e as informações do cabeçalho são atualizadas para o estado de "não logado". |

## 3. Gerenciamento de Usuários (Painel Admin)

| ID | Cenário de Teste | Passos para Execução | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **3.1** | Visualização de usuários | 1. No painel admin, navegar para a página "Usuários". | A lista de todos os usuários (admins e clientes), incluindo o cliente recém-criado, é exibida. |
| **3.2** | Filtro e busca de usuários | 1. Utilizar a barra de busca para encontrar o novo cliente pelo nome ou e-mail. <br> 2. Utilizar os filtros de "Tipo" e "Status". | A lista de usuários é filtrada corretamente de acordo com os critérios de busca e filtros. |
| **3.3** | Edição de usuário | 1. Clicar no botão "Editar" do novo cliente. <br> 2. Alterar o nome e o telefone. <br> 3. Salvar as alterações. | As informações do usuário são atualizadas na lista. |
| **3.4** | Desativação de usuário | 1. Clicar no ícone para desativar o usuário. | O status do usuário muda para "Inativo". O login na loja virtual com este usuário deve falhar. |
| **3.5** | Reativação de usuário | 1. Clicar no ícone para reativar o usuário. | O status do usuário muda para "Ativo". O login na loja virtual com este usuário deve ser bem-sucedido. |
| **3.6** | Remoção de usuário | 1. Clicar no botão "Remover" do usuário. <br> 2. Confirmar a exclusão. | O usuário é removido permanentemente da lista. O login com este usuário deve falhar. |

'''
