// app/(dashboard)/student/tasks/page.tsx
"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockTasks } from "@/lib/mock-data/tasks"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function StudentTasksPage() {
  // Giả sử đây là ID của sinh viên đang đăng nhập
  const currentStudentId = "S001"; 
  const myTasks = mockTasks.filter(task => task.assignedToId === currentStudentId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress": return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending": return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return null;
    }
  }
  
  return (
    <DashboardLayout role="student">
       <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Công việc của tôi</h1>
          <p className="text-gray-600 mt-1">Danh sách các công việc được giao cho bạn.</p>
        </div>

        <div className="space-y-4">
          {myTasks.length > 0 ? myTasks.map((task) => (
            <Card key={task.taskId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <CardTitle className="text-lg">{task.taskName}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Từ nhóm: {task.groupName}</p>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    Độ ưu tiên: {task.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                 <p className="text-sm text-gray-700">{task.description}</p>
                 <p className="text-xs text-muted-foreground mt-4">Hạn chót: {task.dueDate}</p>
              </CardContent>
            </Card>
          )) : (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Bạn chưa được giao công việc nào.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}