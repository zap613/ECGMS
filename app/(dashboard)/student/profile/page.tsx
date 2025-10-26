"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Loader2, UserCircle } from "lucide-react"
import { getCurrentUser, updateCurrentUser } from "@/lib/utils/auth"
import { mockMajors } from "@/lib/mock-data/majors" // Import mock majors
import type { User } from "@/lib/types"

// Giả sử có danh sách các skill có thể chọn
const availableSkills = ["Frontend", "Backend", "React", "Node.js", "Database", "DevOps", "CI/CD", "AWS", "UI/UX", "Business Analyst", "Tester", "QA", "VueJS", "Angular"];

export default function StudentProfilePage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [selectedMajor, setSelectedMajor] = React.useState<string | undefined>(undefined);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setSelectedMajor(currentUser.major);
      setSelectedSkills(currentUser.skillSet || []);
    }
    setIsLoading(false);
  }, []);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    const updatedUserData: User = {
      ...user,
      major: selectedMajor as ("SE" | "SS" | undefined),
      skillSet: selectedSkills,
    };

    console.log("[Mock Save] Updating profile:", updatedUserData);
    // TƯƠNG LAI: Gọi API
    // await UserProfileService.updateUserProfile({ id: user.userId, requestBody: updatedUserData });

    // HIỆN TẠI: Cập nhật mock data và localStorage
    updateCurrentUser(updatedUserData); // Cập nhật localStorage
    setUser(updatedUserData); // Cập nhật state cục bộ

    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập độ trễ
    setIsSaving(false);
    alert("Hồ sơ đã được cập nhật!");
  };

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin"/></div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
         <DashboardLayout role="student">
            <p>Không tìm thấy thông tin người dùng.</p>
         </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">Cập nhật thông tin của bạn để giúp việc ghép nhóm hiệu quả hơn.</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
              <UserCircle className="w-12 h-12 text-gray-400"/>
              <div>
                  <CardTitle>{user.fullName}</CardTitle>
                  <CardDescription>{user.email} ({user.userId})</CardDescription>
              </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cố định */}
              <div className="space-y-1">
                <Label>Họ tên:</Label>
                <p className="text-sm text-muted-foreground">{user.fullName}</p>
              </div>
               <div className="space-y-1">
                <Label>Email:</Label>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-1">
                <Label>Ngày sinh:</Label>
                <p className="text-sm text-muted-foreground">{user.birthday || 'Chưa cập nhật'}</p>
              </div>
               <div className="space-y-1">
                <Label>Liên hệ:</Label>
                <p className="text-sm text-muted-foreground">{user.contactInfo || 'Chưa cập nhật'}</p>
              </div>

              {/* Thông tin có thể chỉnh sửa */}
               <div className="space-y-1">
                  <Label htmlFor="major">Chuyên ngành (Major)</Label>
                  <Select onValueChange={setSelectedMajor} value={selectedMajor}>
                    <SelectTrigger id="major">
                      <SelectValue placeholder="Chọn chuyên ngành của bạn" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMajors.map(major => (
                        <SelectItem key={major.majorId} value={major.majorCode}>
                          {major.majorName} ({major.majorCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            </div>

             <div className="space-y-1">
                <Label>Bộ kỹ năng (SkillSet)</Label>
                <div className="flex flex-wrap gap-2 border rounded-md p-3 mt-1 bg-gray-50">
                    {availableSkills.map(skill => (
                        <Badge
                            key={skill}
                            variant={selectedSkills.includes(skill) ? "default" : "outline"}
                            onClick={() => handleSkillToggle(skill)}
                            className="cursor-pointer transition-all hover:scale-105"
                        >
                            {selectedSkills.includes(skill) ? "✓ " : "+ "}{skill}
                        </Badge>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Chọn các kỹ năng bạn có để các nhóm khác có thể tìm thấy bạn.</p>
             </div>

             <div className="flex justify-end pt-4 border-t">
                 <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                    Lưu thay đổi
                 </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}