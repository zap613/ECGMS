// app/(dashboard)/admin/courses/page.tsx
"use client"

import * as React from "react"
import { PlusCircle, MoreHorizontal, Trash2, Edit } from "lucide-react"
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
// import { CourseFormDialog } from "@/components/features/course/CourseFormDialog" // Tạm ẩn vì chưa tạo file
import { mockSummer2025Courses } from "@/lib/mock-data/summer2025-data" // Thay đổi import
import type { Course } from "@/lib/types"

export default function AdminCoursesPage() {
  // Sử dụng dữ liệu mới
  const [courses, setCourses] = React.useState<Course[]>(mockSummer2025Courses);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      setCourses(courses.filter((c) => c.courseId !== courseId));
      console.log("Deleted course:", courseId);
    }
  };

  const handleUpdateCourse = (courseData: Course) => {
    setCourses(courses.map((c) => (c.courseId === courseData.courseId ? courseData : c)));
    console.log("Updated course:", courseData);
    setIsEditDialogOpen(false);
  };

  const handleInitializationComplete = (newCourses: Course[]) => {
    setCourses(prevCourses => [...prevCourses, ...newCourses]);
    console.log("Initialization complete, new courses added:", newCourses);
  };

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
            <CardTitle>Danh sách Lớp học</CardTitle>
            <CardDescription>
              Tổng số {courses.length} lớp học đang hoạt động.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lớp</TableHead>
                  <TableHead>Tên lớp</TableHead>
                  <TableHead>Học kỳ</TableHead>
                  <TableHead>Năm</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell className="font-medium">{course.courseCode}</TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell>{course.year}</TableCell>
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
                ))}
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
      
      {/* // Để chức năng "Chỉnh sửa" hoạt động, bạn cần tạo file CourseFormDialog.tsx
      <CourseFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateCourse}
        course={editingCourse}
      /> 
      */}
    </DashboardLayout>
  )
}