# 📖 Tutorial Completo: Deploy VideoFlow Online

**Guia passo a passo com cada clique detalhado!**

---

## 🎯 O Que Vamos Fazer

Vamos colocar seu VideoFlow online usando:
- **MongoDB Atlas** → Banco de dados (GRATUITO)
- **Render.com** → Backend API (GRATUITO)
- **Vercel** → Frontend PWA (GRATUITO)

**Custo Total: R$ 0,00** ✅

**Tempo Total: ~30 minutos**

---

## 📦 ANTES DE COMEÇAR

### ✅ Você vai precisar de:

1. ✅ Código no GitHub (via "Save to GitHub" na Emergent)
2. ✅ Conta Google ou GitHub (para fazer login nos serviços)
3. ✅ 30 minutos de tempo
4. ✅ Paciência (alguns deploys demoram)

### 🚀 Script Assistente (OPCIONAL)

**Windows:**
```cmd
cd /app
deploy-assistant.bat
```

**Mac/Linux:**
```bash
cd /app
chmod +x deploy-assistant.sh
./deploy-assistant.sh
```

**Ou siga este tutorial manualmente!** ⬇️

---

## 📚 ETAPA 1: MONGODB ATLAS (Banco de Dados)

### 🕒 Tempo: ~8 minutos

---

### 📍 PASSO 1.1: Criar Conta

**1.** Abra em uma nova aba:
```
https://www.mongodb.com/cloud/atlas/register
```

**2.** Você verá a página de cadastro. Escolha UMA opção:

**Opção A: Cadastro com Google (RECOMENDADO - mais rápido)**
- Clique no botão "Sign up with Google"
- Escolha sua conta Google
- Autorize o MongoDB Atlas

**Opção B: Cadastro com GitHub**
- Clique no botão "Sign up with GitHub"
- Autorize o MongoDB Atlas

**Opção C: Cadastro com e-mail**
- Preencha:
  - Email
  - Password
  - First Name
  - Last Name
- Marque "I agree to the Terms of Service and Privacy Policy"
- Clique em "Create your Atlas account"

**3.** Você receberá um e-mail de verificação (se usou e-mail)
- Abra seu e-mail
- Clique no link de verificação

**4.** Após verificar, você será redirecionado para:
"Welcome to MongoDB Atlas!"

---

### 📍 PASSO 1.2: Questionário Inicial

MongoDB vai fazer algumas perguntas:

**Pergunta 1:** "What are you building?"
- **Resposta:** Selecione "I'm learning MongoDB"

**Pergunta 2:** "What is your preferred language?"
- **Resposta:** Selecione "Python"

**Pergunta 3:** (opcional) outras perguntas
- Pule clicando "Skip" ou responda brevemente

**Clique em "Finish"**

---

### 📍 PASSO 1.3: Criar Cluster (Banco de Dados)

Você verá a tela "Deploy your database"

**1.** Você verá 3 opções de planos. Escolha:

```
┌────────────────────────────┐
│      M0 Sandbox            │
│      FREE FOREVER          │  ← CLIQUE AQUI!
│      Shared RAM            │
│      512 MB Storage        │
│                            │
│    [Create]                │
└────────────────────────────┘
```

**2.** Na tela de configuração:

**Provider & Region:**
- **Cloud Provider:** AWS (recomendado)
- **Region:** Escolha o mais próximo:
  - 🇺🇸 N. Virginia (us-east-1) - EUA
  - 🇧🇷 São Paulo (sa-east-1) - Brasil
  - 🇩🇪 Frankfurt (eu-central-1) - Europa

**Cluster Name:**
- Digite: `videoflow-cluster`

**3.** Clique no botão verde **"Create"** no fim da página

**4.** Aguarde 2-4 minutos...

Você verá:
```
⏳ Creating your cluster...
   This may take a few minutes
```

**5.** Quando terminar, você verá:
```
✅ Cluster videoflow-cluster is ready!
```

---

### 📍 PASSO 1.4: Criar Usuário do Banco

**1.** Você verá um modal: "Security Quickstart"

Se NÃO aparecer, no menu lateral:
- Clique em "Database Access"
- Clique em "+ ADD NEW DATABASE USER"

**2.** Preencha o formulário:

**Authentication Method:**
- Deixe selecionado: "Password"

**Username:**
```
videoflow_admin
```

