"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth";
import { mockGradeItems } from "@/lib/mock-data/grades";
import { useToast } from "@/lib/hooks/use-toast";

export default function GradesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "lecturer") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  // Filter grade items to courses taught by this lecturer
  let lecturerGradeItems = mockGradeItems;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mockCourses } = require("@/lib/mock-data/courses");
    const courseIds = new Set(
      mockCourses
        .filter((c: any) => c.lecturerId === user.userId)
        .map((c: any) => c.courseId)
    );
    lecturerGradeItems = mockGradeItems.filter((gi) =>
      courseIds.has(gi.courseId)
    );
  } catch {
    lecturerGradeItems = mockGradeItems;
  }

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý chấm điểm
            </h1>
            <p className="text-gray-600 mt-1">
              Định nghĩa và quản lý thành phần điểm
            </p>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() =>
              toast({
                title: "Thêm cột điểm",
                description: "Hành động mô phỏng",
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm cột điểm
          </Button>
        </div>

        <div className="space-y-4">
          {lecturerGradeItems.map((item) => (
            <Card key={item.gradeItemId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.itemName}</CardTitle>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        item.type === "group"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      Weight: {item.weight}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Môn học</p>
                    <p className="font-semibold text-gray-900">
                      {item.courseCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Điểm tối đa</p>
                    <p className="font-semibold text-gray-900">
                      {item.maxScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loại</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {item.type === "group" ? "nhóm" : "cá nhân"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() =>
                        toast({
                          title: "Nhập điểm",
                          description: item.itemName,
                        })
                      }
                    >
                      Nhập điểm
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
