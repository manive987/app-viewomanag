# 🚀 Guia Completo: Vercel Deploy + APK Android

**Deploy no Vercel + Geração de APK do VideoFlow**

Tempo total: ~45 minutos

---

## 📋 PARTE 1: DEPLOY NO VERCEL

### 🕒 Tempo: ~10 minutos

---

### ✅ PRÉ-REQUISITOS

Antes de começar, você precisa de:

1. ✅ **Código no GitHub**
   - Via "Save to GitHub" na Emergent
   - Ou git push manual

2. ✅ **Backend funcionando**
   - Render URL funcionando
   - Exemplo: `https://videoflow-api.onrender.com`

3. ✅ **Conta Google ou GitHub**

---

### 📍 PASSO 1: CRIAR CONTA NO VERCEL

**1.** Abra em uma nova aba:
```
https://vercel.com/signup
```

**2.** Escolha o método de cadastro:

```
┌─────────────────────────────┐
│  Continue with GitHub       │  ← RECOMENDADO
├─────────────────────────────┤
│  Continue with Google       │
├─────────────────────────────┤
│  Continue with Email        │
└─────────────────────────────┘
```

**3.** Se escolheu GitHub:
- Clique em **"Continue with GitHub"**
- Faça login no GitHub
- Clique em **"Authorize Vercel"**

**4.** Complete o perfil:
- **Name:** Seu nome
- **Team Name:** (opcional, pode pular)

**5.** Clique em **"Complete Sign Up"**

**✅ Pronto! Você verá o Dashboard do Vercel**

---

### 📍 PASSO 2: IMPORTAR PROJETO DO GITHUB

**1.** No Dashboard do Vercel, procure no canto superior direito:
```
[Add New...]
```

**2.** Clique nele e selecione:
```
Project
```

**3.** Você verá: **"Import Git Repository"**

**4.** Se é a primeira vez conectando o GitHub:
- Clique em **"Continue with GitHub"**
- Autorize o Vercel a acessar seus repositórios
- Você pode escolher:
  - **All repositories** (todos)
  - **Only select repositories** (escolher específicos)

**5.** Encontre seu repositório na lista:
```
🔍 Search repositories...

📁 videoflow  [Import]  ← CLIQUE AQUI
```

**6.** Clique em **"Import"** ao lado de `videoflow`

---

### 📍 PASSO 3: CONFIGURAR O PROJETO

Você verá a tela: **"Configure Project"**

---

#### **📋 PROJECT SETTINGS**

**Project Name:**
```
videoflow
```
*(ou o nome que você preferir - será parte da URL)*

**Framework Preset:**
- O Vercel deve detectar automaticamente: **"Create React App"**
- Se não detectou, selecione manualmente no dropdown

---

#### **📋 ROOT DIRECTORY** ⚠️ SUPER IMPORTANTE!

Por padrão, está em: `./`

Você precisa mudar para: `frontend`

**Como fazer:**

1. Clique no botão **"Edit"** ao lado de "Root Directory"

2. No campo que aparece, digite:
```
frontend
```

3. Você deve ver:
```
Root Directory: frontend ✓
```

**⚠️ Se não configurar isso, o build vai FALHAR!**

---

#### **📋 BUILD AND OUTPUT SETTINGS**

Geralmente já vem preenchido automaticamente:

```
Build Command:     yarn build
Output Directory:  build
Install Command:   yarn install
```

**Se estiver vazio, preencha exatamente assim ⬆️**

---

#### **📋 ENVIRONMENT VARIABLES** ⚠️ IMPORTANTE!

**1.** Role até encontrar: **"Environment Variables"**

**2.** Clique para expandir

**3.** Adicione a variável:

**Name:**
```
REACT_APP_BACKEND_URL
```

**Value:**
```
[COLE A URL DO SEU BACKEND AQUI]
```

**Exemplo:**
```
https://videoflow-api.onrender.com
```

**⚠️ ATENÇÃO:**
- ✅ Correto: `https://videoflow-api.onrender.com`
- ❌ Errado: `https://videoflow-api.onrender.com/` (SEM barra no final!)

**4.** Clique em **"Add"** para adicionar a variável

**5.** Confirme que a variável aparece na lista:
```
✓ REACT_APP_BACKEND_URL = https://videoflow-api.onrender.com
```

