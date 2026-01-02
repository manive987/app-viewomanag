@echo off
chcp 65001 >nul
color 0A
title VideoFlow - Assistente de Deploy

:: VideoFlow Deploy Assistant
:: Este script vai te guiar passo a passo no deploy

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     🚀 VIDEOFLOW - ASSISTENTE DE DEPLOY                   ║
echo ║                                                            ║
echo ║     Vou te guiar passo a passo para colocar seu app       ║
echo ║     online no Vercel + Render + MongoDB Atlas!            ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
pause
cls

:: ==================================================
:: ETAPA 1: VERIFICAR REQUISITOS
:: ==================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  ETAPA 1/5: VERIFICANDO REQUISITOS                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Verificando se você tem tudo instalado...
echo.

:: Verificar Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git NÃO encontrado!
    echo.
    echo Por favor, instale o Git:
    echo https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Git instalado
)

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NÃO encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js instalado
)

:: Verificar conta GitHub
echo.
echo Agora vamos verificar algumas coisas com você...
echo.
echo 📝 Você tem uma conta no GitHub?
echo    (Precisamos para fazer deploy)
echo.
echo [1] Sim, já tenho conta
echo [2] Não, preciso criar
echo.
set /p github_choice="Escolha (1 ou 2): "

if "%github_choice%"=="2" (
    echo.
    echo 🌐 Abrindo página de registro do GitHub...
    start https://github.com/signup
    echo.
    echo ⏳ Crie sua conta e volte aqui quando terminar.
    echo.
    pause
)

cls

:: ==================================================
:: ETAPA 2: MONGODB ATLAS
:: ==================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  ETAPA 2/5: CONFIGURAR MONGODB ATLAS (Banco de Dados)     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🗄️  Vamos criar seu banco de dados na nuvem!
echo.
echo Tempo estimado: 5 minutos
echo.
pause

echo.
echo 📝 PASSO 1: Criar conta no MongoDB Atlas
echo ───────────────────────────────────────────
echo.
echo Vou abrir o site do MongoDB Atlas para você.
echo.
echo Quando abrir:
echo   1. Clique em "Try Free" ou "Sign Up"
echo   2. Use sua conta Google/GitHub (mais rápido)
echo   3. Complete o cadastro
echo.
echo 🌐 Abrindo MongoDB Atlas...
start https://www.mongodb.com/cloud/atlas/register
echo.
echo ⏳ Volte aqui quando terminar de criar a conta.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  MONGODB ATLAS - PASSO 2                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 2: Criar Cluster (Banco de Dados)
echo ───────────────────────────────────────────
echo.
echo Após fazer login no MongoDB Atlas:
echo.
echo   1. Clique no botão verde "Create" ou "+ Create"
 echo   2. Escolha "Build a Database"
echo   3. Selecione "M0 FREE" (primeira opção, grátis)
echo   4. Provider: AWS
echo   5. Region: Escolha o mais próximo de você
echo      • N. Virginia (EUA)
echo      • São Paulo (Brasil)
echo      • Frankfurt (Europa)
echo   6. Cluster Name: videoflow-cluster
echo   7. Clique em "Create Cluster"
echo.
echo ⏳ O cluster leva ~3 minutos para ser criado.
echo.
echo Volte aqui quando o cluster estiver pronto (status verde).
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  MONGODB ATLAS - PASSO 3                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 3: Criar Usuário do Banco
echo ───────────────────────────────────────────
echo.
echo No painel do MongoDB Atlas:
echo.
echo   1. No menu lateral, clique em "Database Access"
echo   2. Clique em "+ ADD NEW DATABASE USER"
echo   3. Authentication Method: Password
echo   4. Username: videoflow_admin
echo   5. Password: Clique em "Autogenerate Secure Password"
echo.
echo      ⚠️  IMPORTANTE: COPIE A SENHA E SALVE!
 echo.
