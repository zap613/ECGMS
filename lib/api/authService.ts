// lib/api/authService.ts
// Authentication service - Replace mock data with actual API calls - Xử lý Login, Logout
import type { User } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data/auth";

const API_BASE_URL = 'http://140.245.42.78:5050/api';

// Giả sử backend có endpoint /api/Auth/login (cần xác nhận lại)
export class AuthService {
  /**
   * @description Đăng nhập người dùng
   * @param username Tên đăng nhập
   * @param password Mật khẩu
   */
  static async login(username: string, password: string): Promise<{ user: User; token: string }> {
    console.log(`[AuthService.login] Called with:`, { username });
    
    // TƯƠNG LAI: Thay thế bằng lệnh gọi API thật
    // const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // });
    // if (!response.ok) throw new Error("Login failed");
    // const data = await response.json(); // Giả sử trả về { user, token }
    // localStorage.setItem('token', data.token);
    // localStorage.setItem('currentUser', JSON.stringify(data.user));
    // return data;

    // HIỆN TẠI: Dùng mock-data
    if (password === "password123") {
      const user = mockUsers.find(u => u.username === username);
      if (user) {
        const token = "mock-jwt-token-for-" + user.username;
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return Promise.resolve({ user, token });
      }
    }
    throw new Error("Invalid username or password");
  }

  /**
   * @description Đăng xuất người dùng
   */
  static async logout(): Promise<void> {
    console.log(`[AuthService.logout] Called`);
    // TƯƠNG LAI: Có thể gọi API để vô hiệu hóa token
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  }
}