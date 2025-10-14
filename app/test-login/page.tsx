"use client"

import { useState } from "react"
import { authenticateUser, mockUsers } from "@/lib/mock-data/auth"

export default function TestLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("Testing login with:", { username, password })
    console.log("Available users:", mockUsers)
    
    const user = authenticateUser(username, password)
    console.log("Result:", user)
    
    setResult(JSON.stringify(user, null, 2))
    
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      console.log("User stored in localStorage")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Login Functionality</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Login Test</h2>
          <form onSubmit={handleTest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
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
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Test Login
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Users</h2>
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <div key={user.userId} className="p-3 border rounded-lg">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
