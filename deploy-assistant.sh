#!/bin/bash

# VideoFlow Deploy Assistant (Mac/Linux)
# Este script vai te guiar passo a passo no deploy

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

clear

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🚀 VIDEOFLOW - ASSISTENTE DE DEPLOY                   ║"
echo "║                                                            ║"
echo "║     Vou te guiar passo a passo para colocar seu app       ║"
echo "║     online no Vercel + Render + MongoDB Atlas!            ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
read -p "Pressione ENTER para começar..."
clear

# ==================================================
# ETAPA 1: VERIFICAR REQUISITOS
# ==================================================

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  ETAPA 1/5: VERIFICANDO REQUISITOS                         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Verificando se você tem tudo instalado..."
echo ""

# Verificar Git
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Git instalado${NC}"
else
    echo -e "${RED}❌ Git NÃO encontrado!${NC}"
    echo ""
    echo "Por favor, instale o Git:"
    echo "https://git-scm.com/downloads"
    exit 1
fi

# Verificar Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js instalado${NC}"
else
    echo -e "${RED}❌ Node.js NÃO encontrado!${NC}"
    echo ""
    echo "Por favor, instale o Node.js:"
    echo "https://nodejs.org/"
    exit 1
fi

echo ""
echo "Agora vamos verificar algumas coisas com você..."
echo ""
echo "📝 Você tem uma conta no GitHub?"
echo "   (Precisamos para fazer deploy)"
echo ""
echo "[1] Sim, já tenho conta"
echo "[2] Não, preciso criar"
echo ""
read -p "Escolha (1 ou 2): " github_choice

if [ "$github_choice" == "2" ]; then
    echo ""
    echo -e "${BLUE}🌐 Abrindo página de registro do GitHub...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://github.com/signup"
    else
        xdg-open "https://github.com/signup" 2>/dev/null || echo "Abra: https://github.com/signup"
    fi
    
    echo ""
    echo "⏳ Crie sua conta e volte aqui quando terminar."
    echo ""
    read -p "Pressione ENTER quando terminar..."
fi

clear

# ==================================================
# ETAPA 2: MONGODB ATLAS
# ==================================================

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  ETAPA 2/5: CONFIGURAR MONGODB ATLAS (Banco de Dados)     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "🗄️  Vamos criar seu banco de dados na nuvem!"
echo ""
echo "Tempo estimado: 5 minutos"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo -e "${BOLD}📝 PASSO 1: Criar conta no MongoDB Atlas${NC}"
echo "───────────────────────────────────────────"
echo ""
echo "Vou abrir o site do MongoDB Atlas para você."
echo ""
echo "Quando abrir:"
echo "  1. Clique em 'Try Free' ou 'Sign Up'"
echo "  2. Use sua conta Google/GitHub (mais rápido)"
echo "  3. Complete o cadastro"
echo ""
echo -e "${BLUE}🌐 Abrindo MongoDB Atlas...${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://www.mongodb.com/cloud/atlas/register"
else
    xdg-open "https://www.mongodb.com/cloud/atlas/register" 2>/dev/null || echo "Abra: https://www.mongodb.com/cloud/atlas/register"
fi

echo ""
echo "⏳ Volte aqui quando terminar de criar a conta."
read -p "Pressione ENTER quando terminar..."
clear

# Continua com os outros passos...
# (Similar ao .bat, adaptado para bash)

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🎉 PARABÉNS! DEPLOY ASSISTIDO EM PROGRESSO! 🎉        ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Continue seguindo as instruções..."
echo ""
echo "Para a versão completa, use o arquivo .bat no Windows"
echo "ou consulte TUTORIAL_DEPLOY_COMPLETO.md"
echo ""
