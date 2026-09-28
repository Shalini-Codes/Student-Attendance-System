import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Clock,
  RefreshCw,
  Users,
  ShieldCheck,
  Play,
  Square,
  CheckCircle2,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';

export function QrAttendance() {
  const { courses, students } = useData();
  const { showToast } = useToast();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [durationMinutes, setDurationMinutes] = useState(5);

  const [activeSession, setActiveSession] = useState(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [qrNonce, setQrNonce] = useState('');
  const [nonceTimer, setNonceTimer] = useState(15);
  const [scannedStudents, setScannedStudents] = useState([]);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  // Main session countdown timer
  useEffect(() => {
    if (!activeSession || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          showToast('Dynamic QR session expired.', 'warning');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, timeLeftSeconds]);

  // Rotating security nonce token refresh (updates every 15s to prevent screenshot reuse)
  useEffect(() => {
    if (!activeSession || timeLeftSeconds <= 0) return;

    const nonceInterval = setInterval(() => {
      setNonceTimer((prev) => {
        if (prev <= 1) {
          const newNonce = `ATT-TOKEN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;
          setQrNonce(newNonce);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(nonceInterval);
  }, [activeSession, timeLeftSeconds]);

  const handleStartSession = () => {
    const session = {
      id: `ses-${Date.now()}`,
      course_id: selectedCourseId,
      status: 'ACTIVE',
    };

    setActiveSession(session);
    setTimeLeftSeconds(parseInt(durationMinutes) * 60);
    setQrNonce(`ATT-TOKEN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    setNonceTimer(15);
    setScannedStudents([]);
    showToast('Dynamic QR broadcast active! Rotating security token generated.', 'success');
  };

  const handleStopSession = () => {
    setActiveSession(null);
    setTimeLeftSeconds(0);
    showToast('QR session closed.', 'info');
  };

  const handleSimulateStudentScan = (student) => {
    if (scannedStudents.some((s) => s.id === student.id)) {
      showToast(`${student.first_name} has already scanned for this session.`, 'warning');
      return;
    }
    setScannedStudents((prev) => [
      { ...student, marked_at: new Date().toLocaleTimeString(), verified: true },
      ...prev,
    ]);
    showToast(`Verified & Marked Present: ${student.first_name} ${student.last_name}`, 'success');
  };

  const selectedCourseObj = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const isExpired = activeSession && timeLeftSeconds <= 0;

  return (
    <MainLayout title="Dynamic QR Session">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#182443] tracking-tight">Dynamic QR Session Broadcast</h2>
          <p className="text-xs text-slate-500">
            Generate rotating security QR codes for student classroom check-ins
          </p>
        </div>

        {activeSession && !isExpired && (
          <Button variant="danger" icon={Square} onClick={handleStopSession}>
            End Broadcast
          </Button>
        )}
      </div>

      {/* Security Protocol Banner */}
      <div className="p-4 rounded-2xl bg-[#182443] text-white border border-[#283966] shadow-md flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-[#39B99B] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-extrabold text-white uppercase tracking-wider">Auto-Rotating Security Nonces</p>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            ATTENDIQ QR tokens auto-rotate dynamic nonces every 15 seconds to prevent static screenshot sharing. Scanning validates active session TTL and student authorization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Configuration Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Session Configuration</CardTitle>
            <CardDescription>Setup live classroom broadcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Select Subject Course"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={!!activeSession && !isExpired}
              options={courses.map((c) => ({
                value: c.id,
                label: `${c.course_code} - ${c.title}`,
              }))}
            />

            <Select
              label="Session Duration"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              disabled={!!activeSession && !isExpired}
              options={[
                { value: 1, label: '1 Minute (Express Check-In)' },
                { value: 3, label: '3 Minutes (Standard)' },
                { value: 5, label: '5 Minutes (Extended)' },
                { value: 10, label: '10 Minutes' },
              ]}
            />

            {!activeSession || isExpired ? (
              <Button
                variant="primary"
                className="w-full py-3"
                icon={Play}
                onClick={handleStartSession}
              >
                Start Dynamic Broadcast
              </Button>
            ) : (
              <div className="p-4 bg-[#EBF8F5] border border-[#39B99B]/30 rounded-xl space-y-2 text-center">
                <Badge status="ACTIVE">BROADCASTING ACTIVE</Badge>
                <p className="text-xs font-bold text-[#2fa085] mt-1">
                  Active for {selectedCourseObj?.course_code}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic QR Display Box */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live QR Display Screen</CardTitle>
              <CardDescription>Project this screen to students during class</CardDescription>
            </div>
            {activeSession && !isExpired && (
              <span className="text-xs font-bold text-[#2fa085] bg-[#EBF8F5] px-3 py-1 rounded-full border border-[#39B99B]/30 flex items-center">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Nonce Refresh: {nonceTimer}s
              </span>
            )}
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-6">
            {activeSession && !isExpired ? (
              <>
                {/* Dynamic QR Matrix Box */}
                <div className="p-6 bg-white rounded-3xl border-4 border-[#182443] shadow-2xl animate-pulse-glow inline-block relative">
                  <div className="w-56 h-56 bg-[#182443] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#7067E8]/30 via-[#182443] to-[#39B99B]/20" />
                    <QrCode className="w-40 h-40 text-white relative z-10" />
                    <span className="text-[10px] font-mono text-[#928BFF] relative z-10 font-bold tracking-widest mt-1">
                      {qrNonce}
                    </span>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#7067E8] text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow">
                    Auto-Rotating Nonce Token
                  </div>
                </div>

                {/* Session Countdown & Stats */}
                <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
                  <div className="p-3 bg.slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Remaining</span>
                    <span className="text-2xl font-black text-[#182443] font-mono">
                      {Math.floor(timeLeftSeconds / 60)}:{String(timeLeftSeconds % 60).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Verified Scans</span>
                    <span className="text-2xl font-black text-[#2fa085] font-mono">
                      {scannedStudents.length}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Smartphone}
                    onClick={() => setIsSimulatingScan(true)}
                  >
                    Simulate Student Camera Scan
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-[#F4F3FF] rounded-full text-[#7067E8] mb-3">
                  <QrCode className="w-12 h-12" />
                </div>
                <h4 className="text-base font-bold text-[#182443]">No Active QR Broadcast</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Select course and duration, then click "Start Dynamic Broadcast" to begin classroom check-in session.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Scanned Roster Feed */}
      {activeSession && (
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Check-In Feed ({scannedStudents.length})</CardTitle>
            <CardDescription>Verified student scan arrivals</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {scannedStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                Waiting for student scans... Verified devices will appear live here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {scannedStudents.map((st, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF8F5] text-[#2fa085] flex items-center justify-center font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#182443]">
                          {st.first_name} {st.last_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{st.roll_number || '2026-CS-001'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-[#2fa085] bg-[#EBF8F5] px-2.5 py-0.5 rounded-full border border-[#39B99B]/30">
                        PRESENT
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{st.marked_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student QR Scan Simulation Modal */}
      <Modal
        isOpen={isSimulatingScan}
        onClose={() => setIsSimulatingScan(false)}
        title="Simulate Student Camera Scan"
        description="Select a student device to test QR token verification"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Click on any student below to simulate scanning the rotating token (<span className="font-mono text-[#7067E8] font-bold">{qrNonce}</span>):
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {students.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  handleSimulateStudentScan(st);
                  setIsSimulatingScan(false);
                }}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-[#F4F3FF] border border-slate-200 text-left flex items-center justify-between transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-[#182443]">
                    {st.first_name} {st.last_name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">{st.roll_number}</p>
                </div>
                <span className="text-xs font-bold text-[#7067E8]">Scan & Register</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
