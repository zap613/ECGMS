// mock-data/summer2025-data.ts
// Dữ liệu giả lập cho kịch bản kỳ học Summer 2025
// Sử dụng để kiểm thử tính năng khởi tạo khóa học và nhóm trống
import type { Course, Group } from "@/lib/types";

// =================================================================
// KỊCH BẢN: KỲ HỌC SUMMER 2025
// - Tổng số sinh viên: 500
// - Số lớp (courses): 5
// - Sinh viên mỗi lớp: 100
// - Số nhóm trống cần tạo mỗi lớp: 35 (100 / 4 * 1.4)
// =================================================================

// ===== DANH SÁCH 5 LỚP HỌC (COURSES) CỦA KỲ SUMMER 2025 =====
export const mockSummer2025Courses: Course[] = [
  {
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    courseName: "EXE101 - Lớp 1",
    semester: "Summer",
    year: 2025,
    lecturerId: "L001", // Gán cho Dr. Nguyen Van An
    description: "Lớp học EXE101 cho kỳ Summer 2025, nhóm 1.",
  },
  {
    courseId: "SUM25-C02",
    courseCode: "EXE101-C2",
    courseName: "EXE101 - Lớp 2",
    semester: "Summer",
    year: 2025,
    lecturerId: "L002", // Gán cho M.S. Hoang Thi Binh
    description: "Lớp học EXE101 cho kỳ Summer 2025, nhóm 2.",
  },
  {
    courseId: "SUM25-C03",
    courseCode: "EXE101-C3",
    courseName: "EXE101 - Lớp 3",
    semester: "Summer",
    year: 2025,
    lecturerId: "L003", // Gán cho Dr. Phan Van Cuong
    description: "Lớp học EXE101 cho kỳ Summer 2025, nhóm 3.",
  },
  {
    courseId: "SUM25-C04",
    courseCode: "EXE101-C4",
    courseName: "EXE101 - Lớp 4",
    semester: "Summer",
    year: 2025,
    lecturerId: "L004", // Gán cho Th.S Le Thi Dung
    description: "Lớp học EXE101 cho kỳ Summer 2025, nhóm 4.",
  },
  {
    courseId: "SUM25-C05",
    courseCode: "EXE101-C5",
    courseName: "EXE101 - Lớp 5",
    semester: "Summer",
    year: 2025,
    lecturerId: "L005", // Gán cho Dr. Tran Minh Giang
    description: "Lớp học EXE101 cho kỳ Summer 2025, nhóm 5.",
  },
];


// ===== DANH SÁCH CÁC NHÓM TRỐNG VÀ MẪU CHO LỚP 1 (SUM25-C01) =====
// (Trong thực tế, mỗi lớp sẽ có 35 nhóm tương tự)

const course1Groups: Group[] = Array.from({ length: 35 }, (_, i) => ({
    groupId: `SUM25-C01-G${(i + 1).toString().padStart(2, '0')}`,
    groupName: `Nhóm ${i + 1}`,
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 0, // Nhóm trống
    leaderName: "Chưa có",
    leaderId: "",
    status: "active",
    majors: [],
    createdDate: "2025-10-15",
}));

// Thêm một vài nhóm có thành viên để kiểm thử
const sampleGroups: Group[] = [
    {
        ...course1Groups[0],
        groupName: "Nhóm Alpha (Đã có 3 TV)",
        memberCount: 3,
        leaderId: "S001",
        leaderName: "Tran Thi Anh",
        majors: ["SE", "SS"],
        // Theo business rule, nhóm này có thể lock
    },
    {
        ...course1Groups[1],
        groupName: "Nhóm Beta (Đã có 2 TV)",
        memberCount: 2,
        leaderId: "S003",
        leaderName: "Dang Ngoc Chau",
        majors: ["SE"],
    }
]

// Ghi đè các nhóm trống ban đầu bằng các nhóm mẫu
sampleGroups.forEach(sg => {
    const index = course1Groups.findIndex(g => g.groupId === sg.groupId);
    if (index !== -1) {
        course1Groups[index] = sg;
    }
})


export const mockSummer2025Groups: Group[] = [
    ...course1Groups,
    // ... Thêm 35 nhóm cho 4 lớp còn lại ở đây
];