import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request sang backend
    const newCourse = await apiClient.createCourse(body);
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: error.status || 500 }
    );
  }
}