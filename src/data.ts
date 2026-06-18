import { ServiceItem, ProjectItem, TestimonialItem } from './types.ts';

export const servicesData: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Website Development',
    shortDescription: 'Bespoke, blazingly fast, SEO-optimized web foundations that capture and command attention.',
    description: 'We craft high-performance websites optimized for Google Search standards. Our systems combine custom-designed storytelling layouts with production-hardened tech pipelines.',
    iconName: 'Globe',
    gradient: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20',
    details: ['SEO Optimization', 'Responsive Layouts (Mobile & Desktop)', 'Tailwind CSS Stylings', 'Fast Cloud Deployment', 'Fluid Landing Experiences']
  },
  {
    id: 'fullstack-apps',
    title: 'Full Stack Web Applications',
    shortDescription: 'Enterprise-grade backend architectures coupled with highly responsive client frontends.',
    description: 'Custom portal architectures, complex administrative layers, API integrations, secure authentication mechanisms, and robust database backends.',
    iconName: 'Cpu',
    gradient: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
    details: ['Real-time Synchronization', 'Cloud SQL / Postgres Pipelines', 'Role-Based Authentication', 'RESTful API architectures', 'Scalable State Managers']
  },
  {
    id: 'ai-bots',
    title: 'AI Chatbots & Integrations',
    shortDescription: 'Custom Generative AI assistants that streamline operations and engage customers.',
    description: 'Harness the elite capabilities of modern Large Language Models (LLMs) like Google Gemini. We build customized workflows, knowledge grounded bots, and specialized agents.',
    iconName: 'Bot',
    gradient: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20',
    details: ['Context-Aware Prompt Engineering', 'Google GenAI SDK Native Integrations', 'Floating Conversation Hubs', 'Lead Form Automation', 'Intelligent Intent Router']
  },
  {
    id: 'saas-products',
    title: 'SaaS Products',
    shortDescription: 'Minimum Viable Products to high-scale multi-tenant enterprise software systems.',
    description: 'Create cloud-native platforms to scale subscription models. We engineer multi-tenant segmentation, transactional email, billing gateways, and data metrics visualizers.',
    iconName: 'Blocks',
    gradient: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20',
    details: ['Multi-tenant Account Security', 'Flexible Subscription Workflows', 'Transaction Logs Systems', 'Highly Modular Component Library', 'Rapid MVP Delivery']
  },
  {
    id: 'bus-automation',
    title: 'Business Automation',
    shortDescription: 'Eliminate repetitive workflows and human error with specialized micro-agents.',
    description: 'Streamline business operations with custom-designed workflow automations, cron scheduling, cloud function triggers, webhooks, and third-party CRM connections.',
    iconName: 'GitMerge',
    gradient: 'from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20',
    details: ['Webhook Pipelines', 'CRM & ERP Synchronization', 'Automated Email Alert Triggers', 'Background Job Processing', 'Sales funnels tracking']
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    shortDescription: 'Stunning virtual storefronts engineered to maximize standard retail conversion rates.',
    description: 'Modern storefront architectures integrated with Stripe billing pipelines, customizable backend product lists, robust search capabilities, and beautiful layouts.',
    iconName: 'ShoppingBag',
    gradient: 'from-rose-500/10 to-orange-500/10 hover:from-rose-500/20 hover:to-orange-500/20',
    details: ['Stripe payment gateways', 'Dynamic Cart State Managers', 'Inventory Statistics Metrics', 'Optimized Checkout experiences', 'Order confirmation automation']
  },
  {
    id: 'portfolio-sites',
    title: 'Portfolio & Brand Websites',
    shortDescription: 'Ultra-premium, bespoke digital business cards with beautiful storytelling elements.',
    description: 'Showcase your brand with smooth cinematic scroll triggers, high-end display typography, elegant page loaders, and luxury styling parameters that stand out.',
    iconName: 'Sparkles',
    gradient: 'from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20',
    details: ['Elegant Micro-Animations', 'Cinematic layouts', 'Interactive Showcases', 'High-Contrast Typography Pairing', 'Optimized fast loading speeds']
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    shortDescription: 'Tailored corporate systems designed around your unique operational model.',
    description: 'When standard off-the-shelf software doesn\'t fit, we compile highly specific, dedicated software foundations with Node.js, PostgreSQL, and enterprise technologies.',
    iconName: 'CodeXml',
    gradient: 'from-indigo-500/10 to-cyan-500/10 hover:from-indigo-500/20 hover:to-cyan-500/20',
    details: ['Relational Database Normalization', 'Comprehensive API Contracts', 'Durable Cloud Storage Solutions', 'Performance optimization', 'Maintainable Code Base']
  }
];