**Password:**
- Clique no botão: "Autogenerate Secure Password"
- Uma senha será gerada, algo como: `Kx9mP2nQ7wR5tY`

**⚠️ SUPER IMPORTANTE:**
```
📋 COPIE ESSA SENHA AGORA!
```
- Clique no ícone de copiar ao lado da senha
- Cole em um bloco de notas
- **Você vai precisar dela em 2 minutos!**

**Database User Privileges:**
- Selecione: "Atlas admin"

**3.** Clique em **"Add User"**

---

### 📍 PASSO 1.5: Configurar Acesso de Rede

**1.** Você verá: "Where would you like to connect from?"

Se NÃO aparecer, no menu lateral:
- Clique em "Network Access"
- Clique em "+ ADD IP ADDRESS"

**2.** Clique em **"Allow Access from Anywhere"**

Você verá:
```
Access List Entry: 0.0.0.0/0
Comment: Allow access from anywhere
```

*Isso permite que Render e Vercel acessem seu banco*

**3.** Clique em **"Confirm"** ou **"Add Entry"**

**4.** Aguarde uns 10 segundos até ver:
```
✅ Active
```

---

### 📍 PASSO 1.6: Obter Connection String

**1.** No menu lateral, clique em **"Database"**

**2.** Você verá seu cluster `videoflow-cluster`

**3.** Clique no botão **"Connect"**

**4.** Escolha: **"Connect your application"**

**5.** Na nova tela:

**Driver:**
- Selecione: "Python"

**Version:**
- Selecione: "3.6 or later"

**6.** Você verá uma string de conexão:

```
mongodb+srv://videoflow_admin:<password>@videoflow-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**7.** Copie essa string COMPLETA

**8.** ⚠️ IMPORTANTE: Substitua `<password>`

Na string copiada, você verá `<password>`.

**ANTES:**
```
mongodb+srv://videoflow_admin:<password>@cluster...
```

**DEPOIS** (com sua senha real):
```
mongodb+srv://videoflow_admin:Kx9mP2nQ7wR5tY@cluster...
```

**9.** 📋 **SALVE ESSA STRING FINAL!**

Cole em um arquivo de texto chamado `mongo-connection.txt`

**✅ MongoDB Atlas configurado!**

---

## 🚀 ETAPA 2: RENDER (Backend)

### 🕒 Tempo: ~15 minutos

---

### 📍 PASSO 2.1: Garantir Código no GitHub

**ANTES DE CONTINUAR**, verifique:

Seu código está no GitHub?

**Se SIM:** Continue para o Passo 2.2

**Se NÃO:** Faça agora:

**Na Emergent:**
1. Clique em "Save to GitHub" (canto superior direito)
2. Conecte sua conta GitHub se necessário
3. Crie ou selecione repositório: `videoflow`
4. Branch: `main`
5. Clique em "PUSH TO GITHUB"
6. Aguarde terminar (30s-1min)

**Confirme:**
- Abra: `https://github.com/SEU-USUARIO/videoflow`
- Você deve ver seus arquivos!

---

### 📍 PASSO 2.2: Criar Conta no Render

**1.** Abra em uma nova aba:
```
https://render.com/register
```

**2.** Na página de cadastro, escolha:

**Opção A: Sign up with GitHub (RECOMENDADO)**
- Clique em "Sign up with GitHub"
- Autorize o Render

**Opção B: Sign up with Google**
- Clique em "Sign up with Google"
- Escolha sua conta

**3.** Complete o perfil:
- Name: Seu nome
- Clique em "Complete Sign Up"

**4.** Você verá o Dashboard do Render

---

### 📍 PASSO 2.3: Criar Web Service

**1.** No dashboard, procure no topo:
```
New +
```

**2.** Clique em **"New +"**

**3.** No menu dropdown, clique em:
```
Web Service
```

**4.** Você verá: "Create a new Web Service"

**5.** Se é a primeira vez:
- Clique em "Connect account" próximo a GitHub
- Autorize o Render a acessar seus repositórios

**6.** Você verá uma lista de repositórios

**7.** Encontre: `videoflow`

**8.** Clique no botão **"Connect"** ao lado dele

---

### 📍 PASSO 2.4: Configurar Web Service

Você verá um formulário grande. Preencha assim:

---

**📋 Basic Settings**

**Name:**
```
videoflow-api
```

