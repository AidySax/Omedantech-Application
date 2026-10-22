import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  FileText,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TrainingProgram, Application } from '../types';

const MAX_SHOWCASE_PHOTO_SIZE = 1024 * 1024;
const ACCEPTED_SHOWCASE_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ApplicationApplyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, token, setRedirectIntent } = useAuth();
  const navigate = useNavigate();

  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);

  // Stepper: 1: Background & Experience, 2: Statement & Screening, 3: Review & Certification
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree");
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [reasonForApplying, setReasonForApplying] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [availability, setAvailability] = useState('Weekday Evenings & Weekends');
  const [screeningAnswers, setScreeningAnswers] = useState({
    priorCodingExperience: 'Basic familiarity',
    weeklyHoursCommitment: '10-15 hours',
    hasPersonalLaptop: 'Yes, modern laptop available',
  });
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [showcaseConsent, setShowcaseConsent] = useState(false);
  const [showcasePhoto, setShowcasePhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Program
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/programs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Program not found');
        return res.json();
      })
      .then((data) => {
        setProgram(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Failed to load program');
        setLoading(false);
      });
  }, [slug]);

  // Mandatory Authentication Interceptor
  useEffect(() => {
    if (!loading && !user && slug) {
      setRedirectIntent(`/training/${slug}/apply`);
    }
  }, [loading, user, slug, setRedirectIntent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#155EEF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-600 font-medium">Verifying program registration status...</p>
        </div>
      </div>
    );
  }

  // Not authenticated view
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#D0D5DD] shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-[#E63946] flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#101828]">Authentication Required</h2>
          <p className="mt-2 text-xs text-[#344054] leading-relaxed">
            In accordance with OmedanTech training admissions protocol, all prospective trainees
            must authenticate or create an account before filing an official application.
          </p>

          {program && (
            <div className="my-5 p-3.5 bg-[#F5F8FF] rounded-xl text-left border border-blue-100">
              <span className="text-[11px] font-bold text-[#155EEF] uppercase">Selected Program:</span>
              <h4 className="text-sm font-bold text-[#101828] mt-0.5">{program.title}</h4>
              <p className="text-[11px] text-gray-500">{program.duration} &bull; {program.format}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Sign In to Continue Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-bold text-[#155EEF] bg-[#F5F8FF] hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <span>Create New Trainee Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !program) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200">
          <AlertCircle className="w-12 h-12 text-[#E63946] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Program Unavailable</h3>
          <p className="text-xs text-gray-600 mt-2">{errorMsg || 'Program does not exist or enrollment has expired.'}</p>
          <Link
            to="/#training"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#155EEF] rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Training Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  // Application Submission Complete Confirmation
  if (submittedApp) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 sm:p-10 border border-[#D0D5DD] shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Application Received Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-1">
            Welcome to the Selection Process
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#344054] leading-relaxed">
            Thank you, <strong className="text-gray-900">{submittedApp.applicantName}</strong>. Your training application for <strong className="text-[#155EEF]">{submittedApp.programTitle}</strong> has been logged into our admissions database.
          </p>

          {/* Reference Card */}
          <div className="my-6 p-5 bg-[#F5F8FF] rounded-xl border border-blue-100 text-left space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100">
              <span className="text-xs text-gray-500">Official Reference No</span>
              <span className="font-mono text-sm font-bold text-[#E63946]">
                {submittedApp.referenceNo}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Status</span>
              <span className="font-bold text-emerald-600">{submittedApp.status}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Submission Date</span>
              <span className="text-gray-800">
                {new Date(submittedApp.submissionDate).toLocaleDateString()} at{' '}
                {new Date(submittedApp.submissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            A confirmation has been recorded in your applicant profile. You can monitor progress, reviewer updates, and cohort schedules in your applicant dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:flex-1 py-3 px-4 rounded-lg text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 transition-colors shadow-sm"
            >
              Go to Applicant Dashboard
            </Link>
            <Link
              to="/#training"
              className="w-full sm:flex-1 py-3 px-4 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Explore Other Tracks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Application Submission Handler
  const handleSubmitApplication = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      let showcasePhotoData = '';
      if (showcaseConsent && showcasePhoto) {
        showcasePhotoData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === 'string'
            ? resolve(reader.result)
            : reject(new Error('Unable to read the selected showcase photo.'));
          reader.onerror = () => reject(new Error('Unable to read the selected showcase photo.'));
          reader.readAsDataURL(showcasePhoto);
        });
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          programId: program.id,
          educationLevel,
          experienceLevel,
          reasonForApplying,
          learningGoals,
          availability,
          screeningAnswers,
          declarationAccepted,
          showcaseConsent,
          ...(showcasePhotoData ? { showcasePhoto: showcasePhotoData } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit application.');
        setIsSubmitting(false);
      } else {
        setSubmittedApp(data.application);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to="/#training"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#155EEF] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Training Catalog</span>
        </Link>

        {/* Selected Program Header Banner */}
        <div className="bg-[#101828] text-white rounded-2xl p-6 sm:p-8 mb-8 border border-[#155EEF]/30 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-[#155EEF] uppercase tracking-wider">
              Admissions Portal &bull; {program.category}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Applications Open
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold">{program.title}</h1>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#155EEF]" />
              <span>{program.duration} ({program.format})</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E63946]" />
              <span>Starts {program.startDate}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Applicant: {user.firstName} {user.lastName}</span>
            </div>
          </div>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-between mb-8 bg-white p-3 rounded-xl border border-[#D0D5DD] text-xs">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'font-bold text-[#155EEF]' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-500'}`}>
              1
            </span>
            <span className="hidden sm:inline">Background & Skills</span>
          </div>
          <span className="text-gray-300">&rarr;</span>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'font-bold text-[#155EEF]' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-500'}`}>
              2
            </span>
            <span className="hidden sm:inline">Goals & Screening</span>
          </div>
          <span className="text-gray-300">&rarr;</span>
          <div className={`flex items-center gap-2 ${step === 3 ? 'font-bold text-[#155EEF]' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-500'}`}>
              3
            </span>
            <span className="hidden sm:inline">Review & Submit</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#D0D5DD] shadow-xs">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Background & Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Step 1: Background & Experience</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tell us about your educational status and current technical familiarity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Highest Educational Attainment
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                  >
                    <option value="High School / Secondary">High School / Secondary Diploma</option>
                    <option value="Undergraduate Student">Current Undergraduate Student</option>
                    <option value="Bachelor's Degree">Bachelor&apos;s Degree / HND</option>
                    <option value="Postgraduate / Master's">Postgraduate / Master&apos;s Degree</option>
                    <option value="Self-Taught / Professional">Self-Taught / Practicing Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Current Skill / Technical Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                  >
                    <option value="Absolute Beginner">Absolute Beginner (Starting from zero)</option>
                    <option value="Beginner">Beginner (Basic concepts / self-study)</option>
                    <option value="Intermediate">Intermediate (Built small projects)</option>
                    <option value="Advanced">Advanced (Transitioning or upskilling)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Preferred Availability for Class Sessions
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                >
                  <option value="Weekday Evenings & Weekends">Weekday Evenings & Weekends</option>
                  <option value="Full-Time Weekday Intensive">Full-Time Weekday Intensive</option>
                  <option value="Saturday Only Intensive">Saturday Only Intensive</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-lg text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 transition-colors"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Screening */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Step 2: Reason for Applying & Goals</h3>
                <p className="text-xs text-gray-500 mt-0.5">Help our admissions review team understand your motivation.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Why do you wish to join this program at OmedanTech? <span className="text-[#E63946]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reasonForApplying}
                  onChange={(e) => setReasonForApplying(e.target.value)}
                  placeholder="Explain why this specific track is important for your personal growth or career journey..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  What are your key learning goals upon completing this cohort? <span className="text-[#E63946]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="e.g. Build end-to-end applications, gain confidence with AI prompting, transition into tech..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              {/* Screening Questions */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Admissions Screening Questions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Weekly Study Hours Commitment
                    </label>
                    <select
                      value={screeningAnswers.weeklyHoursCommitment}
                      onChange={(e) =>
                        setScreeningAnswers({ ...screeningAnswers, weeklyHoursCommitment: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#D0D5DD] rounded-lg"
                    >
                      <option value="6-10 hours">6-10 hours per week</option>
                      <option value="10-15 hours">10-15 hours per week (Recommended)</option>
                      <option value="15-20 hours">15-20+ hours per week (Intensive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Do you have a personal laptop for hands-on sessions?
                    </label>
                    <select
                      value={screeningAnswers.hasPersonalLaptop}
                      onChange={(e) =>
                        setScreeningAnswers({ ...screeningAnswers, hasPersonalLaptop: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#D0D5DD] rounded-lg"
                    >
                      <option value="Yes, modern laptop available">Yes, modern laptop available</option>
                      <option value="Yes, shared laptop">Yes, shared family laptop</option>
                      <option value="Requesting starthub lab access">Requesting starthub lab access</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  &larr; Back to Step 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!reasonForApplying.trim() || !learningGoals.trim()) {
                      setErrorMsg('Please complete both the reason for applying and learning goals fields.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(3);
                  }}
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-lg text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 transition-colors"
                >
                  <span>Review Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Step 3: Review & Final Submission</h3>
                <p className="text-xs text-gray-500 mt-0.5">Please review your information carefully before submitting.</p>
              </div>

              <div className="bg-[#F5F8FF] rounded-xl p-5 border border-blue-100 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-blue-100">
                  <div>
                    <span className="text-gray-500 block">Applicant Name</span>
                    <strong className="text-gray-900">{user.firstName} {user.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Applicant Email</span>
                    <strong className="text-gray-900">{user.email}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Education Status</span>
                    <strong className="text-gray-900">{educationLevel}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Skill Level</span>
                    <strong className="text-gray-900">{experienceLevel}</strong>
                  </div>
                </div>

                {showcaseConsent && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                    Your trainee showcase profile will be submitted for administrator review and will remain private unless approved.
                  </p>
                )}

                <div>
                  <span className="text-gray-500 block font-semibold mb-0.5">Motivation Statement:</span>
                  <p className="text-gray-700 bg-white p-2.5 rounded border border-gray-200">{reasonForApplying}</p>
                </div>

                <div>
                  <span className="text-gray-500 block font-semibold mb-0.5">Learning Goals:</span>
                  <p className="text-gray-700 bg-white p-2.5 rounded border border-gray-200">{learningGoals}</p>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#155EEF] focus:ring-[#155EEF]"
                  />
                  <span className="text-xs text-gray-800 leading-snug">
                    <strong>Declaration of Accuracy:</strong> I hereby certify that the information provided in this application is accurate and true to the best of my knowledge. I understand that submitting false details may invalidate my application.
                  </span>
                </label>
              </div>

              <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showcaseConsent}
                    onChange={(event) => {
                      setShowcaseConsent(event.target.checked);
                      if (!event.target.checked) setShowcasePhoto(null);
                    }}
                    className="mt-0.5 rounded border-gray-300 text-[#155EEF] focus:ring-[#155EEF]"
                  />
                  <span className="text-xs text-gray-700 leading-snug">
                    I agree that my name, program interest, learning goal, and optional photo may be considered for the public trainee showcase. My entry will remain hidden unless an administrator approves it.
                  </span>
                </label>
                {showcaseConsent && (
                  <div>
                    <label htmlFor="showcase-photo" className="block text-xs font-semibold text-gray-700 mb-1">
                      Optional showcase photo
                    </label>
                    <input
                      id="showcase-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        if (file && !ACCEPTED_SHOWCASE_PHOTO_TYPES.includes(file.type)) {
                          setErrorMsg('Choose a JPEG, PNG, or WebP showcase photo.');
                          event.target.value = '';
                          setShowcasePhoto(null);
                          return;
                        }
                        if (file && file.size > MAX_SHOWCASE_PHOTO_SIZE) {
                          setErrorMsg('Showcase photos must be 1 MB or smaller.');
                          event.target.value = '';
                          setShowcasePhoto(null);
                          return;
                        }
                        setErrorMsg('');
                        setShowcasePhoto(file);
                      }}
                      className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#155EEF]"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">JPEG, PNG, or WebP, up to 1 MB. Your private passport photo is not used.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  &larr; Back to Step 2
                </button>

                <button
                  type="button"
                  disabled={!declarationAccepted || isSubmitting}
                  onClick={handleSubmitApplication}
                  className={`inline-flex items-center gap-2 py-3 px-7 rounded-lg text-xs font-bold text-white transition-all shadow-md ${
                    declarationAccepted && !isSubmitting
                      ? 'bg-[#E63946] hover:bg-[#C1121F] cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Submit Official Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
