// lib/mock-data/grades.ts
// Mock grade data - Replace with API calls later
import type { GradeItem, Grade } from "@/lib/types"

export const mockGradeItems: GradeItem[] = [
  {
  gradeItemId: "GI001",
  courseId: "SUM25-C01",
  courseCode: "EXE101-C1",
  itemName: "Project Proposal",
  maxScore: 100,
  weight: 15,
  type: "group",
  description: "Initial project proposal and business plan",
  },
  {
  gradeItemId: "GI002",
  courseId: "SUM25-C01",
  courseCode: "EXE101-C1",
  itemName: "Midterm Presentation",
  maxScore: 100,
  weight: 25,
  type: "group",
  description: "Progress presentation at midterm",
  },
  {
  gradeItemId: "GI003",
  courseId: "SUM25-C01",
  courseCode: "EXE101-C1",
  itemName: "Individual Contribution",
  maxScore: 100,
  weight: 20,
  type: "individual",
  description: "Assessment of individual contribution to the project",
  },
  {
  gradeItemId: "GI004",
  courseId: "SUM25-C01",
  courseCode: "EXE101-C1",
  itemName: "Final Project",
  maxScore: 100,
  weight: 40,
  type: "group",
  description: "Final project deliverable and presentation",
  },
]

export const mockGrades: Grade[] = [
  {
  gradeId: "GR001",
  gradeItemId: "GI001",
  groupId: "SUM25-C01-G01",
  score: 85,
  feedback: "Good proposal with clear objectives",
  gradedBy: "L001",
  gradedDate: "2025-02-01",
  },
  {
  gradeId: "GR002",
  gradeItemId: "GI003",
  studentId: "SE171532",
  score: 90,
  feedback: "Excellent individual contribution, very proactive.",
  gradedBy: "L001",
  gradedDate: "2025-02-15",
  },
  {
  gradeId: "GR003",
  gradeItemId: "GI003",
  studentId: "S002",
  score: 80,
  feedback: "Good work on the backend part.",
  gradedBy: "L001",
  gradedDate: "2025-02-15",
  },
]

// API placeholder functions
export async function getGradeItems(courseId: string): Promise<GradeItem[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGradeItems.filter((gi) => gi.courseId === courseId))
}

export async function getGrades(gradeItemId: string): Promise<Grade[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockGrades.filter((g) => g.gradeItemId === gradeItemId))
}
