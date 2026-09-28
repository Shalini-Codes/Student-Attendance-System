import React, { useState } from 'react';
import {
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { exportToCSV, formatDate } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';

export function Reports() {
  const { showToast } = useToast();
  const { courses, students } = useData();

  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-28');
  const [onlyLowAttendance, setOnlyLowAttendance] = useState(false);

  const reportData = students.map((st) => ({
    id: st.id,
    roll_number: st.roll_number,
    name: `${st.first_name} ${st.last_name}`,
    email: st.email,
    department: st.department,
    total_classes: 24,
    attended_classes: Math.round(24 * ((st.overall_attendance || 90.0) / 100)),
    percentage: st.overall_attendance || 90.0,
    status: (st.overall_attendance || 90.0) < 75 ? 'WARNING' : 'GOOD',
  }));

  const filteredReports = reportData.filter((r) => {
    const matchesCourse = !selectedCourse || selectedCourse === 'ALL';
    const matchesLow = !onlyLowAttendance || r.percentage < 75;
    return matchesCourse && matchesLow;
  });

  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      showToast('No data available to export.', 'warning');
      return;
    }

    const headers = ['Roll Number', 'Student Name', 'Department', 'Total Classes', 'Attended', 'Attendance %', 'Eligibility Status'];
    const rows = filteredReports.map((r) => [
      r.roll_number,
      r.name,
      r.department,
      r.total_classes,
      r.attended_classes,
      `${r.percentage}%`,
      r.percentage < 75 ? 'Shortage (<75%)' : 'Eligible',
    ]);

    exportToCSV(`ATTENDIQ_Report_${startDate}_to_${endDate}`, headers, rows);
    showToast('Analytics report exported to CSV successfully!', 'success');
  };

  const lowAttendanceCount = reportData.filter((r) => r.percentage < 75).length;

  return (
    <MainLayout title="Analytics & Shortage Reports">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#182443] tracking-tight">Academic Analytics & Shortage Reports</h2>
          <p className="text-xs text-slate-500">
            Generate attendance shortage audits and export CSV reports
          </p>
        </div>

        <Button variant="primary" icon={Download} onClick={handleExportCSV}>
          Export CSV Report
        </Button>
      </div>

      {/* Filters Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Subject / Course Filter"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Courses Combined' },
                ...courses.map((c) => ({
                  value: c.id,
                  label: `${c.course_code} - ${c.title}`,
                })),
              ]}
            />
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyLowAttendance}
                  onChange={(e) => setOnlyLowAttendance(e.target.checked)}
                  className="rounded border-slate-300 text-[#7067E8] focus:ring-[#7067E8] w-4 h-4"
                />
                <span className="text-xs font-bold text-rose-800 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  Show Shortage (&lt;75%) Only
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conducted Lectures</p>
              <p className="text-2xl font-black text-[#182443] mt-1">24 Classes</p>
              <span className="text-[11px] text-slate-500 mt-1 block">In selected date range</span>
            </div>
            <div className="p-3 bg-[#F4F3FF] text-[#7067E8] rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Attendance</p>
              <p className="text-2xl font-black text-[#182443] mt-1">85.3%</p>
              <span className="text-[11px] text-[#39B99B] font-bold flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> Above institutional benchmark
              </span>
            </div>
            <div className="p-3 bg-[#EBF8F5] text-[#39B99B] rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortage Warnings</p>
              <p className="text-2xl font-black text-[#d04343] mt-1">{lowAttendanceCount} Students</p>
              <span className="text-[11px] text-rose-600 font-bold flex items-center mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" /> Below 75% requirement
              </span>
            </div>
            <div className="p-3 bg-[#FDF2F2] text-[#E55353] rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Report Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Attendance Roster & Shortage Audit</CardTitle>
            <CardDescription>
              Filtered from {formatDate(startDate)} to {formatDate(endDate)}
            </CardDescription>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {filteredReports.length} Records
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Attended / Total</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-right">Eligibility Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs font-bold text-[#7067E8]">
                    {r.roll_number}
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-[#182443]">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.email}</p>
                  </TableCell>
                  <TableCell className="text-xs">{r.department}</TableCell>
                  <TableCell className="text-center font-mono text-xs font-semibold">
                    {r.attended_classes} / {r.total_classes}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            r.percentage < 75 ? 'bg-[#E55353]' : 'bg-[#7067E8]'
                          }`}
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                      <span
                        className={`font-bold text-xs ${
                          r.percentage < 75 ? 'text-[#d04343]' : 'text-slate-800'
                        }`}
                      >
                        {r.percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge status={r.status}>
                      {r.percentage < 75 ? 'Shortage (<75%)' : 'Eligible'}
                    </Badge>
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
