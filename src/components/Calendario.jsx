import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { getTempoDiscurso } from '../utils/temposOradores.js';
import { gerarMensagemConvite } from '../utils/mensagemConvite.js';
import { gerarMensagemConfirmacao } from '../utils/mensagemConfirmacao.js';

const Calendario = () => {
  const [domingos, setDomingos] = useState([]);

  useEffect(() => {
    // Consulta para pegar os próximos 12 domingos, ordenados por data
    const q = query(
      collection(db, "Calendario Sacramental"),
      orderBy("data"),
      where("data", ">=", new Date())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const domingosLista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDomingos(domingosLista);
    });

    return () => unsubscribe();
  }, []);

  const handleGerarMensagemConvite = (orador, calendario) => {
    // Lógica para gerar a mensagem de convite
    const tempo = getTempoDiscurso(orador.posicao, calendario.oradores.length);
    const mensagem = gerarMensagemConvite(
      orador.nome_manual || "Nome do Membro", // Lógica para pegar o nome
      "irmão", // Lógica para pegar o pronome
      orador.subtema,
      tempo,
      calendario.data.toDate().toLocaleDateString('pt-BR'),
      orador.link_estudos
    );
    // Aqui você pode adicionar a lógica para copiar, compartilhar, etc.
    alert(mensagem); // Exemplo simples
  };

  const handleGerarMensagemConfirmacao = (orador) => {
    const mensagem = gerarMensagemConfirmacao(
      orador.nome_manual || "Nome do Membro", // Lógica para pegar o nome
      "irmão" // Lógica para pegar o pronome
    );
    alert(mensagem); // Exemplo simples
  };

  return (
    <div className="calendario-container">
      <h2>Calendário Sacramental</h2>
      {domingos.map(domingo => (
        <div key={domingo.id} className="domingo-card">
          <h3>Reunião do dia {domingo.data.toDate().toLocaleDateString('pt-BR')}</h3>
          <p>Tema Geral: {domingo.tema}</p>
          <ul>
            {domingo.oradores && domingo.oradores.map((orador, index) => (
              <li key={index}>
                <strong>Orador {index + 1}:</strong> {orador.nome_manual || orador.membro_id}
                <br />
                <em>Subtema:</em> {orador.subtema || "Não definido"}
                <br />
                <em>Tempo:</em> {getTempoDiscurso(index + 1, domingo.oradores.length)}
                <div className="menu-acoes">
                  <button onClick={() => handleGerarMensagemConvite(orador, domingo)}>
                    Convite
                  </button>
                  <button onClick={() => handleGerarMensagemConfirmacao(orador)}>
                    Confirmação
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Calendario;