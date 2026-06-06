import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillNode {
  name: string;
  fullName: string;
  description: string;
  color: string;
  textColor: string;
  bgOutlineColor: string;
  size: number;
  top: number;
  left: number;
}

const frontendNodes: SkillNode[] = [
  {
    name: 'React',
    fullName: 'React Framework',
    description: 'Advanced declarative rendering, reconciliation pipelines, hooks optimization, and visual fiber context trees.',
    color: '#E0E2E5',
    textColor: '#0A0A0C',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 95,
    top: 110,
    left: 160,
  },
  {
    name: 'TS / JS',
    fullName: 'TypeScript & JavaScript',
    description: 'Type-safe compilations, strict interface modeling, asynchronous closures, and ESnext standard syntax.',
    color: '#1E293B',
    textColor: '#93C5FD',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 125,
    left: 80,
  },
  {
    name: 'Next.js',
    fullName: 'Next.js App Router',
    description: 'Server component streams, route pre-fetching, server-side rendering (SSR), and Chrome SEO optimization.',
    color: '#3B1E2B',
    textColor: '#FBCFE8',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 78,
    top: 55,
    left: 210,
  },
  {
    name: 'WebSockets',
    fullName: 'WebSocket & Socket.io Channels',
    description: 'Full-duplex real-time client-server communication channels, room connections, and real-time message exchange.',
    color: '#1E2E3E',
    textColor: '#A5F3FC',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 60,
    left: 110,
  },
  {
    name: 'Tailwind',
    fullName: 'Tailwind CSS',
    description: 'Utility-first styling mappings, fluid layout grids, responsive modifiers, and custom brand themes config.',
    color: '#1A2F3B',
    textColor: '#99F6E4',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 180,
    left: 125,
  },
  {
    name: 'Framer Motion',
    fullName: 'Framer Motion & Canvas',
    description: 'Dynamic animation rendering, physics-based page transitions, micro-interactions, and visual report dashboards.',
    color: '#5C1E3C',
    textColor: '#F9A8D4',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 78,
    top: 145,
    left: 240,
  },
  {
    name: 'MUI / AntD',
    fullName: 'Material UI & Ant Design',
    description: 'Enterprise UI libraries customization, theme configurations, custom design-system wrappers, and component building.',
    color: '#1E2548',
    textColor: '#93C5FD',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 180,
    left: 195,
  },
  {
    name: 'React Query',
    fullName: 'React Query Caching',
    description: 'Server-state synchronization, automatic query caching pipelines, background revalidation, and optimistic UI updates.',
    color: '#1E302B',
    textColor: '#A7F3D0',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 185,
    left: 60,
  },
  {
    name: 'React Native',
    fullName: 'React Native WebView',
    description: 'Hybrid mobile shell development, Student/Employee mobile apps wrapper, and native-to-web JS communication bridges.',
    color: '#301F3E',
    textColor: '#E9D5FF',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 60,
    left: 270,
  }
];

const backendNodes: SkillNode[] = [
  {
    name: 'Node.js',
    fullName: 'Node.js Runtime',
    description: 'Event-driven asynchronous I/O architectures, Express frameworks, Socket.io channels, and payment checkout integrations.',
    color: '#E2F0D9',
    textColor: '#0A0A0C',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 100,
    top: 110,
    left: 160,
  },
  {
    name: 'FastAPI',
    fullName: 'FastAPI / Python',
    description: 'Asynchronous Python controllers, automated Pydantic schema validation, and high-performance routers.',
    color: '#1A333E',
    textColor: '#99E6E2',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 130,
    left: 80,
  },
  {
    name: 'PostgreSQL',
    fullName: 'PostgreSQL DB',
    description: 'Relational database schema layouts, multi-tenant SQL data models, compound index tuning, and performance profiling.',
    color: '#1C2E42',
    textColor: '#BFDBFE',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 145,
    left: 240,
  },
  {
    name: 'Redis',
    fullName: 'Redis Caching',
    description: 'Pre-compiled key lookup stores, pipeline query clusters, memory buffers, and key eviction TTLs.',
    color: '#421C1C',
    textColor: '#FECACA',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 55,
    left: 210,
  },
  {
    name: 'MongoDB',
    fullName: 'MongoDB & NoSQL',
    description: 'NoSQL document schema design, high-performance aggregation pipelines, indexes tuning, and scale-out database storage.',
    color: '#1A3F2C',
    textColor: '#A7F3D0',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 180,
    left: 125,
  },
  {
    name: 'Socket.io',
    fullName: 'Socket.io real-time chat',
    description: 'Real-time full-duplex communication pipelines, room join-leave scopes, heartbeat channels, and message persistence.',
    color: '#1C2E3D',
    textColor: '#A5F3FC',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 75,
    top: 60,
    left: 110,
  }
];

