# ⚡ Guia Rápido: Vercel + APK

**Deploy rápido e geração de APK em comandos diretos**

---

## 🌐 PARTE 1: VERCEL (10 min)

### 1️⃣ Criar conta e importar
```
1. https://vercel.com/signup
2. Continue with GitHub
3. Add New... → Project
4. Import: videoflow
```

### 2️⃣ Configurar
```
Project Name: videoflow
Framework: Create React App
Root Directory: frontend  ⚠️ IMPORTANTE!
Build Command: yarn build
Output Directory: build
```

### 3️⃣ Environment Variable
```
Name:  REACT_APP_BACKEND_URL
Value: https://seu-backend.onrender.com
```

### 4️⃣ Deploy
```
Clique em [Deploy]
Aguarde 5 minutos
✅ https://videoflow.vercel.app
```

---

## 📱 PARTE 2: APK ANDROID (35 min)

### 1️⃣ Instalar ferramentas
```bash
# Java (se não tiver)
# Windows: https://adoptium.net/
# Mac: brew install openjdk@11
# Linux: sudo apt install openjdk-11-jdk

# Bubblewrap
npm install -g @bubblewrap/cli
```

### 2️⃣ Criar projeto
```bash
mkdir videoflow-android
cd videoflow-android

bubblewrap init --manifest=https://seu-app.vercel.app/manifest.json
```

### 3️⃣ Responder perguntas
```
Domain: seu-app.vercel.app
App name: VideoFlow
Package: com.videoflow.app
Status bar color: #4a5568
Nav bar color: #4a5568
Display: standalone
Orientation: portrait
Icon: https://seu-app.vercel.app/icon-512.png
Splash color: #f7fafc
Notifications: n
[Resto: ENTER]
```

### 4️⃣ Criar chave de assinatura
```bash
keytool -genkey -v -keystore videoflow-release-key.jks -alias videoflow -keyalg RSA -keysize 2048 -validity 10000

# Senha: [criar e anotar]
# Preencher seus dados
```

### 5️⃣ Configurar chave
```bash
# Edite twa-manifest.json
"signingKey": {
  "path": "./videoflow-release-key.jks",
  "alias": "videoflow"
}
```

### 6️⃣ Build APK
```bash
bubblewrap build

# Digite a senha quando pedir
# Aguarde 5 minutos

✅ app-release-signed.apk
```

### 7️⃣ Testar
```
1. Transfira APK para celular
2. Habilite "Fontes desconhecidas"
3. Instale o APK
4. Abra e teste!
```

---

## 🏪 PARTE 3: PLAY STORE (Opcional)

### 1️⃣ Gerar AAB
```bash
bubblewrap build --buildMode=release

✅ app-release-bundle.aab
```

### 2️⃣ Publicar
```
1. https://play.google.com/console
2. Criar app
3. Upload AAB
4. Preencher informações
5. Enviar para revisão
6. Aguardar aprovação (2-48h)
```

---

## 📋 CHECKLIST

**Vercel:**
- [ ] Conta criada
- [ ] Projeto importado
- [ ] Root Directory = frontend
- [ ] Variável de ambiente adicionada
- [ ] Deploy bem-sucedido
- [ ] App funcionando online

**APK:**
- [ ] Java instalado
- [ ] Bubblewrap instalado
- [ ] Projeto criado
- [ ] Chave de assinatura criada
- [ ] APK gerado
- [ ] APK testado no celular

**Play Store (Opcional):**
- [ ] Conta Play Console criada ($25)
- [ ] AAB gerado
- [ ] Informações preenchidas
- [ ] Enviado para revisão
- [ ] App aprovado

---

## 🐛 PROBLEMAS COMUNS

### Vercel build failed
```
→ Root Directory = frontend ✅
→ Redeploy
```

### APK não instala
```
→ Habilitar "Fontes desconhecidas"
→ Verificar espaço no celular
```

### Bubblewrap erro
```
→ Java instalado? java -version
→ Node 18+? node -version
→ Manifest válido? Testar URL
```

---

## 📱 RESULTADO

**URLs:**
- Web: https://videoflow.vercel.app
- APK: app-release-signed.apk
- AAB: app-release-bundle.aab (Play Store)

**Distribua:**
- Link web: compartilhe URL
- APK: envie direto para usuários
- Play Store: publique para milhões

---

## 🎉 PRONTO!

Seu VideoFlow está:
- ✅ Online no Vercel
- ✅ APK Android gerado
- ✅ Pronto para distribuir

**Para guia completo:** Veja `GUIA_VERCEL_APK.md`

---

**Tempo total:** ~45 minutos  
**Custo:** R$ 0,00 (+ $25 se publicar Play Store)
