import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Suas credenciais do projeto Firebase
// Você pode encontrá-las no console do Firebase, em Configurações do Projeto
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o aplicativo Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta os serviços do banco de dados e autenticação
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };