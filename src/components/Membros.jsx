import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Select,
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
  Badge,
  Heading,
  useToast,
  SimpleGrid,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { database } from '../firebase/firebase-config';
import { getPronome } from '../utils/pronome';

const Membros = () => {
  const [membros, setMembros] = useState([]);
  const [chamados, setChamados] = useState([]);
  const [filteredMembros, setFilteredMembros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassificacao, setFilterClassificacao] = useState('');
  const [selectedMembro, setSelectedMembro] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [membroToDelete, setMembroToDelete] = useState(null);
  
  const toast = useToast();

  // Formulário do membro
  const [formData, setFormData] = useState({
    nome: '',
    chamado_id: '',
    classificacao: 'homem',
    data_ultimo_discurso: ''
  });

  useEffect(() => {
    loadMembros();
    loadChamados();
  }, []);

  useEffect(() => {
    filterMembros();
  }, [membros, searchTerm, filterClassificacao]);

  const loadMembros = () => {
    const membrosRef = ref(database, 'membros');
    onValue(membrosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const membrosArray = Object.entries(data).map(([id, membro]) => ({
          id,
          ...membro
        }));
        setMembros(membrosArray);
      } else {
        setMembros([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar membros:', error);
      toast({
        title: 'Erro ao carregar membros',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      setLoading(false);
    });
  };

  const loadChamados = () => {
    const chamadosRef = ref(database, 'chamados');
    onValue(chamadosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chamadosArray = Object.entries(data).map(([id, chamado]) => ({
          id,
          ...chamado
        }));
        setChamados(chamadosArray);
      } else {
        setChamados([]);
      }
    });
  };

  const filterMembros = () => {
    let filtered = [...membros];

    // Filtro por busca (nome ou chamado)
    if (searchTerm) {
      filtered = filtered.filter(membro => {
        const chamadoNome = chamados.find(c => c.id === membro.chamado_id)?.nome || '';
        return (
          membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chamadoNome.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtro por classificação
    if (filterClassificacao) {
      filtered = filtered.filter(membro => membro.classificacao === filterClassificacao);
    }

    // Ordenar por nome
    filtered.sort((a, b) => a.nome.localeCompare(b.nome));

    setFilteredMembros(filtered);
  };

  const openModal = (membro = null) => {
    if (membro) {
      setSelectedMembro(membro);
      setFormData({
        nome: membro.nome,
        chamado_id: membro.chamado_id || '',
        classificacao: membro.classificacao,
        data_ultimo_discurso: membro.data_ultimo_discurso || ''
      });
      setIsEditing(true);
    } else {
      setSelectedMembro(null);
      setFormData({
        nome: '',
        chamado_id: '',
        classificacao: 'homem',
        data_ultimo_discurso: ''
      });
      setIsEditing(false);
    }
    onOpen();
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, digite o nome do membro',
        status: 'error',
        duration: 3000
      });
      return;
    }

    try {
      const membroData = {
        nome: formData.nome.trim(),
        chamado_id: formData.chamado_id || null,
        classificacao: formData.classificacao,
        data_ultimo_discurso: formData.data_ultimo_discurso || null
      };

      if (isEditing && selectedMembro) {
        // Atualizar membro existente
        const membroRef = ref(database, `membros/${selectedMembro.id}`);
        await set(membroRef, membroData);
        
        toast({
          title: 'Membro atualizado',
          description: `${formData.nome} foi atualizado com sucesso`,
          status: 'success',
          duration: 3000
        });
      } else {
        // Criar novo membro
        const membrosRef = ref(database, 'membros');
        await push(membrosRef, membroData);
        
        toast({
          title: 'Membro adicionado',
          description: `${formData.nome} foi adicionado com sucesso`,
          status: 'success',
          duration: 3000
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDelete = (membro) => {
    setMembroToDelete(membro);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      const membroRef = ref(database, `membros/${membroToDelete.id}`);
      await remove(membroRef);
      
      toast({
        title: 'Membro removido',
        description: `${membroToDelete.nome} foi removido com sucesso`,
        status: 'info',
        duration: 3000
      });
      
      onDeleteClose();
      setMembroToDelete(null);
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: 'Erro ao remover',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const getChamadoNome = (chamadoId) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    return chamado ? chamado.nome : '';
  };

  const formatarData = (data) => {
    if (!data) return 'Nunca discursou';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getDiasUltimoDiscurso = (data) => {
    if (!data) return null;
    const hoje = new Date();
    const ultimoDiscurso = new Date(data);
    const diffTime = hoje - ultimoDiscurso;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusDiscurso = (dias) => {
    if (dias === null) return { color: 'red', text: 'Nunca' };
    if (dias <= 30) return { color: 'green', text: 'Recente' };
    if (dias <= 90) return { color: 'yellow', text: 'Médio' };
    return { color: 'red', text: 'Há muito tempo' };
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Carregando membros...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="blue.500">
          👥 Gerenciar Membros
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => openModal()}
        >
          Adicionar Membro
        </Button>
      </HStack>

      {/* Filtros */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        <FormControl>
          <FormLabel>Buscar por nome ou chamado</FormLabel>
          <Input
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Filtrar por classificação</FormLabel>
          <Select
            value={filterClassificacao}
            onChange={(e) => setFilterClassificacao(e.target.value)}
          >
            <option value="">Todas as classificações</option>
            <option value="homem">Homem</option>
            <option value="mulher">Mulher</option>
            <option value="rapaz">Rapaz</option>
            <option value="moça">Moça</option>
            <option value="menino">Menino</option>
            <option value="menina">Menina</option>
          </Select>
        </FormControl>
      </SimpleGrid>

      {/* Lista de Membros */}
      {filteredMembros.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              {membros.length === 0 ? 'Nenhum membro cadastrado' : 'Nenhum membro encontrado com os filtros aplicados'}
            </Text>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => openModal()}
            >
              Adicionar Primeiro Membro
            </Button>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {filteredMembros.map((membro) => {
            const dias = getDiasUltimoDiscurso(membro.data_ultimo_discurso);
            const status = getStatusDiscurso(dias);
            const membroComChamado = { ...membro, chamado: getChamadoNome(membro.chamado_id) };
            
            return (
              <Card key={membro.id} variant="outline">
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text fontWeight="bold" fontSize="lg">
                        {getPronome(membroComChamado)} {membro.nome}
                      </Text>
                      <HStack>
                        <IconButton
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => openModal(membro)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(membro)}
                        />
                      </HStack>
                    </HStack>

                    <VStack align="stretch" spacing={2} fontSize="sm">
                      {getChamadoNome(membro.chamado_id) && (
                        <HStack>
                          <Text fontWeight="semibold">Chamado:</Text>
                          <Badge colorScheme="purple" variant="subtle">
                            {getChamadoNome(membro.chamado_id)}
                          </Badge>
                        </HStack>
                      )}

                      <HStack>
                        <Text fontWeight="semibold">Classificação:</Text>
                        <Badge colorScheme="blue" variant="outline">
                          {membro.classificacao}
                        </Badge>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="semibold">Último discurso:</Text>
                        <VStack align="end" spacing={0}>
                          <Badge colorScheme={status.color} variant="subtle">
                            {status.text}
                          </Badge>
                          <Text fontSize="xs" color="gray.500">
                            {formatarData(membro.data_ultimo_discurso)}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      )}

      {/* Modal de Edição/Criação */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Editar Membro' : 'Adicionar Membro'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome completo</FormLabel>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Digite o nome completo"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Chamado</FormLabel>
                <Select
                  value={formData.chamado_id}
                  onChange={(e) => setFormData({...formData, chamado_id: e.target.value})}
                >
                  <option value="">Sem chamado específico</option>
                  {chamados.map((chamado) => (
                    <option key={chamado.id} value={chamado.id}>
                      {chamado.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Classificação</FormLabel>
                <Select
                  value={formData.classificacao}
                  onChange={(e) => setFormData({...formData, classificacao: e.target.value})}
                >
                  <option value="homem">Homem</option>
                  <option value="mulher">Mulher</option>
                  <option value="rapaz">Rapaz</option>
                  <option value="moça">Moça</option>
                  <option value="menino">Menino</option>
                  <option value="menina">Menina</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Data do último discurso</FormLabel>
                <Input
                  type="date"
                  value={formData.data_ultimo_discurso}
                  onChange={(e) => setFormData({...formData, data_ultimo_discurso: e.target.value})}
                />
              </FormControl>

              {formData.nome && (
                <Box p={4} bg="blue.50" borderRadius="md" width="100%">
                  <Text fontSize="sm" color="blue.700">
                    <strong>Pronome automático:</strong> {getPronome({
                      chamado: chamados.find(c => c.id === formData.chamado_id)?.nome || '',
                      classificacao: formData.classificacao
                    })} {formData.nome}
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
              Remover Membro
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja remover <strong>{membroToDelete?.nome}</strong>?
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

export default Membros;