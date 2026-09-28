import { DEMO_SESSIONS, DEMO_STUDENT_ATTENDANCE, DEMO_ATTENDANCE_LOGS } from '../utils/mockData';

export async function createAttendanceSessionApi(sessionData) {
  return {
    id: `ses-${Date.now()}`,
    course_id: sessionData.course_id,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + (sessionData.duration_minutes || 5) * 60000).toISOString(),
    status: 'ACTIVE',
    token_ttl_seconds: 15,
    session_secret: Math.random().toString(36).substring(2, 10),
  };
}

export async function getAttendanceSessionsApi() {
  return DEMO_SESSIONS;
}

export async function submitAttendanceRecordsApi(sessionId, records) {
  return {
    status: 'SUCCESS',
    message: 'Attendance sheet submitted and saved to session log',
    records_count: records.length,
    timestamp: new Date().toISOString(),
  };
}

export async function verifyQrTokenScanApi(sessionId, qrNonce, studentId) {
  return {
    status: 'PRESENT',
    student_id: studentId,
    token_nonce: qrNonce,
    marked_at: new Date().toISOString(),
  };
}

export async function getStudentAttendanceSummaryApi() {
  return DEMO_STUDENT_ATTENDANCE;
}

export async function getStudentAttendanceLogsApi() {
  return DEMO_ATTENDANCE_LOGS;
}
