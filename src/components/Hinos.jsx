import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Heading,
  useToast,
  SimpleGrid,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { ref, onValue, push, set, remove, query, orderByChild } from 'firebase/database';
import { database } from '../firebase/firebase-config';

const Hinos = () => {
  const [hinos, setHinos] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHino, setSelectedHino] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [hinoToDelete, setHinoToDelete] = useState(null);
  
  const toast = useToast();

  // Formulário do hino
  const [formData, setFormData] = useState({
    numero: '',
    titulo: ''
  });

  useEffect(() => {
    loadHinos();
  }, []);

  useEffect(() => {
    filterHinos();
  }, [hinos, searchTerm]);

  const loadHinos = () => {
    const hinosRef = ref(database, 'hinos');
    const hinosQuery = query(hinosRef, orderByChild('numero'));
    
    onValue(hinosQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hinosArray = Object.entries(data).map(([id, hino]) => ({
          id,
          ...hino
        }));
        
        // Ordenar por número
        hinosArray.sort((a, b) => Number(a.numero) - Number(b.numero));
        setHinos(hinosArray);
      } else {
        setHinos([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar hinos:', error);
      toast({
        title: 'Erro ao carregar hinos',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      setLoading(false);
    });
  };

  const filterHinos = () => {
    let filtered = [...hinos];

    // Filtro por busca (número ou título)
    if (searchTerm) {
      filtered = filtered.filter(hino => {
        const searchLower = searchTerm.toLowerCase();
        return (
          hino.numero.toString().includes(searchTerm) ||
          hino.titulo.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredHinos(filtered);
  };

  const openModal = (hino = null) => {
    if (hino) {
      setSelectedHino(hino);
      setFormData({
        numero: hino.numero,
        titulo: hino.titulo
      });
      setIsEditing(true);
    } else {
      setSelectedHino(null);
      setFormData({
        numero: '',
        titulo: ''
      });
      setIsEditing(false);
    }
    onOpen();
  };

  const handleSave = async () => {
    // Validações
    if (!formData.numero || !formData.titulo.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o número e o título do hino',
        status: 'error',
        duration: 3000
      });
      return;
    }

    // Verificar se o número já existe (apenas para novos hinos ou mudança de número)
    const numeroExistente = hinos.find(h => 
      h.numero === Number(formData.numero) && 
      (!isEditing || h.id !== selectedHino?.id)
    );
    
    if (numeroExistente) {
      toast({
        title: 'Número já existe',
        description: `O hino número ${formData.numero} já está cadastrado`,
        status: 'error',
        duration: 3000
      });
      return;
    }

    try {
      const hinoData = {
        numero: Number(formData.numero),
        titulo: formData.titulo.trim()
      };

      if (isEditing && selectedHino) {
        // Atualizar hino existente
        const hinoRef = ref(database, `hinos/${selectedHino.id}`);
        await set(hinoRef, hinoData);
        
        toast({
          title: 'Hino atualizado',
          description: `Hino ${formData.numero} - ${formData.titulo} foi atualizado`,
          status: 'success',
          duration: 3000
        });
      } else {
        // Criar novo hino
        const hinosRef = ref(database, 'hinos');
        await push(hinosRef, hinoData);
        
        toast({
          title: 'Hino adicionado',
          description: `Hino ${formData.numero} - ${formData.titulo} foi adicionado`,
          status: 'success',
          duration: 3000
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar hino:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDelete = (hino) => {
    setHinoToDelete(hino);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      const hinoRef = ref(database, `hinos/${hinoToDelete.id}`);
      await remove(hinoRef);
      
      toast({
        title: 'Hino removido',
        description: `Hino ${hinoToDelete.numero} - ${hinoToDelete.titulo} foi removido`,
        status: 'info',
        duration: 3000
      });
      
      onDeleteClose();
      setHinoToDelete(null);
    } catch (error) {
      console.error('Erro ao remover hino:', error);
      toast({
        title: 'Erro ao remover',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  // Hinos mais comuns para sugestão
  const hinosComuns = [
    { numero: 1, titulo: 'Vinde, Santos' },
    { numero: 2, titulo: 'O Espírito de Deus' },
    { numero: 27, titulo: 'Louvor ao Homem que Conversou com Deus' },
    { numero: 85, titulo: 'Quão Firme Alicerce' },
    { numero: 103, titulo: 'Mais Perto, Meu Deus, de Ti' },
    { numero: 104, titulo: 'Jesus, o Próprio Pensamento' },
    { numero: 116, titulo: 'Vem, Vem sem Temor' },
    { numero: 118, titulo: 'Acheguemo-nos a Deus' },
    { numero: 182, titulo: 'Sabemos, ó Deus, que És Verdade' },
    { numero: 192, titulo: 'Silenciosamente Agora' }
  ];

  const adicionarHinosComuns = async () => {
    try {
      const hinosRef = ref(database, 'hinos');
      
      for (const hino of hinosComuns) {
        const existeHino = hinos.find(h => h.numero === hino.numero);
        if (!existeHino) {
          await push(hinosRef, hino);
        }
      }
      
      toast({
        title: 'Hinos adicionados',
        description: 'Hinos mais comuns foram adicionados ao banco de dados',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Erro ao adicionar hinos comuns:', error);
      toast({
        title: 'Erro ao adicionar hinos',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Carregando hinos...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="blue.500">
          🎵 Gerenciar Hinos
        </Heading>
        <HStack>
          {hinos.length === 0 && (
            <Button
              colorScheme="green"
              variant="outline"
              onClick={adicionarHinosComuns}
            >
              Adicionar Hinos Comuns
            </Button>
          )}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => openModal()}
          >
            Adicionar Hino
          </Button>
        </HStack>
      </HStack>

      {/* Busca */}
      <FormControl mb={6}>
        <FormLabel>Buscar hino por número ou título</FormLabel>
        <Input
          placeholder="Ex: 1, Vinde Santos, etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="lg"
        />
      </FormControl>

      {/* Lista de Hinos */}
      {filteredHinos.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500" mb={4}>
              {hinos.length === 0 
                ? 'Nenhum hino cadastrado' 
                : 'Nenhum hino encontrado com o termo pesquisado'
              }
            </Text>
            {hinos.length === 0 ? (
              <VStack spacing={3}>
                <Button
                  colorScheme="blue"
                  onClick={() => openModal()}
                >
                  Adicionar Primeiro Hino
                </Button>
                <Text fontSize="sm" color="gray.500">ou</Text>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={adicionarHinosComuns}
                >
                  Adicionar Hinos Mais Comuns
                </Button>
              </VStack>
            ) : (
              <Button
                colorScheme="blue"
                onClick={() => setSearchTerm('')}
              >
                Limpar Busca
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <>
          <Text mb={4} color="gray.600">
            Mostrando {filteredHinos.length} de {hinos.length} hinos
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredHinos.map((hino) => (
              <Card key={hino.id} variant="outline">
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          #{hino.numero}
                        </Text>
                        <Text fontSize="md" fontWeight="semibold" lineHeight="short">
                          {hino.titulo}
                        </Text>
                      </VStack>
                      
                      <HStack>
                        <IconButton
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => openModal(hino)}
                          aria-label={`Editar hino ${hino.numero}`}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(hino)}
                          aria-label={`Remover hino ${hino.numero}`}
                        />
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}

      {/* Modal de Edição/Criação */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Editar Hino' : 'Adicionar Hino'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Número do hino</FormLabel>
                <NumberInput
                  value={formData.numero}
                  onChange={(valueString) => setFormData({...formData, numero: valueString})}
                  min={1}
                  max={999}
                >
                  <NumberInputField placeholder="Ex: 1" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Título do hino</FormLabel>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Ex: Vinde, Santos"
                />
              </FormControl>

              {formData.numero && formData.titulo && (
                <Box p={4} bg="blue.50" borderRadius="md" width="100%">
                  <Text fontSize="sm" color="blue.700">
                    <strong>Visualização:</strong> Hino {formData.numero} - {formData.titulo}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remover Hino
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja remover o hino{' '}
              <strong>#{hinoToDelete?.numero} - {hinoToDelete?.titulo}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Remover
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Hinos;