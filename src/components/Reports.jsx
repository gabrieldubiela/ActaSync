import React, { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../firebase/firebase-config'
import { Heading, Card, CardBody, List, ListItem, Text } from '@chakra-ui/react'

export default function Reports() {
  const [membros, setMembros] = useState([])

  useEffect(() => {
    const r = ref(db, 'membros')
    const unsub = onValue(r, snap => {
      const val = snap.val() || {}
      setMembros(Object.entries(val).map(([id, d]) => ({ id, ...d })))
    })
    return () => unsub()
  }, [])

  const ordenados = membros.slice().sort((a,b) => {
    const ta = a.lastSpeech ? a.lastSpeech : 0
    const tb = b.lastSpeech ? b.lastSpeech : 0
    return ta - tb
  })

  return (
    <>
      <Heading size="md" mb={3}>Relatórios</Heading>
      <Card>
        <CardBody>
          <Text mb={2}>Membros ordenados por data do último discurso (os mais antigos primeiro).</Text>
          <List spacing={2}>
            {ordenados.map(m => (
              <ListItem key={m.id}>
                <Text fontWeight="semibold">{m.nome}</Text>
                <Text fontSize="sm">{m.lastSpeech ? new Date(m.lastSpeech).toLocaleDateString() : 'Nunca discursou'}</Text>
              </ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    </>
  )
}
