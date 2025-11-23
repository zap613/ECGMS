// app/(dashboard)/student/groups/[groupId]/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Crown, Loader2, LogOut, MoreVertical, Pencil, UserMinus } from "lucide-react"
import { GroupService } from "@/lib/api/groupService"
import { GroupMemberService as GeneratedGroupMemberService } from "@/lib/api/generated"
import type { Group, User } from "@/lib/types"
import type { ChangeMockDataProps } from "@/components/features/ChangeMockData"
import { getCurrentUser, updateCurrentUser } from "@/lib/utils/auth"
import { useForm } from "react-hook-form"

type ProjectFormValues = {
  title: string
  description: string
}

export default function StudentGroupDetail({ params }: { params: { groupId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [group, setGroup] = React.useState<Group | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState<User | null>(null)
  const [isLeaving, setIsLeaving] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [kickingUserId, setKickingUserId] = React.useState<string | null>(null)

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const loadGroup = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const g = await GroupService.getGroupById(params.groupId)
      setGroup(g)
      // Cập nhật form từ dữ liệu nhóm
      form.reset({
        title: g?.groupName || "",
        description: "", // Backend chưa hỗ trợ, hiển thị placeholder
      })
    } catch (err) {
      console.error("Failed to fetch group:", err)
      toast({ title: "Lỗi", description: "Không thể tải thông tin nhóm." })
    } finally {
      setIsLoading(false)
    }
  }, [params.groupId, toast, form])

  React.useEffect(() => {
    const u = getCurrentUser() as User | null
    setUser(u)
    if (params.groupId) {
      loadGroup()
    }
  }, [params.groupId, loadGroup])

  const isLeader = !!(user && group?.leaderId && user.userId === group.leaderId)
  const isFull = !!(group && group.memberCount >= group.maxMembers)

  const handleUpdateProject = async (values: ProjectFormValues) => {
    if (!group) return
    try {
      setIsUpdating(true)
      const updated = await GroupService.updateGroup(group.groupId, { name: values.title })
      toast({ title: "Đã cập nhật đề tài", description: "Tên đề tài đã được lưu." })
      setGroup(updated)
    } catch (err: any) {
      console.error("Update project failed:", err)
      toast({ title: "Cập nhật thất bại", description: err?.message || "Không thể cập nhật." })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKickMember = async (memberId: string) => {
    if (!group) return
    try {
      setKickingUserId(memberId)
      // Tìm membership theo groupId + userId và xoá
      const memberships = await GeneratedGroupMemberService.getApiGroupMember({ groupId: group.groupId, userId: memberId })
      const membership = Array.isArray(memberships) ? memberships[0] : undefined
      const membershipId = (membership as any)?.id
      if (!membershipId) {
        toast({ title: "Không tìm thấy thành viên", description: "Không thể xoá thành viên này." })
        return
      }
      await GeneratedGroupMemberService.deleteApiGroupMember({ id: membershipId })
      toast({ title: "Đã xoá thành viên" })
      await loadGroup()
    } catch (err: any) {
      console.error("Kick member failed:", err)
      toast({ title: "Thao tác thất bại", description: err?.message || "Không thể xoá thành viên." })
    } finally {
      setKickingUserId(null)
    }
  }

  const handleLeaveGroup = async () => {
    if (!user || !group) return
    if (isLeader) {
      toast({ title: "Bạn đang là trưởng nhóm", description: "Vui lòng chuyển quyền trước khi rời." })
      return
    }
    try {
      setIsLeaving(true)
      await GroupService.leaveGroup(group.groupId, user.userId)
      const newUser = { ...user, groupId: undefined } as User
      updateCurrentUser(newUser)
      setUser(newUser)
      toast({ title: "Đã rời nhóm" })
      router.push(`/student/group`)
    } catch (err: any) {
      console.error("Leave group failed:", err)
      toast({ title: "Rời nhóm thất bại", description: err?.message || "Vui lòng thử lại." })
    } finally {
      setIsLeaving(false)
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

  if (!group) {
    return (
      <DashboardLayout role="student">
        <div className="p-6">
          <p className="text-gray-700">Không tìm thấy nhóm.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              {group.groupName}
              {isLeader && <Crown className="w-5 h-5 text-yellow-500" />}
            </h1>
            <div className="text-gray-600 mt-1 flex items-center gap-3">
              <span>Khoá học: {group.courseCode}</span>
              <Badge variant={isFull ? "destructive" : "secondary"}>{isFull ? "Full" : "Open"}</Badge>
              <Badge variant="outline">{group.memberCount}/{group.maxMembers}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="uppercase">{isLeader ? "Group Leader" : "Thành viên"}</Badge>
            {!isLeader && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <LogOut className="w-4 h-4 mr-2" /> Rời nhóm
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận rời nhóm?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn phải rời nhóm hiện tại mới có thể tham gia nhóm khác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeaveGroup} disabled={isLeaving}>
                      {isLeaving ? "Đang xử lý..." : "Đồng ý"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Project + Mentor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Đăng ký đề tài</CardTitle>
                  <CardDescription>Hiển thị và cập nhật thông tin đề tài</CardDescription>
                </div>
                {isLeader && (
                  <Button variant="outline" size="sm" onClick={() => form.handleSubmit(handleUpdateProject)()} disabled={isUpdating}>
                    <Pencil className="w-4 h-4 mr-2" /> {isUpdating ? "Đang lưu..." : "Lưu"}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đề tài</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên đề tài" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả ngắn</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="Mô tả đề tài (hiển thị)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mentor</CardTitle>
                <CardDescription>Giảng viên hướng dẫn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>GV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Chưa có</div>
                    <div className="text-sm text-gray-600">Liên hệ: N/A</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Members + Danger Zone */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>Thành viên ({group.memberCount}/{group.maxMembers})</CardTitle>
                </div>
                <CardDescription>Trưởng nhóm: {group.leaderName || "(chưa có)"}</CardDescription>
              </CardHeader>
              <CardContent>
                {group.members && group.members.length > 0 ? (
                  <div className="space-y-3">
                    {group.members.map((m) => (
                      <div key={m.userId} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={m.avatarUrl} />
                            <AvatarFallback>{m.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {m.fullName}
                              {m.role === "leader" && <Badge variant="secondary">Leader</Badge>}
                            </div>
                            <div className="text-xs text-gray-600">Major: {m.major}</div>
                          </div>
                        </div>
                        {isLeader && m.role !== "leader" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled>
                                <Crown className="w-4 h-4 mr-2" /> Chuyển quyền Leader (chưa hỗ trợ)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleKickMember(m.userId)} disabled={kickingUserId === m.userId}>
                                <UserMinus className="w-4 h-4 mr-2" /> {kickingUserId === m.userId ? "Đang xoá..." : "Mời ra khỏi nhóm"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nhóm chưa có thành viên.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Thao tác rời nhóm hoặc giải tán (nếu hỗ trợ)</CardDescription>
              </CardHeader>
              <CardContent>
                {!isLeader ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <LogOut className="w-4 h-4 mr-2" /> Rời nhóm
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận rời nhóm?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn phải rời nhóm hiện tại mới có thể tham gia nhóm khác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLeaveGroup} disabled={isLeaving}>
                          {isLeaving ? "Đang xử lý..." : "Đồng ý"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <div className="text-sm text-gray-600">Trưởng nhóm không thể rời trực tiếp. Vui lòng chuyển quyền trước.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}