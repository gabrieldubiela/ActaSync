import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Divider,
  useToast
} from '@chakra-ui/react';
import { ref, onValue, query, orderByChild, limitToFirst } from 'firebase/database';
import { database } from '../firebase/firebase-config';
import { getPronome } from '../utils/pronome';
import { getPosicaoTexto } from '../utils/temposOradores';

const Dashboard = ({ config }) => {
  const [stats, setStats] = useState({
    totalMembros: 0,
    atasMes: 0,
    proximaReuniao: null
  });
  const [proximosDomingos, setProximosDomingos] = useState([]);
  const [membrosRecentes, setMembrosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      // Carregar estatísticas dos membros
      const membrosRef = ref(database, 'membros');
      onValue(membrosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const membrosArray = Object.entries(data).map(([id, membro]) => ({ id, ...membro }));
          setStats(prev => ({
            ...prev,
            totalMembros: membrosArray.length
          }));
          
          // Membros que discursaram recentemente
          const membrosOrdenados = membrosArray
            .filter(m => m.data_ultimo_discurso)
            .sort((a, b) => new Date(b.data_ultimo_discurso) - new Date(a.data_ultimo_discurso))
            .slice(0, 5);
          setMembrosRecentes(membrosOrdenados);
        }
      });

      // Carregar calendário
      const calendarioRef = ref(database, 'calendario');
      const calendarioQuery = query(calendarioRef, orderByChild('data'));
      onValue(calendarioQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const domingos = Object.entries(data)
            .map(([id, domingo]) => ({ id, ...domingo }))
            .filter(domingo => new Date(domingo.data) >= new Date())
            .sort((a, b) => new Date(a.data) - new Date(b.data))
            .slice(0, 3);
          
          setProximosDomingos(domingos);
          
          if (domingos.length > 0) {
            setStats(prev => ({
              ...prev,
              proximaReuniao: domingos[0]
            }));
          }
        }
      });

      // Carregar estatísticas de atas do mês atual
      const atasRef = ref(database, 'atas');
      onValue(atasRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const atasArray = Object.entries(data).map(([id, ata]) => ({ id, ...ata }));
          const mesAtual = new Date().getMonth();
          const anoAtual = new Date().getFullYear();
          
          const atasDoMes = atasArray.filter(ata => {
            const dataAta = new Date(ata.data);
            return dataAta.getMonth() === mesAtual && dataAta.getFullYear() === anoAtual;
          });
          
          setStats(prev => ({
            ...prev,
            atasMes: atasDoMes.length
          }));
        }
        setLoading(false);
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Verifique sua conexão com a internet',
        status: 'error',
        duration: 3000
      });
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getOradorInfo = (orador, membros = []) => {
    if (orador.membro_id) {
      const membro = membros.find(m => m.id === orador.membro_id);
      if (membro) {
        return `${getPronome(membro)} ${membro.nome}`;
      }
    }
    return orador.nome_manual || orador.nome || 'Nome não definido';
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Carregando dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" color="blue.500">
            Bem-vindo ao ActaSync
          </Heading>
          <Text color="gray.600" mt={2}>
            {config.ala} - {config.estaca}
          </Text>
        </Box>

        {/* Estatísticas */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody textAlign="center">
              <Stat>
                <StatNumber fontSize="3xl" color="blue.500">
                  {stats.totalMembros}
                </StatNumber>
                <StatLabel>Total de Membros</StatLabel>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody textAlign="center">
              <Stat>
                <StatNumber fontSize="3xl" color="green.500">
                  {stats.atasMes}
                </StatNumber>
                <StatLabel>Atas este Mês</StatLabel>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody textAlign="center">
              <Stat>
                <StatNumber fontSize="2xl" color="purple.500">
                  {stats.proximaReuniao 
                    ? new Date(stats.proximaReuniao.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                    : 'N/A'
                  }
                </StatNumber>
                <StatLabel>Próxima Reunião</StatLabel>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Próximos Domingos */}
        {proximosDomingos.length > 0 && (
          <Card>
            <CardBody>
              <Heading size="md" mb={4} color="blue.600">
                🗓️ Próximos Domingos
              </Heading>
              <VStack spacing={4} align="stretch">
                {proximosDomingos.map((domingo, index) => (
                  <Box 
                    key={domingo.id}
                    p={4}
                    borderRadius="md"
                    bg={index === 0 ? 'blue.50' : 'gray.50'}
                    border={index === 0 ? '2px solid' : '1px solid'}
                    borderColor={index === 0 ? 'blue.200' : 'gray.200'}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold" color="blue.600">
                        {formatarData(domingo.data)}
                      </Text>
                      {index === 0 && <Badge colorScheme="blue">Próximo</Badge>}
                    </HStack>
                    
                    <Text fontSize="lg" fontWeight="semibold" mb={2}>
                      {domingo.tema_geral}
                    </Text>

                    {domingo.oradores && domingo.oradores.length > 0 && (
                      <VStack spacing={1} align="stretch" fontSize="sm">
                        {domingo.oradores
                          .sort((a, b) => a.posicao - b.posicao)
                          .map((orador, oradorIndex) => (
                          <HStack key={oradorIndex} justify="space-between">
                            <Text>
                              <strong>{getPosicaoTexto(orador.posicao, domingo.oradores.length)}:</strong> {getOradorInfo(orador)}
                            </Text>
                            <Text color="gray.600" fontSize="xs">
                              "{orador.subtema}"
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    )}

                    {domingo.reuniao_testemunhos && (
                      <Badge colorScheme="orange" mt={2}>
                        Reunião de Testemunhos
                      </Badge>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Membros que discursaram recentemente */}
        {membrosRecentes.length > 0 && (
          <Card>
            <CardBody>
              <Heading size="md" mb={4} color="green.600">
                🎤 Últimos Oradores
              </Heading>
              <VStack spacing={2} align="stretch">
                {membrosRecentes.map((membro) => (
                  <HStack key={membro.id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                    <Text>
                      <strong>{getPronome(membro)} {membro.nome}</strong>
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(membro.data_ultimo_discurso).toLocaleDateString('pt-BR')}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        <Divider />

        {/* Ações Rápidas */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4} color="purple.600">
              ⚡ Ações Rápidas
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => window.location.hash = 'atas'}
              >
                📝 Nova Ata
              </Button>
              <Button
                colorScheme="green"
                size="lg"
                variant="outline"
                onClick={() => window.location.hash = 'calendario'}
              >
                📅 Ver Calendário
              </Button>
              <Button
                colorScheme="purple"
                size="lg"
                variant="outline"
                onClick={() => window.location.hash = 'membros'}
              >
                👥 Gerenciar Membros
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Dashboard;