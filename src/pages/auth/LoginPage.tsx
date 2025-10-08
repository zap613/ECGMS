"use client"

import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { GraduationCap, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(userName, password)

      // Redirect based on role
      if (user?.role === "lecturer") {
        navigate("/lecturer")
      } else if (user?.role === "student") {
        navigate("/student")
      } else if (user?.role === "admin") {
        navigate("/admin")
      }
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 rounded-2xl mb-4 shadow-xl relative">
              <span className="text-white font-bold text-3xl">FPT</span>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="text-yellow-300" size={20} fill="currentColor" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              EXE Course Grouping
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <GraduationCap size={18} className="text-orange-500" />
              <p className="font-semibold">FPT University</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-5 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 rounded-xl border-2 border-orange-200">
            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-orange-500" />
              Demo Accounts:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-semibold text-blue-600">Lecturer:</span>
                <span className="text-gray-700">lecturer1 / lecturer123</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-semibold text-purple-600">Student:</span>
                <span className="text-gray-700">student1 / student123</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-semibold text-orange-600">Admin:</span>
                <span className="text-gray-700">admin / admin123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
