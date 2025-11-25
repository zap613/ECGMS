import { NextRequest, NextResponse } from 'next/server';
// SỬA: Thêm ApiError vào import
import { apiClient, ApiError } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward to backend
    const response = await apiClient.login(body);
    
    // Set HTTP-only cookie for token
    const res = NextResponse.json(response);
    res.cookies.set('auth_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return res;
  } catch (error) {
    // Bây giờ ApiError đã được import, instanceof sẽ hoạt động đúng
    // và TypeScript sẽ hiểu error bên trong block này là kiểu ApiError
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, details: error.data },
        { status: error.status }
      );
    }
    
    // Fallback cho các lỗi khác (ví dụ lỗi code, lỗi mạng bất ngờ...)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}