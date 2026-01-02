# 🌐 Guia de Deploy - VideoFlow Online

Deploy completo do VideoFlow na nuvem (Vercel + Render + MongoDB Atlas)

---

## 🎯 **Arquitetura de Deploy**

```
┌─────────────────┐
│   FRONTEND      │  → Vercel (React PWA)
│   Vercel        │     https://videoflow.vercel.app
└────────┬────────┘
         │
         │ API Calls
         ↓
┌─────────────────┐
│   BACKEND       │  → Render (FastAPI)
│   Render.com    │     https://videoflow-api.onrender.com
└────────┬────────┘
         │
         │ Database
         ↓
┌─────────────────┐
│   MONGODB       │  → MongoDB Atlas (Cloud)
│   Atlas         │     mongodb+srv://...
└─────────────────┘
```

---

## 📋 **Pré-requisitos**

- [ ] Conta GitHub - [Criar](https://github.com/signup)
- [ ] Conta Vercel - [Criar](https://vercel.com/signup)
- [ ] Conta Render - [Criar](https://render.com/register)
- [ ] Conta MongoDB Atlas - [Criar](https://www.mongodb.com/cloud/atlas/register)
- [ ] Código no GitHub

---

## 🗄️ **ETAPA 1: MongoDB Atlas (Banco de Dados)**

### **1.1. Criar Conta e Cluster**

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie sua conta (pode usar Google/GitHub)
3. Após login, clique em **"Create"** (criar cluster)

### **1.2. Configurar Cluster Gratuito**

**Cluster Configuration:**
- **Provider:** AWS (recomendado)
- **Region:** Escolha o mais próximo de você
  - `N. Virginia (us-east-1)` - EUA
  - `São Paulo (sa-east-1)` - Brasil
  - `Frankfurt (eu-central-1)` - Europa
- **Cluster Tier:** M0 Sandbox (FREE)
- **Cluster Name:** `videoflow-cluster`

Clique em **"Create Cluster"** (leva 3-5 minutos)

### **1.3. Criar Usuário do Banco**

1. No menu lateral, clique em **"Database Access"**
2. Clique em **"Add New Database User"**
3. Preencha:
   - **Username:** `videoflow_admin`
   - **Password:** Clique em "Autogenerate Secure Password" e **COPIE**
   - **Database User Privileges:** `Atlas admin`
4. Clique em **"Add User"**

**⚠️ IMPORTANTE:** Guarde a senha em local seguro!

### **1.4. Configurar Acesso de Rede**

1. No menu lateral, clique em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Selecione **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - (Necessário para Render/Vercel acessarem)
4. Clique em **"Confirm"**

### **1.5. Obter Connection String**

1. Volte para **"Database"** no menu
2. No seu cluster, clique em **"Connect"**
3. Escolha **"Connect your application"**
4. Copie a **Connection String**:

```
mongodb+srv://videoflow_admin:<password>@videoflow-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. **IMPORTANTE:** Substitua `<password>` pela senha que você copiou antes

**Exemplo final:**
```
mongodb+srv://videoflow_admin:SuaSenhaAqui123@videoflow-cluster.ab1cd.mongodb.net/?retryWrites=true&w=majority
```

**✅ Guarde esta Connection String!**

---

## 🔙 **ETAPA 2: Backend no Render.com**

### **2.1. Preparar Código**

**Certifique-se que seu código está no GitHub!**

Se não estiver:
1. Na Emergent: Clique em **"Save to GitHub"**
2. Ou faça push manual:
```bash
git init
git add .
git commit -m "Deploy VideoFlow"
git remote add origin https://github.com/seu-usuario/videoflow.git
git push -u origin main
```

### **2.2. Criar Conta no Render**

1. Acesse: https://render.com/register
2. Crie conta (pode usar GitHub para facilitar)
3. Conecte sua conta GitHub

### **2.3. Criar Web Service (Backend)**

1. No dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub `videoflow`
3. Clique em **"Connect"** ao lado do repositório

### **2.4. Configurar Web Service**

**Basic Settings:**
- **Name:** `videoflow-api`
- **Region:** Escolha o mais próximo
- **Branch:** `main` (ou `master`)
- **Root Directory:** `backend`
- **Runtime:** `Python 3`

**Build Settings:**
- **Build Command:**
```bash
pip install -r requirements.txt
```

- **Start Command:**
```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
- Selecione **"Free"** (grátis)

### **2.5. Adicionar Variáveis de Ambiente**

Role até **"Environment Variables"** e adicione:

| Key | Value |
|-----|-------|
| `MONGO_URL` | `mongodb+srv://videoflow_admin:SuaSenha@...` (sua connection string) |
| `DB_NAME` | `videoflow_db` |
| `JWT_SECRET_KEY` | `seu-secret-super-seguro-aqui-2025` |
| `CORS_ORIGINS` | `*` |
| `ENV` | `production` |
| `PYTHON_VERSION` | `3.11.0` |

**⚠️ IMPORTANTE:** 
- Use a Connection String completa do MongoDB Atlas
- Gere um JWT_SECRET_KEY único:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### **2.6. Deploy!**

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (5-10 minutos)
3. Você verá logs em tempo real

**Quando ver:**
```
INFO:     Application startup complete.
```

✅ **Seu backend está no ar!**

### **2.7. Testar Backend**

Sua URL será algo como:
```
https://videoflow-api.onrender.com
```

**Testes:**
1. Abra: `https://videoflow-api.onrender.com/`
   - Deve retornar: `{"message": "VideoFlow API is running", ...}`

2. API Docs: `https://videoflow-api.onrender.com/docs`
   - Deve abrir o Swagger UI

**⚠️ IMPORTANTE:** Copie a URL do backend! Você vai usar no frontend.

---

## 🎨 **ETAPA 3: Frontend no Vercel**

### **3.1. Criar Conta no Vercel**

1. Acesse: https://vercel.com/signup
2. Crie conta com GitHub (recomendado)
3. Autorize o Vercel a acessar seus repositórios

### **3.2. Importar Projeto**

1. No dashboard, clique em **"Add New..."** → **"Project"**
2. Encontre seu repositório `videoflow`
3. Clique em **"Import"**

### **3.3. Configurar Projeto**

**Project Settings:**
- **Project Name:** `videoflow` (ou o que preferir)
- **Framework Preset:** `Create React App`
- **Root Directory:** `frontend` ⚠️ IMPORTANTE!
- **Build Command:** `yarn build`
- **Output Directory:** `build`

### **3.4. Adicionar Variáveis de Ambiente**

Expanda **"Environment Variables"** e adicione:

| Name | Value |
|------|-------|
| `REACT_APP_BACKEND_URL` | `https://videoflow-api.onrender.com` |

**⚠️ IMPORTANTE:** Use a URL do seu backend Render (sem `/` no final)

### **3.5. Deploy!**

1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. Você verá logs em tempo real

**Quando ver:**
```
✓ Deployment ready
```

✅ **Seu frontend está no ar!**

### **3.6. Acessar Aplicação**

Sua URL será algo como:
```
https://videoflow.vercel.app
```

ou

```
https://videoflow-seu-usuario.vercel.app
```

**Abra no navegador e teste!** 🎉

---

## ✅ **ETAPA 4: Testar Sistema Completo**

### **4.1. Criar Usuário**

1. Acesse: `https://videoflow.vercel.app`
2. Clique em **"Criar conta"**
3. Preencha dados e registre
4. Você deve ser redirecionado para o dashboard

### **4.2. Criar Vídeo**

1. Clique em **"Novo Vídeo"**
2. Preencha informações
3. Salve

### **4.3. Testar Funcionalidades**

- ✅ Login/Logout
- ✅ CRUD de vídeos
- ✅ Busca e filtros
- ✅ Paginação
- ✅ Importação/Exportação
- ✅ Ações em massa

### **4.4. Verificar Dados no MongoDB Atlas**

1. No MongoDB Atlas, vá em **"Database"** → **"Browse Collections"**
2. Selecione `videoflow_db`
3. Veja as collections `users` e `videos`
4. Seus dados devem estar lá! 🎉

---

## 🔧 **ETAPA 5: Configurações Adicionais**

### **5.1. Domínio Personalizado (Opcional)**

#### **No Vercel (Frontend):**
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `videoflow.com`)
3. Configure DNS conforme instruções

#### **No Render (Backend):**
1. Vá em **Settings** → **Custom Domain**
2. Adicione subdomínio (ex: `api.videoflow.com`)
3. Configure DNS conforme instruções

**Atualizar variável no Vercel:**
```
REACT_APP_BACKEND_URL=https://api.videoflow.com
```

### **5.2. HTTPS (Já Incluído)**

✅ Vercel e Render já fornecem HTTPS automático!

### **5.3. Configurar CORS (Se necessário)**

Se tiver problemas de CORS, atualize no Render:

**Environment Variable:**
```
CORS_ORIGINS=https://videoflow.vercel.app,https://seu-dominio.com
```

### **5.4. Backup Automático MongoDB**

No MongoDB Atlas:
1. Vá em **"Backup"** (menu lateral)
2. Habilite backups automáticos (gratuito no tier M0)
3. Configure retenção de 2 dias

---

## 🐛 **Solução de Problemas**

### **Problema: "Backend não responde"**

**Render Free Tier dorme após 15min de inatividade**

**Soluções:**
1. Primeira requisição é lenta (30s) - normal
2. Use [UptimeRobot](https://uptimerobot.com/) para pingar a cada 5min
3. Upgrade para plano pago ($7/mês)

**Configurar UptimeRobot:**
1. Crie conta gratuita
2. Add New Monitor:
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://videoflow-api.onrender.com/`
   - **Monitoring Interval:** 5 minutes
3. Salve

### **Problema: "CORS Error"**

**Verificar:**
1. No Render, variável `CORS_ORIGINS` está correta
2. No Vercel, `REACT_APP_BACKEND_URL` está correta (sem `/` final)
3. Redeploy ambos os serviços

### **Problema: "MongoDB Connection Failed"**

**Verificar:**
1. Connection String no Render está correta
2. Senha não tem caracteres especiais (use apenas letras/números)
3. Network Access no Atlas permite `0.0.0.0/0`
4. Cluster está ativo (não pausado)

### **Problema: "Build Failed no Vercel"**

**Verificar:**
1. Root Directory = `frontend`
2. Build Command = `yarn build`
3. Node version compatível (18+)

**Se persistir, adicionar no Vercel:**
```
NODE_VERSION=18.x
```

---

## 📊 **Limites dos Planos Gratuitos**

### **MongoDB Atlas (M0 Free):**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Adequado para ~5000 usuários/dia
- ⚠️ Pausa após 60 dias de inatividade

### **Render Free Tier:**
- ✅ 512 MB RAM
- ✅ Shared CPU
- ✅ 100 GB bandwidth/mês
- ⚠️ Dorme após 15min inatividade
- ⚠️ 750 horas/mês (31 dias)

### **Vercel Hobby (Free):**
- ✅ 100 GB bandwidth/mês
- ✅ 100 builds/dia
- ✅ Domínio personalizado
- ✅ HTTPS automático
- ✅ Sem limite de requests

---

## 🚀 **Upgrades Recomendados (Futuro)**

Quando seu app crescer:

### **Backend (Render):**
- **Starter ($7/mês):**
  - Sem sleep
  - 512 MB RAM
  - Adequado para produção

### **MongoDB (Atlas):**
- **M10 ($0.08/hora = ~$57/mês):**
  - 2 GB RAM
  - 10 GB storage
  - Backups contínuos
  - Adequado para apps médios

### **Frontend (Vercel):**
- Gratuito já é excelente!
- **Pro ($20/mês):** Se precisar de mais builds/analytics

---

## 📱 **Próximo Passo: Gerar APK**

Agora que está online, gerar APK:

```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Inicializar
bubblewrap init --manifest=https://videoflow.vercel.app/manifest.json

# Preencher informações:
# - App name: VideoFlow
# - Package: com.seudominio.videoflow
# - Signing key: criar novo

# Build APK
bubblewrap build

# Build AAB (Play Store)
bubblewrap build --buildMode=release
```

---

## ✅ **Checklist de Deploy**

### **MongoDB Atlas:**
- [ ] Cluster criado
- [ ] Usuário criado
- [ ] Network Access configurado (0.0.0.0/0)
- [ ] Connection String copiada

### **Render (Backend):**
- [ ] Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] API Docs funcionando (/docs)
- [ ] URL copiada

### **Vercel (Frontend):**
- [ ] Projeto importado
- [ ] Root Directory = frontend
- [ ] REACT_APP_BACKEND_URL configurada
- [ ] Deploy bem-sucedido
- [ ] App funcionando

### **Testes:**
- [ ] Criar usuário
- [ ] Fazer login
- [ ] Criar vídeo
- [ ] Buscar vídeo
- [ ] Editar vídeo
- [ ] Excluir vídeo
- [ ] Importar vídeos
- [ ] Exportar vídeos

---

## 🎉 **Parabéns!**

Seu VideoFlow está no ar! 🚀

**URLs do seu app:**
- 🌐 Frontend: `https://videoflow.vercel.app`
- 🔙 Backend: `https://videoflow-api.onrender.com`
- 🗄️ Database: MongoDB Atlas

**Compartilhe com o mundo!** 📱

---

## 📞 **Suporte**

**Problemas?**

1. **Logs do Backend:** Render Dashboard → Logs
2. **Logs do Frontend:** Vercel Dashboard → Deployments → Logs
3. **MongoDB:** Atlas → Metrics → Connection Errors

**Documentação Oficial:**
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Versão:** 1.0.0  
**Atualizado:** Dezembro 2025
