// Course service - Replace mock data with actual API calls
import type { Course } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export class CourseService {
  // Get all courses
  static async getCourses(): Promise<Course[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/courses`)
    // return response.json()
    
    // Mock implementation for now
    const mockCourses = await import("@/lib/mock-data/courses")
    return mockCourses.mockCourses
  }

  // Get course by ID
  static async getCourseById(courseId: string): Promise<Course | null> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/courses/${courseId}`)
    // return response.json()
    
    // Mock implementation for now
    const mockCourses = await import("@/lib/mock-data/courses")
    return mockCourses.mockCourses.find(c => c.courseId === courseId) || null
  }

  // Create new course
  static async createCourse(course: Omit<Course, 'courseId'>): Promise<Course> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/courses`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(course)
    // })
    // return response.json()
    
    // Mock implementation for now
    throw new Error("Not implemented")
  }

  // Update course
  static async updateCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented")
  }

  // Delete course
  static async deleteCourse(courseId: string): Promise<void> {
    // TODO: Replace with actual API call
    throw new Error("Not implemented")
  }
}