echo   6. Database User Privileges: "Atlas admin"
echo   7. Clique em "Add User"
echo.
echo ⏳ Volte aqui quando terminar.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  MONGODB ATLAS - PASSO 4                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 4: Configurar Acesso de Rede
echo ───────────────────────────────────────────
echo.
echo No painel do MongoDB Atlas:
echo.
echo   1. No menu lateral, clique em "Network Access"
echo   2. Clique em "+ ADD IP ADDRESS"
echo   3. Clique em "ALLOW ACCESS FROM ANYWHERE"
echo   4. Confirme que aparece: 0.0.0.0/0
echo   5. Clique em "Confirm"
echo.
echo (Isso permite que Render e Vercel acessem o banco)
echo.
echo ⏳ Volte aqui quando terminar.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  MONGODB ATLAS - PASSO 5                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 5: Copiar Connection String
echo ───────────────────────────────────────────
echo.
echo No painel do MongoDB Atlas:
echo.
echo   1. No menu lateral, clique em "Database"
echo   2. No seu cluster, clique em "Connect"
echo   3. Escolha "Connect your application"
echo   4. Driver: Python, Version: 3.6 or later
echo   5. Copie a "Connection String"
echo.
echo   Vai ser algo como:
echo   mongodb+srv://videoflow_admin:<password>@cluster...
echo.
echo   6. SUBSTITUA <password> pela senha que você copiou antes
echo.
echo ⚠️  IMPORTANTE: Anote essa connection string completa!
 echo.
echo Exemplo final:
echo mongodb+srv://videoflow_admin:SuaSenha123@cluster.ab1cd.mongodb.net/
echo.
echo.
set /p mongo_url="Cole aqui sua Connection String completa: "
echo.
echo ✅ Connection String salva!
echo.
echo Guardando para usar no próximo passo...
echo %mongo_url% > mongo_config.txt
echo.
pause
cls

echo ✅ MongoDB Atlas configurado com sucesso!
echo.
echo Próximo: Deploy do Backend (Render)
echo.
pause
cls

:: ==================================================
:: ETAPA 3: PREPARAR CÓDIGO
:: ==================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  ETAPA 3/5: PREPARAR CÓDIGO PARA DEPLOY                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📦 Vamos preparar seu código para o deploy!
echo.
pause

echo.
echo 📝 O código já está no GitHub?
echo.
echo [1] Sim, já está no GitHub
echo [2] Não, preciso enviar
echo.
set /p code_choice="Escolha (1 ou 2): "

if "%code_choice%"=="2" (
    echo.
    echo 📤 Vamos enviar seu código para o GitHub!
    echo.
    echo Opções:
    echo.
    echo [1] Usar "Save to GitHub" na Emergent (RECOMENDADO)
    echo [2] Fazer push manual via Git
    echo.
    set /p push_choice="Escolha (1 ou 2): "
    
    if "!push_choice!"=="1" (
        echo.
        echo 🌐 Acessando Emergent...
        echo.
        echo Por favor:
        echo   1. Na interface da Emergent, clique em "Save to GitHub"
        echo   2. Conecte sua conta GitHub se necessário
        echo   3. Crie ou selecione um repositório: videoflow
        echo   4. Branch: main
        echo   5. Clique em "PUSH TO GITHUB"
        echo.
        echo ⏳ Volte aqui quando o push terminar.
        echo.
        pause
    ) else (
        echo.
        echo 📝 Push manual via Git:
        echo.
        echo Execute estes comandos:
        echo.
        echo   git init
        echo   git add .
        echo   git commit -m "Deploy VideoFlow"
        echo   git remote add origin https://github.com/SEU-USUARIO/videoflow.git
        echo   git push -u origin main
        echo.
        echo ⏳ Execute e volte aqui quando terminar.
        echo.
        pause
    )
)

echo.
echo ✅ Código pronto no GitHub!
echo.
echo Qual é a URL do seu repositório?
echo Exemplo: https://github.com/seu-usuario/videoflow
echo.
set /p repo_url="Cole aqui a URL: "
echo.
echo ✅ Repositório salvo!
echo.
pause
cls

