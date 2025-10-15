// lib/types.ts
// Centralized type definitions for ECGMS
// This file contains all TypeScript interfaces and types used throughout the application

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
  groupId?: string | null; // <-- THÊM DÒNG NÀY: null hoặc undefined nghĩa là chưa có nhóm
}

// ===== COURSE TYPES =====
export interface Course {
  courseId: string
  courseCode: string
  courseName: string
  semester: string
  year: number
  lecturerId: string
  description?: string
}

// ===== GROUP TYPES =====
export interface Group {
  groupId: string;
  groupName: string;
  courseId: string;
  courseCode: string;
  memberCount: number;
  maxMembers: number; // Thêm số lượng thành viên tối đa
  leaderName: string;
  leaderId: string;
  status: "open" | "lock" | "finalize" | "private"; // Cập nhật trạng thái
  majors: ("SE" | "SS")[];
  createdDate: string;
  members: GroupMember[]; // Thêm danh sách thành viên
  needs: GroupNeeds[]; // Thêm nhu cầu tuyển dụng
  isLockedByRule?: boolean; // Thêm cờ cho business rule "lock nhóm khi có 3 TV"
}

export interface GroupMember {
  userId: string;
  fullName: string;
  avatarUrl?: string; // Thêm avatar để hiển thị
}

export interface GroupNeeds {
  major: "SE" | "SS";
  count: number;
}

// ===== GRADE TYPES =====
export interface GradeItem {
  gradeItemId: string
  courseId: string
  courseCode: string
  itemName: string
  maxScore: number
  weight: number // percentage
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

// ===== TASK TYPES =====
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

// ===== UTILITY TYPES =====
export type UserRole = "lecturer" | "student" | "admin"
export type Major = "SS" | "SE"
export type GroupStatus = "active" | "inactive"
export type GroupRole = "leader" | "member" | "secretary"
export type TaskStatus = "pending" | "in-progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"
export type GradeType = "group" | "individual"

// ===== API RESPONSE TYPES =====
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

// ===== FORM TYPES =====
export interface LoginForm {
  username: string
  password: string
}

export interface CreateGroupForm {
  groupName: string
  courseId: string
  description?: string
}

export interface CreateTaskForm {
  taskName: string
  description: string
  assignedToId: string
  priority: TaskPriority
  dueDate: string
}

export interface GradeForm {
  score: number
  feedback?: string
}

// ===== DASHBOARD TYPES =====
export interface DashboardStats {
  totalStudents: number
  totalGroups: number
  totalCourses: number
  activeTasks: number
  completedTasks: number
  pendingTasks: number
}

export interface RecentActivity {
  id: string
  type: "task_completed" | "group_created" | "grade_assigned" | "member_added"
  description: string
  timestamp: string
  userId: string
  userName: string
}

// ===== NOTIFICATION TYPES =====
export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  userId: string
}

// ===== SEARCH & FILTER TYPES =====
export interface SearchFilters {
  searchTerm?: string
  status?: string
  role?: UserRole
  major?: Major
  courseId?: string
  groupId?: string
  dateFrom?: string
  dateTo?: string
}

export interface SortOptions {
  field: string
  direction: "asc" | "desc"
}

// ===== EXPORT TYPES FOR EXCEL =====
export interface ExcelExportData {
  students: User[]
  groups: Group[]
  courses: Course[]
  grades: Grade[]
  tasks: Task[]
}

// ===== ERROR TYPES =====
export interface AppError {
  code: string
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}
