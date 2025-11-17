"use client"

import * as React from "react"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"
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
  
  // State courses lưu dữ liệu tạm thời ở FE
  const [courses, setCourses] = React.useState<Partial<Course & { lecturerId: string, description?: string }>[]>([]);
  
  const [lecturers, setLecturers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch danh sách giảng viên
  React.useEffect(() => {
    const fetchLecturers = async () => {
      setIsLoading(true);
      try {
        // Lưu ý: Đảm bảo route này trả về đúng cấu trúc mảng giảng viên
        const response = await fetch('/api/users/lecturers');
        if (response.ok) {
          const data = await response.json();
          setLecturers(data);
        } else {
          console.error("Không thể tải danh sách giảng viên");
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      setStep(1);
      setSemesterName('');
      setTotalStudents('');
      setClassCount(1);
      setCourses([]);
      fetchLecturers();
    }
  }, [isOpen]);

  // Tự động tính toán danh sách lớp
  React.useEffect(() => {
    const numClasses = Number(classCount);
    const numTotalStudents = Number(totalStudents);
    if (step === 2 && numClasses > 0 && numTotalStudents > 0) {
      const newCourses = Array.from({ length: numClasses }, (_, i) => ({
        courseCode: `${semesterName.replace(/\s/g, '')}_C${i + 1}`, // Format code không dấu cách
        courseName: `EXE101 ${semesterName} - Class ${i + 1}`,
        semester: semesterName,
        year: new Date().getFullYear(),
        lecturerId: '',
        description: '' // Init description
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

  const handleFinalize = async () => {
    const numClassCount = Number(classCount);
    const numTotalStudents = Number(totalStudents);

    if (!numClassCount || numClassCount <= 0 || !numTotalStudents) return;

    // Validate Lecturer (Có thể bỏ qua nếu cho phép tạo lớp không có GV)
    if (courses.some(c => !c.lecturerId)) {
       const confirm = window.confirm("Một số lớp chưa có giảng viên. Bạn có chắc chắn muốn tiếp tục?");
       if (!confirm) return;
    }

    setIsSubmitting(true);

    // Logic tính toán phân bổ nhóm
    const studentsPerClass = Math.floor(numTotalStudents / numClassCount);
    const maxTeams = Math.floor(studentsPerClass / MIN_GROUP_SIZE);
    const emptyGroupsToCreate = Math.ceil(maxTeams * (1 + SAFETY_FACTOR));

    // Chuẩn bị dữ liệu gửi sang Proxy
    const finalCoursesData = courses.map(c => ({
      courseCode: c.courseCode,
      courseName: c.courseName,
      semester: c.semester, // Gửi kèm để Proxy nhét vào description
      lecturerId: c.lecturerId, // Gửi kèm để Proxy nhét vào description
      description: c.description,
      emptyGroupsToCreate: emptyGroupsToCreate, // Dữ liệu cho logic tạo nhóm
    }));

    try {
      // Gọi API Proxy
      const response = await fetch('/api/courses/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courses: finalCoursesData // Chỉ cần gửi danh sách courses đã xử lý
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi khởi tạo khóa học từ server.');
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
          alert(`Đã tạo được ${result.created.length} lớp, nhưng có lỗi: \n${result.errors.join('\n')}`);
      } else {
          alert(`Đã khởi tạo thành công ${result.created.length} lớp!`);
      }
      
      onComplete(result.created);
      onClose();

    } catch (error) {
      console.error("Failed to initialize courses:", error);
      alert("Có lỗi xảy ra khi khởi tạo. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const numTotalStudentsCalc = Number(totalStudents);
  const numClassCountCalc = Number(classCount);

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
                <Input 
                  id="semesterName" 
                  value={semesterName} 
                  onChange={e => setSemesterName(e.target.value)} 
                  placeholder="Ví dụ: Summer 2025"
                />
              </div>
              <div>
                <Label htmlFor="totalStudents">Tổng số sinh viên</Label>
                <Input 
                  id="totalStudents" 
                  type="number" 
                  value={totalStudents} 
                  onChange={e => setTotalStudents(e.target.value === '' ? '' : parseInt(e.target.value))} 
                />
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
              <Label htmlFor="classCount" className="col-span-1">Số lượng lớp</Label>
              <Input 
                id="classCount" 
                type="number" 
                min="1" 
                value={classCount} 
                onChange={e => setClassCount(e.target.value === '' ? '' : parseInt(e.target.value))} 
                className="col-span-1" 
              />
              <p className="col-span-2 text-sm text-muted-foreground">
                {(numClassCountCalc > 0 && numTotalStudentsCalc > 0) ? `~${Math.floor(numTotalStudentsCalc / numClassCountCalc)} sinh viên / lớp` : ''}
              </p>
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-4 space-y-4 border rounded-md p-2">
              {courses.map((course, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-3 border rounded-lg items-center bg-slate-50 dark:bg-slate-900">
                  <div className="col-span-1">
                    <Label className="text-xs text-muted-foreground">Mã lớp</Label>
                    <p className="font-medium text-sm">{course.courseCode}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Giảng viên phụ trách</Label>
                    <Select onValueChange={(value) => handleCourseLecturerChange(index, value)} value={course.lecturerId}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn giảng viên"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lecturers.map(lecturer => (
                          <SelectItem key={lecturer.userId || lecturer.id} value={lecturer.userId || lecturer.id}>
                            {lecturer.fullName || lecturer.name || lecturer.username || "Unknown Lecturer"}
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
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                Quay lại
              </Button>
              <Button onClick={handleFinalize} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Đang xử lý... <Loader2 className="w-4 h-4 ml-2 animate-spin" /></>
                ) : (
                  <>Hoàn tất & Tạo nhóm <CheckCircle className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}