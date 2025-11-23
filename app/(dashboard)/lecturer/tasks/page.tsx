// app/(dashboard)/lecturer/tasks/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/utils/auth";
import { mockTasks } from "@/lib/mock-data/tasks";
import { useToast } from "@/lib/hooks/use-toast";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  // Filter tasks to those belonging to groups under this lecturer's courses
  let lecturerTasks = mockTasks;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mockGroups } = require("@/lib/mock-data/groups");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mockCourses } = require("@/lib/mock-data/courses");
    const courseIds = new Set(
      mockCourses
        .filter((c: any) => c.lecturerId === user.userId)
        .map((c: any) => c.courseId)
    );
    const groupIds = new Set(
      mockGroups
        .filter((g: any) => courseIds.has(g.courseId))
        .map((g: any) => g.groupId)
    );
    lecturerTasks = mockTasks.filter((t) => groupIds.has(t.groupId));
  } catch {
    lecturerTasks = mockTasks;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan tác vụ</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi tác vụ và tiến độ của các nhóm
          </p>
        </div>

        <div className="space-y-4">
          {lecturerTasks.map((task) => (
            <Card
              key={task.taskId}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <CardTitle className="text-lg">{task.taskName}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {task.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nhóm</p>
                    <p className="font-semibold text-gray-900">
                      {task.groupName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Giao cho</p>
                    <p className="font-semibold text-gray-900">
                      {task.assignedTo}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hạn chót</p>
                    <p className="font-semibold text-gray-900">
                      {task.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ưu tiên</p>
                    <p
                      className={`font-semibold ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {task.priority === "high"
                        ? "Cao"
                        : task.priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() =>
                        toast({
                          title: "Xem chi tiết",
                          description: task.taskName,
                        })
                      }
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
