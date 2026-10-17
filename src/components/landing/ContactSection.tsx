import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Training Inquiries',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to dispatch message.');
      } else {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'Training Inquiries',
          message: '',
        });
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-b border-[#D0D5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Contact Copy & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E63946] text-xs font-semibold uppercase tracking-wider">
              Get in Touch
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
              Let&apos;s Create Something Innovative.
            </h2>

            <p className="text-base text-[#344054] leading-relaxed">
              Whether you want to build a digital product, explore AI solutions, or develop your
              technology skills, OmedanTech is ready to connect with you.
            </p>

            {/* Official Business Placeholders */}
            <div className="space-y-4 pt-4 border-t border-gray-100 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#155EEF] shrink-0 border border-blue-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#101828] text-xs uppercase tracking-wider">Official Email</h4>
                  <a href="mailto:aidytech01@gmail.com" className="text-gray-600 hover:text-[#155EEF] transition-colors">
                    aidytech01@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#E63946] shrink-0 border border-red-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#101828] text-xs uppercase tracking-wider">Telephone Desk</h4>
                  <p className="text-gray-600">+234 7040297320 / +234 8133314068</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#155EEF] shrink-0 border border-blue-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#101828] text-xs uppercase tracking-wider">OmedanTech Starthub</h4>
                  <p className="text-gray-600">
                    <span> <strong>Opposit Comprehensive Commercial Secondary School,</strong><br/> 
                 Ukana West, Essien Udim L.G.A </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#F5F8FF] rounded-2xl p-7 sm:p-9 border border-[#D0D5DD] shadow-xs">
              <h3 className="text-lg font-bold text-[#101828] mb-1">Send an Inquiry</h3>
              <p className="text-xs text-gray-500 mb-6">
                Our front desk and engineering coordinators review and respond within one business day.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Message Dispatched!</h4>
                  <p className="text-xs text-emerald-700">
                    Thank you for reaching out to OmedanTech. Miss Comfort Iwah from our customer care desk will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-bold text-[#155EEF] hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Samuel Bassey"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 800 000 0000"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                      >
                        <option value="Training Inquiries">Training Inquiries & Cohorts</option>
                        <option value="Product Discovery">Product Discovery & Strategy</option>
                        <option value="Software Development">Software & App Development</option>
                        <option value="AI Solutions">AI Development & Prompting</option>
                        <option value="Staff Augmentation">IT Staff Augmentation</option>
                        <option value="General Partnership">General Partnership & Hub Tour</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Message <span className="text-[#E63946]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project objectives, learning aspirations, or specific questions..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D0D5DD] rounded-lg focus:outline-none focus:border-[#155EEF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-5 text-xs sm:text-sm font-bold text-white bg-[#155EEF] hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to OmedanTech</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
