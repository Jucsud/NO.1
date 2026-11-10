import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CinematicIntroProps {
  onEnter: () => void;
  celebrantName: string;
  preTitle?: string;
  subtitle?: string;
  enterButtonText?: string;
  skipButtonText?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onEnter,
  celebrantName,
  preTitle = "A SPECIAL DAY. A SPECIAL SOUL.",
  subtitle = "Something beautiful has been created just for you.",
  enterButtonText = "ENTER YOUR CELEBRATION",
  skipButtonText = "Skip Intro",
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate subtle golden floating stars
    const p = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: 1 + Math.random() * 3,
    }));
    setParticles(p);
  }, []);

  const handleEnterClick = () => {
    soundEngine.playClick();
    soundEngine.playCelebration();
    // Soft golden particle confetti burst
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#D6B779', '#BFA16A', '#F5EBDD', '#FFF4DE'],
      disableForReducedMotion: true,
    });
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  const handleSkip = () => {
    soundEngine.playClick();
    onEnter();
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] text-[#F5EBDD] px-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Cinematic Birthday Introduction"
        >
          {/* Subtle Ambient Golden Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {particles.map((pt) => (
              <motion.div
                key={pt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: [0, 0.7, 0.2, 0.8, 0],
                  y: [-10, -50],
                }}
                transition={{
                  duration: 6 + pt.delay * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: pt.delay,
                }}
                className="absolute rounded-full bg-[#D6B779]"
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  width: `${pt.size}px`,
                  height: `${pt.size}px`,
                  boxShadow: '0 0 8px rgba(214, 183, 121, 0.6)',
                }}
              />
            ))}
          </div>

          {/* Central Radial Golden Glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(214, 183, 121, 0.25) 0%, rgba(8, 8, 8, 0) 70%)',
            }}
            aria-hidden="true"
          />

          {/* Content Block */}
          <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
            {/* Crown / Sparkle Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="mb-8 flex items-center justify-center w-14 h-14 rounded-full border border-gold-subtle bg-[#121212]/80"
            >
              <Sparkles className="w-6 h-6 text-[#D6B779]" aria-hidden="true" />
            </motion.div>

            {/* Character-by-character style Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6 }}
              className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.25em] uppercase text-gold-gradient font-semibold mb-4 leading-relaxed"
            >
              {preTitle}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.9 }}
              className="font-display italic text-lg sm:text-xl md:text-2xl text-[#F5EBDD]/90 mb-10 max-w-lg leading-relaxed font-normal"
            >
              {subtitle}
            </motion.p>

            {/* Personalization Greeting Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mb-12 text-xs uppercase tracking-[0.3em] text-[#D6B779]/80 font-sans"
            >
              Dedicated to <span className="text-[#FFF4DE] font-semibold">{celebrantName}</span>
            </motion.div>

            {/* Enter Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={handleEnterClick}
                onMouseEnter={() => soundEngine.playHover()}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D6B779] via-[#E8D3A7] to-[#BFA16A] text-[#080808] font-sans text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(214,183,121,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{enterButtonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Tasteful Skip Button pinned at top-right */}
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 text-xs uppercase tracking-widest text-[#F5EBDD]/60 hover:text-[#D6B779] transition-colors py-2 px-3 cursor-pointer"
            aria-label="Skip introduction animation"
          >
            {skipButtonText}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
