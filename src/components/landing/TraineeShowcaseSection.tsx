import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, User, GraduationCap } from 'lucide-react';
import { TraineeShowcase } from '../../types';

export const TraineeShowcaseSection: React.FC = () => {
  const [trainees, setTrainees] = useState<TraineeShowcase[]>([]);

  useEffect(() => {
    fetch('/api/trainees')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTrainees(data);
      })
      .catch((err) => console.error('Failed to load trainees:', err));
  }, []);

  return (
    <section id="trainees" className="py-20 lg:py-28 bg-white border-b border-[#D0D5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] text-xs font-semibold uppercase tracking-wider mb-3">
            Talent & Community
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Meet Our Future Innovators.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#344054] leading-relaxed">
            At OmedanTech, we encourage aspiring technology professionals to explore emerging fields,
            develop practical skills, and turn their curiosity into real-world capability.
          </p>
          <div className="mt-6">
            <a
              href="#training"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#E63946] hover:bg-[#C1121F] rounded-lg shadow-sm transition-all"
            >
              <span>Join the Next Training Cohort</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Trainees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainees.map((trainee) => (
            <TraineeCard key={trainee.id} trainee={trainee} />
          ))}
        </div>

        {/* Privacy & Transparency Notice */}
        <div className="mt-12 p-4 rounded-xl bg-[#F5F8FF] border border-blue-100 max-w-2xl mx-auto text-center text-xs text-gray-500">
          <p>
            <strong className="text-gray-700">Privacy & Cohort Transparency:</strong> Featured entries represent authorized applicant spotlights and demonstration profiles displaying program interests and learning goals. Participation does not imply completion or verified certification until graduated.
          </p>
        </div>
      </div>
    </section>
  );
};

const TraineeCard: React.FC<{ trainee: TraineeShowcase }> = ({ trainee }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#F5F8FF]/40 rounded-xl p-6 border border-[#D0D5DD] hover:border-[#155EEF] hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar / Portrait */}
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-2xs">
            {!imgError && trainee.photoUrl ? (
              <img
                src={trainee.photoUrl}
                alt={trainee.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white">
                <User className="w-6 h-6 text-blue-200" />
              </div>
            )}
          </div>

          {/* Name & Cohort */}
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-[#101828] truncate">{trainee.name}</h4>
            <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>{trainee.cohort}</span>
            </div>
          </div>
        </div>

        {/* Program of Interest */}
        <div className="mb-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Program Track
          </span>
          <span className="text-xs font-bold text-[#155EEF] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
            <span>{trainee.programInterest}</span>
          </span>
        </div>

        {/* Learning Goal */}
        <p className="text-xs text-[#344054] leading-relaxed italic bg-white p-3 rounded-lg border border-gray-200/80">
          &ldquo;{trainee.learningGoal}&rdquo;
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
        <span>Aspiring Professional</span>
        <span className="text-[#E63946] font-semibold">Active Interest</span>
      </div>
    </div>
  );
};
