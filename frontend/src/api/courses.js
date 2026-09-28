import { DEMO_COURSES, DEMO_STUDENTS } from '../utils/mockData';

export async function listCoursesApi() {
  return DEMO_COURSES;
}

export async function createCourseApi(courseData) {
  return {
    id: `c-${Date.now()}`,
    ...courseData,
    total_students: 35,
    attendance_rate: 90.0,
  };
}

export async function enrollStudentApi(courseId, studentId) {
  return {
    id: `enr-${Date.now()}`,
    course_id: courseId,
    student_id: studentId,
    enrolled_at: new Date().toISOString(),
    is_active: true,
  };
}

export async function getCourseStudentsApi() {
  return DEMO_STUDENTS;
}
