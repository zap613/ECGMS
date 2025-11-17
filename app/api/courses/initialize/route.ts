// app/api/courses/initialize/route.ts
import { NextRequest, NextResponse } from "next/server";

// Lấy URL của Backend thực từ biến môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://140.245.42.78:5050/api";

export async function POST(request: NextRequest) {
  try {
    // 1. Nhận dữ liệu từ Wizard
    const body = await request.json();
    const { semesterName, courses } = body; // courses chứa danh sách các lớp cần tạo

    console.log(`Bắt đầu khởi tạo ${courses.length} lớp cho kỳ ${semesterName}...`);

    const results = [];
    const errors = [];

    // 2. Duyệt qua từng lớp để gọi Backend
    for (const courseData of courses) {
      try {
        // Bước A: Tạo Course trên Backend
        // Mapping dữ liệu từ Wizard sang model Backend (CreateCourseViewModel)
        const createCoursePayload = {
          courseCode: courseData.courseCode,
          courseName: courseData.courseName,
          description: `Lớp ${courseData.courseName} - Kỳ ${semesterName}`,
          // Lưu ý: Backend hiện tại chưa thấy chỗ lưu semesterName hay year trong CreateCourseViewModel
        };

        const courseResponse = await fetch(`${API_BASE_URL}/Course`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createCoursePayload),
        });

        if (!courseResponse.ok) {
          const errText = await courseResponse.text();
          throw new Error(`Lỗi tạo Course ${courseData.courseCode}: ${errText}`);
        }

        const createdCourse = await courseResponse.json();
        const courseId = createdCourse.id; // Giả sử Backend trả về ID của Course vừa tạo

        // Bước B: Gán Giảng viên (Nếu có API)
        // Hiện tại CourseService chưa có API gán trực tiếp, 
        // cần kiểm tra lại LecturerCourseService. Tạm thời bỏ qua hoặc log lại.
        if (courseData.lecturerId) {
             // Ví dụ giả định nếu có endpoint gán giảng viên:
             // await fetch(`${API_BASE_URL}/LecturerCourse`, { ... })
             console.log(`Cần gán giảng viên ${courseData.lecturerId} cho course ${courseId}`);
        }

        // Bước C: Tạo các nhóm trống (Empty Groups)
        // Wizard tính toán: emptyGroupsToCreate
        const groupsCreated = [];
        for (let i = 1; i <= courseData.emptyGroupsToCreate; i++) {
          const groupName = `${courseData.courseCode}-G${i}`; // Tên nhóm: SE123-G1
          
          const groupPayload = {
            name: groupName,
            courseId: courseId,
            // Các trường khác nếu model yêu cầu
          };

          const groupResponse = await fetch(`${API_BASE_URL}/Group`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(groupPayload),
          });
          
          if(groupResponse.ok) groupsCreated.push(groupName);
        }

        results.push({
          courseCode: courseData.courseCode,
          status: "Success",
          groupsCreated: groupsCreated.length
        });

      } catch (err: any) {
        console.error(err);
        errors.push({ courseCode: courseData.courseCode, error: err.message });
      }
    }

    // 3. Trả về kết quả tổng hợp cho Frontend
    return NextResponse.json({
      message: "Quy trình khởi tạo hoàn tất",
      successCount: results.length,
      errorCount: errors.length,
      details: results,
      errors: errors
    });

  } catch (error: any) {
    console.error("Global Error in Initialize Route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}