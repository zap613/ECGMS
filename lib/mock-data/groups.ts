// Mock group data - Replace with API calls later
export interface Group {
  groupId: string
  groupName: string
  courseId: string
  courseCode: string
  memberCount: number
  leaderName: string
  leaderId: string
  status: "active" | "inactive"
  majors: string[]
  createdDate: string
}

export const mockGroups: Group[] = [
  {
    groupId: "G001",
    groupName: "Team Alpha",
    courseId: "C001",
    courseCode: "EXE102",
    memberCount: 5,
    leaderName: "Tran Thi B",
    leaderId: "S001",
    status: "active",
    majors: ["SE", "SS"],
    createdDate: "2025-01-15",
  },
  {
    groupId: "G002",
    groupName: "Team Beta",
    courseId: "C001",
    courseCode: "EXE102",
    memberCount: 6,
    leaderName: "Le Van C",
    leaderId: "S002",
    status: "active",
    majors: ["SE", "SS"],
    createdDate: "2025-01-16",
  },
  {
    groupId: "G003",
    groupName: "Team Gamma",
    courseId: "C002",
    courseCode: "PRJ301",
    memberCount: 4,
    leaderName: "Nguyen Van E",
    leaderId: "S003",
    status: "active",
    majors: ["SE"],
    createdDate: "2025-01-17",
  },
]

export interface GroupMember {
  memberId: string
  groupId: string
  studentId: string
  studentName: string
  role: "leader" | "member" | "secretary"
  major: "SE" | "SS"
  skillSet: string[]
}

export const mockGroupMembers: GroupMember[] = [
  {
    memberId: "GM001",
    groupId: "G001",
    studentId: "S001",
    studentName: "Tran Thi B",
    role: "leader",
    major: "SE",
    skillSet: ["Frontend", "React", "TypeScript"],
  },
  {
    memberId: "GM002",
    groupId: "G001",
    studentId: "S002",
    studentName: "Le Van C",
    role: "member",
    major: "SS",
    skillSet: ["Backend", "Node.js", "Database"],
  },
]

// API placeholder functions
export async function getGroups(): Promise<Group[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGroups)
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGroups.find((g) => g.groupId === groupId) || null)
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGroupMembers.filter((m) => m.groupId === groupId))
}
