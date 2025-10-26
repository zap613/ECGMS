// lib/mock-data/majors.ts
export interface Major {
majorId: string;
majorName: string;
majorCode: "SE" | "SS" | "AI" | "GD"; // Thêm các chuyên ngành khác nếu cần
}

export const mockMajors: Major[] = [
{
majorId: "MAJ01",
majorName: "Software Engineering",
majorCode: "SE",
},
{
majorId: "MAJ02",
majorName: "Software Systems",
majorCode: "SS",
},
{
majorId: "MAJ03",
majorName: "Artificial Intelligence",
majorCode: "AI",
},
{
majorId: "MAJ04",
majorName: "Graphic Design",
majorCode: "GD",
},
];