import React, { createContext, useContext, useState } from 'react';
import {
  DEMO_COURSES,
  DEMO_STUDENTS,
  DEMO_SESSIONS,
  DEMO_STUDENT_ATTENDANCE,
  DEMO_ATTENDANCE_LOGS,
} from '../utils/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('demo_courses');
    return saved ? JSON.parse(saved) : DEMO_COURSES;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('demo_students');
    return saved ? JSON.parse(saved) : DEMO_STUDENTS;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('demo_sessions');
    return saved ? JSON.parse(saved) : DEMO_SESSIONS;
  });

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('demo_logs');
    return saved ? JSON.parse(saved) : DEMO_ATTENDANCE_LOGS;
  });

  const [studentAttendance, setStudentAttendance] = useState(() => {
    const saved = localStorage.getItem('demo_student_attendance');
    return saved ? JSON.parse(saved) : DEMO_STUDENT_ATTENDANCE;
  });

  // Action: Add new student
  const addStudent = (newSt) => {
    const studentObj = {
      id: `s-${Date.now()}`,
      ...newSt,
      status: 'ACTIVE',
      overall_attendance: 100.0,
      enrolled_courses_count: 1,
    };
    const updated = [studentObj, ...students];
    setStudents(updated);
    localStorage.setItem('demo_students', JSON.stringify(updated));
    return studentObj;
  };

  // Action: Add new session & submit attendance
  const submitAttendanceSession = (courseId, date, slot, records) => {
    const courseObj = courses.find((c) => c.id === courseId) || courses[0];
    const presentCount = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
    const absentCount = records.filter((r) => r.status === 'ABSENT').length;
    const rate = Math.round((presentCount / records.length) * 1000) / 10;

    const newSession = {
      id: `ses-${Date.now()}`,
      course_id: courseId,
      course_code: courseObj.course_code,
      course_title: courseObj.title,
      instructor_name: 'Dr. Robert Vance',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      status: 'COMPLETED',
      total_students: records.length,
      present_count: presentCount,
      absent_count: absentCount,
      attendance_rate: rate,
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('demo_sessions', JSON.stringify(updatedSessions));

    // Also add to student attendance logs
    const newLog = {
      id: `log-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      time: slot || '09:00 AM',
      course_code: courseObj.course_code,
      title: courseObj.title,
      status: 'PRESENT',
      method: 'Teacher Manual Sheet',
    };
    const updatedLogs = [newLog, ...attendanceLogs];
    setAttendanceLogs(updatedLogs);
    localStorage.setItem('demo_logs', JSON.stringify(updatedLogs));

    return newSession;
  };

  const value = {
    courses,
    students,
    sessions,
    attendanceLogs,
    studentAttendance,
    addStudent,
    submitAttendanceSession,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