:: ==================================================
:: ETAPA 4: RENDER (BACKEND)
:: ==================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  ETAPA 4/5: DEPLOY BACKEND NO RENDER                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🔙 Vamos colocar o backend online!
echo.
echo Tempo estimado: 10 minutos
echo.
pause

echo.
echo 📝 PASSO 1: Criar conta no Render
echo ───────────────────────────────────────────
echo.
echo Vou abrir o Render para você.
echo.
echo Quando abrir:
echo   1. Clique em "Get Started" ou "Sign Up"
echo   2. Use sua conta GitHub (RECOMENDADO)
    echo   3. Autorize o Render a acessar seus repositórios
echo.
echo 🌐 Abrindo Render.com...
start https://render.com/register
echo.
echo ⏳ Volte aqui quando terminar.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  RENDER - PASSO 2                                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 2: Criar Web Service
echo ───────────────────────────────────────────
echo.
echo No dashboard do Render:
echo.
echo   1. Clique em "New +" (canto superior direito)
echo   2. Selecione "Web Service"
echo   3. Conecte seu repositório GitHub
echo   4. Encontre e selecione: videoflow
echo   5. Clique em "Connect"
echo.
echo ⏳ Volte aqui quando chegar na tela de configuração.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  RENDER - PASSO 3 (CONFIGURAÇÃO)                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 3: Configurar Web Service
echo ───────────────────────────────────────────
echo.
echo Preencha os campos assim:
echo.
echo ┌─ Basic Settings ─────────────────────────┐
echo │ Name: videoflow-api                      │
echo │ Region: Escolha o mais próximo           │
echo │ Branch: main                             │
echo │ Root Directory: backend                  │
echo │ Runtime: Python 3                        │
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Build Settings ──────────────────────────┐
echo │ Build Command:                            │
echo │   pip install -r requirements.txt         │
echo │                                           │
echo │ Start Command:                            │
echo │   uvicorn server:app --host 0.0.0.0 --port $PORT │
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Instance Type ──────────────────────────┐
echo │ Selecione: Free                          │
echo └──────────────────────────────────────────┘
echo.
echo ⏳ Volte aqui quando preencher tudo.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  RENDER - PASSO 4 (VARIÁVEIS)                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 4: Adicionar Environment Variables
echo ───────────────────────────────────────────
echo.
echo Role a página até "Environment Variables" e adicione:
echo.
echo.

:: Ler MongoDB URL do arquivo
set /p saved_mongo_url=<mongo_config.txt

echo ┌─ Variável 1 ─────────────────────────────┐
echo │ Key:   MONGO_URL                         │
echo │ Value: %saved_mongo_url%
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Variável 2 ─────────────────────────────┐
echo │ Key:   DB_NAME                           │
echo │ Value: videoflow_db                      │
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Variável 3 ─────────────────────────────┐
echo │ Key:   JWT_SECRET_KEY                    │
echo │ Value: videoflow-secret-key-2025-change  │
echo │        (⚠️  Mude isso depois!)           │
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Variável 4 ─────────────────────────────┐
echo │ Key:   CORS_ORIGINS                      │
echo │ Value: *                                 │
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Variável 5 ─────────────────────────────┐
echo │ Key:   ENV                               │
echo │ Value: production                        │
echo └──────────────────────────────────────────┘
echo.
echo ┌─ Variável 6 ─────────────────────────────┐
echo │ Key:   PYTHON_VERSION                    │
echo │ Value: 3.11.0                            │
echo └──────────────────────────────────────────┘
echo.
echo.
echo ⏳ Adicione todas as 6 variáveis e volte aqui.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  RENDER - PASSO 5 (DEPLOY!)                                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 5: Fazer Deploy!
echo ───────────────────────────────────────────
echo.
echo Agora é só clicar em:
echo.
echo   👉 "Create Web Service" (botão azul)
echo.
echo O deploy vai começar! Você vai ver:
echo   • Logs em tempo real
    echo   • Status: "Building..."
