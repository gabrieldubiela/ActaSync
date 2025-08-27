import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Center, Text } from '@chakra-ui/react'

export default function RequireRole({ role, children }) {
  const { profile, loading } = useAuth()
  if (loading) return <Center p={6}><Text>Carregando...</Text></Center>
  if (!profile || !profile.role) return <Navigate to="/login" replace />
  if (Array.isArray(role) ? role.includes(profile.role) : profile.role === role) {
    return children
  }
  return <Center p={6}><Text>Você não tem permissão para acessar esta página.</Text></Center>
}
