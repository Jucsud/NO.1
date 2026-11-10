/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { defaultBirthdayConfig, BirthdayConfig, sanitizeBirthdayConfig } from './config/birthdayConfig';
import { soundEngine } from './utils/audio';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SurpriseSection } from './components/SurpriseSection';
import { LetterSection } from './components/LetterSection';
import { GallerySection } from './components/GallerySection';
import { MakeAWishSection } from './components/MakeAWishSection';
import { FinalEndingSection } from './components/FinalEndingSection';
import { PersonalizationModal } from './components/PersonalizationModal';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(defaultBirthdayConfig);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Parse URL search parameters on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    // Support ?autostart=1 to skip straight to the main view (Ultra Mode guideline)
    if (params.get('autostart') === '1') {
      setHasEntered(true);
    }

    const customName = params.get('name');
    const customAge = params.get('age');
    const customDate = params.get('date');

    if (customName || customAge || customDate) {
      setConfig((prev) =>
        sanitizeBirthdayConfig({
          ...prev,
          celebrantName: customName || prev.celebrantName,
          age: customAge ? parseInt(customAge, 10) : prev.age,
          celebrationDate: customDate || prev.celebrationDate,
        })
      );
    }
  }, []);

  const handleEnterCelebration = () => {
    setHasEntered(true);
    // Start ambient music gently if not muted
    if (!isMuted && !isMusicPlaying) {
      soundEngine.startAmbient();
      setIsMusicPlaying(true);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleToggleMusic = () => {
    const playing = soundEngine.toggleMusic();
    setIsMusicPlaying(playing);
  };

  const handleUpdateConfig = (newConfig: BirthdayConfig) => {
    setConfig(sanitizeBirthdayConfig(newConfig));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5EBDD] font-sans antialiased selection:bg-[#D6B779] selection:text-[#080808]">
      {/* Cinematic Fullscreen Introduction */}
      {!hasEntered && (
        <CinematicIntro
          onEnter={handleEnterCelebration}
          celebrantName={config.celebrantName}
          preTitle={config.intro.preTitle}
          subtitle={config.intro.subtitle}
          enterButtonText={config.intro.enterButtonText}
          skipButtonText={config.intro.skipButtonText}
        />
      )}

      {/* Main Luxury Birthday Experience */}
      <div className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Bar Header */}
        <Navbar
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Main Content Sections */}
        <main>
          {/* Section 1: Hero Celebration */}
          <HeroSection config={config} />

          {/* Section 2: Interactive 3D Surprise Gift Box */}
          <SurpriseSection config={config} />

          {/* Section 3: Personalized Editorial Letter */}
          <LetterSection config={config} />

          {/* Section 4: Cinematic Memory Gallery */}
          <GallerySection config={config} />

          {/* Section 5: Make A Wish 3D Candle Ceremony */}
          <MakeAWishSection config={config} />
        </main>

        {/* Section 6: Final Emotional Cinematic Ending */}
        <FinalEndingSection config={config} />

        {/* Central Personalization System Modal */}
        <PersonalizationModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          config={config}
          onUpdateConfig={handleUpdateConfig}
        />
      </div>
    </div>
  );
}
