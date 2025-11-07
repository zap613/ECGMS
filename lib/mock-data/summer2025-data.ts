// lib/mock-data/summer2025-data.ts (NỘI DUNG THAY THẾ HOÀN TOÀN)

import type { Course, Group, GroupMember } from "@/lib/types";

// --- Dữ liệu các khóa học trong kỳ ---
export const mockSummer2025Courses: Course[] = [
  {
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    courseName: "Dự án Trải nghiệm (EXE)",
    semester: "Summer 2025",
    status: "open",
    createdDate: "2025-10-10",
    groupCount: 6,
    studentCount: 30, // Giả sử
    lecturerCount: 5,  // Giả sử
  },
  {
    courseId: "SUM25-C02",
    courseCode: "EXE102-C2",
    courseName: "Dự án Trải nghiệm (EXE) - Khóa 2",
    semester: "Summer 2025",
    status: "pending",
    createdDate: "2025-10-11",
    groupCount: 0,
    studentCount: 0,
    lecturerCount: 0,
  },
];

// --- Dữ liệu thành viên mẫu (Đã sửa) ---
const sampleMembers: GroupMember[] = [
  { userId: "S001", fullName: "Tran Thi Anh", avatarUrl: "/placeholder-user.jpg", role: "leader", major: "SE" },
  { userId: "S002", fullName: "Le Van Binh", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SS" },
  { userId: "S003", fullName: "Pham Gia Cat", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SE" },
  { userId: "S004", fullName: "Bui Minh Duc", avatarUrl: "/placeholder-user.jpg", role: "leader", major: "SS" },
  { userId: "S005", fullName: "Do Thi Em", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SS" },
  { userId: "S006", fullName: "Nguyen Hoang K", avatarUrl: "/placeholder-user.jpg", role: "leader", major: "SE" },
  { userId: "S007", fullName: "Le My L", avatarUrl: "/placeholder-user.jpg", role: "leader", major: "SE" },
  { userId: "S008", fullName: "Phan Gia M", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SE" },
];


// --- Dữ liệu các nhóm trong khóa học C01 ---
const sampleGroupsWithMembers: Group[] = [
  // Nhóm 1: Trạng thái "lock", đủ 3 thành viên, có thể khóa nhóm
  {
    groupId: "SUM25-C01-G01",
    groupName: "Cyber Elites",
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 3,
    maxMembers: 6,
    leaderId: "S001",
    leaderName: "Tran Thi Anh",
    status: "lock",
    majors: ["SE", "SS"],
    createdDate: "2025-10-15",
    members: sampleMembers.slice(0, 3), // Dùng 3 thành viên đầu
    needs: [ { major: "SE", count: 1 }, { major: "SS", count: 2 } ],
    isLockedByRule: true,
  },
  // Nhóm 2: Trạng thái "open", chưa đủ 3 thành viên
  {
    groupId: "SUM25-C01-G02",
    groupName: "Code Wizards",
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 2,
    maxMembers: 6,
    leaderId: "S004",
    leaderName: "Bui Minh Duc",
    status: "open",
    majors: ["SS"],
    createdDate: "2025-10-16",
    members: sampleMembers.slice(3, 5), // Dùng 2 thành viên tiếp theo
    needs: [ { major: "SE", count: 3 }, { major: "SS", count: 1 }],
    isLockedByRule: false,
  },
  // Nhóm 3: Trạng thái "finalize", đã đủ thành viên
  {
    groupId: "SUM25-C01-G03",
    groupName: "Innovate FPT",
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 6,
    maxMembers: 6,
    leaderId: "S006",
    leaderName: "Nguyen Hoang K",
    status: "finalize",
    majors: ["SE", "SS"],
    createdDate: "2025-10-14",
    members: [ // Lấy 6 thành viên
        ...sampleMembers.slice(0, 6)
    ],
    needs: [],
  },
  // Nhóm 4: Trạng thái "private", chỉ có thể vào bằng lời mời
  {
    groupId: "SUM25-C01-G04",
    groupName: "Stealth Coders",
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 2,
    maxMembers: 5,
    leaderId: "S007",
    leaderName: "Le My L",
    status: "private",
    majors: ["SE"],
    createdDate: "2025-10-17",
    members: [ // Lấy 2 thành viên cuối
        ...sampleMembers.slice(6, 8)
    ],
    needs: [],
  },
];


// --- Dữ liệu các nhóm đang tìm thành viên (cho sinh viên chưa có nhóm) ---
const sampleOpenGroups: Group[] = [
  {
    groupId: "SUM25-C01-G05",
    groupName: "Frontend Legends",
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 4,
    maxMembers: 6,
    leaderId: "S010",
    leaderName: "Nguyen Van P",
    status: "open",
    majors: ["SE"],
    createdDate: "2025-10-18",
    members: [
      { userId: "S010", fullName: "Nguyen Van P", avatarUrl: "/placeholder-user.jpg", role: "leader", major: "SE" },
      { userId: "S011", fullName: "Tran Thi Q", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SE" },
      { userId: "S012", fullName: "Le Van R", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SE" },
      { userId: "S013", fullName: "Pham Thi S", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SE" },
    ],
    needs: [ { major: "SS", count: 2 } ],
  },
  {
    groupId: "SUM25-C01-G06",
    groupName: "Business Analysts United",
    courseId: "SUM25-C01",
    courseCode: "EXE101-C1",
    memberCount: 3,
    maxMembers: 6,
    leaderId: "S020",
    leaderName: "Hoang Thi T",
    status: "open",
    majors: ["SS"],
    createdDate: "2025-10-19",
    members: [
      { userId: "S020", fullName: "Hoang Thi T", avatarUrl: "/placeholder-user.jpg", role: "leader", major: "SS" },
      { userId: "S021", fullName: "Vu Van U", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SS" },
      { userId: "S022", fullName: "Dang Thi V", avatarUrl: "/placeholder-user.jpg", role: "member", major: "SS" },
    ],
    needs: [ { major: "SE", count: 3 } ],
  },
];

export const mockSummer2025Groups: Group[] = [
  ...sampleGroupsWithMembers,
  ...sampleOpenGroups,
];