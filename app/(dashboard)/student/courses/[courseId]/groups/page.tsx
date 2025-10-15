//  app/(dashboard)/student/courses/[courseId]/groups/page.tsx
"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { GroupCard } from "@/components/features/group/GroupCard"
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data"
import { Button } from "@/components/ui/button"
import { PlusCircle, Filter } from "lucide-react"

export default function FindGroupsPage({ params }: { params: { courseId: string } }) {
  // Lọc các nhóm thuộc về khóa học này
  const groupsInCourse = mockSummer2025Groups.filter(
    group => group.courseId === params.courseId // Sử dụng params.courseId thay vì hardcode
  ).filter(group => group.status !== 'private'); // Ẩn các nhóm riêng tư

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupsInCourse.map(group => (
                <GroupCard key={group.groupId} group={group} />
            ))}
        </div>
      </div>
    </DashboardLayout>
  )
}