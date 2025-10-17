// lib/mock-data/groups.ts
// Mock group data - Replace with API calls later
import type { Group, GroupMember } from "@/lib/types";

export const mockGroups: Group[] = [
  {
    groupId: "G001",
    groupName: "Team Alpha",
    courseId: "C001",
    courseCode: "EXE102",
    memberCount: 5,
    maxMembers: 6,
    leaderName: "Tran Thi B",
    leaderId: "S001",
    status: "active",
    majors: ["SE", "SS"],
    createdDate: "2025-01-15",
    members: [],
    needs: [],
    approvalStatus: "pending",
  },
  {
    groupId: "G002",
    groupName: "Team Beta",
    courseId: "C001",
    courseCode: "EXE102",
    memberCount: 6,
    maxMembers: 6,
    leaderName: "Le Van C",
    leaderId: "S002",
    status: "active",
    majors: ["SE", "SS"],
    createdDate: "2025-01-16",
    members: [],
    needs: [],
    approvalStatus: "approved",
    approvalDate: "2025-01-20",
    approvedBy: "L001",
  },
  {
    groupId: "G003",
    groupName: "Team Gamma",
    courseId: "C002",
    courseCode: "PRJ301",
    memberCount: 4,
    maxMembers: 6,
    leaderName: "Nguyen Van E",
    leaderId: "S003",
    status: "active",
    majors: ["SE"],
    createdDate: "2025-01-17",
    members: [],
    needs: [],
    approvalStatus: "rejected",
    rejectionReason:
      "Nhóm chỉ có 1 chuyên ngành (SE). Cần có ít nhất 2 chuyên ngành khác nhau.",
    approvalDate: "2025-01-18",
    approvedBy: "L001",
  },
];

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
];

// API placeholder functions
export async function getGroups(): Promise<Group[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGroups);
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGroups.find((g) => g.groupId === groupId) || null);
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGroupMembers.filter((m) => m.groupId === groupId));
}
