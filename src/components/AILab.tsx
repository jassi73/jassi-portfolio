import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 0 | 1 | 2 | 3;

export default function AILab() {
  const [activeTab, setActiveTab] = useState<TabId>(0);

  // Custom Event Listener to switch tabs from Hero buttons
  useEffect(() => {
    const handleSelectResumeTab = () => {
      setActiveTab(1); // Resume Analyzer Tab
    };
    window.addEventListener('select-resume-tab', handleSelectResumeTab);
    return () => {
      window.removeEventListener('select-resume-tab', handleSelectResumeTab);
    };
  }, []);

  return (
    <section
      id="ailab"
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
          <span className="label-saas">02 // RESEARCH & DEVELOPMENT</span>
          <h2
            className="title-hero"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              marginTop: '1rem',
              color: 'var(--text-white)',
            }}
          >
            The AI Lab
          </h2>
          <p style={{ color: 'var(--text-gray-muted)', marginTop: '1rem', maxWidth: '600px' }}>
            Interactive engineering playgrounds highlighting generative structures, agent orchestration, and vector retrieval pipelines.
          </p>
        </div>

        {/* Tab Selection Bar (SaaS UI style) */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '3rem',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '1px',
          }}
          className="no-scrollbar"
        >
          {[
            { id: 0, label: 'AI Chat' },
            { id: 1, label: 'Resume Analyzer' },
            { id: 2, label: 'AI Agent Showcase' },
            { id: 3, label: 'RAG Demo' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className="interactive-element"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === tab.id ? 'var(--text-white)' : 'var(--text-gray-muted)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--accent-purple)',
                    boxShadow: '0 0 8px var(--accent-purple)',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Panel Content */}
        <div
          className="saas-card"
          style={{
            minHeight: '450px',
            backgroundColor: 'var(--surface-card-darker)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 0 && <AIChatDemo key="chat" />}
            {activeTab === 1 && <ResumeAnalyzerDemo key="resume" />}
            {activeTab === 2 && <AgentShowcaseDemo key="agent" />}
            {activeTab === 3 && <RAGDemo key="rag" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   1. AI CHAT DEMO
   ========================================================================== */
function AIChatDemo() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Console initialized. Inquire about Jassi\'s capabilities, experience, or system architecture.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const presets = [
    { q: 'What is Jassi\'s scaling experience?', a: 'Jassi has 4+ years of professional experience building startup systems. At Newron, he engineered a vast multi-module SaaS School ERP (ELERN) from scratch, delivering Helpdesk, Utility, Library Management, Discipline, Hostel, and Transport modules. He also built Student and Employee hybrid mobile apps using React Native WebView containers, and integrated real-time Socket.io chat.' },
    { q: 'How does Jassi optimize vector DB search?', a: 'Jassi implements semantic caching layers utilizing Qdrant and Pinecone, storing prompt embedding pairs in memory, which cuts OpenAI API costs by 35% and drops downstream pipeline latency by 50%.' },
    { q: 'Why hire Jassi?', a: 'Jassi combines frontend fidelity (React.js, Tailwind CSS, React Query, Framer Motion) with robust backend infrastructures (Node.js, PostgreSQL, Socket.io, Redis) and vector AI pipelines, building production-ready SaaS experiences.' }
  ];

  const handleQuery = (question: string, answer: string) => {
    if (isTyping) return;
    setMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);
      let currentText = '';
      let charIdx = 0;

      const interval = setInterval(() => {
        currentText += answer[charIdx];
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'assistant', text: currentText };
          return updated;
        });
        charIdx++;
        if (charIdx >= answer.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 10);
    }, 800);
  };

  const factsDatabase = [
    {
      id: 'bio',
      keywords: ['jassi', 'parihar', 'who', 'about', 'bio', 'profile', 'developer', 'engineer', 'background', 'location', 'live', 'pune', 'maharashtra', 'where'],
      response: "Jassi Parihar is a Software Engineer and Frontend Developer based in Pune, Maharashtra, India. He has 4+ years of experience engineering high-fidelity web interfaces (React, TS, Next.js, Redux) and optimizing high-performance backend systems (Node, WebSockets, REST APIs, Databases)."
    },
    {
      id: 'skills_frontend',
      keywords: ['frontend', 'react', 'typescript', 'next.js', 'vite', 'canvas', 'framer', 'motion', 'gsap', 'ui', 'ux', 'css', 'sass', 'styling', 'animations', 'skills', 'skill', 'query', 'native', 'webview', 'apexcharts'],
      response: "Jassi specializes in premium frontend engineering using React, TypeScript, React Query, Framer Motion, and Tailwind CSS. He designs highly modular interfaces, creates dynamic animations, packages hybrid React Native WebView apps, and implements interactive data visual dashboards using React ApexCharts."
    },
    {
      id: 'skills_backend',
      keywords: ['backend', 'database', 'sql', 'postgresql', 'redis', 'node.js', 'express', 'fastapi', 'python', 'docker', 'aws', 'server', 'microservice', 'query', 'databases', 'go', 'mongodb', 'express', 'socket.io', 'websocket'],
      response: "On the backend, Jassi works with Node.js, Express, PostgreSQL, Redis, MongoDB, and Go. He designs scalable monorepos, implements Socket.io and WebSockets for real-time chat operations, and structures relational schemas optimized for high concurrency."
    },
    {
      id: 'skills_ai',
      keywords: ['ai', 'agent', 'rag', 'vector', 'qdrant', 'pinecone', 'langchain', 'openai', 'llm', 'retrieval', 'embeddings', 'streaming', 'sse', 'semantic', 'claude', 'cursor'],
      response: "Jassi integrates advanced AI workflows including LangChain, OpenAI, Claude AI, and Cursor AI. He designs semantic caching pipelines (reducing LLM token costs by 35% and retrieval latency to 4ms) and creates streaming outputs via Server-Sent Events (SSE)."
    },
    {
      id: 'buildstorey',
      keywords: ['buildstorey', 'ecommerce', 'material', 'next.js', 'ssr', 'ssg', 'seo', 'onboarding', 'categories', 'seller', 'login', 'node.js', 'express', 'mongodb'],
      response: "Jassi was the Frontend Developer of Buildstorey, a hybrid B2B & B2C building materials marketplace (14 categories) supporting Amazon-style online retail and contract sales. He designed the end-to-end system from scratch, including role-wise UI for seller onboarding and user login. The stack features Next.js with SSR/SSG and advanced SEO optimizations for Chrome search rankings, integrated with a Node.js, Express, and MongoDB backend."
    },
    {
      id: 'school_erp',
      keywords: ['school', 'erp', 'timetable', 'scheduling', 'newron', 'concurrency', 'bus', 'tracking', 'ticket', 'helpdesk', 'utility', 'library', 'discipline', 'hostel', 'transport', 'webview', 'apexcharts', 'elern', 'monorepo', 'socket.io', 'websocket'],
      response: "Jassi engineered the vast SaaS School ERP (ELERN) from scratch in a monorepo at Newron. He developed standalone modules for Helpdesk support ticketing, Utility operations, Library Management (with book wise tracking and fine reports), student Discipline registers, Hostel administration, and Transport routes. He also developed hybrid Student and Employee WebView apps in React Native, integrated Socket.io chat, and built visual analytics reports using React ApexCharts."
    },
    {
      id: 'ai_platform',
      keywords: ['assistant', 'platform', 'semantic', 'llm', 'token', 'langchain', 'sse', 'cache', 'nexus'],
      response: "Jassi built an AI Assistant Platform with LangChain agents and FastAPI. By adding a semantic embedding cache running on Qdrant DB, he saved 35% on OpenAI API costs and achieved 4ms cache hit retrieval speeds."
    },
    {
      id: 'contact',
      keywords: ['contact', 'email', 'hire', 'jessparihar73@gmail.com', 'github', 'linkedin', 'social', 'resume', 'cv', 'reach', 'message'],
      response: "You can contact Jassi at jessparihar73@gmail.com. His location is Pune, Maharashtra, India (IST timezone). You can find him on GitHub at @jassi73, or send a direct coordinate message through the Contact section form at the bottom of this page!"
    },
    {
      id: 'experience',
      keywords: ['experience', 'work', 'job', 'timeline', 'company', 'history', 'newron', 'qdegrees', 'erp', 'ecommerce', 'buildstorey'],
      response: "Jassi's timeline includes: Software Engineer at Newron (2024-Present, working on a vast SaaS educational ERP startup, building monorepo modules and mobile WebView apps from scratch), and Frontend Developer of Buildstorey (2022-2023, B2B & B2C building materials e-commerce marketplace built from scratch)."
    },
    {
      id: 'blogs',
      keywords: ['blog', 'blogs', 'article', 'articles', 'write', 'writing', 'post', 'posts', 'journal'],
      response: "Jassi writes technical articles about systems engineering, vector caches, and database performance. Current articles include: 'Building a Zero-Latency Timeline Sync Channel', 'The Architecture of a Vector Cache', and 'Re-engineering the School ERP Timetable Scheduler'."
    }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const query = inputVal.toLowerCase();
    const tokens = query
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (tokens.length === 0) {
      handleQuery(inputVal, "Please ask a specific question about Jassi's profile or projects.");
      setInputVal('');
      return;
    }

    let bestMatch = null;
    let highestScore = 0;

    for (const fact of factsDatabase) {
      let score = 0;
      for (const token of tokens) {
        if (fact.keywords.includes(token)) {
          score += 2;
        } else if (fact.keywords.some((kw) => kw.includes(token) || token.includes(kw))) {
          score += 1;
        }
      }

      // Add phrase matching bonus
      if (fact.id === 'buildstorey' && query.includes('buildstorey')) score += 5;
      if (fact.id === 'school_erp' && (query.includes('erp') || query.includes('school'))) score += 5;
      if (fact.id === 'ai_platform' && (query.includes('platform') || query.includes('assistant'))) score += 5;
      if (fact.id === 'blogs' && (query.includes('blog') || query.includes('article') || query.includes('post'))) score += 5;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = fact;
      }
    }

    let matchedAnswer = '';
    if (highestScore >= 2 && bestMatch) {
      matchedAnswer = bestMatch.response;
    } else {
      matchedAnswer = `I recognize your query, but my database lacks a direct index for those terms. Jassi's cognitive index covers:
• **Technical Expertise**: Ask about 'frontend', 'backend', 'skills', or 'AI tools'.
• **Projects**: Ask about 'Buildstorey', 'School ERP', or the 'AI Assistant'.
• **Background**: Ask about his 'experience', 'jobs', or 'bio'.
• **Articles**: Ask about 'blogs' or 'posts'.
• **Direct Link**: Ask about 'contact' or 'email'.

Please refine your query or try clicking one of the preset prompts above!`;
    }

    handleQuery(inputVal, matchedAnswer);
    setInputVal('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <div className="label-saas" style={{ color: 'var(--text-gray-dark)', fontSize: '0.65rem', marginBottom: '1.5rem' }}>
        AGENT_PORTAL // MODEL: GPT-4O-MINI-STREAM
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        data-lenis-prevent
        style={{
          flexGrow: 1,
          maxHeight: '280px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingRight: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? 'rgba(124, 92, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: '1px solid',
              borderColor: msg.sender === 'user' ? 'rgba(124, 92, 255, 0.2)' : 'var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.8rem 1.2rem',
              maxWidth: '80%',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: msg.sender === 'user' ? 'var(--text-white)' : 'var(--text-gray-light)',
            }}
          >
            {msg.text || (
              <span style={{ display: 'inline-flex', gap: '4px' }}>
                <span className="dot-blink" style={{ animation: 'blink 1.2s infinite' }}>•</span>
                <span className="dot-blink" style={{ animation: 'blink 1.2s infinite 0.2s' }}>•</span>
                <span className="dot-blink" style={{ animation: 'blink 1.2s infinite 0.4s' }}>•</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Preset Queries */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-dark)', display: 'block', marginBottom: '0.75rem' }}>
          PRESET QUERIES
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              disabled={isTyping}
              onClick={() => handleQuery(preset.q, preset.a)}
              className="interactive-element"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-gray-light)',
                borderRadius: '6px',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => !isTyping && (e.currentTarget.style.borderColor = 'var(--accent-purple)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              {preset.q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', width: '100%' }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a custom question..."
          disabled={isTyping}
          style={{
            flexGrow: 1,
            minWidth: 0,
            backgroundColor: 'var(--surface-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '0.8rem 1rem',
            color: 'var(--text-white)',
            outline: 'none',
            fontSize: '0.9rem',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
        />
        <button
          type="submit"
          disabled={isTyping || !inputVal.trim()}
          className="btn-primary-glow interactive-element"
          style={{
            padding: '0 1.25rem',
            opacity: isTyping || !inputVal.trim() ? 0.5 : 1,
            boxShadow: 'none',
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </form>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}

/* ==========================================================================
   2. RESUME ANALYZER DEMO
   ========================================================================== */
function ResumeAnalyzerDemo() {
  const [analysisState, setAnalysisState] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [percent, setPercent] = useState(0);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);

  const runAnalysis = () => {
    if (analysisState !== 'idle') return;
    setAnalysisState('uploading');
    setPercent(0);
    setStatusLogs([]);

    // 1. Uploading simulation
    const uploadInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setAnalysisState('processing');
          runParsing();
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // 2. Parsing simulation
  const runParsing = () => {
    const logs = [
      'Extracting textual metadata streams...',
      'Mapping skill sets against developer vector index...',
      'Evaluating production case study benchmarks...',
      'Calculating profile relevance index...'
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      setStatusLogs((prev) => [...prev, `[SUCCESS] ${logs[logIdx]}`]);
      logIdx++;
      if (logIdx >= logs.length) {
        clearInterval(logInterval);
        setTimeout(() => {
          setAnalysisState('done');
        }, 600);
      }
    }, 800);
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setPercent(0);
    setStatusLogs([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}
    >
      <div className="label-saas" style={{ color: 'var(--text-gray-dark)', fontSize: '0.65rem', marginBottom: '2rem' }}>
        MATRIX_ANALYTICS // RESUME MATCH PARSER
      </div>

      {analysisState === 'idle' && (
        <div
          onClick={runAnalysis}
          className="interactive-element"
          style={{
            border: '2px dashed var(--border-subtle)',
            borderRadius: '8px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--surface-input)',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1.5rem auto', color: 'var(--text-gray-muted)' }}>
            <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
            Click to upload your JD or PDF Resume
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-gray-muted)' }}>
            Supports PDF, DOCX, TXT. Simulates vector matching against Jassi Parihar's skill indices.
          </p>
        </div>
      )}

      {(analysisState === 'uploading' || analysisState === 'processing') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '450px', margin: '0 auto', width: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <span>{analysisState === 'uploading' ? 'UPLOADING_RESUME.PDF' : 'RUNNING_VECTOR_ANALYSIS'}</span>
              <span>{percent}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--accent-purple)', transition: 'width 0.15s ease' }} />
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface-console)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-gray-light)',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            {statusLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            {analysisState === 'processing' && statusLogs.length < 4 && (
              <span className="dot-blink" style={{ color: 'var(--accent-purple)', animation: 'blink 1s infinite' }}>[PROCESSING] ...</span>
            )}
          </div>
        </div>
      )}

      {analysisState === 'done' && (
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2.5rem', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }} className="resume-done-grid">
          {/* Match Score Radial */}
          <div
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: '4px solid var(--accent-purple)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124,92,255,0.15)',
              margin: '0 auto',
            }}
          >
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>98.4%</span>
            <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-muted)' }}>VECTOR MATCH</span>
          </div>

          {/* Breakdown Details */}
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>Analysis Results: High Match</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              The uploaded profile aligns with Jassi's expertise. Recommended matching positions: Senior React Engineer, AI Application Builder, Full Stack Integrator.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-dark)' }}>FRONTEND</span>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>100%</p>
              </div>
              <div>
                <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-dark)' }}>BACKEND</span>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>96%</p>
              </div>
              <div>
                <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-dark)' }}>AI STACK</span>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>98%</p>
              </div>
            </div>

            <button onClick={handleReset} className="btn-secondary-border interactive-element" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              Re-Scan Profile
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ==========================================================================
   3. AI AGENT SHOWCASE
   ========================================================================== */
