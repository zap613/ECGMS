import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Cần để lấy token nếu dùng cookie

// Import type để đảm bảo type safety (nếu path đúng)
import type { CreateCourseViewModel } from "@/lib/api/generated/models/CreateCourseViewModel";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courses } = body; // Danh sách các lớp từ Frontend
    
    // Lấy Access Token (Tuỳ theo cách bạn lưu token, ví dụ lấy từ cookie)
    const cookieStore = await cookies(); 
    const accessToken = cookieStore.get("accessToken")?.value || "";

    const createdCourses = [];
    const errors = [];

    // Loop qua từng lớp để tạo
    for (const course of courses) {
      
      // 1. Chuẩn bị Payload khớp 100% với CreateCourseViewModel
      const payload: CreateCourseViewModel = {
        courseCode: course.courseCode,
        courseName: course.courseName,
        description: course.description || `Semester: ${course.semester}`,
      };

      // 2. Gọi Backend tạo Course
      // Endpoint chuẩn: POST /api/Course
      const createCourseRes = await fetch(`${process.env.BACKEND_URL}/api/Course/CreateCourseByAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Endpoint này chắc chắn yêu cầu Token Admin
        },
        body: JSON.stringify(payload),
      });

      if (!createCourseRes.ok) {
        const errorText = await createCourseRes.text();
        console.error(`Failed to create ${course.courseCode}:`, errorText);
        errors.push(`Failed to create ${course.courseCode}: ${createCourseRes.statusText}`);
        continue;
      }

      const newCourseData = await createCourseRes.json();
      const newCourseId = newCourseData.id; 

      // 3. Logic tạo Nhóm Trống (Placeholder)
      const groupsToCreate = course.emptyGroupsToCreate || 0;
      
      // --- ĐOẠN NÀY CẦN API TẠO NHÓM CỦA BACKEND ---
      // Hiện tại comment lại vì chưa có API Bulk Create hoặc CreateGroup chuẩn
      /*
      for (let i = 1; i <= groupsToCreate; i++) {
         await fetch(`${process.env.BACKEND_URL}/api/Group`, { // Check lại endpoint Group
             method: 'POST',
             headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
             },
             body: JSON.stringify({ 
                 name: `${course.courseCode}-G${i}`, 
                 courseId: newCourseId 
             })
         });
      }
      */

      createdCourses.push(newCourseData);
    }

    return NextResponse.json({ 
        success: true, 
        created: createdCourses, 
        errors: errors 
    });

  } catch (error) {
    console.error("[Initialization Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}