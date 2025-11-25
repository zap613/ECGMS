"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { GroupCard } from "@/components/features/group/GroupCard"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { PlusCircle, Filter, Loader2 } from "lucide-react"
// SỬA: Import Service và Type thay vì Mock Data
import { GroupService } from "@/lib/api/groupService"
import type { Group } from "@/lib/types"
import { getCurrentUser, updateCurrentUser } from "@/lib/utils/auth"
import ChangeMockData, { type ChangeMockDataProps } from "@/components/features/ChangeMockData"
import { mockGroups } from "@/lib/mock-data/groups"
import { useToast } from "@/components/ui/use-toast"

export default function FindGroupsPage() {
  const router = useRouter()
  const { toast } = useToast()
  // State để lưu danh sách nhóm và trạng thái tải
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCourse, setSelectedCourse] = React.useState<string>("EXE101");
  const [useMock, setUseMock] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const v = localStorage.getItem('useMock')
      return v ? v === 'true' : true
    } catch { return true }
  });

  // Fetch dữ liệu từ API khi trang được tải
  const loadGroups = React.useCallback(async () => {
    setIsLoading(true)
    try {
      if (useMock) {
        const data = mockGroups
        const filtered = selectedCourse
          ? data.filter(g => (g.courseCode || '').toUpperCase() === selectedCourse.toUpperCase())
          : data
        setGroups(filtered)
      } else {
        const data = await GroupService.getGroups();
        const filtered = selectedCourse
          ? data.filter(g => (g.courseCode || "").toUpperCase() === selectedCourse.toUpperCase())
          : data;
        setGroups(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setIsLoading(false);
    }
  }, [useMock, selectedCourse])

  React.useEffect(() => {
    loadGroups()
  }, [loadGroups])

  // Kiểm tra tình trạng Passed của EXE101 để hiển thị EXE102
  const [user, setUser] = React.useState(() => getCurrentUser() as any);
  const hasPassedEXE101 = Array.isArray((user as any)?.studentCourses)
    ? ((user as any).studentCourses as any[]).some(sc => (sc.courseCode || sc?.course?.courseCode) === "EXE101" && (sc.status || "").toLowerCase() === "passed")
    : false;

  // Xử lý logic Join/Apply (Cần cập nhật logic thực tế)
  const handleJoinGroup = async (groupId: string) => {
    if (!user || user.role !== 'student') {
      toast({ title: "Cần đăng nhập", description: "Vui lòng đăng nhập bằng tài khoản sinh viên." })
      router.push('/login')
      return
    }
    if ((user as any)?.groupId) {
      toast({ title: "Bạn đã có nhóm", description: "Cần rời nhóm cũ trước khi tham gia nhóm mới." })
      return
    }
    const g = groups.find(x => x.groupId === groupId)
    if (!g) return
    if (g.memberCount >= g.maxMembers) {
      toast({ title: "Nhóm đã đủ", description: "Nhóm này đã đủ thành viên." })
      return
    }
    try {
      if (useMock) {
        const newUser = { ...user, groupId };
        updateCurrentUser(newUser)
        setUser(newUser)
        toast({ title: "Tham gia thành công (Mock)", description: `Bạn đã tham gia ${g.groupName}.` })
        router.push(`/student/groups/${groupId}`)
      } else {
        const updated = await GroupService.joinGroup(groupId, (user as any).userId)
        const newUser = { ...user, groupId: updated.groupId }
        updateCurrentUser(newUser)
        setUser(newUser)
        toast({ title: "Tham gia thành công", description: `Bạn đã tham gia ${updated.groupName}.` })
        router.push(`/student/groups/${updated.groupId}`)
      }
    } catch (err: any) {
      console.error("JoinGroup error:", err)
      toast({ title: "Lỗi", description: err?.message || "Không thể tham gia nhóm." })
    }
  };

  const handleApplyToGroup = async (groupId: string) => {
    console.log("Apply to group:", groupId);
    alert("Đã nộp đơn (Mô phỏng).");
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tìm kiếm Nhóm</h1>
            <p className="text-gray-600 mt-1">
              Tìm một nhóm phù hợp hoặc tạo nhóm của riêng bạn.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Chọn môn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXE101">EXE101</SelectItem>
                {hasPassedEXE101 && <SelectItem value="EXE102">EXE102</SelectItem>}
              </SelectContent>
            </Select>
            
            <Button>
                <PlusCircle className="w-4 h-4 mr-2"/>
                Tạo nhóm mới
            </Button>
            <ChangeMockData
              loading={isLoading}
              onRefresh={loadGroups}
              useMock={useMock}
              setUseMock={setUseMock}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groups.length > 0 ? (
                groups.map(group => (
                    <GroupCard 
                      key={group.groupId} 
                      group={group} 
                      onJoin={handleJoinGroup}
                      onApply={handleApplyToGroup}
                      disableJoin={Boolean((user as any)?.groupId)}
                    />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">
                  Chưa có nhóm nào được hiển thị.
                </p>
              )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}