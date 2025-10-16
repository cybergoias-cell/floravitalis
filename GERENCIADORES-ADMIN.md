'''
# Novos Gerenciadores do Painel Administrativo

O painel administrativo foi aprimorado com dois novos módulos essenciais: um **Gerenciador de Produtos** completo e um **Gerenciador de Sessões** para monitoramento em tempo real.

## 1. Gerenciador de Produtos

Este módulo oferece controle total sobre o catálogo de produtos da loja virtual, permitindo operações de CRUD (Criar, Ler, Atualizar, Deletar) de forma intuitiva.

### Funcionalidades Principais

- **Visualização Completa:** Lista todos os produtos com informações essenciais como nome, categoria, preço, estoque e avaliação.
- **Criação de Produtos:** Um modal completo permite adicionar novos produtos ao catálogo, com campos para todas as propriedades, incluindo nome, descrição, preços, categoria, marca, estoque inicial, peso e características.
- **Edição Rápida:** Edite qualquer produto existente através de um modal pré-preenchido.
- **Atualização de Estoque Inline:** O estoque de cada produto pode ser atualizado diretamente na tabela, agilizando a gestão.
- **Remoção Segura:** Delete produtos do catálogo com uma etapa de confirmação para evitar exclusões acidentais.
- **Busca e Filtro:** Encontre produtos rapidamente usando a busca por nome/descrição ou filtre por categoria.
- **Cards de Estatísticas:** Tenha uma visão rápida do valor total do inventário, número de produtos em estoque e avaliação média.

### Como Utilizar

1.  Acesse o painel administrativo e clique em **"Produtos"** no menu lateral.
2.  Para adicionar um novo item, clique em **"Novo Produto"**.
3.  Para editar, clique no ícone de lápis (`<Edit />`) na linha do produto desejado.
4.  Para remover, clique no ícone de lixeira (`<Trash2 />`).
5.  Para atualizar o estoque, altere o valor no campo de estoque na tabela e clique fora do campo para salvar.

## 2. Gerenciador de Sessões

Monitore todas as sessões de usuários ativas no sistema, tanto de administradores quanto de clientes, garantindo maior segurança e controle.

### Funcionalidades Principais

- **Monitoramento em Tempo Real:** Veja todas as sessões ativas, com atualização automática a cada 30 segundos (pode ser desativado).
- **Informações Detalhadas:** Para cada sessão, visualize o usuário, tipo (admin/cliente), status (ativo/inativo), dispositivo (IP, User Agent, navegador), horário de login e duração.
- **Invalidar Sessões:**
    - **Individual:** Invalide uma sessão específica, forçando o logout do usuário naquele dispositivo.
    - **Todas do Usuário:** Invalide todas as sessões ativas de um determinado usuário com um único clique.
- **Cards de Estatísticas:** Acompanhe o número total de sessões, sessões ativas, usuários únicos e a duração da sessão mais longa.
- **Análise de Dispositivos:** Identifique rapidamente se o acesso é via desktop ou mobile.

### Como Utilizar

1.  Acesse o painel administrativo e clique em **"Sessões"** no menu lateral.
2.  A lista de sessões será carregada e atualizada automaticamente.
3.  Para forçar uma atualização, clique em **"Atualizar"**.
4.  Para invalidar uma sessão, clique no ícone de lixeira (`<Trash2 />`) na linha correspondente.
5.  Para desconectar um usuário de todos os seus dispositivos, clique no ícone de múltiplos usuários (`<Users />`).

## Segurança e Implementação

- **Backend:** Novos endpoints foram adicionados ao `index.js` para suportar as operações de CRUD de produtos e o gerenciamento de sessões.
- **Frontend:** Os componentes `Produtos.jsx` e `Sessoes.jsx` foram criados para fornecer as interfaces, utilizando `React` e `Tailwind CSS` para uma experiência de usuário moderna.
- **Persistência:** As sessões são armazenadas em memória no backend (para produção, recomenda-se o uso de um banco de dados como Redis). A limpeza de sessões expiradas ocorre automaticamente.
'''
