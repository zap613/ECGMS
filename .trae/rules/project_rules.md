# ECGMS Project Rules - Guidelines for AI Assistant

This document outlines the core technical and business rules for the ECGMS project. The AI Assistant MUST adhere strictly to these rules.

## 1. Core Objective

ECGMS (EXE Course Grouping Management System) aims to automate and streamline the process of forming student groups for the EXE course at FPT University, replacing the current manual process.

## 2. Technical Stack

* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
* **Backend:** ASP.NET Core Web API (C#)
* **Database:** SQL Server or MySQL (Assume standard relational database concepts)
* **Authentication:** JWT (JSON Web Tokens)

## 3. Key User Roles

* **Admin (Phòng Đào Tạo):** Manages semesters, courses (classes), users, assigns lecturers, triggers auto-grouping, oversees the system.
* **Lecturer (Giảng viên):** Manages assigned courses/groups, monitors progress, assigns grades.
* **Student (Sinh viên):** Updates profile (Major, Skills), joins/creates groups, manages tasks within the group.
* **Group Leader (Sinh viên):** Manages group members (invites, approvals), sets group status, defines group needs, assigns tasks.

## 4. Core Business Logic & Rules

### 4.1. Semester & Course Initialization (Admin)
* Admin defines a new Semester (e.g., "Summer 2025").
* Admin inputs the total expected number of eligible students.
* Admin divides the total students into multiple Courses (Classes).
* Admin assigns one or more Lecturers (Mentors) to each Course.
* **Group Generation:** The system calculates the number of empty groups needed per Course based on: `NumGroups = CEILING((StudentsPerCourse / MinGroupSize) * (1 + SafetyFactor))`.
    * `MinGroupSize` = 4 (Based on 4-6 members rule)
    * `SafetyFactor` = 0.4 (40%)
* System creates the calculated number of empty groups for each course upon Admin confirmation.
* Semesters/Courses have statuses: `new`, `forming_team` (group formation period), `team_finalized` (grouping closed), `in_progress` (course running).

### 4.2. Group Formation & Management (Student/Leader)
* **Group Size:** 4 to 6 members.
* **Major Requirement:** Each group MUST have members from at least 2 different Majors (e.g., SE and SS).
* **Student Actions:**
    * View available groups in their course (empty or partial).
    * `Join`: Enter an `open` group directly if space allows.
    * `Apply`: Request to join a `lock` group (requires Leader approval).
    * `Create`: Form a new group, becoming the initial Leader.
* **Group Statuses (Set by Leader):**
    * `open`: Anyone can join until full or locked. (Default for new/empty groups).
    * `lock`: Requires Leader approval to join. Leader can set this manually OR **Business Rule:** A group can be locked by the Leader *only if* it has 3 or more members.
    * `finalize`: Group composition is complete, no more joining/leaving/applying.
    * `private`: Hidden from general view; members can only join via direct invitation from the Leader.
* **Group Needs:** Leader can specify the number of members needed for specific Majors (e.g., "Need 2 SE, 1 SS").
* **Leader Election:** Assumed mechanism exists for electing a Leader (details TBD or handled manually initially).

### 4.3. Other Modules
* **Task Management:** Leaders assign tasks to members within a group.
* **Grading:** Lecturers define Grade Items (assignments, presentations) and input scores (group/individual). (Detailed grading logic is likely external or simplified).
* **User Profile:** Students MUST update their Major and SkillSet for grouping algorithms and visibility.

## 5. System Constraints & Scope
* **Data Source (Current):** Rely on mock data (`lib/mock-data/`) and the generated API client (`lib/api/generated/`) based on the provided Swagger definition. Assume API calls *will* eventually replace mock data logic.
* **Out of Scope:** Direct integration with FAP/LMS, complex grading calculations, real-time chat/collaboration features.

## 6. AI Guidelines
* Refer to these rules when explaining functionality or suggesting implementations.
* If mock data contradicts a rule, mention the rule as the intended behavior.
* Emphasize the defined tech stack in suggestions.