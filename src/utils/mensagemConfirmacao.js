import { nomeComTratamento } from './pronome'

export function gerarConfirmacao({ membro, nomeManual }) {
  const nome = membro ? nomeComTratamento(membro) : nomeManual
  return `Olá, ${nome}! Poderá discursar na reunião sacramental deste domingo?`
}
