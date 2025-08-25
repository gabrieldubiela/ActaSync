/**
 * Retorna o pronome de tratamento apropriado com base no chamado ou classificação.
 * @param {string} chamado - O chamado do membro. Ex: 'Bispo', 'Presidente da Primária'.
 * @param {string} classificacao - A classificação do membro. Ex: 'homem', 'mulher'.
 * @returns {string} O pronome de tratamento. Ex: 'Bispo', 'presidente', 'irmão', 'irmã'.
 */
export const getPronome = (chamado, classificacao) => {
  if (chamado) {
    // Regras para chamados específicos que têm pronome próprio
    const chamadosEspeciais = [
      'Presidente de Estaca',
      'Conselheiro da Estaca',
      'Presidente da Primária',
      'Presidente da Sociedade de Socorro',
    ];

    // Se o chamado estiver na lista de chamados especiais, usa 'presidente'
    if (chamadosEspeciais.some(c => chamado.includes(c))) {
      return 'presidente';
    }
    
    // Regra específica para o Bispo
    if (chamado.includes('Bispo')) {
      return 'Bispo';
    }
  }

  // Regras baseadas na classificação do membro
  if (classificacao) {
    if (['homem', 'rapaz', 'menino'].includes(classificacao)) {
      return 'irmão';
    }
    if (['mulher', 'moça', 'menina'].includes(classificacao)) {
      return 'irmã';
    }
  }

  // Retorna uma string vazia caso não haja chamado ou classificação válidos
  return '';
};