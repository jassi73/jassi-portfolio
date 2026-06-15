import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import jassiProfile from '../assets/Jassi.jpeg';
import resumePdf from '../assets/Jasa_Ram_Resume.pdf';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 1. 3D Tilt Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation angles (max tilt = 10 degrees)
    const maxTilt = 8;
    const rX = -(mouseY / (height / 2)) * maxTilt;
    const rY = (mouseX / (width / 2)) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // 2. Card Background Particles Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number }> = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 0.3 + 0.1,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#7C5CFF';

      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'var(--bg-dark)',
        paddingTop: '90px',
        overflow: 'hidden',
      }}
    >
      {/* Background patterns */}
      <div className="tech-grid-bg" />
      <div className="radial-glow-spot" style={{ top: '-10%', right: '10%' }} />
      <div className="radial-glow-spot" style={{ bottom: '-20%', left: '5%' }} />

      <div className="container-saas" style={{ width: '100%', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '32% 38% 30%',
            alignItems: 'center',
            gap: '2.5rem',
            position: 'relative',
          }}
          className="hero-layout-row"
        >
          {/* 1. Left Column: Jassi's Credentials, Branding & Introduction Card (32% width) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              gap: '1.5rem',
            }}
            className="hero-left-col"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Massive Name (overlaps photo shoulder) */}
              <h1
                className="title-hero"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3.6rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-white)',
                  marginRight: '-150px', // Pull right to sit in front of photo shoulder
                  position: 'relative',
                  zIndex: 20,
                  marginBottom: '1rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Jassi Parihar<span style={{ color: 'var(--accent-purple)' }}>.</span>
              </h1>

              {/* Short Accent Line (like reference) */}
              <div
                className="hero-accent-line"
                style={{
                  width: '65px',
                  height: '4px',
                  backgroundColor: 'var(--accent-purple)',
                  marginBottom: '1.5rem',
                  boxShadow: '0 0 10px rgba(124, 92, 255, 0.4)',
                }}
              />
            </motion.div>

            {/* Introduction Card (Moved from Right Column) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="saas-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                zIndex: 20,
              }}
            >
              {/* Introduction Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: 600 }}>— Introduction</span>
              </div>

              {/* Editorial Title */}
              <h2
                style={{
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)',
                  color: 'var(--text-white)',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                }}
              >
                Frontend Engineer &amp; Full Stack AI Developer, based in Pune.
              </h2>

              {/* Description */}
              <p
                style={{
                  color: 'var(--text-gray-muted)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                I build scalable web applications, AI-powered tools, and modern digital experiences that solve real-world problems.
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={scrollToProjects} className="btn-primary-glow interactive-element" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', boxShadow: 'none' }}>
                  <span>View Projects</span>
                </button>
                <a
                  href={resumePdf}
                  download="Jasa_Ram_Resume.pdf"
                  className="btn-secondary-border interactive-element"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}
                >
                  <span>Download Resume</span>
                </a>
              </div>
            </motion.div>

            {/* Mini Social Icons on the bottom-left (like reference) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.5rem' }}
            >
              {/* GitHub */}
              <a href="https://github.com/jassi73" target="_blank" rel="noreferrer" className="interactive-element social-icon-link" aria-label="GitHub">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/jasa-ram-6a075a139/" target="_blank" rel="noreferrer" className="interactive-element social-icon-link" aria-label="LinkedIn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* 2. Center Column: Large Portrait Cutout Photo (38% width) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
            className="hero-center-col"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="hero-photo-wrapper"
              style={{
                width: '100%',
                maxWidth: '380px',
                height: '520px',
                position: 'relative',
              }}
            >
              {/* Fade all edges elliptical gradient mask to blend photo background into page */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)',
                }}
                className="hero-layered-photo"
              >
                <img
                  src={jassiProfile}
                  alt="Jassi Parihar Developer Headshot"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.9,
                  }}
                />
              </div>

              {/* Subtle background glow behind the photo */}
              <div
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '240px',
                  height: '240px',
                  background: 'radial-gradient(circle, rgba(124, 92, 255, 0.2) 0%, rgba(0,0,0,0) 70%)',
                  zIndex: -1,
                  filter: 'blur(25px)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </div>

          {/* 3. Right Column: 3D Floating Dashboard Card (30% width) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 10,
            }}
            className="hero-right-col"
          >
            {/* 3D Floating Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                perspective: '1000px',
              }}
            >
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setIsHovered(true)}
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
                  transition: isHovered ? 'none' : 'transform 0.5s ease',
                  transformStyle: 'preserve-3d',
                  position: 'relative',
                }}
                className="saas-card"
              >
                {/* Background particle canvas overlay inside the card */}
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />

                {/* Card glow borders */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: '1px solid var(--accent-purple)',
                    borderRadius: '12px',
                    opacity: isHovered ? 0.3 : 0.08,
                    pointerEvents: 'none',
                    zIndex: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* Card Content */}
                <div style={{ position: 'relative', zIndex: 5, transform: 'translateZ(20px)' }}>
                  {/* Status header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '1.25rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span className="label-saas">SYSTEM_METRICS</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#34c759',
                          borderRadius: '50%',
                          display: 'inline-block',
                          boxShadow: '0 0 8px #34c759',
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-gray-muted)' }}>
                        ONLINE
                      </span>
                    </div>
                  </div>

                  {/* Stat blocks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Experience */}
                    <div>
                      <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        EXPERIENCE
                      </span>
                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-white)' }}>
                        5+ Years Scaling Startup Products
                      </p>
                    </div>

                    {/* Focus */}
                    <div>
                      <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        CURRENT FOCUS
                      </span>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-gray-light)' }}>
                        LLM Agents, Vector Caches, and Canvas Visualizations
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', display: 'block', marginBottom: '0.5rem' }}>
                        PRIMARY STACK
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {['React', 'TypeScript', 'Next.js', 'Python', 'FastAPI', 'Redis', 'Docker'].map((tech) => (
                          <span
                            key={tech}
                            style={{
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-mono)',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '4px',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div
                      style={{
                        marginTop: '0.5rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)' }}>AVAILABILITY</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-purple)' }}>ACCEPTING CONTRACTS</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .social-icon-link {
          color: var(--text-gray-muted);
          transition: color 0.2s, transform 0.2s;
        }
        .social-icon-link:hover {
          color: var(--text-white);
          transform: translateY(-2px);
        }
        .light-theme .social-icon-link:hover {
          color: var(--accent-purple);
        }
        .hero-layered-photo {
          background-color: var(--bg-dark);
          border: none !important;
          box-shadow: none !important;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .light-theme .hero-layered-photo {
          border: none !important;
          box-shadow: none !important;
        }
        @media (max-width: 960px) {
          .hero-layout-row {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .hero-left-col,
          .hero-center-col,
          .hero-right-col {
            width: 100% !important;
            max-width: 450px !important;
            margin: 0 auto !important;
          }
          .hero-left-col {
            text-align: center !important;
            order: 2 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-left-col h1 {
            margin-right: 0 !important;
            white-space: normal !important;
            text-align: center !important;
          }
          .hero-left-col .hero-accent-line {
            margin: 1rem auto 2rem auto !important;
          }
          .hero-left-col div[style*="display: flex"] {
            justify-content: center !important;
          }
          .hero-center-col {
            order: 1 !important;
          }
          .hero-right-col {
            order: 3 !important;
            text-align: center !important;
          }
          .hero-right-col div[style*="display: flex"] {
            justify-content: center !important;
          }
          .hero-right-col h2,
          .hero-right-col p {
            text-align: center !important;
            max-width: 100% !important;
          }
          .hero-photo-wrapper {
            height: 340px !important;
            max-width: 260px !important;
          }
          .hero-layered-photo {
            width: 260px !important;
            height: 340px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}
