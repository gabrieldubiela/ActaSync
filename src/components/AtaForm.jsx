import React, { useEffect, useState, useMemo } from 'react'
import {
  Heading, SimpleGrid, FormControl, FormLabel, Input, Switch, Button,
  Card, CardBody, VStack, HStack, Text, Box, List, ListItem
} from '@chakra-ui/react'
import { ref, push, set, onValue, update } from 'firebase/database'
import { db } from '../firebase/firebase-config'
import PDFGenerator from './PDFGenerator'
import { PDFDownloadLink } from '@react-pdf/renderer'

export default function AtaForm({ ataId }) {
  const [dados, setDados] = useState({
    data: '',
    tema_geral: '',
    preside: '',
    dirige: '',
    pianista: '',
    regente: '',
    hino_abertura: '',
    hino_sacramental: '',
    hino_intermediario: '',
    hino_final: '',
    oracao_abertura: '',
    oracao_final: '',
    oradores: [],
    reuniao_testemunhos: false,
    reuniao_cancelada: false,
    motivo_cancelamento: ''
  })
  const [modoLeitura, setModoLeitura] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [membros, setMembros] = useState([])
  const [hinos, setHinos] = useState([])

  useEffect(() => {
    const r = ref(db, 'membros')
    const unsub = onValue(r, snap => {
      const val = snap.val() || {}
      setMembros(Object.entries(val).map(([id, d]) => ({ id, ...d })))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const r = ref(db, 'hinos')
    const unsub = onValue(r, snap => {
      const val = snap.val() || {}
      setHinos(Object.entries(val).map(([id, d]) => ({ id, ...d })))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!ataId) return
    const r = ref(db, `atas/${ataId}`)
    const unsub = onValue(r, snap => {
      if (snap.exists()) setDados(snap.val())
    })
    return () => unsub()
  }, [ataId])

  function setField(k, v){ setDados(d => ({ ...d, [k]: v })) }

  async function salvar() {
    setSalvando(true)
    try {
      if (ataId) {
        await update(ref(db, `atas/${ataId}`), dados)
      } else {
        const novoRef = push(ref(db, 'atas'))
        await set(novoRef, dados)
      }
      alert('Ata salva com sucesso!')
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  // Autocomplete helpers
  function sugestoesMembros(q='') {
    const term = q.toLowerCase()
    return membros.filter(m => (m.nome||'').toLowerCase().includes(term)).slice(0,6)
  }

  function sugestoesHinos(q='') {
    const term = q.toLowerCase()
    return hinos.filter(h => (String(h.numero)||'').includes(term) || (h.titulo||'').toLowerCase().includes(term)).slice(0,6)
  }

  const [buscaOrador, setBuscaOrador] = useState('')
  const sugestoes = useMemo(()=>sugestoesMembros(buscaOrador), [buscaOrador, membros])

  function adicionarOrador(membro) {
    setDados(d => ({ ...d, oradores: [...(d.oradores||[]), { membroId: membro.id, nome: membro.nome, posicao: (d.oradores||[]).length+1 }] }))
    setBuscaOrador('')
  }

  return (
    <>
      <Heading size="md" mb={3}>Ata da Reunião</Heading>
      <Card><CardBody>
        <HStack justify="space-between" mb={3}>
          <VStack align="start">
            <Text fontWeight="semibold">Modo: {modoLeitura ? 'Leitura' : 'Edição'}</Text>
            <Text fontSize="sm">Quando em leitura, campos ficam bloqueados e o PDF é preparado sem campos vazios.</Text>
          </VStack>
          <HStack>
            <PDFDownloadLink document={<PDFGenerator ata={dados} />} fileName="ata.pdf">
              {({ loading }) => (<Button>{loading ? 'Gerando...' : 'Baixar PDF'}</Button>)}
            </PDFDownloadLink>
            <Switch isChecked={modoLeitura} onChange={e=>setModoLeitura(e.target.checked)} />
          </HStack>
        </HStack>

        <SimpleGrid columns={[1,2]} spacing={4}>
          <FormControl isDisabled={modoLeitura}><FormLabel>Data</FormLabel><Input type="date" value={dados.data} onChange={e=>setField('data', e.target.value)} /></FormControl>
          <FormControl isDisabled={modoLeitura}><FormLabel>Tema Geral</FormLabel><Input value={dados.tema_geral} onChange={e=>setField('tema_geral', e.target.value)} /></FormControl>

          <FormControl isDisabled={modoLeitura}><FormLabel>Quem preside</FormLabel><Input value={dados.preside} onChange={e=>setField('preside', e.target.value)} /></FormControl>
          <FormControl isDisabled={modoLeitura}><FormLabel>Quem dirige</FormLabel><Input value={dados.dirige} onChange={e=>setField('dirige', e.target.value)} /></FormControl>

          <FormControl isDisabled={modoLeitura}><FormLabel>Pianista</FormLabel><Input value={dados.pianista} onChange={e=>setField('pianista', e.target.value)} /></FormControl>
          <FormControl isDisabled={modoLeitura}><FormLabel>Regente</FormLabel><Input value={dados.regente} onChange={e=>setField('regente', e.target.value)} /></FormControl>

          <FormControl isDisabled={modoLeitura}><FormLabel>Hino Abertura</FormLabel><Input value={dados.hino_abertura} onChange={e=>setField('hino_abertura', e.target.value)} /></FormControl>
          <FormControl isDisabled={modoLeitura}><FormLabel>Hino Sacramental</FormLabel><Input value={dados.hino_sacramental} onChange={e=>setField('hino_sacramental', e.target.value)} /></FormControl>

          <FormControl isDisabled={modoLeitura}><FormLabel>Hino Intermediário (opcional)</FormLabel><Input value={dados.hino_intermediario} onChange={e=>setField('hino_intermediario', e.target.value)} /></FormControl>
          <FormControl isDisabled={modoLeitura}><FormLabel>Hino Final</FormLabel><Input value={dados.hino_final} onChange={e=>setField('hino_final', e.target.value)} /></FormControl>

          <FormControl isDisabled={modoLeitura}><FormLabel>Oração Abertura</FormLabel><Input value={dados.oracao_abertura} onChange={e=>setField('oracao_abertura', e.target.value)} /></FormControl>
          <FormControl isDisabled={modoLeitura}><FormLabel>Oração Final</FormLabel><Input value={dados.oracao_final} onChange={e=>setField('oracao_final', e.target.value)} /></FormControl>

          <FormControl display="flex" alignItems="center" isDisabled={modoLeitura}>
            <FormLabel mb="0">Reunião de testemunhos?</FormLabel>
            <Switch isChecked={dados.reuniao_testemunhos} onChange={e=>setField('reuniao_testemunhos', e.target.checked)} />
          </FormControl>

          <FormControl display="flex" alignItems="center" isDisabled={modoLeitura}>
            <FormLabel mb="0">Reunião cancelada?</FormLabel>
            <Switch isChecked={dados.reuniao_cancelada} onChange={e=>setField('reuniao_cancelada', e.target.checked)} />
          </FormControl>

          {dados.reuniao_cancelada && <FormControl isDisabled={modoLeitura}><FormLabel>Motivo do cancelamento</FormLabel><Input value={dados.motivo_cancelamento} onChange={e=>setField('motivo_cancelamento', e.target.value)} /></FormControl>}
        </SimpleGrid>

        <Box mt={6}>
          <Text fontWeight="semibold" mb={2}>Oradores</Text>
          <HStack mb={2}>
            <Input placeholder="Buscar membro para adicionar como orador" value={buscaOrador} onChange={e=>setBuscaOrador(e.target.value)} />
            <Button onClick={()=> adicionarOrador({ id: null, nome: buscaOrador })}>Adicionar manual</Button>
          </HStack>
          {sugestoes.length > 0 && (
            <List spacing={1} mb={3}>
              {sugestoes.map(s => (
                <ListItem key={s.id} onClick={()=>adicionarOrador(s)} style={{cursor:'pointer'}}>{s.nome} — {s.chamado || ''}</ListItem>
              ))}
            </List>
          )}
          <VStack align="start" spacing={2}>
            {(dados.oradores||[]).map((o,i)=>(
              <Box key={i} borderWidth="1px" borderRadius="md" p={2} width="100%">
                <Text fontWeight="semibold">{o.nome}</Text>
                <Text fontSize="sm">Posição: {o.posicao}</Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Button mt={4} colorScheme="blue" onClick={salvar} isLoading={salvando} disabled={modoLeitura}>Salvar</Button>
      </CardBody></Card>
    </>
  )
}
