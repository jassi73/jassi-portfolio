import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Paragraphs to animate word-by-word
  const p1Text = "I believe coding is more than writing instructions for a machine. It is a form of digital craftsmanship—the art of structuring logic to serve human behavior. I bridge the gap between design rigor and complex engineering architectures, ensuring that every interaction feels intentional.";
  const p2Text = "Over the past 5+ years, I have worked with startups and fast-moving teams to take ideas from sketches to production. I specialize in designing fluid frontend systems, robust backend APIs, and deploying modern cloud setups that scale without friction.";
  const p3Text = "The next wave of product design belongs to intelligent, context-aware systems. My focus is on merging large language models, real-time web canvases, and smart user interfaces to build tools that feel like extensions of human intelligence rather than static dashboards.";

  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const pRefs = [p1Ref, p2Ref, p3Ref];
    
    pRefs.forEach((ref) => {
      const el = ref.current;
      if (!el) return;

      // Split text into words, wrapping each word in a span
      const text = el.innerText;
      el.innerHTML = '';
      
      const words = text.split(' ');
      words.forEach((word) => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        span.style.opacity = '0.15';
        span.style.display = 'inline-block';
        span.style.transition = 'opacity 0.3s ease';
        el.appendChild(span);
      });

      // Animate word opacities on scroll
      const spans = el.querySelectorAll('span');
      gsap.to(spans, {
        opacity: 1,
        stagger: 0.02,
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      id="story"
      ref={containerRef}
      className="section-padding"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
      }}
    >
      <div className="container-editorial">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '3rem',
          }}
        >
          {/* Left Sticky Column */}
          <div
            style={{
              gridColumn: 'span 4',
              height: 'fit-content',
              position: 'sticky',
              top: '140px', // spacing below header
            }}
            className="sticky-col"
          >
            <div className="label-mono" style={{ marginBottom: '2rem' }}>
              01 // THE STORY
            </div>
            <h3
              className="h-medium"
              style={{
                fontFamily: 'var(--font-headings)',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Engineering rigor meets design empathy.
            </h3>
          </div>

          {/* Right Scrolling Column */}
          <div
            style={{
              gridColumn: 'span 8',
              display: 'flex',
              flexDirection: 'column',
              gap: '4.5rem',
            }}
            className="scroll-col"
          >
            <div>
              <p
                ref={p1Ref}
                className="text-editorial"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 2.2rem)',
                  lineHeight: 1.35,
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {p1Text}
              </p>
            </div>

            <div>
              <p
                ref={p2Ref}
                className="text-editorial"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 2.2rem)',
                  lineHeight: 1.35,
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {p2Text}
              </p>
            </div>

            <div>
              <p
                ref={p3Ref}
                className="text-editorial"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 2.2rem)',
                  lineHeight: 1.35,
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {p3Text}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .sticky-col {
            position: relative !important;
            top: 0 !important;
            grid-column: span 12 !important;
            margin-bottom: 2rem;
          }
          .scroll-col {
            grid-column: span 12 !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
