import { 
  MajorService as GeneratedMajorService, 
  type Major as ApiMajor, 
  OpenAPI 
} from "@/lib/api/generated";
import type { MajorItem } from "@/lib/types";

// Cấu hình Base URL (nếu chưa được set global)
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.42.78:5050';

// Hàm chuyển đổi từ API Model sang Frontend Model
const mapApiMajorToMajorItem = (m: ApiMajor): MajorItem => {
  return {
    id: m.id || "",
    majorCode: m.majorCode || "",
    // Map 'majorName' từ API sang 'name' của Frontend
    name: m.majorName || m.majorCode || "Unknown", 
    description: m.description || "",
  };
};

// Service giả lập (Mock)
class MockMajorService {
  static async getMajors(): Promise<MajorItem[]> {
    // Trả về dữ liệu giả nếu đang ở chế độ MOCK_MODE
    return [
      { id: "mock-1", majorCode: "SE", name: "Software Engineering" },
      { id: "mock-2", majorCode: "SS", name: "Software Systems" },
      { id: "mock-3", majorCode: "AI", name: "Artificial Intelligence" },
      { id: "mock-4", majorCode: "GD", name: "Graphic Design" },
    ];
  }
}

// Service thật (Real)
class RealMajorService {
  static async getMajors(): Promise<MajorItem[]> {
    try {
      // Gọi API lấy danh sách Major
      const response = await GeneratedMajorService.getApiMajor({});
      
      // API trả về array hoặc wrapped object, cần kiểm tra
      // Giả sử API trả về mảng trực tiếp hoặc trong thuộc tính data
      const data = Array.isArray(response) ? response : (response as any).data || [];
      
      return (data as ApiMajor[]).map(mapApiMajorToMajorItem);
    } catch (error) {
      console.error("Failed to fetch majors from API", error);
      return [];
    }
  }
}

// Export Service chính
export const MajorService = IS_MOCK_MODE ? MockMajorService : RealMajorService;