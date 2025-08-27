export const TEMPOS_ORADORES = {
  1: 7,
  2: 10,
  3: 12,
  4: 5,
  ultimo: 12
}

export function tempoParaPosicao(posicao, totalOradores = 3) {
  if (posicao === 'ultimo') return TEMPOS_ORADORES.ultimo
  return TEMPOS_ORADORES[posicao] ?? (totalOradores >= 4 ? 5 : 10)
}
