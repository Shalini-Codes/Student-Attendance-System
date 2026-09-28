/**
 * Frontend Demo Authentication API Service
 */
import { DEMO_USERS } from '../context/AuthContext';

export async function loginApi(email) {
  let matchedUser = DEMO_USERS.TEACHER;
  if (email.toLowerCase().includes('student')) {
    matchedUser = DEMO_USERS.STUDENT;
  } else if (email.toLowerCase().includes('admin')) {
    matchedUser = DEMO_USERS.ADMIN;
  }
  return {
    access_token: `demo_token_${Date.now()}`,
    refresh_token: `demo_refresh_${Date.now()}`,
    token_type: 'bearer',
    user: matchedUser,
  };
}

export async function getMeApi() {
  return DEMO_USERS.TEACHER;
}
