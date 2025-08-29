import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Container,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <Box
          bg={bgColor}
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6}>
            <Box textAlign="center">
              <Heading size="lg" color="blue.500" mb={2}>
                📘 ActaSync
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Sistema de Atas Sacramentais
              </Text>
            </Box>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    size="lg"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  isLoading={loading}
                  loadingText={isSignUp ? "Criando conta..." : "Entrando..."}
                  bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  _hover={{
                    bgGradient: "linear(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.2s"
                >
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setIsSignUp(!isSignUp)}
                  width="100%"
                >
                  {isSignUp 
                    ? 'Já tenho uma conta - Fazer Login' 
                    : 'Não tenho conta - Criar Nova'
                  }
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;