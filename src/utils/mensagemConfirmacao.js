import { getPronome } from './pronome';

/**
 * Gera mensagem de confirmação para orador
 * @param {Object} orador - Dados do orador
 * @param {Object} reuniao - Dados da reunião
 * @param {Object} config - Configurações da ala/estaca
 * @returns {string} - Mensagem de confirmação formatada
 */
export const gerarMensagemConfirmacao = (orador, reuniao, config = {}) => {
  const pronome = orador.membro ? getPronome(orador.membro) : 'irmão';
  const nome = orador.nome_manual || orador.membro?.nome || orador.nome;
  const dataFormatada = new Date(reuniao.data).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  
  const ala = config.ala || 'Nossa Ala';

  const mensagem = `${pronome} ${nome},

Por favor, confirme sua participação na reunião sacramental de ${dataFormatada}.

📝 **Seu subtema:** ${orador.subtema}

Responda com:
✅ **SIM** - se poderá participar
❌ **NÃO** - se não poderá participar

Aguardamos sua confirmação até quinta-feira.

Obrigado!
Bispado da ${ala}`;

  return mensagem;
};

/**
 * Gera mensagem de confirmação simplificada (para WhatsApp)
 * @param {Object} orador - Dados do orador
 * @param {Object} reuniao - Dados da reunião
 * @returns {string} - Mensagem simplificada
 */
export const gerarMensagemConfirmacaoSimples = (orador, reuniao) => {
  const pronome = orador.membro ? getPronome(orador.membro) : 'irmão';
  const nome = orador.nome_manual || orador.membro?.nome || orador.nome;
  const dataFormatada = new Date(reuniao.data).toLocaleDateString('pt-BR');

  return `${pronome} ${nome}, confirme sua participação na reunião sacramental de ${dataFormatada}. Subtema: "${orador.subtema}". Responda SIM ou NÃO. Obrigado!`;
};