---

### 📍 PASSO 4: FAZER DEPLOY!

**1.** Após configurar tudo, role até o final da página

**2.** Clique no botão azul grande:
```
[Deploy]
```

**3.** O build vai começar! Você verá:

```
┌─────────────────────────────────┐
│   Building...                   │
│                                 │
│   ⏳ Cloning repository          │
│   ⏳ Installing dependencies     │
│   ⏳ Building application        │
│   ⏳ Optimizing                  │
│   ⏳ Uploading                   │
└─────────────────────────────────┘
```

**4.** Acompanhe os logs em tempo real

**5.** Aguarde de **3 a 7 minutos** (depende da velocidade)

**6.** Quando terminar, você verá:
```
🎉 🎊 Confetti animation! 🎊 🎉

Congratulations!
Your project has been deployed!
```

---

### 📍 PASSO 5: ACESSAR SEU APP ONLINE!

**1.** Na tela de sucesso, você verá uma prévia do site

**2.** Abaixo, há um link grande:
```
https://videoflow.vercel.app
```
*(ou algo como: `https://videoflow-xyz123.vercel.app`)*

**3.** Clique no link ou copie e abra em nova aba

**4.** Você deve ver a tela de login do VideoFlow!

```
╔══════════════════════════╗
║     🎬 VideoFlow         ║
║                          ║
║   Gestão de vídeos       ║
║   para criadores         ║
║                          ║
║   ┌──────────────────┐   ║
║   │ E-mail           │   ║
║   └──────────────────┘   ║
║   ┌──────────────────┐   ║
║   │ Senha            │   ║
║   └──────────────────┘   ║
║                          ║
║   [Entrar]               ║
║                          ║
║   Não tem conta?         ║
║   Criar conta            ║
╚══════════════════════════╝
```

**✅ SEU APP ESTÁ ONLINE NO VERCEL!**

---

### 📍 PASSO 6: TESTAR O APP

**1.** Clique em **"Criar conta"**

**2.** Preencha:
```
Nome de usuário: admin
E-mail: admin@teste.com
Senha: senha123
```

**3.** Clique em **"Criar Conta"**

**4.** Você deve ser redirecionado para o Dashboard

**5.** Crie um vídeo de teste

**✅ Se tudo funcionar, pode prosseguir para a Parte 2!**

---

### 🔧 TROUBLESHOOTING VERCEL

#### ❌ Erro: "Build Failed"

**Causa:** Root Directory errado

**Solução:**
1. Volte ao Vercel Dashboard
2. Clique no seu projeto
3. Settings → General
4. Root Directory: `frontend`
5. Save → Redeploy

---

#### ❌ Erro: "Cannot connect to backend"

**Causa:** Variável de ambiente errada

**Solução:**
1. Settings → Environment Variables
2. Verifique: `REACT_APP_BACKEND_URL`
3. Sem `/` no final
4. Salve e redeploy

---

#### ❌ Erro: "Module not found"

**Causa:** Dependências não instaladas

**Solução:**
1. Verifique `package.json` no GitHub
2. Todas dependências listadas?
3. Force redeploy: Deployments → ⋯ → Redeploy

---

## 📦 PARTE 2: GERAR APK ANDROID

### 🕒 Tempo: ~35 minutos

---

### ✅ PRÉ-REQUISITOS

Antes de gerar o APK, você precisa:

1. ✅ **App funcionando no Vercel**
   - URL funcionando
   - PWA configurado (manifest.json)

2. ✅ **Node.js instalado**
   - Versão 18 ou superior
   - Verificar: `node --version`

3. ✅ **Java JDK instalado**
   - Versão 11 ou superior
   - Necessário para assinar APK

---

### 📍 PASSO 1: INSTALAR JAVA JDK (se não tiver)

#### **Windows:**

**1.** Baixe o JDK:
```
https://adoptium.net/
```

**2.** Clique em **"Download"** (Latest Release)

**3.** Execute o instalador

**4.** Verifique a instalação:
```cmd
java -version
```

Deve mostrar:
```
openjdk version "11.0..." ou superior
```

---

#### **Mac:**

```bash
# Instalar via Homebrew
brew install openjdk@11

# Verificar
java -version
```

---

#### **Linux (Ubuntu/Debian):**

