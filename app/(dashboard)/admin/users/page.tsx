// app/(dashboard)/admin/users/page.tsx
"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ImportCard } from "@/components/features/admin/ImportCard"
import { StudentImportGuide } from "@/components/features/admin/StudentImportGuide"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, User, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Interface Definitions ---
interface Student {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  studentCode?: string;
  userProfile?: {
    fullName?: string;
    studentCode?: string;
    major?: {
      majorCode?: string;
      majorName?: string;
    };
  };
  major?: {
    majorCode?: string;
  };
  roleName?: string;
  skillSet?: string;
}

type SortKey = "username" | "fullName" | "email" | "studentCode" | "skillSet" | null;
type SortConfig = { key: SortKey; direction: "asc" | "desc" };

export default function AdminDataManagementPage() {
  // --- State ---
  const [isUploading, setIsUploading] = React.useState(false);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(true);
  const [lastFetchTime, setLastFetchTime] = React.useState<Date | null>(null);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedMajor, setSelectedMajor] = React.useState<string>("all");
  const [selectedSkill, setSelectedSkill] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20;

  // Sort State
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  // --- Data Fetching ---
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

  // Reset về trang 1 khi thay đổi filter/search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMajor, selectedSkill]);

  // --- Handlers ---
  const handleUpload = async (file: File, type: "student") => {
    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const isValid = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isValid) throw new Error("Invalid file. Upload Excel/CSV only.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Max file size is 5MB");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/users/import", {
        method: "POST",
        body: formData,
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Import failed";
        toast.error(msg);
        throw new Error(msg);
      }

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
  // Đã xóa handleImportLecturers

  // --- Helper Getters ---
  const getUsername = (s: Student) => s.username || "N/A";
  
  const getFullName = (s: Student) =>
    s.userProfile?.fullName ?? ((s.firstName || s.lastName) ? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() : s.username ?? "N/A");
  
  const getStudentCode = (s: Student) => s.userProfile?.studentCode || s.studentCode || s.username || s.id;
  
  const getSkillSet = (s: Student) => s.skillSet || "N/A";

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // --- Filter Options Logic ---
  const majorOptions = React.useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => {
      const code = s.userProfile?.major?.majorCode || s.major?.majorCode;
      if (code) set.add(code);
    });
    return Array.from(set).sort();
  }, [students]);

  const skillOptions = React.useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => {
      if (s.skillSet) {
        s.skillSet.split(/[;,]/).map(t => t.trim()).filter(Boolean).forEach(t => set.add(t.toLowerCase()));
      }
    });
    return Array.from(set).sort();
  }, [students]);

  // --- Data Processing: Search + Filter + Sort ---
  const sortedStudents = React.useMemo(() => {
    // 1. Filter
    const filtered = students.filter(s => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || (
        getUsername(s).toLowerCase().includes(term) ||
        getFullName(s).toLowerCase().includes(term) ||
        (s.email || "").toLowerCase().includes(term) ||
        getStudentCode(s).toLowerCase().includes(term)
      );

      if (!matchesSearch) return false;

      if (selectedMajor !== "all") {
        const code = s.userProfile?.major?.majorCode || s.major?.majorCode;
        if (code !== selectedMajor) return false;
      }

      if (selectedSkill !== "all") {
        const skills = (s.skillSet || "").toLowerCase();
        const tokens = skills.split(/[;,]/).map(t => t.trim());
        if (!tokens.includes(selectedSkill.toLowerCase())) return false;
      }

      return true;
    });

    // 2. Sort
    if (!sortConfig.key) return filtered;

    return filtered.sort((a, b) => {
      const getValue = (st: Student) => {
        switch (sortConfig.key) {
          case "username": return getUsername(st).toLowerCase();
          case "fullName": return getFullName(st).toLowerCase();
          case "email": return (st.email || "").toLowerCase();
          case "studentCode": return getStudentCode(st).toLowerCase();
          case "skillSet": return getSkillSet(st).toLowerCase();
          default: return "";
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [students, sortConfig, searchTerm, selectedMajor, selectedSkill]);

  // --- Pagination Logic ---
  const totalPages = React.useMemo(() => Math.max(1, Math.ceil(sortedStudents.length / pageSize)), [sortedStudents.length]);
  
  const pagedStudents = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage]);

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
          <p className="text-gray-600 mt-1">Import student data and view lists.</p>
        </div>

        {/* Import Section - Đã xóa Lecturer Import */}
        <div className="grid grid-cols-1 gap-6">
          <ImportCard 
            title="Import Students" 
            description="Upload student list (.xlsx/.csv) — Cột: User Name, Full Name, Email, Student Code, SkillSet"
            onImport={handleImportStudents} 
            disabled={isUploading} 
          />
        </div>

        {/* Import Format Guide */}
        <StudentImportGuide />

        {/* Student Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> 
                Student List 
                <span className="ml-1 text-sm font-normal text-gray-500">
                   ({sortedStudents.length} records)
                </span>
              </CardTitle>

              <div className="flex items-center gap-2">
                {lastFetchTime && (
                  <span className="text-xs text-gray-500 hidden md:inline">
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
            {/* --- Controls (Search & Filter) --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search: username, name, email, code..."
                    />
                </div>

                <div className="md:col-span-3">
                    <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2 truncate">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <SelectValue placeholder="Filter Major" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Majors</SelectItem>
                            {majorOptions.map((m) => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-3">
                    <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2 truncate">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <SelectValue placeholder="Filter Skill" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Skills</SelectItem>
                            {skillOptions.map((s) => (
                                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- Table --- */}
            {isLoadingStudents ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : sortedStudents.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-900 font-medium">No students found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">
                        <Button variant="ghost" onClick={() => requestSort("username")} className="-ml-4 h-8 hover:bg-transparent font-bold">
                          User Name{getSortIcon("username")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("fullName")} className="-ml-4 h-8 hover:bg-transparent font-bold">
                          Full Name{getSortIcon("fullName")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("email")} className="-ml-4 h-8 hover:bg-transparent font-bold">
                          Email{getSortIcon("email")}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[150px]">
                        <Button variant="ghost" onClick={() => requestSort("studentCode")} className="-ml-4 h-8 hover:bg-transparent font-bold">
                          Student Code{getSortIcon("studentCode")}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[160px]">
                        <Button variant="ghost" onClick={() => requestSort("skillSet")} className="-ml-4 h-8 hover:bg-transparent font-bold">
                          SkillSet{getSortIcon("skillSet")}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pagedStudents.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-sm text-gray-700">{getUsername(s)}</TableCell>
                        <TableCell className="font-medium">{getFullName(s)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{s.email}</TableCell>
                        <TableCell className="font-mono text-sm font-semibold text-blue-600">{getStudentCode(s)}</TableCell>
                        <TableCell className="text-xs text-gray-600 max-w-[200px] truncate" title={getSkillSet(s)}>
                            {getSkillSet(s)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between p-4 border-t bg-gray-50/50">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, sortedStudents.length)}</span> of <span className="font-medium text-gray-900">{sortedStudents.length}</span> entries
                  </div>
                  <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage >= totalPages} 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}