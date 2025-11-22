"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import { GroupService } from "@/lib/api/groupService"
import type { Group, User } from "@/lib/types"
import { getCurrentUser } from "@/lib/utils/auth"

export default function StudentGroupDetail({ params }: { params: { groupId: string } }) {
  const router = useRouter()
  const [group, setGroup] = React.useState<Group | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const u = getCurrentUser() as User | null
    setUser(u)
    const load = async () => {
      setIsLoading(true)
      try {
        const g = await GroupService.getGroupById(params.groupId)
        setGroup(g)
      } catch (err) {
        console.error("Failed to fetch group:", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (params.groupId) load()
  }, [params.groupId])

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

  const isLeader = user && group.leaderId && user.userId === group.leaderId

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.groupName}</h1>
            <p className="text-gray-600 mt-1">Khoá học: {group.courseCode}</p>
          </div>
          <Badge variant="outline" className="uppercase">{isLeader ? "Group Leader" : "Thành viên"}</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-700" />
                <CardTitle>Thành viên ({group.memberCount}/{group.maxMembers})</CardTitle>
              </div>
              <CardDescription>Trưởng nhóm: {group.leaderName || "(chưa có)"}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {group.members && group.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.members.map(m => (
                  <div key={m.userId} className="flex items-center gap-3 p-3 border rounded-md">
                    <Avatar>
                      <AvatarImage src={m.avatarUrl} />
                      <AvatarFallback>{m.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {m.fullName}
                        {m.role === 'leader' && <Badge className="ml-2" variant="secondary">Leader</Badge>}
                      </div>
                      <div className="text-xs text-gray-600">Major: {m.major}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nhóm chưa có thành viên.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}