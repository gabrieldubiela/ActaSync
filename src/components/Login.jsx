import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase/firebase-config'
import { Heading, VStack, Input, Button, Alert, AlertIcon, Card, CardBody, HStack } from '@chakra-ui/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [modo, setModo] = useState('login') // 'login' or 'signup'
  const [nome, setNome] = useState('')

  async function entrar(e) {
    e.preventDefault()
    setErro(''); setOk('')
    try {
      await signInWithEmailAndPassword(auth, email, senha)
      setOk('Login efetuado!')
    } catch (err) {
      setErro(err.message)
    }
  }

  async function registrar(e) {
    e.preventDefault()
    setErro(''); setOk('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha)
      // create profile in Realtime DB with default role 'user'
      await set(ref(db, `users/${cred.user.uid}`), { nome: nome || email.split('@')[0], role: 'user', createdAt: Date.now() })
      setOk('Conta criada! Faça login.')
      setModo('login')
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <Card>
      <CardBody>
        <VStack as="form" spacing={3} align="stretch" onSubmit={modo === 'login' ? entrar : registrar}>
          <Heading size="md">{modo === 'login' ? 'Entrar' : 'Registrar'}</Heading>
          {erro && <Alert status="error"><AlertIcon />{erro}</Alert>}
          {ok && <Alert status="success"><AlertIcon />{ok}</Alert>}
          {modo === 'signup' && <Input placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} />}
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} />
          <HStack>
            <Button type="submit" colorScheme="blue">{modo === 'login' ? 'Entrar' : 'Criar conta'}</Button>
            <Button variant="ghost" onClick={()=>setModo(modo === 'login' ? 'signup' : 'login')}>
              {modo === 'login' ? 'Criar conta' : 'Voltar ao login'}
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}
