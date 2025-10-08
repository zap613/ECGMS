// Mock course data - Replace with API calls later
export interface Course {
  courseId: string
  courseCode: string
  courseName: string
  semester: string
  year: number
  lecturerId: string
  description?: string
}

export const mockCourses: Course[] = [
  {
    courseId: "C001",
    courseCode: "EXE102",
    courseName: "Experiential Entrepreneurship 2",
    semester: "Spring",
    year: 2025,
    lecturerId: "L001",
    description: "Project-based course focusing on entrepreneurship and team collaboration",
  },
  {
    courseId: "C002",
    courseCode: "PRJ301",
    courseName: "Java Web Application Development",
    semester: "Spring",
    year: 2025,
    lecturerId: "L001",
    description: "Building web applications using Java technologies",
  },
  {
    courseId: "C003",
    courseCode: "SWP391",
    courseName: "Software Development Project",
    semester: "Spring",
    year: 2025,
    lecturerId: "L001",
    description: "Full-stack software development project",
  },
]

// API placeholder functions - Replace with actual API calls later
export async function getCourses(): Promise<Course[]> {
  // TODO: Replace with actual API call
  // return fetch('/api/courses').then(res => res.json())
  return Promise.resolve(mockCourses)
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  // TODO: Replace with actual API call
  // return fetch(`/api/courses/${courseId}`).then(res => res.json())
  return Promise.resolve(mockCourses.find((c) => c.courseId === courseId) || null)
}
