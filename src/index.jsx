import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Importa seu arquivo de estilos

// Cria um "root" para o React renderizar o app.
// 'root' é um elemento HTML que deve existir no seu arquivo public/index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o componente App dentro do StrictMode
// que ajuda a encontrar problemas potenciais no código.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);