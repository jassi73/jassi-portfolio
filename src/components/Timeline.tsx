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
    year: 'JAN 2024 - PRESENT',
    role: 'Software Engineer',
    company: 'Newron – School ERP Startup · Pune, Maharashtra',
    description: 'Designed and built a multi-role School ERP platform serving 15+ institutions. Built responsive web applications and wrapped them in hybrid mobile containers, integrated real-time ticketing, live GPS tracking, financial reconciliation, and role-based access control.',
    bullets: [
      'Multi-portal School ERP: Designed and built a multi-role School ERP platform serving 15+ institutions. The admin panel was built with React.js and Tailwind CSS for a clean, responsive experience. The student, parent, and employee apps were built with React.js and Material UI and wrapped in React Native WebView, making the web application accessible as a native mobile app without a separate codebase.',
      'Real-time ticketing system: Architected a Helpdesk and Ticketing module using event-driven architecture with WebSockets (Socket.io) and a Node.js backend. The system processed over 100,000 tickets in 7 months with a 92% resolution rate, cutting average response time from 48 hours down to 3 hours.',
      'AWS deployment: Deployed frontend builds on AWS S3 with CloudFront for CDN delivery and used EC2 instances for backend hosting. Set up CI/CD pipelines for automated builds and deployments, removing the need for manual releases.',
      'Live GPS tracking: Built a real-time school bus tracking feature with a Node.js backend streaming live GPS coordinates and Google Maps API integrated into the React frontend, covering 50+ buses. Parent inquiry calls dropped by 78% after launch.',
      'Analytics dashboards and modules: Developed data-intensive admin dashboards using React and ApexCharts, backed by optimized PostgreSQL queries, giving school administrators real-time visibility into attendance, finances, and resource utilization. Also built the Discipline Module for tracking and managing student conduct records, and the Student-Parent Connect Module enabling direct in-app communication between parents and school staff.',
      'Payment integrations: Integrated HDFC, Razorpay, and PayU payment gateways via RESTful APIs with automated reconciliation workflows, improving transaction success rates and reducing manual finance work.',
      'Auth and access control: Implemented JWT-based authentication and role-based access control across all user roles, keeping each portal secure and ensuring users only access what they are permitted to.'
    ]
  },
  {
    year: 'FEB 2022 - OCT 2023',
    role: 'Frontend Developer',
    company: 'Qdegrees · Jaipur, Rajasthan',
    description: 'Led frontend development of a large-scale building-materials e-commerce platform (Buildstorey) covering 45+ product categories from initial project setup through to production launch.',
    bullets: [
      'Large-scale e-commerce platform: Led frontend development of a building-materials e-commerce platform using Next.js and React.js with Material UI, covering 45+ product categories from initial project setup through to production launch.',
      'SSR and SSG for SEO: Implemented server-side rendering and static site generation in Next.js, which noticeably improved organic search rankings, cut page load times, and boosted Core Web Vitals scores after deployment.',
      'Python backend collaboration: Worked closely with the Python backend team to integrate REST APIs across product listings, inventory, user sessions, and checkout flows, ensuring smooth and reliable data exchange between frontend and backend.',
      'Microsoft Azure: Assisted in deploying frontend builds on Azure Static Web Apps and integrated Azure Blob Storage for product image hosting and CDN delivery, improving asset load times across the platform.',
      'Multi-role onboarding: Built buyer and seller onboarding flows with dynamic form validations, conditional logic, and API integrations, improving conversion rates and reducing drop-offs during signup.',
      'Redux Saga for async state: Managed complex async workflows for inventory sync, product filtering, sorting, and pagination using Redux Saga, keeping the UI responsive even with large data sets.'
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
