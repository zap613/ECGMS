"use client"

import { OpenAPI } from "@/lib/api/generated";
import { useEffect } from "react";

/**
 * Component này không render gì cả. 
 * Nó chỉ dùng để cấu hình API client một lần duy nhất khi ứng dụng tải.
 */
export function ApiProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Thiết lập địa chỉ gốc cho tất cả các yêu cầu API
    OpenAPI.BASE = 'http://140.245.42.78:5050';

    // Tự động thêm token vào header cho mỗi yêu cầu
    const token = localStorage.getItem('token');
    if (token) {
      OpenAPI.TOKEN = token;
    }

    // (Tùy chọn) Bạn có thể thêm các cấu hình khác ở đây
    // OpenAPI.HEADERS = { 'X-Custom-Header': 'value' };

  }, []);

  return <>{children}</>;
}