function AgentShowcaseDemo() {
  const [activeStep, setActiveStep] = useState<-1 | 0 | 1 | 2 | 3>(-1);
  const [consoleLog, setConsoleLog] = useState<string[]>(['Agent system idle. Trigger compilation sequence below.']);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTo({
        top: consoleContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [consoleLog]);

  const steps = [
    { label: 'PLANNER', detail: 'Deconstructing query and structuring search keys.' },
    { label: 'VECTOR RETRIEVER', detail: 'Scanning document embeddings.' },
    { label: 'SYNTHESIS REVIEW', detail: 'Evaluating draft results against schema rules.' }
  ];

  const triggerAgent = () => {
    if (activeStep !== -1) return;
    
    // Step 0: Planner
    setActiveStep(0);
    setConsoleLog(['[AGENT_FLOW] Planner activated...', '[LOG] Task objective: Compile Jassi\'s engineering credentials.']);

    // Step 1: Retriever
    setTimeout(() => {
      setActiveStep(1);
      setConsoleLog((prev) => [...prev, '[AGENT_FLOW] Retriever activated...', '[DB] Querying semantic matching nodes in Qdrant indices...']);
    }, 1800);

    // Step 2: Reviewer
    setTimeout(() => {
      setActiveStep(2);
      setConsoleLog((prev) => [...prev, '[AGENT_FLOW] Reviewer activated...', '[QA] Reviewing syntax parameters and API configurations...']);
    }, 3600);

    // Step 3: Done
    setTimeout(() => {
      setActiveStep(3);
      setConsoleLog((prev) => [...prev, '[AGENT_FLOW] Task completed successfully.', '[OUTPUT] Profile verified: Jassi Parihar is fully qualified for development roles. 0 warnings, 0 errors.']);
    }, 5400);
  };

  const handleReset = () => {
    setActiveStep(-1);
    setConsoleLog(['Agent system idle. Trigger compilation sequence below.']);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <div className="label-saas" style={{ color: 'var(--text-gray-dark)', fontSize: '0.65rem', marginBottom: '2rem' }}>
        ORCHESTRATION // MULTI-AGENT TASK COMPILER
      </div>

      {/* Agents Flow Diagram */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          padding: '0 1rem',
        }}
        className="agent-flow-row"
      >
        {/* Connecting dotted lines in background */}
        <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', borderTop: '2px dashed var(--border-subtle)', zIndex: 1 }} />

        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              zIndex: 5,
              width: '120px',
              backgroundColor: activeStep === idx ? 'var(--surface-card-hover)' : 'var(--surface-input)',
              border: '1px solid',
              borderColor: activeStep === idx ? 'var(--accent-purple)' : 'var(--border-subtle)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              boxShadow: activeStep === idx ? '0 0 20px rgba(124,92,255,0.1)' : 'none',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeStep === idx ? 'var(--accent-purple)' : 'var(--text-gray-dark)',
                margin: '0 auto 0.5rem auto',
                boxShadow: activeStep === idx ? '0 0 10px var(--accent-purple)' : 'none',
              }}
            />
            <div className="label-saas" style={{ fontSize: '0.6rem', color: activeStep === idx ? 'var(--text-white)' : 'var(--text-gray-muted)' }}>
              {step.label}
            </div>
          </div>
        ))}
      </div>

      {/* Execution Console Output */}
      <div
        ref={consoleContainerRef}
        data-lenis-prevent
        style={{
          flexGrow: 1,
          backgroundColor: 'var(--surface-console)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--text-gray-light)',
          minHeight: '130px',
          maxHeight: '160px',
          overflowY: 'auto',
          lineHeight: '1.5',
          marginBottom: '1.5rem',
        }}
      >
        {consoleLog.map((log, i) => (
          <div key={i} style={{ color: log.startsWith('[AGENT') ? 'var(--text-white)' : log.startsWith('[DB') || log.startsWith('[QA') ? 'var(--accent-purple)' : 'var(--text-gray-light)' }}>
            {log}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ marginTop: 'auto' }}>
        {activeStep === -1 ? (
          <button onClick={triggerAgent} className="btn-primary-glow interactive-element">
            <span>Execute Agent Pipeline</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3L11 7.5L5 12V3Z" fill="currentColor"/>
            </svg>
          </button>
        ) : (
          <button onClick={handleReset} disabled={activeStep < 3} className="btn-secondary-border interactive-element" style={{ opacity: activeStep < 3 ? 0.5 : 1, cursor: activeStep < 3 ? 'not-allowed' : 'pointer' }}>
            Reset Pipeline
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .agent-flow-row {
            flex-direction: column !important;
            gap: 2rem !important;
          }
          .agent-flow-row > div:nth-child(1) {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

/* ==========================================================================
   4. RAG DEMO
   ========================================================================== */
function RAGDemo() {
  const [query, setQuery] = useState('Buildstorey impact');
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [ragOutput, setRagOutput] = useState('');

  // 12 vector indexing nodes
  const nodes = Array.from({ length: 12 }, (_, i) => i);

  const triggerRAG = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveNodes([]);
    setRagOutput('');

    // Step 1: Scan node spaces (Simulate retrieval)
    setTimeout(() => {
      // Highlight matching nodes (e.g. 2, 5, 9 correspond to Buildstorey data)
      setActiveNodes([2, 5, 9]);
    }, 1000);

    // Step 2: Output stream
    setTimeout(() => {
      const response = 'Context injected. Generating synthesis...\n\nBuildstorey is a B2B building materials marketplace (14 categories) designed and coded from scratch. The solution features Next.js SSR/SSG for Chrome SEO optimizations, specialized buyer/seller onboarding UI portals, and a Node.js/Express/MongoDB database engine.';
      let charIdx = 0;
      let streamText = '';

      const interval = setInterval(() => {
        streamText += response[charIdx];
        setRagOutput(streamText);
        charIdx++;
        if (charIdx >= response.length) {
          clearInterval(interval);
          setIsRunning(false);
        }
      }, 12);
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <div className="label-saas" style={{ color: 'var(--text-gray-dark)', fontSize: '0.65rem', marginBottom: '1.5rem' }}>
        RETRIEVAL // RETRIEVAL-AUGMENTED GENERATION SYSTEM
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2rem',
          flexGrow: 1,
        }}
        className="rag-grid"
      >
        {/* Left Side: Vector Space Node Grid */}
        <div style={{ gridColumn: 'span 5' }} className="rag-nodes-col">
          <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-dark)', display: 'block', marginBottom: '0.75rem' }}>
            VECTOR EMBEDDING DATABASE SPACE
          </span>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              backgroundColor: 'var(--surface-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '1rem',
              height: '140px',
              alignContent: 'center',
            }}
          >
            {nodes.map((node) => (
              <div
                key={node}
                style={{
                  height: '24px',
                  borderRadius: '3px',
                  backgroundColor: activeNodes.includes(node) ? 'var(--accent-purple)' : 'var(--surface-console)',
                  border: '1px solid',
                  borderColor: activeNodes.includes(node) ? 'var(--accent-purple)' : 'var(--border-subtle)',
                  boxShadow: activeNodes.includes(node) ? '0 0 12px var(--accent-purple)' : 'none',
                  transition: 'background-color 0.4s, border-color 0.4s, box-shadow 0.4s',
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-gray-muted)', marginTop: '0.75rem', lineHeight: 1.3 }}>
            Query embeds are mapped mathematically. Matching chunks (highlighted nodes) are retrieved and injected into the LLM context.
          </p>
        </div>

        {/* Right Side: Execution Output Console */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column' }} className="rag-output-col">
          <span className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-dark)', display: 'block', marginBottom: '0.75rem' }}>
            RAG PIPELINE CONSOLE OUTPUT
          </span>

          <div
            style={{
              flexGrow: 1,
              backgroundColor: 'var(--surface-console)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-gray-light)',
              minHeight: '140px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {isRunning && activeNodes.length === 0 && (
              <span className="dot-blink" style={{ animation: 'blink 1.2s infinite' }}>[1/2] Computing semantic query coordinates...</span>
            )}
            {isRunning && activeNodes.length > 0 && !ragOutput && (
              <span className="dot-blink" style={{ color: 'var(--accent-purple)', animation: 'blink 1.2s infinite' }}>[2/2] Context nodes matches index: {JSON.stringify(activeNodes)}. Routing synthesis...</span>
            )}
            {ragOutput}
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query..."
          disabled={isRunning}
          style={{
            flexGrow: 1,
            backgroundColor: 'var(--surface-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '0.8rem 1.2rem',
            color: 'var(--text-white)',
            outline: 'none',
            fontSize: '0.9rem',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
        />
        <button
          onClick={triggerRAG}
          disabled={isRunning || !query.trim()}
          className="btn-primary-glow interactive-element"
          style={{
            padding: '0 1.5rem',
            opacity: isRunning || !query.trim() ? 0.5 : 1,
            boxShadow: 'none',
          }}
        >
          Run RAG
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .rag-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .rag-nodes-col,
          .rag-output-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
