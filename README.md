# 🚀 VideoFlow - Gestão de Vídeos PWA

Aplicativo completo de gestão de vídeos com foco em produtividade e compatibilidade Android via PWA.

## 📚 Documentação Disponível

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **TUTORIAL_DEPLOY_COMPLETO.md** | Tutorial passo a passo com CADA clique | Deploy pela primeira vez |
| **deploy-assistant.bat** | Script assistente Windows | Deploy automatizado |
| **deploy-assistant.sh** | Script assistente Mac/Linux | Deploy automatizado |
| **DEPLOY.md** | Guia completo de deploy | Referência detalhada |
| **DEPLOY_RAPIDO.md** | Deploy em 20 minutos | Já sabe o básico |
| **INSTALACAO.md** | Instalação local completa | Desenvolver localmente |
| **QUICKSTART.md** | Rodar local em 5 minutos | Teste rápido local |
| **README.md** | Este arquivo | Visão geral |

---

## 🎯 Como Começar?

### 🌐 **Quero colocar ONLINE (Vercel + Render + MongoDB)**

**Opção 1: Tutorial Detalhado (Recomendado)**
```markdown
Abra: TUTORIAL_DEPLOY_COMPLETO.md
Siga cada passo com capturas textuais
Tempo: ~30 minutos
```

**Opção 2: Script Assistente**

**Windows:**
```cmd
deploy-assistant.bat
```

**Mac/Linux:**
```bash
chmod +x deploy-assistant.sh
./deploy-assistant.sh
```

**Opção 3: Guia Rápido**
```markdown
Abra: DEPLOY_RAPIDO.md
Deploy em 20 minutos
```

---

### 💻 **Quero rodar LOCALMENTE (desenvolvimento)**

**Instalação Completa:**
```markdown
Abra: INSTALACAO.md
Guia passo a passo com tudo
```

**Quick Start (5 minutos):**
```markdown
Abra: QUICKSTART.md
Comandos diretos
```

---

# 🚀 Guia Completo de Instalação - VideoFlow PWA

Guia passo a passo para instalar e configurar o VideoFlow do zero.

Aplicativo completo e escalável de gestão de vídeos com foco em produtividade e compatibilidade total com Android (via PWA + Bubblewrap).

## 🚀 Stack Tecnológica

- **Backend**: Python + FastAPI + SQLite
- **Frontend**: React + PWA (Progressive Web App)
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: SQLite com SQLAlchemy (async)
- **Estilo**: Tailwind CSS + Design System customizado

## 🎯 Funcionalidades

### 1. Gestão de Vídeos
- CRUD completo (Criar, Editar, Excluir, Concluir)
- Campos: título, descrição, roteiro (multi-linhas), URL, status
- Status: planejado, em-produção, em-edição, concluído
- Dashboard com cards de estatísticas (Nível, Vídeos Concluídos, Total)

### 2. Importação / Exportação
- Modal com 2 abas: colar texto ou importar arquivo .txt/.md
- Parser REGEX robusto para capturar dados
- Exportação para .txt com formato compatível

### 3. Busca e Filtros
- Busca inteligente em tempo real (título, descrição, roteiro)
- Filtro por status
- Filtro por data (1h, 4h, 6h, 12h, 1d, 3d, 1s, 1m, 3m, 6m, 1a, todo o tempo)
- Contador de vídeos encontrados

### 4. Paginação
- Usuário escolhe quantidade por página (4, 6, 12, 24)
- Navegação com setas e números de página
- Scroll suave ao mudar de página

### 5. Ações em Massa
- Checkbox em cada card
- Barra flutuante com contador
- Alterar status em massa
- Excluir múltiplos vídeos

### 6. Sistema de Cópia
- Botões para copiar título, descrição, roteiro ou tudo
- Feedback visual com toast notifications
- Preserva quebras de linha

## 💻 Instalação e Execução

### Backend

```bash
cd /app/backend

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor (já gerenciado pelo supervisor)
sudo supervisorctl restart backend
```

### Frontend

```bash
cd /app/frontend

# Instalar dependências
yarn install

# Iniciar em modo desenvolvimento (já gerenciado pelo supervisor)
sudo supervisorctl restart frontend

# Build para produção
yarn build
```

## 📦 Build para Android (Bubblewrap)

### Pré-requisitos

1. Node.js e npm instalados
2. Java JDK 8 ou superior
3. Android SDK instalado

### Passos para Build

```bash
# 1. Instalar Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Fazer build do frontend
cd /app/frontend
yarn build

# 3. Servir o build localmente ou fazer deploy
# Para teste local:
npx serve -s build -l 3000

# 4. Inicializar projeto Bubblewrap
bubblewrap init --manifest=https://seu-dominio.com/manifest.json

# 5. Configurar detalhes do app
# Siga as instruções interativas:
# - Nome do app: VideoFlow
# - Package name: com.seudominio.videoflow
# - Ícone: use os ícones gerados em /app/frontend/public/

# 6. Build do APK
bubblewrap build

# 7. Build do AAB (Android App Bundle) para Play Store
bubblewrap build --buildMode=release
```

### Gerar Keystore (primeira vez)

