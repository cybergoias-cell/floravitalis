#!/bin/bash

echo "🚀 Iniciando Sistema de Automação de Entrega..."
echo "================================================"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
fi

if [ ! -d "admin-frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd admin-frontend
    pnpm install
    cd ..
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📋 Copiando .env.example para .env..."
    cp .env.example .env
    echo "✏️  Por favor, edite o arquivo .env com suas credenciais antes de continuar."
    echo "💡 Pressione Enter para continuar mesmo assim (modo demo)..."
    read
fi

echo ""
echo "🔧 Configuração:"
echo "   Backend: http://localhost:3000"
echo "   Frontend: http://localhost:5173"
echo ""

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo "🛑 Parando sistema..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Sistema parado com sucesso!"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Iniciar backend em background
echo "📡 Iniciando backend..."
node index.js &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Verificar se backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Erro ao iniciar backend!"
    echo "💡 Verifique se a porta 3000 está disponível"
    exit 1
fi

echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Iniciar frontend
echo "🎨 Iniciando frontend..."
cd admin-frontend
pnpm run dev --host &
FRONTEND_PID=$!
cd ..

# Aguardar frontend inicializar
sleep 5

# Verificar se frontend está rodando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Erro ao iniciar frontend!"
    echo "💡 Verifique se a porta 5173 está disponível"
    cleanup
    exit 1
fi

echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
echo ""
echo "🎉 Sistema iniciado com sucesso!"
echo "================================================"
echo "📡 API Backend: http://localhost:3000"
echo "🎨 Interface Admin: http://localhost:5173"
echo "📖 Documentação: README-COMPLETO.md"
echo ""
echo "💡 Para testar o webhook, use ngrok:"
echo "   ngrok http 3000"
echo ""
echo "🛑 Para parar o sistema, pressione Ctrl+C"
echo "================================================"

# Aguardar indefinidamente
while true; do
    sleep 1
    
    # Verificar se os processos ainda estão rodando
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend parou inesperadamente!"
        cleanup
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend parou inesperadamente!"
        cleanup
        exit 1
    fi
done
