import { nomeComTratamento } from './pronome'
import { tempoParaPosicao } from './temposOradores'

export function gerarConvite({ membro, nomeManual, tema, posicao, linkEstudo }) {
  const nome = membro ? nomeComTratamento(membro) : nomeManual
  const tempo = tempoParaPosicao(posicao)
  const linhas = [
    `Olá, ${nome}!`,
    `Gostaríamos de convidá-lo(a) para discursar na reunião sacramental deste domingo.`,
    tema ? `Tema sugerido: ${tema}.` : null,
    `Tempo aproximado: ${tempo} minutos.`,
    linkEstudo ? `Sugestão de estudo: ${linkEstudo}` : null,
    `Se estiver de acordo, por favor confirme.`
  ].filter(Boolean)
  return linhas.join('\n\n')
}
