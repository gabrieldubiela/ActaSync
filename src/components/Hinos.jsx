import React, { useEffect, useMemo, useState } from 'react'
import { ref, push, onValue } from 'firebase/database'
import { db } from '../firebase/firebase-config'
import { Heading, HStack, Input, Button, Card, CardBody, List, ListItem } from '@chakra-ui/react'

export default function Hinos() {
  const [hinos, setHinos] = useState([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const r = ref(db, 'hinos')
    const unsub = onValue(r, snap => {
      const val = snap.val() || {}
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }))
      setHinos(arr.sort((a,b) => (a.numero||0) - (b.numero||0)))
    })
    return () => unsub()
  }, [])

  const filtrados = useMemo(() => hinos.filter(h =>
    String(h.numero).includes(busca) || (h.titulo||'').toLowerCase().includes(busca.toLowerCase())
  ), [hinos, busca])

  async function adicionarExemplo() {
    const r = ref(db, 'hinos')
    await push(r, { numero: 1, titulo: 'Oração' })
  }

  return (
    <>
      <Heading size="md" mb={3}>Hinos</Heading>
      <HStack mb={3}>
        <Input placeholder="Buscar por número ou título" value={busca} onChange={e=>setBusca(e.target.value)} />
        <Button onClick={adicionarExemplo}>+ Exemplo</Button>
      </HStack>
      <Card><CardBody>
        <List spacing={2}>
          {filtrados.map(h => (
            <ListItem key={h.id}>{h.numero} — {h.titulo}</ListItem>
          ))}
        </List>
      </CardBody></Card>
    </>
  )
}