```bash
# Instalar
sudo apt update
sudo apt install openjdk-11-jdk

# Verificar
java -version
```

---

### 📍 PASSO 2: INSTALAR BUBBLEWRAP CLI

Bubblewrap é a ferramenta do Google para criar APKs de PWAs.

**No terminal/PowerShell:**

```bash
npm install -g @bubblewrap/cli
```

**Aguarde a instalação (~1-2 minutos)**

**Verificar instalação:**
```bash
bubblewrap --version
```

Deve mostrar algo como: `1.21.0`

---

### 📍 PASSO 3: CRIAR PROJETO BUBBLEWRAP

**1.** Crie uma pasta para o projeto Android:

```bash
# Windows
cd C:\
mkdir videoflow-android
cd videoflow-android

# Mac/Linux
cd ~
mkdir videoflow-android
cd videoflow-android
```

**2.** Inicialize o projeto Bubblewrap:

```bash
bubblewrap init --manifest=https://SEU-APP.vercel.app/manifest.json
```

**⚠️ Substitua pela SUA URL do Vercel!**

Exemplo:
```bash
bubblewrap init --manifest=https://videoflow.vercel.app/manifest.json
```

---

### 📍 PASSO 4: CONFIGURAR O PROJETO (Perguntas Interativas)

O Bubblewrap vai fazer várias perguntas. Responda assim:

---

**Pergunta 1:**
```
Domain being pwa-ed (eg. example.com):
```

**Resposta:**
```
SEU-APP.vercel.app
```
Exemplo: `videoflow.vercel.app`

---

**Pergunta 2:**
```
Name of the application:
```

**Resposta:**
```
VideoFlow
```

---

**Pergunta 3:**
```
Short name of the application:
```

**Resposta:**
```
VideoFlow
```

---

**Pergunta 4:**
```
Application package name (eg. com.example.app):
```

**Resposta:**
```
com.videoflow.app
```

*(Ou use seu domínio: `com.seudominio.videoflow`)*

**⚠️ IMPORTANTE: Use apenas letras minúsculas, pontos e números!**

---

**Pergunta 5:**
```
Color for the status bar:
```

**Resposta:**
```
#4a5568
```
*(A cor primária do VideoFlow)*

---

**Pergunta 6:**
```
Color for the navigation bar:
```

**Resposta:**
```
#4a5568
```

---

**Pergunta 7:**
```
Display mode (fullscreen, standalone, minimal-ui):
```

**Resposta:**
```
standalone
```
*(Melhor para apps)*

---

**Pergunta 8:**
```
Orientation (any, natural, landscape, portrait):
```

**Resposta:**
```
portrait
```
*(Apps de vídeo geralmente são verticais)*

---

**Pergunta 9:**
```
Icon URL:
```

**Resposta:**
```
https://SEU-APP.vercel.app/icon-512.png
```

---

**Pergunta 10:**
```
Maskable Icon URL (optional):
```

**Resposta:**
```
https://SEU-APP.vercel.app/icon-512.png
```

---

**Pergunta 11:**
```
Splash screen color:
```

**Resposta:**
```
#f7fafc
```
*(Fundo claro do VideoFlow)*

---

**Pergunta 12:**
```
Enable Site Settings Shortcut (Y/n):
```

**Resposta:**
```
Y
```

---

**Pergunta 13:**
```
Fallback behavior (customtabs, webview):
```

**Resposta:**
```
customtabs
```

---

**Pergunta 14:**
```
Enable notifications (Y/n):
```

**Resposta:**
```
n
```
*(Por enquanto não precisa)*

---

**Pergunta 15:**
```
Features requested (camera, microphone...):
```

**Resposta:**
```
[deixe vazio, só aperte ENTER]
```

---

**Pergunta 16:**
```
Path to an existing signing key (optional):
```

**Resposta:**
```
[deixe vazio, só aperte ENTER]
```

*(Vamos criar uma nova chave)*

---

**Após responder tudo, você verá:**
```
✓ Downloading icon...
✓ Generating Android project...
✓ Installing dependencies...
✓ Project generated successfully!
```

---

### 📍 PASSO 5: CRIAR CHAVE DE ASSINATURA (Keystore)

Todo APK Android precisa ser assinado. Vamos criar a chave:

**1.** Na pasta do projeto, execute:

