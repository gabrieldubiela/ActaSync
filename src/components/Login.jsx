import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebase-config'; // Importe a instância do app do seu arquivo de configuração
import '../style.css'; // Opcional, para estilização básica

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
      // Trata o email e a senha para remover espaços em branco
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      console.log('Login bem-sucedido!');
      // Redirecionar para a Dashboard, a navegação é tratada no App.jsx
    } catch (error) {
      console.error('Erro no login:', error.code, error.message);
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha incorretos.');
          break;
        case 'auth/invalid-email':
          setError('O formato do e-mail é inválido.');
          break;
        case 'auth/user-disabled':
          setError('Esta conta de usuário foi desativada.');
          break;
        default:
          setError('Ocorreu um erro no login. Tente novamente mais tarde.');
      }
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
