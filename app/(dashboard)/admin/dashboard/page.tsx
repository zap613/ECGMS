// app/(dashboard)/admin/dashboard/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { getCurrentUser } from "@/lib/utils/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { BookOpen, Users, Layers, Clock, AlertCircle, BarChart3, PlusCircle, ClipboardList, Shuffle } from "lucide-react"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"

type DashboardData = {
  activeCourses: number
  students: { total: number; unassigned: number }
  groups: { total: number; empty: number }
  nearestDeadline: { courseCode: string; courseName: string; deadline: string }
  courseProgress: { courseCode: string; courseName: string; assigned: number; unassigned: number; totalStudents: number }[]
  attentionNeeded: {
    lowMemberGroups: { groupId: string; name: string; courseCode: string; memberCount: number; maxMembers: number }[]
    missingMentorCourses: { courseCode: string; courseName: string }[]
  }
}

const mockDashboardData: DashboardData = {
  activeCourses: 3,
  students: { total: 120, unassigned: 45 },
  groups: { total: 30, empty: 6 },
  nearestDeadline: {
    courseCode: "EXE101",
    courseName: "Nhập môn Kỹ thuật",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  courseProgress: [
    { courseCode: "EXE101", courseName: "EXE101", assigned: 35, unassigned: 5, totalStudents: 40 },
    { courseCode: "EXE201", courseName: "EXE201", assigned: 50, unassigned: 20, totalStudents: 70 },
    { courseCode: "EXE301", courseName: "EXE301", assigned: 10, unassigned: 0, totalStudents: 10 },
  ],
  attentionNeeded: {
    lowMemberGroups: [
      { groupId: "G-EXE101-01", name: "EXE101-01", courseCode: "EXE101", memberCount: 1, maxMembers: 5 },
      { groupId: "G-EXE201-03", name: "EXE201-03", courseCode: "EXE201", memberCount: 1, maxMembers: 5 },
    ],
    missingMentorCourses: [
      { courseCode: "EXE201", courseName: "Phát triển phần mềm" },
      { courseCode: "EXE301", courseName: "Đồ án chuyên ngành" },
    ],
  },
}

function formatCountdown(targetIso: string) {
  const diffMs = new Date(targetIso).getTime() - Date.now()
  if (diffMs <= 0) return "Đã quá hạn"
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  if (days > 0) return `${days} ngày nữa`
  return `${hours} giờ nữa`
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    setData(mockDashboardData)
  }, [])

  const progressData = useMemo(() => {
    if (!data) return []
    return data.courseProgress.map((c) => ({
      course: c.courseName,
      "Đã có nhóm": c.assigned,
      "Chưa có nhóm": c.unassigned,
    }))
  }, [data])

  if (!user || !data) return null

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trung tâm chỉ huy</h1>
            <p className="text-gray-600 mt-1">Tổng quan và cảnh báo tiến độ ghép nhóm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.activeCourses}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unassigned Students</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{data.students.unassigned}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Groups</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.groups.total}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <Layers className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nearest Deadline</p>
                  <p className="text-sm text-gray-900 mt-2">
                    {data.nearestDeadline.courseCode} - {formatCountdown(data.nearestDeadline.deadline)}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Tiến độ ghép nhóm theo môn học
              </CardTitle>
              <CardDescription>Phân bổ số sinh viên đã có nhóm và chưa có nhóm</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "Đã có nhóm": { label: "Đã có nhóm", color: "hsl(var(--chart-1))" },
                  "Chưa có nhóm": { label: "Chưa có nhóm", color: "hsl(var(--chart-2))" },
                }}
                className="w-full h-[320px]"
              >
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="course" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Đã có nhóm" fill="var(--color-Đã có nhóm)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Chưa có nhóm" fill="var(--color-Chưa có nhóm)" radius={[4, 4, 0, 0]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Cần chú ý
              </CardTitle>
              <CardDescription>Nhóm thiếu người hoặc môn chưa có mentor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Nhóm đang thiếu người</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhóm</TableHead>
                      <TableHead>Môn</TableHead>
                      <TableHead>Thành viên</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.attentionNeeded.lowMemberGroups.map((g) => (
                      <TableRow key={g.groupId}>
                        <TableCell className="font-medium">{g.name}</TableCell>
                        <TableCell>{g.courseCode}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{g.memberCount}/{g.maxMembers}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({ title: "Ghép nhanh", description: "Chức năng đang phát triển" })
                            }
                          >
                            Ghép nhanh
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Môn chưa có Mentor</p>
                <div className="flex flex-wrap gap-2">
                  {data.attentionNeeded.missingMentorCourses.map((c) => (
                    <Badge key={c.courseCode} variant="secondary">
                      {c.courseCode}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <Button className="gap-2" onClick={() => router.push("/admin/courses")}> 
            <PlusCircle className="w-4 h-4" />
            Thêm môn học mới
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Duyệt đề tài", description: "Chức năng đang phát triển" })}>
            <ClipboardList className="w-4 h-4" />
            Duyệt đề tài
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => toast({ title: "Phân bổ tự động", description: "Chức năng đang phát triển" })}>
            <Shuffle className="w-4 h-4" />
            Phân bổ tự động
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
