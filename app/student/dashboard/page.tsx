"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { getCurrentUser } from "@/lib/utils/auth"

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user.fullName}!</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">Student features coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
