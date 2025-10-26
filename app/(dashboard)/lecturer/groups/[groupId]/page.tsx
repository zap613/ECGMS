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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Users,
  User,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth";
import { mockGroups } from "@/lib/mock-data/groups";
import { mockUsers } from "@/lib/mock-data/auth";
import { useToast } from "@/lib/hooks/use-toast";
import { GroupService } from "@/lib/api/groupService";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    // Find group
    const groupId = params.groupId as string;
    const foundGroup = mockGroups.find((g) => g.groupId === groupId);

    if (!foundGroup) {
      toast({ title: "Error", description: "Group not found" });
      router.push("/lecturer/groups");
      return;
    }

    setGroup(foundGroup);

    // Mock group members with detailed information
    const members = [
      {
        userId: "S001",
        fullName: "Tran Thi B",
        major: "SE",
        skills: ["Frontend", "React", "TypeScript", "UI/UX"],
        role: "leader",
        roleText: "Trưởng nhóm",
        email: "tranthib@fpt.edu.vn",
        avatarUrl: "/placeholder-user.jpg",
      },
      {
        userId: "S002",
        fullName: "Le Van C",
        major: "SS",
        skills: ["Backend", "Node.js", "Database", "API Design"],
        role: "member",
        roleText: "Thành viên",
        email: "levanc@fpt.edu.vn",
        avatarUrl: "/placeholder-user.jpg",
      },
      {
        userId: "S003",
        fullName: "Nguyen Van E",
        major: "SE",
        skills: ["DevOps", "CI/CD", "AWS", "Docker"],
        role: "secretary",
        roleText: "Thư ký",
        email: "nguyenvane@fpt.edu.vn",
        avatarUrl: "/placeholder-user.jpg",
      },
      {
        userId: "S004",
        fullName: "Bui Minh H",
        major: "SS",
        skills: ["Business Analysis", "Testing", "QA", "Documentation"],
        role: "member",
        roleText: "Thành viên",
        email: "buiminhh@fpt.edu.vn",
        avatarUrl: "/placeholder-user.jpg",
      },
      {
        userId: "S005",
        fullName: "Vuong Thanh I",
        major: "SE",
        skills: ["Frontend", "VueJS", "UI/UX", "Mobile"],
        role: "treasurer",
        roleText: "Thủ quỹ",
        email: "vuongthanhi@fpt.edu.vn",
        avatarUrl: "/placeholder-user.jpg",
      },
    ];
    setGroupMembers(members);
  }, [router, params.groupId, toast]);

  if (!user || !group) return null;

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "leader":
        return <Award className="w-4 h-4 text-yellow-600" />;
      case "secretary":
        return <User className="w-4 h-4 text-blue-600" />;
      case "treasurer":
        return <User className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleApprove = () => {
    GroupService.approveGroup(group.groupId, user.userId)
      .then(() =>
        toast({
          title: "Phê duyệt nhóm",
          description: `Đã phê duyệt nhóm ${group.groupName}`,
        })
      )
      .catch(() => toast({ title: "Lỗi", description: "Không thể phê duyệt" }));
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do từ chối",
      });
      return;
    }

    GroupService.rejectGroup(group.groupId, rejectionReason, user.userId)
      .then(() =>
        toast({
          title: "Từ chối nhóm",
          description: `Đã từ chối nhóm ${group.groupName}`,
        })
      )
      .catch(() => toast({ title: "Lỗi", description: "Không thể từ chối" }));
    setShowRejectDialog(false);
    setRejectionReason("");
    // In real app, this would call API to reject group with reason
  };

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
            <h1 className="text-3xl font-bold text-gray-900">
              {group.groupName}
            </h1>
            <p className="text-gray-600 mt-1">{group.courseCode}</p>
          </div>
        </div>

        {/* Group Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Trạng thái nhóm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Trạng thái phê duyệt</p>
                <Badge className={getApprovalStatusColor(group.approvalStatus)}>
                  {getApprovalStatusText(group.approvalStatus)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số thành viên</p>
                <p className="font-semibold">
                  {group.memberCount}/{group.maxMembers}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chuyên ngành</p>
                <div className="flex gap-1">
                  {group.majors.map((major: string) => (
                    <Badge key={major} variant="outline" className="text-xs">
                      {major}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày tạo</p>
                <p className="font-semibold">{group.createdDate}</p>
              </div>
            </div>

            {group.rejectionReason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Lý do từ chối:</p>
                    <p className="text-sm text-red-700 mt-1">
                      {group.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {group.approvalStatus === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Phê duyệt nhóm
                </Button>
                <Dialog
                  open={showRejectDialog}
                  onOpenChange={setShowRejectDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <XCircle className="w-4 h-4 mr-2" />
                      Từ chối nhóm
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Từ chối nhóm</DialogTitle>
                      <DialogDescription>
                        Vui lòng nhập lý do từ chối nhóm {group.groupName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Nhập lý do từ chối và hướng dẫn điều chỉnh..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectDialog(false)}
                      >
                        Hủy
                      </Button>
                      <Button variant="destructive" onClick={handleReject}>
                        Xác nhận từ chối
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Thành viên nhóm
            </CardTitle>
            <CardDescription>
              Danh sách thành viên, chuyên ngành, kỹ năng và vai trò trong nhóm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupMembers.map((member) => (
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
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {member.fullName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {member.major}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(member.role)}
                            <span className="text-sm text-gray-600">
                              {member.roleText}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {member.email}
                        </p>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Kỹ năng:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill: string) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const reason = prompt("Lý do xóa thành viên?");
                              if (!reason) return;
                              GroupService.removeMember({
                                groupId: group.groupId,
                                studentId: member.userId,
                                reason,
                                changedBy: user.userId,
                                changedAt: new Date().toISOString(),
                              })
                                .then(() =>
                                  toast({
                                    title: "Đã xóa thành viên",
                                    description: member.fullName,
                                  })
                                )
                                .catch(() =>
                                  toast({
                                    title: "Lỗi",
                                    description: "Không thể xóa",
                                  })
                                );
                            }}
                          >
                            Xóa thành viên
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const scoreStr = prompt("Điểm đóng góp (0-100)?");
                              if (!scoreStr) return;
                              const score = Number(scoreStr);
                              if (Number.isNaN(score)) return;
                              GroupService.setContributionScore({
                                groupId: group.groupId,
                                studentId: member.userId,
                                score,
                              })
                                .then(() =>
                                  toast({
                                    title: "Đã ghi nhận đóng góp",
                                    description: `${member.fullName}: ${score}`,
                                  })
                                )
                                .catch(() =>
                                  toast({
                                    title: "Lỗi",
                                    description: "Không thể lưu điểm",
                                  })
                                );
                            }}
                          >
                            Ghi điểm đóng góp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const studentId = prompt(
                    "Nhập mã SV cần thêm (chưa có nhóm)"
                  );
                  const reason = prompt("Lý do thêm vào nhóm?");
                  if (!studentId || !reason) return;
                  GroupService.addMember({
                    groupId: group.groupId,
                    studentId,
                    reason,
                    changedBy: user.userId,
                    changedAt: new Date().toISOString(),
                  })
                    .then(() =>
                      toast({
                        title: "Đã thêm thành viên",
                        description: studentId,
                      })
                    )
                    .catch(() =>
                      toast({ title: "Lỗi", description: "Không thể thêm" })
                    );
                }}
              >
                Thêm thành viên chưa có nhóm
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const proposal = prompt(
                    "Đề xuất điều chỉnh (tách/ghép/đổi thành viên...)"
                  );
                  if (!proposal) return;
                  GroupService.proposeAdjustment({
                    groupId: group.groupId,
                    proposal,
                    proposedBy: user.userId,
                    proposedAt: new Date().toISOString(),
                  })
                    .then(() =>
                      toast({ title: "Đã gửi đề xuất", description: proposal })
                    )
                    .catch(() =>
                      toast({
                        title: "Lỗi",
                        description: "Không thể gửi đề xuất",
                      })
                    );
                }}
              >
                Đề xuất điều chỉnh nhóm
              </Button>
              <Button
                className={`${
                  group.ready
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-800"
                }`}
                onClick={() => {
                  const next = !group.ready;
                  GroupService.markGroupReady(group.groupId, next, user.userId)
                    .then(() =>
                      toast({
                        title: next ? "Đánh dấu sẵn sàng" : "Bỏ sẵn sàng",
                        description: group.groupName,
                      })
                    )
                    .catch(() =>
                      toast({ title: "Lỗi", description: "Không thể cập nhật" })
                    );
                }}
              >
                {group.ready ? "Đã sẵn sàng" : "Đánh dấu sẵn sàng"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
