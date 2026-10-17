import React, { useState, useEffect } from 'react';
import { UserCheck, Shield } from 'lucide-react';
import { TeamMember } from '../../types';

export const TeamSection: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch('/api/team')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeamMembers(data);
      })
      .catch((err) => console.error('Failed to load team:', err));
  }, []);

  return (
    <section id="team" className="py-20 lg:py-28 bg-[#F5F8FF] border-b border-[#D0D5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#E63946] text-xs font-semibold uppercase tracking-wider mb-3">
            Leadership & Engineering
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Meet the Minds Behind OmedanTech.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#344054] leading-relaxed">
            Our team brings together engineering, design, customer care, and leadership to support
            innovation and deliver technology solutions.
          </p>
        </div>

        {/* 5 Profiles: 3 on top row, 2 centered on second row */}
        <div className="space-y-8">
          {/* Top Row: 3 members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.slice(0, 3).map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>

          {/* Bottom Row: 2 members centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamMembers.slice(3, 5).map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Replacement Notice Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 italic">
            Note: Team member profiles are subject to change as we continue to grow and evolve.
          </p>
        </div>
      </div>
    </section>
  );
};

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#D0D5DD] shadow-xs hover:border-[#155EEF]/50 hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Portrait Aspect Ratio */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {!imgError && member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={`${member.name} - ${member.position}`}
            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Styled Fallback Container (Zero-Broken-Image Policy) */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-[#101828] text-white p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#155EEF] mb-3 border border-white/20">
              <UserCheck className="w-8 h-8 text-blue-300" />
            </div>
            <span className="text-sm font-bold">{member.name}</span>
            <span className="text-xs text-blue-200 mt-1">{member.position}</span>
          </div>
        )}

        {/* Clean Unboxed Position Kicker */}
        <div className="absolute bottom-3 left-3 bg-[#101828]/85 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-white text-[11px] font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF]" />
          <span>{member.position}</span>
        </div>
      </div>

      {/* Member Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-[#101828] group-hover:text-[#155EEF] transition-colors">
              {member.name}
            </h3>
            <span className="text-[11px] font-semibold text-[#E63946] shrink-0">
              {member.professionalTitle}
            </span>
          </div>
          <p className="text-xs text-[#344054] leading-relaxed mt-2.5">
            {member.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1 text-gray-600">
            <Shield className="w-3.5 h-3.5 text-[#155EEF]" />
            Verified Team Profile
          </span>
          <span className="text-[#155EEF] font-semibold">OmedanTech</span>
        </div>
      </div>
    </div>
  );
};
