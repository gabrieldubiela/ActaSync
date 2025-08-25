import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  field: {
    fontSize: 12,
    marginBottom: 3,
  },
});

const PDFGenerator = ({ ata }) => {
  const oradoresHabilitados = ata.oradores.filter(orador => orador.habilitado);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Ata da Reunião Sacramental</Text>

        <View style={styles.section}>
          <Text style={styles.field}>
            <Text style={{ fontWeight: 'bold' }}>Data:</Text> {ata.data.toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.field}>
            <Text style={{ fontWeight: 'bold' }}>Tema Geral:</Text> {ata.tema_geral || 'Não definido'}
          </Text>
          <Text style={styles.field}>
            <Text style={{ fontWeight: 'bold' }}>Quem presidiu:</Text> {ata.quem_preside || 'Não definido'}
          </Text>
          <Text style={styles.field}>
            <Text style={{ fontWeight: 'bold' }}>Quem dirigiu:</Text> {ata.quem_dirige || 'Não definido'}
          </Text>
        </View>

        {/* Seção de Hinos */}
        {ata.hino_abertura_id && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hinos e Orações</Text>
            <Text style={styles.field}>
              <Text style={{ fontWeight: 'bold' }}>Hino de Abertura:</Text> {ata.hino_abertura_id}
            </Text>
            {/* Outros hinos... */}
          </View>
        )}

        {/* Seção de Oradores */}
        {oradoresHabilitados.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Oradores</Text>
            {oradoresHabilitados.map((orador, index) => (
              <Text key={index} style={styles.field}>
                - {orador.nome_manual || 'Nome do Orador'} ({orador.subtema})
              </Text>
            ))}
          </View>
        )}

        {/* Lógica para Apoios e Anúncios */}

        {/* Notas sobre cancelamento ou testemunhos */}
        {ata.reuniao_cancelada && (
          <View style={styles.section}>
            <Text style={styles.field}>
              <Text style={{ fontWeight: 'bold' }}>Reunião Cancelada:</Text> {ata.motivo_cancelamento}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFGenerator;