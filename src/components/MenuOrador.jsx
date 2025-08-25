import React from 'react';
import { geradorMensagemConvite } from '../utils/mensagemConvite';
import { geradorMensagemConfirmacao } from '../utils/mensagemConfirmacao';
import { getTempoDiscurso } from '../utils/temposOradores';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerator from './PDFGenerator';

const MenuOrador = ({ orador, calendario, onCancelar }) => {
  const handleCompartilhar = (mensagem) => {
    if (navigator.share) {
      navigator.share({
        title: 'Convite para Discurso',
        text: mensagem,
      }).catch(error => console.error('Erro ao compartilhar:', error));
    } else {
      alert('Seu navegador não suporta a API de compartilhamento. Copie a mensagem manualmente.');
      navigator.clipboard.writeText(mensagem).then(() => {
        alert('Mensagem copiada para a área de transferência!');
      });
    }
  };

  const handleGerarConvite = () => {
    const tempo = getTempoDiscurso(orador.posicao, calendario.oradores.length);
    const mensagem = geradorMensagemConvite(
      orador.nome_manual || "Nome do Membro",
      "irmão",
      orador.subtema,
      tempo,
      calendario.data.toDate().toLocaleDateString('pt-BR'),
      orador.link_estudos
    );
    handleCompartilhar(mensagem);
  };

  const handleGerarConfirmacao = () => {
    const mensagem = geradorMensagemConfirmacao(
      orador.nome_manual || "Nome do Membro",
      "irmão"
    );
    handleCompartilhar(mensagem);
  };

  return (
    <div className="menu-orador-container">
      <h3>Opções para {orador.nome_manual}</h3>
      <button onClick={handleGerarConvite}>Gerar Convite</button>
      <button onClick={handleGerarConfirmacao}>Gerar Confirmação</button>

      {/* Botão de download do PDF, visível apenas no convite */}
      {orador.link_estudos && (
        <PDFDownloadLink
          document={<PDFGenerator ata={{ ...calendario, oradores: [orador] }} />}
          fileName={`convite-${orador.nome_manual}.pdf`}
        >
          {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar PDF do Convite')}
        </PDFDownloadLink>
      )}

      {/* Botão de Cancelamento de Discurso (opcional) */}
      <button onClick={onCancelar}>Cancelar Discurso</button>
    </div>
  );
};

export default MenuOrador;