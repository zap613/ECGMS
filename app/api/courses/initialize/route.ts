// app/api/courses/initialize/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Cần để lấy token

// Import type để đảm bảo type safety
import type { CreateCourseViewModel } from "@/lib/api/generated/models/CreateCourseViewModel";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateCourseViewModel>;
    const payload: CreateCourseViewModel = {
      courseCode: body.courseCode ?? "",
      courseName: body.courseName ?? "",
      description: body.description ?? "",
    };

    if (!payload.courseCode || !payload.courseName) {
      return NextResponse.json({ error: "Missing courseCode or courseName" }, { status: 400 });
    }

    // Lấy Access Token từ Cookie (ưu tiên 'auth_token', fallback 'accessToken')
    const cookieStore = await cookies(); 
    const accessToken = cookieStore.get("auth_token")?.value 
      ?? cookieStore.get("accessToken")?.value 
      ?? "";

    const createCourseRes = await fetch(`${process.env.BACKEND_URL}/api/Course/CreateCourseByAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    // Trả về nguyên dữ liệu từ server nếu thành công
    if (createCourseRes.ok) {
      const created = await createCourseRes.json();
      return NextResponse.json(created, { status: 201 });
    }

    // Nếu lỗi, trả về text để hiển thị
    const errorText = await createCourseRes.text().catch(() => createCourseRes.statusText);
    return NextResponse.json({ error: errorText }, { status: createCourseRes.status || 500 });

  } catch (error) {
    console.error("[Initialization Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}