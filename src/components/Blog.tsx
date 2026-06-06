import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  description: string;
  content: React.ReactNode;
}

const blogPosts: BlogPost[] = [
  {
    id: 'zero-latency-timeline',
    title: 'Building a Zero-Latency Timeline Sync Channel',
    category: 'Systems',
    date: 'May 28, 2026',
    readTime: '6 min read',
    description: 'How we implemented local action queuing and media compression pipelines to synchronize canvas coordinates and media streams on rough 2G/3G cellular networks.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>
          In cooperative design environments and construction logistics platforms, synchronized visual timelines are crucial. When multiple stakeholders view coordinate grids representing on-site shipments, any sync latency can lead to duplicate orders or misaligned equipment.
        </p>
        <p>
          For collaborative site logistics software, the challenge was magnified by rough cellular network conditions (2G/3G) on construction sites. Standard HTTP polling was slow, and naive WebSocket connections broke constantly.
        </p>
        
        <h3 style={{ color: 'var(--text-white)', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.5rem' }}>The Solution: Local Action Queues & Compression</h3>
        <p>
          We engineered a dual-layer synchronization channel:
        </p>
        <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            <strong>Optimistic Coordinates UI:</strong> The React canvas reflects visual movements immediately. A local state reconciliation engine maintains order sequence.
          </li>
          <li>
            <strong>Local Buffer Queue:</strong> If connection drops, updates are buffered in indexDB. When WebSocket connection re-establishes, the queue is drained sequentially.
          </li>
        </ol>

        <h3 style={{ color: 'var(--text-white)', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.5rem' }}>Implementation Example</h3>
        <pre className="code-container" style={{ backgroundColor: 'var(--surface-console)' }}>
          <code style={{ fontSize: '0.8rem', color: 'var(--text-gray-light)' }}>
{`// Dispatch channel with retry hooks
export class VisualSyncSocket {
  private queue: Array<string> = [];
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => this.flushQueue();
  }

  public pushAction(action: { x: number; y: number; type: string }) {
    const payload = JSON.stringify({ ...action, timestamp: Date.now() });
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    } else {
      this.queue.push(payload); // Buffer locally during cell drops
    }
  }

  private flushQueue() {
    while (this.queue.length > 0 && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(this.queue.shift()!);
    }
  }
}`}
          </code>
        </pre>
        
        <p>
          By utilizing lightweight numeric vectors instead of full JSON payloads and compressing visual canvas updates before transmission, we achieved steady coordinate synchronization averaging under 15ms once cell connections stabilized.
        </p>
      </div>
    )
  },
  {
    id: 'vector-cache-architecture',
    title: 'The Architecture of a Vector Cache',
    category: 'AI Engineering',
    date: 'April 15, 2026',
    readTime: '8 min read',
    description: 'A deep dive into caching LLM prompt embeddings using Qdrant vector databases, lowering upstream pipeline token billing by 35% and dropping latency to 4ms.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>
          Running production LLM assistants introduces significant operational costs and latency delays. Up to 40% of queries directed at user-support agents contain semantically overlapping intents. Querying OpenAI or Anthropic models repeatedly for identical intents is highly inefficient.
        </p>
        <p>
          Standard text caching (e.g. matching strings exactly in Redis) fails because natural language varies. "How do I edit my profile?" and "Can I change my bio details?" have different characters but identical intent.
        </p>

        <h3 style={{ color: 'var(--text-white)', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.5rem' }}>Semantic Indexing with Qdrant</h3>
        <p>
          To solve this, we designed a local semantic vector cache:
        </p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            Convert user prompt into an embedding vector using a lightweight model.
            We query our local vector database (Qdrant) using Cosine Similarity.
          </li>
          <li>
            If a match scores above 0.96 (heuristic threshold), we pull the cached completion payload immediately.
          </li>
          <li>
            If score falls below threshold, query the LLM and index the prompt embedding pair into Qdrant for future intent matches.
          </li>
        </ul>

        <h3 style={{ color: 'var(--text-white)', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.5rem' }}>Core Cache Heuristic</h3>
        <pre className="code-container" style={{ backgroundColor: 'var(--surface-console)' }}>
          <code style={{ fontSize: '0.8rem', color: 'var(--text-gray-light)' }}>
{`# Semantic Cache Matching Algorithm
from qdrant_client import QdrantClient

class EmbeddingCache:
    def __init__(self, host="localhost", port=6333):
        self.db = QdrantClient(host=host, port=port)

    def search_intent(self, embedding: list[float], threshold=0.96):
        hits = self.db.search(
            collection_name="intent_cache",
            query_vector=embedding,
            limit=1
        )
        if hits and hits[0].score >= threshold:
            return hits[0].payload["completion_text"] # Cache HIT
        return None # Cache MISS`}
          </code>
        </pre>
        
        <p>
          In our benchmark evaluations, caching vectors dropped intent matching speeds to under 4ms and resulted in a 35% reduction in total OpenAI API token consumption.
        </p>
      </div>
    )
  },
  {
    id: 'school-erp-redis',
    title: 'Re-engineering the School ERP Timetable Scheduler',
    category: 'Backend',
    date: 'March 10, 2026',
    readTime: '5 min read',
    description: 'How custom Redis pipelines and query optimization rescued an administrative portal, scaling to 15,000 active students.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>
          Legacy ERP platforms built on relational databases often experience severe bottlenecks. At <strong>Newron</strong>, the school scheduler generated scheduling queries taking up to 12 seconds when thousands of students looked up overlap grids simultaneously.
        </p>
        <p>
          The root cause lay in recursive database joins querying student profiles, teacher registers, classroom grids, and term dates.
        </p>

        <h3 style={{ color: 'var(--text-white)', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.5rem' }}>Redis Timetable pipelines</h3>
        <p>
          We restructured the querying pattern:
        </p>
        <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            <strong>JSON Serialization:</strong> Pre-compiled timetables are compiled during scheduling changes and cached directly in Redis as compressed JSON strings.
          </li>
          <li>
            <strong>Redis Pipeline Batching:</strong> Using Redis pipelines to query timetables in parallel clusters, eliminating RTT overhead.
          </li>
        </ol>

        <h3 style={{ color: 'var(--text-white)', fontSize: '1.4rem', fontWeight: 600, marginTop: '1.5rem' }}>Schedule Cache Query</h3>
        <pre className="code-container" style={{ backgroundColor: 'var(--surface-console)' }}>
          <code style={{ fontSize: '0.8rem', color: 'var(--text-gray-light)' }}>
{`// Cache-aside scheduler reading pre-compiled JSONs
export async function getTimetable(studentId: string, schoolId: string) {
  const cacheKey = \`sched:\${schoolId}:\${studentId}\`;
  
  // 1. Fast read from local memory
  const localVal = await memoryStore.get(cacheKey);
  if (localVal) return JSON.parse(localVal);

  // 2. Fetch from pipeline Redis
  const cachedVal = await redisClient.get(cacheKey);
  if (cachedVal) {
    memoryStore.set(cacheKey, cachedVal, 300); // 5 min TTL
    return JSON.parse(cachedVal);
  }

  // 3. Fallback to SQL compile
  return compileFromSQL(studentId, schoolId);
}`}
          </code>
        </pre>
        <p>
          Transitioning lookup requests to cached pre-compiled layouts reduced timetables render times from 12s to under 300ms, maintaining performance scaling during peak schedules.
        </p>
      </div>
    )
  }
];

export default function Blog({ id }: { id: string | null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll reading progress for detail pages
  useEffect(() => {
    if (!id) return;
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (id) {
    const post = blogPosts.find((p) => p.id === id);
    if (!post) {
      return (
        <div className="container-saas" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-white)' }}>Article Not Found</h2>
          <a href="#blog" className="btn-secondary-border" style={{ marginTop: '2rem' }}>Back to Articles</a>
        </div>
      );
    }

    return (
      <div style={{ position: 'relative', minHeight: '80vh', paddingBottom: '6rem' }}>
        {/* Reading progress bar */}
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            zIndex: 99,
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--accent-purple)',
              width: `${scrollProgress * 100}%`,
              boxShadow: '0 0 10px var(--accent-purple)',
            }}
          />
        </div>

        <div className="container-saas" style={{ maxWidth: '800px', paddingTop: '4rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
            <a
              href="#blog"
              className="btn-secondary-border interactive-element"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                marginBottom: '2rem',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
              <span>Back to Articles</span>
            </a>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="label-saas" style={{ fontSize: '0.65rem' }}>{post.category}</span>
              <span style={{ color: 'var(--text-gray-dark)', fontSize: '0.8rem' }}>•</span>
              <span style={{ color: 'var(--text-gray-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{post.date}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, color: 'var(--text-white)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              {post.title}
            </h1>

            {/* Author card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--accent-purple)' }}>
                  <path d="M12 12C12 10.0711 9.76142 8.5 7 8.5C4.23858 8.5 2 10.0711 2 12M7 6C8.10457 6 9 5.10457 9 4C9 2.89543 8.10457 2 7 2C5.89543 2 5 2.89543 5 4C5 5.10457 5.89543 6 7 6Z" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-white)' }}>Jassi Parihar</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray-muted)' }}>{post.readTime}</p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article style={{ color: 'var(--text-gray-light)', fontSize: '1.05rem', lineHeight: 1.7 }} className="blog-markdown">
            {post.content}
          </article>
        </div>
      </div>
    );
  }

  // Filter blog posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--bg-dark)', minHeight: '80vh' }}>
      <div className="container-saas">
        {/* Section Header */}
        <div style={{ marginBottom: '4rem' }}>
          <span className="label-saas">TECHNICAL INSIGHTS // JOURNAL</span>
          <h2
            className="title-hero"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              marginTop: '1rem',
              color: 'var(--text-white)',
            }}
          >
            Insights &amp; Logs
          </h2>
          <p style={{ color: 'var(--text-gray-muted)', marginTop: '1rem', maxWidth: '600px' }}>
            Explorations in high-throughput backend scaling, low-latency client rendering pipelines, and semantic vector database implementations.
          </p>
        </div>

        {/* Filter Controls Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '2rem',
          }}
        >
          {/* Categories & Search row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['ALL', 'Systems', 'AI Engineering', 'Backend'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="interactive-element"
                  style={{
                    backgroundColor: selectedCategory === cat ? 'rgba(124, 92, 255, 0.08)' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--accent-purple)' : 'var(--border-subtle)',
                    color: selectedCategory === cat ? 'var(--text-white)' : 'var(--text-gray-muted)',
                    borderRadius: '20px',
                    padding: '0.45rem 1.15rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '0.5rem 1.25rem 0.5rem 2.5rem',
                  color: 'var(--text-white)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-purple)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray-muted)' }}
              >
                <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Blogs grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => (window.location.hash = `#blog/${post.id}`)}
              className="interactive-element saas-card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
                padding: '2rem',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="label-saas" style={{ fontSize: '0.65rem' }}>{post.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>{post.readTime}</span>
                </div>

                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--text-white)',
                    lineHeight: 1.3,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-gray-muted)',
                    lineHeight: 1.5,
                    marginBottom: '2rem',
                  }}
                >
                  {post.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  marginTop: 'auto',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-gray-muted)', fontFamily: 'var(--font-mono)' }}>
                  {post.date}
                </span>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>Read Post</span>
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.5 7.5L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-gray-muted)' }}>
            No articles found matching that search criteria.
          </div>
        )}
      </div>
    </section>
  );
}
