import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Logo } from '../components/Logo';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F8FF] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#D0D5DD] shadow-xs">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Logo showSlogan={false} />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-4">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-xs text-gray-500 mt-1">Effective Date: October 2026 &bull; OmedanTech Tech Starthub</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#344054] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">1. Data Minimization & Collection</h2>
            <p>
              OmedanTech collects only information necessary to process user registration, training program applications, and inquiry communications. This includes your name, email, phone number, educational status, and learning objectives.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">2. Trainee Showcase Authorization</h2>
            <p>
              In accordance with strict privacy principles, trainee photographs, display names, and program goals are only published in our public showcase with explicit written or electronic consent. Trainees may request removal of their spotlight at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">3. Storage & Confidentiality</h2>
            <p>
              Application materials and personal credentials are stored in encrypted environments. We do not sell, rent, or share personal applicant data with third parties for commercial advertising.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">4. Contact Data Protection Officer</h2>
            <p>
              For privacy inquiries or data update requests, reach out to <a href="mailto:privacy@omedantech.com" className="text-[#155EEF] underline font-semibold">privacy@omedantech.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
