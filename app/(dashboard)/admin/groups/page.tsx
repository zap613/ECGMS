"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CourseService } from "@/lib/api/courseService"
import { TeamAllocationService } from "@/lib/api/generated"
// Dùng gọi trực tiếp qua BFF Proxy cho endpoint GetAllGroups
import type { Course } from "@/lib/types"
import { CreateEmptyGroupsDialog } from "@/components/features/group/CreateEmptyGroupsDialog"

export default function AdminGroupsPage() {
  const { toast } = useToast()
  const [courses, setCourses] = React.useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>("")
  const [selectedCourseCode, setSelectedCourseCode] = React.useState<string>("")
  const [emptyCount, setEmptyCount] = React.useState<number | null>(null)
  const [loadingCount, setLoadingCount] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      try {
        const list = await CourseService.getCourses()
        setCourses(list)
      } catch (err) {
        toast({ title: "Lỗi", description: "Không thể tải danh sách môn học." })
      }
    })()
  }, [])

  const loadEmptyCount = async (courseId: string) => {
    if (!courseId) return
    setLoadingCount(true)
    setEmptyCount(null)
    try {
      const ts = Date.now()
      const res = await fetch(`/api/proxy/Group/GetAllGroups?_t=${ts}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`GetAllGroups failed: ${res.status} ${res.statusText} ${text}`)
      }
      const groups = await res.json()
      const emptyGroups = (Array.isArray(groups) ? groups : []).filter((g: any) => {
        const sameCourse = g.courseId === courseId
        const hasCountField = typeof g.countMembers !== 'undefined' && g.countMembers !== null
        const isEmptyByCount = hasCountField ? ((g.countMembers ?? 0) === 0) : false
        const isEmptyByGroupMembers = (g.groupMembers?.length ?? 0) === 0
        const isEmptyByMembers = (g.members?.length ?? 0) === 0
        return sameCourse && (isEmptyByCount || isEmptyByGroupMembers || isEmptyByMembers)
      })
      const count = emptyGroups.length
      setEmptyCount(count)
      if (count === 0) {
        toast({ title: "Chưa có nhóm trống", description: `Khoá ${selectedCourseCode} chưa có nhóm trống. Hãy tạo nhóm trống.` })
      }
    } catch (err) {
      toast({ title: "Lỗi", description: "Không thể tải nhóm của môn học." })
    } finally {
      setLoadingCount(false)
    }
  }

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    const c = courses.find(c => c.courseId === courseId)
    setSelectedCourseCode(c?.courseCode || "")
    loadEmptyCount(courseId)
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhóm</h1>
            <p className="text-gray-600 mt-1">Chọn môn học và quản lý nhóm trống.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tạo và kiểm tra nhóm trống</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Môn học</Label>
              <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.courseId} value={c.courseId}>
                      {c.courseCode} - {c.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setDialogOpen(true)} disabled={!selectedCourseId}>Tạo Nhóm Trống</Button>
              {selectedCourseId && (
                <span className="text-sm text-gray-600">
                  {loadingCount ? "Đang kiểm tra nhóm trống..." : (emptyCount === null ? "Chưa kiểm tra" : (emptyCount === 0 ? `Khoá ${selectedCourseCode} chưa có nhóm trống.` : `Khoá ${selectedCourseCode} đang có ${emptyCount} nhóm trống.`))}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={!selectedCourseCode}
                onClick={async () => {
                  if (!selectedCourseCode) {
                    toast({ title: "Thiếu thông tin", description: "Vui lòng chọn môn học." })
                    return
                  }
                  try {
                    await TeamAllocationService.postApiTeamAllocationAllocateTeams({ courseName: selectedCourseCode })
                    toast({ title: "Đã chạy phân bổ", description: `Thuật toán phân bổ cho ${selectedCourseCode} đã kích hoạt.` })
                  } catch (err: any) {
                    console.error("Allocation error:", err)
                    toast({ title: "Lỗi", description: err?.message || "Không thể chạy phân bổ tự động." })
                  }
                }}
              >
                Chạy phân bổ tự động
              </Button>
            </div>
          </CardContent>
        </Card>

        <CreateEmptyGroupsDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={() => {
            setDialogOpen(false)
            if (selectedCourseId) loadEmptyCount(selectedCourseId)
          }}
          initialCourseId={selectedCourseId}
          initialCourseCode={selectedCourseCode}
        />
      </div>
    </DashboardLayout>
  )
}