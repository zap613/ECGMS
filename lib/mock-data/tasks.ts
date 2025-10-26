// lib/mock-data/tasks.ts
// Mock task data - Replace with API calls later
import type { Task } from "@/lib/types"

export const mockTasks: Task[] = [
  {
  taskId: "T001",
  taskName: "Design Database Schema",
  description: "Create the initial database schema for the project using ERD.",
  groupId: "SUM25-C01-G01",
  groupName: "Cyber Elites",
  assignedTo: "Le Van C",
  assignedToId: "S002",
  status: "completed",
  priority: "high",
  dueDate: "2025-11-01",
  createdDate: "2025-10-20",
  },
  {
  taskId: "T002",
  taskName: "Implement Authentication UI",
  description: "Create the login and registration pages with form validation.",
  groupId: "SUM25-C01-G01",
  groupName: "Cyber Elites",
  assignedTo: "Hồ Nguyên Giáp",
  assignedToId: "SE171532",
  status: "in-progress",
  priority: "high",
  dueDate: "2025-11-05",
  createdDate: "2025-10-22",
  },
  {
  taskId: "T003",
  taskName: "Write API Documentation",
  description: "Document all REST API endpoints using Swagger/OpenAPI.",
  groupId: "SUM25-C01-G02",
  groupName: "Code Wizards",
  assignedTo: "Bui Minh H",
  assignedToId: "S004",
  status: "pending",
  priority: "medium",
  dueDate: "2025-11-10",
  createdDate: "2025-10-25",
  },
  {
  taskId: "T004",
  taskName: "Setup CI/CD Pipeline",
  description: "Configure automated testing and deployment using GitHub Actions.",
  groupId: "SUM25-C01-G01",
  groupName: "Cyber Elites",
  assignedTo: "Dang Ngoc G",
  assignedToId: "S003",
  status: "in-progress",
  priority: "medium",
  dueDate: "2025-11-15",
  createdDate: "2025-10-28",
  },
  {
  taskId: "T005",
  taskName: "User Acceptance Testing",
  description: "Perform UAT on the main features before the midterm demo.",
  groupId: "SUM25-C01-G02",
  groupName: "Code Wizards",
  assignedTo: "Bui Minh H",
  assignedToId: "S004",
  status: "pending",
  priority: "low",
  dueDate: "2025-11-20",
  createdDate: "2025-11-05",
  },
]

// API placeholder functions
export async function getTasks(): Promise<Task[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockTasks)
}

export async function getTasksByGroup(groupId: string): Promise<Task[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockTasks.filter((t) => t.groupId === groupId))
}
