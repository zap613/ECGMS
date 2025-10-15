// app/(dashboard)/student/group/page.tsx
"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Settings } from "lucide-react"
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data"

export default function MyGroupPage() {
  // Giả sử sinh viên đang đăng nhập có ID "S001" và đã ở trong nhóm "Cyber Elites"
  const myGroup = mockSummer2025Groups.find(group => group.groupId === "SUM25-C01-G01");

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhóm của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin, thành viên và công việc của nhóm.</p>
        </div>

        {myGroup ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{myGroup.groupName}</CardTitle>
                  <CardDescription>Thuộc khóa học: {myGroup.courseCode}</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><UserPlus className="w-4 h-4 mr-2"/>Mời thành viên</Button>
                    <Button><Settings className="w-4 h-4 mr-2"/>Cài đặt nhóm</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Chức năng quản lý chi tiết nhóm sẽ được phát triển ở đây.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Bạn chưa tham gia nhóm nào</h3>
              <p className="mt-1 text-sm text-gray-500">Hãy vào một khóa học để tìm kiếm hoặc tạo nhóm mới.</p>
              <div className="mt-6">
                <Button>Tìm kiếm nhóm</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}