const aiNodes: SkillNode[] = [
  {
    name: 'LangChain',
    fullName: 'LangChain Orchestrator',
    description: 'Automated chain templates, generative prompt layouts, structural outputs mapping, and routing chains.',
    color: '#E0EEF5',
    textColor: '#0A0A0C',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 100,
    top: 110,
    left: 160,
  },
  {
    name: 'Qdrant',
    fullName: 'Qdrant Vector DB',
    description: 'High-speed vector similarity indexes, payload queries, and custom collection setups.',
    color: '#281E3B',
    textColor: '#E9D5FF',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 130,
    left: 80,
  },
  {
    name: 'Claude / Cursor',
    fullName: 'Claude & Cursor AI Dev',
    description: 'Agentic terminal workflows, prompt chaining execution pipelines, Claude AI context management, and Cursor AI coding.',
    color: '#2C1D4D',
    textColor: '#DDD6FE',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 78,
    top: 60,
    left: 110,
  },
  {
    name: 'OpenAI',
    fullName: 'OpenAI Integration',
    description: 'Large language models fine-tuning, context injection pipelines, token sizing, and temperature configurations.',
    color: '#1C3E2D',
    textColor: '#A7F3D0',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 55,
    left: 210,
  },
  {
    name: 'RAG',
    fullName: 'RAG & Streaming',
    description: 'Vector embeddings ingestions, document chunk splits, semantic caches, and Server-Sent Event streams.',
    color: '#3B1E42',
    textColor: '#E9D5FF',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 80,
    top: 145,
    left: 240,
  },
  {
    name: 'Figma & Design',
    fullName: 'Figma layouts & UI Wireframing',
    description: 'High-fidelity dashboard screens, interactive design systems in Figma, Adobe UX specs, and translating layouts to code.',
    color: '#2B2B3E',
    textColor: '#DDD6FE',
    bgOutlineColor: 'rgba(124, 92, 255, 0.3)',
    size: 78,
    top: 180,
    left: 125,
  }
];

function ClusterColumn({
  title,
  nodes,
  defaultDesc
}: {
  title: string;
  nodes: SkillNode[];
  defaultDesc: string;
}) {
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);

  return (
    <div
      style={{
        flex: '1 1 320px',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
      className="expertise-column-card"
    >
      {/* Title */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-white)' }}>
          {title}
        </h3>
      </div>

      {/* Overlapping Nodes Area */}
      <div
        style={{
          position: 'relative',
          width: '320px',
          height: '220px',
          margin: '0 auto',
          backgroundColor: 'transparent',
        }}
      >
        {nodes.map((node, idx) => {
          const isNodeHovered = hoveredNode?.name === node.name;
          const halfSize = (node.size + 14) / 2;
          return (
            <motion.div
              key={node.name}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{
                scale: 1,
                opacity: 1,
                y: [0, -3, 0, 3, 0],
                x: [0, 2, 0, -2, 0],
              }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 4.5 + (idx % 3) * 1.2,
                  ease: "easeInOut",
                },
                x: {
                  repeat: Infinity,
                  duration: 5.5 + (idx % 2) * 1.5,
                  ease: "easeInOut",
                },
                scale: { duration: 0.5, ease: "easeOut", delay: idx * 0.05 },
                opacity: { duration: 0.5, delay: idx * 0.05 },
              }}
              style={{
                position: 'absolute',
                width: `${node.size + 14}px`,
                height: `${node.size + 14}px`,
                top: `${node.top - halfSize}px`,
                left: `${node.left - halfSize}px`,
                zIndex: isNodeHovered ? 10 : 2,
              }}
            >
              {/* Background contour */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />

              {/* Foreground interactive node */}
              <div
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="interactive-element"
                style={{
                  position: 'absolute',
                  top: '7px',
                  left: '7px',
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                  borderRadius: '50%',
                  backgroundColor: node.color,
                  color: node.textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0.65rem',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  zIndex: 2,
                  boxShadow: isNodeHovered ? `0 0 20px ${node.bgOutlineColor}` : 'none',
                  transform: isNodeHovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-sans)', pointerEvents: 'none', lineHeight: 1.2 }}>
                  {node.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Description Panel below */}
      <div
        style={{
          minHeight: '110px',
          padding: '1.25rem',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          backgroundColor: 'var(--surface-card-darker)',
          transition: 'all 0.3s ease',
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredNode ? (
            <motion.div
              key={hoveredNode.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h5 style={{ color: 'var(--text-white)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                {hoveredNode.fullName}
              </h5>
              <p style={{ color: 'var(--text-gray-light)', fontSize: '0.82rem', lineHeight: 1.4 }}>
                {hoveredNode.description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '0.82rem', color: 'var(--text-gray-muted)', fontStyle: 'italic' }}
            >
              {defaultDesc}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Expertise() {
  return (
    <section
      id="expertise"
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
          <span className="label-saas">04 // TECHNICAL EXPERTISE</span>
          <h2
            className="title-hero"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              marginTop: '1rem',
              color: 'var(--text-white)',
            }}
          >
            Core Skill Sets
          </h2>
          <p style={{ color: 'var(--text-gray-muted)', marginTop: '1rem', maxWidth: '600px' }}>
            Hover over any node inside the structural skill sets below to decode specific capabilities.
          </p>
        </div>

        {/* 3-Column Skills Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '3.5rem',
            justifyContent: 'center',
            marginTop: '3rem',
          }}
          className="skills-grid"
        >
          <ClusterColumn
            title="Frontend Stack"
            nodes={frontendNodes}
            defaultDesc="Hover over any frontend node to decode technical details."
          />
          <ClusterColumn
            title="Backend Stack"
            nodes={backendNodes}
            defaultDesc="Hover over any backend node to decode technical details."
          />
          <ClusterColumn
            title="AI &amp; Architecture"
            nodes={aiNodes}
            defaultDesc="Hover over any AI node to decode technical details."
          />
        </div>
      </div>
    </section>
  );
}
