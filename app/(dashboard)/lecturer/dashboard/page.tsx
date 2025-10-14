"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Users, BookOpen, ClipboardList, Award } from "lucide-react"
import { getCurrentUser } from "@/lib/utils/auth"
import { mockCourses } from "@/lib/mock-data/courses"
import { mockGroups } from "@/lib/mock-data/groups"

export default function LecturerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  const stats = [
    {
      title: "Total Courses",
      value: mockCourses.length,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Active Groups",
      value: mockGroups.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Tasks",
      value: 12,
      icon: ClipboardList,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Grading Items",
      value: 8,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your courses today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your active courses this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{course.courseName}</p>
                      <p className="text-sm text-gray-600">{course.courseCode}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/lecturer/courses/${course.courseId}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Groups</CardTitle>
              <CardDescription>Latest group formations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGroups.slice(0, 3).map((group) => (
                  <div
                    key={group.groupId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{group.groupName}</p>
                      <p className="text-sm text-gray-600">{group.memberCount} members</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/lecturer/groups/${group.groupId}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
