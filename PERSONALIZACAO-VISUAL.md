# Sistema de Personalização Visual da Loja Virtual

Este documento detalha a implementação do sistema de personalização visual para a loja virtual, permitindo que administradores gerenciem a logo e um carrossel de banners diretamente pelo painel administrativo.

## 1. Gerenciamento de Logo

O sistema agora permite que a logo da loja virtual seja atualizada dinamicamente através do painel administrativo. A logo é exibida no cabeçalho da loja e pode ser facilmente substituída por uma nova imagem.

### Funcionalidades:
- **Upload de Imagem**: Administradores podem fazer upload de uma nova imagem para a logo (formatos PNG, JPG, GIF, WEBP, até 5MB).
- **Visualização Instantânea**: A logo é atualizada em tempo real na loja virtual após o upload.
- **Fallback**: Em caso de falha no carregamento da logo personalizada, uma logo padrão é exibida.

### Como Utilizar (Painel Administrativo):
1. Acesse o painel administrativo e navegue até a seção **"Personalização"**.
2. Na seção **"Logo da Loja"**, você verá a logo atual.
3. Clique na área de upload ou arraste e solte um arquivo de imagem para enviar uma nova logo.
4. A logo será automaticamente atualizada na loja virtual.

## 2. Carrossel de Banners na Página Principal

Um carrossel de banners foi implementado na página principal da loja virtual, permitindo exibir até 5 imagens promocionais ou informativas. Os banners podem ser gerenciados individualmente, incluindo sua visibilidade e conteúdo.

### Funcionalidades:
- **Upload de Banners**: Administradores podem fazer upload de até 5 imagens para o carrossel (formatos PNG, JPG, GIF, WEBP, até 5MB).
- **Controle de Visibilidade**: Cada banner pode ser ativado ou desativado individualmente.
- **Conteúdo Personalizável**: Para cada banner, é possível definir:
    - **Título**
    - **Subtítulo**
    - **Link** (para direcionar o usuário ao clicar no banner)
    - **Texto Alternativo (ALT)** para acessibilidade.
- **Configurações do Carrossel**: Controle a reprodução automática (`autoplay`) e o intervalo de tempo entre os slides.
- **Navegação**: O carrossel possui setas de navegação e indicadores de slide para uma melhor experiência do usuário.

### Como Utilizar (Painel Administrativo):
1. Acesse o painel administrativo e navegue até a seção **"Personalização"**.
2. Na seção **"Carrossel de Banners"**, você pode:
    - Ativar/desativar a exibição do carrossel na loja.
    - Ativar/desativar a reprodução automática e ajustar o intervalo.
    - Clicar em **"Adicionar Banner"** para fazer upload de uma nova imagem e preencher seus detalhes.
    - Para banners existentes, use os ícones de **olho** para ativar/desativar, **lápis** para editar detalhes (título, subtítulo, link, alt) e **lixeira** para remover.

### Implementação Técnica

**Backend (Node.js/Express):**
- **`multer`**: Utilizado para lidar com o upload de arquivos de imagem para o servidor.
- **Diretórios de Upload**: Imagens são armazenadas em `uploads/logos` e `uploads/banners`.
- **`configuracoes-visuais.json`**: Um arquivo JSON persistente armazena as URLs das imagens, textos e configurações do carrossel.
- **Endpoints de API**: 
    - `GET /api/configuracoes-visuais`: Retorna as configurações visuais atuais.
    - `POST /admin/upload-logo`: Faz upload e atualiza a logo.
    - `POST /admin/upload-banner`: Faz upload e adiciona um novo banner.
    - `GET /admin/banners`: Lista os banners para o admin.
    - `PUT /admin/banners/:id`: Atualiza detalhes de um banner.
    - `DELETE /admin/banners/:id`: Remove um banner.
    - `PUT /admin/carrossel-config`: Atualiza configurações gerais do carrossel.

**Frontend (React):**
- **Painel Administrativo (`admin-frontend`):**
    - Componente `Personalizacao.jsx`: Interface para gerenciar a logo e os banners, com formulários de upload e edição.
    - `App.jsx` e `Layout.jsx`: Atualizados para incluir e navegar para o novo componente de personalização.
- **Loja Virtual (`loja-virtual`):**
    - Componente `BannerCarousel.jsx`: Exibe o carrossel de banners na `HomePage.jsx`.
    - Componente `DynamicLogo.jsx`: Carrega e exibe a logo configurada no `Header.jsx`.

Este sistema garante flexibilidade e controle total sobre a aparência visual da loja, permitindo que os administradores atualizem o conteúdo promocional e a identidade visual de forma autônoma.
