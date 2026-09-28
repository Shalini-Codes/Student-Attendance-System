/**
 * Demo datasets for Student Attendance System presentation & development mode.
 * Clearly designated as fallback demo state when real database records or endpoints are empty.
 */

export const DEMO_COURSES = [
  {
    id: 'c101-uuid-0001',
    course_code: 'CS301',
    title: 'Database Management Systems',
    description: 'Relational databases, SQL, ACID transactions, and normalization',
    instructor_id: 't201-uuid-0001',
    instructor_name: 'Dr. Robert Vance',
    semester: 'Fall 2026',
    is_active: true,
    total_students: 45,
    attendance_rate: 88.5
  },
  {
    id: 'c102-uuid-0002',
    course_code: 'CS302',
    title: 'Web Application Development',
    description: 'Modern frontend frameworks, REST APIs, and backend integration',
    instructor_id: 't201-uuid-0001',
    instructor_name: 'Dr. Robert Vance',
    semester: 'Fall 2026',
    is_active: true,
    total_students: 40,
    attendance_rate: 92.1
  },
  {
    id: 'c103-uuid-0003',
    course_code: 'CS304',
    title: 'Computer Networks',
    description: 'OSI Model, TCP/IP stack, routing protocols, and socket programming',
    instructor_id: 't202-uuid-0002',
    instructor_name: 'Prof. Sarah Jenkins',
    semester: 'Fall 2026',
    is_active: true,
    total_students: 50,
    attendance_rate: 76.4
  },
  {
    id: 'c104-uuid-0004',
    course_code: 'CS305',
    title: 'Software Engineering',
    description: 'Agile methodologies, system architecture, design patterns, and testing',
    instructor_id: 't201-uuid-0001',
    instructor_name: 'Dr. Robert Vance',
    semester: 'Fall 2026',
    is_active: true,
    total_students: 42,
    attendance_rate: 84.0
  }
];

export const DEMO_STUDENTS = [
  {
    id: 's301-uuid-0001',
    first_name: 'Alexander',
    last_name: 'Wright',
    email: 'alex.wright@student.apex.edu',
    roll_number: '2026-CS-001',
    department: 'Computer Science',
    batch_year: 2026,
    role: 'STUDENT',
    status: 'ACTIVE',
    overall_attendance: 91.5,
    enrolled_courses_count: 4
  },
  {
    id: 's302-uuid-0002',
    first_name: 'Sophia',
    last_name: 'Chen',
    email: 'sophia.chen@student.apex.edu',
    roll_number: '2026-CS-002',
    department: 'Computer Science',
    batch_year: 2026,
    role: 'STUDENT',
    status: 'ACTIVE',
    overall_attendance: 95.0,
    enrolled_courses_count: 4
  },
  {
    id: 's303-uuid-0003',
    first_name: 'Marcus',
    last_name: 'Johnson',
    email: 'marcus.j@student.apex.edu',
    roll_number: '2026-CS-003',
    department: 'Computer Science',
    batch_year: 2026,
    role: 'STUDENT',
    status: 'ACTIVE',
    overall_attendance: 68.0, // Low attendance warning demo
    enrolled_courses_count: 4
  },
  {
    id: 's304-uuid-0004',
    first_name: 'Emma',
    last_name: 'Watson',
    email: 'emma.w@student.apex.edu',
    roll_number: '2026-CS-004',
    department: 'Information Technology',
    batch_year: 2026,
    role: 'STUDENT',
    status: 'ACTIVE',
    overall_attendance: 87.2,
    enrolled_courses_count: 3
  },
  {
    id: 's305-uuid-0005',
    first_name: 'David',
    last_name: 'Miller',
    email: 'david.m@student.apex.edu',
    roll_number: '2026-CS-005',
    department: 'Computer Science',
    batch_year: 2026,
    role: 'STUDENT',
    status: 'ACTIVE',
    overall_attendance: 72.4, // Low attendance warning demo
    enrolled_courses_count: 4
  },
  {
    id: 's306-uuid-0006',
    first_name: 'Olivia',
    last_name: 'Taylor',
    email: 'olivia.t@student.apex.edu',
    roll_number: '2026-CS-006',
    department: 'Software Engineering',
    batch_year: 2026,
    role: 'STUDENT',
    status: 'ACTIVE',
    overall_attendance: 98.0,
    enrolled_courses_count: 4
  }
];

