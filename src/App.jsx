import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Box, Container, Flex, Heading, HStack, Button, useColorMode, Spacer } from '@chakra-ui/react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Membros from './components/Membros.jsx'
import Hinos from './components/Hinos.jsx'
import Calendario from './components/Calendario.jsx'
import AtaForm from './components/AtaForm.jsx'
import Reports from './components/Reports.jsx'
import RequireAuth from './firebase/RequireAuth.jsx'

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box borderBottom="1px" borderColor="gray.200" mb={4} py={2}>
      <Container maxW="6xl">
        <Flex align="center" gap={4}>
          <Heading size="md" className="brand">ActaSync</Heading>
          <HStack spacing={3}>
            <Button as={Link} to="/">Dashboard</Button>
            <Button as={Link} to="/membros">Membros</Button>
            <Button as={Link} to="/hinos">Hinos</Button>
            <Button as={Link} to="/calendario">Calendário</Button>
            <Button as={Link} to="/ata">Ata</Button>
            <Button as={Link} to="/reports">Relatórios</Button>
          </HStack>
          <Spacer />
          <Button onClick={toggleColorMode}>{colorMode === 'light' ? 'Escuro' : 'Claro'}</Button>
          <Button as={Link} to="/login" variant="outline">Login</Button>
        </Flex>
      </Container>
    </Box>
  )
}

export default function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="6xl" pb={12}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/membros" element={<RequireAuth><Membros /></RequireAuth>} />
          <Route path="/hinos" element={<RequireAuth><Hinos /></RequireAuth>} />
          <Route path="/calendario" element={<RequireAuth><Calendario /></RequireAuth>} />
          <Route path="/ata" element={<RequireAuth><AtaForm /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Box>
  )
}
