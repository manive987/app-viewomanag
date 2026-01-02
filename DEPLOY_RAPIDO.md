# 🚀 Deploy Rápido - VideoFlow

Guia visual de 3 passos para colocar o VideoFlow online!

---

## 🎯 **Visão Geral**

```
1. MongoDB Atlas    →  Banco de dados (5 min)
2. Render.com       →  Backend API (10 min)
3. Vercel           →  Frontend PWA (5 min)
```

**Total: ~20 minutos** ⏱️

---

## 📦 **PASSO 1: MongoDB Atlas**

### **Link:** https://www.mongodb.com/cloud/atlas/register

### **Ações:**
1. ✅ Criar conta (pode usar Google)
2. ✅ Criar cluster FREE (M0 Sandbox)
3. ✅ Criar usuário: `videoflow_admin`
4. ✅ Network Access: `0.0.0.0/0` (Allow Anywhere)
5. ✅ Copiar Connection String:

```
mongodb+srv://videoflow_admin:SuaSenha@cluster.xxxxx.mongodb.net/
```

**⚠️ Salve essa string!**

---

## 🔙 **PASSO 2: Render.com (Backend)**

### **Link:** https://render.com/register

### **Ações:**

**2.1. Código no GitHub:**
- Emergent: "Save to GitHub" ✅

**2.2. Criar Web Service:**
- New + → Web Service
- Conectar repositório `videoflow`
- Root Directory: `backend`

**2.3. Configurações:**

```yaml
Name: videoflow-api
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
Instance: Free
```

**2.4. Environment Variables:**

```env
MONGO_URL=mongodb+srv://videoflow_admin:senha@cluster...
DB_NAME=videoflow_db
JWT_SECRET_KEY=seu-secret-super-seguro-2025
CORS_ORIGINS=*
ENV=production
PYTHON_VERSION=3.11.0
```

**2.5. Deploy:**
- Create Web Service
- Aguarde ~10min
- Copie a URL: `https://videoflow-api.onrender.com`

**Testar:** `https://videoflow-api.onrender.com/docs` ✅

---

## 🎨 **PASSO 3: Vercel (Frontend)**

### **Link:** https://vercel.com/signup

### **Ações:**

**3.1. Import Project:**
- Add New → Project
- Selecionar repositório `videoflow`

**3.2. Configurações:**

```yaml
Project Name: videoflow
Framework: Create React App
Root Directory: frontend  ⚠️ IMPORTANTE!
Build Command: yarn build
Output Directory: build
```

**3.3. Environment Variable:**

```env
REACT_APP_BACKEND_URL=https://videoflow-api.onrender.com
```

**3.4. Deploy:**
- Deploy
- Aguarde ~5min
- Sua URL: `https://videoflow.vercel.app`

**Abrir e testar!** 🎉

---

## ✅ **Verificação Final**

### **1. Backend:**
```bash
curl https://videoflow-api.onrender.com/
# Deve retornar: {"message": "VideoFlow API is running"...}
```

### **2. API Docs:**
```
https://videoflow-api.onrender.com/docs
# Deve abrir Swagger UI
```

### **3. Frontend:**
```
https://videoflow.vercel.app
# Deve abrir tela de login
```

### **4. Criar Conta:**
- Registrar usuário
- Criar vídeo
- Testar funcionalidades

---

## 🔧 **URLs Importantes**

| Serviço | URL | Para que serve |
|---------|-----|----------------|
| **Frontend** | https://videoflow.vercel.app | App principal |
| **API Docs** | https://videoflow-api.onrender.com/docs | Testar API |
| **MongoDB** | Atlas Dashboard | Ver dados |
| **Render Logs** | Render Dashboard | Debug backend |
| **Vercel Logs** | Vercel Dashboard | Debug frontend |

---

## ⚠️ **Importante Saber**

### **Render Free Tier:**
- 🟡 **Dorme após 15min** de inatividade
- 🕐 **Primeira request leva ~30s** para "acordar"
- ✅ Normal para apps gratuitos

**Solução:** Use [UptimeRobot](https://uptimerobot.com/) para pingar a cada 5min

### **MongoDB Atlas M0:**
- ✅ **512 MB** de storage
- ✅ Adequado para **milhares de vídeos**
- 🟡 **Pausa após 60 dias** de inatividade

### **Vercel Hobby:**
- ✅ **100% gratuito** para sempre
- ✅ **Sem limite** de requests
- ✅ **HTTPS automático**

---

## 🐛 **Problema Comum #1**

**"Cannot connect to backend"**

**Causa:** Backend dormiu (Render Free)

**Solução:**
1. Aguarde 30s
2. Tente novamente
3. Configure UptimeRobot

---

## 🐛 **Problema Comum #2**

**"CORS Error"**

**Causa:** URLs mal configuradas

**Verificar:**
1. Vercel: `REACT_APP_BACKEND_URL` sem `/` no final
2. Render: `CORS_ORIGINS=*`
3. Redeploy ambos

---

## 🐛 **Problema Comum #3**

**"MongoDB connection failed"**

**Causa:** Connection String errada

**Verificar:**
1. Senha sem caracteres especiais
2. Network Access = `0.0.0.0/0`
3. Cluster ativo no Atlas

---

## 🚀 **Próximos Passos**

### **1. Domínio Personalizado (Opcional)**
- Vercel: Settings → Domains
- Ex: `videoflow.com`

### **2. Gerar APK Android**
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://videoflow.vercel.app/manifest.json
bubblewrap build
```

### **3. Melhorar Performance**
- Upgrade Render: $7/mês (sem sleep)
- MongoDB M10: $57/mês (produção)

---

## 📚 **Guias Completos**

- 📖 Deploy detalhado: `DEPLOY.md`
- ⚡ Instalação local: `INSTALACAO.md`
- 🚀 Quick Start: `QUICKSTART.md`

---

## ✅ **Checklist Rápido**

- [ ] MongoDB Atlas configurado
- [ ] Backend no Render deployado
- [ ] Frontend no Vercel deployado
- [ ] Criar conta no app
- [ ] Criar primeiro vídeo
- [ ] Compartilhar URL!

---

## 🎉 **Pronto!**

Seu VideoFlow está online:
- 🌐 **App:** https://videoflow.vercel.app
- 📱 **Compartilhe** com o mundo!
- 🚀 **Crie vídeos** de qualquer lugar!

**Sucesso!** 🎊
