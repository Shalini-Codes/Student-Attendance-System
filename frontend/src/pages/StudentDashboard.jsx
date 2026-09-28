import React from 'react';
import {
  UserCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Lock,
  Award,
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/helpers';

export function StudentDashboard() {
  const { user } = useAuth();
  const { studentAttendance, attendanceLogs } = useData();

  const totalClasses = studentAttendance.reduce((acc, c) => acc + c.total_classes, 0);
  const attendedClasses = studentAttendance.reduce((acc, c) => acc + c.attended_classes, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 88.5;
  const isWarning = overallPercentage < 75;

  // Calendar Heatmap sample days for current month
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const dayNum = i + 1;
    let status = 'PRESENT';
    if (dayNum === 5 || dayNum === 14 || dayNum === 22) status = 'ABSENT';
    if (dayNum === 10 || dayNum === 18) status = 'LATE';
    if (dayNum % 7 === 0 || dayNum % 7 === 6) status = 'WEEKEND';
    return { day: dayNum, status };
  });

  return (
    <MainLayout title="Student Portal">
      {/* Student Top Banner with Circular Percentage Gauge */}
      <div className="bg-[#182443] rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#7067E8]/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#39B99B]/20 text-[#39B99B] text-xs font-bold border border-[#39B99B]/30 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified Student ID: {user?.identifier || '2026-CS-001'}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Hello, {user?.first_name || 'Alexander'}!
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              ATTENDIQ Student Portal. Monitor subject-wise class attendance rates and track exam eligibility requirements.
            </p>
          </div>

          {/* Attendance Percentage Circular Ring SVG */}
          <div className="bg-[#1f2d52] p-5 rounded-2xl border border-[#2d3f6d] flex items-center space-x-4 shrink-0 shadow-lg">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={200}
                  strokeDashoffset={200 - (200 * overallPercentage) / 100}
                  strokeLinecap="round"
                  className={isWarning ? 'text-rose-400' : 'text-[#39B99B]'}
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-black text-base text-white">{overallPercentage}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overall Rate</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                isWarning ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-[#39B99B]/20 text-[#39B99B] border border-[#39B99B]/30'
              }`}>
                {isWarning ? 'Shortage Warning' : 'Eligible for Exams'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Read-Only Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-[#F5A623] shrink-0" />
          <span>
            <strong>Read-Only Student Access:</strong> Student accounts view verified attendance logs. Self-marking or modifying entries is prohibited.
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conducted Lectures</p>
              <p className="text-2xl font-black text-[#182443] mt-1">{totalClasses} Classes</p>
              <span className="text-[11px] text-slate-500 mt-1 block">Fall Semester 2026</span>
            </div>
            <div className="p-3 bg-[#F4F3FF] text-[#7067E8] rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attended Lectures</p>
              <p className="text-2xl font-black text-[#2fa085] mt-1">{attendedClasses} Classes</p>
              <span className="text-[11px] text-[#39B99B] font-bold flex items-center mt-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Recorded Present
              </span>
            </div>
            <div className="p-3 bg-[#EBF8F5] text-[#39B99B] rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missed Lectures</p>
              <p className="text-2xl font-black text-[#d04343] mt-1">{totalClasses - attendedClasses} Classes</p>
              <span className="text-[11px] text-rose-600 font-bold flex items-center mt-1">
                <XCircle className="w-3 h-3 mr-1" /> Absence Recorded
              </span>
            </div>
            <div className="p-3 bg-[#FDF2F2] text-[#E55353] rounded-xl">
              <XCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-Wise Attendance Progress Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#182443]">Subject Attendance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentAttendance.map((sub, idx) => {
            const subIsWarning = sub.percentage < 75;
            return (
              <Card key={idx}>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-[#7067E8] bg-[#F4F3FF] px-2.5 py-0.5 rounded-md border border-[#7067E8]/20">
                        {sub.course_code}
                      </span>
                      <h4 className="text-sm font-bold text-[#182443] mt-1">{sub.course_title}</h4>
                      <p className="text-xs text-slate-500">{sub.instructor}</p>
                    </div>
                    <Badge status={sub.status}>{sub.percentage}%</Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Attended: {sub.attended_classes} / {sub.total_classes}</span>
                      <span>Required Threshold: 75%</span>
                    </div>

                    {/* Progress Bar with 75% Threshold Marker Line */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          subIsWarning ? 'bg-rose-500' : 'bg-[#7067E8]'
                        }`}
                        style={{ width: `${sub.percentage}%` }}
                      />
                      {/* 75% Marker Line */}
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-400/60 z-10" />
                    </div>
                  </div>

                  {subIsWarning && (
                    <p className="text-xs text-rose-600 font-bold flex items-center pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      Attendance below required 75%. Risk of exam disqualification.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Monthly Attendance Calendar Heatmap Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Check-In Heatmap</CardTitle>
          <CardDescription>Daily check-in status calendar for September 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day} className="font-bold text-slate-400 uppercase text-[10px] py-1">
                {day}
              </span>
            ))}
            {calendarDays.map((d) => {
              let bg = 'bg-[#EBF8F5] text-[#2fa085] border-[#39B99B]/30';
              if (d.status === 'ABSENT') bg = 'bg-[#FDF2F2] text-[#d04343] border-[#E55353]/30';
              if (d.status === 'LATE') bg = 'bg-[#FFF8EC] text-[#d98205] border-[#F5A623]/30';
              if (d.status === 'WEEKEND') bg = 'bg-slate-50 text-slate-300 border-slate-100';

              return (
                <div
                  key={d.day}
                  className={`p-2 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center ${bg}`}
                  title={`Sep ${d.day}: ${d.status}`}
                >
                  <span>{d.day}</span>
                  <span className="text-[9px] font-normal uppercase opacity-80">{d.status}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Activity History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chronological Attendance History</CardTitle>
          <CardDescription>Official sessions recorded by instructor</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Subject Title</TableHead>
                <TableHead>Verification Method</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs font-medium">
                    {formatDate(log.date)}
                    <span className="block text-slate-400 font-mono">{log.time}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-[#7067E8]">
                    {log.course_code}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-[#182443]">{log.title}</TableCell>
                  <TableCell className="text-xs text-slate-500">{log.method}</TableCell>
                  <TableCell className="text-right">
                    <Badge status={log.status}>{log.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