echo   • Tempo estimado: 5-10 minutos
echo.
echo Quando terminar, vai mostrar:
echo   ✅ "Live" (com bolinha verde)
echo.
echo E você verá uma URL tipo:
echo   https://videoflow-api.onrender.com
echo.
echo.
echo ⏳ Aguarde o deploy terminar e volte aqui.
echo    (Pode levar até 10 minutos)
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  RENDER - COPIAR URL                                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ Deploy do backend concluído!
echo.
echo Agora copie a URL do seu backend.
echo.
echo Ela está no topo da página, algo como:
echo   https://videoflow-api.onrender.com
echo   https://videoflow-api-xxxx.onrender.com
echo.
echo.
set /p backend_url="Cole aqui a URL completa: "
echo.
echo ✅ URL do backend salva!
echo.
echo Guardando para o próximo passo...
echo %backend_url% > backend_url.txt
echo.
echo.
echo 🧪 Vamos testar se está funcionando?
echo.
echo Vou abrir a API Docs no navegador...
echo.
start %backend_url%/docs
echo.
echo Você deve ver a interface Swagger UI com todos os endpoints!
echo.
echo Está funcionando?
echo [1] Sim, vejo a interface!
echo [2] Não, deu erro
echo.
set /p backend_test="Escolha (1 ou 2): "

if "%backend_test%"=="2" (
    echo.
    echo ⚠️  Hmm, vamos verificar...
    echo.
    echo Volte no Render e verifique:
    echo   1. Logs: tem algum erro vermelho?
    echo   2. Status: está "Live" (verde)?
    echo   3. Todas as variáveis foram adicionadas?
    echo.
    echo Corrija e teste novamente: %backend_url%/docs
echo.
    pause
)

echo.
echo ✅ Backend funcionando perfeitamente!
echo.
pause
cls

:: ==================================================
:: ETAPA 5: VERCEL (FRONTEND)
:: ==================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║  ETAPA 5/5: DEPLOY FRONTEND NO VERCEL                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🎨 Última etapa! Vamos colocar o frontend online!
echo.
echo Tempo estimado: 5 minutos
echo.
pause

echo.
echo 📝 PASSO 1: Criar conta no Vercel
echo ───────────────────────────────────────────
echo.
echo Vou abrir o Vercel para você.
echo.
echo Quando abrir:
echo   1. Clique em "Sign Up" ou "Get Started"
echo   2. Use sua conta GitHub (RECOMENDADO)
echo   3. Autorize o Vercel
echo.
echo 🌐 Abrindo Vercel...
start https://vercel.com/signup
echo.
echo ⏳ Volte aqui quando terminar.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  VERCEL - PASSO 2                                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 2: Importar Projeto
echo ───────────────────────────────────────────
echo.
echo No dashboard do Vercel:
echo.
echo   1. Clique em "Add New..." (canto superior direito)
echo   2. Selecione "Project"
echo   3. Encontre seu repositório: videoflow
echo   4. Clique em "Import"
echo.
echo ⏳ Volte aqui quando chegar na tela de configuração.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  VERCEL - PASSO 3 (CONFIGURAÇÃO)                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 3: Configurar Projeto
echo ───────────────────────────────────────────
echo.
echo Preencha os campos assim:
echo.
echo ┌─ Configure Project ──────────────────────┐
echo │ Project Name: videoflow                  │
echo │ Framework Preset: Create React App       │
echo │ Root Directory: frontend  ⚠️ IMPORTANTE! │
echo │                                          │
echo │ Build Command: yarn build                │
echo │ Output Directory: build                  │
echo │ Install Command: yarn install            │
echo └──────────────────────────────────────────┘
echo.
echo ⏳ Configure e volte aqui.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  VERCEL - PASSO 4 (VARIÁVEL)                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 4: Adicionar Environment Variable
echo ───────────────────────────────────────────
echo.
echo Expanda a seção "Environment Variables" e adicione:
echo.

:: Ler backend URL do arquivo
set /p saved_backend_url=<backend_url.txt

