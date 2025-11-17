// app/api/courses/initialize/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courses } = body; // Danh sách các lớp đã được tính toán từ Frontend

    const createdCourses = [];
    const errors = [];

    // Loop qua từng lớp để tạo
    for (const course of courses) {
      // 1. Gọi Backend tạo Course
      // Swagger: POST /api/Course/CreateCourseByAdmin
      const createCourseRes = await fetch(`${process.env.BACKEND_URL}/api/Course/CreateCourseByAdmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: course.courseCode,
          courseName: course.courseName,
          description: `Học kỳ: ${course.semester}, Năm: ${course.year}`,
        }),
      });

      if (!createCourseRes.ok) {
        errors.push(`Failed to create ${course.courseCode}`);
        continue;
      }

      const newCourseData = await createCourseRes.json();
      const newCourseId = newCourseData.id; // ID trả về từ Backend

      // 2. Gọi Backend để tạo Nhóm Trống cho Course này
      // Giả sử Backend có API tạo nhóm: POST /api/Group/CreateGroup
      // Hoặc bạn phải loop để tạo từng nhóm một. Ví dụ tạo 10 nhóm:
      const groupsToCreate = course.emptyGroupsToCreate || 0;
      
      /* -- ĐOẠN NÀY CẦN API TẠO NHÓM CỦA BACKEND --
      for (let i = 1; i <= groupsToCreate; i++) {
         await fetch(`${process.env.BACKEND_URL}/api/Group/CreateGroup`, {
             method: 'POST',
             body: JSON.stringify({ 
                 name: `Group ${i}`, 
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