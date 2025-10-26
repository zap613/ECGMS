import type { Group, User } from "@/lib/types";
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data";
import { mockUsers } from "@/lib/mock-data/auth"; // Import mockUsers để cập nhật

const API_BASE_URL = 'http://140.245.42.78:5050/api';

export class GroupService {
  // GET /api/Group
  static async getGroups(courseId?: string): Promise<Group[]> {
    console.log(`[GroupService.getGroups] Fetching groups for course: ${courseId || 'all'}`);
    if (courseId) {
        return Promise.resolve(mockSummer2025Groups.filter(g => g.courseId === courseId));
    }
    return Promise.resolve(mockSummer2025Groups);
  }

  // GET /api/Group/{id}
  static async getGroupById(id: string): Promise<Group | null> {
    console.log(`[GroupService.getGroupById] Fetching group with id: ${id}`);
    const group = mockSummer2025Groups.find(g => g.groupId === id) || null;
    return Promise.resolve(group);
  }
  
  // POST /api/Group
  static async createGroup(groupData: Omit<Group, 'groupId'>): Promise<Group> {
    console.log("[GroupService.createGroup] Creating group:", groupData);
    const newGroup: Group = { ...groupData, groupId: `G${Date.now()}` } as Group;
    mockSummer2025Groups.push(newGroup);
    return Promise.resolve(newGroup);
  }

  // === THÊM HÀM MỚI CHO LUỒNG 2 ===
  // Giả lập POST /api/GroupMember
  static async joinGroup(groupId: string, userId: string): Promise<{ group: Group, user: User }> {
    console.log(`[GroupService.joinGroup] User ${userId} attempting to join group ${groupId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng

    const group = mockSummer2025Groups.find(g => g.groupId === groupId);
    const user = mockUsers.find(u => u.userId === userId);

    if (!group || !user) {
      throw new Error("Không tìm thấy nhóm hoặc người dùng.");
    }

    // Luồng phụ: Nhóm đã đầy
    if (group.memberCount >= group.maxMembers) {
      throw new Error("Nhóm này đã đủ thành viên. Vui lòng chọn nhóm khác.");
    }
    
    // Luồng phụ: Nhóm không ở trạng thái "open"
    if (group.status !== 'open') {
        throw new Error("Không thể tự do tham gia nhóm này.");
    }

    // Luồng chính: Thêm sinh viên vào nhóm
    group.memberCount++;
    group.members.push({
      userId: user.userId,
      fullName: user.fullName,
      avatarUrl: (user as any).avatarUrl || "/placeholder-user.jpg", // Cần cập nhật type User nếu có avatar
    });

    // Luồng chính: Gán Leader nếu là người đầu tiên
    if (group.memberCount === 1) {
      group.leaderId = user.userId;
      group.leaderName = user.fullName;
      // Cập nhật vai trò trong GroupMember (nếu có)
    }

    // Cập nhật trạng thái sinh viên
    user.groupId = group.groupId;

    return Promise.resolve({ group, user });
  }
}
