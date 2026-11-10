import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, Wind, RotateCcw, Heart } from 'lucide-react';
import { CakeCelebration3D } from './3d/CakeCelebration3D';
import { BirthdayConfig } from '../config/birthdayConfig';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MakeAWishSectionProps {
  config: BirthdayConfig;
}

export const MakeAWishSection: React.FC<MakeAWishSectionProps> = ({ config }) => {
  const [isBlown, setIsBlown] = useState(false);

  const handleBlowCandles = () => {
    if (isBlown) return;

    soundEngine.playCandleBlow();

    // Staggered luxury golden confetti explosions
    const count = 120;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#D6B779', '#BFA16A', '#F5EBDD', '#FFF4DE', '#E8D3A7'],
      disableForReducedMotion: true,
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 60,
    });
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.35),
        spread: 100,
      });
    }, 250);
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.25),
        spread: 120,
        decay: 0.92,
        scalar: 1.2,
      });
    }, 500);

    setIsBlown(true);
  };

  const handleRelight = () => {
    soundEngine.playClick();
    setIsBlown(false);
  };

  return (
    <section
      id="wish"
      className="relative py-28 px-6 bg-[#080808] border-t border-[#D6B779]/15 overflow-hidden text-center"
      aria-label="Make a Wish Ceremony"
    >
      {/* Background Lighting Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(214, 183, 121, 0.3) 0%, rgba(8, 8, 8, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-3 rounded-full border border-gold-subtle bg-[#121212]/80 text-[11px] font-sans tracking-[0.28em] uppercase text-[#D6B779]">
          <Flame className="w-3 h-3 text-[#D6B779]" aria-hidden="true" />
          <span>{config.wish.eyebrow}</span>
        </div>

        {/* Section Headline */}
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.16em] uppercase text-[#F5EBDD] mb-4">
          {config.wish.title}
        </h2>

        {/* Instructions */}
        <p className="font-display italic text-lg sm:text-xl md:text-2xl text-[#F5EBDD]/80 max-w-xl mx-auto leading-relaxed mb-6 font-light">
          {config.wish.instruction}
        </p>

        {/* 3D Birthday Cake Canvas */}
        <div className="relative my-[-10px] md:my-[-20px]">
          <CakeCelebration3D isBlown={isBlown} />
        </div>

        {/* Interactive Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isBlown ? (
            <button
              onClick={handleBlowCandles}
              onMouseEnter={() => soundEngine.playHover()}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D6B779] via-[#E8D3A7] to-[#BFA16A] text-[#080808] font-sans text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(214,183,121,0.6)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Wind className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{config.wish.blowButtonText}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D6B779]/60 bg-[#151515] text-[#D6B779] font-sans text-xs tracking-widest uppercase font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{config.wish.blownButtonText}</span>
              </div>
              <button
                onClick={handleRelight}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-white/20 bg-[#121212] hover:border-[#D6B779] text-[#F5EBDD]/70 hover:text-[#D6B779] text-xs font-sans tracking-wider uppercase transition-colors cursor-pointer"
                title="Relight candles to make another wish"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Relight Candles</span>
              </button>
            </div>
          )}
        </div>

        {/* Fulfilled Wish Blessing Card */}
        <AnimatePresence>
          {isBlown && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 max-w-xl mx-auto p-8 sm:p-10 rounded-2xl bg-[#121212]/95 border border-[#D6B779]/40 shadow-[0_10px_50px_rgba(214,183,121,0.2)] text-center relative overflow-hidden"
              data-testid="wish-fulfilled-card"
            >
              <div className="w-12 h-12 mx-auto rounded-full border border-gold-subtle flex items-center justify-center bg-[#151515] mb-4">
                <Heart className="w-5 h-5 text-[#D6B779]" />
              </div>

              <div className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#D6B779] mb-3">
                WISH SANCTIFIED
              </div>

              <h3 className="font-serif italic text-2xl sm:text-3xl text-gold-gradient font-normal mb-4">
                "{config.wish.fulfilledMessage}"
              </h3>

              <p className="font-display italic text-base sm:text-lg text-[#F5EBDD]/70 max-w-md mx-auto">
                {config.wish.wishQuote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
