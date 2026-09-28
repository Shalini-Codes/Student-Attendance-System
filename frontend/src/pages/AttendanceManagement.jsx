import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { calculatePercentage } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';

export function AttendanceManagement() {
  const { showToast } = useToast();
  const { courses, students, submitAttendanceSession } = useData();

  // Selection states
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [periodSlot, setPeriodSlot] = useState('09:00 AM - 10:00 AM');
  const [searchTerm, setSearchTerm] = useState('');

  // Local Attendance Map: { studentId: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const initial = {};
    students.forEach((s) => {
      initial[s.id] = 'PRESENT';
    });
    return initial;
  });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStatusChange = (studentId, status) => {
    if (isSubmitted) {
      showToast('Attendance for this session has already been finalized.', 'warning');
      return;
    }
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleBulkAction = (status) => {
    if (isSubmitted) return;
    const updated = {};
    students.forEach((s) => {
      if (status === 'INVERT') {
        updated[s.id] = attendanceMap[s.id] === 'PRESENT' ? 'ABSENT' : 'PRESENT';
      } else {
        updated[s.id] = status;
      }
    });
    setAttendanceMap(updated);
    showToast(`Marked all students as ${status === 'INVERT' ? 'inverted' : status}`, 'info');
  };

  // Live Counter Calculations
  const totalEnrolled = students.length;
  const presentCount = Object.values(attendanceMap).filter((v) => v === 'PRESENT' || v === 'LATE').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'ABSENT').length;
  const excusedCount = Object.values(attendanceMap).filter((v) => v === 'EXCUSED').length;
  const attendanceRate = calculatePercentage(presentCount, totalEnrolled);

  const selectedCourseObj = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const filteredRoster = students.filter((s) => {
    const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
    const roll = (s.roll_number || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || roll.includes(search);
  });

  const handleSubmitAttendance = () => {
    const records = Object.entries(attendanceMap).map(([student_id, status]) => ({
      student_id,
      status,
    }));

    submitAttendanceSession(selectedCourseId, sessionDate, periodSlot, records);
    showToast(
      `Attendance sheet saved for ${selectedCourseObj?.course_code}! Rate: ${attendanceRate}%`,
      'success'
    );
    setIsSubmitted(true);
    setConfirmModalOpen(false);
  };

  return (
    <MainLayout title="Attendance Entry Workspace">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#182443] tracking-tight">Manual Attendance Sheet</h2>
          <p className="text-xs text-slate-500">
            Instructor control panel for recording class participation
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#EBF8F5] border border-[#39B99B]/30 text-[#2fa085] text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#39B99B]" />
            <span>Sheet Finalized & Recorded</span>
          </div>
        )}
      </div>

      {/* Header Controls */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Select Subject Course"
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setIsSubmitted(false);
              }}
              options={courses.map((c) => ({
                value: c.id,
                label: `${c.course_code} - ${c.title}`,
              }))}
            />
            <Input
              label="Class Date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
            <Select
              label="Period / Time Slot"
              value={periodSlot}
              onChange={(e) => setPeriodSlot(e.target.value)}
              options={[
                { value: '09:00 AM - 10:00 AM', label: '09:00 AM - 10:00 AM (Period 1)' },
                { value: '10:15 AM - 11:15 AM', label: '10:15 AM - 11:15 AM (Period 2)' },
                { value: '11:30 AM - 12:30 PM', label: '11:30 AM - 12:30 PM (Period 3)' },
                { value: '02:00 PM - 03:00 PM', label: '02:00 PM - 03:00 PM (Period 4)' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Live Counter Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Enrolled Roster</p>
            <p className="text-xl font-black text-[#182443] mt-0.5">{totalEnrolled}</p>
          </div>
          <Users className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-[#EBF8F5] p-4 rounded-2xl border border-[#39B99B]/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#2fa085] uppercase">Present Count</p>
            <p className="text-xl font-black text-[#2fa085] mt-0.5">{presentCount}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-[#39B99B]" />
        </div>

        <div className="bg-[#FDF2F2] p-4 rounded-2xl border border-[#E55353]/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#d04343] uppercase">Absent Count</p>
            <p className="text-xl font-black text-[#d04343] mt-0.5">{absentCount}</p>
          </div>
          <XCircle className="w-5 h-5 text-[#E55353]" />
        </div>

        <div className="bg-[#182443] text-white p-4 rounded-2xl border border-[#182443] flex items-center justify-between shadow-md">
          <div>
            <p className="text-[11px] font-bold text-slate-300 uppercase">Attendance Rate</p>
            <p className="text-xl font-black text-white mt-0.5">{attendanceRate}%</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#7067E8] text-white font-black flex items-center justify-center text-xs">
            %
          </div>
        </div>
      </div>

      {/* Roster & Quick Mark Toolbar */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Class Roster Controls</CardTitle>
            <CardDescription>
              {selectedCourseObj?.course_code} - {selectedCourseObj?.title} ({sessionDate})
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('PRESENT')}
              disabled={isSubmitted}
            >
              Mark All Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('ABSENT')}
              disabled={isSubmitted}
            >
              Mark All Absent
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={RotateCcw}
              onClick={() => handleBulkAction('INVERT')}
              disabled={isSubmitted}
            >
              Invert
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search student by name or roll number..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Attendance Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoster.map((st) => {
                const currentStatus = attendanceMap[st.id] || 'PRESENT';

                return (
                  <TableRow key={st.id}>
                    <TableCell className="font-mono text-xs font-bold text-[#7067E8]">
                      {st.roll_number || '2026-CS-001'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#182443] font-bold flex items-center justify-center text-xs">
                          {st.first_name ? st.first_name[0] : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-[#182443]">
                            {st.first_name} {st.last_name}
                          </p>
                          <p className="text-xs text-slate-500">{st.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{st.department || 'Computer Science'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Present Toggle */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'PRESENT')}
                          disabled={isSubmitted}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'PRESENT'
                              ? 'bg-[#39B99B] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Present
                        </button>

                        {/* Absent Toggle */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'ABSENT')}
                          disabled={isSubmitted}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'ABSENT'
                              ? 'bg-[#E55353] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>

                        {/* Late Toggle */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'LATE')}
                          disabled={isSubmitted}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'LATE'
                              ? 'bg-[#F5A623] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Late
                        </button>

                        {/* Excused Toggle */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'EXCUSED')}
                          disabled={isSubmitted}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'EXCUSED'
                              ? 'bg-[#7067E8] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Submission Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Review records before submitting to official logs.
            </p>
            <Button
              variant={isSubmitted ? 'outline' : 'primary'}
              size="lg"
              icon={CheckSquare}
              onClick={() => setConfirmModalOpen(true)}
              disabled={isSubmitted || students.length === 0}
            >
              {isSubmitted ? 'Sheet Finalized' : 'Review & Save Attendance'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Confirmation Step Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Attendance Sheet Submission"
        description="Verify final class counts before logging session."
      >
        <div className="space-y-4">
          <div className="p-4 bg-[#F4F3FF] rounded-xl border border-[#7067E8]/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-600">Course Code:</span>
              <span className="font-bold text-[#182443]">{selectedCourseObj?.course_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-600">Class Date & Period:</span>
              <span className="font-bold text-[#182443]">{sessionDate} ({periodSlot})</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-600">Total Enrolled:</span>
              <span className="font-bold text-[#182443]">{totalEnrolled} Students</span>
            </div>
            <div className="flex justify-between border-t border-[#7067E8]/20 pt-2 text-sm">
              <span className="font-bold text-slate-800">Attendance Rate:</span>
              <span className="font-bold text-[#7067E8]">{attendanceRate}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-[#EBF8F5] rounded-xl border border-[#39B99B]/30">
              <span className="text-[#2fa085] font-semibold uppercase block text-[10px]">Present</span>
              <span className="text-lg font-bold text-[#2fa085]">{presentCount}</span>
            </div>
            <div className="p-2.5 bg-[#FDF2F2] rounded-xl border border-[#E55353]/30">
              <span className="text-[#d04343] font-semibold uppercase block text-[10px]">Absent</span>
              <span className="text-lg font-bold text-[#d04343]">{absentCount}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold uppercase block text-[10px]">Excused</span>
              <span className="text-lg font-bold text-slate-900">{excusedCount}</span>
            </div>
          </div>

          {attendanceRate < 75 && (
            <div className="p-3 bg-[#FFF8EC] border border-[#F5A623]/30 rounded-xl text-amber-900 text-xs flex items-start">
              <AlertTriangle className="w-4 h-4 mr-2 text-[#F5A623] shrink-0 mt-0.5" />
              <span>
                <strong>Low Class Attendance:</strong> Overall participation is below 75%. Session alert flag will be generated.
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-3">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Back to Sheet
            </Button>
            <Button variant="primary" onClick={handleSubmitAttendance}>
              Confirm & Save Sheet
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
