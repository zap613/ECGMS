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
import { Crown, Loader2, LogOut, MoreVertical, Pencil, UserMinus, Sparkles, Lock, Unlock, UserPlus, Search } from "lucide-react"
import { GroupService } from "@/lib/api/groupService"
import { GroupMemberService as GeneratedGroupMemberService, UserService as GeneratedUserService } from "@/lib/api/generated"
import type { Group, User } from "@/lib/types"
import type { ChangeMockDataProps } from "@/components/features/ChangeMockData"
import { getCurrentUser, updateCurrentUser } from "@/lib/utils/auth"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [availableStudents, setAvailableStudents] = React.useState<any[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

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

  const filteredAvailable = React.useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    const base = availableStudents || []
    if (!term) return base
    return base.filter((s: any) => {
      const name = (s.userProfile?.fullName || s.username || "").toLowerCase()
      const code = (s.userProfile?.studentCode || "").toLowerCase()
      const email = (s.email || "").toLowerCase()
      return name.includes(term) || code.includes(term) || email.includes(term)
    })
  }, [availableStudents, searchQuery])

  const handleToggleLock = async () => {
    if (!group) return
    try {
      const newStatus = group.status === 'lock' ? 'open' : 'lock'
      const updated = await GroupService.updateGroup(group.groupId, { status: newStatus })
      setGroup(updated)
      toast({ title: newStatus === 'lock' ? 'Đã khoá nhóm' : 'Đã mở lại nhóm' })
    } catch (err: any) {
      console.error('Toggle lock failed', err)
      toast({ title: 'Không thể cập nhật trạng thái', description: err?.message || 'Vui lòng thử lại.' })
    }
  }

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

  const loadAvailableStudents = React.useCallback(async () => {
    if (!group) return
    try {
      // Lấy toàn bộ users và lọc sinh viên thuộc môn học hiện tại nhưng chưa có nhóm trong môn này
      const allUsers = await GeneratedUserService.getApiUser()
      const courseId = group.courseId
      const courseCode = group.courseCode?.toUpperCase()
      // Sinh viên thuộc course hiện tại
      const studentsInCourse = (allUsers || []).filter((u: any) => {
        const scs = u.studentCourses || []
        return scs.some((sc: any) => {
          const cid = sc.courseId
          const ccode = sc.course?.courseCode?.toUpperCase()
          return (courseId && cid === courseId) || (courseCode && ccode === courseCode)
        })
      })
      // Chưa có nhóm trong course hiện tại
      const freeStudents = studentsInCourse.filter((u: any) => {
        const gs = u.groups || []
        return !gs.some((g: any) => {
          const cid = g.courseId
          const ccode = g.course?.courseCode?.toUpperCase?.()
          return (courseId && cid === courseId) || (courseCode && ccode === courseCode)
        })
      })
      setAvailableStudents(freeStudents)
    } catch (err) {
      console.error("Load available students failed:", err)
    }
  }, [group])

  const handleInvite = React.useCallback(async (studentId: string) => {
    if (!group) return
    try {
      await GeneratedGroupMemberService.postApiGroupMember({ requestBody: { groupId: group.groupId, userId: studentId } })
      toast({ title: "Đã thêm thành viên thành công" })
      await loadGroup()
      await loadAvailableStudents()
    } catch (e: any) {
      console.error("Invite member failed:", e)
      toast({ title: "Lỗi", description: e?.message || "Không thể thêm thành viên này" })
    }
  }, [group, loadGroup, loadAvailableStudents, toast])

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
    // 1) Tìm membership ID từ danh sách nhóm trên UI nếu có
    const myMembership = (group.members || []).find((m) => m.userId === user.userId)
    const membershipId = (myMembership as any)?.memberId || (myMembership as any)?.id || (myMembership as any)?.groupMemberId

    if (!membershipId) {
      toast({
        variant: "destructive",
        title: "Không tìm thấy thông tin thành viên",
        description: "Không tìm thấy ID membership. Hãy thử tải lại trang và thử lại."
      })
      return
    }

    try {
      setIsLeaving(true)
      // 2) Gọi API DELETE với ID membership
      await GeneratedGroupMemberService.deleteApiGroupMember({ id: membershipId })

      // 3) Cập nhật trạng thái người dùng và điều hướng
      const newUser = { ...user, groupId: undefined } as User
      updateCurrentUser(newUser)
      setUser(newUser)
      toast({ title: "Đã rời nhóm thành công" })
      router.push(`/student/group`)
    } catch (err: any) {
      console.error("Leave group failed:", err)
      toast({
        variant: "destructive",
        title: "Rời nhóm thất bại",
        description: err?.message || "Vui lòng thử lại sau."
      })
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
        {/* Leader onboarding prompt */}
        {isLeader && (group.groupName === 'Chưa đặt tên' || !group.groupName) && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-800">Bạn chưa đăng ký đề tài.</div>
              <div className="text-sm text-yellow-700">Hãy cập nhật ngay tên đề tài để thu hút thành viên!</div>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={() => form.handleSubmit(handleUpdateProject)()}>
                <Pencil className="w-4 h-4 mr-2" /> Cập nhật đề tài
              </Button>
            </div>
          </div>
        )}
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
            {isLeader && (
              <Button variant={group.status === 'lock' ? 'secondary' : 'outline'} size="sm" onClick={handleToggleLock}>
                {group.status === 'lock' ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {group.status === 'lock' ? 'Mở khoá' : 'Khoá nhóm'}
              </Button>
            )}
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
                {isLeader && !isFull && (
                  <div className="mb-4 flex justify-end">
                    <Dialog open={inviteOpen} onOpenChange={(o) => {
                      setInviteOpen(o)
                      if (o) loadAvailableStudents()
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserPlus className="w-4 h-4 mr-2" /> Mời thành viên
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Mời sinh viên vào nhóm</DialogTitle>
                          <DialogDescription>
                            Tìm kiếm và thêm sinh viên chưa có nhóm trong môn {group.courseCode}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Nhập tên, MSSV hoặc email"
                              className="pl-9"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-72 overflow-auto rounded-md border">
                            {filteredAvailable.length > 0 ? (
                              <div className="divide-y">
                                {filteredAvailable.map((s: any) => (
                                  <div key={s.id || s.userId || s.username} className="flex items-center justify-between px-3 py-2">
                                    <div>
                                      <div className="font-medium text-gray-900">{s.userProfile?.fullName || s.username || "(Không tên)"}</div>
                                      <div className="text-xs text-gray-600">MSSV: {s.userProfile?.studentCode || "N/A"} • {s.email || "N/A"}</div>
                                    </div>
                                    <Button size="sm" onClick={() => handleInvite(s.id || s.userId)}>
                                      Thêm
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-gray-500">Không có sinh viên khả dụng</div>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="secondary" onClick={() => setInviteOpen(false)}>Đóng</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
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
                              {m.role === "leader" && (
                                <>
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                  <Badge variant="secondary">Leader</Badge>
                                </>
                              )}
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