import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Plus, Users, Calendar, BookOpen } from "lucide-react"
import { mockCourses } from "@/data/mockCourses"
import { Link } from "react-router-dom"

export default function CoursesPage() {
  const gradients = [
    { from: "from-blue-500", to: "to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    { from: "from-purple-500", to: "to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
    { from: "from-orange-500", to: "to-orange-600", bg: "bg-orange-50", text: "text-orange-600" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Courses
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your courses and student groups</p>
          </div>
          <Button className="shadow-lg">
            <Plus size={20} className="mr-2" />
            Create Course
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCourses.map((course, index) => {
            const gradient = gradients[index % gradients.length]
            return (
              <Card key={course.courseId} className="card-hover border-0 shadow-xl overflow-hidden">
                <CardHeader
                  className={`bg-gradient-to-r ${gradient.from} ${gradient.to} text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{course.courseCode}</h3>
                        <p className="text-sm text-white/90 mt-1">{course.courseName}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full shadow-lg">
                      Active
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">{course.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Calendar size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {course.semester} {course.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Users size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Group Size: {course.minGroupSize}-{course.maxGroupSize} members
                      </span>
                    </div>
                  </div>

                  <Link to={`/lecturer/courses/${course.courseId}`}>
                    <Button
                      variant="outline"
                      className={`w-full border-2 ${gradient.text} border-current hover:bg-gradient-to-r ${gradient.from} ${gradient.to} hover:text-white hover:border-transparent font-bold`}
                    >
                      View Course Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