echo ┌─ Variável ───────────────────────────────┐
echo │ Name:  REACT_APP_BACKEND_URL             │
echo │ Value: %saved_backend_url%
echo │                                          │
echo │ ⚠️  SEM barra / no final!                │
echo └──────────────────────────────────────────┘
echo.
echo.
echo ⏳ Adicione a variável e volte aqui.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  VERCEL - PASSO 5 (DEPLOY!)                                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 PASSO 5: Fazer Deploy!
echo ───────────────────────────────────────────
echo.
echo Agora é só clicar em:
echo.
echo   👉 "Deploy" (botão azul)
echo.
echo O build vai começar! Você vai ver:
echo   • Logs em tempo real
echo   • Status: "Building..."
echo   • Tempo estimado: 3-5 minutos
echo.
echo Quando terminar, vai mostrar:
echo   🎉 Confetes e "Congratulations!"
echo   ✅ Preview do seu site
echo.
echo.
echo ⏳ Aguarde o deploy terminar e volte aqui.
echo.
pause
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║  VERCEL - COPIAR URL                                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ Deploy do frontend concluído!
echo.
echo Sua URL estará visível, algo como:
echo   https://videoflow.vercel.app
echo   https://videoflow-xxxx.vercel.app
echo.
echo.
set /p frontend_url="Cole aqui a URL completa: "
echo.
echo ✅ URL do frontend salva!
echo.
echo.
echo 🎉 Vamos abrir seu app?
echo.
start %frontend_url%
echo.
echo Você deve ver a tela de login do VideoFlow!
echo.
echo.
pause
cls

:: ==================================================
:: CONCLUSÃO
:: ==================================================

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     🎉 PARABÉNS! SEU APP ESTÁ ONLINE! 🎉                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo ✅ Resumo do Deploy:
echo ═══════════════════════════════════════
echo.
echo 🌐 Frontend (App):
echo    %frontend_url%
echo.
echo 🔙 Backend (API):
echo    %saved_backend_url%
echo.
echo 🗄️  Database:
echo    MongoDB Atlas (configurado)
echo.
echo.
echo 📝 Próximos Passos:
echo ═══════════════════════════════════════
echo.
echo 1. 🧪 Testar o app:
echo    • Criar uma conta
echo    • Fazer login
echo    • Criar um vídeo
echo    • Testar funcionalidades
echo.
echo 2. 📱 Gerar APK Android:
echo    • npm install -g @bubblewrap/cli
echo    • bubblewrap init --manifest=%frontend_url%/manifest.json
echo    • bubblewrap build
echo.
echo 3. 🌐 Domínio personalizado (opcional):
echo    • Vercel: Settings → Domains
echo    • Adicione seu domínio
echo.
echo 4. ⚡ Melhorias:
echo    • Use UptimeRobot para manter backend ativo
echo    • Upgrade Render: $7/mês (sem sleep)
echo.
echo.
echo 📖 Documentação:
echo ═══════════════════════════════════════
echo.
echo • Tutorial completo: TUTORIAL_DEPLOY_COMPLETO.md
echo • Guia de deploy: DEPLOY.md
echo • Guia rápido: DEPLOY_RAPIDO.md
echo.
echo.
echo 💾 Salvando informações do deploy...
echo.

:: Salvar resumo
echo VideoFlow - Deploy Summary > deploy_summary.txt
echo. >> deploy_summary.txt
echo Frontend: %frontend_url% >> deploy_summary.txt
echo Backend: %saved_backend_url% >> deploy_summary.txt
echo MongoDB: Configured on Atlas >> deploy_summary.txt
echo Date: %date% %time% >> deploy_summary.txt

echo ✅ Resumo salvo em: deploy_summary.txt
echo.
echo.
echo 🎊 Obrigado por usar o VideoFlow Deploy Assistant!
echo.
echo Qualquer dúvida, consulte a documentação.
echo.
echo.
pause

:: Abrir app no navegador
start %frontend_url%

exit /b 0
