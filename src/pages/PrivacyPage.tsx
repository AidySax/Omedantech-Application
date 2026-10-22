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
              OmedanTech collects information needed to create trainee accounts, process training applications, administer training, and respond to inquiries. This includes your name, email, phone number, passport photograph, educational status, and learning objectives.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">2. Passport Photograph</h2>
            <p>
              Trainee registration requires a passport photograph in JPEG, PNG, or WebP format. It is stored separately from public website images and is available only to authorized administrators for account and training administration. Do not upload an image unless you are authorized to provide it. You may contact us to request correction or deletion of your account and associated personal records.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">3. Trainee Showcase Authorization</h2>
            <p>
              During an application, you may separately consent to submit your display name, program interest, learning goal, and an optional showcase photo for consideration. The optional showcase photo is separate from your private registration passport photograph. A submitted profile remains hidden until an administrator approves it. You may contact us to request removal of your published spotlight.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">4. Storage & Confidentiality</h2>
            <p>
              Passport photographs are served only through an authenticated administrator endpoint and are not placed in public static assets. Passwords are stored as one-way hashes and cannot be viewed by administrators. We do not sell, rent, or share personal applicant data with third parties for commercial advertising.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">5. Contact Data Protection Officer</h2>
            <p>
              For privacy inquiries or data update requests, reach out to <a href="mailto:privacy@omedantech.com" className="text-[#155EEF] underline font-semibold">privacy@omedantech.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
