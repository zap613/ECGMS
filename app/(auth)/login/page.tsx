"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticateUser } from "@/lib/mock-data/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("Login attempt:", { username, password })

    const user = authenticateUser(username, password)
    console.log("Authenticated user:", user)

    if (user) {
      // Store user data in localStorage (will be replaced with proper auth later)
      localStorage.setItem("currentUser", JSON.stringify(user))
      console.log("User stored in localStorage")

      // Redirect based on role
      switch (user.role) {
        case "lecturer":
          console.log("Redirecting to lecturer dashboard")
          router.push("/lecturer/dashboard")
          break
        case "student":
          console.log("Redirecting to student dashboard")
          router.push("/student/dashboard")
          break
        case "admin":
          console.log("Redirecting to admin dashboard")
          router.push("/admin/dashboard")
          break
        default:
          setError("Invalid role")
      }
    } else {
      setError("Invalid username or password")
      console.log("Authentication failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">FU</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">FPT University</CardTitle>
          <CardDescription className="text-base">EXE102 Project Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-blue-800">
              <p>Lecturer: lecturer1 / password123</p>
              <p>Student: student1 / password123</p>
              <p>Admin: admin1 / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
