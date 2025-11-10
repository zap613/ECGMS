// Lecturer service - Replace mock implementations with real API calls later
import type { Group } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const MAX_GROUPS_PER_LECTURER = 10;

export interface AcceptGroupPayload {
  groupId: string;
  lecturerId: string;
}

export interface AvailableGroupsResponse {
  groups: Group[];
  canAccept: boolean;
  currentCount: number;
  maxCount: number;
}

export class LecturerService {
  /**
   * Fetch available groups a lecturer can accept.
   * Currently uses mock data until API endpoints are ready.
   */
  static async getAvailableGroups(
    lecturerId: string
  ): Promise<AvailableGroupsResponse> {
    // TODO: Replace with actual API call, e.g.
    // const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/available-groups`);
    // return response.json();

    const { mockGroups } = await import("@/lib/mock-data/groups");

    const currentGroups = mockGroups.filter(
      (group) => group.approvedBy === lecturerId
    );
    const availableGroups = mockGroups.filter(
      (group) =>
        group.approvalStatus === "pending" && group.approvedBy !== lecturerId
    );

    const currentCount = currentGroups.length;
    const maxCount = MAX_GROUPS_PER_LECTURER;
    const canAccept = currentCount < maxCount;

    return {
      groups: availableGroups,
      canAccept,
      currentCount,
      maxCount,
    };
  }

  /**
   * Accept a group assignment for the lecturer.
   */
  static async acceptGroup(payload: AcceptGroupPayload): Promise<void> {
    // TODO: Replace with actual API call, e.g.
    // await fetch(`${API_BASE_URL}/lecturers/${payload.lecturerId}/groups/${payload.groupId}/accept`, {
    //   method: "POST",
    // });

    console.log(
      `Mock: Lecturer ${payload.lecturerId} accepted group ${payload.groupId}`
    );
  }

  /**
   * Reject a group assignment for the lecturer with an optional reason.
   */
  static async rejectGroupAssignment(
    groupId: string,
    lecturerId: string,
    reason?: string
  ): Promise<void> {
    // TODO: Replace with actual API call, e.g.
    // await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/groups/${groupId}/reject`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ reason }),
    // });

    console.log(
      `Mock: Lecturer ${lecturerId} rejected group ${groupId}${
        reason ? `. Reason: ${reason}` : ""
      }`
    );
  }
}
