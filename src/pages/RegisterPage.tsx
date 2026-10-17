import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, redirectIntent, setRedirectIntent } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy to register.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      termsAccepted: formData.termsAccepted,
    });
    setIsSubmitting(false);

    if (result.success) {
      if (redirectIntent) {
        const dest = redirectIntent;
        setRedirectIntent(null);
        navigate(dest);
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo showSlogan={true} className="justify-center" />
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#101828]">
          Create your Trainee Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#344054]">
          Register to browse and submit official training applications with OmedanTech.
        </p>

        {redirectIntent && (
          <div className="mt-4 p-3 bg-red-50 border border-[#E63946]/30 rounded-lg text-xs text-[#E63946] font-medium text-left">
            <strong>Application Requirement:</strong> Trainee account registration is required before your training application can be officially reviewed and tracked.
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#D0D5DD] rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Samuel"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Bassey"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address <span className="text-[#E63946]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password <span className="text-[#E63946]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password <span className="text-[#E63946]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-0.5 rounded border-gray-300 text-[#155EEF] focus:ring-[#155EEF]"
                />
                <span className="text-xs text-gray-600 leading-snug">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#155EEF] underline">
                    Terms & Conditions
                  </Link>{' '}
                  and acknowledge the{' '}
                  <Link to="/privacy-policy" className="text-[#155EEF] underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-sm text-xs sm:text-sm font-bold text-white bg-[#E63946] hover:bg-[#C1121F] focus:outline-none transition-colors cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#155EEF] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
