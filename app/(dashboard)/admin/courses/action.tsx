// app/%28dashboard%29/admin/courses/action.tsx
'use server'

import { cookies } from 'next/headers';

/**
 * Server Action để lấy danh sách khóa học.
 * Chạy hoàn toàn trên Server Next.js -> Gọi trực tiếp sang Backend .NET
 * -> Không bị lỗi CORS.
 */
export async function getCoursesServerSide() {
  try {
    // 1. Lấy Token từ Cookie (HttpOnly)
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    // 2. Lấy URL Backend từ biến môi trường
    const backendUrl = process.env.BACKEND_URL || 'http://140.245.42.78:5050';

    console.log(`[Server Action] Fetching courses from: ${backendUrl}/api/Course`);

    // 3. Gọi API Backend (Server-to-Server fetch)
    const res = await fetch(`${backendUrl}/api/Course?PageNumber=1&PageSize=1000`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Đính kèm token
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Luôn lấy dữ liệu mới nhất
    });

    if (!res.ok) {
      console.error(`[Server Action Error] Failed to fetch courses: ${res.status} ${res.statusText}`);
      // Trả về mảng rỗng hoặc throw error tuỳ logic
      return [];
    }

    const data = await res.json();

    // 4. Xử lý các định dạng trả về khác nhau của API (Pagination vs Array)
    if (Array.isArray(data)) {
        return data;
    }
    if (data && Array.isArray(data.items)) {
        return data.items;
    }
    
    return [];

  } catch (error) {
    console.error("[Server Action Error] Exception:", error);
    return [];
  }
}