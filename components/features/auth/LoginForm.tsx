// Login form component
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { AuthService } from '@/lib/api/authService'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useCurrentUser()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await AuthService.login({ username, password })
      // Lưu thông tin đăng nhập để các trang dashboard đọc được
      try {
        localStorage.setItem('token', result.token)
        localStorage.setItem('currentUser', JSON.stringify(result.user))
        // Thiết lập cookie để API routes server-side đọc token
        // Lưu ý: đây là cookie không-HTTPOnly dùng tạm cho demo
        document.cookie = `auth_token=${result.token}; Path=/; SameSite=Lax`;
      } catch (e) {
        console.warn('Failed to persist auth state', e)
      }
      setError(null)
      // Redirect based on user role (đơn giản hóa về /dashboard)
      router.push('/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg)
      console.error('Login failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Đăng nhập ECGMS</CardTitle>
        <CardDescription>
          Hệ thống quản lý ghép nhóm môn học EXE
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Tên đăng nhập
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Demo accounts:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>lecturer1 / password123</li>
            <li>student1 / password123</li>
            <li>admin1 / password123</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}