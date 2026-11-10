import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCcw, Share2, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { BirthdayConfig, defaultBirthdayConfig } from '../config/birthdayConfig';
import { soundEngine } from '../utils/audio';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onUpdateConfig: (newConfig: BirthdayConfig) => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<BirthdayConfig>(config);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'messages' | 'gallery'>('details');

  const handleInputChange = (field: keyof BirthdayConfig, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    onUpdateConfig(formData);
    onClose();
  };

  const handleReset = () => {
    soundEngine.playClick();
    setFormData(defaultBirthdayConfig);
    onUpdateConfig(defaultBirthdayConfig);
  };

  const handleCopyShareLink = () => {
    soundEngine.playClick();
    const params = new URLSearchParams();
    params.set('name', formData.celebrantName);
    if (formData.age) params.set('age', String(formData.age));
    if (formData.celebrationDate) params.set('date', formData.celebrationDate);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Personalize Celebration Experience"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-2xl w-full max-h-[85vh] flex flex-col bg-[#121212] rounded-2xl border border-[#D6B779]/35 shadow-2xl overflow-hidden text-[#F5EBDD]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#D6B779]/20 bg-[#161616]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-gold-subtle flex items-center justify-center bg-[#1e1e1e]">
                  <SlidersHorizontal className="w-4 h-4 text-[#D6B779]" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#F5EBDD] tracking-wider uppercase">
                    Personalize Celebration
                  </h3>
                  <p className="text-xs text-[#D6B779]/80 font-sans">
                    Customize celebrant details, heartfelt words, and memory gallery
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full border border-white/10 hover:border-[#D6B779] text-[#F5EBDD]/70 hover:text-[#D6B779] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-[#121212]">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 px-3 text-xs font-sans tracking-wider uppercase font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#D6B779] text-[#D6B779]'
                    : 'border-transparent text-[#F5EBDD]/60 hover:text-[#F5EBDD]'
                }`}
              >
                Identity & Details
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`pb-3 px-3 text-xs font-sans tracking-wider uppercase font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'messages'
                    ? 'border-[#D6B779] text-[#D6B779]'
                    : 'border-transparent text-[#F5EBDD]/60 hover:text-[#F5EBDD]'
                }`}
              >
                Heartfelt Messages
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`pb-3 px-3 text-xs font-sans tracking-wider uppercase font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'border-[#D6B779] text-[#D6B779]'
                    : 'border-transparent text-[#F5EBDD]/60 hover:text-[#F5EBDD]'
                }`}
              >
                Photo Gallery
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleApply} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                      Celebrant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.celebrantName}
                      onChange={(e) => handleInputChange('celebrantName', e.target.value)}
                      placeholder="e.g. Sophia, Alexandra, Liam"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD] font-serif text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                        Age (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age ?? ''}
                        onChange={(e) =>
                          handleInputChange('age', e.target.value ? parseInt(e.target.value, 10) : null)
                        }
                        placeholder="e.g. 28"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                        Celebration Date
                      </label>
                      <input
                        type="text"
                        value={formData.celebrationDate}
                        onChange={(e) => handleInputChange('celebrationDate', e.target.value)}
                        placeholder="e.g. November 10"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                      Hero Headline Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.hero.subtitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                      Surprise Gift Box Message
                    </label>
                    <textarea
                      rows={3}
                      value={formData.surprise.revealedMessage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          surprise: { ...prev.surprise, revealedMessage: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD] font-display text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                      Heartfelt Letter - Main Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={formData.letter.paragraphs[0] || ''}
                      onChange={(e) => {
                        const newParas = [...formData.letter.paragraphs];
                        newParas[0] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          letter: { ...prev.letter, paragraphs: newParas },
                        }));
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD] font-display text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#D6B779] mb-1.5 font-medium">
                      Make a Wish - Fulfilled Blessing
                    </label>
                    <input
                      type="text"
                      value={formData.wish.fulfilledMessage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          wish: { ...prev.wish, fulfilledMessage: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/15 focus:border-[#D6B779] focus:outline-none text-[#F5EBDD]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="text-xs text-[#D6B779]/80 mb-2">
                    Custom Photo URLs (can replace with hosted image URLs or local assets):
                  </div>
                  {formData.gallery.photos.map((photo, pIdx) => (
                    <div key={photo.id} className="p-3 rounded-lg border border-white/10 bg-[#161616] space-y-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-[#D6B779]" />
                        <span className="text-xs font-semibold text-[#D6B779]">
                          Photo {pIdx + 1}: {photo.title}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={photo.url}
                        onChange={(e) => {
                          const updated = [...formData.gallery.photos];
                          updated[pIdx] = { ...updated[pIdx], url: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            gallery: { ...prev.gallery, photos: updated },
                          }));
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#1f1f1f] border border-white/10 text-xs text-[#F5EBDD]"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => {
                          const updated = [...formData.gallery.photos];
                          updated[pIdx] = { ...updated[pIdx], caption: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            gallery: { ...prev.gallery, photos: updated },
                          }));
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#1f1f1f] border border-white/10 text-xs text-[#F5EBDD]"
                        placeholder="Caption"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#D6B779]/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30 text-xs text-[#F5EBDD]/60 hover:text-[#F5EBDD] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D6B779]/30 bg-[#D6B779]/10 hover:bg-[#D6B779]/20 text-xs text-[#D6B779] transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-xs text-[#F5EBDD]/70 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#D6B779] to-[#BFA16A] text-[#080808] text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(214,183,121,0.4)] cursor-pointer"
                  >
                    Save & Preview
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
