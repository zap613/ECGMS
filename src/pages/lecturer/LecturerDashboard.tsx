import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { BookOpen, Users, ClipboardList, TrendingUp, ArrowRight } from "lucide-react"
import { mockCourses } from "@/data/mockCourses"
import { mockGroups } from "@/data/mockGroups"

export default function LecturerDashboard() {
  const stats = [
    {
      icon: BookOpen,
      label: "Active Courses",
      value: mockCourses.length,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      icon: Users,
      label: "Total Groups",
      value: mockGroups.length,
      gradient: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
    },
    {
      icon: ClipboardList,
      label: "Pending Tasks",
      value: 12,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      icon: TrendingUp,
      label: "Completion Rate",
      value: "87%",
      gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's your overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="card-hover border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6 relative">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-4xl font-extrabold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Courses</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm font-semibold">
                View All
                <ArrowRight size={18} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockCourses.map((course, index) => {
                const gradients = [
                  "from-blue-500 to-blue-600",
                  "from-purple-500 to-purple-600",
                  "from-orange-500 to-orange-600",
                ]
                const gradient = gradients[index % gradients.length]

                return (
                  <div
                    key={course.courseId}
                    className="relative flex items-center justify-between p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 card-hover"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${gradient} rounded-l-xl`} />
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{course.courseName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                          {course.semester} {course.year}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                          Group Size: {course.minGroupSize}-{course.maxGroupSize}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`px-6 py-3 text-sm font-bold text-white bg-gradient-to-r ${gradient} rounded-xl hover:shadow-lg transition-all`}
                    >
                      View Details
                    </button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
