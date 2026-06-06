import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
  bullets: string[];
}

const timelineData: TimelineItem[] = [
  {
    year: '2024 - PRESENT',
    role: 'Software Engineer',
    company: 'Newron – Vast SaaS Educational ERP Startup',
    description: 'Led end-to-end system design, modular frontend architecture, and core modules development of a multi-tenant SaaS School ERP platform (ELERN) from scratch in a high-growth environment.',
    bullets: [
      'Engineered 6 core modules from scratch in a monorepo structure: Helpdesk support ticketing, Utility operations, Book Wise Library Management, student Discipline registers, Hostel administration, and Transport route trackers.',
      'Developed and published hybrid cross-platform Student and Employee mobile applications utilizing React Native WebView containers for fast cross-platform deployment.',
      'Architected real-time Socket.io and native WebSocket channels for live support chat messaging, room scopes, and instant data notifications.',
      'Designed interactive administrative reporting dashboards using React ApexCharts, React Query for optimized cache sync, and Tailwind CSS for responsive components.',
      'Guided clean system development using Claude AI and Cursor AI coding pipelines, translating Figma designer prototypes directly into production layouts.'
    ]
  },
  {
    year: '2022 - 2023',
    role: 'Frontend Developer',
    company: 'Qdegrees (Buildstorey Startup)',
    description: 'Designed and engineered the end-to-end B2B & B2C building materials marketplace (Buildstorey) from scratch, supporting Amazon-style online retail and contract sales.',
    bullets: [
      'Architected the full system design and codebase using Next.js with Server-Side Rendering (SSR) to optimize SEO ranking in Chrome.',
      'Designed and implemented multi-role login portals and supplier onboarding checksheets from scratch.',
      'Built a high-performance backend using Node.js, Express, and MongoDB, designing scalable schemas and query indexes.',
      'Optimized client-side state transitions with Redux Saga to manage product catalog updates across 14 materials categories.'
    ]
  }
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. Line drawing animation matching scroll
    const line = lineRef.current;
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 30%',
            end: 'bottom 70%',
            scrub: true,
          },
        }
      );
    }

    // 2. Node point activations and content reveals on scroll
    nodeRefs.current.forEach((node) => {
      if (!node) return;
      const dot = node.querySelector('.timeline-dot');
      const content = node.querySelector('.timeline-content');

      if (dot && content) {
        gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top 65%',
            end: 'top 45%',
            toggleActions: 'play none none reverse',
          }
        })
        .to(dot, { backgroundColor: 'var(--text-white)', scale: 1.3, duration: 0.3 })
        .to(content, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      style={{
        backgroundColor: 'var(--bg-dark)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 5,
      }}
      className="section-spacing"
    >
      <div className="container-saas">
        {/* Section Title */}
        <div style={{ marginBottom: '2.2rem' }}>
          <span className="label-saas">05 // EXPERIENCE TIMELINE</span>
          <h2
            className="title-hero"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              marginTop: '1rem',
              color: 'var(--text-white)',
            }}
          >
            Engineering Journey
          </h2>
        </div>

        {/* Timeline Container */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1000px',
            margin: '0 auto',
            paddingLeft: '3rem', // Line space offset
          }}
        >
          {/* Vertical Base Line (Background Track) */}
          <div
            style={{
              position: 'absolute',
              left: '6px', // Centered in the line space
              top: '0',
              bottom: '0',
              width: '1px',
              backgroundColor: 'var(--border-subtle)',
              zIndex: 1,
            }}
          />

          {/* Animated Line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              left: '6px',
              top: '0',
              bottom: '0',
              width: '1px',
              backgroundColor: 'var(--text-white)',
              transformOrigin: 'top',
              zIndex: 2,
            }}
          />

          {/* Timeline Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {timelineData.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => (nodeRefs.current[idx] = el)}
                style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  gap: '2rem',
                }}
                className="timeline-item-container"
              >
                {/* Timeline Dot (Sticks on the left line) */}
                <div
                  className="timeline-dot"
                  style={{
                    position: 'absolute',
                    left: '-48px', // Align precisely on the line
                    top: '6px',
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--border-subtle)',
                    border: '3px solid var(--bg-dark)',
                    zIndex: 3,
                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                  }}
                />

                {/* Left: Year (Static, always readable) */}
                <div className="label-saas" style={{ paddingTop: '5px', color: 'var(--text-gray-muted)' }}>
                  {item.year}
                </div>

                {/* Right: Content Card (Reveals dynamically) */}
                <div
                  className="timeline-content"
                  style={{
                    opacity: 0.15, // Starts dimmed
                    transform: 'translateY(15px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: 'var(--font-sans)',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-white)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {item.role}
                  </h4>
                  <span
                    className="label-saas"
                    style={{
                      color: 'var(--accent-purple)',
                      display: 'block',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                    }}
                  >
                    {item.company}
                  </span>
                  <p
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.5,
                      color: 'var(--text-gray-light)',
                      marginBottom: '1.25rem',
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </p>

                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {item.bullets.map((bullet, bulletIdx) => (
                      <li
                        key={bulletIdx}
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--text-gray-muted)',
                          display: 'flex',
                          alignItems: 'start',
                          gap: '0.5rem',
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ minWidth: '4px', height: '4px', backgroundColor: 'var(--accent-purple)', borderRadius: '50%', marginTop: '7px' }} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .timeline-item-container {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
          .timeline-dot {
            left: -46px !important;
          }
        }
      `}</style>
    </section>
  );
}
