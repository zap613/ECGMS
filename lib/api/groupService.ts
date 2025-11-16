// lib/api/groupService.ts (Đã sửa lỗi Adapter)

import type { 
  Group as FeGroup, // Type Frontend (camelCase)
  User as FeUser, 
  GroupMember
} from "@/lib/types"; 
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data";
import { mockUsers } from "@/lib/mock-data/auth";

import {
  GroupService as GeneratedGroupService,
  GroupMemberService as GeneratedGroupMemberService, 
  ApiError,
  OpenAPI,
  type Group as ApiGroup, // Type API (camelCase, tên khác)
  type GroupMember as ApiGroupMember, // Import type API cho GroupMember
} from "@/lib/api/generated";

const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';

console.log(IS_MOCK_MODE ? "🚀 ECGMS đang chạy ở chế độ MOCK_MODE" : "🌐 ECGMS đang chạy ở chế độ API thật");

// --- ADAPTER: Chuyển đổi API (ApiGroup) sang Frontend (FeGroup) ---
// SỬA LỖI 1-7: Map chính xác tên thuộc tính từ API (bên phải) sang FE (bên trái)
const mapApiGroupToFeGroup = (g: ApiGroup): FeGroup => {
  if (!g) return null as any;
  
  // Biến đổi groupMembers
  const feMembers: GroupMember[] = (g.groupMembers || []).map((gm: ApiGroupMember) => {
    // gm là kiểu ApiGroupMember, nó có 'user' và 'roleInGroup'
    return {
      userId: gm.userId || "", // Sửa: API có 'userId'
      fullName: `${gm.user?.firstName || ''} ${gm.user?.lastName || ''}`.trim(), // Sửa: API có 'user.firstName', 'user.lastName'
      avatarUrl: (gm.user?.userProfile as any)?.avatarUrl || "/placeholder-user.jpg",
      role: gm.roleInGroup === 'Group Leader' ? 'leader' : 'member', // Sửa: API có 'roleInGroup'
      major: (gm.user?.major?.majorCode as "SE" | "SS") || "SE", // Sửa: API có 'user.major.majorCode'
    };
  });

  // Biến đổi Majors
  const feMajors = (g.groupMembers || [])
    .map(m => m.user?.major?.majorCode)
    .filter(Boolean) as ("SE" | "SS")[];

  return {
    // FE-Name: API-Name (theo file Group.ts bạn cung cấp)
    groupId: g.id || "",
    groupName: g.name || "N/A",
    courseId: g.courseId || "", 
    courseCode: g.course?.courseCode || "N/A", // Lấy từ object lồng
    memberCount: g.countMembers || 0, // Sửa: API dùng 'countMembers'
    maxMembers: g.maxMembers || 6,
    leaderName: `${g.leader?.firstName || ''} ${g.leader?.lastName || ''}`.trim(), // Sửa: API có 'leader.firstName', 'leader.lastName'
    leaderId: g.leaderId || "",
    status: (g.status as FeGroup['status']) || 'open',
    majors: feMajors, // Sử dụng majors đã biến đổi
    createdDate: g.createdAt || "", // SỬA LỖI 10: API dùng 'createdAt'
    members: feMembers, // Sử dụng members đã biến đổi
    needs: [], // API Group không có 'needs', mặc định là mảng rỗng
    isLockedByRule: false, // API Group không có 'isLockedByRule'
  };
};

// --- MOCK SERVICE (Trả về kiểu FeGroup) ---
class MockGroupService {
  static async getGroups(courseId?: string): Promise<FeGroup[]> {
    console.warn(`[MockService.getGroups] Sử dụng dữ liệu giả. Course: ${courseId}`);
    let groups = mockSummer2025Groups;
    if (courseId) {
      groups = groups.filter(g => g.courseId === courseId);
    }
    return Promise.resolve(groups as FeGroup[]);
  }

  static async getGroupById(id: string): Promise<FeGroup | null> {
    console.warn(`[MockService.getGroupById] Sử dụng dữ liệu giả: ${id}`);
    const group = mockSummer2025Groups.find(g => g.groupId === id) || null;
    return Promise.resolve(group as FeGroup | null);
  }

  static async joinGroup(groupId: string, userId: string): Promise<FeGroup> {
    console.warn(`[MockService.joinGroup] User ${userId} tham gia nhóm giả ${groupId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const group = mockSummer2025Groups.find(g => g.groupId === groupId);
    const user = mockUsers.find(u => u.userId === userId);
    if (!group || !user) throw new Error("Không tìm thấy nhóm hoặc người dùng (mock).");
    if (group.memberCount >= group.maxMembers) throw new Error("Nhóm này đã đủ thành viên (mock).");
    if (group.status !== 'open') throw new Error("Không thể tự do tham gia nhóm này (mock).");
    group.memberCount++;
    group.members.push({
      userId: user.userId, fullName: user.fullName, avatarUrl: (user as any).avatarUrl || "/placeholder-user.jpg",
      role: "member", major: user.major || "SE",
    });
    if (group.memberCount === 1) {
      group.leaderId = user.userId; group.leaderName = user.fullName;
    }
    if(user) user.groupId = group.groupId;
    return Promise.resolve(group as FeGroup);
  }
}

// --- REAL API SERVICE (Gọi API, trả về FeGroup) ---
class RealGroupService {
  static async getGroups(courseId?: string): Promise<FeGroup[]> {
    try {
      console.log(`[RealService.getGroups] Đang gọi API thật... Course: ${courseId}`);
      // SỬA LỖI 8: Tham số đúng là { courseId } và tên hàm là 'getGroups'
      const groupsFromApi = await GeneratedGroupService.getGroups({ courseId: courseId });
      return groupsFromApi.map(mapApiGroupToFeGroup); 
    } catch (err) {
      console.error("Lỗi khi gọi API getGroups:", err);
      throw err; 
    }
  }

  static async getGroupById(id: string): Promise<FeGroup | null> {
    try {
      console.log(`[RealService.getGroupById] Đang gọi API thật: ${id}`);
      // SỬA LỖI 9: Tham số đúng là { id } và tên hàm là 'getGroup'
      const groupFromApi = await GeneratedGroupService.getGroup({ id: id });
      return mapApiGroupToFeGroup(groupFromApi);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) return null; 
      console.error("Lỗi khi gọi API getGroupById:", err);
      throw err;
    }
  }

  static async joinGroup(groupId: string, userId: string): Promise<FeGroup> {
    try {
      console.log(`[RealService.joinGroup] User ${userId} đang gọi API thật cho nhóm ${groupId}`);
      const requestBody = { groupId: groupId, studentId: userId };
      // SỬA LỖI 10: Tên hàm đúng là 'createGroupMember'
      await GeneratedGroupMemberService.createGroupMember({ requestBody: requestBody });
      const updatedGroup = await this.getGroupById(groupId);
      if (!updatedGroup) throw new Error("Không thể lấy thông tin nhóm sau khi tham gia.");
      return updatedGroup;
    } catch (err: any) {
      console.error("Lỗi khi gọi API joinGroup:", err);
      if (err instanceof ApiError) {
        // @ts-ignore
        const errorBody = err.body as { message?: string, errors?: any };
        const message = errorBody?.message || "Lỗi khi tham gia nhóm";
        if (errorBody?.errors?.StudentId) {
          throw new Error(errorBody.errors.StudentId[0]);
        }
        throw new Error(message);
      }
      throw err;
    }
  }
}

// EXPORT LỚP ADAPTER CHÍNH
export const GroupService = IS_MOCK_MODE ? MockGroupService : RealGroupService;