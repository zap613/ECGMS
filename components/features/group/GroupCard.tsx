// Group card component for displaying group information
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Group } from '@/lib/types'

interface GroupCardProps {
  group: Group
  onViewDetails?: (groupId: string) => void
}

export function GroupCard({ group, onViewDetails }: GroupCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails?.(group.groupId)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{group.groupName}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {group.courseCode}
            </CardDescription>
          </div>
          <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
            {group.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Leader:</span>
            <span className="font-medium">{group.leaderName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Members:</span>
            <span className="font-medium">{group.memberCount}/6</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Majors:</span>
            <div className="flex gap-1">
              {group.majors.map((major) => (
                <Badge key={major} variant="outline" className="text-xs">
                  {major}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Created: {new Date(group.createdDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
