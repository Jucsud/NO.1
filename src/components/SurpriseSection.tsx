import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { GiftBox3D } from './3d/GiftBox3D';
import { BirthdayConfig } from '../config/birthdayConfig';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SurpriseSectionProps {
  config: BirthdayConfig;
}

export const SurpriseSection: React.FC<SurpriseSectionProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isOpen) {
      soundEngine.playGiftOpen();
      // Confetti burst
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D6B779', '#BFA16A', '#F5EBDD', '#FFF4DE', '#E8D3A7'],
        disableForReducedMotion: true,
      });
    } else {
      soundEngine.playClick();
    }
    setIsOpen(!isOpen);
  };

  return (
    <section
      id="surprise"
      className="relative py-24 px-6 bg-[#080808] border-t border-[#D6B779]/15 overflow-hidden"
      aria-label="Interactive Birthday Surprise"
    >
      {/* Background Lighting Accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(214, 183, 121, 0.3) 0%, rgba(8, 8, 8, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-gold-subtle bg-[#121212]/80 text-[11px] font-sans tracking-[0.25em] uppercase text-[#D6B779]">
          <Gift className="w-3 h-3 text-[#D6B779]" aria-hidden="true" />
          <span>{config.surprise.sectionHeadline}</span>
        </div>

        {/* Section Headline */}
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.14em] text-[#F5EBDD] uppercase mb-3">
          {config.surprise.subheadline}
        </h2>

        {/* Sub-prompt */}
        <p className="font-display italic text-lg sm:text-xl text-[#F5EBDD]/75 mb-6">
          {isOpen ? "Your surprise has been unveiled..." : config.surprise.boxPrompt}
        </p>

        {/* 3D Gift Box Canvas */}
        <div className="relative my-2">
          <GiftBox3D isOpen={isOpen} onToggleOpen={handleToggle} />

          {/* Helper Button beneath box */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleToggle}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#D6B779]/50 bg-[#121212] hover:bg-[#D6B779]/20 hover:border-[#D6B779] text-[#F5EBDD] font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(214,183,121,0.15)] cursor-pointer"
            >
              {isOpen ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-[#D6B779]" />
                  <span>Close Gift</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D6B779]" />
                  <span>Tap to Open the Gift</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Revealed Personalized Surprise Message Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 max-w-2xl mx-auto p-8 sm:p-10 rounded-2xl bg-[#121212]/95 border border-[#D6B779]/40 shadow-[0_10px_40px_rgba(214,183,121,0.18)] text-left relative overflow-hidden"
              data-testid="surprise-message-card"
            >
              {/* Gold Filigree Accent Lines */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6B779] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6B779] to-transparent" />

              <div className="flex items-center justify-between border-b border-[#D6B779]/20 pb-4 mb-6">
                <span className="font-cinzel text-xs tracking-[0.25em] text-[#D6B779] uppercase">
                  {config.surprise.giftTag}
                </span>
                <Heart className="w-4 h-4 text-[#D6B779]" />
              </div>

              <h3 className="font-serif italic text-2xl sm:text-3xl text-gold-gradient font-normal mb-4">
                Dearest {config.celebrantName},
              </h3>

              <p className="font-display text-lg sm:text-xl text-[#F5EBDD]/90 leading-relaxed font-light mb-6">
                "{config.surprise.revealedMessage}"
              </p>

              <div className="pt-4 border-t border-[#D6B779]/20 flex items-center justify-between text-xs text-[#D6B779]/80 font-sans tracking-widest uppercase">
                <span>{config.surprise.revealedSignoff}</span>
                <span className="text-[#F5EBDD]/50">{config.celebrationDate}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
