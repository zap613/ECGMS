// lib/types.ts (Đã cập nhật)

// ===== USER & AUTHENTICATION TYPES =====
export interface User {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  role: "lecturer" | "student" | "admin";
  major?: "SS" | "SE";
  skillSet?: string[];
  birthday?: string;
  contactInfo?: string;
  groupId?: string | null; // Thuộc tính này rất quan trọng
}

// ===== COURSE TYPES =====
export interface Course {
  courseId: string
  courseCode: string
  courseName: string
  semester: string
  year?: number // Sửa: Cho phép year là optional
  lecturerId?: string // Sửa: Cho phép lecturerId là optional

  // SỬA: Thêm các thuộc tính này để khớp với mock data
  description?: string
  status?: "open" | "pending" | "closed"
  groupCount?: number
  studentCount?: number
  lecturerCount?: number
}

// ===== GROUP TYPES =====
export interface Group {
  groupId: string;
  groupName: string;
  courseId: string;
  courseCode: string;
  memberCount: number;
  maxMembers: number; 
  leaderName: string;
  leaderId: string;
  status: "open" | "lock" | "finalize" | "private";
  majors: ("SE" | "SS")[];
  createdDate: string;
  members: GroupMember[]; // Thêm danh sách thành viên
  needs: GroupNeeds[]; // Thêm nhu cầu tuyển dụng
  isLockedByRule?: boolean;
}

export interface GroupMember {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  // SỬA: Thêm 'role'
  role: "leader" | "member"; 
  major: "SE" |