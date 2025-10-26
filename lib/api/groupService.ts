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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class GroupService {
  // Get all groups
  static async getGroups(): Promise<Group[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/groups`)
    // return response.json()

    // Mock implementation for now
    const mockGroups = await import("@/lib/mock-data/groups");
    return mockGroups.mockGroups;
  }

  // Get group by ID
  static async getGroupById(groupId: string): Promise<Group | null> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/groups/${groupId}`)
    // return response.json()

    // Mock implementation for now
    const mockGroups = await import("@/lib/mock-data/groups");
    return mockGroups.mockGroups.find((g) => g.groupId === groupId) || null;
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
}
