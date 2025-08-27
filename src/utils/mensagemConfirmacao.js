/**
 * Gera o texto de confirmação para o orador.
 * @param {string} nome - O nome do orador.
 * @param {string} pronome - O pronome de tratamento (Ex: 'irmão', 'irmã').
 * @returns {string} A mensagem de confirmação formatada.
 */
export const gerarMensagemConfirmacao = (nome, pronome) => {
  return `Olá, ${nome}.

Este é um lembrete sobre seu convite para discursar.

Você confirma a sua participação na Reunião Sacramental?`;
};