// app/(dashboard)/student/group/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Settings, Filter, PlusCircle, LogOut, Loader2 } from "lucide-react"
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data"
import { getCurrentUser } from "@/lib/utils/auth"
import { GroupCard } from "@/components/features/group/GroupCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, Group } from "@/lib/types"

export default function MyGroupPage() {
  const router = useRouter();
  
  // Thêm state để quản lý trạng thái tải và dữ liệu
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [myGroup, setMyGroup] = React.useState<Group | null>(null);

  React.useEffect(() => {
    // Logic này chỉ chạy ở phía client sau khi component đã được render
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user?.groupId) {
      const group = mockSummer2025Groups.find(g => g.groupId === user.groupId) || null;
      setMyGroup(group);
    }

    setIsLoading(false); // Kết thúc trạng thái tải
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần

  // --- GIAO DIỆN KHI ĐANG TẢI DỮ LIỆU ---
  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <p className="ml-4 text-gray-600">Đang tải thông tin nhóm...</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- GIAO DIỆN KHI SINH VIÊN CHƯA CÓ NHÓM ---
  if (!myGroup) {
    const availableGroups = mockSummer2025Groups.filter(
      group => group.courseId === "SUM25-C01" && // Hardcode 1 khóa học để demo
               group.status !== 'private' && 
               group.status !== 'finalize'
    );

    return (
      <DashboardLayout role="student">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tìm kiếm Nhóm</h1>
              <p className="text-gray-600 mt-1">
                Bạn chưa tham gia nhóm nào. Hãy tìm một nhóm phù hợp hoặc tạo nhóm của riêng bạn.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Filter className="w-4 h-4 mr-2"/>Lọc</Button>
              <Button><PlusCircle className="w-4 h-4 mr-2"/>Tạo nhóm mới</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableGroups.map(group => (
              <GroupCard key={group.groupId} group={group} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- GIAO DIỆN KHI SINH VIÊN ĐÃ CÓ NHÓM ---
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhóm của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin, thành viên và công việc của nhóm.</p>
        </div>

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
                  <Button variant="destructive"><LogOut className="w-4 h-4 mr-2"/>Rời nhóm</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-4">Danh sách thành viên ({myGroup.memberCount}/{myGroup.maxMembers})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGroup.members.map(member => (
                <div key={member.userId} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.fullName}</p>
                    <p className="text-xs text-muted-foreground">{member.userId}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold mb-4">Công việc của nhóm</h3>
                <div className="border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Chức năng quản lý công việc sẽ được hiển thị ở đây.</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}