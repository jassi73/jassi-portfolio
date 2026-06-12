import React, { useState, useEffect, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'visitor' | 'operator' | 'system';
  text: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'online' | 'offline'>('idle');
  const [visitorName, setVisitorName] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [operatorTyping, setOperatorTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Offline message form states
  const [offlineName, setOfflineName] = useState('');
  const [offlineEmail, setOfflineEmail] = useState('');
  const [offlineMsg, setOfflineMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const connTimeoutRef = useRef<number | null>(null);

  // Keep a status ref to avoid stale closures
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Auto scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, operatorTyping]);

  // Play a synthesized sound chime (100% native Web Audio API)
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio play restricted or unsupported:', e);
    }
  };

  const startConnection = () => {
    setStatus('connecting');
    setMessages([]);
    setJoined(false);

    // 1. Create a random visitor peer ID
    const visitorPeer = new Peer();
    peerRef.current = visitorPeer;

    visitorPeer.on('open', () => {
      // 2. Attempt to connect to the operator's registered ID
      const connection = visitorPeer.connect('jassi-parihar-chat-host', {
        reliable: true
      });
      connRef.current = connection;

      // 3. Set connection timeout (5 seconds)
      connTimeoutRef.current = window.setTimeout(() => {
        if (statusRef.current === 'connecting') {
          handleDisconnect('offline');
        }
      }, 5000);

      connection.on('open', () => {
        if (connTimeoutRef.current) clearTimeout(connTimeoutRef.current);
        setStatus('online');
        setMessages([{ sender: 'system', text: 'Connected to Jassi Parihar.', timestamp: new Date().toLocaleTimeString() }]);
      });

      connection.on('data', (payload: any) => {
        if (!payload || typeof payload !== 'object') return;

        if (payload.type === 'msg') {
          playNotificationSound();
          setMessages((prev) => [
            ...prev,
            { sender: 'operator', text: payload.text, timestamp: new Date().toLocaleTimeString() }
          ]);
          setOperatorTyping(false);
        } else if (payload.type === 'typing') {
          setOperatorTyping(!!payload.isTyping);
        }
      });

      connection.on('close', () => {
        setMessages((prev) => [
          ...prev,
          { sender: 'system', text: 'Chat session ended by operator.', timestamp: new Date().toLocaleTimeString() }
        ]);
        handleDisconnect('idle');
      });

      connection.on('error', (err) => {
        console.error('Connection channel error:', err);
        handleDisconnect('offline');
      });
    });

    visitorPeer.on('error', (err) => {
      console.error('Peer error:', err);
      if (err.type === 'peer-unavailable') {
        handleDisconnect('offline');
      } else {
        handleDisconnect('offline');
      }
    });
  };

  const handleDisconnect = (nextStatus: 'idle' | 'offline') => {
    if (connTimeoutRef.current) clearTimeout(connTimeoutRef.current);
    if (connRef.current) {
      connRef.current.close();
      connRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setStatus(nextStatus);
    setJoined(false);
  };

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    const name = visitorName.trim() || 'Anonymous Visitor';
    if (connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'name', name });
      setJoined(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !connRef.current || !connRef.current.open) return;

    connRef.current.send({ type: 'msg', text: inputVal });
    
    setMessages((prev) => [
      ...prev,
      { sender: 'visitor', text: inputVal, timestamp: new Date().toLocaleTimeString() }
    ]);
    setInputVal('');

    // Emit stop typing
    if (isTyping) {
      setIsTyping(false);
      connRef.current.send({ type: 'typing', isTyping: false });
    }
  };

  const handleSelfTyping = (text: string) => {
    setInputVal(text);
    if (!connRef.current || !connRef.current.open) return;

    if (!isTyping && text.trim() !== '') {
      setIsTyping(true);
      connRef.current.send({ type: 'typing', isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = window.setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (connRef.current && connRef.current.open) {
          connRef.current.send({ type: 'typing', isTyping: false });
        }
      }
    }, 1500);
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputVal((prev) => {
          const spacing = prev ? ' ' : '';
          return prev + spacing + transcript;
        });
        if (connRef.current && connRef.current.open && !isTyping) {
          setIsTyping(true);
          connRef.current.send({ type: 'typing', isTyping: true });
        }
      }
    };

    rec.onerror = (err: any) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleOfflineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineName.trim() || !offlineEmail.trim() || !offlineMsg.trim()) {
      setSubmitError('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'a2d5bbd0-9b5a-4f1f-acc9-7a308139b614';
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: offlineName,
          email: offlineEmail,
          message: `Dear Jassi,\n\nSomeone wants to connect with you via your Portfolio Live Chat widget!\n\nVisitor Details:\n- Name: ${offlineName}\n- Contact Email: ${offlineEmail}\n\nOffline Message:\n"${offlineMsg}"\n\n---\nSent via Portfolio Ephemeral Chat Widget.`,
          subject: `[Portfolio Connection Request] Chat from ${offlineName}`,
          from_name: 'Jasa Live Chat Router',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        setOfflineMsg('');
        setOfflineName('');
        setOfflineEmail('');
      } else {
        setSubmitError(data.message || 'Failed to dispatch email request.');
      }
    } catch (err) {
      console.error('Offline submit error:', err);
      setSubmitError('Network error. Failed to notify operator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleWidget = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen && status === 'idle') {
      startConnection();
    } else if (!nextOpen) {
      // Keep connection active even when minimized, but if offline we reset
      if (status === 'offline') {
        setStatus('idle');
        setSubmitSuccess(false);
        setSubmitError('');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (connTimeoutRef.current) clearTimeout(connTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (connRef.current) connRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="chat-widget-container">
      
      {/* Floating Chat Bubble FAB */}
      <button
        onClick={toggleWidget}
        className="interactive-element"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-purple)',
          border: 'none',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124, 92, 255, 0.4)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s',
          transform: isOpen ? 'rotate(90deg) scale(0.95)' : 'rotate(0deg) scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#6942ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-purple)';
        }}
      >
        {isOpen ? (
          // Close Icon
          <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.854 3.146a.5.5 0 010 .708l-8 8a.5.5 0 01-.708-.708l8-8a.5.5 0 01.708 0zM3.146 3.146a.5.5 0 000 .708l8 8a.5.5 0 00.708-.708l-8-8a.5.5 0 00-.708 0z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        ) : (
          // Message Icon
          <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 2.5C1.5 2.22386 1.72386 2 2 2H13C13.2761 2 13.5 2.22386 13.5 2.5V9.5C13.5 9.77614 13.2761 10 13 10H8.35355L5.64645 12.7071C5.45118 12.9024 5.1346 12.9024 4.93934 12.7071C4.84557 12.6133 4.79289 12.4861 4.79289 12.3536V10H2C1.72386 10 1.5 9.77614 1.5 9.5V2.5Z" fill="currentColor" />
          </svg>
        )}
      </button>
 
      {/* Expandable Chat Card Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="saas-card chat-widget-window"
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-white)', fontSize: '0.9rem', fontWeight: 'bold' }}>Chat with Jassi</h4>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>EPHEMERAL CHANNEL</span>
              </div>
              
              {/* Status dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span 
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: status === 'online' ? '#4eff4d' : (status === 'connecting' ? '#ffd14d' : '#ff4d4d'),
                    boxShadow: status === 'online' ? '0 0 6px #4eff4d' : (status === 'connecting' ? '0 0 6px #ffd14d' : '0 0 6px #ff4d4d'),
                  }} 
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', fontWeight: 500 }}>
                  {status === 'online' ? 'Online' : (status === 'connecting' ? 'Connecting' : 'Offline')}
                </span>
              </div>
            </div>

            {/* Body Content depending on state */}
            <AnimatePresence mode="wait">
              {status === 'connecting' && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-gray-muted)' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(124, 92, 255, 0.2)', borderTopColor: 'var(--accent-purple)', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Locating operator peer...</span>
                </motion.div>
              )}

              {status === 'offline' && (
                <motion.div
                  key="offline"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', padding: '0.2rem', minHeight: 0 }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                    <h5 style={{ color: 'var(--text-white)', fontSize: '0.85rem', fontWeight: 'bold' }}>Jassi is Offline</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-gray-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                      Leave a message below. I will receive an instant email notification to connect!
                    </p>
                  </div>

                  {submitSuccess ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#4eff4d' }}>
                        <path d="M11.854 4.854a.5.5 0 00-.707-.707L6.5 8.793 4.854 7.146a.5.5 0 10-.707.708l2 2a.5.5 0 00.707 0l5-5z" fill="currentColor" />
                      </svg>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-light)', fontWeight: 500 }}>
                        Message dispatched successfully! Jassi has been notified.
                      </span>
                      <button 
                        onClick={() => setSubmitSuccess(false)}
                        className="btn-secondary-border"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.68rem', height: 'auto', borderRadius: '4px' }}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOfflineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.58rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>NAME</label>
                        <input
                          type="text"
                          required
                          value={offlineName}
                          onChange={(e) => setOfflineName(e.target.value)}
                          placeholder="Jane Doe"
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            backgroundColor: 'var(--surface-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: 'var(--text-white)',
                            outline: 'none',
                            fontSize: '0.75rem',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.58rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>EMAIL CONTACT</label>
                        <input
                          type="email"
                          required
                          value={offlineEmail}
                          onChange={(e) => setOfflineEmail(e.target.value)}
                          placeholder="jane@example.com"
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            backgroundColor: 'var(--surface-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: 'var(--text-white)',
                            outline: 'none',
                            fontSize: '0.75rem',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.58rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>MESSAGE</label>
                        <textarea
                          required
                          rows={3}
                          value={offlineMsg}
                          onChange={(e) => setOfflineMsg(e.target.value)}
                          placeholder="Hey Jassi! I want to connect..."
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            backgroundColor: 'var(--surface-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: 'var(--text-white)',
                            outline: 'none',
                            fontSize: '0.75rem',
                            resize: 'none',
                            fontFamily: 'var(--font-sans)',
                          }}
                        />
                      </div>

                      {submitError && (
                        <div style={{ color: '#ff4d4d', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                          {submitError}
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-primary-glow" 
                        style={{ width: '100%', justifyContent: 'center', height: '32px', fontSize: '0.72rem', marginTop: '0.25rem' }}
                      >
                        {isSubmitting ? 'Sending Request...' : 'Send Offline Message'}
                      </button>
                    </form>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', marginTop: '0.25rem' }}>
                    <button 
                      type="button"
                      onClick={startConnection}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-purple)',
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textDecoration: 'underline'
                      }}
                      className="interactive-element"
                    >
                      Retry live socket link
                    </button>
                  </div>
                </motion.div>
              )}

              {status === 'online' && !joined && (
                <motion.div
                  key="online-join"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', minHeight: 0, overflowY: 'auto', padding: '0.2rem' }}
                >
                  <form onSubmit={handleJoinChat} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                      <h5 style={{ color: 'var(--text-white)', fontSize: '0.85rem', fontWeight: 'bold' }}>Establish WebRTC Channel</h5>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-gray-muted)', marginTop: '0.25rem' }}>Direct browser-to-browser connection. No chat logs are stored.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.62rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>YOUR IDENTIFICATION NAME</label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Anonymous Guest"
                        maxLength={25}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          backgroundColor: 'var(--surface-input)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          color: 'var(--text-white)',
                          outline: 'none',
                          fontSize: '0.8rem',
                        }}
                      />
                    </div>

                    <button type="submit" className="btn-primary-glow" style={{ width: '100%', justifyContent: 'center', height: '36px', fontSize: '0.75rem' }}>
                      Connect Live Chat
                    </button>
                  </form>
                </motion.div>
              )}

              {status === 'online' && joined && (
                <motion.div
                  key="online-chat"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                  {/* Message Thread */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      minHeight: 0,
                      padding: '0.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {messages.map((msg, index) => {
                      if (msg.sender === 'system') {
                        return (
                          <div key={index} style={{ textAlign: 'center', margin: '0.2rem 0' }}>
                            <span style={{ fontSize: '0.58rem', color: 'var(--text-gray-muted)', backgroundColor: 'var(--surface-card)', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                              {msg.text}
                            </span>
                          </div>
                        );
                      }

                      const isMe = msg.sender === 'visitor';
                      return (
                        <div
                          key={index}
                          style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '10px',
                              borderTopRightRadius: isMe ? '2px' : '10px',
                              borderTopLeftRadius: !isMe ? '2px' : '10px',
                              backgroundColor: isMe ? 'var(--accent-purple)' : 'var(--surface-card)',
                              border: isMe ? 'none' : '1px solid var(--border-subtle)',
                              color: 'var(--text-white)',
                              fontSize: '0.78rem',
                              lineHeight: 1.4,
                              wordBreak: 'break-word',
                            }}
                          >
                            {msg.text}
                          </div>
                          <span style={{ fontSize: '0.52rem', color: 'var(--text-gray-muted)', marginTop: '0.2rem', padding: '0 0.15rem' }}>
                            {isMe ? 'You' : 'Jassi'} • {msg.timestamp}
                          </span>
                        </div>
                      );
                    })}

                    {operatorTyping && (
                      <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '3px', padding: '0.3rem 0.65rem', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-purple)', fontStyle: 'italic' }}>Jassi typing</span>
                        <span style={{ color: 'var(--accent-purple)', fontSize: '0.68rem' }}>...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input form */}
                  <form 
                    onSubmit={handleSendMessage} 
                    className="chat-input-bar-container"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.65rem', 
                      position: 'relative',
                      backgroundColor: 'rgba(20, 20, 24, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '24px',
                      padding: '0.55rem 0.95rem',
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 14px rgba(0, 0, 0, 0.25)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Speech Recognition Button */}
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      title={isListening ? "Stop listening" : "Start voice input"}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isListening ? '#ff4d4d' : 'rgba(255, 255, 255, 0.45)',
                        padding: '0.2rem',
                        transition: 'color 0.2s',
                        animation: isListening ? 'pulse-mic 1s infinite alternate' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isListening) e.currentTarget.style.color = 'var(--accent-purple)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isListening) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    </button>

                    {/* Input Field */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => handleSelfTyping(e.target.value)}
                      placeholder="Write a message..."
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-white)',
                        outline: 'none',
                        fontSize: '14.5px',
                        padding: '0.3rem 0',
                        lineHeight: '1.4',
                      }}
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!inputVal.trim()}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: inputVal.trim() ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.25)',
                        opacity: inputVal.trim() ? 1 : 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: inputVal.trim() ? 'pointer' : 'default',
                        padding: '0.25rem',
                        transition: 'color 0.2s, transform 0.2s, opacity 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (inputVal.trim()) {
                          e.currentTarget.style.color = '#6942ff';
                          e.currentTarget.style.transform = 'scale(1.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (inputVal.trim()) {
                          e.currentTarget.style.color = 'var(--accent-purple)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z"/>
                        <path d="M22 2 11 13"/>
                      </svg>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inject spinner css rules */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

