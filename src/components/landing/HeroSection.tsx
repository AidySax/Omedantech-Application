import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Pause,
  Play,
  Cpu,
  GraduationCap,
} from 'lucide-react';

interface CoreThemeSlide {
  id: string;
  themeNumber: string;
  themeLabel: string;
  tag: string;
  headlinePrefix: string;
  headlineHighlight: string;
  supporting: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  thirdCtaText: string;
  thirdCtaLink: string;
  image: string;
  altText: string;
  icon: React.ElementType;
}

export const HeroSection: React.FC = () => {
  // Three core professional technology theme slides as requested
  const slides: CoreThemeSlide[] = [
    {
      id: 'theme-software-starthub',
      themeNumber: '01',
      themeLabel: 'Software & Starthub',
      tag: 'OmedanTech Starthub · Innovate. Build. Scale.',
      headlinePrefix: 'Innovation and Creativity in',
      headlineHighlight: 'Tech.',
      supporting: 'Learn. Build. Innovate. Shape the Digital Future with OmedanTech.',
      description:
        'OmedanTech is your launchpad for technology innovation, AI development, software engineering, and professional growth. Explore our services, learn in-demand digital skills, and take the next step in your technology journey.',
      primaryCtaText: 'Apply for Training',
      primaryCtaLink: '#training',
      secondaryCtaText: 'Explore Our Services',
      secondaryCtaLink: '#services',
      thirdCtaText: 'Create Your Account',
      thirdCtaLink: '/register',
      image: '/src/assets/images/hero_tech_starthub_1792132763549.jpg',
      altText: 'OmedanTech software engineering starthub collaborative development lab',
      icon: Sparkles,
    },
    {
      id: 'theme-artificial-intelligence',
      themeNumber: '02',
      themeLabel: 'AI & Intelligent Systems',
      tag: 'AI Engineering · Prompt Architecture & ML Models',
      headlinePrefix: 'Engineering Intelligent Systems &',
      headlineHighlight: 'AI Models.',
      supporting: 'Harness Large Language Models, RAG Architectures & Predictive AI.',
      description:
        'From prompt engineering fundamentals to scalable machine learning workflows, we engineer intelligent systems that automate complex business operations and unlock transformative analytical insights.',
      primaryCtaText: 'Explore AI Training',
      primaryCtaLink: '#training',
      secondaryCtaText: 'AI Development Services',
      secondaryCtaLink: '#services',
      thirdCtaText: 'Enroll in AI Cohort',
      thirdCtaLink: '/training/ai-prompting/apply',
      image: '/src/assets/images/banner_ai_engineering_1792134767627.jpg',
      altText: 'Artificial intelligence and neural network engineering at OmedanTech',
      icon: Cpu,
    },
    {
      id: 'theme-professional-training',
      themeNumber: '03',
      themeLabel: 'Professional Training',
      tag: 'Talent Acceleration · Practical Technology Academy',
      headlinePrefix: 'Practical Skills for the',
      headlineHighlight: 'Digital Era.',
      supporting: 'Full-Stack Web, Mobile Engineering, UI/UX Design & Cloud Computing.',
      description:
        'Learn from practicing senior software engineers and technology leaders. Build real production projects, master modern development stacks, and prepare for high-impact roles in the global tech ecosystem.',
      primaryCtaText: 'Browse Training Catalog',
      primaryCtaLink: '#training',
      secondaryCtaText: 'View Trainee Showcase',
      secondaryCtaLink: '#trainees',
      thirdCtaText: 'Join Next Cohort',
      thirdCtaLink: '/register',
      image: '/src/assets/images/banner_code_bootcamp_1792134768160.jpg',
      altText: 'Hands-on software training bootcamp classroom at OmedanTech',
      icon: GraduationCap,
    },
  ];

  const [[currentIndex, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_INTERVAL = 6500; // 6.5s auto-cycle

  const paginate = (newDirection: number) => {
    setPage(([curr]) => {
      const nextIndex = (curr + newDirection + slides.length) % slides.length;
      return [nextIndex, newDirection];
    });
  };

  const jumpToSlide = (targetIndex: number) => {
    setPage(([curr]) => [targetIndex, targetIndex > curr ? 1 : -1]);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        paginate(1);
      }, SLIDE_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const currentSlide = slides[currentIndex];
  const ActiveIcon = currentSlide.icon;

  // Framer Motion transition variants for smooth background image crossfade
  const backgroundVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.05,
      x: dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        opacity: { duration: 0.85, ease: 'easeOut' as const },
        scale: { duration: 1.4, ease: 'easeOut' as const },
        x: { duration: 0.85, ease: 'easeOut' as const },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: dir > 0 ? -30 : 30,
      transition: {
        opacity: { duration: 0.65, ease: 'easeIn' as const },
        x: { duration: 0.65, ease: 'easeIn' as const },
      },
    }),
  };

  // Text content animation variants
  const textVariants = {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' as const, staggerChildren: 0.08 },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.35, ease: 'easeIn' as const } },
  };

  return (
    <section
      aria-label="OmedanTech Core Technology Carousel Banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#101828] text-white min-h-[640px] lg:min-h-[720px] flex items-center select-none"
    >
      {/* Background Image Carousel with Framer Motion AnimatePresence */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={backgroundVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.altText}
              className="w-full h-full object-cover object-center"
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
            />
            {/* Measured double-layer scrim ensuring WCAG AA contrast for text across all frames */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#101828] via-[#101828]/90 sm:via-[#101828]/85 to-[#101828]/60 sm:to-transparent/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-transparent to-[#101828]/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle tech background grid matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#155EEF_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none z-1" />

      {/* Main Banner Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Animated Text Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Brand Slogan Kicker */}
                <motion.div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <ActiveIcon className="w-3.5 h-3.5 text-[#E63946]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                    {currentSlide.tag}
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.15]">
                  {currentSlide.headlinePrefix}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#155EEF] to-[#E63946]">
                    {currentSlide.headlineHighlight}
                  </span>
                </motion.h1>

                {/* Supporting Headline */}
                <motion.h2 className="text-base sm:text-xl font-semibold text-blue-100/90 leading-snug">
                  {currentSlide.supporting}
                </motion.h2>

                {/* Description */}
                <motion.p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
                  {currentSlide.description}
                </motion.p>

                {/* 3 Call-to-Actions */}
                <motion.div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Primary CTA */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={currentSlide.primaryCtaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#E63946] hover:bg-[#C1121F] rounded-lg shadow-lg shadow-red-500/25 transition-all"
                  >
                    <span>{currentSlide.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>

                  {/* Secondary CTA */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={currentSlide.secondaryCtaLink}
                    className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#155EEF] hover:bg-blue-600 rounded-lg shadow-md transition-all"
                  >
                    <span>{currentSlide.secondaryCtaText}</span>
                  </motion.a>

                  {/* Third CTA */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={currentSlide.thirdCtaLink}
                      className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold text-gray-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors backdrop-blur-sm"
                    >
                      <span>{currentSlide.thirdCtaText}</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* 3 Core Value Propositions */}
            <div className="pt-6 mt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#155EEF] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  Practical Technology Skills
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  Innovation-Driven Solutions
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  Building Future-Ready Talent
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3-Theme Switcher Card */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-3">
            <div className="bg-[#101828]/85 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-300 pb-2 border-b border-white/10">
                <span className="font-semibold uppercase tracking-wider text-blue-300">
                  Core Technology Themes
                </span>
                <span className="font-mono font-bold text-white tabular-nums">
                  0{currentIndex + 1} / 0{slides.length}
                </span>
              </div>

              {/* 3 Theme Navigation Buttons */}
              <div className="space-y-2.5">
                {slides.map((s, idx) => {
                  const isCurrent = idx === currentIndex;
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.id}
                      onClick={() => jumpToSlide(idx)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-white/15 border-[#155EEF] shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-white/5 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 border border-white/20 relative">
                        <img
                          src={s.image}
                          alt={s.altText}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#155EEF]/30" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#E63946]' : 'text-gray-400'}`} />
                          <span className={isCurrent ? 'text-white' : 'text-gray-300'}>
                            {s.themeLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          Theme {s.themeNumber} &bull; {s.headlineHighlight.replace('.', '')}
                        </p>
                      </div>

                      {isCurrent && (
                        <motion.div
                          layoutId="activeBar"
                          className="w-1.5 h-7 bg-[#E63946] rounded-full shrink-0"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Carousel Bar Controls */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          {/* Slide Indicators with Animated Progress Bar */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => jumpToSlide(idx)}
                aria-label={`Switch to Theme ${idx + 1}: ${s.themeLabel}`}
                className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                  idx === currentIndex ? 'w-12 bg-white/20' : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              >
                {idx === currentIndex && (
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 bg-[#E63946] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isPaused ? undefined : '100%' }}
                    transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
                    key={`bar-${currentIndex}-${isPaused}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Directional Controls & Play/Pause */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono tabular-nums">
              Theme 0{currentIndex + 1} of 0{slides.length}
            </span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label={isPaused ? 'Play slide rotation' : 'Pause slide rotation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              title="Previous technology theme"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous theme slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              title="Next technology theme"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Next theme slide"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
