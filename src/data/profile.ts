/**
 * ─────────────────────────────────────────────────────────────
 *  Single source of truth for everything personal on the site.
 *  Every fact below comes from Md Abu Farhad's CV (resume.pdf).
 *  Update this file, no component changes needed.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Md Abu Farhad',
  shortName: 'Farhad',
  initials: 'MAF',
  title: 'Backend + AI Engineer',
  subtitle: 'Backend + AI Engineer · System Design',
  location: 'Dhaka, Bangladesh',
  timezone: 'Asia/Dhaka',
  availability: 'Open to select international opportunities',
  yearsOfExperience: '5+',

  email: 'abufarhad15@gmail.com',
  // Leave as '' to hide. The phone number from the CV is intentionally not shown publicly.
  phone: '',

  links: {
    github: 'https://github.com/abufarhad',
    linkedin: 'https://www.linkedin.com/in/abufarhad',
    medium: 'https://medium.com/@abufarhad15',
    clist: 'https://clist.by/coder/abufarhad/',
  },

  /** File in /public. Replace the PDF to update the download. */
  resume: `${import.meta.env.BASE_URL}Md-Abu-Farhad-Resume.pdf`,

  /** Absolute URL of the deployed site, used for SEO / social metadata. */
  siteUrl: 'https://abufarhad.github.io/',
} as const

export const hero = {
  headline: ['Engineering systems', 'that scale'],
  summary: '5+ years building high-performance Go backends and distributed systems.',
  facts: [
    { k: 'focus', v: 'Backend + AI Engineer · System Design', highlight: true },
    { k: 'role', v: 'Backend + AI Engineer @ Rooya' },
    { k: 'stack', v: 'Go · Postgres · Kafka · K8s' },
    { k: 'impact', v: '95k+ daily users served' },
  ],
}

/** Verified figures from the CV, shown as animated counters. */
export const stats = [
  { value: 5, suffix: '+', label: 'Years in production' },
  { value: 95, suffix: 'k+', label: 'Daily users at CAFU' },
  { value: 10, suffix: 'M+', label: 'Records through ETL' },
  { value: 1700, suffix: '+', label: 'Problems solved' },
]

export type Role = {
  company: string
  url?: string
  role: string
  location: string
  period: string
  start: string
  summary: string
  highlights: { text: string; metric?: string }[]
  stack: string[]
}

