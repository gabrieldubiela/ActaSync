import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, doc, setDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const Hinos = () => {
  const [hinos, setHinos] = useState([]);
  const [busca, setBusca] = useState('');
  const [novoHino, setNovoHino] = useState({
    numero: '',
    titulo: ''
  });
  const [hinoSelecionado, setHinoSelecionado] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "Hinos"), orderBy("numero"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hinosLista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHinos(hinosLista);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoHino(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (hinoSelecionado) {
        await setDoc(doc(db, "Hinos", hinoSelecionado.id), novoHino);
      } else {
        await addDoc(collection(db, "Hinos"), novoHino);
      }
      setNovoHino({ numero: '', titulo: '' });
      setHinoSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar o hino: ", error);
    }
  };

  const handleEdit = (hino) => {
    setHinoSelecionado(hino);
    setNovoHino(hino);
  };

  const hinosFiltrados = hinos.filter(hino =>
    hino.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    String(hino.numero).includes(busca)
  );

  return (
    <div className="hinos-container">
      <h2>Hinos</h2>

      {/* Formulário de Cadastro/Edição de Hinos */}
      <form onSubmit={handleSubmit}>
        <h3>{hinoSelecionado ? "Editar Hino" : "Cadastrar Novo Hino"}</h3>
        <input
          type="number"
          name="numero"
          value={novoHino.numero}
          onChange={handleInputChange}
          placeholder="Número do Hino"
          required
        />
        <input
          type="text"
          name="titulo"
          value={novoHino.titulo}
          onChange={handleInputChange}
          placeholder="Título do Hino"
          required
        />
        <button type="submit">Salvar</button>
        {hinoSelecionado && (
          <button type="button" onClick={() => setHinoSelecionado(null)}>Cancelar</button>
        )}
      </form>

      {/* Busca */}
      <div className="busca-hinos">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por número ou título..."
        />
      </div>

      {/* Lista de Hinos */}
      <ul className="hinos-lista">
        {hinosFiltrados.map(hino => (
          <li key={hino.id}>
            {hino.numero} - {hino.titulo}
            <button onClick={() => handleEdit(hino)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hinos;