export const DEMO_SESSIONS = [
  {
    id: 'ses-101',
    course_id: 'c101-uuid-0001',
    course_code: 'CS301',
    course_title: 'Database Management Systems',
    instructor_name: 'Dr. Robert Vance',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date().toISOString(),
    status: 'COMPLETED',
    total_students: 45,
    present_count: 41,
    absent_count: 4,
    attendance_rate: 91.1
  },
  {
    id: 'ses-102',
    course_id: 'c102-uuid-0002',
    course_code: 'CS302',
    course_title: 'Web Application Development',
    instructor_name: 'Dr. Robert Vance',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 1800000).toISOString(),
    status: 'ACTIVE',
    total_students: 40,
    present_count: 35,
    absent_count: 5,
    attendance_rate: 87.5
  },
  {
    id: 'ses-103',
    course_id: 'c104-uuid-0004',
    course_code: 'CS305',
    course_title: 'Software Engineering',
    instructor_name: 'Dr. Robert Vance',
    start_time: new Date(Date.now() - 86400000).toISOString(),
    end_time: new Date(Date.now() - 82800000).toISOString(),
    status: 'COMPLETED',
    total_students: 42,
    present_count: 36,
    absent_count: 6,
    attendance_rate: 85.7
  }
];

export const DEMO_STUDENT_ATTENDANCE = [
  {
    course_id: 'c101-uuid-0001',
    course_code: 'CS301',
    course_title: 'Database Management Systems',
    instructor: 'Dr. Robert Vance',
    total_classes: 24,
    attended_classes: 22,
    percentage: 91.6,
    status: 'GOOD'
  },
  {
    course_id: 'c102-uuid-0002',
    course_code: 'CS302',
    course_title: 'Web Application Development',
    instructor: 'Dr. Robert Vance',
    total_classes: 20,
    attended_classes: 19,
    percentage: 95.0,
    status: 'GOOD'
  },
  {
    course_id: 'c103-uuid-0003',
    course_code: 'CS304',
    course_title: 'Computer Networks',
    instructor: 'Prof. Sarah Jenkins',
    total_classes: 22,
    attended_classes: 15,
    percentage: 68.1,
    status: 'WARNING'
  },
  {
    course_id: 'c104-uuid-0004',
    course_code: 'CS305',
    course_title: 'Software Engineering',
    instructor: 'Dr. Robert Vance',
    total_classes: 18,
    attended_classes: 16,
    percentage: 88.8,
    status: 'GOOD'
  }
];

export const DEMO_ATTENDANCE_LOGS = [
  { id: 'log-1', date: '2026-09-27', time: '09:05 AM', course_code: 'CS301', title: 'Database Systems', status: 'PRESENT', method: 'Teacher Manual' },
  { id: 'log-2', date: '2026-09-26', time: '11:15 AM', course_code: 'CS302', title: 'Web App Dev', status: 'PRESENT', method: 'Dynamic QR Scan' },
  { id: 'log-3', date: '2026-09-25', time: '02:00 PM', course_code: 'CS304', title: 'Computer Networks', status: 'ABSENT', method: 'Teacher Manual' },
  { id: 'log-4', date: '2026-09-24', time: '10:00 AM', course_code: 'CS305', title: 'Software Engineering', status: 'PRESENT', method: 'Dynamic QR Scan' },
  { id: 'log-5', date: '2026-09-22', time: '09:00 AM', course_code: 'CS301', title: 'Database Systems', status: 'PRESENT', method: 'Teacher Manual' },
  { id: 'log-6', date: '2026-09-21', time: '11:00 AM', course_code: 'CS302', title: 'Web App Dev', status: 'PRESENT', method: 'Dynamic QR Scan' },
];
