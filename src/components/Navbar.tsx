import React from 'react';
import { Volume2, VolumeX, SlidersHorizontal, Music } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  isMusicPlaying,
  onToggleMusic,
  onOpenCustomizer,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080808]/85 backdrop-blur-md border-b border-[#D6B779]/15 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#celebration"
          className="font-cinzel text-base md:text-lg font-bold tracking-[0.2em] text-gold-gradient whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          L'ANNIVERSAIRE ROYALE
        </a>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-widest uppercase text-[#F5EBDD]/75"
          aria-label="Main Navigation"
        >
          <a
            href="#celebration"
            onClick={() => soundEngine.playHover()}
            className="hover:text-[#D6B779] transition-colors whitespace-nowrap shrink-0"
          >
            Celebration
          </a>
          <a
            href="#surprise"
            onClick={() => soundEngine.playHover()}
            className="hover:text-[#D6B779] transition-colors whitespace-nowrap shrink-0"
          >
            Surprise
          </a>
          <a
            href="#message"
            onClick={() => soundEngine.playHover()}
            className="hover:text-[#D6B779] transition-colors whitespace-nowrap shrink-0"
          >
            Heartfelt Note
          </a>
          <a
            href="#memories"
            onClick={() => soundEngine.playHover()}
            className="hover:text-[#D6B779] transition-colors whitespace-nowrap shrink-0"
          >
            Memories
          </a>
          <a
            href="#wish"
            onClick={() => soundEngine.playHover()}
            className="hover:text-[#D6B779] transition-colors whitespace-nowrap shrink-0"
          >
            Make A Wish
          </a>
        </nav>

        {/* Zone 3: Audio & Personalize Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Ambient Music Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleMusic();
            }}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isMusicPlaying
                ? 'border-[#D6B779] text-[#D6B779] bg-[#D6B779]/10'
                : 'border-white/10 text-[#F5EBDD]/60 hover:text-[#D6B779] hover:border-[#D6B779]/30'
            }`}
            title={isMusicPlaying ? 'Pause Ambient Atmosphere' : 'Play Ambient Atmosphere'}
            aria-label={isMusicPlaying ? 'Pause Ambient Atmosphere' : 'Play Ambient Atmosphere'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-full border border-white/10 text-[#F5EBDD]/60 hover:text-[#D6B779] hover:border-[#D6B779]/30 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Personalize Experience Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenCustomizer();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D6B779]/40 bg-[#151515] hover:bg-[#D6B779]/15 hover:border-[#D6B779] text-[#F5EBDD] hover:text-[#FFF4DE] text-xs font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D6B779]" />
            <span className="hidden sm:inline">Personalize</span>
          </button>
        </div>
      </div>
    </header>
  );
};
