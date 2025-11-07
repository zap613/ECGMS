// lib/api/groupService.ts

// 1. IMPORT TỪ MOCK DATA (cho chế độ mock)
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data";
import { mockUsers } from "@/lib/mock-data/auth";

// 2. IMPORT TỪ API CLIENT MỚI (cho API thật)
import {
  GroupService as GeneratedGroupService, // Đổi tên để tránh trùng lặp
  ApiError, // Bắt lỗi API
  OpenAPI, // Cấu hình Base URL
  type Group, // Giờ chúng ta dùng Type từ file generated
  type User, // Giờ chúng ta dùng Type từ file generated
} from "@/lib/api/generated";

// 3. THIẾT LẬP SWITCH VÀ BASE URL
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Cấu hình base URL cho API client đã generate
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';

console.log(IS_MOCK_MODE ? "🚀 ECGMS đang chạy ở chế độ MOCK_MODE" : "🌐 ECGMS đang chạy ở chế độ API thật");

// --- LỚP LOGIC CHO MOCK SERVICE ---
class MockGroupService {
  static async getGroups(courseId?: string): Promise<Group[]> {
    console.warn(`[MockService.getGroups] Sử dụng dữ liệu giả. Course: ${courseId}`);
    if (courseId) {
        return Promise.resolve(mockSummer2025Groups.filter(g => g.courseId === courseId) as Group[]);
    }
    return Promise.resolve(mockSummer2025Groups as Group[]);
  }

  static async getGroupById(id: string): Promise<Group | null> {
    console.warn(`[MockService.getGroupById] Sử dụng dữ liệu giả: ${id}`);
    const group = mockSummer2025Groups.find(g => g.groupId === id) || null;
    return Promise.resolve(group as Group | null);
  }

  static async joinGroup(groupId: string, userId: string): Promise<{ group: Group, user: User }> {
    console.warn(`[MockService.joinGroup] User ${userId} tham gia nhóm giả ${groupId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng

    const group = mockSummer2025Groups.find(g => g.groupId === groupId);
    const user = mockUsers.find(u => u.userId === userId);

    if (!group || !user) throw new Error("Không tìm thấy nhóm hoặc người dùng (mock).");
    if (group.memberCount >= group.maxMembers) throw new Error("Nhóm này đã đủ thành viên (mock).");
    if (group.status !== 'open') throw new Error("Không thể tự do tham gia nhóm này (mock).");

    // ... (logic mock như cũ) ...
    group.memberCount++;
    // @ts-ignore
    group.members.push({
      userId: user.userId,
      fullName: user.fullName,
      avatarUrl: (user as any).avatarUrl || "/placeholder-user.jpg",
      role: "member",
      major: user.major || "SE",
    });
    if (group.memberCount === 1) {
      group.leaderId = user.userId;
      group.leaderName = user.fullName;
    }
    user.groupId = group.groupId;

    // @ts-ignore
    return Promise.resolve({ group, user });
  }
}

// --- LỚP LOGIC CHO API SERVICE THẬT (ADAPTER) ---
class RealGroupService {
  static async getGroups(courseId?: string): Promise<Group[]> {
    try {
      console.log(`[RealService.getGroups] Đang gọi API thật... Course: ${courseId}`);
      // Tên hàm `apiGroupGet` này được sinh ra tự động
      const groups = await GeneratedGroupService.getApiGroup1({ courseId: courseId });
      return groups;
    } catch (err) {
      console.error("Lỗi khi gọi API getGroups:", err);
      throw err; // Ném lỗi ra để UI xử lý
    }
  }

  static async getGroupById(id: string): Promise<Group | null> {
    try {
      console.log(`[RealService.getGroupById] Đang gọi API thật: ${id}`);
      const group = await GeneratedGroupService.getApiGroupSearch({ id: id });
      return group;
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) {
        return null; // Trả về null nếu không tìm thấy
      }
      console.error("Lỗi khi gọi API getGroupById:", err);
      throw err;
    }
  }

   static async joinGroup(groupId: string, userId: string): Promise<{ group: Group, user: User }> {
    try {
      console.log(`[RealService.joinGroup] User ${userId} đang gọi API thật cho nhóm ${groupId}`);
      // API client mới (generated) sẽ có hàm joinGroup (tên có thể khác)
      // Giả sử API yêu cầu một body:
      // @ts-ignore - API thật có thể trả về kiểu dữ liệu khác
      const response = await GeneratedGroupService.apiGroupMemberPost({ 
        // Kiểu RequestBody này cũng được sinh ra tự động
        requestBody: { groupId, userId } 
      }); 

      // API thật có thể chỉ trả về Group, hoặc một thông báo thành công.
      // Bạn cần cập nhật logic này dựa trên response thật của API.
      // Giả sử API trả về đúng đối tượng Group đã cập nhật:
      const updatedGroup = response as Group; 
      // @ts-ignore - API thật không trả về user, ta cần tự cập nhật user ở client
      return { group: updatedGroup, user: null }; // Cần cập nhật logic này

    } catch (err: any) {
      console.error("Lỗi khi gọi API joinGroup:", err);
      if (err instanceof ApiError) {
        // Ném lỗi từ server để UI hiển thị
        throw new Error(err.body?.message || "Lỗi khi tham gia nhóm");
      }
      throw err;
    }
  }
}

// 4. EXPORT LỚP ADAPTER CHÍNH (THE SWITCH)
// Đây là lớp duy nhất mà ứng dụng của bạn (ví dụ: các trang Page.tsx) sẽ import và sử dụng.

export const GroupService = IS_MOCK_MODE ? MockGroupService : RealGroupService;