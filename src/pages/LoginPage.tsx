import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, redirectIntent, setRedirectIntent } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else if (result.role === 'staff') {
        navigate('/staff');
      } else if (redirectIntent) {
        const dest = redirectIntent;
        setRedirectIntent(null);
        navigate(dest);
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo showSlogan={true} className="justify-center" />
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#101828]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#344054]">
          Secure sign in for trainees, staff, and administrators.
        </p>

        {redirectIntent && (
          <div className="mt-4 p-3 bg-blue-50 border border-[#155EEF]/30 rounded-lg text-xs text-[#155EEF] font-medium text-left">
            <strong>Mandatory Authentication:</strong> Please log in or create an account to submit your training application. You will be automatically redirected to your chosen program upon sign in.
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#D0D5DD] rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#155EEF] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-bold text-white bg-[#155EEF] hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer"
            >
              {isSubmitting ? <span>Authenticating...</span> : <span>Sign in to OmedanTech</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600">
            Staff and administrator accounts are created by an administrator. Trainees can create an account below.
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#E63946] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
