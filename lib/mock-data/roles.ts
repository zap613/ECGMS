//  Role interface và mock data cho các vai trò người dùng trong hệ thống

export interface Role {
roleId: string;
roleName: "admin" | "lecturer" | "student";
}

export const mockRoles: Role[] = [
{
roleId: "R01",
roleName: "admin",
},
{
roleId: "R02",
roleName: "lecturer",
},
{
roleId: "R03",
roleName: "student",
},
];