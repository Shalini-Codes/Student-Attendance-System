import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('teacher@apex.edu');
  const [password, setPassword] = useState('teacher123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState('TEACHER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email address and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      showToast(`Welcome to ATTENDIQ, ${res.user.first_name}! (${res.user.role})`, 'success');
      if (res.user.role === 'STUDENT') {
        navigate('/my-attendance');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    showToast('Google sign-in is a UI demo. Real Google authentication is not configured.', 'info');
  };

  const handleRoleSelect = (roleType) => {
    setActiveRoleTab(roleType);
    if (roleType === 'TEACHER') {
      setEmail('teacher@apex.edu');
      setPassword('teacher123');
    } else if (roleType === 'STUDENT') {
      setEmail('alex.wright@student.apex.edu');
      setPassword('student123');
    } else if (roleType === 'ADMIN') {
      setEmail('admin@apex.edu');
      setPassword('admin1234');
    }
    setError('');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    showToast(`Password recovery link dispatched to ${forgotEmail}`, 'info');
    setForgotModalOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: ATTENDIQ Brand Showcase Panel */}
        <div className="lg:col-span-5 bg-[#182443] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow Spheres */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#7067E8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-[#39B99B]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7067E8] to-[#928BFF] flex items-center justify-center text-white font-extrabold shadow-lg ring-2 ring-[#7067E8]/40">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white leading-none">
                  ATTEND<span className="text-[#7067E8]">IQ</span>
                </h1>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                  Smart Campus Platform
                </span>
              </div>
            </div>
          </div>

          {/* Center Showcase Info */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7067E8]/20 text-[#928BFF] border border-[#7067E8]/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Next-Gen Attendance Tech
              </span>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                Automated Roster & Smart QR Attendance
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Streamline classroom attendance tracking, prevent proxies with dynamic rotating tokens, and monitor student eligibility.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#39B99B] shrink-0" />
                <span>Teacher-Controlled Roster Entry</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#39B99B] shrink-0" />
                <span>Auto-Rotating Dynamic QR Code Nonce</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#39B99B] shrink-0" />
                <span>Real-Time Shortage Alerts (&lt;75%)</span>
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="relative z-10 pt-4 border-t border-[#26355d] text-[11px] text-slate-400 font-mono">
            Apex Institute Campus Deployment v2.4
          </div>
        </div>

        {/* Right Side: Modern Login Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h3 className="text-xl font-bold text-[#182443] tracking-tight">Sign In to ATTENDIQ</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your academic role to auto-fill sample credentials for presentation demo.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="mb-5 p-1 bg-slate-100 rounded-2xl grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleRoleSelect('TEACHER')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeRoleTab === 'TEACHER'
                    ? 'bg-white text-[#7067E8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teacher Demo
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('STUDENT')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeRoleTab === 'STUDENT'
                    ? 'bg-white text-[#7067E8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeRoleTab === 'ADMIN'
                    ? 'bg-white text-[#7067E8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Demo
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              <Input
                label="Academic Email Address"
                type="email"
                icon={Mail}
                placeholder="teacher@apex.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-semibold text-[#7067E8] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3"
                isLoading={isLoading}
                icon={ArrowRight}
              >
                Enter ATTENDIQ Platform
              </Button>
            </form>

            {/* Subtle Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-extrabold uppercase tracking-widest">
                <span className="bg-white px-3 text-slate-400">OR</span>
              </div>
            </div>

            {/* Official Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700 text-xs font-bold flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-xs active:bg-slate-100 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center text-slate-600">
              <ShieldCheck className="w-4 h-4 text-[#39B99B] mr-1.5" />
              Frontend Demo Mode Active
            </span>
            <span className="font-mono text-slate-400">Sample Credentials Pre-Filled</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        description="Enter your registered academic email address to receive password reset link."
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <Input
            label="Academic Email"
            type="email"
            icon={KeyRound}
            placeholder="user@apex.edu"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Dispatch Link</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
