import React, { useEffect, useState } from 'react'
import { ref, push, onValue } from 'firebase/database'
import { db } from '../firebase/firebase-config'
import { Box, Heading, Button, Card, CardBody, List, ListItem, HStack, Input } from '@chakra-ui/react'
import { gerarConvite } from '../utils/mensagemConvite'

export default function Calendario() {
  const [domingos, setDomingos] = useState([])
  const [tema, setTema] = useState('')

  useEffect(() => {
    const r = ref(db, 'calendario')
    const unsub = onValue(r, snap => {
      const val = snap.val() || {}
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }))
      setDomingos(arr.sort((a,b) => (a.data || '').localeCompare(b.data || '')))
    })
    return () => unsub()
  }, [])

  async function adicionarExemplo() {
    const hoje = new Date().toISOString().split('T')[0]
    await push(ref(db, 'calendario'), { data: hoje, tema: 'Caridade', oradores: [] })
  }

  function conviteExemplo() {
    const texto = gerarConvite({ nomeManual: 'Irmão Exemplo', tema: tema || 'Caridade', posicao: 1, linkEstudo: 'https://churchofjesuschrist.org' })
    if (navigator.share) {
      navigator.share({ text: texto }).catch(()=> navigator.clipboard.writeText(texto))
    } else {
      navigator.clipboard.writeText(texto)
      alert('Convite copiado para a área de transferência!')
    }
  }

  return (
    <>
      <Heading size="md" mb={3}>Calendário Sacramental</Heading>
      <HStack mb={3}>
        <Input placeholder="Tema geral (para convite rápido)" value={tema} onChange={e=>setTema(e.target.value)} />
        <Button onClick={conviteExemplo}>Gerar/ copiar convite</Button>
        <Button onClick={adicionarExemplo}>+ Domingo</Button>
      </HStack>
      <Card><CardBody>
        <List spacing={2}>
          {domingos.map(d => (
            <ListItem key={d.id}>
              <Box fontWeight="semibold">{d.data}</Box>
              Tema: {d.tema || '—'}
            </ListItem>
          ))}
        </List>
      </CardBody></Card>
    </>
  )
}
