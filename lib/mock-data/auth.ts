// Mock user data - Replace with API calls later
import type { User } from "@/lib/types"

export const mockUsers: User[] = [
  {
    userId: "L001",
    username: "lecturer1",
    fullName: "Dr. Nguyen Van A",
    email: "nguyenvana@fpt.edu.vn",
    role: "lecturer",
    contactInfo: "0901234567",
  },
  {
    userId: "S001",
    username: "student1",
    fullName: "Tran Thi B",
    email: "tranthib@fpt.edu.vn",
    role: "student",
    major: "SE",
    skillSet: ["Frontend", "React", "TypeScript"],
    birthday: "2003-05-15",
    contactInfo: "0912345678",
  },
  {
    userId: "S002",
    username: "student2",
    fullName: "Le Van C",
    email: "levanc@fpt.edu.vn",
    role: "student",
    major: "SS",
    skillSet: ["Backend", "Node.js", "Database"],
    birthday: "2003-08-20",
    contactInfo: "0923456789",
  },
  {
    userId: "A001",
    username: "admin1",
    fullName: "Pham Thi D",
    email: "phamthid@fpt.edu.vn",
    role: "admin",
    contactInfo: "0934567890",
  },
]

// Mock authentication function - Replace with API call later
export function authenticateUser(username: string, password: string): User | null {
  // In real app, this would call an API endpoint
  // For now, accept any user with password "password123"
  if (password === "password123") {
    return mockUsers.find((user) => user.username === username) || null
  }
  return null
}
