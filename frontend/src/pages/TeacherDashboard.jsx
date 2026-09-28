import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CheckSquare,
  QrCode,
  TrendingUp,
  Clock,
  ArrowUpRight,
  BarChart2,
  Calendar,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { formatDate, formatTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function TeacherDashboard() {
  const { user } = useAuth();
  const { courses, sessions, students } = useData();
  const navigate = useNavigate();

  const totalStudentsCount = students.length || 45;
  const avgAttendance = 88.4;

  // Weekly attendance trend dataset
  const weeklyData = [
    { day: 'Mon', rate: 92, count: '41/45' },
    { day: 'Tue', rate: 85, count: '38/45' },
    { day: 'Wed', rate: 89, count: '40/45' },
    { day: 'Thu', rate: 94, count: '42/45' },
    { day: 'Fri', rate: 82, count: '37/45' },
  ];

  return (
    <MainLayout title="Instructor Overview">
      {/* ATTENDIQ Welcome Banner */}
      <div className="bg-[#182443] rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#7067E8]/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#7067E8]/20 text-[#928BFF] text-xs font-bold border border-[#7067E8]/30 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Monday, September 28, 2026
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#39B99B]/20 text-[#39B99B] text-xs font-bold border border-[#39B99B]/30">
                Fall 2026 Term
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.first_name || 'Instructor'}!
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              ATTENDIQ Smart Campus Hub. Take class attendance, generate dynamic QR tokens, and review shortage reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              icon={CheckSquare}
              onClick={() => navigate('/attendance')}
            >
              Take Attendance
            </Button>
            <Button
              variant="primary"
              icon={QrCode}
              onClick={() => navigate('/qr-attendance')}
            >
              Create QR Session
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
              <p className="text-2xl font-black text-[#182443] mt-1">{totalStudentsCount}</p>
              <span className="text-[11px] text-[#39B99B] font-bold flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> Active Roster
              </span>
            </div>
            <div className="p-3 bg-[#F4F3FF] text-[#7067E8] rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Subjects</p>
              <p className="text-2xl font-black text-[#182443] mt-1">{courses.length}</p>
              <span className="text-[11px] text-slate-500 mt-1 block">Fall 2026 Semester</span>
            </div>
            <div className="p-3 bg-[#F4F3FF] text-[#7067E8] rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Attendance</p>
              <p className="text-2xl font-black text-[#182443] mt-1">{avgAttendance}%</p>
              <span className="text-[11px] text-[#39B99B] font-bold flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.4% vs last week
              </span>
            </div>
            <div className="p-3 bg-[#EBF8F5] text-[#39B99B] rounded-xl">
              <BarChart2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions Recorded</p>
              <p className="text-2xl font-black text-[#182443] mt-1">{sessions.length}</p>
              <span className="text-[11px] text-amber-600 font-bold flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" /> Last class today
              </span>
            </div>
            <div className="p-3 bg-[#FFF8EC] text-[#F5A623] rounded-xl">
              <CheckSquare className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Weekly Chart & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Attendance Visualization Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>Daily participation rate across all classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end justify-between h-48 pt-6 px-2 border-b border-slate-100">
              {weeklyData.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2 group">
                  <span className="text-[10px] font-extrabold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.rate}%
                  </span>
                  <div className="w-8 bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-[#7067E8] rounded-t-xl group-hover:bg-[#5C52E0] transition-all duration-500"
                      style={{ height: `${d.rate}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#F4F3FF] rounded-xl border border-[#7067E8]/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Weekly Average:</span>
              <span className="font-extrabold text-[#7067E8]">87.4% Participation</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Log */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Attendance Sessions</CardTitle>
              <CardDescription>Latest class check-in entries</CardDescription>
            </div>
            <Link to="/reports" className="text-xs font-bold text-[#7067E8] hover:underline flex items-center">
              View All Reports <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Attendance Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((ses) => (
                  <TableRow key={ses.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-[#182443]">{ses.course_code}</p>
                        <p className="text-xs text-slate-500">{ses.course_title || 'Database Systems'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(ses.start_time)}
                      <span className="block text-slate-400 font-mono">{formatTime(ses.start_time)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge status={ses.status}>{ses.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-slate-900">
                      {ses.attendance_rate ? `${ses.attendance_rate}%` : '89.2%'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Class-Wise Attendance Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Class Attendance Summary</CardTitle>
          <CardDescription>Subject-wise performance against institutional 75% threshold</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => {
            const rate = c.attendance_rate || 85.0;
            const isWarning = rate < 75;
            return (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#182443]">{c.course_code} - {c.title}</span>
                  <span className={isWarning ? 'text-rose-600 font-extrabold' : 'text-[#39B99B]'}>
                    {rate}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWarning ? 'bg-rose-500' : 'bg-[#7067E8]'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
                {isWarning && (
                  <p className="text-[10px] text-rose-600 font-semibold flex items-center pt-0.5">
                    <AlertCircle className="w-3 h-3 mr-1" /> Below required 75% threshold
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
