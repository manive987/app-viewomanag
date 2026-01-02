# 🚀 Quick Start - VideoFlow

Guia rápido para instalar e rodar o VideoFlow em 5 minutos!

---

## ⚡ Instalação Rápida

### **1. Pré-requisitos**
```bash
# Verificar se está tudo instalado:
python3 --version  # Python 3.11+
node --version     # Node 18+
mongod --version   # MongoDB 6.0+
```

**Não tem instalado?** Veja o guia completo em `INSTALACAO.md`

---

### **2. Backend (Terminal 1)**

```bash
# Navegar e ativar ambiente
cd backend
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# OU
venv\Scripts\activate     # Windows

# Instalar e rodar
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

✅ Acesse: http://localhost:8001/docs

---

### **3. Frontend (Terminal 2)**

```bash
# Navegar e instalar
cd frontend
yarn install

# Rodar
yarn start
```

✅ Abre automaticamente: http://localhost:3000

---

### **4. MongoDB (Terminal 3)**

```bash
# Iniciar MongoDB
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community@6.0

# Linux:
sudo systemctl start mongod

# Verificar:
mongosh
```

---

## 🎯 Uso Básico

1. **Criar conta:** http://localhost:3000
2. **Fazer login**
3. **Criar vídeo:** Botão "Novo Vídeo"
4. **Explorar:** Busca, filtros, paginação, etc.

---

## 📁 Estrutura do Projeto

```
videoflow/
├── backend/          # FastAPI + MongoDB
│   ├── server.py     # API principal
│   ├── database.py   # Config MongoDB
│   ├── models.py     # Modelos
│   ├── schemas.py    # Validações
│   ├── auth.py       # JWT/Auth
│   └── .env          # Variáveis de ambiente
│
├── frontend/         # React PWA
│   ├── src/
│   │   ├── pages/    # AuthPage, Dashboard
│   │   ├── components/ # VideoCard, Modals, etc
│   │   ├── App.js    # App principal
│   │   └── api.js    # Cliente HTTP
│   ├── public/       # PWA assets
│   └── .env          # Variáveis de ambiente
│
└── README.md
```

---

## 🔑 Variáveis de Ambiente

### **backend/.env**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=videoflow_db
JWT_SECRET_KEY=seu-secret-aqui
CORS_ORIGINS=*
```

### **frontend/.env**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 🛠️ Comandos Essenciais

### **Backend**
```bash
cd backend
source venv/bin/activate          # Ativar venv
uvicorn server:app --reload       # Rodar servidor
pip install nome-pacote           # Instalar dependência
pip freeze > requirements.txt     # Atualizar deps
```

### **Frontend**
```bash
cd frontend
yarn start                        # Dev mode
yarn build                        # Build produção
yarn add nome-pacote              # Instalar dependência
```

### **MongoDB**
```bash
mongosh                           # Shell interativo
use videoflow_db                  # Usar database
db.users.find()                   # Ver usuários
db.videos.find()                  # Ver vídeos
```

---

## 🐛 Problemas Comuns

### **MongoDB não conecta?**
```bash
# Iniciar MongoDB
net start MongoDB                               # Windows
brew services start mongodb-community@6.0       # macOS
sudo systemctl start mongod                     # Linux
```

### **Porta 8001 em uso?**
```bash
# Mudar porta
uvicorn server:app --reload --port 8002

# Atualizar frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8002
```

### **Erro de módulos?**
```bash
# Backend
pip install -r requirements.txt

# Frontend
rm -rf node_modules
yarn install
```

---

## 📚 Documentação Completa

- **Instalação detalhada:** `INSTALACAO.md`
- **README geral:** `README.md`
- **API Docs:** http://localhost:8001/docs

---

## 🎉 Pronto!

Sistema rodando:
- 🔹 Backend: http://localhost:8001
- 🔹 Frontend: http://localhost:3000
- 🔹 MongoDB: localhost:27017

**Bora criar vídeos!** 🚀
