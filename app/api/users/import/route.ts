import { NextRequest, NextResponse } from "next/server";

// Helper function for user-friendly error messages
function getUserFriendlyError(status: number, backendMessage: string): string {
  // Check for specific error messages from backend
  if (backendMessage.toLowerCase().includes("corrupted")) {
    return "File format is invalid or corrupted. Please check:\n" +
           "- File is a valid Excel (.xlsx) format\n" +
           "- All required columns are present\n" +
           "- Data follows the expected format";
  }

  if (backendMessage.toLowerCase().includes("column")) {
    return "Missing or invalid column headers. Please ensure your Excel file has the correct column names.";
  }

  if (backendMessage.toLowerCase().includes("duplicate")) {
    return "Duplicate records found in the file. Please remove duplicates and try again.";
  }

  // Default error messages by status code
  const errorMap: Record<number, string> = {
    400: "Invalid file format or data",
    401: "Authentication required",
    403: "You don't have permission to import data",
    413: "File size too large",
    415: "Unsupported file type",
    500: "Server error occurred",
  };

  return errorMap[status] || backendMessage || "Unknown error occurred";
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
      endpoint = "/api/User/import-lecturers"; // Cần check lại Swagger nếu khác
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

      // Return user-friendly error messages
      const userMessage = getUserFriendlyError(response.status, errorMessage);

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