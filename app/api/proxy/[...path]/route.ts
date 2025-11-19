// app/api/proxy/[...path]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Hàm xử lý chung cho mọi Method (GET, POST, PUT, DELETE...)
async function handleProxy(request: Request, { params }: { params: { path: string[] } }) {
  // 1. Lấy path từ URL (ví dụ: /api/proxy/Course -> path: ['Course'])
  const path = params.path.join("/");
  
  // 2. Lấy Query Params (ví dụ: ?page=1&size=10)
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  // 3. Xây dựng URL đích đến Backend thật
  // Kết quả: http://140.245.42.78:5050/api/Course?page=1
  const targetUrl = `${process.env.BACKEND_URL}/api/${path}${queryString ? `?${queryString}` : ""}`;

  try {
    // 4. Lấy Token từ Cookie (Server-side)
    // Lưu ý: cookies() trong Next.js mới trả về Promise nên cần await
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("auth_token")?.value ?? cookieStore.get("accessToken")?.value;

    // 5. Chuẩn bị Headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      // Forward các header cần thiết khác nếu cần
    };
    
    // Nếu có token trong cookie, đính kèm vào header Authorization gửi sang BE
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // 6. Lấy Body (nếu có)
    let body = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try { 
        body = await request.text(); 
      } catch (e) {
        // Body rỗng hoặc lỗi parse, bỏ qua
      }
    }

    // 7. Gọi Backend (Server-to-Server -> KHÔNG BỊ CORS)
    // console.log(`[Proxy] Forwarding ${request.method} to: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store", // Không cache API response để đảm bảo dữ liệu luôn mới
    });

    // 8. Trả kết quả về cho Client
    const data = await response.text();
    
    // Trả về nguyên vẹn status và header từ Backend
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("[Proxy Error]", error);
    return NextResponse.json({ error: "Proxy Internal Error" }, { status: 500 });
  }
}

// Export các method hỗ trợ để Next.js nhận diện
export async function GET(req: Request, ctx: any) { return handleProxy(req, ctx); }
export async function POST(req: Request, ctx: any) { return handleProxy(req, ctx); }
export async function PUT(req: Request, ctx: any) { return handleProxy(req, ctx); }
export async function DELETE(req: Request, ctx: any) { return handleProxy(req, ctx); }
export async function PATCH(req: Request, ctx: any) { return handleProxy(req, ctx); }