```bash
keytool -genkey -v -keystore videoflow-release-key.jks -alias videoflow -keyalg RSA -keysize 2048 -validity 10000
```

**2.** O keytool vai fazer perguntas:

---

**Pergunta 1:**
```
Enter keystore password:
```

**Resposta:** Digite uma senha forte (ex: `videoflow2025`)

**⚠️ ANOTE ESSA SENHA! Você vai precisar sempre!**

---

**Pergunta 2:**
```
Re-enter new password:
```

**Resposta:** Digite a mesma senha

---

**Pergunta 3:**
```
What is your first and last name?
```

**Resposta:** Seu nome completo

---

**Pergunta 4:**
```
What is the name of your organizational unit?
```

**Resposta:** `Development` (ou deixe vazio)

---

**Pergunta 5:**
```
What is the name of your organization?
```

**Resposta:** `VideoFlow` (ou seu nome/empresa)

---

**Pergunta 6:**
```
What is the name of your City or Locality?
```

**Resposta:** Sua cidade

---

**Pergunta 7:**
```
What is the name of your State or Province?
```

**Resposta:** Seu estado

---

**Pergunta 8:**
```
What is the two-letter country code for this unit?
```

**Resposta:** `BR` (ou seu país)

---

**Pergunta 9:**
```
Is CN=..., OU=..., O=..., L=..., ST=..., C=... correct?
```

**Resposta:** `yes`

---

**Pergunta 10:**
```
Enter key password for <videoflow>
```

**Resposta:** Aperte ENTER (usa a mesma senha do keystore)

---

**Você verá:**
```
Generating 2,048 bit RSA key pair and self-signed certificate...
[Storing videoflow-release-key.jks]
```

**✅ Chave criada com sucesso!**

---

### 📍 PASSO 6: CONFIGURAR CHAVE NO BUBBLEWRAP

**1.** Edite o arquivo `twa-manifest.json`:

```bash
# Windows
notepad twa-manifest.json

# Mac
nano twa-manifest.json

# Linux
nano twa-manifest.json
```

**2.** Encontre a seção `signingKey`:

```json
"signingKey": {
  "path": "",
  "alias": ""
}
```

**3.** Altere para:

```json
"signingKey": {
  "path": "./videoflow-release-key.jks",
  "alias": "videoflow"
}
```

**4.** Salve o arquivo (Ctrl+S)

---

### 📍 PASSO 7: BUILD DO APK!

**1.** Execute o build:

```bash
bubblewrap build
```

**2.** Quando pedir a senha:

```
Enter password for keystore [...]:
```

Digite a senha que você criou antes: `videoflow2025`

**3.** Aguarde o build (~3-5 minutos)

Você verá:
```
⏳ Building APK...
   - Gradle build
   - Signing APK
   - Optimizing...

✅ APK generated successfully!
```

---

### 📍 PASSO 8: LOCALIZAR O APK

O APK estará em:

```
./app-release-signed.apk
```

**Caminho completo:**
- Windows: `C:\videoflow-android\app-release-signed.apk`
- Mac/Linux: `~/videoflow-android/app-release-signed.apk`

---

### 📍 PASSO 9: TESTAR O APK

#### **Opção 1: Emulador Android (Android Studio)**

Se você tem Android Studio:

1. Abra Android Studio
2. AVD Manager → Start emulator
3. Arraste o APK para o emulador
4. App instala automaticamente!

---

#### **Opção 2: Celular Android Físico (RECOMENDADO)**

**1.** Habilite instalação de apps desconhecidos:
- Configurações → Segurança
- Ativar "Fontes desconhecidas" ou "Instalar apps desconhecidos"

**2.** Transfira o APK para o celular:
- Via cabo USB
- Via Google Drive
- Via email
- Via WhatsApp (envie para você mesmo)

**3.** No celular, toque no arquivo APK

**4.** Toque em **"Instalar"**

**5.** Aguarde a instalação

**6.** Toque em **"Abrir"**

**🎉 SEU APP ANDROID ESTÁ FUNCIONANDO!**

---

### 📍 PASSO 10: GERAR AAB PARA PLAY STORE (Opcional)

Se quiser publicar na Google Play Store, precisa de um AAB (Android App Bundle):

```bash
bubblewrap build --buildMode=release
```

