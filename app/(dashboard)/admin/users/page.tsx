"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ImportCard } from "@/components/features/admin/ImportCard"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, User, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Student {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  studentCode?: string;
  userProfile?: {
    major?: {
      majorCode?: string;
      majorName?: string;
    };
  };
  major?: {
    majorCode?: string;
  };
  roleName?: string;
}

type SortKey = "studentCode" | "fullName" | "email" | "major" | null;
type SortConfig = { key: SortKey; direction: "asc" | "desc" };

export default function AdminDataManagementPage() {
  const [isUploading, setIsUploading] = React.useState(false);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(true);
  const [lastFetchTime, setLastFetchTime] = React.useState<Date | null>(null);

  // 🔹 SORT STATE
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  // 🔹 Fetch Students (Cache Bypass)
  const fetchStudents = React.useCallback(async () => {
    setIsLoadingStudents(true);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/users/students?_t=${timestamp}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      setStudents(data);
      setLastFetchTime(new Date());
    } catch (error: any) {
      toast.error("Failed to load students", { description: error.message });
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 🔹 Upload handler
  const handleUpload = async (file: File, type: "student" | "lecturer") => {
    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const isValid = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isValid) throw new Error("Invalid file. Upload Excel/CSV only.");

    if (file.size > 5 * 1024 * 1024) throw new Error("Max file size is 5MB");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/users/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Import failed");

      toast.success(data.message || "Import success");

      if (type === "student") {
        await new Promise(r => setTimeout(r, 500));
        await fetchStudents();
      }

      return { success: true, message: data.message };
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportStudents = (file: File) => handleUpload(file, "student");
  const handleImportLecturers = (file: File) => handleUpload(file, "lecturer");

  // 🔹 Helper data getters
  const getDisplayName = (s: Student) =>
    (s.firstName || s.lastName) ? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() : s.username ?? "N/A";

  const getStudentCode = (s: Student) => s.studentCode || s.username || s.id;

  const getMajor = (s: Student) =>
    s.userProfile?.major?.majorCode ||
    s.major?.majorCode ||
    "N/A";

  // 🔹 Sort request
  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 🔹 Sorted list
  const sortedStudents = React.useMemo(() => {
    const list = [...students];
    if (!sortConfig.key) return list;

    return list.sort((a, b) => {
      const getValue = (st: Student) => {
        switch (sortConfig.key) {
          case "studentCode": return getStudentCode(st).toLowerCase();
          case "fullName": return getDisplayName(st).toLowerCase();
          case "email": return st.email.toLowerCase();
          case "major": return getMajor(st).toLowerCase();
          default: return ""; // Fix TypeScript error
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [students, sortConfig]);

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    return sortConfig.direction === "asc"
      ? <ArrowUp className="ml-1 h-4 w-4 text-blue-600" />
      : <ArrowDown className="ml-1 h-4 w-4 text-blue-600" />;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600 mt-1">Import student and lecturer data.</p>
        </div>

        {/* Import Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImportCard 
            title="Import Students" 
            description="Upload student list (.xlsx)"
            onImport={handleImportStudents} 
            disabled={isUploading} 
          />
          <ImportCard 
            title="Import Lecturers" 
            description="Upload lecturer list (.xlsx)"
            onImport={handleImportLecturers} 
            disabled={isUploading} 
          />
        </div>

        {/* Student Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Student List ({students.length})
              </CardTitle>

              <div className="flex items-center gap-2">
                {lastFetchTime && (
                  <span className="text-xs text-gray-500">
                    Updated: {lastFetchTime.toLocaleTimeString()}
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={fetchStudents} disabled={isLoadingStudents}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingStudents && "animate-spin"}`} /> Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoadingStudents ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No students found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">
                        <Button variant="ghost" onClick={() => requestSort("studentCode")} className="-ml-4 h-8 hover:bg-transparent">
                          Student Code {getSortIcon("studentCode")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("fullName")} className="-ml-4 h-8 hover:bg-transparent">
                          Full Name {getSortIcon("fullName")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("email")} className="-ml-4 h-8 hover:bg-transparent">
                          Email {getSortIcon("email")}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[100px]">
                        <Button variant="ghost" onClick={() => requestSort("major")} className="-ml-4 h-8 hover:bg-transparent">
                          Major {getSortIcon("major")}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedStudents.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-sm font-semibold">{getStudentCode(s)}</TableCell>
                        <TableCell>{getDisplayName(s)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{s.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                            {getMajor(s)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}