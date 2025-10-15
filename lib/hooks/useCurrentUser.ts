// Custom hook for managing current user state
'use client'

import { useState, useEffect } from 'react'
import type { User } from '@/lib/types'
import { AuthService } from '@/lib/api/authService'

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await AuthService.login({ username, password })
      setUser(result.user)
      // Store token in localStorage or cookies
      localStorage.setItem('token', result.token)
      return result.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
      setUser(null)
      localStorage.removeItem('token')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    refetch: loadCurrentUser
  }
}
