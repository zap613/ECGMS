"use client"

import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Users, Settings, Plus } from "lucide-react"
import { mockCourses } from "@/data/mockCourses"
import { mockGroups } from "@/data/mockGroups"

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const course = mockCourses.find((c) => c.courseId === courseId)
  const courseGroups = mockGroups.filter((g) => g.courseId === courseId)

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.courseCode}</h1>
            <p className="text-lg text-gray-600 mt-1">{course.courseName}</p>
          </div>
          <Button variant="outline">
            <Settings size={20} className="mr-2" />
            Settings
          </Button>
        </div>

        {/* Course Info */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Course Information</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="text-gray-900 mt-1">{course.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p className="text-gray-900 mt-1">
                  {course.semester} {course.year}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Group Size</p>
                <p className="text-gray-900 mt-1">
                  {course.minGroupSize} - {course.maxGroupSize} members
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                <p className="text-gray-900 mt-1">{courseGroups.length} groups</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Groups</h2>
              <Button size="sm">
                <Plus size={18} className="mr-2" />
                Create Group
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseGroups.map((group) => (
                <div
                  key={group.groupId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{group.groupName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {group.memberCount}/{group.maxMembers} members
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            group.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {group.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
