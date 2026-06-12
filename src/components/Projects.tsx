import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CaseStudy {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  gallery?: string[];
  challenge: string;
  solution: string;
  impact: string;
  tech: string[];
  architecture: React.ReactNode; // SVG flowchart
  codeSnippet: string;
  codeLanguage: string;
  metrics: { label: string; value: string }[];
  liveUrl?: string;
}

const caseStudiesData: CaseStudy[] = [
  {
    id: 'buildstorey',
    number: '01',
    title: 'Buildstorey',
    subtitle: 'B2B & B2C Building Materials E-Commerce Marketplace',
    image: '/assets/buildstorey_onboarding.png',
    gallery: [
      '/assets/buildstorey_onboarding.png',
      '/assets/buildstorey_catalog.png'
    ],
    challenge: 'Procuring building materials online for bulk business orders (B2B) and individual retail consumers (B2C) suffered from fragmented supplier listings, complex onboarding steps, and weak search engine visibility.',
    solution: 'Designed and engineered the hybrid B2B & B2C e-commerce marketplace from scratch, establishing Amazon-like online purchasing capabilities. Built role-wise UI portals for buyer login and multi-step seller onboarding. Optimized Chrome search engine ranking using Next.js Server-Side Rendering (SSR) dynamic pre-rendering, Redux Saga for inventory synchronization, and a high-performance Node.js/Express/MongoDB backend database engine.',
    impact: 'Successfully integrated 14+ materials categories (cement, steel, tiles, etc.), enabling direct retail purchasing (B2C) and bulk orders (B2B), achieving a 98/100 Chrome SEO score.',
    tech: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Material UI', 'Ant Design', 'Razorpay', 'Adobe'],
    metrics: [
      { label: 'PRODUCT CATEGORIES', value: '14' },
      { label: 'RENDERING SPEED', value: 'SSR & SSG' },
      { label: 'CHROME SEO SCORE', value: '98/100' }
    ],
    codeLanguage: 'typescript',
    codeSnippet: `// Next.js Server-Side Rendering (SSR) & Dynamic SEO Page Meta Tags
import Head from 'next/head';

export async function getServerSideProps(context: any) {
  const { category } = context.query;
  const res = await fetch(\`https://api.buildstorey.com/v1/products?category=\${category || 'all'}\`);
  const products = await res.json();

  return {
    props: {
      products: products || [],
      categoryName: category ? String(category).toUpperCase() : 'ALL MATERIALS'
    }
  };
}

export default function MaterialCatalog({ products, categoryName }: any) {
  return (
    <>
      <Head>
        <title>{\`Buy \${categoryName} Online | Buildstorey Marketplace\`}</title>
        <meta name="description" content={\`Procure best-price \${categoryName} online. Multi-role buyer & seller marketplace catalog.\`} />
      </Head>
      <div className="material-grid">
        {products.map((p: any) => <ProductCard key={p.id} data={p} />)}
      </div>
    </>
  );
}`,
    architecture: (
      <svg width="100%" height="160" viewBox="0 0 540 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', maxWidth: '540px' }}>
        {/* Design Stage */}
        <rect x="10" y="20" width="100" height="50" rx="6" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="60" y="42" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">1. ADOBE UX</text>
        <text x="60" y="57" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">Client Spec</text>

        {/* Frontend Stage */}
        <rect x="145" y="20" width="110" height="50" rx="6" fill="#0C0C0E" stroke="var(--accent-purple)" strokeWidth="1"/>
        <text x="200" y="42" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2. NEXT.JS SSR</text>
        <text x="200" y="57" fill="var(--accent-purple)" fontSize="8" fontFamily="monospace" textAnchor="middle">MUI &amp; AntD UI</text>

        {/* Backend Stage */}
        <rect x="290" y="20" width="110" height="50" rx="6" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="345" y="42" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3. NODE.JS API</text>
        <text x="345" y="57" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">Express &amp; Razorpay</text>

        {/* Database Stage */}
        <rect x="435" y="20" width="95" height="50" rx="6" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="482" y="42" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">4. MONGODB</text>
        <text x="482" y="57" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">14 Material Cat</text>

        {/* Connectors */}
        <path d="M110 45H145" stroke="var(--accent-purple)" strokeWidth="1.5" strokeDasharray="3 3"/>
        <polygon points="145,45 139,41 139,49" fill="var(--accent-purple)"/>
        <text x="127" y="37" fill="var(--accent-purple)" fontSize="7" fontFamily="monospace" textAnchor="middle">Design</text>

        <path d="M255 45H290" stroke="var(--accent-purple)" strokeWidth="1.5"/>
        <polygon points="290,45 284,41 284,49" fill="var(--accent-purple)"/>
        <text x="272" y="37" fill="var(--accent-purple)" fontSize="7" fontFamily="monospace" textAnchor="middle">Fetch API</text>

        <path d="M400 45H435" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <polygon points="435,45 429,41 429,49" fill="rgba(255,255,255,0.2)"/>
        <text x="417" y="37" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">Mongoose</text>

        {/* Dynamic workflow indicator */}
        <rect x="10" y="85" width="520" height="60" rx="4" fill="rgba(124, 92, 255, 0.03)" stroke="rgba(124, 92, 255, 0.1)" strokeWidth="1"/>
        <text x="270" y="103" fill="var(--accent-purple)" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">PRODUCT DEVELOPMENT TIMELINE FROM SCRATCH</text>
        <text x="270" y="120" fill="var(--text-gray-light)" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Stage 1: Client Requirements gathering and Adobe UX flow wireframing.</text>
        <text x="270" y="135" fill="var(--text-gray-light)" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Stage 2: Next.js SSR Frontend setup styled with Material UI &amp; Ant Design.</text>
        <text x="270" y="150" fill="var(--text-gray-light)" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Stage 3: Node.js Express Gateway API with Razorpay checkouts &amp; MongoDB store.</text>
      </svg>
    )
  },
  {
    id: 'school-erp',
    number: '02',
    title: 'School ERP Platform',
    subtitle: 'Vast Multi-Module Educational ERP System (ELERN)',
    image: '/assets/school_erp_login.png',
    liveUrl: 'https://school.elern.io/',
    gallery: [
      '/assets/school_erp_login.png',
      '/assets/school_erp_student.png',
      '/assets/school_erp_employee.png'
    ],
    challenge: 'Building a highly scalable, multi-tenant SaaS educational ERP from scratch required a modular architecture to support wide operations (Library, Transport, Hostel, Helpdesk, Utilities) while maintaining unified monorepo governance and real-time user state synchronization.',
    solution: 'Designed and built the modular SaaS platform from scratch using a React/Tailwind monorepo powered by Node.js and PostgreSQL. Authored core modules including Helpdesk ticketing, Utility billing, Book Wise Library management, Discipline records, Hostel allocation systems, and Transport routing trackers. Engineered companion hybrid mobile applications for Students and Employees utilizing React Native WebViews. Integrated Socket.io and WebSockets for real-time messaging, alongside interactive React ApexCharts for visual administration reports. Guided rapid coding workflows using Claude AI and Cursor AI with layout screens detailed in Figma.',
    impact: 'Successfully delivered 6 independent, feature-rich ERP modules in a unified monorepo. Built high-fidelity dashboards utilizing React ApexCharts, optimized loading with React Query, and deployed custom mobile webview portals.',
    tech: ['React.js', 'Tailwind CSS', 'React Query', 'Framer Motion', 'Node.js', 'PostgreSQL', 'Socket.io', 'WebSockets', 'React Native', 'React ApexCharts', 'Claude AI', 'Cursor AI', 'Figma', 'Monorepo'],
    metrics: [
      { label: 'ERP MODULES', value: '6 CORE' },
      { label: 'REAL-TIME CHAT', value: 'Socket.io' },
      { label: 'PLATFORMS', value: 'Web & Mobile' }
    ],
    codeLanguage: 'typescript',
    codeSnippet: `// React Query & Socket.io hook for real-time Helpdesk ticketing sync in Monorepo
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://api.elern.com/helpdesk');

export function useHelpdeskTickets(schoolId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['helpdesk', 'tickets', schoolId];

  // React Query fetching and caching
  const { data: tickets, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(\`/api/v1/helpdesk/tickets?schoolId=\${schoolId}\`);
      return res.json();
    }
  });

  // WebSocket real-time synchronization
  useEffect(() => {
    socket.emit('join-room', schoolId);
    
    socket.on('ticket-updated', (updatedTicket) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return [];
        return old.map((t: any) => t.id === updatedTicket.id ? updatedTicket : t);
      });
    });

    return () => {
      socket.off('ticket-updated');
    };
  }, [schoolId, queryClient]);

  return { tickets, isLoading };
}`,
    architecture: (
      <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', maxWidth: '480px' }}>
        {/* Clients */}
        <rect x="5" y="30" width="85" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="47" y="50" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CLIENT APPS</text>
        <text x="47" y="62" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">React Native WV</text>

        {/* API Gateway / Socket Server */}
        <rect x="120" y="30" width="95" height="40" rx="4" fill="#0C0C0E" stroke="var(--accent-purple)" strokeWidth="1"/>
        <text x="167" y="50" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE GATEWAY</text>
        <text x="167" y="62" fill="var(--accent-purple)" fontSize="7" fontFamily="monospace" textAnchor="middle">Express &amp; Socket.io</text>

        {/* Monorepo Modules */}
        <rect x="245" y="5" width="105" height="42" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="297" y="21" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MONOREPO SVCS</text>
        <text x="297" y="32" fill="rgba(255,255,255,0.4)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Helpdesk, Lib, Hostel</text>
        <text x="297" y="40" fill="rgba(255,255,255,0.4)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Util, Transport, Disc</text>

        {/* PostgreSQL DB */}
        <rect x="245" y="53" width="105" height="42" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="297" y="74" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">POSTGRESQL DB</text>
        <text x="297" y="86" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">Relational Schema</text>

        {/* Report analytics */}
        <rect x="380" y="30" width="95" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="427" y="50" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ANALYTICS</text>
        <text x="427" y="62" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">React ApexCharts</text>

        {/* Connectors */}
        <path d="M90 50H120" stroke="var(--accent-purple)" strokeWidth="1"/>
        <path d="M215 42 L245 26" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M215 58 L245 74" stroke="var(--accent-purple)" strokeWidth="1"/>
        <path d="M350 26 L380 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M350 74 L380 58" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>

        <text x="105" y="44" fill="var(--accent-purple)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">WS/HTTP</text>
        <text x="230" y="70" fill="var(--accent-purple)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">SQL</text>
      </svg>
    )
  },
  {
    id: 'ai-platform',
    number: '03',
    title: 'AI Assistant Platform',
    subtitle: 'Semantic LLM Agent Orchestrator',
    image: '/assets/ai_platform.png',
    challenge: 'Standard prompt completions consume significant API tokens and suffer from latency delays due to excessive database document scanning.',
    solution: 'Developed an LLM compiler utilizing a local vector cache. Integrated Server-Sent Events (SSE) for streaming prompt outputs and LangChain modules for custom agent routing.',
    impact: 'Decreased model token expenses by 35% and cut pipeline latency by half.',
    tech: ['React', 'FastAPI', 'Python', 'LangChain', 'Qdrant DB', 'OpenAI'],
    metrics: [
      { label: 'API TOKEN SAVINGS', value: '35%' },
      { label: 'VECTOR RETRIEVAL', value: '4ms' },
      { label: 'COMPILATION LATENCY', value: '-50%' }
    ],
    codeLanguage: 'python',
    codeSnippet: `# Semantic caching decorator utilizing vector database index
from qdrant_client import QdrantClient

class SemanticCache:
    def __init__(self):
        self.qdrant = QdrantClient(host="localhost", port=6333)

    def query(self, prompt_embedding: list[float], threshold: float = 0.96):
        # Scan local vector space index
        results = self.qdrant.search(
            collection_name="semantic_cache",
            query_vector=prompt_embedding,
            limit=1
        )
        if results and results[0].score >= threshold:
            return results[0].payload["completion"] # Cache hit!
        return None # Cache miss`,
    architecture: (
      <svg width="100%" height="90" viewBox="0 0 400 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', maxWidth: '400px' }}>
        <rect x="10" y="25" width="80" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="50" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Prompt Console</text>
        <rect x="120" y="25" width="90" height="40" rx="4" fill="#0C0C0E" stroke="var(--accent-purple)" strokeWidth="1"/>
        <text x="165" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">FastAPI Engine</text>
        <rect x="240" y="5" width="65" height="30" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="272" y="23" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle">Qdrant DB</text>
        <rect x="325" y="25" width="65" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="357" y="49" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle">OpenAI GPT</text>
        <path d="M90 45H120" stroke="var(--accent-purple)" strokeWidth="1.5"/>
        <path d="M210 35 L240 20" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M210 50 H325" stroke="var(--accent-purple)" strokeWidth="1.5" strokeDasharray="2 2"/>
        <path d="M272 35 V70 H165 V65" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
        <text x="105" y="38" fill="var(--accent-purple)" fontSize="8" fontFamily="monospace" textAnchor="middle">SSE</text>
        <text x="225" y="22" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">RAG</text>
      </svg>
    )
  },
  {
    id: 'sudhaanva',
    number: '04',
    title: 'Sudhaanva',
    subtitle: 'Premium Ayurvedic Healthcare & Consultation Platform',
    image: '/assets/sudhaanva_journey.png',
    liveUrl: 'https://sudhaanva.in/',
    gallery: [
      '/assets/sudhaanva_journey.png',
      '/assets/sudhaanva_consultation_form.png',
      '/assets/sudhaanva_meditation.png'
    ],
    challenge: 'Designing an intuitive wellness interface that bridges traditional Ayurvedic health practices with modern scientific exercise consultations, while ensuring seamless client onboarding, content publishing through Sanity CMS, and robust search engine visibility.',
    solution: 'Engineered a high-performance Next.js application with Tailwind CSS and Framer Motion for premium, organic animations. Built a flexible schema in Sanity CMS to manage health blogs, dietary consults, and exercise regimes. Integrated Google Analytics for tracking user behavior and implemented advanced metadata optimization for local/global SEO, deploying the entire setup on Lovable.',
    impact: 'Delivered a premium digital experience with a 99/100 Google Lighthouse SEO score, successfully connecting clients with Ayurvedic experts and organic exercise programs.',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Sanity CMS', 'Google Analytics', 'SEO', 'Lovable', 'ChatGPT'],
    metrics: [
      { label: 'SEO PERFORMANCE', value: '99/100' },
      { label: 'LOAD TIME', value: '1.2s' },
      { label: 'CMS CHANNELS', value: 'Sanity' }
    ],
    codeLanguage: 'typescript',
    codeSnippet: `// Next.js static paths generation for Ayurvedic health articles via Sanity CMS
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2026-06-11',
  useCdn: true
});

export async function getStaticPaths() {
  const query = \`*[_type == "article"]{ "slug": slug.current }\`;
  const articles = await client.fetch(query);
  const paths = articles.map((article: any) => ({
    params: { slug: article.slug }
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: any) {
  const query = \`*[_type == "article" && slug.current == $slug][0]{
    title,
    body,
    seoTitle,
    seoDescription,
    "imageUrl": mainImage.asset->url
  }\`;
  const article = await client.fetch(query, { slug: params.slug });

  return {
    props: { article },
    revalidate: 60 // Incremental Static Regeneration (ISR)
  };
}`,
    architecture: (
      <svg width="100%" height="90" viewBox="0 0 400 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', maxWidth: '400px' }}>
        <rect x="10" y="25" width="80" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="50" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Sanity CMS</text>
        <rect x="120" y="25" width="90" height="40" rx="4" fill="#0C0C0E" stroke="var(--accent-purple)" strokeWidth="1"/>
        <text x="165" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Next.js SSR</text>
        <rect x="240" y="25" width="70" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="275" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">SEO Engine</text>
        <rect x="325" y="25" width="65" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="357" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Lovable Host</text>
        <path d="M90 45H120" stroke="var(--accent-purple)" strokeWidth="1.5"/>
        <path d="M210 45H240" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M310 45H325" stroke="var(--accent-purple)" strokeWidth="1.5"/>
        <text x="105" y="38" fill="var(--accent-purple)" fontSize="8" fontFamily="monospace" textAnchor="middle">GROQ</text>
        <text x="225" y="38" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">JSON-LD</text>
      </svg>
    )
  },
  {
    id: 'cjpmedia',
    number: '05',
    title: 'CJP Media',
    subtitle: 'Cockroach Janta Party Media & Community Portal',
    image: '/assets/cjpmedia_homepage.png',
    liveUrl: 'https://www.cjpmedia.in/',
    gallery: [
      '/assets/cjpmedia_homepage.png',
      '/assets/cjpmedia_opinions.png',
      '/assets/cjpmedia_article.png',
      '/assets/cjpmedia_national.png'
    ],
    challenge: 'Building a community news and article publishing engine from scratch, requiring instant load times, structured real-time SEO validation for authors, subscriber list sync, and robust relational data storage.',
    solution: 'Designed in Figma/Stitch and developed using Bolt.io, Next.js, and Supabase. Crafted an AI-assisted article composition system using Claude AI that evaluates SEO readability and scores keyword density in real-time. Configured Supabase database engines for article indexing and user logins, running a transactional email system for newsletter subscribers, deployed on Vercel.',
    impact: 'Launched a modern news hub with real-time subscriber sync, automated article SEO reports, and lightning-fast edge rendering.',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Email Subscriber', 'Figma', 'Stitch', 'Bolt.io', 'Claude AI', 'Antigravity'],
    metrics: [
      { label: 'SUBSCRIBERS SYNC', value: 'Real-time' },
      { label: 'ARTICLE SEO SCORE', value: 'Dynamic' },
      { label: 'DEPLOYMENT EDGE', value: 'Vercel' }
    ],
    codeLanguage: 'typescript',
    codeSnippet: `// Supabase real-time database listener & real-time SEO checker widget in Next.js
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeArticles() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    // Fetch initial articles list
    supabase.from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setArticles(data));

    // Subscribe to real-time database updates
    const channel = supabase
      .channel('article_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'articles' }, 
        (payload) => {
          setArticles((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return articles;
}`,
    architecture: (
      <svg width="100%" height="90" viewBox="0 0 400 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', maxWidth: '400px' }}>
        <rect x="10" y="25" width="80" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="50" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Figma Design</text>
        <rect x="120" y="25" width="90" height="40" rx="4" fill="#0C0C0E" stroke="var(--accent-purple)" strokeWidth="1"/>
        <text x="165" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Next.js Front</text>
        <rect x="240" y="25" width="70" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="275" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Supabase DB</text>
        <rect x="325" y="25" width="65" height="40" rx="4" fill="#0C0C0E" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <text x="357" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">Vercel Edge</text>
        <path d="M90 45H120" stroke="var(--accent-purple)" strokeWidth="1.5"/>
        <path d="M210 45H240" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M310 45H325" stroke="var(--accent-purple)" strokeWidth="1.5"/>
        <text x="105" y="38" fill="var(--accent-purple)" fontSize="8" fontFamily="monospace" textAnchor="middle">Stitch UI</text>
        <text x="225" y="38" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">SQL Realtime</text>
      </svg>
    )
  }
];