export const experience: Role[] = [
  {
    company: 'Rooya',
    url: 'https://www.rooya.ai/',
    role: 'Software Engineer',
    location: 'London, UK',
    period: 'May 2025 - Present',
    start: '2025',
    summary: 'Backend + AI Engineer on an AI video-telematics platform.',
    highlights: [
      { text: 'Built and scaled microservices for AI-driven telematics with high-throughput, real-time data pipelines' },
      { metric: '~60%', text: 'Faster trip-end processing by moving driver identification into an async Kafka pipeline with AWS SageMaker' },
      { metric: '~60%', text: 'Higher query throughput from PostgreSQL read/write splitting, with lower read latency at peak' },
      { metric: '~40%', text: 'Lower response latency and ~35% more throughput by optimising core services with Go concurrency' },
      { metric: '~50%', text: 'Fewer downtime incidents across production services through reliability work' },
    ],
    stack: ['Go', 'PostgreSQL', 'Kafka', 'AWS SageMaker', 'Microservices'],
  },
  {
    company: 'Relisource',
    url: 'https://www.relisource.com/',
    role: 'Software Engineer',
    location: 'Boston, US',
    period: 'Aug 2024 - Jun 2025',
    start: '2024',
    summary: 'Real-Time Visibility Platform on large-scale logistics data.',
    highlights: [
      { metric: '~45%', text: 'Lower reporting latency on a Real-Time Visibility Platform (RTVP) built on large-scale logistics data' },
      { metric: '10M+', text: 'Records ingested, cleaned and transformed by Databricks ETL pipelines, ~50% faster processing' },
      { metric: '~30%', text: 'Less manual data handling by building and deploying Azure Functions to automate workflows' },
    ],
    stack: ['Databricks', 'Spark', 'Azure Functions', 'Python'],
  },
  {
    company: 'Monstarlab',
    url: 'https://monstar-lab.com/bd/',
    role: 'Software Engineer II',
    location: 'Dhaka, Bangladesh',
    period: 'Mar 2022 - Jul 2024',
    start: '2022',
    summary: 'Event-driven Go services for CAFU, a fuel delivery and vehicle services platform.',
    highlights: [
      { metric: '95k+', text: 'Daily active users supported by high-performance microservices for CAFU' },
      { metric: '30%', text: 'More daily new users after launching the Go backend for CAFU’s “Phantom” home screen, serving personalised content' },
      { metric: '90%', text: 'Lower error rate than the legacy car-services system' },
      { text: 'Architected Go backend services in an event-driven architecture for the CAFU consumer app' },
      { text: 'Integrated gRPC and Protocol Buffers for lightweight communication across microservices' },
      { text: 'Built and maintained a real-time chat service' },
    ],
    stack: ['Go', 'gRPC', 'Event-driven', 'PostgreSQL', 'AWS'],
  },
  {
    company: 'Vivasoft Limited',
    url: 'https://www.vivasoftltd.com/',
    role: 'Software Engineer',
    location: 'Dhaka, Bangladesh',
    period: 'Apr 2021 - Feb 2022',
    start: '2021',
    summary: 'Clean-architecture microservices, built from scratch.',
    highlights: [
      { metric: '15+', text: 'Microservices architected from scratch on clean architecture, cutting onboarding time by ~40%' },
      { metric: '~60%', text: 'Faster deployments by containerising backends and databases with Docker' },
      { metric: '~85%', text: 'Test coverage from an automated unit and integration pipeline (Docker + shell)' },
      { text: 'Built complex REST API features in a structured, testable way' },
    ],
    stack: ['Go', 'Docker', 'REST APIs', 'Clean Architecture'],
  },
  {
    company: 'MyMedicalHUB',
    url: 'https://www.linkedin.com/company/mymedicalhub/',
    role: 'Machine Learning Engineer',
    location: 'Dhaka, Bangladesh',
    period: 'May 2020 - Jul 2020',
    start: '2020',
    summary: 'Vertebrae detection from CT scans with a two-stage CNN.',
    highlights: [
      { metric: '89%', text: 'Accuracy on automated vertebrae detection and localisation from CT scans with a two-stage CNN' },
      { metric: '3×', text: 'Faster model iteration from end-to-end data pipelines, ~65% less preprocessing time' },
    ],
    stack: ['Python', 'Keras', 'CNNs'],
  },
]

export type Project = {
  id: 'rooya' | 'rtvp' | 'carservice' | 'gomail' | 'gostarter' | 'wellteam'
  title: string
  kind: string
  period: string
  location: string
  description: string
  highlights: string[]
  stack: string[]
  repo?: string
  site?: string
}

