// Group service - Replace mock data with actual API calls
import type {
  Group,
  GroupMember,
  GroupApprovalAction,
  MemberChangeAction,
  ProposeAdjustmentPayload,
  TaskAssignmentForm,
  ContributionScoreInput,
} from "@/lib/types";

// Types that match the real Group API
export interface ApiGroupMember {
  userId: string;
  roleInGroup: string;
  username: string;
  email: string;
  joinedAt: string;
  skillSet: string;
}

export interface ApiGroup {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  topicId: string | null;
  topicName: string | null;
  maxMembers: number | null;
  members: ApiGroupMember[];
  status: string | null;
}

export interface AddGroupMemberPayload {
  userId: string;
  groupId: string;
}

export class GroupService {
  // Get all groups
  static async getGroups(): Promise<ApiGroup[]> {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await fetch("/api/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        errorText || `Failed to load groups. Status: ${response.status}`
      );
    }

    const data = (await response.json()) as ApiGroup[];
    return data;
  }

  // Get group by ID
  static async getGroupById(groupId: string): Promise<ApiGroup | null> {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        errorText ||
          `Failed to load group detail. Status: ${response.status}`
      );
    }

    const data = (await response.json()) as ApiGroup;
    return data;
  }

  // Add member from "students without group" list
  static async addMemberToGroupViaApi(
    payload: AddGroupMemberPayload
  ): Promise<void> {
    const response = await fetch("/api/group-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        errorText ||
          `Failed to add member to group. Status: ${response.status}`
      );
    }
  }

  // Get group members
  static async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`)
    // return response.json()

    // Mock implementation for now
    const mockGroups = await import("@/lib/mock-data/groups");
    return mockGroups.mockGroupMembers.filter((m) => m.groupId === groupId);
  }

  // Get groups by course ID
  static async getGroupsByCourseId(courseId: string): Promise<Group[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/courses/${courseId}/groups`)
    // return response.json()

    // Mock implementation for now
    const mockGroups = await import("@/lib/mock-data/groups");
    return mockGroups.mockGroups.filter((g) => g.courseId === courseId);
  }

  // Approve group
  static async approveGroup(
    groupId: string,
    approvedBy: string
  ): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/groups/${groupId}/approve`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ approvedBy })
    // })

    // Mock implementation for now
    console.log(`Mock: Approving group ${groupId} by ${approvedBy}`);
  }

  // Reject group
  static async rejectGroup(
    groupId: string,
    reason: string,
    rejectedBy: string
  ): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/groups/${groupId}/reject`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ reason, rejectedBy })
    // })

    // Mock implementation for now
    console.log(
      `Mock: Rejecting group ${groupId} by ${rejectedBy}. Reason: ${reason}`
    );
  }

  // Mark group ready
  static async markGroupReady(
    groupId: string,
    ready: boolean,
    lecturerId: string
  ): Promise<void> {
    console.log(`Mock: Mark group ${groupId} ready=${ready} by ${lecturerId}`);
  }

  // Add member (student without group) to a group with reason
  static async addMember(action: MemberChangeAction): Promise<GroupMember> {
    console.log(
      `Mock: Add student ${action.studentId} to group ${action.groupId} by ${action.changedBy}. Reason=${action.reason}`
    );
    throw new Error("Not implemented");
  }

  // Remove member from a group with reason
  static async removeMember(action: MemberChangeAction): Promise<void> {
    console.log(
      `Mock: Remove student ${action.studentId} from group ${action.groupId} by ${action.changedBy}. Reason=${action.reason}`
    );
  }

  // Propose group adjustment
  static async proposeAdjustment(
    payload: ProposeAdjustmentPayload
  ): Promise<void> {
    console.log(
      `Mock: Propose adjustment for group ${payload.groupId} by ${payload.proposedBy}. Proposal=${payload.proposal}`
    );
  }

  // Assign task to group
  static async assignTask(form: TaskAssignmentForm): Promise<void> {
    console.log(
      `Mock: Assign task '${form.taskName}' to ${form.assigneeUserId} in group ${form.groupId}`
    );
  }

  // Set contribution score per member
  static async setContributionScore(
    input: ContributionScoreInput
  ): Promise<void> {
    console.log(
      `Mock: Set contribution score ${input.score} for student ${input.studentId} in group ${input.groupId}`
    );
  }

  // Get groups by lecturer
  static async getGroupsByLecturer(lecturerId: string): Promise<Group[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/groups`)
    // return response.json()

    // Mock implementation for now
    const mockGroups = await import("@/lib/mock-data/groups");
    const mockCourses = await import("@/lib/mock-data/courses");
    const courseIds = mockCourses.mockCourses
      .filter((c) => c.lecturerId === lecturerId)
      .map((c) => c.courseId);
    return mockGroups.mockGroups.filter((g) => courseIds.includes(g.courseId));
  }

  // Create new group
  static async createGroup(group: Omit<Group, "groupId">): Promise<Group> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented");
  }

  // Update group
  static async updateGroup(
    groupId: string,
    group: Partial<Group>
  ): Promise<Group> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented");
  }

  // Delete group
  static async deleteGroup(groupId: string): Promise<void> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented");
  }

  // Add member to group
  static async addMemberToGroup(
    groupId: string,
    studentId: string
  ): Promise<GroupMember> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented");
  }

  // Remove member from group
  static async removeMemberFromGroup(
    groupId: string,
    studentId: string
  ): Promise<void> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented");
  }

  // Export lecturer report
  static async exportLecturerReport(
    lecturerId: string,
    format: "xlsx" | "csv"
  ): Promise<Blob> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/reports?format=${format}`, {
    //   method: 'GET',
    // })
    // return response.blob()

    // Mock implementation for now
    console.log(
      `Mock: Exporting lecturer report for ${lecturerId} in ${format} format`
    );

    // Return mock file content
    const content = `Report for lecturer ${lecturerId}\nGenerated at ${new Date().toISOString()}`;
    return new Blob([content], {
      type:
        format === "csv"
          ? "text/csv"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
}
