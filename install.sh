#!/bin/bash

# 🚀 Script de Instalação Automática - Sistema de Automação de Entrega
# Versão: 1.0
# Autor: Sistema Manus

echo "🚀 Iniciando instalação do Sistema de Automação de Entrega..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se Node.js está instalado
check_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js encontrado: $NODE_VERSION"
        
        # Verificar se a versão é 18+
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js versão 18+ é necessário. Versão atual: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar."
        print_info "Visite: https://nodejs.org/"
        exit 1
    fi
}

# Verificar se npm está instalado
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm encontrado: $NPM_VERSION"
    else
        print_error "npm não encontrado. Por favor, instale npm antes de continuar."
        exit 1
    fi
}

# Instalar pnpm se não estiver instalado
install_pnpm() {
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        print_status "pnpm encontrado: $PNPM_VERSION"
    else
        print_info "Instalando pnpm..."
        npm install -g pnpm
        if [ $? -eq 0 ]; then
            print_status "pnpm instalado com sucesso"
        else
            print_warning "Falha ao instalar pnpm. Usando npm como alternativa."
        fi
    fi
}

# Instalar dependências do backend
install_backend_deps() {
    print_info "Instalando dependências do backend..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "Dependências do backend instaladas"
    else
        print_error "Falha ao instalar dependências do backend"
        exit 1
    fi
}

# Instalar dependências da loja virtual
install_store_deps() {
    print_info "Instalando dependências da loja virtual..."
    cd loja-virtual
    
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    
    if [ $? -eq 0 ]; then
        print_status "Dependências da loja virtual instaladas"
    else
        print_error "Falha ao instalar dependências da loja virtual"
        exit 1
    fi
    cd ..
}

# Instalar dependências do painel admin
install_admin_deps() {
    print_info "Instalando dependências do painel administrativo..."
    cd admin-frontend
    
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    
    if [ $? -eq 0 ]; then
        print_status "Dependências do painel admin instaladas"
    else
        print_error "Falha ao instalar dependências do painel admin"
        exit 1
    fi
    cd ..
}

# Configurar arquivo .env
setup_env() {
    if [ ! -f .env ]; then
        print_info "Configurando arquivo .env..."
        cp .env.example .env
        print_status "Arquivo .env criado"
        print_warning "IMPORTANTE: Edite o arquivo .env com suas credenciais antes de usar o sistema"
        print_info "Execute: nano .env"
    else
        print_status "Arquivo .env já existe"
    fi
}

# Tornar scripts executáveis
make_scripts_executable() {
    print_info "Configurando permissões dos scripts..."
    chmod +x start-dev.sh
    chmod +x install.sh
    print_status "Permissões configuradas"
}

# Verificar portas disponíveis
check_ports() {
    print_info "Verificando portas disponíveis..."
    
    # Verificar porta 3000 (backend)
    if lsof -i :3000 &> /dev/null; then
        print_warning "Porta 3000 está em uso. O backend pode não iniciar corretamente."
    else
        print_status "Porta 3000 disponível (backend)"
    fi
    
    # Verificar porta 5173 (admin)
    if lsof -i :5173 &> /dev/null; then
        print_warning "Porta 5173 está em uso. O painel admin pode não iniciar corretamente."
    else
        print_status "Porta 5173 disponível (admin)"
    fi
    
    # Verificar porta 5174 (loja)
    if lsof -i :5174 &> /dev/null; then
        print_warning "Porta 5174 está em uso. A loja virtual pode não iniciar corretamente."
    else
        print_status "Porta 5174 disponível (loja)"
    fi
}

# Criar diretórios necessários
create_directories() {
    print_info "Criando diretórios necessários..."
    mkdir -p logs
    mkdir -p uploads
    mkdir -p temp
    print_status "Diretórios criados"
}

# Função principal
main() {
    echo ""
    print_info "Verificando pré-requisitos..."
    check_nodejs
    check_npm
    install_pnpm
    
    echo ""
    print_info "Instalando dependências..."
    install_backend_deps
    install_store_deps
    install_admin_deps
    
    echo ""
    print_info "Configurando sistema..."
    setup_env
    make_scripts_executable
    create_directories
    check_ports
    
    echo ""
    echo "=================================================="
    print_status "Instalação concluída com sucesso! 🎉"
    echo "=================================================="
    echo ""
    print_info "Próximos passos:"
    echo "1. Configure suas credenciais no arquivo .env:"
    echo "   nano .env"
    echo ""
    echo "2. Inicie o sistema:"
    echo "   ./start-dev.sh"
    echo ""
    echo "3. Acesse as interfaces:"
    echo "   • Loja Virtual: http://localhost:5174"
    echo "   • Painel Admin: http://localhost:5173"
    echo "   • API Backend:  http://localhost:3000"
    echo ""
    print_info "Para mais informações, consulte:"
    echo "   • INSTALACAO-COMPLETA.md"
    echo "   • README-COMPLETO.md"
    echo ""
    print_status "Sistema pronto para uso!"
}

# Executar função principal
main
