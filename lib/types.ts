// lib/types.ts (Đã sửa lỗi typo và bổ sung)

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
  groupId?: string | null; 
}

// ===== COURSE TYPES =====
export interface Course {
  courseId: string
  courseCode: string
  courseName: string
  semester: string
  year?: number 
  lecturerId?: string 
  description?: string
  status?: "open" | "pending" | "closed" | string 
  groupCount?: number
  studentCount?: number
  lecturerCount?: number
  createdDate?: string // SỬA LỖI 8, 9
  updatedDate?: string
}

// SỬA LỖI 10, 11: Định nghĩa GroupNeeds và GroupMember TRƯỚC Group
export interface GroupNeeds {
  major: "SE" | "SS";
  count: number;
}

export interface GroupMember {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  role: "leader" | "member"; 
  major: "SE" | "SS";      

  // Thuộc tính cũ (nếu có)
  memberId?: string;
  groupId?: string;
  studentId?: string;
  studentName?: string;
  skillSet?: string[];
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
  members: GroupMember[]; 
  needs: GroupNeeds[]; 
  isLockedByRule?: boolean;
}

// (Các type còn lại giữ nguyên...)
export interface GradeItem {
  gradeItemId: string
  courseId: string
  courseCode: string
  itemName: string
  maxScore: number
  weight: number 
  type: "group" | "individual"
  description?: string
}

export interface Grade {
  gradeId: string
  gradeItemId: string
  studentId?: string
  groupId?: string
  score: number
  feedback?: string
  gradedBy: string
  gradedDate: string
}

export interface Task {
  taskId: string
  taskName: string
  description: string
  groupId: string
  groupName: string
  assignedTo: string
  assignedToId: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  createdDate: string
}

export type UserRole = "lecturer" | "student" | "admin"
export type Major = "SS" | "SE"
export type GroupStatus = "active" | "inactive"
export type GroupRole = "leader" | "member" | "secretary"
export type TaskStatus = "pending" | "in-progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"
export type GradeType = "group" | "individual"

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LoginForm {
  username: string
  password: string
}

// ===== MAJOR TYPES =====
export interface MajorItem {
  id: string;
  majorCode: string;
  name: string;
  description?: string;
}