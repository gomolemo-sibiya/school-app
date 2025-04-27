# School Web App

## Overview
A role-based React web application for Students, Lecturers, and Admins. Features include authentication, dashboard analytics, appointments, timetable viewing, notifications, and issue reporting.

## Features
- Role-based authentication (Student, Lecturer, Admin)
- Responsive, mobile-first UI
- Appointments booking system
- Timetable viewer (students only)
- Notifications management (lecturers)
- Issue reporting and tracking
- Data export (PDF, CSV)

## Tech Stack
- React
- Centralized styling (CSS Modules or Tailwind CSS)

## Project Structure
- Landing Page → Authentication (Sign In / Sign Up / Confirm) → Main App
- Sidebar + Top Header (Profile Info, Role, Report Issue)
- Main Pages: Dashboard, Appointments, Timetable, Notifications, User Profiles, Report Issues

## Setup
1. Clone the repository:
    ```
    git clone <repository-url>
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Start the development server:
    ```
    npm run dev
    ```

## Notes
- Frontend only. Backend endpoints assumed.
- Role-based navigation and access control are required.
