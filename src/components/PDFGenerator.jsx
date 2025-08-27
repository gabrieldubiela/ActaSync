import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  h1: { fontSize: 18, marginBottom: 8 },
  row: { marginBottom: 4 }
})

export default function PDFGenerator({ ata }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Ata da Reunião Sacramental</Text>
        {ata?.data && <View style={styles.row}><Text>Data: {ata.data}</Text></View>}
        {ata?.tema_geral && <View style={styles.row}><Text>Tema: {ata.tema_geral}</Text></View>}
        {ata?.preside && <View style={styles.row}><Text>Preside: {ata.preside}</Text></View>}
        {ata?.dirige && <View style={styles.row}><Text>Dirige: {ata.dirige}</Text></View>}
      </Page>
    </Document>
  )
}
