"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import {
  Users,
  BookOpen,
  ClipboardList,
  Award,
  Download,
  TrendingUp,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth";
import { mockCourses } from "@/lib/mock-data/courses";
import { mockGroups } from "@/lib/mock-data/groups";
import { mockTasks } from "@/lib/mock-data/tasks";
import { useToast } from "@/lib/hooks/use-toast";
import { GroupService } from "@/lib/api/groupService";

export default function LecturerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<"xlsx" | "csv">("xlsx");
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

  // Filter data for the signed-in lecturer
  const lecturerCourses = mockCourses.filter(
    (c) => c.lecturerId === user.userId
  );
  const lecturerCourseIds = new Set(lecturerCourses.map((c) => c.courseId));
  const lecturerGroups = mockGroups.filter((g) =>
    lecturerCourseIds.has(g.courseId)
  );

  // Get tasks for lecturer's groups
  const lecturerGroupIds = new Set(lecturerGroups.map((g) => g.groupId));
  const lecturerTasks = mockTasks.filter((t) =>
    lecturerGroupIds.has(t.groupId)
  );

  // Calculate statistics
  const totalGroups = lecturerGroups.length;
  const completedTasks = lecturerTasks.filter(
    (t) => t.status === "completed"
  ).length;
  const totalTasks = lecturerTasks.length;
  const averageCompletion =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate overdue groups (groups with tasks past due date)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = lecturerTasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return t.status !== "completed" && dueDate < today;
  }).length;

  // Calculate skill distribution
  const allSkills = lecturerGroups.flatMap((g) =>
    (g.members || []).flatMap((m: any) => m.skillSet || [])
  );
  const skillCount = allSkills.reduce((acc: any, skill: string) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  const maxSkillCount = Math.max(
    ...Object.values(skillCount).map((v) => (typeof v === "number" ? v : 0)),
    1
  );

  const stats = [
    {
      title: "Tổng số khóa học",
      value: lecturerCourses.length,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Nhóm đang phụ trách",
      value: totalGroups,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Mức độ hoàn thành",
      value: `${averageCompletion}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Nhóm trễ deadline",
      value: overdueCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const handleExportReport = async () => {
    try {
      const blob = await GroupService.exportLecturerReport(
        user.userId,
        exportFormat
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lecturer_report_${
        new Date().toISOString().split("T")[0]
      }.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Xuất báo cáo thành công",
        description: `Đã tạo file báo cáo định dạng ${exportFormat}`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất báo cáo",
        variant: "destructive",
      });
    }
    setShowExportDialog(false);
  };

  // Sample progress data for charts
  const groupProgress = lecturerGroups.map((group) => {
    const groupTasks = lecturerTasks.filter((t) => t.groupId === group.groupId);
    const completed = groupTasks.filter((t) => t.status === "completed").length;
    const progress =
      groupTasks.length > 0
        ? Math.round((completed / groupTasks.length) * 100)
        : 0;
    return { groupName: group.groupName, progress };
  });

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chào mừng quay lại, {user.fullName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Tổng quan nhanh về các khóa học của bạn hôm nay.
            </p>
          </div>
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xuất báo cáo</DialogTitle>
                <DialogDescription>
                  Chọn định dạng file để xuất báo cáo tiến độ và điểm số
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="xlsx"
                      name="format"
                      value="xlsx"
                      checked={exportFormat === "xlsx"}
                      onChange={(e) =>
                        setExportFormat(e.target.value as "xlsx" | "csv")
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="xlsx" className="text-sm font-medium">
                      Excel (.xlsx)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="csv"
                      name="format"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={(e) =>
                        setExportFormat(e.target.value as "xlsx" | "csv")
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="csv" className="text-sm font-medium">
                      CSV (.csv)
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowExportDialog(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleExportReport}>Xuất báo cáo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Biểu đồ tiến độ các nhóm
            </CardTitle>
            <CardDescription>
              Mức độ hoàn thành công việc của các nhóm phụ trách
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupProgress.map((item) => (
                <div key={item.groupName}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.groupName}</span>
                    <span className="text-gray-600">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Distribution Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Phân bố kỹ năng trong các nhóm
            </CardTitle>
            <CardDescription>
              Heatmap thể hiện sự phân bố kỹ năng của sinh viên trong các nhóm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(skillCount).map(
                ([skill, count]: [string, any]) => {
                  const numCount = typeof count === "number" ? count : 0;
                  const intensity = Math.min(numCount / maxSkillCount, 1);
                  const bgOpacity = 0.2 + intensity * 0.6;
                  return (
                    <Badge
                      key={skill}
                      variant="secondary"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${bgOpacity})`,
                        borderColor: `rgba(59, 130, 246, ${0.5})`,
                      }}
                      className="px-3 py-1"
                    >
                      {skill} ({numCount})
                    </Badge>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Khóa học gần đây</CardTitle>
              <CardDescription>
                Các khóa học đang giảng dạy trong học kỳ này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {course.courseName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.courseCode}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Mở khóa học",
                          description: course.courseName,
                        });
                        router.push(`/lecturer/courses/${course.courseId}`);
                      }}
                    >
                      Xem
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Nhóm gần đây</CardTitle>
              <CardDescription>
                Những nhóm mới được tạo gần nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerGroups.slice(0, 3).map((group) => (
                  <div
                    key={group.groupId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {group.groupName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {group.memberCount} thành viên
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Mở nhóm",
                          description: group.groupName,
                        });
                        router.push(`/lecturer/groups/${group.groupId}`);
                      }}
                    >
                      Xem
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
