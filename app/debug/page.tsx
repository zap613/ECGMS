"use client"

import { useState, useEffect } from "react"
import { authenticateUser, mockUsers } from "@/lib/mock-data/auth"
import { getCurrentUser } from "@/lib/utils/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [testResult, setTestResult] = useState<string>("")

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const testLogin = (username: string, password: string) => {
    const user = authenticateUser(username, password)
    setTestResult(JSON.stringify(user, null, 2))
    
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      setCurrentUser(user)
    }
  }

  const clearAuth = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    setTestResult("")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Debug Authentication</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current User</CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-2">
                  <p><strong>Username:</strong> {currentUser.username}</p>
                  <p><strong>Name:</strong> {currentUser.fullName}</p>
                  <p><strong>Role:</strong> {currentUser.role}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                </div>
              ) : (
                <p className="text-gray-500">No user logged in</p>
              )}
              <Button onClick={clearAuth} className="mt-4" variant="outline">
                Clear Auth
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button onClick={() => testLogin("lecturer1", "password123")} className="w-full">
                  Test Lecturer Login
                </Button>
                <Button onClick={() => testLogin("student1", "password123")} className="w-full">
                  Test Student Login
                </Button>
                <Button onClick={() => testLogin("admin1", "password123")} className="w-full">
                  Test Admin Login
                </Button>
                <Button onClick={() => testLogin("wrong", "wrong")} className="w-full" variant="destructive">
                  Test Wrong Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <div key={user.userId} className="p-3 border rounded-lg">
                  <p><strong>{user.username}</strong> ({user.role}) - {user.fullName}</p>
                  <p className="text-sm text-gray-600">Password: password123</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {testResult}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
