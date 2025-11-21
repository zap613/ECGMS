// app/api/users/import/route.ts
import { NextRequest, NextResponse } from "next/server";

// Helper function for user-friendly error messages
function getUserFriendlyError(status: number, backendMessage: string, details?: any): string {
  const lower = (backendMessage || "").toLowerCase();

  // Corrupted/invalid file format
  if (lower.includes("corrupted") || lower.includes("invalid format")) {
    return "File không hợp lệ hoặc bị hỏng. Vui lòng kiểm tra:\n" +
           "- File Excel (.xlsx) hợp lệ\n" +
           "- Đủ các cột yêu cầu\n" +
           "- Dữ liệu đúng định dạng";
  }

  // Missing columns
  if (lower.includes("column")) {
    return "Thiếu hoặc sai tên cột. Vui lòng đảm bảo file có đúng tiêu đề cột yêu cầu.";
  }

  // Duplicate records: cố gắng lấy danh sách sinh viên trùng để hiển thị
  if (lower.includes("duplicate") || lower.includes("already exists") || lower.includes("exists")) {
    const names = new Set<string>(); // Dùng Set để tự động loại bỏ trùng

    // Trích xuất từ details nếu là JSON có cấu trúc
    if (details && typeof details === 'object') {
      const tryCollect = (item: any) => {
        if (!item) return;
        const n = item.fullName || item.name || item.username || item.email || item.studentCode;
        if (n && typeof n === 'string') names.add(String(n).trim());
      };

      // Thử các cấu trúc phổ biến từ backend
      if (Array.isArray(details?.duplicates)) {
        details.duplicates.forEach(tryCollect);
      }
      if (Array.isArray(details?.errors)) {
        details.errors.forEach((e: any) => tryCollect(e?.record || e?.item || e));
      }
      if (Array.isArray(details?.items)) {
        details.items.forEach(tryCollect);
      }
      if (details?.user || details?.record || details?.student) {
        tryCollect(details.user || details.record || details.student);
      }
    }

    // Nếu không có details, thử trích xuất từ chuỗi message
    if (names.size === 0 && backendMessage) {
      // Email pattern
      const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
      const emails = backendMessage.match(emailRegex) || [];
      emails.forEach(e => names.add(e));

      // Student code pattern (ví dụ: SE100100, IT123456)
      const codeRegex = /\b[A-Z]{2,3}\d{6,8}\b/g;
      const codes = backendMessage.match(codeRegex) || [];
      codes.forEach(c => names.add(c));

      // Username pattern (ví dụ: annvSE100100, binhttSE100101)
      const usernameRegex = /\b[a-z]+[a-z]{2,4}[A-Z]{2,3}\d{6,8}\b/g;
      const usernames = backendMessage.match(usernameRegex) || [];
      usernames.forEach(u => names.add(u));

      // Generic username mention: "username: abc123" hoặc "username=abc123"
      const userMentionRegex = /username\s*[:=]\s*([\w.-]+)/gi;
      let match;
      while ((match = userMentionRegex.exec(backendMessage)) !== null) {
        if (match[1]) names.add(match[1]);
      }

      // Quoted strings (có thể là tên hoặc username trong dấu nháy)
      const quotedRegex = /["']([^"']{3,50})["']/g;
      while ((match = quotedRegex.exec(backendMessage)) !== null) {
        const val = match[1].trim();
        // Chỉ lấy nếu trông giống email, username, hoặc mã SV
        if (val.includes('@') || /^[a-z]{2,}[A-Z]{2}\d+$/.test(val) || /^[A-Z]{2}\d{6}$/.test(val)) {
          names.add(val);
        }
      }
    }

    // Tạo thông báo từ danh sách đã thu thập
    const nameArray = Array.from(names);
    if (nameArray.length > 0) {
      // Giới hạn hiển thị tối đa 5 tên để không quá dài
      const displayNames = nameArray.slice(0, 5).join(", ");
      const suffix = nameArray.length > 5 ? ` và ${nameArray.length - 5} sinh viên khác` : "";
      return `Đã có Sinh viên ${displayNames}${suffix} trong danh sách`;
    }
    
    return "Đã có Sinh viên trùng trong danh sách. Vui lòng loại bỏ bản ghi trùng và thử lại.";
  }

  // Default error messages (Vietnamese)
  const errorMap: Record<number, string> = {
    400: "Dữ liệu hoặc định dạng file không hợp lệ",
    401: "Cần đăng nhập để thực hiện nhập dữ liệu",
    403: "Bạn không có quyền nhập dữ liệu",
    413: "File vượt quá giới hạn dung lượng",
    415: "Loại file không được hỗ trợ",
    500: "Đã xảy ra lỗi phía máy chủ",
  };

  return errorMap[status] || backendMessage || "Đã xảy ra lỗi không xác định";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" }, 
        { status: 400 }
      );
    }

    // File size validation (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Determine endpoint
    const backendUrl = process.env.BACKEND_URL || "http://140.245.42.78:5050";
    let endpoint = "";

    if (type === "student") {
      endpoint = "/api/User/import-students";
    } else if (type === "lecturer") {
      endpoint = "/api/User/import-lecturers";
    } else {
      return NextResponse.json(
        { error: "Invalid import type. Must be 'student' or 'lecturer'" },
        { status: 400 }
      );
    }

    console.log(`[Import Proxy] Starting upload...`);
    console.log(`  - File: ${file.name}`);
    console.log(`  - Size: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`  - Type: ${file.type}`);
    console.log(`  - Endpoint: ${backendUrl}${endpoint}`);

    // Convert File to Buffer for better compatibility
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create new FormData for backend
    const backendFormData = new FormData();
    
    // Create a proper File object compatible with Node environment
    const backendFile = new File([buffer], file.name, {
      type: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    backendFormData.append("file", backendFile);

    // Call backend API
    const response = await fetch(`${backendUrl}${endpoint}`, {
      method: "POST",
      body: backendFormData,
      // Let fetch set Content-Type with boundary automatically
    });

    console.log(`[Backend Response] Status: ${response.status}`);

    // Handle backend response
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Backend error occurred";
      let errorDetails = null;

      if (contentType?.includes("application/json")) {
        try {
          const json = await response.json();
          errorDetails = json;
          errorMessage = json.message || json.title || JSON.stringify(json);
        } catch (e) {
          errorMessage = await response.text();
        }
      } else {
        errorMessage = await response.text();
      }

      console.error(`[Backend Error]`, {
        status: response.status,
        message: errorMessage,
        details: errorDetails,
      });

      // Return user-friendly error messages (VN) và cố gắng đưa tên SV trùng nếu có
      const userMessage = getUserFriendlyError(response.status, errorMessage, errorDetails);

      return NextResponse.json(
        { 
          error: userMessage,
          details: errorDetails,
          statusCode: response.status 
        },
        { status: response.status }
      );
    }

    // Success response - check content type
    const contentType = response.headers.get("content-type");
    let result;
    
    if (contentType?.includes("application/json")) {
       result = await response.json();
    } else {
       // Nếu backend trả về text (200 OK)
       const text = await response.text();
       result = { message: text || "Import successful" };
    }
    
    console.log(`[Import Success]`, result);

    return NextResponse.json({
      success: true,
      message: "Import completed successfully",
      data: result,
    });

  } catch (error: any) {
    console.error("[Proxy Critical Error]:", error);
    
    return NextResponse.json(
      {
        error: "Server error during import",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}