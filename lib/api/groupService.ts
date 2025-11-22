// lib/api/groupService.ts
import type { 
  Group as FeGroup, 
  GroupMember
} from "@/lib/types"; 

import {
  GroupMemberService as GeneratedGroupMemberService, 
  ApiError,
  OpenAPI,
  type Group as ApiGroup,
  type GroupMember as ApiGroupMember,
  type CreateGroupMemberViewModel,
} from "@/lib/api/generated";
import type { UpdateGroupViewModel } from "@/lib/api/generated/models/UpdateGroupViewModel";

const IS_MOCK_MODE = false;
// Route tất cả gọi qua BFF Proxy để chuẩn hóa CORS và auth
OpenAPI.BASE = '/api/proxy';

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
const mapApiGroupToFeGroup = (g: any): FeGroup => {
  if (!g) return null as any;
  
  const rawMembers = (g.groupMembers || g.members || []) as any[];
  const feMembers: GroupMember[] = rawMembers.map((gm: any) => {
    const student = gm.user || gm.student;
    const fullName = student ? getUserFullName(student) : (gm.username || gm.email || "Thành viên");
    return {
      userId: gm.userId || gm.studentId || gm.id || "",
      fullName,
      avatarUrl: (student?.userProfile as any)?.avatarUrl || "/placeholder-user.jpg",
      role: (gm.roleInGroup === 'Leader' || gm.roleInGroup === 'Group Leader' || gm.isLeader) ? 'leader' : 'member',
      major: (student?.major?.majorCode || student?.majorCode || "SE") as "SE" | "SS",
    };
  });

  const feMajors = Array.from(new Set(feMembers.map(m => m.major))).filter(Boolean) as ("SE" | "SS")[];

  return {
    groupId: g.id || "",
    groupName: g.name || "Chưa đặt tên",
    courseId: g.courseId || "", 
    courseCode: g.course?.courseCode || g.courseCode || "N/A", 
    memberCount: (g.countMembers ?? undefined) !== undefined ? (g.countMembers ?? 0) : feMembers.length || 0,
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
      const ts = Date.now();
      const res = await fetch(`/api/proxy/Group/GetAllGroups?_t=${ts}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`GetAllGroups failed: ${res.status} ${res.statusText} ${text}`);
      }
      const groupsFromApi = await res.json();
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
      const res = await fetch(`/api/proxy/Group/GetGroupBy/${id}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`GetGroupBy failed: ${res.status} ${res.statusText} ${text}`);
      }
      const groupFromApi = await res.json();
      return mapApiGroupToFeGroup(groupFromApi);
    } catch (err: any) {
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
      const res = await fetch(`/api/proxy/Group/CreateGroup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Một số triển khai backend yêu cầu courseId không-null khi tạo Group
        // Gửi kèm cả courseId để tránh lỗi 500 khi DB yêu cầu ràng buộc
        body: JSON.stringify({ name: data.name, courseId: data.courseId }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`CreateGroup failed: ${res.status} ${res.statusText} ${text}`);
      }
      const createdGroup = await res.json();
      // Nếu backend bỏ qua courseId ở bước tạo, đảm bảo cập nhật sau khi tạo
      const gid = createdGroup?.id || createdGroup?.groupId;
      const createdCourseId = createdGroup?.courseId;
      if (gid && !createdCourseId && data.courseId) {
        try {
          await this.updateGroup(gid, { courseId: data.courseId });
        } catch (e) {
          console.warn("CreateGroup: fallback update courseId failed", e);
        }
      }
      return mapApiGroupToFeGroup(createdGroup);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể tạo nhóm mới.";
      throw new Error(message);
    }
  }

  static async updateGroup(id: string, update: Partial<{ name: string; courseId: string; maxMembers: number; startDate: string; endDate: string }>): Promise<FeGroup> {
    try {
      const requestBody: UpdateGroupViewModel = {
        name: update.name,
        courseId: update.courseId,
        maxMembers: update.maxMembers as any,
        startDate: update.startDate as any,
        endDate: update.endDate as any,
      };
      const res = await fetch(`/api/proxy/Group/UpdateGroupBy/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`UpdateGroup failed: ${res.status} ${res.statusText} ${text}`);
      }
      const updated = await res.json();
      return mapApiGroupToFeGroup(updated);
    } catch (err) {
      throw new Error("Không thể cập nhật nhóm.");
    }
  }

  static async createEmptyGroups(params: { courseId: string; courseCode: string; count: number; maxMembers?: number }): Promise<FeGroup[]> {
    const { courseId, courseCode, count, maxMembers } = params;
    if (!courseId || !courseCode || !count || count <= 0) {
      throw new Error("Thiếu thông tin course hoặc số lượng nhóm không hợp lệ.");
    }
    // Tránh trùng tên: lấy danh sách tên hiện có và tăng số thứ tự
    const existing = await this.getGroups(courseId);
    const existingNames = new Set((existing || []).map(g => (g.groupName || '').trim()));

    const created: FeGroup[] = [];
    let seqNumber = 1;
    for (let i = 0; i < count; i++) {
      // Tìm tên chưa tồn tại
      let name = '';
      while (true) {
        const seq = String(seqNumber).padStart(2, '0');
        const candidate = `Nhóm ${courseCode}-${seq}`;
        if (!existingNames.has(candidate)) {
          name = candidate;
          break;
        }
        seqNumber++;
      }

      // Tạo nhóm
      const g = await this.createGroup({ name, courseId });
      // Cập nhật thông tin phụ (ví dụ maxMembers)
      const g2 = await this.updateGroup(g.groupId, {
        name,
        courseId,
        maxMembers: maxMembers ?? g.maxMembers ?? 6,
      });
      created.push(g2);
      existingNames.add(name);
      seqNumber++;
    }
    return created;
  }
}