export const portfolioProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'OmniAI - Enterprise Automation Hub',
    category: 'AI Solutions & SaaS',
    description: 'An AI-powered central automation hub that connects customer inboxes, lead forms, and chat services directly to an adaptive backend LLM router.',
    extendedDescription: 'OmniAI processes over 50,000 corporate records daily. It monitors raw inbound requests, evaluates support intents, triggers Postgres transaction entries, and generates real-time draft summaries using server-side Gemini 3.5 models.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    liveUrl: '#',
    codeUrl: '#',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Google GenAI SDK']
  },
  {
    id: 'proj-2',
    title: 'Novus ERP - Cloud Management Suite',
    category: 'Full Stack Web Applications',
    description: 'A multi-tenant corporate management and financial logistics dashboard with secure auth systems.',
    extendedDescription: 'A fully relational, robust system that connects inventory units, customer logs, billing workflows, and live metrics visualizers for global logistics chains.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    liveUrl: '#',
    codeUrl: '#',
    techStack: ['React/Vite', 'Express', 'Drizzle ORM', 'Cloud SQL (PostgreSQL)', 'Tailwind CSS']
  },
  {
    id: 'proj-3',
    title: 'Aura Luxury Shop - Custom Storefront',
    category: 'E-Commerce Solutions',
    description: 'Bespoke aesthetic shopping experience featuring fluid checkout transitions and fully localized payment gates.',
    extendedDescription: 'Aura brings high-contrast Swiss typography and rich interactive product canvas layouts together with lightning-fast load speeds (99+ Lighthouse score). Works flawlessly across ultra-wide desktops and mobile screens.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    liveUrl: '#',
    codeUrl: '#',
    techStack: ['Next.js', 'React', 'Tailwind v4', 'Framer Motion', 'Stripe API']
  },
  {
    id: 'proj-4',
    title: 'Elite Estate - Immersive Real Estate Listing',
    category: 'Website Development',
    description: 'Stunning property lookup platform styled with premium glassmorphism card groups and parallax scrolls.',
    extendedDescription: 'Engineered with smooth, nested framer motion layouts and structured rich-data schemas to maximize conversion rates and capture user queries on-site.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    liveUrl: '#',
    codeUrl: '#',
    techStack: ['React', 'Framer Motion', 'Tailwind v4', 'Lucide Icons']
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    role: 'Chief Operations Officer',
    company: 'Logix International',
    comment: 'Working with Provider Place has completely transformed our booking and billing systems. They converted our legacy databases into a fast, modern Node+Postgres system. The AI integration they developed saves our agents four hours a day!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'test-2',
    name: 'Ahmad Rafay',
    role: 'Founder & CEO',
    company: 'Ventura Tech',
    comment: 'The team delivered our complex SaaS MVP in record time—just under 4 weeks. The premium quality of their code and UI/UX design instantly earned us customer trust and helped secure our seed round. Truly a multi-million dollar looking platform!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    role: 'Director of Marketing',
    company: 'Metropolis Brand Lab',
    comment: 'Provider Place built our high-end brand website. The smooth scroll transitions, typography pairing, and floating AI assistant are incredibly polished. Our customer engagement has risen by 45% since launch.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  }
];
