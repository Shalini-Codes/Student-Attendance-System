import { DEMO_STUDENTS } from '../utils/mockData';

export async function listUsersApi() {
  return DEMO_STUDENTS;
}

export async function createStudentApi(data) {
  return {
    id: `s-${Date.now()}`,
    ...data,
    role: 'STUDENT',
    status: 'ACTIVE',
  };
}

export async function createTeacherApi(data) {
  return {
    id: `t-${Date.now()}`,
    ...data,
    role: 'TEACHER',
    status: 'ACTIVE',
  };
}

export async function getUserApi(userId) {
  return DEMO_STUDENTS.find((s) => s.id === userId) || DEMO_STUDENTS[0];
}
