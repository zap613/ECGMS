// components/features/course/CourseInitializationWizard.tsx
"use client"

import * as React from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers } from "@/lib/mock-data/auth"
import type { Course } from "@/lib/types"

interface WizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (newCourses: Course[]) => void
}

const SAFETY_FACTOR = 0.4; // Hệ số an toàn 40%
const MIN_GROUP_SIZE = 4;

export function CourseInitializationWizard({ isOpen, onClose, onComplete }: WizardProps) {
  const [step, setStep] = React.useState(1);
  const [semesterName, setSemesterName] = React.useState('');
  const [totalStudents, setTotalStudents] = React.useState<number | ''>('');
  const [classCount, setClassCount] = React.useState<number | ''>(1);
  const [courses, setCourses] = React.useState<Partial<Course & { lecturerId: string }>[]>([]);

  const lecturers = mockUsers.filter(u => u.role === 'lecturer');

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSemesterName('');
      setTotalStudents('');
      setClassCount(1);
      setCourses([]);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const numClasses = Number(classCount);
    const numTotalStudents = Number(totalStudents);
    if (step === 2 && numClasses > 0 && numTotalStudents > 0) {
      const newCourses = Array.from({ length: numClasses }, (_, i) => ({
        courseCode: `${semesterName.replace(/\s/g, '')}-C${i + 1}`,
        courseName: `EXE101 - Lớp ${i + 1}`,
        semester: semesterName,
        year: new Date().getFullYear(),
        lecturerId: ''
      }));
      setCourses(newCourses);
    }
  }, [classCount, step, totalStudents, semesterName]);

  const handleCourseLecturerChange = (index: number, lecturerId: string) => {
    const updatedCourses = [...courses];
    updatedCourses[index].lecturerId = lecturerId;
    setCourses(updatedCourses);
  };

  const handleNextStep = () => {
    if (!semesterName || !totalStudents || totalStudents <= 0) {
      alert("Vui lòng điền đầy đủ thông tin Kỳ học và Tổng số sinh viên.");
      return;
    }
    setStep(2);
  };

  const handleFinalize = () => {
    const numClassCount = Number(classCount);
    const numTotalStudents = Number(totalStudents);

    if (!numClassCount || numClassCount <= 0 || !numTotalStudents) return;

    if (courses.some(c => !c.lecturerId)) {
      alert("Vui lòng gán giảng viên cho tất cả các lớp.");
      return;
    }

    const studentsPerClass = Math.floor(numTotalStudents / numClassCount);
    const maxTeams = Math.floor(studentsPerClass / MIN_GROUP_SIZE);
    const emptyGroupsToCreate = Math.ceil(maxTeams * (1 + SAFETY_FACTOR));

    const finalCoursesData = courses.map(c => ({
      ...c,
      studentCount: studentsPerClass,
      emptyGroupsToCreate: emptyGroupsToCreate
    }));

    console.log("FINALIZING DATA TO SEND TO API:", {
      semesterName,
      totalStudents,
      classCount,
      courses: finalCoursesData
    });

    const createdCourses: Course[] = finalCoursesData.map((c, i) => ({
      courseId: `NEW_C${Date.now() + i}`,
      courseCode: c.courseCode!,
      courseName: c.courseName!,
      semester: c.semester!,
      year: c.year!,
      lecturerId: c.lecturerId!,
    }));

    alert(`Đã khởi tạo thành công ${numClassCount} lớp với tổng số ${emptyGroupsToCreate * numClassCount} nhóm trống!`);
    onComplete(createdCourses);
    onClose();
  };

  const numTotalStudents = Number(totalStudents);
  const numClassCount = Number(classCount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Khởi tạo Kỳ học và các Lớp</DialogTitle>
          <DialogDescription>
            Quy trình gồm 2 bước để thiết lập các lớp học cho kỳ mới.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <h3 className="font-semibold">Bước 1: Thông tin Kỳ học</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semesterName">Tên Kỳ học</Label>
                <Input id="semesterName" value={semesterName} onChange={e => setSemesterName(e.target.value)} placeholder="Ví dụ: Summer 2025"/>
              </div>
              <div>
                <Label htmlFor="totalStudents">Tổng số sinh viên</Label>
                <Input id="totalStudents" type="number" value={totalStudents} onChange={e => setTotalStudents(e.target.value === '' ? '' : parseInt(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold">Bước 2: Phân chia Lớp và Gán Giảng viên</h3>
              <p className="text-sm text-muted-foreground">Tổng số {totalStudents} sinh viên.</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classCount">Số lượng lớp cần chia</Label>
              <Input id="classCount" type="number" min="1" value={classCount} onChange={e => setClassCount(e.target.value === '' ? '' : parseInt(e.target.value))} className="col-span-1" />
              <p className="col-span-2 text-sm text-muted-foreground">
                {(numClassCount > 0 && numTotalStudents > 0) ? `~${Math.floor(numTotalStudents / numClassCount)} sinh viên / lớp` : ''}
              </p>
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-4 space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg items-center">
                  <div className="col-span-1">
                    <Label>Mã lớp</Label>
                    <p className="font-semibold">{course.courseCode}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Giảng viên phụ trách</Label>
                    <Select onValueChange={(value) => handleCourseLecturerChange(index, value)} value={course.lecturerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giảng viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {lecturers.map(lecturer => (
                          <SelectItem key={lecturer.userId} value={lecturer.userId}>
                            {lecturer.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <Button onClick={handleNextStep}>
              Tiếp tục <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
              <Button onClick={handleFinalize}>
                Hoàn tất & Tạo nhóm <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}