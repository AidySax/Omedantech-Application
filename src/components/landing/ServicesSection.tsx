import React, { useState, useEffect } from 'react';
import {
  Compass,
  Code2,
  Sparkles,
  BrainCircuit,
  Cloud,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  X,
  Send,
} from 'lucide-react';
import { ServiceItem } from '../../types';

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch((err) => console.error('Failed to load services:', err));
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#155EEF]" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-[#E63946]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#155EEF]" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-6 h-6 text-[#E63946]" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-[#155EEF]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#E63946]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#155EEF]" />;
      default:
        return <Code2 className="w-6 h-6 text-[#155EEF]" />;
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-white border-b border-[#D0D5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] text-xs font-semibold uppercase tracking-wider mb-3">
            Our Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Technology Solutions for a Smarter Future.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#344054] leading-relaxed">
            From the discovery of a product idea to the deployment of secure, scalable digital
            systems, OmedanTech delivers technology expertise designed to help businesses and
            individuals grow.
          </p>
        </div>

        {/* 7 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isRedAccent = index % 2 === 1;
            return (
              <div
                key={service.id}
                className="group relative bg-[#F5F8FF]/50 rounded-2xl p-7 border border-[#D0D5DD] hover:border-[#155EEF] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon and Human Editorial Number */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isRedAccent
                          ? 'bg-red-50 border border-red-100 group-hover:bg-red-100'
                          : 'bg-blue-50 border border-blue-100 group-hover:bg-blue-100'
                      }`}
                    >
                      {getServiceIcon(service.icon)}
                    </div>
                    <span className="text-xs font-mono font-semibold text-gray-400">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#101828] group-hover:text-[#155EEF] transition-colors mb-2.5">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-[#344054] leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  {/* 3 or 4 Key Offerings */}
                  <div className="space-y-2 mb-6 border-t border-gray-200/60 pt-4">
                    {service.keyOfferings.slice(0, 4).map((offering, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isRedAccent ? 'text-[#E63946]' : 'text-[#155EEF]'
                          }`}
                        />
                        <span className="text-xs text-gray-700 font-medium leading-tight">
                          {offering}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learn More Button */}
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-[#101828] group-hover:text-white bg-white group-hover:bg-[#155EEF] border border-[#D0D5DD] group-hover:border-[#155EEF] rounded-lg transition-all shadow-2xs cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#155EEF]">
                {getServiceIcon(selectedService.icon)}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#155EEF]">
                  OmedanTech Technology Service
                </span>
                <h3 className="text-xl font-extrabold text-[#101828]">{selectedService.title}</h3>
              </div>
            </div>

            <div className="space-y-4 my-4 text-sm text-[#344054] leading-relaxed">
              <p>{selectedService.fullDescription}</p>
              
              <div className="bg-[#F5F8FF] p-4 rounded-xl border border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101828] mb-3">
                  Scope of Technical Capabilities
                </h4>
                <ul className="space-y-2">
                  {selectedService.keyOfferings.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <a
                href="#contact"
                onClick={() => setSelectedService(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Consultation</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