function InteractiveArchitecture() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Adobe UX",
      subtitle: "Design & Specs",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9M3 20v-8a2 2 0 012-2h4M3 12h6M12 4h6a2 2 0 012 2v4M12 12h8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "ADOBE UX DESIGN",
      desc: "Conducted client interaction sessions to map the e-commerce purchase user-journey. Designed wireframes in Adobe showing the multi-step supplier onboarding flow and buyer catalogs.",
      tech: "Adobe Suite, UX wireframes, client spec mappings, 14 material categories planning"
    },
    {
      title: "2. Next.js SSR",
      subtitle: "MUI & AntD Front",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
        </svg>
      ),
      label: "NEXT.JS SSR DEVELOPMENT",
      desc: "Developed the hybrid B2B/B2C storefront from scratch. Configured Next.js SSR to pre-render product pages dynamically on the server for Google/Chrome SEO crawl optimization, styled using custom Material UI & Ant Design theme wrappers.",
      tech: "Next.js App Router, SSR, Material UI, Ant Design, Redux Saga, Chrome SEO optimization"
    },
    {
      title: "3. Node.js API",
      subtitle: "Express & Razorpay",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "NODE.JS EXPRESS BACKEND",
      desc: "Designed stateless Express REST APIs to handle merchant product listings and buyer checkout routes. Integrated Razorpay payment gateway API with secure webhook listeners for transaction reconciliations.",
      tech: "Node.js, Express.js, Razorpay API, JWT auth, supplier validation webhooks"
    },
    {
      title: "4. MongoDB",
      subtitle: "14 Categories DB",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "MONGODB DATABASE ENGINE",
      desc: "Modeled NoSQL document structures to store listing inventories and transactions. Designed compound indexes on the 14 building material categories to optimize query speeds for Amazon-style retail searches.",
      tech: "MongoDB, Mongoose schemas, compound indexes, aggregation pipelines"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', padding: '0' }}>
      {/* Node row */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '0.45rem', 
          position: 'relative',
          padding: '0.2rem 0.5rem',
          overflowX: 'auto',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}
        className="no-scrollbar arch-flow-container"
      >
        {/* Connection line in background */}
        <div 
          className="arch-connection-line"
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '42px', 
            right: '42px', 
            height: '1px', 
            background: 'linear-gradient(to right, var(--accent-purple) 0%, rgba(255,255,255,0.03) 100%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} 
        />

        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="interactive-element arch-flow-node"
              style={{
                position: 'relative',
                zIndex: 5,
                flex: '1 1 auto',
                minWidth: '55px',
                maxWidth: '80px',
                backgroundColor: isActive ? 'var(--surface-card-hover)' : 'var(--surface-card)',
                border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '0.3rem 0.35rem',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 10px rgba(124, 92, 255, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Icon / Step indicator */}
              <div 
                style={{ 
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                  marginBottom: '0.1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  transition: 'color 0.3s'
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <div 
                className="arch-flow-node-title"
                style={{ 
                  fontSize: '0.58rem', 
                  fontWeight: 700, 
                  color: isActive ? 'var(--text-white)' : 'var(--text-gray-light)',
                  transition: 'color 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.title}
              </div>

              {/* Subtitle */}
              <div 
                className="arch-flow-node-subtitle"
                style={{ fontSize: '0.41rem', color: 'var(--text-gray-muted)', marginTop: '0.05rem', whiteSpace: 'nowrap' }}
              >
                {step.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info details display below */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="saas-card"
          style={{
            padding: '0.45rem 0.6rem',
            backgroundColor: 'var(--surface-card-darker)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            boxShadow: 'none'
          }}
        >
          <span className="label-saas" style={{ fontSize: '0.45rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '0.1rem' }}>
            {steps[activeStep].label}
          </span>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.15rem' }}>
            {steps[activeStep].title} Details
          </h4>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-gray-light)', lineHeight: 1.2, marginBottom: '0.25rem' }}>
            {steps[activeStep].desc}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.2rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="label-saas" style={{ fontSize: '0.4rem', color: 'var(--text-gray-dark)' }}>TECHNOLOGY:</span>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {steps[activeStep].tech}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ERPInteractiveArchitecture() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Monorepo",
      subtitle: "6 Core Modules",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "MONOREPO SERVICES & MODULES",
      desc: "Engineered 6 distinct educational modules from scratch (Helpdesk, Utility billing, Book Management, student Discipline registers, Hostel bookings, Transport trackers) in a high-performance monorepo.",
      tech: "React.js, Tailwind CSS, React Query, Framer Motion, monorepo workspaces"
    },
    {
      title: "2. Student App",
      subtitle: "WebView Mobile",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "REACT NATIVE STUDENT APP",
      desc: "Developed the hybrid mobile student application packaging web views with React Native WebView wrappers. Displays student timetables, fees portals, and live GPS vehicle tracking.",
      tech: "React Native WebView, JavaScript Bridge, Google Maps GPS tracking APIs"
    },
    {
      title: "3. Employee App",
      subtitle: "WebView Mobile",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "REACT NATIVE EMPLOYEE APP",
      desc: "Developed the hybrid mobile employee application with React Native WebView wrappers, rendering Jassi's custom 'My Mentorship' cards to monitor active student progress metrics.",
      tech: "React Native, WebView containers, React ApexCharts, API caching"
    },
    {
      title: "4. API & Chat",
      subtitle: "Socket & SQL Server",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "REAL-TIME BACKEND ENGINE",
      desc: "Architected Node.js Express REST APIs integrated with Socket.io WebSocket servers for real-time Helpdesk client chat channels, persisting records inside relational PostgreSQL tables.",
      tech: "Node.js, Express, PostgreSQL, Socket.io, WebSockets, Redis cache"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', padding: '0' }}>
      {/* Node row */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '0.45rem', 
          position: 'relative',
          padding: '0.2rem 0.5rem',
          overflowX: 'auto',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}
        className="no-scrollbar arch-flow-container"
      >
        {/* Connection line in background */}
        <div 
          className="arch-connection-line"
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '42px', 
            right: '42px', 
            height: '1px', 
            background: 'linear-gradient(to right, var(--accent-purple) 0%, rgba(255,255,255,0.03) 100%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} 
        />

        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="interactive-element arch-flow-node"
              style={{
                position: 'relative',
                zIndex: 5,
                flex: '1 1 auto',
                minWidth: '55px',
                maxWidth: '80px',
                backgroundColor: isActive ? 'var(--surface-card-hover)' : 'var(--surface-card)',
                border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '0.3rem 0.35rem',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 10px rgba(124, 92, 255, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Icon / Step indicator */}
              <div 
                style={{ 
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                  marginBottom: '0.1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  transition: 'color 0.3s'
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <div 
                className="arch-flow-node-title"
                style={{ 
                  fontSize: '0.58rem', 
                  fontWeight: 700, 
                  color: isActive ? 'var(--text-white)' : 'var(--text-gray-light)',
                  transition: 'color 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.title}
              </div>

              {/* Subtitle */}
              <div 
                className="arch-flow-node-subtitle"
                style={{ fontSize: '0.41rem', color: 'var(--text-gray-muted)', marginTop: '0.05rem', whiteSpace: 'nowrap' }}
              >
                {step.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info details display below */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="saas-card"
          style={{
            padding: '0.45rem 0.6rem',
            backgroundColor: 'var(--surface-card-darker)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            boxShadow: 'none'
          }}
        >
          <span className="label-saas" style={{ fontSize: '0.45rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '0.1rem' }}>
            {steps[activeStep].label}
          </span>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.15rem' }}>
            {steps[activeStep].title} Details
          </h4>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-gray-light)', lineHeight: 1.2, marginBottom: '0.25rem' }}>
            {steps[activeStep].desc}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.2rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="label-saas" style={{ fontSize: '0.4rem', color: 'var(--text-gray-dark)' }}>TECHNOLOGY:</span>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {steps[activeStep].tech}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SudhaanvaInteractiveArchitecture() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Sanity CMS",
      subtitle: "Ayurveda Schemas",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "SANITY CMS GRAPHQL CORE",
      desc: "Designed flexible schemas for organic herbs, recipes, dietary guidelines, and consultation sessions. Enabled content editors to update blogs and programs dynamically via a secure Sanity workspace.",
      tech: "Sanity.io, GROQ queries, structured content CDN, Next.js ISR"
    },
    {
      title: "2. Next.js & Tailwind",
      subtitle: "Framer Motion Animations",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
        </svg>
      ),
      label: "NEXT.JS FRONTEND EXPERIENCE",
      desc: "Developed a stunning, modern, responsive landing page and dashboard interface styled with Tailwind CSS. Integrated custom Framer Motion page transitions, parallax scroll effects, and organic hover micro-interactions.",
      tech: "Next.js App Router, React 18, Tailwind CSS, Framer Motion animations"
    },
    {
      title: "3. SEO & Analytics",
      subtitle: "Lighthouse 99",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <path d="M2 12h20"/>
        </svg>
      ),
      label: "METADATA & VISITOR PIPELINE",
      desc: "Implemented clean JSON-LD structured data for health consult services, achieving a 99/100 Lighthouse SEO score. Integrated Google Analytics 4 for tracking user conversion funnels.",
      tech: "Google Analytics 4, JSON-LD Schema, Next.js Metadata API, dynamic meta tags"
    },
    {
      title: "4. Lovable Cloud",
      subtitle: "CI/CD Deployment",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "LOVABLE CLOUD INFRASTRUCTURE",
      desc: "Deployed the application on Lovable's specialized hosting server, achieving extremely fast response times globally. Configured custom domain routing and SSL certificates with auto-scaling DNS.",
      tech: "Lovable Server, Edge CDN, custom domain routing, SSL encryption"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', padding: '0' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '0.45rem', 
          position: 'relative',
          padding: '0.2rem 0.5rem',
          overflowX: 'auto',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}
        className="no-scrollbar arch-flow-container"
      >
        <div 
          className="arch-connection-line"
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '42px', 
            right: '42px', 
            height: '1px', 
            background: 'linear-gradient(to right, var(--accent-purple) 0%, rgba(255,255,255,0.03) 100%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} 
        />

        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="interactive-element arch-flow-node"
              style={{
                position: 'relative',
                zIndex: 5,
                flex: '1 1 auto',
                minWidth: '55px',
                maxWidth: '80px',
                backgroundColor: isActive ? 'var(--surface-card-hover)' : 'var(--surface-card)',
                border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '0.3rem 0.35rem',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 10px rgba(124, 92, 255, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div 
                style={{ 
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                  marginBottom: '0.1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  transition: 'color 0.3s'
                }}
              >
                {step.icon}
              </div>

              <div 
                className="arch-flow-node-title"
                style={{ 
                  fontSize: '0.58rem', 
                  fontWeight: 700, 
                  color: isActive ? 'var(--text-white)' : 'var(--text-gray-light)',
                  transition: 'color 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.title}
              </div>

              <div 
                className="arch-flow-node-subtitle"
                style={{ fontSize: '0.41rem', color: 'var(--text-gray-muted)', marginTop: '0.05rem', whiteSpace: 'nowrap' }}
              >
                {step.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="saas-card"
          style={{
            padding: '0.45rem 0.6rem',
            backgroundColor: 'var(--surface-card-darker)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            boxShadow: 'none'
          }}
        >
          <span className="label-saas" style={{ fontSize: '0.45rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '0.1rem' }}>
            {steps[activeStep].label}
          </span>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.15rem' }}>
            {steps[activeStep].title} Details
          </h4>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-gray-light)', lineHeight: 1.2, marginBottom: '0.25rem' }}>
            {steps[activeStep].desc}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.2rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="label-saas" style={{ fontSize: '0.4rem', color: 'var(--text-gray-dark)' }}>TECHNOLOGY:</span>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {steps[activeStep].tech}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CJPInteractiveArchitecture() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Stitch & Figma",
      subtitle: "Visual Designing",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9M3 20v-8a2 2 0 012-2h4M3 12h6M12 4h6a2 2 0 012 2v4M12 12h8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "STITCH & FIGMA WORKSPACE",
      desc: "Designed components and media platform wireframes inside Stitch and Figma. Established grid layout guidelines for community articles, subscriber dashboards, and dark mode UI aesthetics.",
      tech: "Figma layouts, Stitch token sets, mobile responsive grids"
    },
    {
      title: "2. Bolt & Claude",
      subtitle: "AI Development",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "AI-SPEED CODING WORKFLOW",
      desc: "Leveraged Bolt.io, Claude AI, and Antigravity to generate high-performance frontend components. Speed up production workflows by auto-generating structured page blocks and form states.",
      tech: "Bolt.io, Claude AI templates, Antigravity pair coding CLI"
    },
    {
      title: "3. Next.js Front",
      subtitle: "Real-time SEO",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
        </svg>
      ),
      label: "INTERACTIVE NEWS HUB FRONTEND",
      desc: "Developed news feed feeds and subscriber portals using Next.js App Router, Tailwind CSS, and Framer Motion. Engineered a custom post creation engine showing real-time on-page SEO reports.",
      tech: "Next.js App Router, Tailwind CSS, Framer Motion, real-time SEO scoring"
    },
    {
      title: "4. Supabase DB",
      subtitle: "Real-time Backend",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "SUPABASE BACKEND & VERCEL EDGE",
      desc: "Integrated Supabase for database storage of news articles, and structured email newsletter registration listeners. Deployed on Vercel's global CDN network.",
      tech: "Supabase Database, PostgreSQL triggers, Vercel edge deployment, email APIs"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', padding: '0' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '0.45rem', 
          position: 'relative',
          padding: '0.2rem 0.5rem',
          overflowX: 'auto',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}
        className="no-scrollbar arch-flow-container"
      >
        <div 
          className="arch-connection-line"
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '42px', 
            right: '42px', 
            height: '1px', 
            background: 'linear-gradient(to right, var(--accent-purple) 0%, rgba(255,255,255,0.03) 100%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} 
        />

        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="interactive-element arch-flow-node"
              style={{
                position: 'relative',
                zIndex: 5,
                flex: '1 1 auto',
                minWidth: '55px',
                maxWidth: '80px',
                backgroundColor: isActive ? 'var(--surface-card-hover)' : 'var(--surface-card)',
                border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '0.3rem 0.35rem',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 10px rgba(124, 92, 255, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div 
                style={{ 
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                  marginBottom: '0.1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  transition: 'color 0.3s'
                }}
              >
                {step.icon}
              </div>

              <div 
                className="arch-flow-node-title"
                style={{ 
                  fontSize: '0.58rem', 
                  fontWeight: 700, 
                  color: isActive ? 'var(--text-white)' : 'var(--text-gray-light)',
                  transition: 'color 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.title}
              </div>

              <div 
                className="arch-flow-node-subtitle"
                style={{ fontSize: '0.41rem', color: 'var(--text-gray-muted)', marginTop: '0.05rem', whiteSpace: 'nowrap' }}
              >
                {step.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="saas-card"
          style={{
            padding: '0.45rem 0.6rem',
            backgroundColor: 'var(--surface-card-darker)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            boxShadow: 'none'
          }}
        >
          <span className="label-saas" style={{ fontSize: '0.45rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '0.1rem' }}>
            {steps[activeStep].label}
          </span>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.15rem' }}>
            {steps[activeStep].title} Details
          </h4>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-gray-light)', lineHeight: 1.2, marginBottom: '0.25rem' }}>
            {steps[activeStep].desc}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.2rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="label-saas" style={{ fontSize: '0.4rem', color: 'var(--text-gray-dark)' }}>TECHNOLOGY:</span>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {steps[activeStep].tech}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Browser hash-routing state synchronizer
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project/')) {
        const projId = hash.replace('#project/', '');
        const found = caseStudiesData.find((p) => p.id === projId);
        if (found) {
          setSelectedProject(found);
          setActiveImage(found.image);
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        setSelectedProject(null);
        setActiveImage(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openProject = (id: string) => {
    window.location.hash = `#project/${id}`;
  };

  const closeProject = () => {
    window.location.hash = '#projects';
  };

  // Filter logic
  const filteredProjects = caseStudiesData.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'ALL') return matchesSearch;
    if (selectedCategory === 'FRONTEND') {
      return matchesSearch && project.tech.some(t => ['react', 'typescript', 'next.js', 'vite', 'canvas', 'css', 'tailwind css', 'framer motion'].includes(t.toLowerCase()));
    }
    if (selectedCategory === 'BACKEND') {
      return matchesSearch && project.tech.some(t => ['node.js', 'redis', 'postgresql', 'docker', 'aws', 'supabase', 'sanity cms'].includes(t.toLowerCase()));
    }
    if (selectedCategory === 'AI') {
      return matchesSearch && project.tech.some(t => ['python', 'langchain', 'qdrant db', 'openai', 'vector'].includes(t.toLowerCase()));
    }
    return matchesSearch;
  });

  return (
    <section
      id="projects"
      style={{
        backgroundColor: 'var(--bg-dark)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 5,
        minHeight: '80vh',
      }}
      className="section-spacing"
    >
      {/* Dynamic details page overlay */}
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <motion.div
            key="details-page"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="container-saas"
            style={{ position: 'relative', zIndex: 10 }}
          >
            {/* Header / Actions */}
            <div
              className="case-study-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={closeProject}
                  className="interactive-element btn-secondary-border"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                  <span>Back to Projects</span>
                </button>

                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-element"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 1.1rem',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      backgroundColor: 'rgba(124, 92, 255, 0.12)',
                      border: '1px solid var(--accent-purple)',
                      color: 'var(--text-white)',
                      borderRadius: '6px',
                      fontWeight: 600,
                      boxShadow: '0 0 10px rgba(124, 92, 255, 0.1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>Visit Live Site</span>
                    <svg width="11" height="11" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3H6.5C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM9.5 2C9.22386 2 9 2.22386 9 2.5C9 2.77614 9.22386 3 9.5 3H11.2929L5.64645 8.64645C5.45118 8.84171 5.45118 9.15829 5.64645 9.35355C5.84171 9.54882 6.15829 9.54882 6.35355 9.35355L12 3.70711V5.5C12 5.77614 12.2239 6 12.5 6C12.7761 6 13 5.77614 13 5.5V2.5C13 2.22386 12.7761 2 12.5 2H9.5Z" fill="currentColor"/>
                    </svg>
                  </a>
                )}
              </div>
              
              <span className="label-saas" style={{ fontSize: '0.7rem' }}>
                CASE STUDY // {selectedProject.number}
              </span>
            </div>

            {/* Banner Section */}
            <div className="case-study-banner">
              <span className="label-saas" style={{ color: 'var(--text-gray-muted)' }}>CASE STUDY PLATFORM</span>
              <h2
                className="title-hero"
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  marginTop: '0.5rem',
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: 'var(--text-white)',
                  letterSpacing: '-0.03em',
                }}
              >
                {selectedProject.title}
              </h2>
              <p style={{ color: 'var(--text-gray-light)', fontSize: '1.2rem', marginTop: '1rem', fontWeight: 500 }}>
                {selectedProject.subtitle}
              </p>
            </div>

            {/* Split layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '4rem',
                alignItems: 'start',
              }}
              className="case-study-grid"
            >
              {/* Left Column: Details */}
              <div style={{ gridColumn: 'span 7' }} className="case-details-col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  
                  {/* Performance Indicators */}
                  <div>
                    <h4 className="label-saas" style={{ color: 'var(--text-gray-muted)', fontSize: '0.65rem', marginBottom: '1rem' }}>
                      PERFORMANCE INDICATORS
                    </h4>
                    <div className="performance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                      {selectedProject.metrics.map((m, i) => (
                        <div key={i} className="saas-card" style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: 'var(--surface-card-darker)' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)' }}>
                            {m.value}
                          </span>
                          <span className="label-saas" style={{ display: 'block', fontSize: '0.65rem', marginTop: '0.5rem', color: 'var(--text-gray-light)' }}>
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div>
                    <h4 className="label-saas" style={{ color: 'var(--text-gray-muted)', fontSize: '0.65rem', marginBottom: '0.75rem' }}>
                      THE ENGINEERING CHALLENGE
                    </h4>
                    <p style={{ fontSize: '1rem', color: 'var(--text-gray-light)', lineHeight: 1.6, marginBottom: '2rem' }}>
                      {selectedProject.challenge}
                    </p>

                    <h4 className="label-saas" style={{ color: 'var(--text-gray-muted)', fontSize: '0.65rem', marginBottom: '0.75rem' }}>
                      THE ARCHITECTURAL SOLUTION
                    </h4>
                    <p style={{ fontSize: '1rem', color: 'var(--text-gray-light)', lineHeight: 1.6 }}>
                      {selectedProject.solution}
                    </p>
                  </div>

                  {selectedProject.id === 'buildstorey' && (
                    <div className="saas-card" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-card-darker)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <h4 className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', marginBottom: '1.25rem' }}>
                        SUPPLIER PORTAL & SELLER ONBOARDING FLOW
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: 0, margin: 0 }}>
                        <li style={{ fontSize: '0.9rem', color: 'var(--text-gray-light)', display: 'flex', gap: '0.5rem', alignItems: 'start', lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                          <span><strong>Brand-Aligned Seller Theme:</strong> Built the seller flow to reflect Buildstorey's official brick-red and orange cube theme. Displays supplier validation steps with clean white card modules on light gray layouts.</span>
                        </li>
                        <li style={{ fontSize: '0.9rem', color: 'var(--text-gray-light)', display: 'flex', gap: '0.5rem', alignItems: 'start', lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                          <span><strong>14 Material Categories:</strong> Structured Mongoose schemas and catalog listings to support Cement, Steel, Sand, Bricks, Tiles, Paint, Pipes, Electricals, Wood, Stone, Glass, Hardware, Sanitary, and Roofing.</span>
                        </li>
                        <li style={{ fontSize: '0.9rem', color: 'var(--text-gray-light)', display: 'flex', gap: '0.5rem', alignItems: 'start', lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                          <span><strong>Multi-Role Shopping & Authentication:</strong> Supports unified checkout flows for B2C retail consumers and B2B wholesale contract orders, coupled with business verification checklists for suppliers.</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {selectedProject.id === 'school-erp' && (
                    <div className="saas-card" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-card-darker)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <h4 className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', marginBottom: '1.25rem' }}>
                        MONOREPO ERP MODULES & MOBILE ARCHITECTURE
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: 0, margin: 0 }}>
                        <li style={{ fontSize: '0.9rem', color: 'var(--text-gray-light)', display: 'flex', gap: '0.5rem', alignItems: 'start', lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                          <span><strong>6 Core Modules from Scratch:</strong> Engineered dynamic standalone modules for Helpdesk support ticketing, Utility operations/billing, Book Wise Library Management (as shown in layout screen logs), student Discipline registers, Hostel administration, and Transport route trackers.</span>
                        </li>
                        <li style={{ fontSize: '0.9rem', color: 'var(--text-gray-light)', display: 'flex', gap: '0.5rem', alignItems: 'start', lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                          <span><strong>Hybrid Mobile WebView Integration:</strong> Packaged the ERP console into hybrid Student and Employee mobile applications using React Native WebView containers for fast cross-platform deployment.</span>
                        </li>
                        <li style={{ fontSize: '0.9rem', color: 'var(--text-gray-light)', display: 'flex', gap: '0.5rem', alignItems: 'start', lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                          <span><strong>Real-Time Chat & ApexCharts Reports:</strong> Integrated Socket.io and native WebSockets to run real-time user chat boxes, and set up dynamic analytics reporting dashboards with React ApexCharts.</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Mock Implementation Code Snippet */}
                  <div className="case-study-code-desktop">
                    <h4 className="label-saas" style={{ color: 'var(--text-gray-muted)', fontSize: '0.65rem', marginBottom: '1rem' }}>
                      CORE IMPLEMENTATION SNIPPET ({selectedProject.codeLanguage.toUpperCase()})
                    </h4>
                    <pre
                      className="code-container"
                      style={{
                        padding: '1.5rem',
                        overflowX: 'auto',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface-console)',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-gray-light)', display: 'block' }}>
                        {selectedProject.codeSnippet}
                      </code>
                    </pre>
                  </div>

                </div>
              </div>

              {/* Right Column: Visuals & Tech decisions */}
              <div style={{ gridColumn: 'span 5' }} className="case-visual-col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  
                  {/* Project image */}
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      backgroundColor: 'var(--surface-card)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src={activeImage || selectedProject.image}
                      alt={selectedProject.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '420px',
                        borderRadius: '8px',
                        display: 'block',
                        objectFit: 'contain',
                        backgroundColor: '#0c0c0e',
                      }}
                    />
                  </div>

                  {/* Thumbnail gallery */}
                  {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '-2rem' }}>
                      {selectedProject.gallery.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(img)}
                          className="interactive-element"
                          style={{
                            width: '70px',
                            height: '45px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: (activeImage || selectedProject.image) === img ? 'var(--accent-purple)' : 'var(--border-subtle)',
                            padding: 0,
                            cursor: 'pointer',
                            backgroundColor: '#050505',
                            opacity: (activeImage || selectedProject.image) === img ? 1 : 0.6,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <img src={img} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* System dataflow diagram */}
                  <div className="saas-card" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-card-darker)' }}>
                    <h4 className="label-saas" style={{ fontSize: '0.65rem', color: 'var(--text-gray-muted)', marginBottom: '1.25rem' }}>
                      SYSTEM DATAFLOW DIAGRAM
                    </h4>
                    {selectedProject.id === 'buildstorey' && (
                      <InteractiveArchitecture />
                    )}
                    {selectedProject.id === 'school-erp' && (
                      <ERPInteractiveArchitecture />
                    )}
                    {selectedProject.id === 'sudhaanva' && (
                      <SudhaanvaInteractiveArchitecture />
                    )}
                    {selectedProject.id === 'cjpmedia' && (
                      <CJPInteractiveArchitecture />
                    )}
                    {selectedProject.id !== 'buildstorey' && selectedProject.id !== 'school-erp' && selectedProject.id !== 'sudhaanva' && selectedProject.id !== 'cjpmedia' && (
                      <div style={{ overflowX: 'auto' }}>
                        {selectedProject.architecture}
                      </div>
                    )}
                  </div>

                  {/* Tech stack stack */}
                  <div>
                    <h4 className="label-saas" style={{ color: 'var(--text-gray-muted)', fontSize: '0.65rem', marginBottom: '1rem' }}>
                      ARCHITECTURAL TECH DECISIONS
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {selectedProject.tech.map((t) => (
                        <span
                          key={t}
                          className="label-saas"
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--surface-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            color: 'var(--text-white)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Code Snippet */}
                  <div className="case-study-code-mobile" style={{ marginTop: '1.5rem' }}>
                    <h4 className="label-saas" style={{ color: 'var(--text-gray-muted)', fontSize: '0.65rem', marginBottom: '1rem' }}>
                      CORE IMPLEMENTATION SNIPPET ({selectedProject.codeLanguage.toUpperCase()})
                    </h4>
                    <pre
                      className="code-container"
                      style={{
                        padding: '1.5rem',
                        overflowX: 'auto',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface-console)',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-gray-light)', display: 'block' }}>
                        {selectedProject.codeSnippet}
                      </code>
                    </pre>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list-page"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="container-saas"
          >
            {/* Section Header */}
            <div style={{ marginBottom: '2.2rem' }}>
              <span className="label-saas">01 // PRODUCTION WORK</span>
              <h2
                className="title-hero"
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  marginTop: '1rem',
                  color: 'var(--text-white)',
                }}
              >
                Engineering Case Studies
              </h2>
              <p style={{ color: 'var(--text-gray-muted)', marginTop: '1rem', maxWidth: '600px' }}>
                A deep dive into concrete architectural challenges, performance benchmarks, and core technical solutions.
              </p>
            </div>

            {/* Showcase Filters & View Mode Control Header */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Category Filters */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['ALL', 'FRONTEND', 'BACKEND', 'AI'].map((cat) => (
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
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search & Toggle Group */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '500px', justifyContent: 'flex-end' }} className="project-controls-right">
                  {/* Search Box */}
                  <div style={{ position: 'relative', flexGrow: 1, maxWidth: '280px' }}>
                    <input
                      type="text"
                      placeholder="Search projects or stacks..."
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

                  {/* Grid / List Toggles */}
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: 'var(--surface-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '2px',
                    }}
                  >
                    <button
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid View"
                      className="interactive-element"
                      style={{
                        backgroundColor: viewMode === 'grid' ? 'var(--surface-card-hover)' : 'transparent',
                        border: 'none',
                        color: viewMode === 'grid' ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="4" height="4" rx="1" fill="currentColor"/>
                        <rect x="9" y="2" width="4" height="4" rx="1" fill="currentColor"/>
                        <rect x="2" y="9" width="4" height="4" rx="1" fill="currentColor"/>
                        <rect x="9" y="9" width="4" height="4" rx="1" fill="currentColor"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      aria-label="List View"
                      className="interactive-element"
                      style={{
                        backgroundColor: viewMode === 'list' ? 'var(--surface-card-hover)' : 'transparent',
                        border: 'none',
                        color: viewMode === 'list' ? 'var(--accent-purple)' : 'var(--text-gray-muted)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 3.5H13.5M1.5 7.5H13.5M1.5 11.5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout rendering */}
            {viewMode === 'grid' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2.5rem',
                }}
                className="projects-showcase-grid"
              >
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => openProject(project.id)}
                    className="interactive-element saas-card project-grid-card"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      justifyContent: 'space-between',
                      padding: '1.5rem',
                      transition: 'transform 0.3s ease, border-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      {/* Visual Card Image Cover */}
                      <div
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          aspectRatio: '16/10',
                          marginBottom: '1.5rem',
                          border: '1px solid rgba(255, 255, 255, 0.03)',
                          backgroundColor: '#050505',
                        }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="project-cover-img"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(12, 12, 14, 0.85)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '0.25rem 0.65rem',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                            {project.metrics[1].value}
                          </span>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-muted)' }}>
                          CASE {project.number}
                        </span>
                        <span style={{ opacity: 0.15 }}>•</span>
                        <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--accent-purple)' }}>
                          {project.tech[0]} / {project.tech[1]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: '1.45rem',
                          fontWeight: 700,
                          color: 'var(--text-white)',
                          marginBottom: '0.5rem',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {project.title}
                      </h3>

                      {/* Subtitle */}
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-gray-muted)',
                          lineHeight: 1.4,
                          marginBottom: '1.5rem',
                        }}
                      >
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Actions / Rationale */}
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
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-gray-muted)',
                        }}
                      >
                        {project.metrics[0].value} {project.metrics[0].label.toLowerCase() === 'product categories' ? 'categories' : project.metrics[0].label.toLowerCase().includes('savings') ? 'savings' : project.metrics[0].label.toLowerCase().includes('modules') ? 'modules' : project.metrics[0].label.toLowerCase().includes('performance') ? 'SEO performance' : project.metrics[0].label.toLowerCase().includes('sync') ? 'sync' : 'latency'}
                      </span>
                      
                      <span
                        className="interactive-element"
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--accent-purple)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span>Explore</span>
                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.5 7.5L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Layout rendering */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="projects-showcase-list">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => openProject(project.id)}
                    className="interactive-element saas-card project-list-row"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2.5rem',
                      padding: '1.5rem 2rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.3)';
                      e.currentTarget.style.backgroundColor = 'var(--surface-card-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                    }}
                  >
                    {/* Monospace index */}
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', minWidth: '40px' }}>
                      {project.number}
                    </div>

                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '80px',
                        height: '50px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        flexShrink: 0,
                        backgroundColor: '#050505',
                      }}
                      className="hidden-mobile"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.25rem' }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-gray-muted)' }}>
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Performance metrics */}
                    <div style={{ minWidth: '150px' }} className="hidden-mobile">
                      <span className="label-saas" style={{ fontSize: '0.55rem', color: 'var(--text-gray-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        {project.metrics[0].label}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                        {project.metrics[0].value}
                      </span>
                    </div>

                    {/* Stacks */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '200px' }} className="hidden-tablet">
                      {project.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="label-saas"
                          style={{
                            fontSize: '0.6rem',
                            padding: '0.25rem 0.55rem',
                            backgroundColor: 'var(--surface-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            color: 'var(--text-gray-light)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Explore */}
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--accent-purple)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span>Explore</span>
                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.5 7.5L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-gray-muted)' }}>
                No projects found matching that filter.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .project-grid-card:hover .project-cover-img {
          transform: scale(1.05);
        }
        .case-study-header {
          margin-bottom: 3rem;
          padding-bottom: 1.5rem;
        }
        .case-study-banner {
          margin-bottom: 4rem;
        }
        @media (max-width: 960px) {
          .case-study-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .case-details-col,
          .case-visual-col {
            grid-column: auto !important;
            min-width: 0 !important;
            width: 100% !important;
            overflow: hidden !important;
          }
        }
        @media (max-width: 768px) {
          .hidden-tablet {
            display: none !important;
          }
          .project-controls-right {
            justify-content: flex-start !important;
          }
          .case-study-header {
            margin-bottom: 2rem !important;
            padding-bottom: 1rem !important;
          }
          .case-study-banner {
            margin-bottom: 2rem !important;
          }
        }
        @media (max-width: 600px) {
          .performance-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
        .arch-flow-container {
          transition: all 0.3s ease;
        }
        .arch-flow-node {
          transition: all 0.3s ease;
        }
        .arch-flow-node-title {
          transition: all 0.3s ease;
        }
        .arch-flow-node-subtitle {
          transition: all 0.3s ease;
        }
        @media (max-width: 480px) {
          .arch-connection-line {
            display: none !important;
          }
          .arch-flow-container {
            max-width: 100% !important;
            gap: 0.35rem !important;
            justify-content: flex-start !important;
            overflow-x: auto !important;
            padding-bottom: 0.4rem !important;
          }
          .arch-flow-node {
            flex: 0 0 78px !important;
            min-width: 78px !important;
            padding: 0.35rem 0.2rem !important;
          }
          .arch-flow-node-title {
            font-size: 0.52rem !important;
            white-space: normal !important;
            word-break: break-word !important;
            line-height: 1.15 !important;
          }
          .arch-flow-node-subtitle {
            font-size: 0.38rem !important;
            white-space: normal !important;
            word-break: break-word !important;
            line-height: 1.15 !important;
          }
          .project-list-row {
            padding: 1.25rem 1rem !important;
            gap: 1.25rem !important;
          }
          .case-study-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .code-container {
            padding: 1rem !important;
          }
        }
        .case-study-code-mobile {
          display: none !important;
        }
        @media (max-width: 960px) {
          .case-study-code-desktop {
            display: none !important;
          }
          .case-study-code-mobile {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
