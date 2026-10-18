import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { ServicesSection } from '../components/landing/ServicesSection';
import { TeamSection } from '../components/landing/TeamSection';
import { TraineeShowcaseSection } from '../components/landing/TraineeShowcaseSection';
import { TrainingCatalogSection } from '../components/landing/TrainingCatalogSection';
import { ContactSection } from '../components/landing/ContactSection';
import { Marquee } from '../components/Marquee';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <TraineeShowcaseSection />
        <TrainingCatalogSection />
        <ContactSection />
      </main>
      <Marquee />
      <Footer />
    </div>
  );
};
