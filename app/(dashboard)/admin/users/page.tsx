// app/(dashboard)/admin/users/page.tsx
"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockUsers } from "@/lib/mock-data/auth"
import { Badge } from "@/components/ui/badge"

export default function AdminUsersPage() {
  const users = mockUsers; // Sử dụng dữ liệu người dùng giả

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý tất cả tài khoản trong hệ thống.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Người dùng</CardTitle>
            <CardDescription>Tổng số {users.length} người dùng.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Giao diện bảng sẽ được thêm vào sau */}
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Chức năng bảng quản lý người dùng sẽ được phát triển.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}