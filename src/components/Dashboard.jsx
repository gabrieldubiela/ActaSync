import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const Dashboard = () => {
  const [proximoDomingo, setProximoDomingo] = useState(null);
  const [ultimasAtas, setUltimasAtas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Consulta para o próximo domingo
    const qProximoDomingo = query(
      collection(db, "Calendario Sacramental"),
      where("data", ">=", new Date()),
      orderBy("data"),
      limit(1)
    );

    const unsubscribeProximoDomingo = onSnapshot(qProximoDomingo, (snapshot) => {
      const proximo = snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
      setProximoDomingo(proximo);
    });

    // Consulta para as últimas atas
    const qUltimasAtas = query(
      collection(db, "Atas"),
      orderBy("data", "desc"),
      limit(5)
    );

    const unsubscribeUltimasAtas = onSnapshot(qUltimasAtas, (snapshot) => {
      const atas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUltimasAtas(atas);
      setCarregando(false);
    });

    // Limpa os listeners quando o componente é desmontado
    return () => {
      unsubscribeProximoDomingo();
      unsubscribeUltimasAtas();
    };
  }, []);

  if (carregando) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="resumo-proximo-domingo">
        <h3>Próxima Reunião Sacramental</h3>
        {proximoDomingo ? (
          <div>
            <p>Data: {proximoDomingo.data.toDate().toLocaleDateString('pt-BR')}</p>
            <p>Tema: {proximoDomingo.tema}</p>
            <h4>Oradores:</h4>
            <ul>
              {proximoDomingo.oradores.map((orador, index) => (
                <li key={index}>{orador.nome_manual || orador.membro_id}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Nenhuma reunião sacramental agendada em breve.</p>
        )}
      </div>

      <div className="ultimas-atas-recentes">
        <h3>Últimas Atas</h3>
        <ul>
          {ultimasAtas.map((ata) => (
            <li key={ata.id}>
              Ata de {ata.data.toDate().toLocaleDateString('pt-BR')} - {ata.tema_geral}
            </li>
          ))}
        </ul>
      </div>

      {/* Botões rápidos */}
      <div className="botoes-rapidos">
        <button onClick={() => console.log('Navegar para criar nova ata')}>
          Criar Nova Ata
        </button>
        <button onClick={() => console.log('Navegar para o calendário')}>
          Visualizar Calendário
        </button>
      </div>
    </div>
  );
};

export default Dashboard;