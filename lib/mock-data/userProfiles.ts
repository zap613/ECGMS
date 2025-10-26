//  mock-data/userProfiles.ts
//  UserProfile interface và mock data cho thông tin cá nhân người dùng
// Tách biệt với dữ liệu User để quản lý thông tin cá nhân

export interface UserProfile {
userProfileId: string;
userId: string; // Foreign key to User
fullName: string;
birthday?: string;
contactInfo?: string;
majorId?: string; // Foreign key to Major
avatarUrl?: string;
}

export const mockUserProfiles: UserProfile[] = [
{
userProfileId: "UP001",
userId: "SE171532",
fullName: "Hồ Nguyên Giáp",
birthday: "2003-01-06",
contactInfo: "0912345678",
majorId: "MAJ01", // SE
avatarUrl: "/placeholder-user.jpg",
},
{
userProfileId: "UP002",
userId: "S001",
fullName: "Tran Thi B",
birthday: "2003-05-15",
contactInfo: "0912345678",
majorId: "MAJ01", // SE
avatarUrl: "/placeholder-user.jpg",
},
{
userProfileId: "UP003",
userId: "S002",
fullName: "Le Van C",
birthday: "2003-08-20",
contactInfo: "0923456789",
majorId: "MAJ02", // SS
avatarUrl: "/placeholder-user.jpg",
},
{
userProfileId: "UP004",
userId: "L001",
fullName: "Dr. Nguyen Van An",
contactInfo: "0901234567",
},
];