//  components/features/group/GroupCard.tsx
"use client"

import type { Group } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Lock, LogIn, Send, Check } from "lucide-react"

const statusConfig = {
  open: { text: "Đang mở", variant: "secondary", icon: <LogIn className="w-3 h-3" /> },
  lock: { text: "Cần duyệt", variant: "default", icon: <Send className="w-3 h-3" /> },
  finalize: { text: "Đã đủ", variant: "destructive", icon: <Check className="w-3 h-3" /> },
  private: { text: "Riêng tư", variant: "outline", icon: <Lock className="w-3 h-3" /> },
}

export function GroupCard({ group }: { group: Group }) {
  const { text, variant, icon } = statusConfig[group.status] || statusConfig.open
  const memberPercentage = (group.memberCount / group.maxMembers) * 100

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{group.groupName}</CardTitle>
          <Badge variant={variant as any} className="flex items-center gap-1">
            {icon}
            {text}
          </Badge>
        </div>
        <CardDescription>Trưởng nhóm: {group.leaderName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-xs text-muted-foreground">
              <span>Thành viên</span>
              <span>{group.memberCount}/{group.maxMembers}</span>
            </div>
            <Progress value={memberPercentage} />
          </div>

          {group.needs.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2">Đang tìm kiếm:</p>
              <div className="flex gap-2">
                {group.needs.map((need, index) => (
                  <Badge key={index} variant="outline">
                    {need.count} {need.major}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {group.members.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2">Thành viên hiện tại:</p>
              <div className="flex -space-x-2">
                {group.members.slice(0, 5).map(member => (
                  <Avatar key={member.userId} className="border-2 border-white">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 5 && (
                   <Avatar className="border-2 border-white">
                    <AvatarFallback>+{group.members.length - 5}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {group.status === "open" && <Button className="w-full">Tham gia ngay</Button>}
        {group.status === "lock" && <Button variant="secondary" className="w-full">Nộp đơn ứng tuyển</Button>}
        {group.status === "finalize" && <Button disabled variant="outline" className="w-full">Nhóm đã chốt</Button>}
        {group.status === "private" && <Button disabled variant="outline" className="w-full">Chỉ dành cho thành viên được mời</Button>}
      </CardFooter>
    </Card>
  )
}