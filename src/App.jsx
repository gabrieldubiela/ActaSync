import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase-config';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Calendario from './components/Calendario';
import AtaForm from './components/AtaForm';
import Membros from './components/Membros';
import Hinos from './components/Hinos';

// Styles
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState({ ala: '', estaca: '' });

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Load configuration
    loadConfig();

    return () => unsubscribe();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/config.json');
      const configData = await response.json();
      setConfig(configData);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  if (loading) {
    return (
      <ChakraProvider>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando ActaSync...</p>
        </div>
      </ChakraProvider>
    );
  }

  if (!user) {
    return (
      <ChakraProvider>
        <Login />
      </ChakraProvider>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard config={config} />;
      case 'calendario':
        return <Calendario config={config} />;
      case 'atas':
        return <AtaForm config={config} />;
      case 'membros':
        return <Membros />;
      case 'hinos':
        return <Hinos />;
      default:
        return <Dashboard config={config} />;
    }
  };

  return (
    <ChakraProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>📘 ActaSync</h1>
            <p>{config.ala} - {config.estaca}</p>
            <div className="user-info">
              <span>Bem-vindo, {user.displayName || user.email}</span>
              <button 
                className="logout-btn"
                onClick={() => auth.signOut()}
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            🏠 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'calendario' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendario')}
          >
            📅 Calendário
          </button>
          <button 
            className={`nav-tab ${activeTab === 'atas' ? 'active' : ''}`}
            onClick={() => setActiveTab('atas')}
          >
            📄 Atas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'membros' ? 'active' : ''}`}
            onClick={() => setActiveTab('membros')}
          >
            👥 Membros
          </button>
          <button 
            className={`nav-tab ${activeTab === 'hinos' ? 'active' : ''}`}
            onClick={() => setActiveTab('hinos')}
          >
            🎵 Hinos
          </button>
        </nav>

        <main className="main-content">
          {renderTabContent()}
        </main>
      </div>
    </ChakraProvider>
  );
}

export default App;