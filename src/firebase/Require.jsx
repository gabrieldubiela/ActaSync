import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Spinner, Center } from '@chakra-ui/react'

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <Center p={6}><Spinner /></Center>
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}
