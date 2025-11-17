// lib/api/taskService.ts

import {
  GroupService as GeneratedGroupService,
  OpenAPI,
} from "@/lib/api/generated";
import type { Task, TaskStatus } from "@/lib/types";

const IS_MOCK_MODE = false;
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';

export class TaskService {
  static async getTasksByGroupId(groupId: string): Promise<Task[]> {
    try {
      console.log(`[TaskService.getTasksByGroupId] Fetching tasks for group ${groupId}...`);
      
      // SỬA: Dùng getApiGroup1 (GET /api/Group/{id})
      const group = await GeneratedGroupService.getApiGroup1(groupId);
      
      // Lấy taskDetails từ response group
      const apiTasks = (group as any).taskDetails || [];

      return apiTasks.map((t: any) => ({
        taskId: t.id || "",
        // Map 'title' từ API -> 'taskName' của Frontend
        taskName: t.title || "Chưa đặt tên", 
        description: t.description || "",
        groupId: groupId,
        groupName: group.name || "",
        // Map 'createdBy' -> 'assignedToId' (tạm thời, hoặc cần logic assignees khác)
        assignedTo: t.createdByNavigation?.fullName || "Thành viên", 
        assignedToId: t.createdBy || "",
        status: mapApiStatusToFeStatus(t.status),
        priority: mapApiPriorityToFePriority(t.priority),
        dueDate: t.updatedAt || t.createdAt || new Date().toISOString(), // Fallback nếu không có dueDate
        createdDate: t.createdAt || new Date().toISOString(),
      }));

    } catch (err) {
      console.error("[TaskService] Failed to fetch tasks:", err);
      return [];
    }
  }
}

// Helper map status
function mapApiStatusToFeStatus(apiStatus: string): TaskStatus {
    const status = apiStatus?.toLowerCase() || '';
    if (status === 'done' || status === 'completed') return 'completed';
    if (status === 'inprogress' || status === 'in-progress') return 'in-progress';
    return 'pending';
}

// Helper map priority
function mapApiPriorityToFePriority(apiPriority: number | undefined): "low" | "medium" | "high" {
    if (apiPriority === 1) return "high";
    if (apiPriority === 2) return "medium";
    return "low";
}