"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, User, Mail, Code2, BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth";
import { useToast } from "@/lib/hooks/use-toast";
import { GroupService, type ApiGroup } from "@/lib/api/groupService";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<ApiGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    const groupId = params.groupId as string;

    const loadGroup = async () => {
      try {
        setLoading(true);
        const data = await GroupService.getGroupById(groupId);
        if (!data) {
          toast({ title: "Lỗi", description: "Không tìm thấy nhóm" });
          router.push("/lecturer/groups");
          return;
        }
        setGroup(data);
      } catch (error) {
        console.error("Error loading group detail:", error);
        toast({ title: "Lỗi", description: "Không thể tải chi tiết nhóm" });
        router.push("/lecturer/groups");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [router, params.groupId, toast]);

  if (!user) return null;
  if (loading || !group) {
    return (
      <DashboardLayout role="lecturer">
        <div className="p-6 text-gray-600">Đang tải chi tiết nhóm...</div>
      </DashboardLayout>
    );
  }

  const statusColor =
    group.status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/lecturer/groups")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {group.courseName}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Thông tin nhóm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <Badge className={statusColor}>
                  {group.status ? group.status : "Chưa cập nhật"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số thành viên</p>
                <p className="font-semibold">
                  {group.members.length}
                  {group.maxMembers ? ` / ${group.maxMembers}` : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chủ đề</p>
                <p className="font-semibold">
                  {group.topicName || "Chưa có chủ đề"}
                </p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-600">Mã môn học</p>
                <p className="font-semibold">{group.courseId}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Thành viên nhóm
            </CardTitle>
            <CardDescription>
              Danh sách thành viên, email và kỹ năng trong nhóm
            </CardDescription>
          </CardHeader>
          <CardContent>
            {group.members.length === 0 ? (
              <p className="text-gray-600">Nhóm hiện chưa có thành viên nào.</p>
            ) : (
              <div className="space-y-4">
                {group.members.map((member) => (
                  <Card
                    key={member.userId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {member.username}
                            </h3>
                            {member.roleInGroup && (
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {member.roleInGroup}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {member.email}
                          </p>
                          {member.skillSet && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Code2 className="w-4 h-4 text-gray-500" />
                              <span>Kỹ năng: {member.skillSet}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
