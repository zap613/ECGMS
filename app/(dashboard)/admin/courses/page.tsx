"use client"

import * as React from "react"
import { PlusCircle, MoreHorizontal, Trash2, Edit, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
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

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  // Fetch Courses
  React.useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // Gọi qua Adapter, hàm này đã map data đúng chuẩn Frontend
        const data = await CourseService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        await CourseService.deleteCourse(courseId);
        setCourses(courses.filter((c) => c.courseId !== courseId));
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
          <Button onClick={() => setIsWizardOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Khởi tạo Kỳ học mới
          </Button>
        </div>

        <Card>
           <CardHeader>
             <CardTitle>Danh sách Lớp học ({courses.length})</CardTitle>
             <CardDescription>
               Quản lý các lớp học trong hệ thống.
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Mã lớp</TableHead>
                   <TableHead>Tên lớp</TableHead>
                   <TableHead>Mô tả</TableHead>
                   <TableHead>Ngày tạo</TableHead>
                   <TableHead className="text-right">Hành động</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {courses.length > 0 ? (
                   courses.map((course) => (
                     <TableRow key={course.courseId}>
                       <TableCell className="font-medium">{course.courseCode}</TableCell>
                       <TableCell>{course.courseName}</TableCell>
                       <TableCell className="max-w-xs truncate" title={course.description}>
                          {course.description}
                       </TableCell>
                       <TableCell>
                          {course.createdDate ? new Date(course.createdDate).toLocaleDateString('vi-VN') : 'N/A'}
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
                               Chỉnh sửa
                             </DropdownMenuItem>
                             <DropdownMenuItem
                               className="text-destructive"
                               onClick={() => handleDeleteCourse(course.courseId)}
                             >
                               <Trash2 className="mr-2 h-4 w-4" />
                               Xóa
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        Chưa có khóa học nào.
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