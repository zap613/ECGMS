// app/api/groups/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;
    
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/groups/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;
    
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/groups/${id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    );
  }
}