import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System administration panel</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Admin features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
