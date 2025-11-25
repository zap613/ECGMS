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
// Đưa tất cả gọi của generated client qua BFF Proxy để tránh CORS và chuẩn hóa auth
OpenAPI.BASE = '/api/proxy';
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
      console.log("[CourseService] Fetching courses via proxy...");
      const ts = Date.now();
      const res = await fetch(`/api/proxy/Course/GetListCourses?PageNumber=1&PageSize=1000&_t=${ts}` , {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`List failed: ${res.status} ${res.statusText} ${text}`);
      }
      const response = await res.json();
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
      // SỬA LỖI: Backend sử dụng endpoint GetCourseBy/{id}
      // LƯU Ý: Swagger định nghĩa đường dẫn không có dấu '/': /api/Course/GetCourseBy{id}
      const ts = Date.now();
      const res = await fetch(`/api/proxy/Course/GetCourseBy${id}?_t=${ts}` , {
        method: 'GET',
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Get by id failed: ${res.status} ${res.statusText} ${text}`);
      }
      const course = await res.json();
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
        courseCode: courseData.courseCode || "",
        courseName: courseData.courseName || "",
        description: courseData.description,
      };

      // SỬA LỖI: Backend yêu cầu CreateCourseByAdmin
      const res = await fetch(`/api/proxy/Course/CreateCourseByAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Create failed: ${res.status} ${res.statusText} ${text}`);
      }
      const newCourse = await res.json();
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

      // SỬA LỖI: Backend dùng endpoint khác: PUT /api/Course/UpdateCourseBy/{id}
      const res = await fetch(`/api/proxy/Course/UpdateCourseBy/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Update failed: ${res.status} ${res.statusText} ${text}`);
      }

      // Sau khi cập nhật, lấy lại course để đồng bộ UI
      const updated = await this.getCourseById(id);
      if (!updated) {
        // Fallback nếu BE không trả dữ liệu get-by-id được
        return {
          courseId: id,
          courseCode: requestBody.courseCode,
          courseName: requestBody.courseName,
          description: requestBody.description || "",
          semester: courseData.semester || "N/A",
          year: courseData.year || new Date().getFullYear(),
          status: courseData.status || "open",
          createdDate: courseData.createdDate || new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          lecturerId: courseData.lecturerId || "",
          groupCount: courseData.groupCount || 0,
          studentCount: courseData.studentCount || 0,
        };
      }
      return updated;
    } catch (error) {
      console.error(`Failed to update course ${id}:`, error);
      throw error;
    }
  }

  // DELETE /api/Course/{id}
  static async deleteCourse(id: string): Promise<void> {
    try {
      // SỬA LỖI: Backend dùng endpoint khác: DELETE /api/Course/DeleteCourseBy/{id}
      // Gọi qua proxy API để đính kèm Authorization từ cookie server-side
      const res = await fetch(`/api/proxy/Course/DeleteCourseBy/${id}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Delete failed: ${res.status} ${res.statusText} ${text}`);
      }
    } catch (error) {
      console.error(`Failed to delete course ${id}:`, error);
      throw error;
    }
  }

  // GET /api/Course/GetCourseByLecturer/{lecturerId}
  static async getCoursesByLecturer(lecturerId: string): Promise<Course[]> {
    try {
      const res = await fetch(`/api/proxy/Course/GetCourseByLecturer/${lecturerId}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Get by lecturer failed: ${res.status} ${res.statusText} ${text}`);
      }
      const items = await res.json();
      // BE có thể trả một list hoặc một object dạng { items }. Chuẩn hóa về mảng.
      const list = Array.isArray(items) ? items : (items.items || []);
      return list.map(mapApiCourseToFeCourse);
    } catch (error) {
      console.error(`Failed to fetch courses by lecturer ${lecturerId}:`, error);
      return [];
    }
  }
}