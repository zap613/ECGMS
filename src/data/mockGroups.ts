import type { Group, GroupMember } from "@/types"

export const mockGroups: Group[] = [
  {
    groupId: "G001",
    groupName: "Team Alpha",
    courseId: "C001",
    courseName: "EXE102",
    description: "E-commerce platform for local artisans",
    memberCount: 5,
    maxMembers: 6,
    createdAt: "2025-01-20T10:00:00Z",
    status: "active",
  },
  {
    groupId: "G002",
    groupName: "Team Beta",
    courseId: "C001",
    courseName: "EXE102",
    description: "Educational mobile app for children",
    memberCount: 4,
    maxMembers: 6,
    createdAt: "2025-01-21T10:00:00Z",
    status: "active",
  },
  {
    groupId: "G003",
    groupName: "Team Gamma",
    courseId: "C002",
    courseName: "SWP391",
    description: "Hospital management system",
    memberCount: 5,
    maxMembers: 5,
    createdAt: "2025-01-18T10:00:00Z",
    status: "active",
  },
]

export const mockGroupMembers: GroupMember[] = [
  {
    memberId: "GM001",
    groupId: "G001",
    userId: "S001",
    userName: "student1",
    fullName: "Le Van C",
    role: "leader",
    major: "SE",
    skillSet: ["FrontEnd", "UI/UX"],
    joinedAt: "2025-01-20T10:00:00Z",
  },
  {
    memberId: "GM002",
    groupId: "G001",
    userId: "S002",
    userName: "student2",
    fullName: "Pham Thi D",
    role: "member",
    major: "SS",
    skillSet: ["BackEnd", "Database"],
    joinedAt: "2025-01-20T10:05:00Z",
  },
]
