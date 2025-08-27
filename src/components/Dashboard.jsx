import React from 'react'
import { SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Heading, Text } from '@chakra-ui/react'
import config from '../config.json'

export default function Dashboard() {
  return (
    <>
      <Heading size="lg" mb={4}>Bem-vindo ao {config.ala} — {config.estaca}</Heading>
      <SimpleGrid columns={[1,2,3]} spacing={4}>
        <Card><CardBody><Stat><StatLabel>Próximo Domingo</StatLabel><StatNumber>—</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Oradores</StatLabel><StatNumber>—</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Membros sem discurso há mais tempo</StatLabel><StatNumber>—</StatNumber></Stat></CardBody></Card>
      </SimpleGrid>
      <Card mt={6}><CardBody>
        <Heading size="md" mb={2}>Últimas atas</Heading>
        <Text>Em breve…</Text>
      </CardBody></Card>
    </>
  )
}
