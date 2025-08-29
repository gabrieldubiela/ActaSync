# 📘 ActaSync - Sistema de Atas Sacramentais

Sistema completo para gerenciar atas de reuniões sacramentais, desenvolvido em React + Firebase como PWA (Progressive Web App).

## 🚀 Funcionalidades

- ✅ **Autenticação segura** com Firebase Auth
- 📝 **Formulários inteligentes** para criação de atas
- 📅 **Calendário de oradores** com sincronização automática
- 👥 **Gestão de membros** com pronomes automáticos
- 🎵 **Biblioteca de hinos** com autocomplete
- 📧 **Mensagens automáticas** (convite e confirmação)
- 📄 **Geração de PDF** das atas
- 📱 **PWA** - funciona como app no celular
- 🔄 **Sincronização em tempo real** entre dispositivos

## 🛠️ Tecnologias

- **Frontend**: React 18 + Chakra UI
- **Backend**: Firebase (Auth + Realtime Database)
- **Hospedagem**: Firebase Hosting
- **PWA**: Service Worker + Manifest
- **PDF**: @react-pdf/renderer

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/actasync.git
cd actasync
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase

#### 3.1. Crie um projeto no Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nomeie seu projeto (ex: "actasync-sua-ala")
4. Siga as instruções para criar o projeto

#### 3.2. Configure a Authentication
1. No Firebase Console, vá em "Authentication" > "Sign-in method"
2. Ative "Email/password"

#### 3.3. Configure o Realtime Database
1. Vá em "Realtime Database" > "Criar banco de dados"
2. Escolha "Iniciar no modo de teste"
3. Selecione uma localização (ex: us-central1)

#### 3.4. Configure o Hosting (opcional)
1. Vá em "Hosting" > "Começar"
2. Siga as instruções para configurar

### 4. Configure as variáveis de ambiente

#### 4.1. Obtenha as credenciais do Firebase
1. No Firebase Console, vá em "Configurações do projeto" (ícone da engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique em "Adicionar app" > "Web" (ícone `</>`)
4. Registre o app (ex: "ActaSync Web")
5. Copie as informações de configuração

#### 4.2. Crie o arquivo .env
```bash
cp .env.example .env
```

#### 4.3. Preencha o arquivo .env com suas credenciais
```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://seu_projeto-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
REACT_APP_ALA_NAME=Ala São Paulo Centro
REACT_APP_ESTACA_NAME=Estaca São Paulo Sul
```

### 5. Configure as regras do Firebase

#### 5.1. Regras do Realtime Database
No Firebase Console, vá em "Realtime Database" > "Regras" e substitua por:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 6. Execute o projeto
```bash
npm start
```

O app estará disponível em `http://localhost:3000`

## 📱 Instalação como PWA

### No celular (Android/iOS):
1. Acesse o site pelo navegador
2. Toque no menu do navegador
3. Selecione "Adicionar à tela inicial"

### No computador (Chrome):
1. Acesse o site
2. Clique no ícone de "instalar" na barra de endereço
3. Ou vá em Menu > "Instalar ActaSync..."

## 🚀 Deploy para Produção

### Firebase Hosting

1. **Instale o Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Faça login no Firebase**
```bash
firebase login
```

3. **Inicialize o projeto**
```bash
firebase init
```
- Selecione "Hosting"
- Escolha seu projeto Firebase
- Public directory: `build`
- Configure como SPA: `Yes`
- Rewrite all URLs to index.html: `Yes`

4. **Faça o build**
```bash
npm run build
```

5. **Deploy**
```bash
firebase deploy
```

## 📖 Como Usar

### Primeiro Acesso
1. **Criar conta**: Use o email do responsável pelas atas
2. **Configurar dados**: O sistema usará as informações do .env

### Fluxo Principal
1. **Cadastrar membros** na aba "Membros"
2. **Cadastrar hinos** na aba "Hinos"
3. **Planejar domingos** na aba "Calendário"
4. **Criar atas** na aba "Atas"
5. **Gerar PDFs** e mensagens conforme necessário

### Funcionalidades Especiais

#### Pronomes Automáticos
- **Bispo** → "bispo João Silva"
- **Presidente** → "presidente Maria Santos"
- **Demais membros** → "irmão/irmã + nome"

#### Mensagens Automáticas
- **Convite**: Texto motivacional + PDF opcional
- **Confirmação**: Pergunta simples SIM/NÃO

#### Sincronização Calendário ↔ Ata
- Alterações no calendário atualizam a ata automaticamente
- Alterações na ata atualizam o calendário

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/          # Componentes React
│   ├── AtaForm.jsx     # Formulário de atas
│   ├── Calendario.jsx  # Calendário de oradores
│   ├── Dashboard.jsx   # Tela inicial
│   ├── Hinos.jsx       # Gestão de hinos
│   ├── Login.jsx       # Tela de login
│   ├── Membros.jsx     # Gestão de membros
│   └── PDFGenerator.jsx # Geração de PDF
├── firebase/           # Configuração Firebase
├── utils/              # Utilitários
│   ├── mensagemConvite.js
│   ├── mensagemConfirmacao.js
│   ├── pronome.js
│   └── temposOradores.js
├── styles/             # Estilos CSS
└── App.jsx            # Componente principal
```

### Scripts Disponíveis
```bash
npm start          # Servidor de desenvolvimento
npm run build      # Build para produção
npm test           # Executar testes
npm run deploy     # Deploy para Firebase
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma [Issue](https://github.com/seu-usuario/actasync/issues)
- Entre em contato pelo email: [seu-email@exemplo.com]

## 🙏 Agradecimentos

- Desenvolvido para auxiliar no trabalho administrativo das Alas
- Inspirado na necessidade de digitalizar e otimizar o processo de atas sacramentais
- Construído com ❤️ para a comunidade

---

**ActaSync** - Simplificando a gestão de atas sacramentais 📘✨