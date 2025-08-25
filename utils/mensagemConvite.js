/**
 * Gera o texto motivacional para o convite de orador.
 * @param {string} nome - O nome do orador.
 * @param {string} pronome - O pronome de tratamento (Ex: 'irmã', 'presidente').
 * @param {string} tema - O tema do discurso.
 * @param {string} tempo - O tempo de discurso sugerido.
 * @param {string} data - A data da reunião sacramental.
 * @param {string} linkEstudo - Link opcional para material de estudo.
 * @returns {string} A mensagem de convite formatada.
 */
export const gerarMensagemConvite = (nome, pronome, tema, tempo, data, linkEstudo) => {
  let mensagem = `Olá, ${nome}.

Este é um convite para compartilhar sua fé na Reunião Sacramental do dia ${data}.

Estamos felizes em convidá-lo(a) para discursar sobre o tema: "${tema}".

O tempo sugerido para a sua fala é de aproximadamente ${tempo}.

Lembre-se que o evangelho é simples e o Espírito Santo pode nos guiar na preparação.
O Bispo confia em sua capacidade de edificar a congregação.

Agradecemos por seu serviço e disposição.`;

  // Adiciona o link de estudo se ele existir
  if (linkEstudo) {
    mensagem += `\n\nLink para estudo: ${linkEstudo}`;
  }

  return mensagem;
};