// components/features/course/CourseInitializationWizard.tsx
"use client"

import * as React from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Course } from "@/lib/types"

interface WizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (newCourses: Course[]) => void
}

export function CourseInitializationWizard({ isOpen, onClose, onComplete }: WizardProps) {
  const [courseCode, setCourseCode] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!courseCode || !courseName) {
      alert("Vui lòng nhập đầy đủ Mã lớp và Tên lớp.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/courses/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseCode, courseName, description })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Khởi tạo thất bại');
      }

      const created = await res.json();
      alert('Khởi tạo khóa học thành công!');
      const mapped = {
        courseId: created?.id || created?.courseId || `${courseCode}`,
        courseCode: created?.courseCode ?? courseCode,
        courseName: created?.courseName ?? courseName,
        description: created?.description ?? description,
        semester: "N/A",
        year: new Date().getFullYear(),
        status: "open",
        createdDate: created?.createdAt ?? new Date().toISOString(),
        lecturerId: "",
        groupCount: 0,
        studentCount: 0,
      } as import("@/lib/types").Course;
      onComplete([mapped]);
      onClose();
    } catch (err: any) {
      console.error('CreateCourseByAdmin error:', err);
      const msg = String(err?.message || '').toLowerCase();
      if (msg.includes('unauthorized')) {
        alert('Bạn cần đăng nhập với quyền admin để khởi tạo khóa học.');
      } else {
        alert('Có lỗi xảy ra khi khởi tạo. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Khởi tạo Kỳ học mới</DialogTitle>
          <DialogDescription>
            Tạo khóa học theo API CreateCourseByAdmin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="courseCode">Course Code</Label>
            <Input id="courseCode" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g., EXE101_Summer2025_C1" />
          </div>
          <div>
            <Label htmlFor="courseName">Course Name</Label>
            <Input id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g., EXE101 Summer 2025 - Class 1" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>Đang tạo... <Loader2 className="w-4 h-4 ml-2 animate-spin" /></>
            ) : (
              <>Tạo khóa học <CheckCircle className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}