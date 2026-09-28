# ATTENDIQ — Smart Campus Attendance Platform 🎓⚡

**ATTENDIQ** is a modern, responsive, teacher-controlled student attendance system designed for academic institutions. Built with **React, Vite, JavaScript, and Tailwind CSS**, it features dynamic rotating QR session tokens, interactive manual roster sheet marking, student shortage threshold alerts (<75%), subject progress analytics, and CSV report export.

---

## 🌟 Key Features

### 👨‍🏫 Instructor / Admin Workspace
- **Dynamic QR Session Generator**: Broadcasts time-limited attendance sessions with auto-rotating security nonces (updates every 15s to prevent static screenshot proxying).
- **Interactive Attendance Sheet**: Segment controls for **Present (Teal)**, **Absent (Rose)**, **Late (Amber)**, and **Excused (Violet)**.
- **Bulk Roster Actions**: *Mark All Present*, *Mark All Absent*, *Invert Selection*, and student search filters.
- **Review Confirmation Step**: Verification modal before finalizing class sessions.
- **Analytics & Shortage Audits**: Subject-wise performance tracking with **Export CSV** capability.

### 👨‍🎓 Student Portal
- **Attendance Percentage Circular Ring**: Visual gauge displaying overall attendance rate and exam eligibility status (*Eligible for Exams* vs *Shortage Warning*).
- **Subject Progress Cards**: Progress bars equipped with a **75% minimum threshold line marker**.
- **Monthly Check-In Heatmap Grid**: Visual 28-day calendar grid tracking daily check-in statuses.
- **Strict Read-Only Enforcement**: Secure view ensuring students cannot alter entries or self-mark attendance.

---

## 🛠️ Tech Stack & Design System

- **Frontend**: React 19, Vite, JavaScript, Tailwind CSS v4, Lucide React Icons
- **Navigation & Routing**: React Router v6
- **State & Notification**: React Context API (`AuthProvider`, `DataProvider`, `ToastProvider`)
- **Theme Palette**:
  - Deep Navy Sidebar: `#182443`
  - Primary Accent Violet: `#7067E8`
  - Soft Lavender Highlights: `#E9E7FF`
  - Teal Success Indicators: `#39B99B`
  - Rose Absence Indicators: `#E55353`

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
cd frontend
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` or `http://localhost:5174/`.

---

## 🔑 Demo Login Credentials (Presentation Mode)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Teacher** | `teacher@apex.edu` | `teacher123` |
| **Student** | `alex.wright@student.apex.edu` | `student123` |
| **Admin** | `admin@apex.edu` | `admin1234` |

*Includes 1-click role selection tabs and Google Sign-In UI demonstration.*

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
