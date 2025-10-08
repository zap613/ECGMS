import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Users, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { mockGroups } from "@/data/mockGroups"

export default function GroupsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
            <p className="text-gray-600 mt-1">Manage all student groups across courses</p>
          </div>
          <Button>
            <Plus size={20} className="mr-2" />
            Create Group
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input placeholder="Search groups..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Groups List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockGroups.map((group) => (
            <Card key={group.groupId} className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{group.groupName}</h3>
                      <p className="text-sm text-gray-600">{group.courseName}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      group.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {group.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{group.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{group.memberCount}</span> / {group.maxMembers} members
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(group.memberCount / group.maxMembers) * 100}%` }}
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  View Group Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