**Region:**
- Escolha o mais próximo de você
- 🇺🇸 Oregon (recomendado se não sabe)
- 🇧🇷 Não tem São Paulo, use Oregon mesmo

**Branch:**
```
main
```
*(ou `master` se seu repo usa master)*

**Root Directory:**
```
backend
```
**⚠️ MUITO IMPORTANTE!** Não esqueça isso!

**Runtime:**
- Selecione: **Python 3**

---

**📋 Build & Deploy**

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```

---

**📋 Plans**

**Instance Type:**
- Selecione: **Free**

```
┌────────────────────┐
│      Free          │
│                    │  ← CLIQUE AQUI!
│  • 512 MB RAM      │
│  • Sleeps after    │
│    15min inactive  │
│                    │
│  $0/month          │
└────────────────────┘
```

---

**⏸️ NÃO CLIQUE EM "CREATE" AINDA!**

Role a página para baixo...

---

### 📍 PASSO 2.5: Adicionar Environment Variables

**1.** Encontre a seção: **"Environment Variables"**

**2.** Clique em **"Add Environment Variable"** (ou pode já ter campos)

**3.** Adicione 6 variáveis:

---

**Variável 1:**
```
Key:   MONGO_URL
Value: [COLE SUA CONNECTION STRING DO MONGODB AQUI]
```

Exemplo:
```
mongodb+srv://videoflow_admin:Kx9mP2nQ7wR5tY@videoflow-cluster.ab1cd.mongodb.net/
```

---

**Variável 2:**
```
Key:   DB_NAME
Value: videoflow_db
```

---

**Variável 3:**
```
Key:   JWT_SECRET_KEY
Value: videoflow-secret-key-2025-production
```

*(Você pode mudar depois para algo mais seguro)*

---

**Variável 4:**
```
Key:   CORS_ORIGINS
Value: *
```

---

**Variável 5:**
```
Key:   ENV
Value: production
```

---

**Variável 6:**
```
Key:   PYTHON_VERSION
Value: 3.11.0
```

---

**✅ Confirme que todas as 6 variáveis estão adicionadas!**

---

### 📍 PASSO 2.6: Deploy do Backend!

**1.** Agora sim, role até o final da página

**2.** Clique no botão azul grande:
```
[Create Web Service]
```

**3.** Você verá a página de logs!

**O que vai acontecer:**
```
⏳ Building...
   - Clonando repositório
   - Instalando dependências
   - Configurando servidor
   - Starting service...

✅ Deploy live (depois de 5-10min)
```

**4.** Aguarde pacientemente...

*Você pode ver logs em tempo real! Vai aparecer muita coisa.*

**5.** Quando terminar, no topo você verá:
```
🟢 Live
```

E uma URL:
```
https://videoflow-api.onrender.com
```
*(ou similar)*

---

### 📍 PASSO 2.7: Copiar URL do Backend

**1.** No topo da página, você verá sua URL

**2.** Clique no ícone de copiar, ou selecione e copie:
```
https://videoflow-api.onrender.com
```

**3.** 📋 **SALVE ESSA URL!**

Cole em um arquivo `backend-url.txt`

---

### 📍 PASSO 2.8: Testar Backend

**1.** Abra uma nova aba e cole:
```
https://SEU-BACKEND-URL/docs
```

Exemplo:
```
https://videoflow-api.onrender.com/docs
```

**2.** Você deve ver:

```
╔══════════════════════════╗
║   VideoFlow API          ║
║   FastAPI Swagger UI     ║
║                          ║
║   Endpoints:             ║
║   - POST /api/auth/...   ║
║   - GET /api/videos      ║
║   - etc...               ║
╚══════════════════════════╝
```

**✅ Se ver isso, backend está FUNCIONANDO!**

**❌ Se der erro 404 ou não carregar:**
- Aguarde mais 1-2 minutos
- Recarregue a página
- Verifique os logs no Render

---

## 🎨 ETAPA 3: VERCEL (Frontend)

### 🕒 Tempo: ~7 minutos

---

### 📍 PASSO 3.1: Criar Conta no Vercel

**1.** Abra em uma nova aba:
```
https://vercel.com/signup
```

**2.** Clique em **"Continue with GitHub"** (RECOMENDADO)

**3.** Autorize o Vercel

**4.** Complete o perfil se necessário

**5.** Você verá o Dashboard do Vercel

---

### 📍 PASSO 3.2: Importar Projeto

**1.** No dashboard, procure:
```
Add New...  (ou "New Project")
```

**2.** Clique nele

**3.** No dropdown, selecione:
```
Project
```

**4.** Você verá: "Import Git Repository"

**5.** Encontre seu repositório: `videoflow`

**6.** Clique em **"Import"**

---

### 📍 PASSO 3.3: Configurar Projeto

Você verá: "Configure Project"

---

**📋 Configure Project**

**Project Name:**
```
videoflow
```
*(ou o que você preferir)*

**Framework Preset:**
- O Vercel deve detectar automaticamente: **"Create React App"**
- Se não detectou, selecione manualmente

**Root Directory:**
```
frontend
```

**⚠️ SUPER IMPORTANTE!**

Clique em "Edit" ao lado de "Root Directory"

Digite: `frontend`

Você deve ver:
```
Root Directory: frontend
```

---

**Build and Output Settings** (geralmente já está correto):

```
Build Command:     yarn build
Output Directory:  build
Install Command:   yarn install
```

---

**⏸️ NÃO CLIQUE EM "DEPLOY" AINDA!**

Role para baixo...

---

### 📍 PASSO 3.4: Adicionar Environment Variable

**1.** Expanda: **"Environment Variables"**

**2.** Adicione:

```
Name:  REACT_APP_BACKEND_URL
Value: [COLE A URL DO SEU BACKEND AQUI]
```

Exemplo:
```
https://videoflow-api.onrender.com
```

**⚠️ IMPORTANTE: SEM barra `/` no final!**

✅ Correto: `https://videoflow-api.onrender.com`
❌ Errado: `https://videoflow-api.onrender.com/`

