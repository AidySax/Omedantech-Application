import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Filter,
} from 'lucide-react';
import { TrainingProgram } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const TrainingCatalogSection: React.FC = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [selectedProgramModal, setSelectedProgramModal] = useState<TrainingProgram | null>(null);

  const { user, setRedirectIntent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/programs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data);
      })
      .catch((err) => console.error('Failed to load training programs:', err));
  }, []);

  const categories = ['All', ...new Set(programs.map((p) => p.category))];
  const formats = ['All', 'Hybrid', 'In-Person', 'Weekend Intensive'];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesFormat = formatFilter === 'All' || p.format === formatFilter;
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleApplyClick = (program: TrainingProgram) => {
    const targetUrl = `/training/${program.slug}/apply`;
    if (!user) {
      // Preserve application intent and redirect to login
      setRedirectIntent(targetUrl);
      navigate('/login');
    } else {
      navigate(targetUrl);
    }
  };

  return (
    <section id="training" className="py-20 lg:py-28 bg-[#F5F8FF] border-b border-[#D0D5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-[#155EEF] text-xs font-semibold uppercase tracking-wider mb-3">
            Training Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Choose Your Path. Build Your Future.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#344054] leading-relaxed">
            Explore technology training opportunities designed to help you develop practical
            skills, understand emerging technologies, and build confidence in your chosen field.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl p-5 border border-[#D0D5DD] shadow-xs mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search programs, curriculum or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F5F8FF] border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter programs by category"
                className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Tracks / Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Filter */}
            <div className="md:col-span-3">
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                aria-label="Filter programs by format"
                className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
              >
                {formats.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt === 'All' ? 'All Delivery Formats' : fmt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => {
            const isOpen = program.status === 'Open';

            return (
              <div
                key={program.id}
                className="bg-white rounded-2xl p-7 border border-[#D0D5DD] hover:border-[#155EEF] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Clean unboxed category & status */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="font-semibold text-[#155EEF]">{program.category}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        isOpen ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {program.status === 'Open' ? 'Enrollment Active' : program.status}
                    </span>
                  </div>

                  {/* Program Title */}
                  <h3 className="text-xl font-bold text-[#101828] group-hover:text-[#155EEF] transition-colors mb-3 leading-snug">
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#344054] leading-relaxed mb-6 line-clamp-3">
                    {program.description}
                  </p>

                  {/* Metadata List */}
                  <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-[#155EEF]" />
                        Duration
                      </span>
                      <span className="font-semibold text-gray-900">{program.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                        Format
                      </span>
                      <span className="font-semibold text-gray-900">{program.format}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-[#155EEF]" />
                        Cohort Starts
                      </span>
                      <span className="font-medium text-gray-800">{program.startDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Deadline</span>
                      <span className="text-[#E63946] font-semibold text-[11px]">
                        {program.applicationDeadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProgramModal(program)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold text-[#344054] hover:text-[#155EEF] bg-[#F5F8FF] hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors text-center"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyClick(program)}
                    disabled={!isOpen}
                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                      isOpen
                        ? 'text-white bg-[#E63946] hover:bg-[#C1121F] shadow-sm'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    <span>{isOpen ? 'Apply Now' : 'Closed'}</span>
                    {isOpen && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-800">No training programs match your criteria</h4>
            <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching with different keywords.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setFormatFilter('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-[#155EEF] bg-[#F5F8FF] rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Program Details Modal */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-[#155EEF] uppercase tracking-wider">
                  {selectedProgramModal.category} &bull; {selectedProgramModal.format}
                </span>
                <h3 className="text-2xl font-extrabold text-[#101828] mt-1">
                  {selectedProgramModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgramModal(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-[#344054] leading-relaxed mb-6">
              {selectedProgramModal.description}
            </p>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F5F8FF] rounded-xl border border-blue-100 mb-6 text-xs">
              <div>
                <span className="text-gray-500 block">Duration</span>
                <strong className="text-gray-900">{selectedProgramModal.duration}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Format</span>
                <strong className="text-gray-900">{selectedProgramModal.format}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Start Date</span>
                <strong className="text-gray-900">{selectedProgramModal.startDate}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <strong className="text-emerald-600">{selectedProgramModal.status}</strong>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                Prerequisites & Skill Readiness
              </h4>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {selectedProgramModal.prerequisites}
              </p>
            </div>

            {/* Curriculum Breakdown */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Curriculum Syllabus & Core Modules
              </h4>
              <div className="space-y-2">
                {selectedProgramModal.curriculum.map((mod, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                    <CheckCircle className="w-4 h-4 text-[#155EEF] shrink-0" />
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedProgramModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const prog = selectedProgramModal;
                  setSelectedProgramModal(null);
                  handleApplyClick(prog);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#E63946] hover:bg-[#C1121F] rounded-lg shadow-sm"
              >
                <span>Proceed to Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
