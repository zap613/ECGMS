"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Settings, Filter, PlusCircle, LogOut, Loader2, AlertCircle } from "lucide-react"
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data"
import { getCurrentUser, updateCurrentUser } from "@/lib/utils/auth"
import { GroupCard } from "@/components/features/group/GroupCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, Group } from "@/lib/types"
import { GroupService } from "@/lib/api/groupService"
import { Badge } from "@/components/ui/badge" // Import Badge

export default function MyGroupPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isJoining, setIsJoining] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [myGroup, setMyGroup] = React.useState<Group | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user?.groupId) {
      // Tìm nhóm từ mock data
      const group = mockSummer2025Groups.find(g => g.groupId === user.groupId) || null;
      setMyGroup(group);
    }

    setIsLoading(false);
  }, []);

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUser) return;
    setIsJoining(true);
    setError(null);
    try {
      const { group: updatedGroup, user: updatedUser } = await GroupService.joinGroup(groupId, currentUser.userId);
      updateCurrentUser(updatedUser); 
      setCurrentUser(updatedUser);
      setMyGroup(updatedGroup);
      alert(`Tham gia nhóm "${updatedGroup.groupName}" thành công!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleApplyToGroup = async (groupId: string) => {
     alert(`Đã nộp đơn vào nhóm ${groupId}. Chức năng này sẽ được phát triển.`);
  }

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
    // Giả sử sinh viên đã chọn 1 khóa học.
    const demoCourseId = "SUM25-C01"; 
    
    const availableGroups = mockSummer2025Groups.filter(
      group => group.courseId === demoCourseId && 
               group.status !== 'private' && 
               group.status !== 'finalize'
    );

    return (
      <DashboardLayout role="student">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tìm kiếm Nhóm (Khóa học {demoCourseId})</h1>
              <p className="text-gray-600 mt-1">
                Bạn chưa tham gia nhóm nào. Hãy tìm một nhóm phù hợp hoặc tạo nhóm của riêng bạn.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Filter className="w-4 h-4 mr-2"/>Lọc</Button>
              <Button><PlusCircle className="w-4 h-4 mr-2"/>Tạo nhóm mới</Button>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableGroups.map(group => (
              <GroupCard 
                key={group.groupId} 
                group={group} 
                onJoin={handleJoinGroup}
                onApply={handleApplyToGroup}
                isJoining={isJoining}
              />
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
            <h3 className="font-semibold mb-4 text-lg">Danh sách thành viên ({myGroup.memberCount}/{myGroup.maxMembers})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGroup.members.map(member => (
                <div key={member.userId} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 shadow-sm">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.fullName}</p>
                    <p className="text-xs text-muted-foreground">{member.userId}</p>
                    {/* ===== CẬP NHẬT TẠI ĐÂY (Bước 4) ===== */}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{member.major}</Badge>
                      {member.role === 'leader' && <Badge variant="default" className="text-xs">Trưởng nhóm</Badge>}
                    </div>
                    {/* ================================== */}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold mb-4 text-lg">Công việc của nhóm</h3>
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