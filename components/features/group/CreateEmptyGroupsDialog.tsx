"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CourseService } from "@/lib/api/courseService"
import { GroupService } from "@/lib/api/groupService"
import type { Course } from "@/lib/types"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (createdCount: number) => void
  initialCourseId?: string
  initialCourseCode?: string
}

export function CreateEmptyGroupsDialog({ isOpen, onClose, onSuccess, initialCourseId, initialCourseCode }: Props) {
  const { toast } = useToast()
  const [courses, setCourses] = React.useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>("")
  const [selectedCourseCode, setSelectedCourseCode] = React.useState<string>("")
  const [count, setCount] = React.useState<number>(30)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      const list = await CourseService.getCourses()
      setCourses(list)
      // Ưu tiên giá trị truyền từ ngoài nếu có
      if (initialCourseId) {
        setSelectedCourseId(initialCourseId)
        setSelectedCourseCode(initialCourseCode || (list.find(c => c.courseId === initialCourseId)?.courseCode || ""))
      } else if (list.length > 0) {
        setSelectedCourseId(list[0].courseId)
        setSelectedCourseCode(list[0].courseCode)
      }
    })()
  }, [isOpen, initialCourseId, initialCourseCode])

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    const c = courses.find(c => c.courseId === courseId)
    setSelectedCourseCode(c?.courseCode || "")
  }

  const handleSubmit = async () => {
    if (!selectedCourseId || !selectedCourseCode || count <= 0) {
      toast({ title: "Thiếu thông tin", description: "Hãy chọn môn học và số lượng nhóm hợp lệ." })
      return
    }
    setSubmitting(true)
    try {
      const created = await GroupService.createEmptyGroups({
        courseId: selectedCourseId,
        courseCode: selectedCourseCode,
        count,
      })
      toast({
        title: "Tạo nhóm trống thành công",
        description: `Đã tạo ${created.length} nhóm cho môn ${selectedCourseCode}.`
      })
      onSuccess?.(created.length)
      onClose()
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.message || "Không thể tạo nhóm trống." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Nhóm Trống</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Môn học</Label>
            <Select value={selectedCourseId} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.courseId} value={c.courseId}>
                    {c.courseCode} - {c.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Số lượng nhóm trống</Label>
            <Input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={submitting || !selectedCourseId || count <= 0}>
            {submitting ? "Đang tạo..." : "Tạo nhóm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}