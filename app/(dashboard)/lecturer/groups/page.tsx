"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shuffle } from "lucide-react"
import { getCurrentUser } from "@/lib/utils/auth"
import { mockGroups } from "@/lib/mock-data/groups"

export default function GroupsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
            <p className="text-gray-600 mt-1">Manage student groups and assignments</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Shuffle className="w-4 h-4 mr-2" />
            Auto-Generate Groups
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGroups.map((group) => (
            <Card
              key={group.groupId}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/lecturer/groups/${group.groupId}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      group.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {group.status}
                  </span>
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
                      <span key={major} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
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
  )
}