**3.** Clique em "Add"

---

### 📍 PASSO 3.5: Deploy do Frontend!

**1.** Role até o final

**2.** Clique no botão azul:
```
[Deploy]
```

**3.** Você verá a tela de build!

**O que vai acontecer:**
```
⏳ Building...
   - Clonando repositório
   - Instalando dependências (yarn install)
   - Building (yarn build)
   - Optimizing...
   - Uploading...

🎉 Congratulations! (depois de 3-5min)
```

**4.** Aguarde...

Você verá um preview do site sendo construído!

**5.** Quando terminar, você verá:
```
🎊 🎉 Confetti animation! 🎉 🎊

Congratulations!
Your project has been deployed!
```

---

### 📍 PASSO 3.6: Acessar Seu App!

**1.** Na tela de sucesso, você verá uma imagem do seu site

**2.** Abaixo, há um link:
```
https://videoflow.vercel.app
```
*(ou similar)*

**3.** Clique nele ou copie e abra em nova aba

**4.** Você deve ver:
```
╔══════════════════════════╗
║     VideoFlow            ║
║                          ║
║   [Logo]                 ║
║                          ║
║   Gestão de vídeos       ║
║   para criadores         ║
║                          ║
║   [Entrar]               ║
║   Não tem conta?         ║
║   Criar conta            ║
╚══════════════════════════╝
```

**🎉 SEU APP ESTÁ ONLINE!**

---

## ✅ ETAPA 4: TESTAR TUDO

### 🕒 Tempo: ~5 minutos

---

### 📍 TESTE 1: Criar Conta

**1.** Na tela de login, clique em:
```
Não tem uma conta? Criar conta
```

**2.** Preencha:
```
Nome de usuário: admin
E-mail: admin@videoflow.com
Senha: senha123
```

**3.** Clique em **"Criar Conta"**

**4.** Você deve ser redirecionado para o **Dashboard!**

Verá:
```
╔══════════════════════════╗
║   VideoFlow   [Sair]     ║
║   Olá, admin!            ║
╠══════════════════════════╣
║  [Nível: 1] [0 Concl.]  ║
╠══════════════════════════╣
║  [+ Novo Vídeo]          ║
║                          ║
║  Nenhum vídeo ainda...   ║
╚══════════════════════════╝
```

---

### 📍 TESTE 2: Criar Vídeo

**1.** Clique em **"Novo Vídeo"**

**2.** Modal abre. Preencha:
```
Título: Meu Primeiro Vídeo Online
Descrição: Testando o deploy!
Status: Planejado
```

**3.** Clique em **"Criar Vídeo"**

**4.** Toast aparece: ✅ "Vídeo criado com sucesso!"

