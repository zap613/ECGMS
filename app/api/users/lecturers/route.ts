import { NextRequest, NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  // Giả sử backend có endpoint lấy user theo role hoặc lấy tất cả rồi filter
  // Ví dụ gọi: /api/User/GetAllUsers
  const response = await fetch(`${API_BASE_URL}/User/GetAllUsers`, { /* ... */ });
  const users = await response.json();
  // Lọc phía server Next.js nếu backend trả về tất cả
  const lecturers = users.filter((u: any) => u.role === 'Lecturer'); 
  return NextResponse.json(lecturers);
}