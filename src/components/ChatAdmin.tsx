import React, { useState, useEffect, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';

interface Message {
  sender: 'visitor' | 'operator' | 'system';
  text: string;
  timestamp: string;
}

interface ActiveChat {
  peerId: string;
  name: string;
  messages: Message[];
  unread: boolean;
  isTyping: boolean;
  online: boolean;
}

export default function ChatAdmin() {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [peerId, setPeerId] = useState<string | null>(null);
  const [peerError, setPeerError] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [chats, setChats] = useState<ActiveChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSelfTyping, setIsSelfTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<{ [peerId: string]: DataConnection }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeChatId]);

  // Synthesize notification chime using Web Audio API (100% client-side, zero-dependency)
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Note 1: E5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Note 2: A5
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
      gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn('Web Audio API not supported or user gesture needed:', e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'jassi123') { // Simple password gating
      setAuthorized(true);
      setLoginError('');
      initializeOperatorPeer();
    } else {
      setLoginError('Invalid passcode. Access denied.');
    }
  };

  const addSystemLog = (log: string) => {
    setSystemLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const initializeOperatorPeer = () => {
    addSystemLog('Initializing WebRTC network...');
    
    // Register as the host/operator peer
    const p = new Peer('jassi-parihar-chat-host', {
      debug: 1, // Only log errors
    });

    peerRef.current = p;

    p.on('open', (id) => {
      setPeerId(id);
      setPeerError(null);
      addSystemLog(`Registered online as host: ${id}`);
    });

    p.on('error', (err) => {
      console.error('PeerJS error:', err);
      if (err.type === 'unavailable-id') {
        setPeerError('Matchmaking ID already in use. You might have another console window open.');
        addSystemLog('Registration failed: ID in use.');
      } else {
        setPeerError(`WebRTC error: ${err.message}`);
        addSystemLog(`Registration error: ${err.message}`);
      }
    });

    p.on('connection', (conn) => {
      addSystemLog(`Incoming connection request from peer: ${conn.peer}`);
      playNotificationSound();

      // Listen for connection status changes
      conn.on('open', () => {
        addSystemLog(`WebRTC Channel opened with: ${conn.peer}`);
        connectionsRef.current[conn.peer] = conn;

        // Add to active chats
        setChats((prev) => {
          const exists = prev.find((c) => c.peerId === conn.peer);
          if (exists) {
            return prev.map((c) =>
              c.peerId === conn.peer
                ? { ...c, online: true, messages: [...c.messages, { sender: 'system', text: 'Visitor re-connected.', timestamp: new Date().toLocaleTimeString() }] }
                : c
            );
          } else {
            return [
              ...prev,
              {
                peerId: conn.peer,
                name: 'Anonymous Visitor',
                messages: [
                  { sender: 'system', text: 'Chat session started.', timestamp: new Date().toLocaleTimeString() }
                ],
                unread: true,
                isTyping: false,
                online: true,
              },
            ];
          }
        });
      });

      // Listen for messages & typing status
      conn.on('data', (payload: any) => {
        if (!payload || typeof payload !== 'object') return;

        if (payload.type === 'name') {
          setChats((prev) =>
            prev.map((c) => (c.peerId === conn.peer ? { ...c, name: payload.name || 'Anonymous Visitor' } : c))
          );
          addSystemLog(`Visitor identified as: ${payload.name}`);
        } else if (payload.type === 'msg') {
          playNotificationSound();
          setChats((prev) =>
            prev.map((c) => {
              if (c.peerId === conn.peer) {
                return {
                  ...c,
                  unread: activeChatId !== conn.peer,
                  isTyping: false,
                  messages: [
                    ...c.messages,
                    {
                      sender: 'visitor',
                      text: payload.text,
                      timestamp: new Date().toLocaleTimeString(),
                    },
                  ],
                };
              }
              return c;
            })
          );
        } else if (payload.type === 'typing') {
          setChats((prev) =>
            prev.map((c) => (c.peerId === conn.peer ? { ...c, isTyping: !!payload.isTyping } : c))
          );
        }
      });

      conn.on('close', () => {
        addSystemLog(`Visitor channel closed: ${conn.peer}`);
        delete connectionsRef.current[conn.peer];
        setChats((prev) =>
          prev.map((c) =>
            c.peerId === conn.peer
              ? {
                  ...c,
                  online: false,
                  isTyping: false,
                  messages: [
                    ...c.messages,
                    { sender: 'system', text: 'Visitor disconnected.', timestamp: new Date().toLocaleTimeString() }
                  ]
                }
              : c
          )
        );
      });

      conn.on('error', (err) => {
        addSystemLog(`Channel error on ${conn.peer}: ${err.message}`);
      });
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChatId) return;

    const conn = connectionsRef.current[activeChatId];
    if (conn && conn.open) {
      conn.send({ type: 'msg', text: replyText });
      
      // Add to local state
      setChats((prev) =>
        prev.map((c) => {
          if (c.peerId === activeChatId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                { sender: 'operator', text: replyText, timestamp: new Date().toLocaleTimeString() }
              ]
            };
          }
          return c;
        })
      );
      setReplyText('');
      
      // Stop typing status
      if (isSelfTyping) {
        setIsSelfTyping(false);
        conn.send({ type: 'typing', isTyping: false });
      }
    } else {
      addSystemLog(`Error: Cannot send. Connection to ${activeChatId} is closed.`);
    }
  };

  const handleSelfTyping = (text: string) => {
    setReplyText(text);
    if (!activeChatId) return;
    
    const conn = connectionsRef.current[activeChatId];
    if (!conn || !conn.open) return;

    if (!isSelfTyping && text.trim() !== '') {
      setIsSelfTyping(true);
      conn.send({ type: 'typing', isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = window.setTimeout(() => {
      if (isSelfTyping) {
        setIsSelfTyping(false);
        conn.send({ type: 'typing', isTyping: false });
      }
    }, 1500);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChats((prev) => prev.map((c) => (c.peerId === chatId ? { ...c, unread: false } : c)));
  };

  const endChatSession = (chatId: string) => {
    const conn = connectionsRef.current[chatId];
    if (conn) {
      conn.close();
      delete connectionsRef.current[chatId];
    }
    setChats((prev) => prev.filter((c) => c.peerId !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
    addSystemLog(`Ended chat session: ${chatId}`);
  };

  useEffect(() => {
    return () => {
      // Cleanup connections and peer on unmount
      Object.values(connectionsRef.current).forEach((c) => c.close());
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const activeChat = chats.find((c) => c.peerId === activeChatId);

  // Gated Passcode login UI
  if (!authorized) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark)' }}>
        <form onSubmit={handleLogin} className="saas-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-card)' }}>
          <span className="label-saas">OPERATOR CONSOLE</span>
          <h2 style={{ color: 'var(--text-white)', marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Jassi's Portfolio</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>ENTER ACCESS PASSCODE</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--surface-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-white)',
                outline: 'none',
              }}
            />
          </div>

          {loginError && (
            <div style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
              {loginError}
            </div>
          )}

          <button type="submit" className="btn-primary-glow" style={{ width: '100%', justifyContent: 'center' }}>
            Authorize Portal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-saas" style={{ padding: '2rem 0', minHeight: 'calc(100vh - 120px)', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
      
      {/* Sidebar - Visitors List & System logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Status card */}
        <div className="saas-card" style={{ padding: '1.25rem', backgroundColor: 'var(--surface-card-darker)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: peerError ? '#ff4d4d' : (peerId ? '#4eff4d' : '#ffd14d'), 
                boxShadow: peerError ? '0 0 10px #ff4d4d' : (peerId ? '0 0 10px #4eff4d' : '0 0 10px #ffd14d'),
                display: 'inline-block' 
              }} 
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-white)' }}>
              {peerError ? 'Offline (Error)' : (peerId ? 'Listening' : 'Connecting')}
            </span>
          </div>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-gray-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            ID: {peerId || '...'}
          </span>
          {peerError && (
            <div style={{ color: '#ff4d4d', fontSize: '0.65rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              {peerError}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-gray-muted)' }}>Notification Chimes</span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              style={{
                background: 'none',
                border: 'none',
                color: soundEnabled ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </div>

        {/* Visitor list card */}
        <div className="saas-card" style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-card-darker)' }}>
          <span className="label-saas" style={{ fontSize: '0.6rem', color: 'var(--text-gray-muted)', marginBottom: '0.75rem' }}>ACTIVE CHATS ({chats.length})</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1, maxHeight: '350px' }}>
            {chats.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-gray-muted)', textAlign: 'center', padding: '2rem 0', fontFamily: 'var(--font-mono)' }}>
                Waiting for incoming chats...
              </div>
            ) : (
              chats.map((c) => (
                <div 
                  key={c.peerId}
                  onClick={() => handleSelectChat(c.peerId)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: activeChatId === c.peerId ? 'var(--accent-purple)' : 'var(--border-subtle)',
                    backgroundColor: activeChatId === c.peerId ? 'rgba(124, 92, 255, 0.05)' : 'var(--surface-card)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                  className="interactive-element"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      {c.name}
                    </span>
                    {c.unread && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', boxShadow: '0 0 8px var(--accent-purple)' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.62rem', color: c.online ? '#4eff4d' : 'var(--text-gray-muted)' }}>
                      {c.online ? 'Online' : 'Disconnected'}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        endChatSession(c.peerId);
                      }} 
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4d4d',
                        fontSize: '0.65rem',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      className="interactive-element"
                    >
                      Clear
                    </button>
                  </div>
                  {c.isTyping && (
                    <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--accent-purple)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      Typing...
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Network Logs console */}
        <div className="saas-card" style={{ padding: '1rem', height: '140px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-card-darker)' }}>
          <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-muted)', marginBottom: '0.5rem' }}>SYSTEM LOGS</span>
          <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, display: 'flex', flexDirection: 'column-reverse' }}>
            {systemLogs.slice().reverse().map((log, idx) => (
              <div key={idx} style={{ whiteSpace: 'nowrap' }}>{log}</div>
            ))}
          </div>
        </div>

      </div>

      {/* Main chat window */}
      <div className="saas-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '480px', backgroundColor: 'var(--surface-card-darker)' }}>
        {activeChat ? (
          <>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--text-white)', fontSize: '1.05rem', fontWeight: 'bold' }}>{activeChat.name}</h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>Channel Peer ID: {activeChat.peerId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span 
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: activeChat.online ? '#4eff4d' : 'var(--text-gray-muted)', 
                    display: 'inline-block' 
                  }} 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-muted)' }}>
                  {activeChat.online ? 'Live Channel Active' : 'Visitor Left / Session Offline'}
                </span>
              </div>
            </div>

            {/* Message Thread */}
            <div 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '0.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.85rem', 
                minHeight: '260px',
                maxHeight: '380px',
                backgroundColor: 'rgba(0,0,0,0.12)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem'
              }}
            >
              {activeChat.messages.map((msg, index) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={index} style={{ textAlign: 'center', margin: '0.35rem 0' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-gray-muted)', backgroundColor: 'var(--surface-card)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                        {msg.text} // {msg.timestamp}
                      </span>
                    </div>
                  );
                }

                const isOperator = msg.sender === 'operator';
                return (
                  <div 
                    key={index}
                    style={{
                      alignSelf: isOperator ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOperator ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div 
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        borderTopRightRadius: isOperator ? '2px' : '12px',
                        borderTopLeftRadius: !isOperator ? '2px' : '12px',
                        backgroundColor: isOperator ? 'var(--accent-purple)' : 'var(--surface-card)',
                        border: isOperator ? 'none' : '1px solid var(--border-subtle)',
                        color: 'var(--text-white)',
                        fontSize: '0.85rem',
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '0.58rem', color: 'var(--text-gray-muted)', marginTop: '0.25rem', padding: '0 0.2rem' }}>
                      {isOperator ? 'You' : activeChat.name} • {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              
              {activeChat.isTyping && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '0.4rem 0.85rem', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontStyle: 'italic' }}>typing</span>
                  <span className="dot-animation" style={{ color: 'var(--accent-purple)' }}>...</span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input reply form */}
            <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                disabled={!activeChat.online}
                value={replyText}
                onChange={(e) => handleSelfTyping(e.target.value)}
                placeholder={activeChat.online ? `Reply to ${activeChat.name}...` : 'Visitor channel is offline.'}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'var(--surface-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-white)',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
              <button 
                type="submit" 
                disabled={!activeChat.online || !replyText.trim()} 
                className="btn-primary-glow"
                style={{
                  padding: '0 1.5rem',
                  fontSize: '0.8rem',
                  height: '40px',
                  borderRadius: '6px'
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray-muted)', gap: '1rem', padding: '4rem 0' }}>
            <svg width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 3c.276 0 .5.224.5.5v7c0 .276-.224.5-.5.5H7.707L4.5 13.707V11H2.5c-.276 0-.5-.224-.5-.5v-7c0-.276.224-.5.5-.5h10z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--text-white)', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>No Chat Selected</h3>
              <p style={{ fontSize: '0.75rem', maxWidth: '300px', lineHeight: 1.4 }}>Select an active visitor from the sidebar to establish a direct WebRTC connection channel.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
