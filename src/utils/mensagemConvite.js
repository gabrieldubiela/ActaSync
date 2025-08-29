import { getPronome } from './pronome';
import { getTempoOrador } from './temposOradores';

/**
 * Gera mensagem de convite para orador
 * @param {Object} orador - Dados do orador
 * @param {Object} reuniao - Dados da reunião
 * @param {Object} config - Configurações da ala/estaca
 * @returns {string} - Mensagem de convite formatada
 */
export const gerarMensagemConvite = (orador, reuniao, config = {}) => {
  const pronome = orador.membro ? getPronome(orador.membro) : 'irmão';
  const nome = orador.nome_manual || orador.membro?.nome || orador.nome;
  const dataFormatada = new Date(reuniao.data).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const tempo = getTempoOrador(orador.posicao);
  const ala = config.ala || 'Nossa Ala';

  let mensagem = `Prezado ${pronome} ${nome},

Paz do Senhor!

Você está sendo convidado(a) para discursar na reunião sacramental.

📅 **Data:** ${dataFormatada}
🎯 **Tema Geral:** ${reuniao.tema_geral}
📝 **Seu Subtema:** ${orador.subtema}
⏰ **Tempo:** ${tempo} minutos
📍 **Local:** ${ala}

Sugerimos que prepare sua mensagem com oração e estudo das escrituras, buscando a orientação do Espírito Santo.`;

  if (orador.link_estudo) {
    mensagem += `

🔗 **Material de Estudo:** ${orador.link_estudo}`;
  }

  mensagem += `

Que o Senhor o(a) abençoe na preparação desta importante mensagem.

Com gratidão,
Bispado da ${ala}`;

  return mensagem;
};

/**
 * Gera mensagem de convite simplificada (para WhatsApp)
 * @param {Object} orador - Dados do orador
 * @param {Object} reuniao - Dados da reunião
 * @returns {string} - Mensagem simplificada
 */
export const gerarMensagemConviteSimples = (orador, reuniao) => {
  const pronome = orador.membro ? getPronome(orador.membro) : 'irmão';
  const nome = orador.nome_manual || orador.membro?.nome || orador.nome;
  const dataFormatada = new Date(reuniao.data).toLocaleDateString('pt-BR');
  const tempo = getTempoOrador(orador.posicao);

  return `${pronome} ${nome}, você está convidado(a) para discursar na reunião sacramental de ${dataFormatada}. Tema: "${orador.subtema}". Tempo: ${tempo} min. Que Deus o(a) abençoe! 🙏`;
};