```bash
keytool -genkey -v -keystore videoflow-release-key.jks \
  -alias videoflow \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

## 📱 Checklist de Publicação na Play Store

### Antes de Publicar

- [ ] Build AAB gerado com sucesso
- [ ] App testado em dispositivos Android reais
- [ ] Ícones em todos os tamanhos (512x512 para Play Store)
- [ ] Screenshots preparados (mínimo 2, recomendado 8)
- [ ] Descrição do app em português
- [ ] Política de privacidade publicada (URL)
- [ ] Termos de serviço (se aplicável)

### Informações Necessárias

**Nome do App**: VideoFlow - Gestão de Vídeos

**Descrição Curta** (80 caracteres):
Organize e gerencie seus projetos de vídeo de forma produtiva

**Descrição Completa** (4000 caracteres):
```
VideoFlow é o aplicativo definitivo para criadores de conteúdo que precisam
organizar e gerenciar seus projetos de vídeo de forma eficiente.

⭐ PRINCIPAIS FUNCIONALIDADES:

📝 Gestão Completa de Vídeos
- Crie e organize seus projetos de vídeo
- Gerencie títulos, descrições e roteiros
- Acompanhe o status de cada vídeo
- URLs para acessar seus vídeos publicados

📊 Dashboard Inteligente
- Visualize suas estatísticas em tempo real
- Nível de progresso baseado em vídeos concluídos
- Acompanhe vídeos em cada etapa de produção

🔍 Busca e Filtros Avançados
- Busca em tempo real por título, descrição ou roteiro
- Filtre por status (planejado, em produção, em edição, concluído)
- Filtros de tempo flexíveis (de 1 hora até todo o tempo)

📥 Import/Export
- Importe vídeos de arquivos de texto
- Exporte todos os seus vídeos para backup
- Formato simples e compatível

✅ Ações em Massa
- Selecione múltiplos vídeos
- Altere status em massa
- Exclua vários vídeos de uma vez

📋 Sistema de Cópia
- Copie títulos, descrições ou roteiros rapidamente
- Ideal para publicar em diferentes plataformas

🔒 Seguro e Privado
- Seus dados são armazenados localmente
- Autenticação segura com JWT
- Controle total sobre suas informações

Perfeito para:
- YouTubers e criadores de conteúdo
- Produtores de vídeo
- Agências de marketing digital
- Qualquer pessoa que trabalhe com produção de vídeo
```

**Categoria**: Produtividade

**Classificação de Conteúdo**: Livre

### Passos no Play Console

1. Criar conta de desenvolvedor no Google Play Console ($25 taxa única)
2. Criar novo app
3. Preencher detalhes do app
4. Upload do AAB
5. Criar release em produção
6. Preencher questionário de conteúdo
7. Configurar preço (gratuito)
8. Enviar para revisão

## 🎨 Design System

### Cores Principais

```css
--primary-color: #4a5568;      /* Cinza azulado */
--secondary-color: #718096;    /* Cinza médio */
--success-color: #48bb78;      /* Verde */
--warning-color: #ed8936;      /* Laranja */
--info-color: #4299e1;         /* Azul */
--light-bg: #f7fafc;           /* Fundo claro */
--border-radius: 12px;         /* Bordas arredondadas */
```

### Tipografia

- **Heading**: Manrope (600)
- **Body**: Inter (400)
- **Mono**: JetBrains Mono

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário atual

### Vídeos

- `GET /api/videos` - Listar vídeos (com filtros e paginação)
- `GET /api/videos/count` - Contar vídeos (com filtros)
- `GET /api/videos/{id}` - Obter vídeo específico
- `POST /api/videos` - Criar vídeo
- `PUT /api/videos/{id}` - Atualizar vídeo
- `DELETE /api/videos/{id}` - Excluir vídeo

### Operações em Massa

- `POST /api/videos/bulk-update` - Atualizar múltiplos vídeos
- `POST /api/videos/bulk-delete` - Excluir múltiplos vídeos

### Import/Export

- `POST /api/videos/import` - Importar vídeos
- `GET /api/videos/export` - Exportar vídeos

### Estatísticas

- `GET /api/videos/stats` - Obter estatísticas do usuário

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
/app/
├── backend/
│   ├── server.py          # API FastAPI principal
│   ├── database.py        # Config SQLAlchemy
│   ├── models.py          # Modelos do banco
│   ├── schemas.py         # Schemas Pydantic
│   ├── auth.py            # Utilitários JWT
│   ├── requirements.txt   # Dependências Python
│   └── videoflow.db       # Banco SQLite (gerado)
├── frontend/
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   ├── service-worker.js # Service Worker
│   │   └── icon-*.png       # Ícones PWA
│   ├── src/
│   │   ├── App.js           # Componente principal
│   │   ├── api.js           # Utilitários API
│   │   ├── pages/           # Páginas
│   │   │   ├── AuthPage.js
│   │   │   └── Dashboard.js
│   │   └── components/      # Componentes
│   │       ├── VideoCard.js
│   │       ├── VideoModal.js
│   │       ├── ImportExportModal.js
│   │       ├── Pagination.js
│   │       └── BulkActionBar.js
│   └── package.json      # Dependências Node
└── README.md
```

### Testando Localmente

1. Backend: `http://localhost:8001`
2. Frontend: `http://localhost:3000`
3. API Docs: `http://localhost:8001/docs`

## 🔐 Segurança

- Senhas hash com bcrypt
- Tokens JWT com expiração
- CORS configurado
- Validação de dados com Pydantic
- SQLAlchemy previne SQL injection

## 📝 Licença

Este projeto é privado e proprietário.

## 👤 Autor

Criado com VideoFlow PWA

---

**Versão**: 1.0.0
**Data**: 2025
