import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Membros from './components/Membros';
import Hinos from './components/Hinos';
import Calendario from './components/Calendario';
import AtaForm from './components/AtaForm';
import { app } from './firebase/firebase-config'; // Importe a instância do app

const auth = getAuth(app);

const NavLogged = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/calendario">Calendário</Link>
      <Link to="/membros">Membros</Link>
      <Link to="/hinos">Hinos</Link>
      <button onClick={handleLogout}>Sair</button>
    </nav>
  );
};

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUsuario(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        {usuario ? <NavLogged /> : null}
        <Routes>
          <Route path="/login" element={<Login />} />
          {usuario ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/membros" element={<Membros />} />
              <Route path="/hinos" element={<Hinos />} />
              <Route path="/ata/:id?" element={<AtaForm />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;