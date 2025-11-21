// lib/api/courseService.ts
import {
  CourseService as GeneratedCourseService,
  OpenAPI,
  type CourseViewModel,
  type CreateCourseViewModel,
  type UpdateCourseViewModel
} from "@/lib/api/generated";
import type { Course } from "@/lib/types";

const IS_MOCK_MODE = false;
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';
OpenAPI.TOKEN = async () => {
  // Lấy token từ cookie hoặc localStorage
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('AuthToken='))
    ?.split('=')[1];
  return token || '';
};
// Helper: Map từ API Model sang Frontend Model
const mapApiCourseToFeCourse = (c: CourseViewModel): Course => {
  return {
    courseId: c.id || "",
    courseCode: c.courseCode || "",
    courseName: c.courseName || "",
    description: c.description || "",
    semester: "N/A",
    year: new Date().getFullYear(),
    status: "open",
    createdDate: c.createdAt || new Date().toISOString(),
    updatedDate: (c as any).updatedAt || c.createdAt || new Date().toISOString(),
    lecturerId: "",
    groupCount: 0,
    studentCount: Array.isArray((c as any).studentCourses) ? (c as any).studentCourses.length : ((c as any).studentCount ?? 0),
  };
};

export class CourseService {
  // GET /api/Course
  static async getCourses(): Promise<Course[]> {
    try {
      console.log("[CourseService] Fetching courses...");
      // SỬA LỖI: Truyền object { pageNumber, pageSize } thay vì tham số rời rạc
      const response = await GeneratedCourseService.getApiCourse({
        pageNumber: 1,
        pageSize: 1000
      });
      
      const items = response.items || [];
      return items.map(mapApiCourseToFeCourse);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      return [];
    }
  }

  // GET /api/Course/{id}
  static async getCourseById(id: string): Promise<Course | null> {
    try {
      // SỬA LỖI: Truyền object { id }
      const course = await GeneratedCourseService.getApiCourse1({ id });
      return mapApiCourseToFeCourse(course);
    } catch (error) {
      console.error(`Failed to fetch course ${id}:`, error);
      return null;
    }
  }

  // POST /api/Course
  static async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      const requestBody: CreateCourseViewModel = {
        courseCode: courseData.courseCode || "", // SỬA LỖI: Xử lý undefined
        courseName: courseData.courseName || "", // SỬA LỖI: Xử lý undefined
        description: courseData.description,
      };
      
      // SỬA LỖI: Truyền object { requestBody }
      const newCourse = await GeneratedCourseService.postApiCourse({ requestBody });
      return mapApiCourseToFeCourse(newCourse);
    } catch (error) {
      console.error("Failed to create course:", error);
      throw error;
    }
  }

  // PUT /api/Course/{id}
  static async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const requestBody: UpdateCourseViewModel = {
        courseCode: courseData.courseCode || "",
        courseName: courseData.courseName || "",
        description: courseData.description,
      };

      // SỬA LỖI: Truyền object { id, requestBody }
      await GeneratedCourseService.putApiCourse({ id, requestBody });
      
      const updated = await this.getCourseById(id);
      if (!updated) throw new Error("Failed to retrieve updated course");
      
      return updated;
    } catch (error) {
      console.error(`Failed to update course ${id}:`, error);
      throw error;
    }
  }

  // DELETE /api/Course/{id}
  static async deleteCourse(id: string): Promise<void> {
    try {
      // SỬA LỖI: Truyền object { id }
      await GeneratedCourseService.deleteApiCourse({ id });
    } catch (error) {
      console.error(`Failed to delete course ${id}:`, error);
      throw error;
    }
  }
}