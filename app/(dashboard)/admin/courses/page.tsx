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
import { CourseFormDialog } from "@/components/features/course/CourseFormDialog"
import { CourseInitializationWizard } from "@/components/features/course/CourseInitializationWizard"
import { mockCourses } from "@/lib/mock-data/courses" // Dùng tạm dữ liệu giả
import type { Course } from "@/lib/types"

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>(mockCourses);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };
  
  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      // TODO: Call API to delete course
      setCourses(courses.filter((c) => c.courseId !== courseId));
      console.log("Deleted course:", courseId);
    }
  };

  const handleSaveCourse = (courseData: Course) => {
    // TODO: Call API to create/update course
    if (editingCourse) {
      // Update logic
      setCourses(courses.map((c) => (c.courseId === courseData.courseId ? courseData : c)));
      console.log("Updated course:", courseData);
    } else {
      // Create logic
      const newCourse = { ...courseData, courseId: `C00${courses.length + 1}` };
      setCourses([...courses, newCourse]);
      console.log("Created course:", newCourse);
    }
  };


  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa học</h1>
            <p className="text-gray-600 mt-1">Tạo, chỉnh sửa, và xóa các khóa học trong hệ thống.</p>
          </div>
          <Button onClick={handleAddCourse}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo Khóa học mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Khóa học</CardTitle>
            <CardDescription>
              Tổng số {courses.length} khóa học.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã môn</TableHead>
                  <TableHead>Tên môn học</TableHead>
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

      <CourseFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCourse}
        course={editingCourse}
      />
    </DashboardLayout>
  )
}
