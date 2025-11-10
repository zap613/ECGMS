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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Shuffle,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth";
import { mockGroups } from "@/lib/mock-data/groups";
import { useToast } from "@/lib/hooks/use-toast";
import { LecturerService } from "@/lib/api/lecturerService";
import { GroupService } from "@/lib/api/groupService";
import { Progress } from "@/components/ui/progress";

export default function GroupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"my-groups" | "available">(
    "my-groups"
  );
  const [lecturerGroups, setLecturerGroups] = useState<any[]>([]);
  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [canAccept, setCanAccept] = useState(true);
  const [currentCount, setCurrentCount] = useState(0);
  const [maxCount, setMaxCount] = useState(10);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectingGroupId, setRejectingGroupId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    loadGroups(currentUser.userId);
    loadAvailableGroups(currentUser.userId);
  }, [router]);

  const loadGroups = async (lecturerId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { mockCourses } = require("@/lib/mock-data/courses");
      const courseIds = new Set(
        mockCourses
          .filter((c: any) => c.lecturerId === lecturerId)
          .map((c: any) => c.courseId)
      );
      const groups = mockGroups.filter((g) => courseIds.has(g.courseId));
      setLecturerGroups(groups);
    } catch (error) {
      console.error("Error loading groups:", error);
      setLecturerGroups([]);
    }
  };

  const loadAvailableGroups = async (lecturerId: string) => {
    try {
      setLoading(true);
      const result = await LecturerService.getAvailableGroups(lecturerId);
      setAvailableGroups(result.groups);
      setCanAccept(result.canAccept);
      setCurrentCount(result.currentCount);
      setMaxCount(result.maxCount);
    } catch (error) {
      console.error("Error loading available groups:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhóm có sẵn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptGroup = async (groupId: string) => {
    if (!user) return;

    if (!canAccept) {
      toast({
        title: "Đã đạt giới hạn",
        description: `Bạn đã giám sát ${currentCount}/${maxCount} nhóm. Không thể chấp nhận thêm.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await LecturerService.acceptGroup({
        groupId,
        lecturerId: user.userId,
      });

      toast({
        title: "Chấp nhận thành công",
        description: "Bạn đã chấp nhận giám sát nhóm này",
      });

      // Reload data
      await loadGroups(user.userId);
      await loadAvailableGroups(user.userId);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể chấp nhận nhóm",
        variant: "destructive",
      });
    }
  };

  const handleRejectGroupAssignment = async () => {
    if (!user || !rejectingGroupId) return;

    try {
      await LecturerService.rejectGroupAssignment(
        rejectingGroupId,
        user.userId,
        rejectionReason || undefined
      );

      toast({
        title: "Từ chối thành công",
        description: "Bạn đã từ chối giám sát nhóm này",
      });

      setShowRejectDialog(false);
      setRejectingGroupId(null);
      setRejectionReason("");

      // Reload data
      await loadAvailableGroups(user.userId);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể từ chối nhóm",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý nhóm</h1>
            <p className="text-gray-600 mt-1">
              Giám sát và quản lý các nhóm sinh viên được phân công
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

        {/* Group Count Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nhóm đang giám sát</p>
                  <p className="text-2xl font-bold">
                    {currentCount}/{maxCount}
                  </p>
                </div>
                {!canAccept && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Đã đạt giới hạn số nhóm
                    </span>
                  </div>
                )}
              </div>
              <Progress
                value={(currentCount / maxCount) * 100}
                className="w-64 h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="my-groups">Nhóm của tôi</TabsTrigger>
            <TabsTrigger value="available">
              Nhóm có sẵn{" "}
              {availableGroups.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {availableGroups.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card
                  key={group.groupId}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
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
                    <CardDescription>
                      Môn học: {group.courseCode}
                      {group.autoGenerated && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Tạo tự động
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        Thành viên: {group.memberCount}/{group.maxMembers}
                      </p>
                      <p>Trưởng nhóm: {group.leaderName}</p>
                      <div className="flex gap-2 mt-3">
                        {group.majors.map((major: string) => (
                          <Badge
                            key={major}
                            variant="outline"
                            className="text-xs"
                          >
                            {major}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Chưa có nhóm nào trong danh sách
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">Đang tải...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {availableGroups.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Không có nhóm nào có sẵn để chấp nhận
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableGroups.map((group) => (
                      <Card
                        key={group.groupId}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Có sẵn
                            </Badge>
                          </div>
                          <CardTitle className="mt-4">
                            {group.groupName}
                          </CardTitle>
                          <CardDescription>
                            Môn học: {group.courseCode}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <p>
                              Thành viên: {group.memberCount}/{group.maxMembers}
                            </p>
                            <p>Trưởng nhóm: {group.leaderName}</p>
                            <div className="flex gap-2 mt-3">
                              {group.majors.map((major: string) => (
                                <Badge
                                  key={major}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {major}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptGroup(group.groupId);
                              }}
                              disabled={!canAccept}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Chấp nhận
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRejectingGroupId(group.groupId);
                                setShowRejectDialog(true);
                              }}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/lecturer/groups/${group.groupId}`
                                );
                              }}
                            >
                              Xem
                            </Button>
                          </div>
                          {!canAccept && (
                            <p className="text-xs text-red-600 mt-2">
                              Đã đạt giới hạn số nhóm
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Từ chối giám sát nhóm</DialogTitle>
              <DialogDescription>
                Vui lòng nhập lý do từ chối (tùy chọn)
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Nhập lý do từ chối..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectingGroupId(null);
                  setRejectionReason("");
                }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectGroupAssignment}
              >
                Xác nhận từ chối
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
