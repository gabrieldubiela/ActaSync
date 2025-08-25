import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import config from '../config.json'; // Importa a configuração local
import { getPronome } from '../utils/pronome'; // Importa a função de pronome
import './AtaForm.css'; // Estilização opcional

const AtaForm = ({ ataId }) => {
  const [ata, setAta] = useState({
    data: '',
    tema_geral: '',
    quem_preside: '',
    quem_dirige: '',
    preludio: '',
    pianista: '',
    regente: '',
    hino_abertura_id: '',
    oracao_abertura: '',
    hino_sacramental_id: '',
    hino_intermediario_id: '',
    hino_final_id: '',
    oracao_final: '',
    oradores: [
      { nome_manual: '', subtema: '', habilitado: true },
      { nome_manual: '', subtema: '', habilitado: true },
      { nome_manual: '', subtema: '', habilitado: true },
    ],
    apoios: [],
    anuncios: [],
    reuniao_testemunhos: false,
    reuniao_cancelada: false,
    motivo_cancelamento: '',
  });

  const [modoEdicao, setModoEdicao] = useState(true);
  const [membros, setMembros] = useState([]);
  const [hinos, setHinos] = useState([]);

  useEffect(() => {
    // Carrega dados iniciais do Firestore (membros e hinos) para o autocomplete
    const qMembros = query(collection(db, "Membros"));
    const qHinos = query(collection(db, "Hinos"));

    const unsubscribeMembros = onSnapshot(qMembros, (snapshot) => {
      const membrosLista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembros(membrosLista);
    });

    const unsubscribeHinos = onSnapshot(qHinos, (snapshot) => {
      const hinosLista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHinos(hinosLista);
    });

    return () => {
      unsubscribeMembros();
      unsubscribeHinos();
    };
  }, []);

  useEffect(() => {
    // Carrega a ata se um ID for fornecido (para edição)
    if (ataId) {
      const docRef = doc(db, "Atas", ataId);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setAta({ ...doc.data(), data: doc.data().data.toDate() });
        }
      });
      return () => unsubscribe();
    }
  }, [ataId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAta(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOradorChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const novosOradores = [...ata.oradores];
    novosOradores[index] = {
      ...novosOradores[index],
      [name]: type === 'checkbox' ? checked : value,
    };
    setAta(prev => ({ ...prev, oradores: novosOradores }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ataId) {
        // Atualiza uma ata existente
        await setDoc(doc(db, "Atas", ataId), ata);
      } else {
        // Cria uma nova ata (lógica para adicionar)
        const novaAtaRef = doc(collection(db, "Atas"));
        await setDoc(novaAtaRef, ata);
      }
      alert('Ata salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar ata:', error);
    }
  };
  
  // Exemplo de como usar a função de pronome e autocomplete
  const getNomeOrador = (orador) => {
    if (orador.membro_id) {
      const membro = membros.find(m => m.id === orador.membro_id);
      return `${getPronome(membro?.chamado_id, membro?.classificacao)} ${membro?.nome}`;
    }
    return orador.nome_manual;
  };

  return (
    <div className="ata-form-container">
      <h2>Formulário de Ata - Ala {config.nome_da_ala}</h2>
      <button onClick={() => setModoEdicao(!modoEdicao)}>
        {modoEdicao ? 'Mudar para Modo Leitura' : 'Mudar para Modo Edição'}
      </button>

      <form onSubmit={handleSubmit}>
        {/* Seção de Informações da Reunião */}
        <section>
          <h3>Detalhes da Reunião</h3>
          <input type="date" name="data" value={ata.data} onChange={handleInputChange} disabled={!modoEdicao} required />
          <input type="text" name="tema_geral" value={ata.tema_geral} onChange={handleInputChange} placeholder="Tema Geral" disabled={!modoEdicao} />
          {/* Outros campos... */}
        </section>

        {/* Seção de Hinos e Orações */}
        <section>
          <h3>Hinos e Orações</h3>
          {/* Autocomplete para Hinos */}
        </section>

        {/* Seção de Oradores */}
        <section>
          <h3>Oradores</h3>
          {ata.oradores.map((orador, index) => (
            <div key={index}>
              <h4>Orador {index + 1}</h4>
              <input
                type="text"
                name="nome_manual"
                value={getNomeOrador(orador)}
                onChange={(e) => handleOradorChange(index, e)}
                placeholder="Nome do Orador"
                disabled={!modoEdicao}
              />
              <input
                type="text"
                name="subtema"
                value={orador.subtema}
                onChange={(e) => handleOradorChange(index, e)}
                placeholder="Subtema"
                disabled={!modoEdicao}
              />
              <label>
                Habilitado:
                <input
                  type="checkbox"
                  name="habilitado"
                  checked={orador.habilitado}
                  onChange={(e) => handleOradorChange(index, e)}
                  disabled={!modoEdicao}
                />
              </label>
            </div>
          ))}
        </section>

        {/* Outras seções como Apoios e Anúncios */}
        <section>
          {/* Lógica para adicionar Apoios/Anúncios */}
        </section>

        <button type="submit" disabled={!modoEdicao}>
          {ataId ? 'Atualizar Ata' : 'Salvar Ata'}
        </button>
      </form>
    </div>
  );
};

export default AtaForm;