// lib/api/groupService.ts
// Group service - Replace mock data with actual API calls - CRUD cho Group
import type { Group } from "@/lib/types";
import { mockSummer2025Groups } from "@/lib/mock-data/summer2025-data";

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
    const newGroup: Group = { ...groupData, groupId: `G${Date.now()}` };
    mockSummer2025Groups.push(newGroup);
    return Promise.resolve(newGroup);
  }
}