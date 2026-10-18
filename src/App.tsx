import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ApplicationApplyPage } from './pages/ApplicationApplyPage';
import { ApplicantDashboardPage } from './pages/ApplicantDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing & Core Anchors */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/services" element={<LandingPage />} />
          <Route path="/team" element={<LandingPage />} />
          <Route path="/trainees" element={<LandingPage />} />
          <Route path="/training" element={<LandingPage />} />
          <Route path="/contact" element={<LandingPage />} />

          {/* Authentication & Security */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />

          {/* Training Application Submission (Mandatory Auth Enforced) */}
          <Route path="/training/:slug/apply" element={<ApplicationApplyPage />} />
          <Route path="/training/:slug" element={<ApplicationApplyPage />} />

          {/* Applicant & Admin Protected Portals */}
          <Route path="/dashboard/*" element={<ApplicantDashboardPage />} />
          <Route path="/admin/*" element={<AdminDashboardPage />} />
          <Route path="/staff/*" element={<StaffDashboardPage />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
