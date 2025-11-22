"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserService } from "@/lib/api/generated/services/UserService"
import { RoleService } from "@/lib/api/generated/services/RoleService"
import { ApiError } from "@/lib/api/generated/core/ApiError"
import type { User } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Đăng nhập theo email (password để trống do passwordHash=null)
      const rawUser = await UserService.getApiUserEmail({ email })
      // Debug giá trị thực tế
      console.log('🔍 Raw User:', rawUser)
      console.log('🔍 Role object:', rawUser?.role)
      console.log('🔍 Role name raw:', rawUser?.role?.roleName)
      console.log('🔍 RoleId:', rawUser?.roleId)
      const token = null

      // Chuẩn hóa về kiểu User tối thiểu cho UI
      const normalized: User = {
        userId: rawUser?.id ?? "",
        username: rawUser?.username || rawUser?.email || email,
        fullName: rawUser?.userProfile?.fullName || rawUser?.username || rawUser?.email || email,
        email: rawUser?.email || email,
        role: 'student' as any,
        groupId: rawUser?.groups?.[0]?.id || rawUser?.groupMembers?.[0]?.groupId || null,
        roleId: rawUser?.roleId,
        skillSet: (rawUser?.skillSet ?? undefined) as any,
        userProfile: rawUser?.userProfile as any,
        studentCourses: (rawUser?.studentCourses ?? undefined) as any[],
        groups: (rawUser?.groups ?? undefined) as any[],
        notifications: (rawUser?.notifications ?? undefined) as any[],
      }

      // Lưu localStorage để UI đọc
      try {
        if (token) localStorage.setItem("token", token)
        localStorage.setItem("currentUser", JSON.stringify(normalized))
      } catch (err) {
        console.warn("Failed to persist auth state", err)
      }

      // Chỉ cho phép Student đăng nhập theo yêu cầu
      const STUDENT_ROLE_ID = '106c46d1-6ac9-413c-b883-ce67f2af6a01'
      let roleName = (rawUser?.role?.roleName || '').toString().trim().toLowerCase()
      if (!roleName && rawUser?.roleId) {
        try {
          const roleVm = await RoleService.getApiRole1({ id: rawUser.roleId })
          roleName = (roleVm?.roleName || '').toString().trim().toLowerCase()
        } catch {}
      }
      const isStudentById = rawUser?.roleId === STUDENT_ROLE_ID
      const isStudentByName = roleName === 'student'
      console.log('✅ isStudentById:', isStudentById, 'isStudentByName:', isStudentByName)
      if (!(isStudentById || isStudentByName)) {
        throw new Error("Chỉ sinh viên (Student) được phép đăng nhập")
      }

      // Redirect theo role (student)
      const role = normalized.role
      if (role === "student") {
        router.push("/student/dashboard")
      } else if (role === "lecturer") {
        router.push("/lecturer/dashboard")
      } else if (role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      let msg = 'Lỗi đăng nhập'
      if (err instanceof ApiError) {
        if (err.status === 404) {
          msg = 'Không tìm thấy tài khoản với email này'
        } else if (err.status === 401) {
          msg = 'Bạn không có quyền đăng nhập'
        } else if (err.status >= 500) {
          msg = 'Máy chủ gặp sự cố, vui lòng thử lại sau'
        } else {
          msg = `${err.status} ${err.statusText}`
        }
      } else if (err?.message) {
        msg = err.message
      }
      setError(msg)
      console.error("Login failed:", err)
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email sinh viên"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu có thể để trống"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={false}
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Sign In
            </Button>
          </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Hướng dẫn đăng nhập:</p>
              <div className="space-y-1 text-xs text-blue-800">
                <p>Nhập email sinh viên, mật khẩu có thể để trống.</p>
                <p>Chỉ tài khoản có role Student được phép đăng nhập.</p>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}