import React, { useEffect, useState } from 'react'
import { ref, push, onValue } from 'firebase/database'
import { db } from '../firebase/firebase-config'
import {
  Table, Thead, Tr, Th, Tbody, Td,
  HStack, Input, Select, Button, Heading, Card, CardBody
} from '@chakra-ui/react'
import { pronomeDe } from '../utils/pronome'

export default function Membros() {
  const [membros, setMembros] = useState([])
  const [filtro, setFiltro] = useState('')
  const [classe, setClasse] = useState('')

  useEffect(() => {
    const r = ref(db, 'membros')
    const unsub = onValue(r, snap => {
      const val = snap.val() || {}
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }))
      setMembros(arr.sort((a,b) => (a.nome||'').localeCompare(b.nome||'')))
    })
    return () => unsub()
  }, [])

  const lista = membros.filter(m => {
    const okFiltro =
      m.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      (m.chamado || '').toLowerCase().includes(filtro.toLowerCase())
    const okClasse = !classe || (m.classificacao === classe)
    return okFiltro && okClasse
  })

  async function adicionarExemplo() {
    const r = ref(db, 'membros')
    await push(r, { nome: 'João da Silva', chamado: 'Membro', classificacao: 'homem', lastSpeech: null })
  }

  return (
    <>
      <Heading size="md" mb={3}>Membros</Heading>
      <HStack mb={3}>
        <Input placeholder="Buscar por nome ou chamado" value={filtro} onChange={e=>setFiltro(e.target.value)} />
        <Select placeholder="Filtrar por classificação" value={classe} onChange={e=>setClasse(e.target.value)}>
          <option value="homem">homem</option>
          <option value="mulher">mulher</option>
          <option value="rapaz">rapaz</option>
          <option value="moça">moça</option>
          <option value="menino">menino</option>
          <option value="menina">menina</option>
        </Select>
        <Button onClick={adicionarExemplo}>+ Exemplo</Button>
      </HStack>

      <Card>
        <CardBody>
          <Table size="sm">
            <Thead><Tr><Th>Nome</Th><Th>Chamado</Th><Th>Classificação</Th><Th>Tratamento</Th></Tr></Thead>
            <Tbody>
              {lista.map(m => (
                <Tr key={m.id}>
                  <Td>{m.nome}</Td>
                  <Td>{m.chamado || '-'}</Td>
                  <Td>{m.classificacao || '-'}</Td>
                  <Td>{pronomeDe(m)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  )
}
