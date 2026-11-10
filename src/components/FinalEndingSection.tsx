import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { ConstellationHeart3D } from './3d/ConstellationHeart3D';
import { BirthdayConfig } from '../config/birthdayConfig';
import { soundEngine } from '../utils/audio';

interface FinalEndingSectionProps {
  config: BirthdayConfig;
}

export const FinalEndingSection: React.FC<FinalEndingSectionProps> = ({ config }) => {
  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative pt-24 pb-16 px-6 bg-[#080808] border-t border-[#D6B779]/15 overflow-hidden text-center"
      aria-label="Final Cinematic Birthday Tribute"
    >
      {/* Golden Radiance Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(214, 183, 121, 0.3) 0%, rgba(8, 8, 8, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* 3D Celestial Constellation Heart */}
        <div className="mb-8">
          <ConstellationHeart3D />
        </div>

        {/* Ending Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded-full border border-gold-subtle bg-[#121212]/80 text-[11px] font-sans tracking-[0.28em] uppercase text-[#D6B779]">
          <Heart className="w-3 h-3 text-[#D6B779]" aria-hidden="true" />
          <span>IN DEDICATION TO {config.celebrantName.toUpperCase()}</span>
        </div>

        {/* Emotion-driven Climax Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.14em] uppercase text-gold-shimmer mb-4 max-w-3xl leading-snug"
        >
          {config.ending.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#F5EBDD]/90 max-w-xl mx-auto mb-10 font-normal"
        >
          "{config.ending.subheadline}"
        </motion.p>

        {/* Return to Top Button */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundEngine.playHover()}
          className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-gold-subtle bg-[#121212] hover:bg-[#D6B779]/20 hover:border-[#D6B779] text-[#F5EBDD] font-sans text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md mb-16"
          aria-label="Scroll back to top of celebration"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#D6B779]" />
          <span>Return to Beginning</span>
        </button>

        {/* Subtle Brand & Respectful Colophon */}
        <div className="w-full pt-8 border-t border-[#D6B779]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#F5EBDD]/50 tracking-wider">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B779]" />
            <span className="font-cinzel uppercase text-[#D6B779] tracking-widest font-semibold">
              {config.ending.signoff}
            </span>
          </div>

          <div>{config.ending.copyright}</div>
        </div>
      </div>
    </footer>
  );
};
