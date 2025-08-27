import React from 'react'
import { Menu, MenuButton, MenuItem, MenuList, Button } from '@chakra-ui/react'

export default function MenuOrador({ textoParaCompartilhar, onGerarPDF, onCancelar }) {
  async function onCopiar() {
    if (!textoParaCompartilhar) return
    await navigator.clipboard.writeText(textoParaCompartilhar)
    alert('Texto copiado para a área de transferência!')
  }

  async function onCompartilhar() {
    if (!textoParaCompartilhar) return
    if (navigator.share) {
      try {
        await navigator.share({ text: textoParaCompartilhar })
      } catch (e) {
        await navigator.clipboard.writeText(textoParaCompartilhar)
        alert('Compartilhamento não disponível — texto copiado.')
      }
    } else {
      await navigator.clipboard.writeText(textoParaCompartilhar)
      alert('Compartilhamento não disponível — texto copiado.')
    }
  }

  return (
    <Menu>
      <MenuButton as={Button}>Ações</MenuButton>
      <MenuList>
        <MenuItem onClick={onCopiar}>Copiar</MenuItem>
        <MenuItem onClick={onCompartilhar}>Compartilhar</MenuItem>
        <MenuItem onClick={onGerarPDF}>Gerar PDF</MenuItem>
        <MenuItem onClick={onCancelar} color="red.500">Cancelar</MenuItem>
      </MenuList>
    </Menu>
  )
}
