"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Shuffle,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth";
import { mockGroups } from "@/lib/mock-data/groups";
import { useToast } from "@/lib/hooks/use-toast";

export default function GroupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
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

  // Show only groups that belong to lecturer's courses
  const lecturerCourseIds = new Set(
    (typeof user.userId === "string" ? user.userId : "") && []
  );
  // Derive course IDs from mockCourses via dynamic import at runtime to avoid circular deps in mock layer
  // Note: keep UI responsive; fall back to all groups if import fails
  let lecturerGroups = mockGroups;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mockCourses } = require("@/lib/mock-data/courses");
    const courseIds = new Set(
      mockCourses
        .filter((c: any) => c.lecturerId === user.userId)
        .map((c: any) => c.courseId)
    );
    lecturerGroups = mockGroups.filter((g) => courseIds.has(g.courseId));
  } catch {
    lecturerGroups = mockGroups;
  }

  // Filter groups by approval status
  const filteredGroups =
    filterStatus === "all"
      ? lecturerGroups
      : lecturerGroups.filter((g) => g.approvalStatus === filterStatus);

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getApprovalStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "pending":
        return "Chờ duyệt";
      default:
        return "Không xác định";
    }
  };

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nhóm</h1>
            <p className="text-gray-600 mt-1">
              Quản lý các nhóm sinh viên và phân công
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() =>
                toast({
                  title: "Tạo nhóm tự động",
                  description:
                    "Hành động mô phỏng (ràng buộc được kiểm tra ở backend)",
                })
              }
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Sinh nhóm tự động
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.groupId}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                toast({ title: "Mở nhóm", description: group.groupName });
                router.push(`/lecturer/groups/${group.groupId}`);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        group.status === "finalize"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {group.status}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getApprovalStatusColor(
                        group.approvalStatus
                      )}`}
                    >
                      {getApprovalStatusIcon(group.approvalStatus)}
                      {getApprovalStatusText(group.approvalStatus)}
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-4">{group.groupName}</CardTitle>
                <CardDescription>Course: {group.courseCode}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Members: {group.memberCount}/6</p>
                  <p>Leader: {group.leaderName}</p>
                  <div className="flex gap-2 mt-3">
                    {group.majors.map((major) => (
                      <span
                        key={major}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        {major}
                      </span>
                    ))}
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
