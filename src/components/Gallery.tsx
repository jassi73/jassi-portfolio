import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryImages = [
  '/assets/gallery/g1.jpg',
  '/assets/gallery/g2.jpg',
  '/assets/gallery/g3.jpg',
  '/assets/gallery/g4.jpg',
  '/assets/gallery/g5.jpg',
  '/assets/gallery/g6.jpg',
  '/assets/gallery/g7.jpg',
  '/assets/gallery/g8.jpg',
  '/assets/gallery/g9.jpg',
  '/assets/gallery/g10.jpg',
];

export default function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [mobileActiveIdx, setMobileActiveIdx] = useState<number>(0);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') setSelectedIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
      if (e.key === 'ArrowLeft') setSelectedIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedIdx]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryImages.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <section
      id="gallery"
      style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-white)',
        minHeight: '100vh',
        paddingTop: '90px',
        paddingBottom: '4rem',
        position: 'relative',
        zIndex: 5,
        width: '100%',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 1.25rem',
        }}
      >
        {/* ====================================================================
           1. DESKTOP MASONRY/GRID WITH UNCROPPED FULL NATURAL IMAGES
           ==================================================================== */}
        <div className="gallery-desktop-grid">
          {galleryImages.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              onClick={() => setSelectedIdx(idx)}
              className="gallery-image-frame interactive-element"
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'var(--surface-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
              }}
            >
              <img
                src={src}
                alt={`Gallery photo ${idx + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="gallery-pure-img"
              />
            </motion.div>
          ))}
        </div>

        {/* ====================================================================
           2. MOBILE VIEW: SINGLE MAIN UNCROPPED IMAGE + BOTTOM THUMBNAIL STRIP
           ==================================================================== */}
        <div className="gallery-mobile-view">
          {/* Main Single Featured Image Container (Uncropped) */}
          <div
            onClick={() => setSelectedIdx(mobileActiveIdx)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              minHeight: '260px',
              maxHeight: '65vh',
              marginBottom: '1.25rem',
              cursor: 'pointer',
              backgroundColor: 'var(--surface-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={mobileActiveIdx}
                src={galleryImages[mobileActiveIdx]}
                alt={`Gallery photo ${mobileActiveIdx + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </AnimatePresence>

            {/* Counter badge */}
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-white)',
                backgroundColor: 'var(--surface-card-hover)',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(8px)',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
              }}
            >
              {mobileActiveIdx + 1} / {galleryImages.length}
            </span>
          </div>

          {/* Bottom Small Thumbnail Browse Strip */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            className="no-scrollbar"
          >
            {galleryImages.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setMobileActiveIdx(idx)}
                style={{
                  flexShrink: 0,
                  width: '64px',
                  height: '48px',
                  overflow: 'hidden',
                  border: 'none',
                  opacity: mobileActiveIdx === idx ? 1 : 0.4,
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: 'var(--surface-card)',
                  transition: 'opacity 0.2s ease, background-color 0.3s ease',
                  outline: mobileActiveIdx === idx ? '2px solid var(--accent-purple)' : 'none',
                  outlineOffset: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
         3. FULL-SCREEN LIGHTBOX MODAL (100% UNCROPPED FULL VIEW)
         ==================================================================== */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              backgroundColor: 'var(--bg-dark)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem',
              transition: 'background-color 0.3s ease',
            }}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-gray-muted)', letterSpacing: '0.05em' }}>
                {selectedIdx + 1} / {galleryImages.length}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx(null);
                }}
                className="interactive-element"
                aria-label="Close modal"
                style={{
                  background: 'var(--surface-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-white)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Center Image Display (Uncropped Contain) */}
            <div
              style={{
                position: 'relative',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 0',
              }}
            >
              <motion.img
                key={selectedIdx}
                src={galleryImages[selectedIdx]}
                alt={`Full uncropped photo ${selectedIdx + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '96vw',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                }}
              />

              {/* Prev Arrow Button */}
              <button
                onClick={handlePrev}
                className="interactive-element"
                aria-label="Previous image"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--surface-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-white)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.2s ease',
                  zIndex: 20,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* Next Arrow Button */}
              <button
                onClick={handleNext}
                className="interactive-element"
                aria-label="Next image"
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--surface-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-white)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.2s ease',
                  zIndex: 20,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {/* Modal Bottom Thumbnail Strip Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.4rem',
                overflowX: 'auto',
                paddingTop: '0.25rem',
              }}
              className="no-scrollbar"
            >
              {galleryImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    width: '52px',
                    height: '38px',
                    overflow: 'hidden',
                    border: 'none',
                    opacity: selectedIdx === idx ? 1 : 0.35,
                    cursor: 'pointer',
                    padding: 0,
                    backgroundColor: 'var(--surface-card)',
                    transition: 'opacity 0.2s ease, background-color 0.3s ease',
                    outline: selectedIdx === idx ? '2px solid var(--accent-purple)' : 'none',
                    outlineOffset: '-2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img src={src} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-desktop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: start;
        }

        .gallery-image-frame:hover .gallery-pure-img {
          transform: scale(1.025);
        }

        .gallery-mobile-view {
          display: none;
        }

        @media (max-width: 900px) {
          .gallery-desktop-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .gallery-desktop-grid {
            display: none !important;
          }
          .gallery-mobile-view {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
