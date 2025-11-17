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
} from "@/lib/api/generated";

// Cấu hình Base URL
const IS_MOCK_MODE = false; // Luôn tắt mock
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';

console.log(`🌐 GroupService connected to: ${OpenAPI.BASE}`);

// --- ADAPTER: Chuyển đổi API (ApiGroup) sang Frontend (FeGroup) ---
const mapApiGroupToFeGroup = (g: ApiGroup): FeGroup => {
  if (!g) throw new Error("Dữ liệu nhóm từ API không hợp lệ");
  
  const feMembers: GroupMember[] = (g.groupMembers || []).map((gm: any) => {
    const student = gm.student || gm.user; // Xử lý trường hợp tên thuộc tính thay đổi
    return {
      userId: gm.studentId || gm.userId || "", 
      fullName: student?.fullName || `${student?.firstName || ''} ${student?.lastName || ''}`.trim() || "N/A",
      avatarUrl: (student?.userProfile as any)?.avatarUrl || "/placeholder-user.jpg",
      role: (gm.roleInGroup === 'Group Leader' || gm.isLeader) ? 'leader' : 'member',
      major: (student?.majorCode || student?.major?.majorCode || "SE") as "SE" | "SS",
    };
  });

  // Lấy danh sách Major từ thành viên (để hiển thị tag major)
  const feMajors = Array.from(new Set(feMembers.map(m => m.major))).filter(Boolean) as ("SE" | "SS")[];

  return {
    groupId: g.id || "",
    groupName: g.name || "Chưa đặt tên",
    courseId: g.courseId || "", 
    courseCode: g.course?.courseCode || "N/A",
    memberCount: g.countMembers || feMembers.length || 0,
    maxMembers: g.maxMembers || 6,
    leaderName: g.leader ? (g.leader.fullName || `${g.leader.firstName || ''} ${g.leader.lastName || ''}`.trim()) : "Chưa có",
    leaderId: g.leaderId || "",
    status: (g.status as FeGroup['status']) || 'open',
    majors: feMajors, 
    createdDate: g.createdAt || new Date().toISOString(), 
    members: feMembers, 
    needs: [], 
    isLockedByRule: false, 
  };
};

// --- REAL API SERVICE ---
export class GroupService {
  /**
   * Lấy danh sách nhóm.
   * Endpoint: GET /api/Group/GetAllGroups
   */
  static async getGroups(courseId?: string): Promise<FeGroup[]> {
    try {
      console.log(`[GroupService.getGroups] Đang tải danh sách nhóm...`);
      
      // Gọi API GetAllGroups
      // Lưu ý: Tên hàm được sinh ra dựa trên path /api/Group/GetAllGroups
      const groupsFromApi = await GeneratedGroupService.getApiGroupGetAllGroups();
      
      let feGroups = (Array.isArray(groupsFromApi) ? groupsFromApi : []).map(mapApiGroupToFeGroup);

      // Lọc theo courseId ở phía Client (vì API GetAllGroups không nhận tham số lọc)
      if (courseId) {
        feGroups = feGroups.filter(g => g.courseId === courseId);
      }

      return feGroups;
    } catch (err) {
      console.error("Lỗi API getGroups:", err);
      return []; // Trả về mảng rỗng thay vì throw lỗi để tránh crash UI
    }
  }

  /**
   * Lấy chi tiết một nhóm.
   * Endpoint: GET /api/Group/GetGroupBy/{id}
   */
  static async getGroupById(id: string): Promise<FeGroup | null> {
    try {
      console.log(`[GroupService.getGroupById] Đang tải nhóm: ${id}`);
      
      // Gọi API GetGroupBy/{id}
      const groupFromApi = await GeneratedGroupService.getApiGroupGetGroupBy({ id });
      
      return mapApiGroupToFeGroup(groupFromApi);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) {
        return null; 
      }
      console.error("Lỗi API getGroupById:", err);
      throw err;
    }
  }

  /**
   * Tham gia nhóm.
   * Endpoint: POST /api/GroupMember (Giả định chuẩn REST)
   * Hoặc nếu Swagger có endpoint khác cho join, cần cập nhật lại tên hàm.
   */
  static async joinGroup(groupId: string, userId: string): Promise<FeGroup> {
    try {
      console.log(`[GroupService.joinGroup] User ${userId} -> Group ${groupId}`);
      
      // Gọi API tạo GroupMember
      await GeneratedGroupMemberService.postApiGroupMember({
        requestBody: {
          groupId: groupId,
          studentId: userId,
          roleInGroup: "Member" // Mặc định là Member
        }
      });
      
      // Lấy lại thông tin nhóm mới nhất để cập nhật UI
      const updatedGroup = await this.getGroupById(groupId);
      if (!updatedGroup) throw new Error("Không thể lấy thông tin nhóm sau khi tham gia.");
      
      return updatedGroup;

    } catch (err: any) {
      console.error("Lỗi API joinGroup:", err);
      if (err instanceof ApiError) {
        const errorBody = err.body as any;
        // Xử lý thông báo lỗi từ Backend trả về
        const message = errorBody?.detail || errorBody?.title || "Lỗi khi tham gia nhóm";
        throw new Error(message);
      }
      throw err;
    }
  }

  /**
   * Tạo nhóm mới.
   * Endpoint: POST /api/Group/CreateGroup
   */
  static async createGroup(data: { name: string, courseId: string }): Promise<FeGroup> {
    try {
      console.log(`[GroupService.createGroup] Đang tạo nhóm: ${data.name}`);
      
      const requestBody: GroupCreateModel = {
        name: data.name,
        // Các trường khác nếu API yêu cầu (ví dụ courseId, nhưng swagger mẫu CreateGroup chỉ thấy 'name')
        // Nếu API cần courseId, bạn cần check lại model generated GroupCreateModel
      };

      // Nếu GroupCreateModel có courseId, hãy thêm vào:
      // (requestBody as any).courseId = data.courseId;

      const createdGroup = await GeneratedGroupService.postApiGroupCreateGroup({
        requestBody: requestBody
      });

      return mapApiGroupToFeGroup(createdGroup);
    } catch (err) {
      console.error("Lỗi API createGroup:", err);
      throw new Error("Không thể tạo nhóm mới.");
    }
  }
}