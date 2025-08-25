import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, setDoc, doc, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const Membros = () => {
  const [membros, setMembros] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sexoFiltro, setSexoFiltro] = useState('todos');
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [novoMembro, setNovoMembro] = useState({
    nome: '',
    chamado_id: '',
    classificacao: '',
    data_ultimo_discurso: null
  });

  useEffect(() => {
    // Consulta inicial para obter todos os membros
    const q = query(collection(db, "Membros"), orderBy("nome"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membrosLista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembros(membrosLista);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoMembro(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (membroSelecionado) {
        // Atualiza um membro existente
        await setDoc(doc(db, "Membros", membroSelecionado.id), novoMembro);
      } else {
        // Adiciona um novo membro
        await addDoc(collection(db, "Membros"), novoMembro);
      }
      setNovoMembro({ nome: '', chamado_id: '', classificacao: '', data_ultimo_discurso: null });
      setMembroSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar o membro: ", error);
    }
  };

  const handleEdit = (membro) => {
    setMembroSelecionado(membro);
    setNovoMembro(membro);
  };

  // Filtra e pesquisa os membros em tempo real
  const membrosFiltrados = membros.filter(membro => {
    const nomeCorresponde = membro.nome.toLowerCase().includes(filtro.toLowerCase());
    const sexoCorresponde = sexoFiltro === 'todos' || membro.classificacao === sexoFiltro;
    return nomeCorresponde && sexoCorresponde;
  });

  return (
    <div className="membros-container">
      <h2>Membros da Ala</h2>

      {/* Formulário de Cadastro/Edição */}
      <form onSubmit={handleSubmit}>
        <h3>{membroSelecionado ? "Editar Membro" : "Cadastrar Novo Membro"}</h3>
        <input
          type="text"
          name="nome"
          value={novoMembro.nome}
          onChange={handleInputChange}
          placeholder="Nome Completo"
          required
        />
        <input
          type="text"
          name="chamado_id"
          value={novoMembro.chamado_id}
          onChange={handleInputChange}
          placeholder="Chamado (opcional)"
        />
        <select
          name="classificacao"
          value={novoMembro.classificacao}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione a Classificação</option>
          <option value="homem">Homem</option>
          <option value="mulher">Mulher</option>
          <option value="rapaz">Rapaz</option>
          <option value="moça">Moça</option>
          <option value="menino">Menino</option>
          <option value="menina">Menina</option>
        </select>
        <button type="submit">Salvar</button>
        {membroSelecionado && (
          <button type="button" onClick={() => setMembroSelecionado(null)}>Cancelar</button>
        )}
      </form>

      {/* Busca e Filtros */}
      <div className="filtros">
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nome..."
        />
        <select value={sexoFiltro} onChange={(e) => setSexoFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="homem">Homem</option>
          <option value="mulher">Mulher</option>
          <option value="rapaz">Rapaz</option>
          <option value="moça">Moça</option>
          <option value="menino">Menino</option>
          <option value="menina">Menina</option>
        </select>
      </div>

      {/* Listagem de Membros */}
      <ul className="membros-lista">
        {membrosFiltrados.map(membro => (
          <li key={membro.id}>
            {membro.nome} - {membro.classificacao} - {membro.chamado_id}
            <button onClick={() => handleEdit(membro)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Membros;