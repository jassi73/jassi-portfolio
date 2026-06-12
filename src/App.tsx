import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Import SaaS layout components
import Header from './components/Header';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import AILab from './components/AILab';
import Contact from './components/Contact';
import Blog from './components/Blog';
import ChatAdmin from './components/ChatAdmin';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [route, setRoute] = useState<'home' | 'blog' | 'blog-detail' | 'project-detail' | 'chat-admin'>('home');
  const [blogId, setBlogId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog/')) {
        const id = hash.replace('#blog/', '');
        setRoute('blog-detail');
        setBlogId(id);
        window.scrollTo({ top: 0 });
      } else if (hash === '#blog') {
        setRoute('blog');
        setBlogId(null);
        window.scrollTo({ top: 0 });
      } else if (hash.startsWith('#project/')) {
        setRoute('project-detail');
        setBlogId(null);
        window.scrollTo({ top: 0 });
      } else if (hash === '#admin/chat') {
        setRoute('chat-admin');
        setBlogId(null);
        window.scrollTo({ top: 0 });
      } else {
        setRoute('home');
        setBlogId(null);
        if (hash) {
          if (isFirstLoad.current) {
            isFirstLoad.current = false;
            window.scrollTo({ top: 0 });
            return;
          }
          const targetId = hash.replace('#', '');
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }
      }
      isFirstLoad.current = false;
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    (window as any).lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Cleanup scrolling on unmount
    return () => {
      (window as any).lenis = null;
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Repeating background noise grain overlay */}
      <div className="noise-overlay" />

      {/* Floating navigation header */}
      <Header currentRoute={route} />

      {/* Page Sections */}
      <main style={{ paddingTop: route !== 'home' ? '80px' : '0' }}>
        {route === 'home' ? (
          <>
            {/* Section 1: Hero & 3D Interactive Card */}
            <Hero />

            {/* Section 2: Technical Expertise & Skills */}
            <Expertise />

            {/* Section 3: Experience Timeline */}
            <Timeline />

            {/* Section 4: Case studies with architecture maps */}
            <Projects />

            {/* Section 5: Interactive R&D Demos (Chat, Resume, Agent, RAG) */}
            <AILab />

            {/* Section 6: Contact & Footer */}
            <Contact />
          </>
        ) : route === 'project-detail' ? (
          <Projects />
        ) : route === 'chat-admin' ? (
          <ChatAdmin />
        ) : (
          <Blog id={blogId} />
        )}
      </main>

      {/* Ephemeral Real-time Visitor Live Chat Widget */}
      {route !== 'chat-admin' && <ChatWidget />}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="interactive-element scroll-to-top-btn"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
