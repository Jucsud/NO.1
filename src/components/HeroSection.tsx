import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Hero3DScene } from './3d/Hero3DScene';
import { BirthdayConfig, formatAgeOrdinal } from '../config/birthdayConfig';

interface HeroSectionProps {
  config: BirthdayConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config }) => {
  const ageOrdinal = formatAgeOrdinal(config.age);

  return (
    <section
      id="celebration"
      className="relative min-h-[92vh] flex flex-col items-center justify-between pt-8 pb-12 overflow-hidden bg-[#080808]"
      aria-label="Grand Birthday Celebration Hero"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(214, 183, 121, 0.28) 0%, rgba(8, 8, 8, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Top Editorial Eyebrow */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-gold-subtle bg-[#121212]/60 text-[11px] font-sans tracking-[0.28em] uppercase text-[#D6B779]"
        >
          <Sparkles className="w-3 h-3 text-[#D6B779]" aria-hidden="true" />
          <span>{config.hero.tagline}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.18em] uppercase text-[#F5EBDD] drop-shadow-sm mb-2"
        >
          {config.hero.mainTitle}
        </motion.h1>

        {/* Celebrant Name in Enormous Luxury Gold Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3 }}
          className="relative my-2 sm:my-3"
        >
          <span className="font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-gold-gradient tracking-tight block drop-shadow-[0_4px_24px_rgba(214,183,121,0.25)]">
            {config.celebrantName}
          </span>
          {ageOrdinal && (
            <div className="mt-1 text-xs sm:text-sm font-sans tracking-[0.3em] uppercase text-[#BFA16A] font-medium">
              CELEBRATING HER {ageOrdinal} CHAPTER
            </div>
          )}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="font-display italic text-lg sm:text-xl md:text-2xl text-[#F5EBDD]/80 max-w-xl mx-auto leading-relaxed mt-2"
        >
          "{config.hero.subtitle}"
        </motion.p>
      </div>

      {/* Central 3D Three.js Cake & Balloons Scene */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mt-3 mb-6">
        <Hero3DScene celebrantName={config.celebrantName} />
      </div>

      {/* Scroll Down Invitation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-2 mt-2"
      >
        <a
          href="#surprise"
          className="group flex flex-col items-center gap-2 text-[11px] font-sans tracking-[0.3em] uppercase text-[#D6B779]/80 hover:text-[#FFF4DE] transition-colors cursor-pointer"
          aria-label="Scroll down to the surprise section"
        >
          <span>{config.hero.scrollHint}</span>
          <div className="w-8 h-8 rounded-full border border-gold-subtle flex items-center justify-center transition-transform duration-300 group-hover:translate-y-1">
            <ChevronDown className="w-4 h-4 text-[#D6B779]" />
          </div>
        </a>
      </motion.div>
    </section>
  );
};
