import React from 'react';
import { Target, Eye, Shield, Lightbulb, Compass, Award, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const coreValues = [
    { title: 'Innovation', desc: 'Pioneering cutting-edge approaches in software and intelligent systems.', icon: Lightbulb },
    { title: 'Creativity', desc: 'Crafting elegant, human-centered digital experiences and product architectures.', icon: Compass },
    { title: 'Excellence', desc: 'Delivering robust, scalable, and meticulously tested technology solutions.', icon: Award },
    { title: 'Integrity', desc: 'Maintaining uncompromising transparency, security standards, and ethical practices.', icon: Shield },
    { title: 'Collaboration', desc: 'Fostering collective growth with founders, industry partners, and trainees.', icon: Target },
    { title: 'Continuous Learning', desc: 'Evolving relentlessly alongside the fast-paced frontiers of AI and cloud tech.', icon: Eye },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F5F8FF] border-b border-[#D0D5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-[#155EEF] text-xs font-semibold uppercase tracking-wider mb-3">
            About OmedanTech
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Empowering Ideas Through Technology.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#344054] leading-relaxed">
            OmedanTech is a technology-focused firm committed to transforming ideas into digital
            solutions, helping organizations develop innovative products, and equipping aspiring
            technology professionals with relevant technical skills.
          </p>
          <div className="mt-6">
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <span>Discover OmedanTech</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Mission & Vision Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 border border-[#D0D5DD]/80 shadow-xs hover:border-[#155EEF]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#155EEF] mb-6 border border-blue-100">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#101828] mb-3">Our Mission</h3>
            <p className="text-base text-[#344054] leading-relaxed">
              To empower individuals and businesses through technology innovation, practical
              training, and reliable digital solutions.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 border border-[#D0D5DD]/80 shadow-xs hover:border-[#E63946]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#E63946] mb-6 border border-red-100">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#101828] mb-3">Our Vision</h3>
            <p className="text-base text-[#344054] leading-relaxed">
              To become a trusted technology solution center for software engineering, AI
              innovation, and digital skills development.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-[#101828]">Our Core Values</h3>
            <p className="text-xs text-[#344054] mt-1">Guiding our culture, engineering rigor, and student mentoring</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white rounded-xl p-6 border border-[#D0D5DD] shadow-2xs hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#F5F8FF] group-hover:bg-blue-100/80 flex items-center justify-center text-[#155EEF] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-[#101828]">{val.title}</h4>
                  </div>
                  <p className="text-xs text-[#344054] leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
