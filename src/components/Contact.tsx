import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [statusMsg, setStatusMsg] = useState('');
  
  // Interactive UI States
  const [copied, setCopied] = useState(false);
  const [delhiTime, setDelhiTime] = useState('');
  const [activeFocus, setActiveFocus] = useState<string | null>(null);

  // Mouse Coordinates for Interactive Radial Card Glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // High-Tech Terminal dispatch simulation states
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<boolean | null>(null);

  // Delhi Live Time Sync (IST, Asia/Kolkata)
  useEffect(() => {
    const updateDelhiClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setDelhiTime(now.toLocaleTimeString('en-US', options));
    };
    updateDelhiClock();
    const timer = setInterval(updateDelhiClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jessparihar73@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatusMsg('ALL FIELDS ARE REQUIRED.');
      return;
    }

    // Open terminal modal overlay
    setIsModalOpen(true);
    setDispatchSuccess(null);
    setStatusMsg('');
    setIsDispatching(true);
    setDispatchLogs([]);

    const addLog = (text: string) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setDispatchLogs((prev) => [...prev, `[${timeStr}] ${text}`]);
    };

    try {
      addLog('INITIATING SECURE ROUTER PACKET DISPATCH...');
      await new Promise((r) => setTimeout(r, 450));
      addLog(`ENVELOPE STRUCTURING FOR SENDER: "${formState.name.toUpperCase()}"`);
      await new Promise((r) => setTimeout(r, 350));

      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

      if (!accessKey) {
        addLog('WARNING: VITE_WEB3FORMS_KEY NOT SET IN ENVIRONMENT.');
        await new Promise((r) => setTimeout(r, 400));
        addLog('RUNNING IN OFFLINE DEMO MODE (GET ACCESS KEY AT WEB3FORMS.COM).');
        await new Promise((r) => setTimeout(r, 600));
        addLog('TRANSMITTING DEMO DATA PACKETS (PORT 443)...');
        await new Promise((r) => setTimeout(r, 600));
        addLog('DEMO DISPATCH SUCCESS. PACKET ACK RECEIVED (200 OK).');

        setIsDispatching(false);
        setDispatchSuccess(true);
        setFormState({ name: '', email: '', message: '' });
        setStatusMsg('MESSAGE DISPATCHED SUCCESSFULLY (DEMO MODE).');
        return;
      }

      addLog('ESTABLISHING SECURE GATEWAY CONNECTION (web3forms.com)...');
      await new Promise((r) => setTimeout(r, 500));
      addLog('TRANSMITTING PACKETS TO EMAIL ROUTER...');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New Portfolio Message from ${formState.name}`,
          from_name: 'JASA.DEV Portfolio',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addLog('GATEWAY ACK RECEIVED: 200 OK.');
        await new Promise((r) => setTimeout(r, 400));
        addLog('MESSAGE ROUTED SUCCESSFULLY TO jessparihar73@gmail.com.');

        setIsDispatching(false);
        setDispatchSuccess(true);
        setFormState({ name: '', email: '', message: '' });
        setStatusMsg('MESSAGE DISPATCHED SUCCESSFULLY.');
      } else {
        addLog(`GATEWAY ERROR: ${data.message || 'TRANSMISSION FAILED.'}`);
        setIsDispatching(false);
        setDispatchSuccess(false);
        setStatusMsg('TRANSMISSION FAILED. PLEASE VERIFY KEY.');
      }
    } catch (err) {
      addLog('NETWORKING ERROR: FAILED TO CONNECT TO THE GATEWAY SERVICE.');
      setIsDispatching(false);
      setDispatchSuccess(false);
      setStatusMsg('NETWORKING ERROR. PLEASE CHECK CONNECTION.');
    }
  };

  return (
    <section
      id="contact"
      style={{
        backgroundColor: 'var(--bg-dark)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 5,
      }}
      className="section-spacing"
    >
      <div className="container-saas">
        {/* Section Header */}
        <div style={{ marginBottom: '2.2rem' }}>
          <span className="label-saas">03 // COMMUNICATIONS</span>
          <h2
            className="title-hero"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              marginTop: '1rem',
              color: 'var(--text-white)',
            }}
          >
            Initiate Contact
          </h2>
          <p style={{ color: 'var(--text-gray-muted)', marginTop: '1rem', maxWidth: '600px' }}>
            Submit a structured message or click to copy my email vector.
          </p>
        </div>

        {/* Single Premium Communications Dashboard Card */}
        <div
          ref={cardContainerRef}
          onMouseMove={handleCardMouseMove}
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={() => setIsHoveringCard(false)}
          className="saas-card contact-card"
          style={{
            backgroundColor: 'var(--surface-card-darker)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(124, 92, 255, 0.03)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Mouse-Tracking Background Gradient Glow */}
          {isHoveringCard && (
            <div
              style={{
                position: 'absolute',
                top: `${mousePos.y}px`,
                left: `${mousePos.x}px`,
                width: '450px',
                height: '450px',
                background: 'radial-gradient(circle, rgba(124, 92, 255, 0.06) 0%, rgba(124, 92, 255, 0) 70%)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 0,
                transition: 'opacity 0.25s ease',
              }}
            />
          )}

          {/* Glowing Border Follower */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: '1px solid var(--accent-purple)',
              borderRadius: '16px',
              opacity: isHoveringCard ? 0.25 : 0.05,
              pointerEvents: 'none',
              zIndex: 1,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* 2-Column Grid inside the Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '4rem',
              alignItems: 'start',
              position: 'relative',
              zIndex: 2,
            }}
            className="contact-grid"
          >
            {/* Left Column: Coordinates & Copy Email Card */}
            <div style={{ gridColumn: 'span 5' }} className="contact-left-col">
              <h3
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-white)',
                  marginBottom: '1.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Direct Node Inquiries
              </h3>
              
              {/* Click to Copy Email Card with tactile micro-interactions */}
              <div
                onClick={handleCopyEmail}
                className="interactive-element email-copy-container"
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'var(--surface-input)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: copied ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                  boxShadow: copied ? '0 0 15px rgba(124, 92, 255, 0.1)' : 'none',
                  marginBottom: '2.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.borderColor = 'var(--accent-purple)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(124, 92, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div>
                  <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-muted)' }}>PRIMARY EMAIL</span>
                  <p className="contact-email-text" style={{ fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                    jessparihar73@gmail.com
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: copied ? 'rgba(52, 199, 89, 0.1)' : 'rgba(124,92,255,0.06)',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    color: copied ? '#34c759' : 'var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8536 4.14645C12.0488 4.34171 12.0488 4.65829 11.8536 4.85355L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536L3.14645 7.85355C2.95118 7.65829 2.95118 7.34171 3.14645 7.14645C3.34171 6.95118 3.65829 6.95118 3.85355 7.14645L6 9.29289L11.1464 4.14645C11.3417 3.95118 11.6582 3.95118 11.8536 4.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9.5V11.5C1 12.6046 1.89543 13.5 3 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V9.5M1 9.5V3C1 1.89543 1.89543 1 3 1H7.5M1 9.5H7.5M13.5 9.5V3.5C13.5 2.39543 12.6046 1.5 11.5 1.5H10.5M13.5 9.5H10.5M10.5 1.5V3.5C10.5 4.60457 11.3954 5.5 12.5 5.5M10.5 1.5H7.5" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  )}
                </div>

                {/* Inline "COPIED" badge */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      style={{
                        position: 'absolute',
                        right: '4.5rem',
                        backgroundColor: 'rgba(52, 199, 89, 0.15)',
                        border: '1px solid rgba(52, 199, 89, 0.3)',
                        color: '#34c759',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      COPIED!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Coordinates / Details Nodes */}
              <div
                className="coordinates-container"
                style={{
                  borderLeft: '2px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {/* Location Node with live Delhi Clock */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-purple)' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    LOCATION
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
                    <span className="contact-coord-value" style={{ color: 'var(--text-white)', fontWeight: 600 }}>Pune, MH, IN</span>
                    <span className="contact-coord-clock" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
                      {delhiTime || '00:00:00 PM'} (IST)
                    </span>
                  </div>
                </div>

                {/* Timezone Node */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    TIMEZONE
                  </span>
                  <span className="contact-coord-value" style={{ color: 'var(--text-gray-light)', fontWeight: 500 }}>IST (UTC +5:30)</span>
                </div>

                {/* GitHub Node */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GITHUB
                  </span>
                  <a
                    href="https://github.com/jassi73"
                    target="_blank"
                    rel="noreferrer"
                    className="interactive-element contact-coord-value"
                    style={{
                      color: 'var(--accent-purple)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <span>@jassi73</span>
                    <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.64645 11.3536C3.45118 11.5488 3.1346 11.5488 2.93934 11.3536C2.74408 11.1583 2.74408 10.8417 2.93934 10.6464L10.5 3L6 3C5.72386 3 5.5 2.77614 5.5 2.5C5.5 2.22386 5.72386 2 6 2L12.5 2C12.7761 2 13 2.22386 13 2.5L13 9C13 9.27614 12.7761 9.5 12.5 9.5C12.2239 9.5 12 9.27614 12 9L12 4.5L3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: SaaS Contact Form */}
            <div style={{ gridColumn: 'span 7' }} className="contact-right-col">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                
                {/* Custom Name Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="label-saas" htmlFor="saas-form-name" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', fontWeight: 600 }}>Name</label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--surface-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      borderColor: activeFocus === 'name' ? 'var(--accent-purple)' : 'var(--border-subtle)',
                      boxShadow: activeFocus === 'name' ? '0 0 10px rgba(124, 92, 255, 0.05)' : 'none',
                    }}
                  >
                    {/* Left glow focus bar indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        bottom: '15%',
                        width: '3px',
                        backgroundColor: activeFocus === 'name' ? 'var(--accent-purple)' : 'transparent',
                        borderRadius: '0 3px 3px 0',
                        transition: 'background-color 0.3s ease',
                      }}
                    />
                    
                    {/* SVG Icon */}
                    <span style={{ marginRight: '0.75rem', color: activeFocus === 'name' ? 'var(--accent-purple)' : 'var(--text-gray-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>

                    <input
                      id="saas-form-name"
                      type="text"
                      disabled={isDispatching}
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Enter your name"
                      onFocus={() => setActiveFocus('name')}
                      onBlur={() => setActiveFocus(null)}
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-white)',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9rem',
                        padding: '0.4rem 0',
                      }}
                    />
                  </div>
                </div>

                {/* Custom Email Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="label-saas" htmlFor="saas-form-email" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', fontWeight: 600 }}>Email</label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--surface-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      borderColor: activeFocus === 'email' ? 'var(--accent-purple)' : 'var(--border-subtle)',
                      boxShadow: activeFocus === 'email' ? '0 0 10px rgba(124, 92, 255, 0.05)' : 'none',
                    }}
                  >
                    {/* Left glow focus bar indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        bottom: '15%',
                        width: '3px',
                        backgroundColor: activeFocus === 'email' ? 'var(--accent-purple)' : 'transparent',
                        borderRadius: '0 3px 3px 0',
                        transition: 'background-color 0.3s ease',
                      }}
                    />
                    
                    {/* SVG Icon */}
                    <span style={{ marginRight: '0.75rem', color: activeFocus === 'email' ? 'var(--accent-purple)' : 'var(--text-gray-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </span>

                    <input
                      id="saas-form-email"
                      type="email"
                      disabled={isDispatching}
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Enter your email address"
                      onFocus={() => setActiveFocus('email')}
                      onBlur={() => setActiveFocus(null)}
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-white)',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9rem',
                        padding: '0.4rem 0',
                      }}
                    />
                  </div>
                </div>

                {/* Custom Message Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="label-saas" htmlFor="saas-form-msg" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', fontWeight: 600 }}>Message</label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      backgroundColor: 'var(--surface-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '0.65rem 1rem',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      borderColor: activeFocus === 'message' ? 'var(--accent-purple)' : 'var(--border-subtle)',
                      boxShadow: activeFocus === 'message' ? '0 0 10px rgba(124, 92, 255, 0.05)' : 'none',
                    }}
                  >
                    {/* Left glow focus bar indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '8%',
                        bottom: '8%',
                        width: '3px',
                        backgroundColor: activeFocus === 'message' ? 'var(--accent-purple)' : 'transparent',
                        borderRadius: '0 3px 3px 0',
                        transition: 'background-color 0.3s ease',
                      }}
                    />
                    
                    {/* SVG Icon */}
                    <span style={{ marginRight: '0.75rem', marginTop: '0.4rem', color: activeFocus === 'message' ? 'var(--accent-purple)' : 'var(--text-gray-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </span>

                    <textarea
                      id="saas-form-msg"
                      rows={4}
                      disabled={isDispatching}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe your project requirements..."
                      onFocus={() => setActiveFocus('message')}
                      onBlur={() => setActiveFocus(null)}
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-white)',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9rem',
                        padding: '0.3rem 0',
                        resize: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Submit Trigger with dispatch states */}
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="btn-primary-glow interactive-element"
                  style={{
                    alignSelf: 'flex-start',
                    boxShadow: 'none',
                    padding: '0.8rem 2.2rem',
                    backgroundColor: isDispatching ? 'var(--surface-card-hover)' : 'var(--accent-purple)',
                    border: isDispatching ? '1px solid var(--border-subtle)' : 'none',
                    color: isDispatching ? 'var(--text-gray-muted)' : '#ffffff',
                    cursor: isDispatching ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isDispatching ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                      <svg className="spinner-rotate" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="30 30" strokeDashoffset="0"></circle>
                      </svg>
                      <span>TRANSMITTING...</span>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Dispatch Message</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 7.5H13.5M13.5 7.5L9.5 3.5M13.5 7.5L9.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>

                {/* Status Messages (Inline error notifications only; successes open the modal) */}
                {statusMsg && !isDispatching && !dispatchSuccess && (
                  <div
                    className="label-saas"
                    style={{
                      color: '#ff453a',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginTop: '0.25rem',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff453a' }} />
                    {statusMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer Base Credits */}
        <div
          style={{
            marginTop: '8rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span className="label-saas" style={{ color: 'var(--text-gray-dark)', fontSize: '0.65rem' }}>
            JASA.DEV // © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </span>
          <span className="label-saas" style={{ color: 'var(--text-gray-dark)', fontSize: '0.65rem' }}>
            ENGINEERED WITH REACT • GSAP • FRAMER MOTION
          </span>
        </div>
      </div>

      {/* Floating Clipboard Copy Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              backgroundColor: 'var(--text-white)',
              color: 'var(--bg-dark)',
              padding: '0.8rem 1.8rem',
              borderRadius: '6px',
              zIndex: 9999,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              fontWeight: 700,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            EMAIL ADDRESS COPIED TO CLIPBOARD
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secure Terminal Dispatcher Overlay Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(2, 2, 4, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#020204',
                border: dispatchSuccess === false ? '1px solid #ff453a' : '1px solid var(--border-subtle)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: dispatchSuccess === false 
                  ? '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 69, 58, 0.1)' 
                  : '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(124, 92, 255, 0.1)',
                position: 'relative',
              }}
            >
              {/* Terminal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isDispatching 
                        ? 'var(--accent-purple)' 
                        : (dispatchSuccess ? '#34c759' : '#ff453a'),
                      boxShadow: isDispatching 
                        ? '0 0 8px var(--accent-purple)' 
                        : (dispatchSuccess ? '0 0 8px #34c759' : '0 0 8px #ff453a'),
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-white)' }}>
                    TERMINAL // COMMUNICATIONS_LOG
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isDispatching ? 'var(--text-gray-muted)' : (dispatchSuccess ? '#34c759' : '#ff453a'), fontWeight: 700 }}>
                  {isDispatching ? 'TRANSMITTING...' : (dispatchSuccess ? 'DISPATCHED' : 'FAULT')}
                </span>
              </div>

              {/* Terminal Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Console Output */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.95)',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  {dispatchLogs.map((log, idx) => {
                    const isSuccess = log.includes('SUCCESS') || log.includes('200 OK');
                    const isSystem = log.includes('RESOLVING') || log.includes('TUNNEL') || log.includes('TRANSMITTING') || log.includes('ESTABLISHING');
                    const isWarning = log.includes('WARNING') || log.includes('DEMO MODE');
                    const isError = log.includes('ERROR') || log.includes('FAILED');
                    let logColor = '#a9b2c3'; // default gray-blue
                    if (isSuccess) logColor = '#34c759'; // green
                    else if (isWarning) logColor = '#ffd60a'; // warning yellow
                    else if (isError) logColor = '#ff453a'; // error red
                    else if (isSystem) logColor = 'var(--accent-purple)'; // purple
                    
                    return (
                      <div key={idx} style={{ color: logColor, display: 'flex', gap: '0.5rem', lineHeight: 1.4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>&gt;</span>
                        <span>{log}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Success Animation & Message */}
                {!isDispatching && dispatchSuccess === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '0.8rem',
                      padding: '0.5rem 0',
                    }}
                  >
                    {/* Animated SVG Checkmark */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 54 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Circle path */}
                        <motion.circle
                          cx="27"
                          cy="27"
                          r="24"
                          stroke="#34c759"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                        {/* Check checkmark */}
                        <motion.path
                          d="M17 27l7 7 13-14"
                          stroke="#34c759"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
                        />
                      </svg>
                    </div>

                    <h4 style={{ color: 'var(--text-white)', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                      COMMUNICATION ENCRYPTED & SECURED
                    </h4>
                    <p style={{ color: 'var(--text-gray-light)', fontSize: '0.82rem', maxWidth: '340px', lineHeight: 1.4 }}>
                      Your message payload has been successfully dispatched to Jassi's endpoint.
                    </p>
                  </motion.div>
                )}

                {/* Failure Animation & Message */}
                {!isDispatching && dispatchSuccess === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '0.8rem',
                      padding: '0.5rem 0',
                    }}
                  >
                    {/* Animated SVG Warning */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 54 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Circle path */}
                        <motion.circle
                          cx="27"
                          cy="27"
                          r="24"
                          stroke="#ff453a"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                        {/* Cross marks */}
                        <motion.path
                          d="M19 19l16 16"
                          stroke="#ff453a"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' }}
                        />
                        <motion.path
                          d="M35 19L19 35"
                          stroke="#ff453a"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.4, duration: 0.3, ease: 'easeOut' }}
                        />
                      </svg>
                    </div>

                    <h4 style={{ color: 'var(--text-white)', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                      DISPATCH FAULT ENCOUNTERED
                    </h4>
                    <p style={{ color: 'var(--text-gray-light)', fontSize: '0.82rem', maxWidth: '340px', lineHeight: 1.4 }}>
                      The communication link could not be completed. Please review terminal output or verify your settings.
                    </p>
                  </motion.div>
                )}

                {/* Close Trigger (Success) */}
                {!isDispatching && dispatchSuccess === true && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setDispatchLogs([]);
                    }}
                    className="btn-primary-glow interactive-element"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      backgroundColor: '#34c759',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      boxShadow: '0 0 15px rgba(52, 199, 89, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#30b350';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(52, 199, 89, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#34c759';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(52, 199, 89, 0.2)';
                    }}
                  >
                    Close Secure Terminal
                  </motion.button>
                )}

                {/* Close Trigger (Failure) */}
                {!isDispatching && dispatchSuccess === false && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                    className="interactive-element"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      backgroundColor: '#271b1b',
                      color: '#ff453a',
                      border: '1px solid rgba(255, 69, 58, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)';
                      e.currentTarget.style.borderColor = '#ff453a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#271b1b';
                      e.currentTarget.style.borderColor = 'rgba(255, 69, 58, 0.3)';
                    }}
                  >
                    Close & Edit Message
                  </motion.button>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .contact-card {
          padding: 3rem;
        }
        .contact-email-text {
          font-size: 1rem;
        }
        .coordinates-container {
          padding-left: 1.5rem;
        }
        .contact-coord-value {
          font-size: 0.85rem;
        }
        .contact-coord-clock {
          font-size: 0.65rem;
        }
        @media (max-width: 960px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .contact-left-col, .contact-right-col {
            grid-column: auto !important;
          }
        }
        @media (max-width: 768px) {
          .contact-card {
            padding: 1.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .contact-card {
            padding: 1rem !important;
          }
          .contact-email-text {
            font-size: 0.8rem !important;
          }
          .coordinates-container {
            padding-left: 0.75rem !important;
          }
          .contact-coord-value {
            font-size: 0.72rem !important;
          }
          .contact-coord-clock {
            font-size: 0.55rem !important;
          }
          .email-copy-container {
            padding: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
