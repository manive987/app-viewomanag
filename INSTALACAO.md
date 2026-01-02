# 🚀 Guia Completo de Instalação - VideoFlow PWA

Guia passo a passo para instalar e configurar o VideoFlow do zero.

---

## 📋 **Requisitos do Sistema**

### **Obrigatórios:**
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB 6.0+** - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

### **Recomendados:**
- **VSCode** - [Download](https://code.visualstudio.com/)
- **MongoDB Compass** (GUI para MongoDB) - [Download](https://www.mongodb.com/try/download/compass)
- **Postman** (para testar APIs) - [Download](https://www.postman.com/downloads/)

---

## 📥 **Passo 1: Baixar o Código**

### **Opção A: Via GitHub (Recomendado)**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/videoflow.git
cd videoflow
```

### **Opção B: Download Direto**

1. Baixe o arquivo ZIP do projeto
2. Extraia para uma pasta (ex: `C:\videoflow` ou `~/videoflow`)
3. Abra o terminal nessa pasta

---

## 🗄️ **Passo 2: Configurar MongoDB**

### **Windows:**

**2.1. Instalar MongoDB:**
1. Baixe: https://www.mongodb.com/try/download/community
2. Execute o instalador
3. Escolha "Complete Installation"
4. Marque "Install MongoDB as a Service"
5. Conclua a instalação

**2.2. Verificar Instalação:**
```bash
# Abra PowerShell ou CMD
mongod --version
```

**2.3. Iniciar MongoDB:**
```bash
# MongoDB deve iniciar automaticamente como serviço
# Para iniciar manualmente:
net start MongoDB
```

### **macOS:**

```bash
# Instalar via Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Iniciar MongoDB
brew services start mongodb-community@6.0

# Verificar
mongosh --version
```

### **Linux (Ubuntu/Debian):**

```bash
# Importar chave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Adicionar repositório
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Atualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar status
sudo systemctl status mongod
```

### **2.4. Verificar Conexão:**

```bash
# Conectar ao MongoDB
mongosh

# Você deve ver:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/...

# Sair
exit
```

---

## 🐍 **Passo 3: Configurar Backend (Python/FastAPI)**

### **3.1. Navegar para a pasta backend:**

```bash
cd backend
```

### **3.2. Criar ambiente virtual Python:**

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Você verá `(venv)` no início da linha do terminal.

### **3.3. Instalar dependências:**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Dependências principais instaladas:**
- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `motor` - Driver MongoDB assíncrono
- `pymongo` - MongoDB driver
- `pydantic` - Validação de dados
- `python-jose` - JWT tokens
- `passlib` - Hash de senhas
- `bcrypt` - Criptografia
- `python-dotenv` - Variáveis de ambiente

### **3.4. Configurar variáveis de ambiente:**

Crie ou edite o arquivo `backend/.env`:

```bash
# Windows
notepad .env

# macOS/Linux
nano .env
# ou
code .env
```

**Conteúdo do arquivo `.env`:**

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=videoflow_db

# Security
JWT_SECRET_KEY=seu-secret-key-super-seguro-mude-em-producao-2025
CORS_ORIGINS=*

# Environment
ENV=development
```

**⚠️ IMPORTANTE:** Mude o `JWT_SECRET_KEY` para algo único!

**Gerar chave segura:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### **3.5. Testar o backend:**

```bash
# Ainda dentro de backend/ com venv ativo
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Você deve ver:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

### **3.6. Verificar API:**

Abra o navegador e acesse:
- **API Docs:** http://localhost:8001/docs
- **Root:** http://localhost:8001/

Você deve ver a interface Swagger UI com todos os endpoints!

### **3.7. Verificar MongoDB:**

```bash
# Em outro terminal
mongosh

# Dentro do mongosh:
use videoflow_db
show collections

# Deve mostrar: users, videos (após criar primeiro usuário)
```

**Deixe o backend rodando** e abra um **novo terminal** para o frontend.

---

## ⚛️ **Passo 4: Configurar Frontend (React)**

### **4.1. Navegar para a pasta frontend:**

```bash
# Em um NOVO terminal, da pasta raiz do projeto
cd frontend
```

### **4.2. Instalar Yarn (gerenciador de pacotes):**

**Se ainda não tiver Yarn instalado:**

```bash
npm install -g yarn
```

**Verificar:**
```bash
yarn --version
```

### **4.3. Instalar dependências:**

```bash
yarn install
```

**⏱️ Isso pode levar alguns minutos...**

**Dependências principais instaladas:**
- `react` - Framework UI
- `react-router-dom` - Navegação
- `axios` - Cliente HTTP
- `tailwindcss` - Estilização
- `lucide-react` - Ícones
- `sonner` - Notificações toast
- `@radix-ui/*` - Componentes UI

### **4.4. Configurar variáveis de ambiente:**

Crie ou edite o arquivo `frontend/.env`:

```bash
# Windows
notepad .env

# macOS/Linux
nano .env
# ou
code .env
```

**Conteúdo do arquivo `.env`:**

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001
```

**⚠️ IMPORTANTE:** 
- Para desenvolvimento local: `http://localhost:8001`
- Para produção: substitua pela URL do seu backend deployado

### **4.5. Iniciar o frontend:**

```bash
yarn start
```

**Você deve ver:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### **4.6. Abrir aplicação:**

O navegador deve abrir automaticamente em: **http://localhost:3000**

Você verá a **tela de login/registro** do VideoFlow! 🎉

---

## ✅ **Passo 5: Testar o Sistema Completo**

### **5.1. Criar primeiro usuário:**

1. Na tela de login, clique em **"Criar conta"**
2. Preencha:
   - Nome de usuário: `admin`
   - E-mail: `admin@videoflow.com`
   - Senha: `senha123`
3. Clique em **"Criar Conta"**

Você deve ser redirecionado para o dashboard! ✨

### **5.2. Criar primeiro vídeo:**

1. No dashboard, clique em **"Novo Vídeo"**
2. Preencha:
   - Título: `Meu Primeiro Vídeo`
   - Descrição: `Testando o VideoFlow`
   - Status: `Planejado`
3. Clique em **"Criar Vídeo"**

### **5.3. Testar funcionalidades:**

- ✅ Busca (digite no campo de busca)
- ✅ Filtros (status e período)
- ✅ Paginação (mude itens por página)
- ✅ Editar vídeo (clique no ícone de lápis)
- ✅ Copiar título (clique no botão "Título")
- ✅ Seleção múltipla (marque checkboxes)
- ✅ Ações em massa (alterar status)

### **5.4. Verificar dados no MongoDB:**

```bash
# Em outro terminal
mongosh

use videoflow_db
db.users.find().pretty()
db.videos.find().pretty()

# Contar documentos
db.users.countDocuments()
db.videos.countDocuments()

exit
```

---

## 🎨 **Passo 6: Gerar Ícones PWA (Opcional)**

Os ícones já foram gerados, mas se precisar recriar:

```bash
cd frontend/public
python3 << 'EOF'
from PIL import Image, ImageDraw

sizes = [72, 96, 128, 144, 152, 192, 384, 512]
bg_color = (74, 85, 104)
text_color = (255, 255, 255)

for size in sizes:
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    triangle_size = size * 0.4
    center_x, center_y = size // 2, size // 2
    points = [
        (center_x - triangle_size//2, center_y - triangle_size//2),
        (center_x - triangle_size//2, center_y + triangle_size//2),
        (center_x + triangle_size//2, center_y)
    ]
    draw.polygon(points, fill=text_color)
    
    img.save(f'icon-{size}.png')
    print(f'Created icon-{size}.png')

print('Done!')
EOF
```

---

## 📱 **Passo 7: Testar PWA (Opcional)**

### **7.1. Build de produção:**

```bash
cd frontend
yarn build
```

Isso cria a pasta `build/` otimizada para produção.

### **7.2. Servir build local:**

```bash
# Instalar serve
npm install -g serve

# Servir build
serve -s build -l 3000
```

### **7.3. Testar instalação PWA:**

1. Abra Chrome/Edge em: http://localhost:3000
2. No menu do navegador (⋮), clique em **"Instalar VideoFlow"**
3. Confirme a instalação
4. O app abrirá como aplicativo standalone!

**Testar offline:**
1. No DevTools (F12), vá em **Application** > **Service Workers**
2. Marque **"Offline"**
3. Recarregue a página - deve funcionar offline! 🚀

---

## 🔧 **Passo 8: Comandos Úteis**

### **Backend:**

```bash
# Ativar ambiente virtual
cd backend
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate     # Windows

# Iniciar servidor
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Adicionar nova dependência
pip install nome-do-pacote
pip freeze > requirements.txt

# Desativar ambiente virtual
deactivate
```

### **Frontend:**

```bash
cd frontend

# Iniciar desenvolvimento
yarn start

# Build produção
yarn build

# Adicionar dependência
yarn add nome-do-pacote

# Limpar cache
rm -rf node_modules yarn.lock
yarn install
```

### **MongoDB:**

```bash
# Iniciar MongoDB
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community@6.0

# Linux:
sudo systemctl start mongod

# Conectar ao shell
mongosh

# Backup database
mongodump --db videoflow_db --out ./backup

# Restaurar database
mongorestore --db videoflow_db ./backup/videoflow_db
```

---

## 🐛 **Solução de Problemas Comuns**

### **Erro: "Module not found"**

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
yarn install
```

### **Erro: "MongoDB connection failed"**

```bash
# Verificar se MongoDB está rodando
# Windows:
sc query MongoDB

# macOS:
brew services list

# Linux:
sudo systemctl status mongod

# Se não estiver, inicie:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community@6.0
# Linux: sudo systemctl start mongod
```

### **Erro: "Port 8001 already in use"**

```bash
# Encontrar processo usando a porta
# Windows:
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8001 | xargs kill -9

# Ou use outra porta:
uvicorn server:app --reload --port 8002
```

### **Erro: "CORS policy"**

Verifique se o `REACT_APP_BACKEND_URL` no `frontend/.env` está correto:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

E reinicie o frontend:
```bash
# Ctrl+C para parar
yarn start
```

---

## 🚀 **Próximos Passos**

### **Desenvolvimento:**
- [ ] Personalizar cores no design system
- [ ] Adicionar novas funcionalidades
- [ ] Melhorar interface

### **Deploy:**
- [ ] Deploy backend no Render/Railway
- [ ] Deploy frontend no Vercel
- [ ] Configurar MongoDB Atlas (cloud)
- [ ] Gerar APK via Bubblewrap

### **Produção:**
- [ ] Mudar `JWT_SECRET_KEY` para algo seguro
- [ ] Configurar domínio customizado
- [ ] Habilitar HTTPS
- [ ] Configurar backups automáticos

---

## 📞 **Suporte**

Se tiver problemas:

1. **Verifique os logs:**
   - Backend: Terminal onde rodou `uvicorn`
   - Frontend: Console do navegador (F12)
   - MongoDB: Logs do sistema

2. **Teste endpoints:**
   - API Docs: http://localhost:8001/docs
   - Root: http://localhost:8001/

3. **Verifique versões:**
   ```bash
   python --version    # 3.11+
   node --version      # 18+
   mongod --version    # 6.0+
   yarn --version      # 1.22+
   ```

---

## ✅ **Checklist de Instalação**

- [ ] Python 3.11+ instalado
- [ ] Node.js 18+ instalado
- [ ] MongoDB 6.0+ instalado e rodando
- [ ] Código baixado/clonado
- [ ] Backend dependencies instaladas (`pip install -r requirements.txt`)
- [ ] Backend `.env` configurado
- [ ] Backend rodando (http://localhost:8001)
- [ ] Frontend dependencies instaladas (`yarn install`)
- [ ] Frontend `.env` configurado
- [ ] Frontend rodando (http://localhost:3000)
- [ ] Primeiro usuário criado
- [ ] Primeiro vídeo criado
- [ ] Funcionalidades testadas

---

## 🎉 **Parabéns!**

Seu VideoFlow PWA está instalado e funcionando!

**Próximo passo:** Explore todas as funcionalidades e comece a organizar seus vídeos! 🚀

---

**Versão:** 1.0.0  
**Data:** Dezembro 2025  
**Criado por:** VideoFlow Team
