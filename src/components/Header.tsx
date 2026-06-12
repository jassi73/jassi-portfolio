import { useState, useEffect } from 'react';

export default function Header({ currentRoute = 'home' }: { currentRoute?: 'home' | 'blog' | 'blog-detail' | 'project-detail' | 'chat-admin' }) {
  const [time, setTime] = useState('');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Theme Syncing
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Live clock and scroll hide/show listener
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer for active section indicator
  useEffect(() => {
    if (currentRoute !== 'home') {
      setActiveSection('blog');
      return;
    }

    const sections = ['hero', 'expertise', 'experience', 'projects', 'ailab', 'contact'];
    const elements = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -45% 0px', // Trigger when section occupies the middle of screen
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Check if we are near the bottom of the page to avoid overriding contact highlight
          const threshold = 120;
          const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
          if (!isAtBottom) {
            setActiveSection(entry.target.id);
          }
        }
      });
    }, observerOptions);

    elements.forEach((el) => observer.observe(el));

    const handleScrollActive = () => {
      const threshold = 120; // px from bottom
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
      if (isAtBottom) {
        setActiveSection('contact');
      }
    };
    window.addEventListener('scroll', handleScrollActive, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleScrollActive);
    };
  }, [currentRoute]);

  const getSectionId = (label: string) => {
    if (label === 'Work') return 'projects';
    if (label === 'AI Lab') return 'ailab';
    if (label === 'Contact') return 'contact';
    if (label === 'Skills') return 'expertise';
    if (label === 'Experience') return 'experience';
    if (label === 'Blog') return 'blog';
    return label.toLowerCase().replace(' ', '');
  };

  const scrollToSection = (id: string) => {
    if (id === 'blog') {
      window.location.hash = '#blog';
      return;
    }

    if (currentRoute !== 'home') {
      // Go to home with hash
      window.location.hash = `#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transform: 'translateY(0)',
        transition: 'background-color 0.3s ease',
        backgroundColor: lastScrollY > 50 
          ? (theme === 'dark' ? 'rgba(5, 5, 5, 0.85)' : 'rgba(250, 249, 252, 0.85)') 
          : 'transparent',
      }}
    >
      <div
        className="container-saas"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand Wordmark with Carlos Mendoza-style Logo Icon */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="interactive-element"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
          }}
        >
          {/* Purple smile/crescent logo icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6V18Z" fill="var(--accent-purple)" />
          </svg>
          
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontSize: '1.25rem',
              color: 'var(--text-white)',
            }}
          >
            JASA<span style={{ color: 'var(--accent-purple)' }}>.DEV</span>
          </span>
        </div>

        {/* Live Details (Clock / Status) */}
        <div
          className="label-saas text-editorial hidden-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            color: 'var(--text-gray-muted)',
            fontSize: '0.65rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#34c759',
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 0 6px #34c759',
              }}
            />
            DISPATCH ACTIVE
          </span>
          <span style={{ opacity: 0.2 }}>|</span>
          <span>PUNE, IN</span>
          <span style={{ opacity: 0.2 }}>|</span>
          <span style={{ minWidth: '95px' }}>{time}</span>
        </div>

        {/* Navigation & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <nav
            className="nav-desktop"
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {['Skills', 'Experience', 'Work', 'AI Lab', 'Contact'].map((section) => {
              const sectionId = getSectionId(section);
              const isActive = currentRoute !== 'home' 
                ? (sectionId === 'blog')
                : (activeSection === sectionId);
              return (
                <div
                  key={section}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() => scrollToSection(sectionId)}
                    className="interactive-element"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isActive ? 'var(--text-white)' : 'var(--text-gray-muted)',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.82rem',
                      padding: '0.25rem 0',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-white)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-gray-muted)';
                    }}
                  >
                    {section}
                  </button>
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'var(--accent-purple)',
                        borderRadius: '50%',
                        boxShadow: '0 0 6px var(--accent-purple)',
                        display: 'block',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="interactive-element"
            aria-label="Toggle Theme"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-gray-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              zIndex: 110,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-white)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray-muted)')}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Hamburger Menu Icon (Mobile Only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="interactive-element menu-toggle"
            aria-label="Toggle Menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-white)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 110,
              transition: 'color 0.2s',
            }}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: theme === 'dark' ? 'rgba(5, 5, 5, 0.98)' : 'rgba(250, 249, 252, 0.98)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {['Skills', 'Experience', 'Work', 'AI Lab', 'Contact'].map((section) => {
            const sectionId = getSectionId(section);
            const isActive = currentRoute !== 'home' 
              ? (sectionId === 'blog')
              : (activeSection === sectionId);
            return (
              <button
                key={section}
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection(sectionId);
                }}
                className="interactive-element"
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-white)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.02em',
                  transition: 'color 0.2s',
                  padding: '0.5rem 1rem',
                  position: 'relative',
                }}
              >
                {section}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'var(--accent-purple)',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px var(--accent-purple)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .nav-desktop {
            display: none !important;
          }
          .menu-toggle {
            display: flex !important;
          }
          header {
            height: 70px !important;
          }
        }
      `}</style>
    </header>
  );
}
