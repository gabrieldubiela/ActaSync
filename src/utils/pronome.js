export function pronomeDe(membro) {
  const chamado = (membro?.chamado || membro?.chamado_nome || '').toLowerCase()
  const classe = (membro?.classificacao || '').toLowerCase()

  if (/presidente|bispo|conselheiro.*estaca/.test(chamado)) {
    if (/estaca/.test(chamado)) return 'presidente'
    if (/bispo/.test(chamado)) return 'bispo'
    return 'presidente'
  }

  if (['homem','rapaz','menino'].includes(classe)) return 'irmão'
  if (['mulher','moça','menina'].includes(classe)) return 'irmã'
  return 'irmão/irmã'
}

export function nomeComTratamento(membroOuNome) {
  if (typeof membroOuNome === 'string') return membroOuNome
  const t = pronomeDe(membroOuNome)
  const nome = membroOuNome?.nome || ''
  return `${t} ${nome}`.trim()
}
