"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { GroupCard } from "@/components/features/group/GroupCard"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { PlusCircle, Filter, Loader2 } from "lucide-react"
// SỬA: Import Service và Type thay vì Mock Data
import { GroupService } from "@/lib/api/groupService"
import type { Group } from "@/lib/types"
import { getCurrentUser } from "@/lib/utils/auth"

export default function FindGroupsPage() {
  // State để lưu danh sách nhóm và trạng thái tải
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCourse, setSelectedCourse] = React.useState<string>("EXE101");

  // Fetch dữ liệu từ API khi trang được tải
  React.useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // Gọi API lấy toàn bộ nhóm, rồi lọc theo courseCode được chọn
        const data = await GroupService.getGroups();
        const filtered = selectedCourse
          ? data.filter(g => (g.courseCode || "").toUpperCase() === selectedCourse.toUpperCase())
          : data;
        setGroups(filtered);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [selectedCourse]);

  // Kiểm tra tình trạng Passed của EXE101 để hiển thị EXE102
  const user = getCurrentUser();
  const hasPassedEXE101 = Array.isArray((user as any)?.studentCourses)
    ? ((user as any).studentCourses as any[]).some(sc => (sc.courseCode || sc?.course?.courseCode) === "EXE101" && (sc.status || "").toLowerCase() === "passed")
    : false;

  // Xử lý logic Join/Apply (Cần cập nhật logic thực tế)
  const handleJoinGroup = async (groupId: string) => {
    console.log("Join group:", groupId);
    // TODO: Gọi GroupService.joinGroup(groupId, currentUserId)
    alert("Tính năng đang được tích hợp với API.");
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