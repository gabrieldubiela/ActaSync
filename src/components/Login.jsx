import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebase-config'; // Importe a instância do app do seu arquivo de configuração
import './Login.css'; // Opcional, para estilização básica

// Inicializa a autenticação
const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido!');
      // Redirecionar para a Dashboard
    } catch (error) {
      console.error('Erro no login:', error.code, error.message);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <h2>Atas Sacramentais</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;