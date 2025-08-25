/**
 * Retorna o tempo de fala sugerido para um orador com base em sua posição.
 * @param {number} posicao - A posição do orador na lista (1, 2, 3, etc.).
 * @param {number} totalOradores - O número total de oradores na reunião.
 * @returns {string} O tempo de fala em formato de texto. Ex: '10-12 minutos'.
 */
export const getTempoDiscurso = (posicao, totalOradores) => {
  if (totalOradores === 3) {
    if (posicao === 1) {
      return '8-10 minutos';
    }
    if (posicao === 2) {
      return '10-12 minutos';
    }
    if (posicao === 3) {
      return '12-15 minutos';
    }
  }

  if (totalOradores === 4) {
    if (posicao === 1) {
      return '5-7 minutos';
    }
    if (posicao === 2) {
      return '7-9 minutos';
    }
    if (posicao === 3) {
      return '8-10 minutos';
    }
    if (posicao === 4) {
      return '10-12 minutos';
    }
  }

  // Retorna um valor padrão ou uma mensagem de erro se a lógica não se aplicar
  return 'Tempo não definido';
};