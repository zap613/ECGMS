"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/utils/auth"
import { mockTasks } from "@/lib/mock-data/tasks"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function TasksPage() {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks Overview</h1>
          <p className="text-gray-600 mt-1">Monitor all group tasks and progress</p>
        </div>

        <div className="space-y-4">
          {mockTasks.map((task) => (
            <Card key={task.taskId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <CardTitle className="text-lg">{task.taskName}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Group</p>
                    <p className="font-semibold text-gray-900">{task.groupName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assigned To</p>
                    <p className="font-semibold text-gray-900">{task.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold text-gray-900">{task.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Priority</p>
                    <p
                      className={`font-semibold ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {task.priority}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
