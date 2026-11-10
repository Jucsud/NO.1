import React from 'react';
import { motion } from 'motion/react';
import { Feather, Heart } from 'lucide-react';
import { BirthdayConfig } from '../config/birthdayConfig';

interface LetterSectionProps {
  config: BirthdayConfig;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ config }) => {
  return (
    <section
      id="message"
      className="relative py-28 px-6 bg-[#080808] border-t border-[#D6B779]/15 overflow-hidden"
      aria-label="A Message From The Heart"
    >
      {/* Ambient Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(214, 183, 121, 0.25) 0%, rgba(8, 8, 8, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Editorial Eyebrow */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-3 rounded-full border border-gold-subtle bg-[#121212]/80 text-[11px] font-sans tracking-[0.28em] uppercase text-[#D6B779]">
            <Feather className="w-3 h-3 text-[#D6B779]" aria-hidden="true" />
            <span>{config.letter.eyebrow}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.16em] uppercase text-[#F5EBDD] mb-3">
            {config.letter.title}
          </h2>

          <p className="font-display italic text-base sm:text-lg text-[#D6B779]/80 font-normal">
            {config.letter.dateText}
          </p>
        </div>

        {/* Editorial Letter Parchment Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-8 sm:p-14 md:p-16 rounded-2xl bg-[#111111]/90 border border-[#D6B779]/25 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#D6B779]/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#D6B779]/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#D6B779]/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#D6B779]/60 pointer-events-none" />

          {/* Letter Salutation */}
          <div className="mb-8 pb-4 border-b border-[#D6B779]/15 flex items-center justify-between">
            <span className="font-serif italic text-2xl sm:text-3xl text-gold-gradient font-normal">
              To my beloved {config.celebrantName},
            </span>
            <div className="w-8 h-8 rounded-full border border-gold-subtle flex items-center justify-center bg-[#151515]">
              <Heart className="w-3.5 h-3.5 text-[#D6B779]" />
            </div>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-6 text-[#F5EBDD]/90 font-display text-lg sm:text-xl md:text-2xl leading-relaxed font-light">
            {config.letter.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-[#D6B779]' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Signature & Seal */}
          <div className="mt-12 pt-8 border-t border-[#D6B779]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="font-cinzel text-xs tracking-[0.25em] text-[#D6B779] uppercase mb-1">
                {config.letter.signatureTitle}
              </div>
              <div className="font-serif italic text-2xl text-[#FFF4DE] font-normal">
                {config.letter.signatureName}
              </div>
            </div>

            {/* Luxury Monogram Wax Seal */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#D6B779] bg-gradient-to-br from-[#2a2214] to-[#120f08] flex items-center justify-center shadow-[0_0_15px_rgba(214,183,121,0.3)]">
                <span className="font-cinzel font-bold text-sm text-[#D6B779]">
                  {config.celebrantName.charAt(0)}
                </span>
              </div>
              <div className="text-[11px] font-sans tracking-widest text-[#F5EBDD]/50 uppercase">
                Official Royal Seal
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
