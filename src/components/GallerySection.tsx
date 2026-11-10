import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Maximize2, MapPin, Calendar, Sparkles } from 'lucide-react';
import { BirthdayConfig, GalleryPhoto } from '../config/birthdayConfig';
import { soundEngine } from '../utils/audio';

interface GallerySectionProps {
  config: BirthdayConfig;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ config }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (photo: GalleryPhoto) => {
    soundEngine.playClick();
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    soundEngine.playClick();
    setSelectedPhoto(null);
  };

  return (
    <section
      id="memories"
      className="relative py-28 px-6 bg-[#080808] border-t border-[#D6B779]/15 overflow-hidden"
      aria-label="Cinematic Photo Gallery"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-3 rounded-full border border-gold-subtle bg-[#121212]/80 text-[11px] font-sans tracking-[0.28em] uppercase text-[#D6B779]">
            <Camera className="w-3 h-3 text-[#D6B779]" aria-hidden="true" />
            <span>{config.gallery.eyebrow}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.16em] uppercase text-[#F5EBDD] mb-4">
            {config.gallery.title}
          </h2>

          <p className="font-display italic text-lg sm:text-xl text-[#F5EBDD]/75">
            {config.gallery.subtitle}
          </p>
        </div>

        {/* Editorial Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.gallery.photos.map((photo, index) => {
            const hasFailed = failedImages[photo.id];
            const isSpanTwo = index === 0; // First hero photo gets wide editorial presence

            return (
              <motion.article
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className={`group relative rounded-2xl overflow-hidden border border-[#D6B779]/20 hover:border-[#D6B779]/60 transition-all duration-500 bg-[#121212] flex flex-col justify-between cursor-pointer ${
                  isSpanTwo ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
                onClick={() => openLightbox(photo)}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden w-full ${isSpanTwo ? 'h-[360px] sm:h-[440px]' : 'h-[340px]'}`}>
                  {!hasFailed ? (
                    <img
                      src={photo.url}
                      alt={photo.alt || photo.title}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(photo.id)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    // Graceful Fallback Container
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1811] to-[#0c0a07] p-8 text-center">
                      <Sparkles className="w-10 h-10 text-[#D6B779] mb-3 opacity-60" />
                      <div className="font-serif italic text-xl text-[#F5EBDD] mb-1">{photo.title}</div>
                      <div className="text-xs text-[#D6B779]/80 font-sans tracking-widest uppercase">
                        A Golden Memory
                      </div>
                    </div>
                  )}

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />

                  {/* Hover Inspect Indicator */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-[#D6B779]" />
                  </div>

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                    <div className="flex items-center gap-3 text-[11px] font-sans tracking-widest uppercase text-[#D6B779]/90 mb-1.5">
                      {photo.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#D6B779]" />
                          {photo.location}
                        </span>
                      )}
                      {photo.location && photo.year && <span>·</span>}
                      {photo.year && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#D6B779]" />
                          {photo.year}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#F5EBDD] font-normal mb-1 group-hover:text-gold-gradient transition-colors">
                      {photo.title}
                    </h3>

                    <p className="font-display italic text-sm text-[#F5EBDD]/70 line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full bg-[#121212] rounded-2xl border border-[#D6B779]/30 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-[#F5EBDD] hover:text-[#D6B779] hover:border-[#D6B779] transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative max-h-[70vh] flex items-center justify-center bg-black">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.alt || selectedPhoto.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 bg-[#121212] border-t border-[#D6B779]/20">
                <div className="flex items-center gap-3 text-xs font-sans tracking-widest uppercase text-[#D6B779] mb-1">
                  {selectedPhoto.location && <span>{selectedPhoto.location}</span>}
                  {selectedPhoto.location && selectedPhoto.year && <span>·</span>}
                  {selectedPhoto.year && <span>{selectedPhoto.year}</span>}
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl text-gold-gradient font-normal mb-2">
                  {selectedPhoto.title}
                </h4>
                <p className="font-display italic text-base sm:text-lg text-[#F5EBDD]/80">
                  "{selectedPhoto.caption}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
