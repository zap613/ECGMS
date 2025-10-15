// app/(dashboard)/student/group/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Settings, Filter, PlusCircle, LogOut } from "lucide-react"
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data"
import { getCurrentUser } from "@/lib/utils/auth"
import { GroupCard } from "@/components/features/group/GroupCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MyGroupPage() {
  const router = useRouter();
  // Lấy thông tin người dùng hiện tại từ localStorage
  const currentUser = getCurrentUser();

  // Tìm thông tin nhóm của sinh viên dựa trên groupId
  const myGroup = currentUser?.groupId
    ? mockSummer2025Groups.find(group => group.groupId === currentUser.groupId)
    : null;
    
  // --- GIAO DIỆN KHI SINH VIÊN CHƯA CÓ NHÓM ---
  if (!myGroup) {
    // Lọc các nhóm có thể tham gia trong một khóa học cụ thể để demo
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