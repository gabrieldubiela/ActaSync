#!/usr/bin/env node

/**
 * Script para configurar o arquivo .env interativamente
 * Execute com: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

async function setupEnv() {
  console.log('🔥 Configuração do Firebase para ActaSync\n');
  console.log('Para obter essas informações:');
  console.log('1. Acesse https://console.firebase.google.com');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá em "Configurações do projeto" > "Geral"');
  console.log('4. Na seção "Seus aplicativos", clique no ícone da web (</>)');
  console.log('5. Copie as informações de configuração\n');

  try {
    // Verificar se .env já existe
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  Arquivo .env já existe. Deseja sobrescrever? (s/N): ');
      if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'sim') {
        console.log('Configuração cancelada.');
        rl.close();
        return;
      }
    }

    // Coletar informações do Firebase
    const apiKey = await question('🔑 Firebase API Key: ');
    const authDomain = await question('🌐 Firebase Auth Domain (ex: projeto.firebaseapp.com): ');
    const databaseURL = await question('🗄️  Firebase Database URL (ex: https://projeto-default-rtdb.firebaseio.com): ');
    const projectId = await question('📁 Firebase Project ID: ');
    const storageBucket = await question('🪣 Firebase Storage Bucket (ex: projeto.appspot.com): ');
    const messagingSenderId = await question('📨 Firebase Messaging Sender ID: ');
    const appId = await question('📱 Firebase App ID: ');

    console.log('\n📍 Configurações da Ala/Estaca:');
    const alaName = await question('⛪ Nome da Ala (ex: Ala São Paulo Centro): ');
    const estacaName = await question('🏛️  Nome da Estaca (ex: Estaca São Paulo Sul): ');

    // Criar conteúdo do .env
    const envContent = `# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=${apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${authDomain}
REACT_APP_FIREBASE_DATABASE_URL=${databaseURL}
REACT_APP_FIREBASE_PROJECT_ID=${projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${appId}

# App Configuration
REACT_APP_ALA_NAME=${alaName}
REACT_APP_ESTACA_NAME=${estacaName}
`;

    // Salvar arquivo .env
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Arquivo .env criado com sucesso!');
    console.log('\n🚀 Próximos passos:');
    console.log('1. Execute: npm install');
    console.log('2. Execute: npm start');
    console.log('3. Acesse: http://localhost:3000');
    console.log('\n📚 Para mais informações, consulte o README.md');

  } catch (error) {
    console.error('\n❌ Erro ao configurar .env:', error.message);
  } finally {
    rl.close();
  }
}

// Verificar se o arquivo .env.example existe
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ Arquivo .env.example não encontrado!');
  console.log('Execute este script na raiz do projeto ActaSync.');
  process.exit(1);
}

setupEnv();