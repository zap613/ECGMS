"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/lib/utils/auth"
import { TaskService } from "@/lib/api/taskService" // Import Service mới
import type { Task, User } from "@/lib/types"

export default function StudentTasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const fetchMyTasks = async () => {
      if (!user?.groupId) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. Lấy tất cả task của nhóm
        const groupTasks = await TaskService.getTasksByGroupId(user.groupId);
        
        // 2. Lọc task được giao cho user hiện tại
        const myTasks = groupTasks.filter(t => t.assignedToId === user.userId);
        
        setTasks(myTasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress": return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending": return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout role="student">
       <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Công việc của tôi</h1>
          <p className="text-gray-600 mt-1">Danh sách các công việc được giao cho bạn.</p>
        </div>

        {!currentUser?.groupId ? (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Bạn chưa tham gia nhóm nào để có công việc.</p>
                </CardContent>
            </Card>
        ) : (
            <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task) => (
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
                        {task.priority}
                    </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-700">{task.description}</p>
                    <p className="text-xs text-muted-foreground mt-4">
                        Hạn chót: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                    </p>
                </CardContent>
                </Card>
            )) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Bạn chưa được giao công việc nào trong nhóm này.</p>
                    </CardContent>
                </Card>
            )}
            </div>
        )}
      </div>
    </DashboardLayout>
  )
}