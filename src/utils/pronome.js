/**
 * Função para gerar pronome automático baseado no chamado ou classificação
 * @param {Object} membro - Objeto do membro com chamado e classificação
 * @returns {string} - Pronome apropriado
 */
export const getPronome = (membro) => {
  if (!membro) return '';

  const { chamado = '', classificacao = '' } = membro;
  const chamadoLower = chamado.toLowerCase();

  // Pronomes baseados no chamado
  if (chamadoLower.includes('presidente da estaca') || 
      chamadoLower.includes('conselheiro da estaca')) {
    return 'presidente';
  }
  
  if (chamadoLower.includes('bispo')) {
    return 'bispo';
  }
  
  if (chamadoLower.includes('presidente')) {
    return 'presidente';
  }

  // Pronomes baseados na classificação
  switch (classificacao.toLowerCase()) {
    case 'homem':
    case 'rapaz':
    case 'menino':
      return 'irmão';
    case 'mulher':
    case 'moça':
    case 'menina':
      return 'irmã';
    default:
      return 'irmão'; // padrão
  }
};

/**
 * Função simplificada que aceita apenas uma string (nome com chamado)
 * @param {string} nomeCompleto - Nome completo ou nome com chamado
 * @returns {string} - Pronome apropriado
 */
export const getPronomeSimples = (nomeCompleto) => {
  if (!nomeCompleto) return '';
  
  const texto = nomeCompleto.toLowerCase();
  
  if (texto.includes('presidente da estaca') || 
      texto.includes('conselheiro da estaca')) {
    return 'presidente';
  }
  
  if (texto.includes('bispo')) {
    return 'bispo';
  }
  
  if (texto.includes('presidente')) {
    return 'presidente';
  }

  return 'irmão'; // padrão
};