O arquivo será:
```
./app-release-bundle.aab
```

---

## 📱 PARTE 3: PUBLICAR NA PLAY STORE (Opcional)

### 🕒 Tempo: ~2 horas (revisão do Google)

---

### ✅ PRÉ-REQUISITOS

1. ✅ **Conta Google Play Console**
   - Taxa única de $25 USD
   - Criar em: https://play.google.com/console

2. ✅ **AAB gerado** (passo 10 acima)

3. ✅ **Materiais necessários:**
   - Ícone 512x512 (PNG)
   - Screenshots (mínimo 2)
   - Descrição do app
   - Política de privacidade (URL)

---

### 📍 PASSO 1: CRIAR APP NO CONSOLE

**1.** Acesse: https://play.google.com/console

**2.** Clique em **"Criar app"**

**3.** Preencha:
```
Nome do app: VideoFlow
Idioma padrão: Português (Brasil)
Tipo: App
Gratuito/Pago: Gratuito
```

**4.** Aceite as declarações

**5.** Clique em **"Criar app"**

---

### 📍 PASSO 2: FAZER UPLOAD DO AAB

**1.** Menu lateral → **"Produção"**

**2.** Clique em **"Criar nova versão"**

**3.** Upload do AAB:
- Clique em **"Upload"**
- Selecione: `app-release-bundle.aab`
- Aguarde o upload

**4.** Preencha:
```
Nome da versão: 1.0.0
Notas da versão: Primeira versão do VideoFlow
```

**5.** Clique em **"Próximo"**

---

### 📍 PASSO 3: PREENCHER INFORMAÇÕES

**1.** **Listagem da loja** (Store Listing)

```
Título: VideoFlow - Gestão de Vídeos

Descrição curta:
Organize e gerencie seus projetos de vídeo de forma produtiva

Descrição completa:
VideoFlow é o aplicativo definitivo para criadores de conteúdo...
[Use a descrição do DEPLOY.md]

Ícone do app: [Upload icon-512.png]

Imagens de recursos: [Upload screenshots - mínimo 2]

Categoria: Produtividade

E-mail de contato: seu@email.com

Política de privacidade: [URL da sua política]
```

**2.** **Classificação de conteúdo**
- Preencha o questionário
- VideoFlow é "LIVRE" (sem conteúdo adulto/violento)

**3.** **Países de distribuição**
- Selecione: Brasil (ou todos)

**4.** **Preço**
- Gratuito

---

### 📍 PASSO 4: ENVIAR PARA REVISÃO

**1.** Revise todas as informações

**2.** Clique em **"Enviar para revisão"**

**3.** Aguarde aprovação do Google:
- Tempo: 2-48 horas
- Você receberá email

**4.** Quando aprovado:
```
🎉 Seu app está PUBLICADO na Play Store!
```

---

## 📊 RESUMO FINAL

### ✅ O QUE VOCÊ FEZ:

**Parte 1: Vercel**
- ✅ Deploy do frontend
- ✅ App online em: `https://videoflow.vercel.app`

**Parte 2: APK**
- ✅ APK gerado: `app-release-signed.apk`
- ✅ Testado no celular
- ✅ App funcionando offline

**Parte 3: Play Store (Opcional)**
- ✅ AAB gerado
- ✅ App publicado na Google Play

---

## 📝 ARQUIVOS IMPORTANTES

```
videoflow-android/
├── app-release-signed.apk       ← APK para instalar
├── app-release-bundle.aab       ← AAB para Play Store
├── videoflow-release-key.jks    ← Chave de assinatura (GUARDAR!)
└── twa-manifest.json            ← Configuração do app
```

**⚠️ GUARDE A CHAVE (.jks) COM SEGURANÇA!**
- Necessária para atualizações futuras
- Se perder, não pode atualizar o app na Play Store

---

## 🎉 PARABÉNS!

Você completou todo o processo:
- ✅ App online no Vercel
- ✅ APK Android funcionando
- ✅ Pronto para distribuir!

**Próximos passos:**
1. Compartilhe a URL do Vercel
2. Distribua o APK
3. Publique na Play Store
4. Colete feedback dos usuários

**Seu VideoFlow está COMPLETO!** 🚀📱

---

**Versão:** 1.0.0  
**Atualizado:** Dezembro 2025
