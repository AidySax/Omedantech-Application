import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, UserCircle, Shield, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/#about' },
    { label: 'Our Services', href: '/#services' },
    { label: 'Training Programs', href: '/#training' },
    { label: 'Our Team', href: '/#team' },
    { label: 'Trainees', href: '/#trainees' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D0D5DD]/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="shrink-0">
            <Logo showSlogan={false} />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#344054]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/' && link.href.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="hover:text-[#155EEF] transition-colors whitespace-nowrap py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#155EEF] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Right Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#101828] hover:bg-[#1e293b] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#E63946]" />
                    Admin Panel
                  </Link>
                ) : user.role === 'staff' ? (
                  <Link
                    to="/staff"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#101828] hover:bg-[#1e293b] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <UserCircle className="w-3.5 h-3.5" />
                    Staff Portal
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#155EEF] hover:bg-[#F5F8FF] border border-[#155EEF]/30 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <UserCircle className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-gray-500 hover:text-[#E63946] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-[#344054] hover:text-[#155EEF] transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-semibold text-[#155EEF] bg-[#F5F8FF] hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Primary CTA Button */}
            <a
              href="/#training"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  handleNavClick('/#training');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#E63946] hover:bg-[#C1121F] rounded-lg shadow-sm transition-all duration-150 hover:shadow-md whitespace-nowrap"
            >
              <span>Apply for Training</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="/#training"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#E63946] rounded-md"
            >
              Apply
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#344054] hover:text-[#155EEF] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#D0D5DD] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 border-b border-gray-100 pb-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/' && link.href.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  } else {
                    setMobileMenuOpen(false);
                  }
                }}
                className="py-2 text-sm font-medium text-[#344054] hover:text-[#155EEF]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="flex items-center justify-between text-xs text-gray-500 py-1">
                  <span>Signed in as <strong className="text-gray-900">{user.email}</strong></span>
                  <button onClick={logout} className="text-[#E63946] font-semibold">Sign out</button>
                </div>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-bold text-white bg-[#101828] rounded-lg"
                  >
                    Administrator Dashboard
                  </Link>
                ) : user.role === 'staff' ? (
                  <Link
                    to="/staff"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-bold text-white bg-[#101828] rounded-lg"
                  >
                    Staff Portal
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-bold text-[#155EEF] border border-[#155EEF] rounded-lg"
                  >
                    My Trainee Dashboard
                  </Link>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-[#344054] border border-gray-300 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-[#155EEF] bg-[#F5F8FF] rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}

            <a
              href="/#training"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#E63946] hover:bg-[#C1121F] rounded-lg shadow-sm"
            >
              Apply for Training
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