export const projects: Project[] = [
  {
    id: 'rooya',
    title: 'Rooya AI Telemetry Platform',
    kind: 'Current · Backend + AI Engineer',
    period: 'May 2025 - Present',
    location: 'London',
    description: 'AI video telematics: our Go services turn dash-cam events into live tracking, video evidence and fleet insight.',
    highlights: ['~60% faster trip-end processing (SageMaker)', '~60% higher DB throughput', '~40% lower latency'],
    stack: ['Go', 'Kafka', 'AWS SageMaker', 'PostgreSQL'],
    site: 'https://www.rooya.ai/platform/',
  },
  {
    id: 'rtvp',
    title: 'Real-Time Visibility Platform',
    kind: 'Client · Data engineering',
    period: 'Aug 2024 - May 2025',
    location: 'US',
    description: 'Real-time insight from large-scale logistics data.',
    highlights: ['10M+ records via Databricks ETL', '~50% faster processing', '~45% lower reporting latency'],
    stack: ['Databricks', 'Spark', 'Azure Functions'],
  },
  {
    id: 'carservice',
    title: 'CAFU Car Service',
    kind: 'Client · Microservices',
    period: 'Oct 2022 - Jan 2024',
    location: 'Dubai',
    description: 'On-demand car wash, oil, battery and tyre services, rebuilt in Go.',
    highlights: ['Event-driven Go microservices', '90% lower error rate', 'AWS SNS + S3'],
    stack: ['Go', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'gomail',
    title: 'GoMail',
    kind: 'Open source',
    period: 'Apr 2025 - Mar 2026',
    location: '',
    description: 'A terminal email client in Go.',
    highlights: ['TUI', 'IMAP & SMTP', 'Modular architecture'],
    stack: ['Go', 'TUI', 'IMAP'],
    repo: 'https://github.com/abufarhad/go-email-client',
  },
  {
    id: 'gostarter',
    title: 'Go Clean Architecture Boilerplate',
    kind: 'Open source',
    period: 'Aug 2022 - May 2024',
    location: '',
    description: 'Production-ready starter for Go services.',
    highlights: ['Clean Architecture', 'Dependency injection', 'Structured logging'],
    stack: ['Go', 'Clean Architecture', 'SQL'],
    repo: 'https://github.com/abufarhad/go-starter',
  },
  {
    id: 'wellteam',
    title: 'WellTeam',
    kind: 'Client · Health-tech',
    period: 'Oct 2022 - Feb 2023',
    location: 'Adelaide',
    description: 'Nutrition and fitness coaching platform.',
    highlights: ['Go microservices', 'MySQL'],
    stack: ['Go', 'MySQL'],
    site: 'https://www.wellteam.me/',
  },
]

/** Capability-first grouping (all technologies from the CV). */
export const skillGroups = [
  {
    id: 'backend',
    short: 'Backend',
    label: 'Go, Backend & System Design',
    blurb: 'Design end to end, ship in Go.',
    items: ['Go', 'System design', 'Microservices', 'REST', 'gRPC', 'GraphQL', 'Gin', 'Echo', 'Clean Architecture'],
  },
  {
    id: 'distributed',
    short: 'Streaming',
    label: 'Distributed & Real-time',
    blurb: 'Event-driven, async, high throughput.',
    items: ['Kafka', 'RabbitMQ', 'Event-driven', 'Go concurrency', 'SNS / SQS', 'Service Bus'],
  },
  {
    id: 'data',
    short: 'Data',
    label: 'Databases & Performance',
    blurb: 'Fast reads, safe writes.',
    items: ['PostgreSQL', 'Redis', 'MySQL', 'MongoDB', 'CosmosDB', 'Query tuning'],
  },
  {
    id: 'infra',
    short: 'Cloud',
    label: 'Cloud & Infrastructure',
    blurb: 'Containerised and automated.',
    items: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Azure'],
  },
  {
    id: 'ai',
    short: 'AI',
    label: 'AI Engineering',
    blurb: 'AI in production: inference, LLM integrations and the data behind them.',
    items: ['AI engineering', 'AWS SageMaker', 'LLM integration', 'Databricks', 'Spark', 'Machine learning', 'Deep learning'],
  },
] as const

export const languages = ['Go', 'Python', 'C#', 'C++', 'Java', 'JavaScript', 'SQL']

/** Shown in the hero so visitors see the core expertise at a glance. */
export const heroExpertise = ['Backend + AI Engineer', 'System Design', 'Go', 'Distributed Systems', 'Microservices', 'Event-Driven', 'PostgreSQL', 'Kafka', 'AWS · Azure']

export const principles = [
  { icon: 'feather', title: 'Simplicity first', body: 'Boring tech, clear code. Easy to debug at 3 a.m.', ai: false },
  { icon: 'gauge', title: 'Optimize', body: 'Measure first. No benchmark, no claim.', ai: false },
  { icon: 'shield', title: 'Resilient', body: 'Retries, idempotency, graceful degradation.', ai: false },
  { icon: 'eye', title: 'Observable', body: 'Metrics, logs and traces from day one.', ai: false },
  { icon: 'brain', title: 'Production AI', body: 'Models get SLOs, tests and monitoring too.', ai: true },
  { icon: 'layers', title: 'Scalable', body: 'Clean boundaries now, no rewrite later.', ai: false },
] as const

/** Featured "Now" block. Product facts from rooya.ai; impact figures from the CV. */
export const now = {
  company: 'Rooya',
  url: 'https://www.rooya.ai/',
  platformUrl: 'https://www.rooya.ai/platform/',
  role: 'Backend + AI Engineer',
  location: 'London, UK',
  since: 'May 2025',
  productName: 'Rooya AI Telemetry Platform',
  description:
    'AI video telematics for safer, smarter fleets. On-device AI flags risky driving in real time, and our platform turns every event into live tracking, cloud video evidence, driver coaching and fleet-wide risk insight for logistics, construction, transport and public-sector fleets.',
  aiWork: [
    { title: 'On-device AI → backend', body: 'Real-time event ingestion' },
    { title: 'SageMaker pipeline', body: 'Async driver ID, ~60% faster' },
    { title: 'AI-ready data', body: 'Fast pipelines and PostgreSQL' },
  ],
  events: ['speeding', 'harsh braking', 'distraction', 'phone use', 'no seat belt', 'fatigue'],
  impact: [
    { metric: '~60%', label: 'DB throughput' },
    { metric: '~40%', label: 'lower latency' },
    { metric: '~50%', label: 'fewer incidents' },
    { metric: '~60%', label: 'faster trip-end (AI)' },
  ],
}

export const publications = [
  {
    title: 'Attention-Enhanced U-Net with Boundary-Aware Hybrid Loss for Low-Grade Glioma Segmentation',
    venue: 'IEEE BECITHCON 2026',
    status: 'Accepted · Paper ID 307',
    year: '2026',
    summary: 'An attention-enhanced U-Net with a boundary-aware hybrid loss for precise low-grade glioma segmentation on MRI.',
    tags: ['Deep learning', 'U-Net', 'Medical imaging'],
    // Add the DOI / IEEE Xplore link here once it's published.
    url: '',
  },
]

export const research = {
  role: 'Research Assistant',
  org: 'Rajshahi University of Engineering & Technology (RUET)',
  period: 'Dec 2019 - Feb 2021',
  title: 'Low-Grade Glioma Segmentation on MRI with an Attention-Enhanced U-Net',
  metrics: [
    { value: '0.87', label: 'Positive predictive value' },
    { value: '0.89', label: 'Sensitivity' },
  ],
}

export const achievements = [
  { date: 'Apr 2022', title: '1st Runner-up', event: 'Monstarlab Global Hackathon', place: 'Dhaka' },
  { date: 'Dec 2019', title: '9th Position', event: 'Inter-University Programming Contest', place: 'VU, Bangladesh' },
  { date: 'Aug 2019', title: '3rd Runner-up', event: 'Intra-University Programming Contest', place: 'RUET' },
  { date: 'Ongoing', title: '1,700+ problems', event: 'Solved across online judges', place: 'clist.by', href: profile.links.clist },
]

export const education = {
  degree: 'B.Sc. in Computer Science & Engineering',
  school: 'Rajshahi University of Engineering & Technology',
  short: 'RUET',
  period: '2016 - 2020',
  url: 'https://www.ruet.ac.bd/',
}

/** Articles from medium.com/@abufarhad15 (newest first). */
export const blogs = [
  {
    title: 'Optimistic vs Pessimistic Locking in Go',
    url: 'https://medium.com/@abufarhad15/optimistic-vs-pessimistic-locking-in-go-a7b56801ca3c',
    date: 'Oct 2026',
    summary: 'Row locks vs version checks, implemented in Go with PostgreSQL.',
    tags: ['Go', 'PostgreSQL', 'Concurrency'],
  },
  {
    title: 'Designing Scalable Event-Driven Systems in Go (Kafka, NATS, RabbitMQ)',
    url: 'https://medium.com/@abufarhad15/designing-scalable-event-driven-systems-in-go-kafka-nats-rabbitmq-bd902e39d692',
    date: 'Mar 2025',
    summary: 'Comparing Kafka, NATS and RabbitMQ, with Go producer/consumer patterns.',
    tags: ['System design', 'Kafka', 'NATS'],
  },
  {
    title: 'Optimizing Go Microservices for Low Latency & High Throughput',
    url: 'https://medium.com/@abufarhad15/optimizing-go-microservices-for-low-latency-high-throughput-744cd58ba320',
    date: 'Mar 2025',
    summary: 'Concurrency, DB tuning, GC and caching for faster Go services.',
    tags: ['Go', 'Performance', 'Microservices'],
  },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'now', label: 'Now' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'research', label: 'Research' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]
