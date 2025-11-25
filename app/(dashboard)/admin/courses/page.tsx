// app/%28dashboard%29/admin/courses/page.tsx
"use client"

import * as React from "react"
import { PlusCircle, MoreHorizontal, Trash2, Edit, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CourseInitializationWizard } from "@/components/features/course/CourseInitializationWizard"
import { CourseFormDialog } from "@/components/features/course/CourseFormDialog"

// --- SỬA LỖI TẠI ĐÂY ---
// Import từ Adapter (lib/api/courseService), KHÔNG PHẢI generated
import { CourseService } from "@/lib/api/courseService" 
import type { Course } from "@/lib/types"
import { getCoursesServerSide } from '@/app/(dashboard)/admin/courses/action';
import ChangeMockData from "@/components/features/ChangeMockData";
import { getCourses as getCoursesMock } from "@/lib/mock-data/courses";

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);
  const [useMock, setUseMock] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('useMock');
    return saved ? saved === 'true' : true;
  });
  // Đã loại bỏ form "Tạo Khóa học mới" theo yêu cầu

  async function fetchCourses() {
    setIsLoading(true);
    try {
      const data = useMock ? await getCoursesMock() : await getCoursesServerSide();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMock]);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        // Xóa lạc quan ngay trên UI
        setCourses(prev => prev.filter(c => c.courseId !== courseId));

        // Gọi delete tới BE qua proxy
        await CourseService.deleteCourse(courseId);

        // Refetch từ server để đảm bảo đồng bộ với BE
        const refreshed = await getCoursesServerSide();
        // Nếu BE vẫn trả về item vừa xóa (soft delete/chưa xóa), tiếp tục che item trên UI
        const filtered = refreshed.filter(c => c.courseId !== courseId);
        setCourses(filtered);
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Xóa thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleUpdateCourse = async (courseData: Course) => {
     if (!editingCourse?.courseId) return;
    try {
      const updatedCourse = await CourseService.updateCourse(
          editingCourse.courseId,
          courseData
      );
      
      setCourses(courses.map((c) => (c.courseId === updatedCourse.courseId ? updatedCourse : c)));
      setIsEditDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
        console.error("Failed to update course:", error);
        alert("Cập nhật thất bại.");
    }
  };

  // Đã loại bỏ hàm tạo course trực tiếp - sử dụng Wizard để khởi tạo

  const handleInitializationComplete = (newCourses: Course[]) => {
    // Thêm khóa học mới vào danh sách (nếu Wizard trả về course đã tạo)
    // Hoặc reload lại danh sách
    setCourses(prev => [...prev, ...newCourses]);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa học</h1>
            <p className="text-gray-600 mt-1">Khởi tạo kỳ học, phân chia lớp và quản lý các khóa học.</p>
        </div>
          <div className="flex items-center gap-2">
          <Button onClick={() => setIsWizardOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Khởi tạo Kỳ học mới
          </Button>
          </div>
        </div>
       <ChangeMockData loading={isLoading} onRefresh={fetchCourses} useMock={useMock} setUseMock={setUseMock} />
        <Card>
           <CardHeader>
             <CardTitle>Course List ({courses.length})</CardTitle>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                  <TableRow>
                   <TableHead>Course Code</TableHead>
                   <TableHead>Course Name</TableHead>
                   <TableHead>Description</TableHead>
                   <TableHead>Created Date</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                 {courses.length > 0 ? (
                   courses.map((course) => (
                     <TableRow key={course.courseId ?? (course as any).id ?? `${course.courseCode}-${course.courseName}` }>
                       <TableCell className="font-medium">{course.courseCode}</TableCell>
                       <TableCell>{course.courseName}</TableCell>
                        <TableCell className="max-w-xs truncate" title={course.description}>
                           {course.description}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const v = (course as any).createdAt ?? (course as any).createdDate ?? course.createdDate;
                            return v ? formatDate(v) : 'N/A';
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteCourse(course.courseId)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                       No courses yet.
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
      </div>

      <CourseInitializationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleInitializationComplete}
      />
      
      {editingCourse && (
          <CourseFormDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSave={handleUpdateCourse}
            course={editingCourse}
          />
      )}
    </DashboardLayout>
  )
}

// Helper format date to vi-VN safely
function formatDate(value: string) {
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('vi-VN');
  } catch {
    return value;
  }
}