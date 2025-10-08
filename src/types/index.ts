// User Types
export type UserRole = "lecturer" | "student" | "admin"

export interface User {
  userId: string
  userName: string
  password: string
  fullName: string
  email: string
  birthday: string
  contactInfo: string
  roleId: string
  role: UserRole
  major?: "SS" | "SE" // Software System or Software Engineering
  skillSet?: string[] // BackEnd, FrontEnd, Database, etc.
}

// Course Types
export interface Course {
  courseId: string
  courseName: string
  courseCode: string
  description: string
  lecturerId: string
  lecturerName: string
  semester: string
  year: number
  maxGroupSize: number
  minGroupSize: number
  createdAt: string
}

// Group Types
export interface Group {
  groupId: string
  groupName: string
  courseId: string
  courseName: string
  description: string
  memberCount: number
  maxMembers: number
  createdAt: string
  status: "active" | "inactive" | "completed"
}

export interface GroupMember {
  memberId: string
  groupId: string
  userId: string
  userName: string
  fullName: string
  role: "leader" | "member" | "secretary"
  major: "SS" | "SE"
  skillSet: string[]
  joinedAt: string
}

// Task Types
export interface Task {
  taskId: string
  groupId: string
  title: string
  description: string
  assignedTo: string
  assignedToName: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  createdAt: string
}

// Grade Types
export interface GradeItem {
  gradeItemId: string
  courseId: string
  itemName: string
  maxScore: number
  weight: number
  type: "group" | "individual"
  description: string
}

export interface GradeRecord {
  recordId: string
  gradeItemId: string
  studentId: string
  groupId?: string
  score: number
  feedback: string
  gradedAt: string
  gradedBy: string
}

// Auth Types
export interface AuthContextType {
  user: User | null
  login: (userName: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