**5.** Você verá o vídeo no dashboard!

---

### 📍 TESTE 3: Verificar Banco de Dados

**1.** Volte ao MongoDB Atlas

**2.** Menu lateral → **"Database"**

**3.** No cluster, clique em **"Browse Collections"**

**4.** Selecione database: `videoflow_db`

**5.** Você verá collections:
```
• users (1 document)
• videos (1 document)
```

**6.** Clique em `users` → Veja seu usuário!

**7.** Clique em `videos` → Veja seu vídeo!

**✅ TUDO FUNCIONANDO!**

---

## 🎊 PARABÉNS!

Seu VideoFlow está **100% online**! 🚀

---

## 📝 INFORMAÇÕES IMPORTANTES

### 🌐 Suas URLs:

**Frontend (App):**
```
https://videoflow.vercel.app
```

**Backend (API):**
```
https://videoflow-api.onrender.com
```

**API Docs:**
```
https://videoflow-api.onrender.com/docs
```

**MongoDB:**
```
MongoDB Atlas Dashboard
```

---

### ⚠️ Limitações do Plano Gratuito

**Render (Backend):**
- 🟡 **Dorme após 15min** de inatividade
- 🕐 **Primeira request:** ~30 segundos para "acordar"
- ✅ **Solução:** Use UptimeRobot (gratuito) para manter ativo

**MongoDB Atlas:**
- ✅ **512 MB** storage (suficiente para milhares de vídeos)
- 🟡 **Pausa após 60 dias** de inatividade (só fazer login)

**Vercel:**
- ✅ **Ilimitado!** Sem limitações práticas

---

### 🔧 Próximos Passos

**1.** 📱 **Gerar APK Android:**
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://videoflow.vercel.app/manifest.json
bubblewrap build
```

**2.** 🌐 **Domínio Personalizado:**
- Vercel: Settings → Domains
- Adicione: `videoflow.com.br`

**3.** 📈 **Manter Backend Ativo:**
- Crie conta no [UptimeRobot](https://uptimerobot.com)
- Adicione monitor HTTP
- URL: `https://SEU-BACKEND/docs`
- Intervalo: 5 minutos

**4.** 💪 **Upgrades (Futuro):**
- Render Starter: $7/mês (sem sleep)
- MongoDB M10: $57/mês (produção)

---

## 🐛 Problemas Comuns

### ❌ "Cannot connect to backend"

**Causa:** Backend dormiu (Render Free)

**Solução:**
1. Aguarde 30 segundos
2. Recarregue a página
3. Configure UptimeRobot

---

### ❌ "CORS Error"

**Causa:** URLs mal configuradas

**Verificar:**
1. Vercel: `REACT_APP_BACKEND_URL` sem `/` final
2. Render: `CORS_ORIGINS=*`
3. Redeploy ambos

---

### ❌ "MongoDB connection failed"

**Causa:** Connection String errada

**Verificar:**
1. Senha está correta (sem `<password>`)
2. Network Access = `0.0.0.0/0`
3. Cluster está ativo

---

### ❌ "Build failed" no Vercel

**Causa:** Root Directory errado

**Verificar:**
1. Root Directory = `frontend` ✅
2. Build Command = `yarn build` ✅
3. Redeploy

---

## 📞 Suporte

**Documentação:**
- `DEPLOY.md` - Guia de deploy detalhado
- `DEPLOY_RAPIDO.md` - Guia rápido
- `README.md` - Visão geral

**Logs:**
- Render: Dashboard → Logs
- Vercel: Deployments → View Function Logs
- MongoDB: Atlas → Metrics

---

## ✅ Checklist Final

- [ ] MongoDB Atlas configurado
- [ ] Render backend deployado e funcionando
- [ ] Vercel frontend deployado
- [ ] Conta criada no app
- [ ] Vídeo criado e salvo
- [ ] Dados visíveis no MongoDB
- [ ] URLs salvas
- [ ] UptimeRobot configurado (opcional)

---

**🎉 VOCÊ CONSEGUIU! 🎉**

Seu VideoFlow está no ar e funcionando!

Compartilhe com o mundo! 🌍

---

**Versão:** 1.0.0  
**Atualizado:** Dezembro 2025  
**Tempo médio:** 30 minutos  
**Dificuldade:** ⭐⭐⭐ (Médio)
