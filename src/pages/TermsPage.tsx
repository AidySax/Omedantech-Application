import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Logo } from '../components/Logo';

export const TermsPage: React.FC = () => {
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
            Terms & Conditions of Training
          </h1>
          <p className="text-xs text-gray-500 mt-1">Effective Date: October 2026 &bull; OmedanTech Tech Starthub</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#344054] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">1. Scope of Training & Admissions</h2>
            <p>
              OmedanTech Tech Starthub provides professional technology training, software engineering mentorship, AI skills instruction, and product development workshops. Enrollment in any training track is subject to admissions review, seat availability, and adherence to our code of conduct.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">2. Accuracy of Applicant Information</h2>
            <p>
              All trainees and prospective applicants must provide accurate, complete, and verifiable information during account registration and application submission. Supplying misleading academic qualifications or identity details may result in immediate revocation of admission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">3. Intellectual Property & Course Materials</h2>
            <p>
              Curricula, lab exercises, software starter templates, and instructional media developed by OmedanTech are the proprietary intellectual property of OmedanTech. Trainees retain complete ownership over original software applications and projects developed during their training.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#101828] mb-2">4. Code of Conduct & Hub Facility Use</h2>
            <p>
              Trainees accessing our physical starthub premises or virtual discord/slack channels agree to maintain mutual professional respect, collaborative integrity, and responsible use of computing resources.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
