"use client"

import { useState } from "react"
import { authenticateUser } from "@/lib/mock-data/auth"

export default function LoginTestPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    console.log("Login attempt:", { username, password })

    try {
      const user = authenticateUser(username, password)
      console.log("Authentication result:", user)

      if (user) {
        setMessage(`✅ Login successful! Welcome ${user.fullName} (${user.role})`)
        localStorage.setItem("currentUser", JSON.stringify(user))
      } else {
        setMessage("❌ Login failed! Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setMessage(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login Test</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 rounded-md bg-gray-100">
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">Demo Accounts:</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• lecturer1 / password123</p>
            <p>• student1 / password123</p>
            <p>• admin1 / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
