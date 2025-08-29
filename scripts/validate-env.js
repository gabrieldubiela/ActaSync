#!/usr/bin/env node

/**
 * Script para validar as variáveis de ambiente
 * Execute com: node scripts/validate-env.js ou npm run validate-env
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

// Variáveis obrigatórias
const requiredVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_ALA_NAME',
  'REACT_APP_ESTACA_NAME'
];

// Variáveis opcionais (com valores padrão no código)
const optionalVars = [
  'REACT_APP_FIREBASE_DATABASE_URL',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

function validateEnv() {
  console.log('🔍 Validando arquivo .env...\n');

  // Verificar se .env existe
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env não encontrado!');
    console.log('\n💡 Para criar o arquivo .env:');
    console.log('1. Execute: npm run setup-env');
    console.log('2. Ou copie .env.example para .env e preencha os valores');
    process.exit(1);
  }

  // Carregar variáveis do .env
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });

  // Verificar variáveis obrigatórias
  const missingRequired = requiredVars.filter(varName => !envVars[varName]);
  const missingOptional = optionalVars.filter(varName => !envVars[varName]);

  if (missingRequired.length > 0) {
    console.error('❌ Variáveis obrigatórias não encontradas:');
    missingRequired.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.log('\n💡 Execute: npm run setup-env para configurar');
    process.exit(1);
  }

  // Validar formatos específicos
  const validations = [
    {
      var: 'REACT_APP_FIREBASE_AUTH_DOMAIN',
      test: (value) => value.includes('.firebaseapp.com'),
      message: 'deve terminar com .firebaseapp.com'
    },
    {
      var: 'REACT_APP_FIREBASE_DATABASE_URL',
      test: (value) => !value || value.startsWith('https://'),
      message: 'deve começar com https://'
    },
    {
      var: 'REACT_APP_FIREBASE_STORAGE_BUCKET',
      test: (value) => !value || value.includes('.appspot.com'),
      message: 'deve terminar com .appspot.com'
    }
  ];

  const validationErrors = [];
  validations.forEach(({ var: varName, test, message }) => {
    const value = envVars[varName];
    if (value && !test(value)) {
      validationErrors.push(`${varName} ${message}`);
    }
  });

  if (validationErrors.length > 0) {
    console.error('❌ Erros de formato nas variáveis:');
    validationErrors.forEach(error => {
      console.error(`   - ${error}`);
    });
    process.exit(1);
  }

  // Relatório de sucesso
  console.log('✅ Arquivo .env válido!');
  console.log(`\n📊 Variáveis encontradas:`);
  console.log(`   ✅ Obrigatórias: ${requiredVars.length - missingRequired.length}/${requiredVars.length}`);
  console.log(`   📝 Opcionais: ${optionalVars.length - missingOptional.length}/${optionalVars.length}`);

  if (missingOptional.length > 0) {
    console.log(`\n⚠️  Variáveis opcionais não configuradas:`);
    missingOptional.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('   (O sistema funcionará com valores padrão)');
  }

  console.log(`\n🏛️  Configuração da organização:`);
  console.log(`   📍 Ala: ${envVars['REACT_APP_ALA_NAME']}`);
  console.log(`   🏛️  Estaca: ${envVars['REACT_APP_ESTACA_NAME']}`);
  
  console.log('\n🚀 Pronto para executar o projeto!');
  console.log('   Execute: npm start');
}

validateEnv();