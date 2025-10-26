// lib/api/courseService.ts
// Course service - Replace mock data with actual API calls - Xử lý các thao tác liên quan đến Khóa học
import type { Course } from "@/lib/types";
import { mockSummer2025Courses } from "@/lib/mock-data/summer2025-data";

const API_BASE_URL = 'http://140.245.42.78:5050/api';

export class CourseService {
  // GET /api/Course
  static async getCourses(): Promise<Course[]> {
    console.log(`[CourseService.getCourses] Fetching all courses`);
    // TƯƠNG LAI: return fetch(`${API_BASE_URL}/Course`).then(res => res.json());
    return Promise.resolve(mockSummer2025Courses);
  }

  // GET /api/Course/{id}
  static async getCourseById(id: string): Promise<Course | null> {
    console.log(`[CourseService.getCourseById] Fetching course with id: ${id}`);
    const course = mockSummer2025Courses.find(c => c.courseId === id) || null;
    return Promise.resolve(course);
  }

  // POST /api/Course
  static async createCourse(courseData: Omit<Course, 'courseId'>): Promise<Course> {
    console.log("[CourseService.createCourse] Creating course:", courseData);
    const newCourse: Course = { ...courseData, courseId: `C${Date.now()}` };
    mockSummer2025Courses.push(newCourse);
    return Promise.resolve(newCourse);
  }

  // PUT /api/Course/{id}
  static async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    console.log(`[CourseService.updateCourse] Updating course ${id}:`, courseData);
    let updatedCourse: Course | null = null;
    const index = mockSummer2025Courses.findIndex(c => c.courseId === id);
    if (index !== -1) {
      updatedCourse = { ...mockSummer2025Courses[index], ...courseData };
      mockSummer2025Courses[index] = updatedCourse;
    }
    if (!updatedCourse) throw new Error("Course not found");
    return Promise.resolve(updatedCourse);
  }

  // DELETE /api/Course/{id}
  static async deleteCourse(id: string): Promise<void> {
    console.log(`[CourseService.deleteCourse] Deleting course: ${id}`);
    const index = mockSummer2025Courses.findIndex(c => c.courseId === id);
    if (index > -1) {
      mockSummer2025Courses.splice(index, 1);
    }
    return Promise.resolve();
  }
}