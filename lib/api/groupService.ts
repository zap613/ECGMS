// lib/api/groupService.ts
import type { 
  Group as FeGroup, 
  GroupMember
} from "@/lib/types"; 

import {
  GroupService as GeneratedGroupService,
  GroupMemberService as GeneratedGroupMemberService, 
  ApiError,
  OpenAPI,
  type Group as ApiGroup,
  type GroupMember as ApiGroupMember,
  type GroupCreateModel,
  type CreateGroupMemberViewModel,
} from "@/lib/api/generated";

const IS_MOCK_MODE = false;
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';

// Helper lấy tên User an toàn
const getUserFullName = (user: any): string => {
    if (!user) return "N/A";
    // SỬA LỖI: Ép kiểu 'any' để tránh lỗi TS khi truy cập property không có trong type
    const u = user as any;
    if (u.firstName || u.lastName) {
        return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    }
    return u.fullName || u.username || u.email || "Unknown User";
}

// --- ADAPTER ---
const mapApiGroupToFeGroup = (g: ApiGroup): FeGroup => {
  if (!g) return null as any;
  
  const feMembers: GroupMember[] = (g.groupMembers || []).map((gm: any) => {
    const student = gm.user || gm.student; 
    return {
      userId: gm.userId || gm.studentId || "", 
      fullName: getUserFullName(student), 
      avatarUrl: (student?.userProfile as any)?.avatarUrl || "/placeholder-user.jpg",
      role: (gm.roleInGroup === 'Group Leader' || gm.isLeader) ? 'leader' : 'member',
      major: (student?.major?.majorCode || student?.majorCode || "SE") as "SE" | "SS",
    };
  });

  const feMajors = Array.from(new Set(feMembers.map(m => m.major))).filter(Boolean) as ("SE" | "SS")[];

  return {
    groupId: g.id || "",
    groupName: g.name || "Chưa đặt tên",
    courseId: g.courseId || "", 
    courseCode: g.course?.courseCode || "N/A", 
    memberCount: g.countMembers || feMembers.length || 0, 
    maxMembers: g.maxMembers || 6,
    leaderName: getUserFullName(g.leader), 
    leaderId: g.leaderId || "",
    status: (g.status as FeGroup['status']) || 'open',
    majors: feMajors, 
    createdDate: g.createdAt || "", 
    members: feMembers, 
    needs: [], 
    isLockedByRule: false, 
  };
};

export class GroupService {
  static async getGroups(courseId?: string): Promise<FeGroup[]> {
    try {
      // Generated service getApiGroup không nhận tham số trong phiên bản này
      const groupsFromApi = await GeneratedGroupService.getApiGroup();
      let feGroups = (Array.isArray(groupsFromApi) ? groupsFromApi : []).map(mapApiGroupToFeGroup);
      if (courseId) {
        feGroups = feGroups.filter(g => g.courseId === courseId);
      }
      return feGroups;
    } catch (err) {
      console.error("Lỗi API getGroups:", err);
      return []; 
    }
  }

  static async getGroupById(id: string): Promise<FeGroup | null> {
    try {
      // SỬA LỖI: Truyền object { id }
      const groupFromApi = await GeneratedGroupService.getApiGroup1({ id });
      return mapApiGroupToFeGroup(groupFromApi);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) return null; 
      console.error("Lỗi API getGroupById:", err);
      throw err;
    }
  }

  static async joinGroup(groupId: string, userId: string): Promise<FeGroup> {
    try {
      const requestBody: CreateGroupMemberViewModel = { 
        groupId: groupId, 
        userId: userId 
      };
      await GeneratedGroupMemberService.postApiGroupMember({ requestBody });
      const updatedGroup = await this.getGroupById(groupId);
      if (!updatedGroup) throw new Error("Không thể lấy thông tin nhóm.");
      return updatedGroup;
    } catch (err: any) {
      // Error handling...
      throw err;
    }
  }

  static async createGroup(data: { name: string, courseId: string }): Promise<FeGroup> {
    try {
      const requestBody: GroupCreateModel = { name: data.name };
      (requestBody as any).courseId = data.courseId; 

      const createdGroup = await GeneratedGroupService.postApiGroup({ requestBody });
      return mapApiGroupToFeGroup(createdGroup);
    } catch (err) {
      throw new Error("Không thể tạo nhóm mới.");
    }
  }
}