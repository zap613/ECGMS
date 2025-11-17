"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { GroupCard } from "@/components/features/group/GroupCard"
import { Button } from "@/components/ui/button"
import { PlusCircle, Filter, Loader2 } from "lucide-react"
// SỬA: Import Service và Type thay vì Mock Data
import { GroupService } from "@/lib/api/groupService"
import type { Group } from "@/lib/types"

export default function FindGroupsPage({ params }: { params: { courseId: string } }) {
  // State để lưu danh sách nhóm và trạng thái tải
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch dữ liệu từ API khi trang được tải
  React.useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // Gọi API lấy danh sách nhóm theo courseId
        const data = await GroupService.getGroups(params.courseId);
        
        // Lọc phía client (nếu API chưa hỗ trợ filter status)
        // Chỉ hiện các nhóm không phải 'private'
        const visibleGroups = data.filter(g => g.status !== 'private');
        
        setGroups(visibleGroups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.courseId) {
      fetchGroups();
    }
  }, [params.courseId]);

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
            <h1 className="text-3xl font-bold text-gray-900">Tìm kiếm Nhóm - {params.courseId}</h1>
            <p className="text-gray-600 mt-1">
              Tìm một nhóm phù hợp hoặc tạo nhóm của riêng bạn.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
                <Filter className="w-4 h-4 mr-2"/>
                Lọc
            </Button>
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
                  Chưa có nhóm nào trong khóa học này.
                </p>
              )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}