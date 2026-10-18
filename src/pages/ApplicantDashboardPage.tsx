import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Shield,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Application, ApplicationStatus, ApplicationStatusHistory } from '../types';

export const ApplicantDashboardPage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<{
    application: Application;
    history: ApplicationStatusHistory[];
  } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [changingPass, setChangingPass] = useState(false);

  const fetchMyApplications = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/applications/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyApplications();
  }, [token]);

  const viewAppDetails = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedApp(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async (appId: string) => {
    if (!confirm('Are you sure you wish to withdraw this application?')) return;
    try {
      const res = await fetch(`/api/applications/${appId}/withdraw`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchMyApplications();
        if (selectedApp) setSelectedApp(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    setChangingPass(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassMsg({ text: data.error || 'Failed to update password', error: true });
      } else {
        setPassMsg({ text: 'Password successfully updated!', error: false });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch {
      setPassMsg({ text: 'Network error.', error: true });
    } finally {
      setChangingPass(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Submitted</span>;
      case 'Under Review':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Under Review</span>;
      case 'Shortlisted':
        return <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Shortlisted</span>;
      case 'Accepted':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Accepted</span>;
      case 'Rejected':
        return <span className="text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Rejected</span>;
      case 'Withdrawn':
        return <span className="text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Withdrawn</span>;
      default:
        return <span className="text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F8FF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D0D5DD] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] text-xs font-semibold uppercase tracking-wider mb-2">
              Trainee Admissions Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Registered email: <strong className="text-gray-800">{user.email}</strong> &bull; Member since{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/#training"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Programs</span>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-[#E63946] bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: My Applications */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D0D5DD] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#101828]">My Training Applications</h2>
                  <p className="text-xs text-gray-500">Track admission reviews, status updates, and reference numbers.</p>
                </div>
                <span className="text-xs font-bold text-[#155EEF] bg-[#F5F8FF] px-3 py-1 rounded-full border border-blue-100">
                  {applications.length} {applications.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  Loading your applications...
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl p-6">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-800">No applications filed yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    You have not submitted an application for any OmedanTech training track yet. Browse the catalog to start!
                  </p>
                  <Link
                    to="/#training"
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#E63946] hover:bg-[#C1121F] rounded-lg shadow-sm"
                  >
                    <span>Browse Training Catalog</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-xl border border-gray-200 hover:border-[#155EEF] transition-all bg-[#F5F8FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#155EEF]">
                            {app.referenceNo}
                          </span>
                          {getStatusBadge(app.status)}
                        </div>
                        <h3 className="text-base font-bold text-[#101828]">{app.programTitle}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Submitted {new Date(app.submissionDate).toLocaleDateString()}
                          </span>
                          <span>&bull;</span>
                          <span>Level: {app.experienceLevel}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => viewAppDetails(app.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-[#155EEF] bg-white border border-[#155EEF]/30 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Review File</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {app.status !== 'Withdrawn' && app.status !== 'Accepted' && (
                          <button
                            type="button"
                            onClick={() => handleWithdraw(app.id)}
                            className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#E63946] hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#155EEF]">
                          {selectedApp.application.referenceNo}
                        </span>
                        {getStatusBadge(selectedApp.application.status)}
                      </div>
                      <h3 className="text-xl font-extrabold text-[#101828] mt-1">
                        {selectedApp.application.programTitle}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-1 rounded text-gray-400 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="py-4 space-y-4 text-xs">
                    {/* Reviewer remarks if any */}
                    {selectedApp.application.reviewerNotes && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="font-bold text-[#155EEF] uppercase block mb-1">
                          Admissions Committee Notes
                        </span>
                        <p className="text-gray-700 leading-relaxed italic">
                          &ldquo;{selectedApp.application.reviewerNotes}&rdquo;
                        </p>
                        {selectedApp.application.reviewedBy && (
                          <span className="text-[11px] text-gray-500 mt-1 block">
                            — Reviewed by {selectedApp.application.reviewedBy}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-gray-500 block">Education</span>
                        <strong className="text-gray-900">{selectedApp.application.educationLevel}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Experience</span>
                        <strong className="text-gray-900">{selectedApp.application.experienceLevel}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Availability</span>
                        <strong className="text-gray-900">{selectedApp.application.availability}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Laptop Availability</span>
                        <strong className="text-gray-900">{selectedApp.application.screeningAnswers.hasPersonalLaptop}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Reason for Applying</span>
                      <p className="text-gray-600 bg-white p-3 rounded border border-gray-200 leading-relaxed">
                        {selectedApp.application.reasonForApplying}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Key Learning Goals</span>
                      <p className="text-gray-600 bg-white p-3 rounded border border-gray-200 leading-relaxed">
                        {selectedApp.application.learningGoals}
                      </p>
                    </div>

                    {/* Status Audit History */}
                    <div className="pt-2">
                      <span className="font-bold text-gray-800 uppercase block mb-2">
                        Status Timeline & Audit Trail
                      </span>
                      <div className="space-y-2 border-l-2 border-blue-200 pl-3">
                        {selectedApp.history.map((hist) => (
                          <div key={hist.id} className="text-[11px] text-gray-600">
                            <span className="font-semibold text-gray-900">{hist.newStatus}</span> &bull;{' '}
                            <span>{new Date(hist.timestamp).toLocaleString()}</span>
                            {hist.notes && <p className="text-gray-500 mt-0.5">{hist.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column: Profile & Security */}
          <div className="lg:col-span-4 space-y-6">
            {/* Account Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs">
              <h3 className="text-sm font-bold text-[#101828] mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#155EEF]" />
                Trainee Profile
              </h3>
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Name</span>
                  <span className="font-semibold text-gray-900">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="font-semibold text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-semibold text-gray-900">{user.phone || 'Not added'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Email Verification</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs">
              <h3 className="text-sm font-bold text-[#101828] mb-3 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#E63946]" />
                Security & Password
              </h3>

              {passMsg && (
                <div
                  className={`p-2.5 rounded-lg text-xs mb-3 flex items-center gap-1.5 ${
                    passMsg.error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {passMsg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{passMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#D0D5DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#D0D5DD] rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPass}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-[#101828] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  {changingPass ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
