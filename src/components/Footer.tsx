import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101828] text-gray-300 pt-16 pb-12 border-t border-[#155EEF]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-gray-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" showSlogan={true} />
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed mt-3">
              OmedanTech Tech Starthub is a technology innovation firm focused on software engineering,
              artificial intelligence, digital product development, cloud infrastructure, cybersecurity,
              and professional technology training.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#155EEF]" />
                <a href="mailto:aidytech01@gmail.com" className="hover:text-white transition-colors">
                  aidytech01@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E63946]" />
                <span>+234 7040 297 320</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#155EEF]" />
                <span> <strong>OmedanTech Starthub,</strong><br/> 
                Opposit Comprehensive Commercial Secondary School, <br />
                 Ukana West, Essien Udim L.G.A </span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="/#about" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">Technology Services</a>
              </li>
              <li>
                <a href="/#training" className="hover:text-white transition-colors">Training Catalog</a>
              </li>
              <li>
                <a href="/#team" className="hover:text-white transition-colors">Management Team</a>
              </li>
              <li>
                <a href="/#trainees" className="hover:text-white transition-colors">Trainee Showcase</a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-white transition-colors">Contact & Inquiries</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Technology Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="/#services" className="hover:text-white transition-colors">Product Discovery & Strategy</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">Software & App Development</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">AI Prompting & LLM Interaction</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">AI Development & Machine Learning</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">Cloud & Infrastructure</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">Cybersecurity & Compliance</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors">IT Staff Augmentation</a>
              </li>
            </ul>
          </div>

          {/* Col 5: Training & Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Trainee Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="/#training" className="hover:text-[#E63946] transition-colors font-medium flex items-center gap-1">
                  <span>Apply for Training</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Create Trainee Account</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Applicant Login</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Applicant Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-xs text-gray-500">Administrator Console</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with mandatory credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <span>&copy; 2026 OmedanTech Tech Starthub. All rights reserved.</span>
            <span className="hidden sm:inline text-gray-700">|</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline text-gray-700">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          {/* Exact Required Developer Credit */}
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="text-gray-400">Developed by</span>
            <span className="text-white font-semibold">OmedanTech Team</span>
            <span className="text-[#E63946] font-bold">2026.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
