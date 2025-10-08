import type { User } from "@/types"
import { mockUsers } from "@/data/mockUsers"

class AuthService {
  private readonly STORAGE_KEY = "exe_current_user"

  async login(userName: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers.find((u) => u.userName === userName && u.password === password)

    if (!user) {
      throw new Error("Invalid username or password")
    }

    // Store user in localStorage (in real app, store token)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    return user
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.STORAGE_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = new AuthService()
