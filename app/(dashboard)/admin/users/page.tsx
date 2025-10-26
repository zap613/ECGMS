"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ImportCard } from "@/components/features/admin/ImportCard" // Import component ImportCard
// Import các service từ API client đã tạo
import { UsersService /*, other services/types if needed */ } from "@/lib/api/generated";

export default function AdminDataManagementPage() {

  // Hàm giả lập gọi API import sinh viên
  const handleImportStudents = async (file: File) => {
    console.log("[Mock API] Importing students...", file.name);
    // TƯƠNG LAI:
    // try {
    //   // Lưu ý: Tên property ('file') trong formData phải khớp với tên backend mong đợi
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   const response = await UsersService.importStudents({ formData }); // Gọi API thật
    //   return { success: true, message: `Import successful: ${response.importedCount} students added.` };
    // } catch (error: any) {
    //   console.error("Student import failed:", error);
    //   throw new Error(error.body?.message || "Student import failed.");
    // }

    // HIỆN TẠI: Giả lập thành công/lỗi ngẫu nhiên
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (Math.random() > 0.2) { // 80% thành công
      return { success: true, message: `Nhập thành công ${Math.floor(Math.random() * 50 + 100)} sinh viên.` };
    } else {
      throw new Error("File không đúng định dạng hoặc có dữ liệu trùng lặp.");
    }
  };

  // Hàm giả lập gọi API import giảng viên
  const handleImportLecturers = async (file: File) => {
    console.log("[Mock API] Importing lecturers...", file.name);
    // TƯƠNG LAI: Gọi API tương ứng (ví dụ: LecturerService.importLecturers)
    // Giả sử API tương tự UsersService.importStudents
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await LecturerService.importLecturers({ formData }); // Thay thế bằng service đúng
    // return { success: true, message: `Import successful: ${response.importedCount} lecturers added.` };

    // HIỆN TẠI: Giả lập
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() > 0.1) { // 90% thành công
      return { success: true, message: `Nhập thành công ${Math.floor(Math.random() * 5 + 5)} giảng viên.` };
    } else {
      throw new Error("Lỗi hệ thống khi nhập giảng viên.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Dữ liệu</h1>
          <p className="text-gray-600 mt-1">Nhập dữ liệu sinh viên, giảng viên chuẩn bị cho kỳ học mới.</p>
        </div>

        {/* Phần Import Dữ liệu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImportCard
            title="Bước 1: Nhập Danh sách Sinh viên"
            description="Tải lên file Excel (.xlsx, .csv) chứa danh sách sinh viên đủ điều kiện cho kỳ học EXE101."
            onImport={handleImportStudents}
          />
          <ImportCard
            title="Bước 2: Nhập Danh sách Giảng viên"
            description="Tải lên file Excel (.xlsx, .csv) chứa danh sách giảng viên sẽ tham gia hướng dẫn trong kỳ."
            onImport={handleImportLecturers}
          />
        </div>

        {/* Có thể thêm phần hiển thị danh sách người dùng đã import ở đây sau */}
      </div>
    </DashboardLayout>
  )
}