/**
 * Tempos de discurso por posição do orador
 */
export const temposOradores = {
  1: 8,  // Primeiro orador: 8 minutos
  2: 12, // Segundo orador: 12 minutos
  3: 15, // Terceiro/Último orador: 15 minutos
  4: 15  // Quarto orador (quando houver): 15 minutos
};

/**
 * Retorna o tempo de discurso para uma posição específica
 * @param {number} posicao - Posição do orador (1, 2, 3, 4)
 * @returns {number} - Tempo em minutos
 */
export const getTempoOrador = (posicao) => {
  return temposOradores[posicao] || 10; // padrão 10 minutos
};

/**
 * Retorna o texto da posição do orador
 * @param {number} posicao - Posição do orador
 * @param {number} totalOradores - Total de oradores
 * @returns {string} - Texto da posição
 */
export const getPosicaoTexto = (posicao, totalOradores) => {
  if (posicao === totalOradores) {
    return 'Último Orador';
  }
  
  const posicoes = {
    1: 'Primeiro Orador',
    2: 'Segundo Orador',
    3: 'Terceiro Orador',
    4: 'Quarto Orador'
  };
  
  return posicoes[posicao] || `${posicao}º Orador`;
};