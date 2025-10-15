import type { User } from "@/lib/types"

// Utility functions for authentication - Replace with proper auth later
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function hasRole(role: string): boolean {
  const user = getCurrentUser()
  return user?.role === role
}
