export const profile = {
  name: "Rizwan Shaikh",
  role: "Senior Full Stack Engineer",
  tagline: "10+ years building web products · 5+ years on the MERN stack",
  location: "Ahmedabad, India",
  email: "shaikh.dev.js@gmail.com",
  phone: "+91 820 0271835",
  linkedin: "https://www.linkedin.com/in/rizwan-shaikh-204603ba/",
  github: "https://github.com/rizwan-js-dev",
  photo: "/rizwan-shaikh.jpg",
  resume: "/Rizwan_Shaikh_Resume.pdf",
  summary:
    "Senior Full Stack Engineer and Technical Lead specializing in multi-tenant SaaS platforms and high-concurrency system design. I combine deep technical execution with team leadership and client-facing ownership — taking products from PRD and system design through to production on React, Node.js, TypeScript and AWS.",
};

export const stats = [
  { value: "10+", label: "Years of experience" },
  { value: "40%", label: "Faster API response times" },
  { value: "10x", label: "Platform scalability" },
  { value: "1L+", label: "Concurrent requests supported" },
];

export const skills = [
  {
    group: "Languages & Frontend",
    items: ["JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Redux Toolkit", "Tailwind CSS"],
  },
  {
    group: "Backend & Databases",
    items: ["Node.js", "Express.js", "RESTful APIs", "GraphQL", "MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    group: "Architecture & Real-time",
    items: ["System Design", "Microservices", "Multi-Tenant SaaS", "JWT", "WebSockets", "Redis", "BullMQ"],
  },
  {
    group: "DevOps, Testing & AI",
    items: [
      "Docker",
      "CI/CD (GitHub Actions)",
      "Git",
      "AWS (EC2, S3, SQS)",
      "Jest",
      "Playwright",
      "LLM API integration",
      "Copilot / Cursor / Claude Code",
    ],
  },
];

export type Job = {
  company: string;
  location: string;
  period: string;
  title: string;
  blurb: string;
  highlights: string[];
};

export const experience: Job[] = [
  {
    company: "Recruitment Smart Technologies Pvt. Ltd.",
    location: "Ahmedabad",
    period: "Sep 2025 — Present",
    title: "Senior Full Stack Developer – MERN Stack",
    blurb:
      "Architecture owner for a multi-tenant B2B2B recruitment SaaS platform, from system design through production deployment.",
    highlights: [
      "Translate client requirements and PRDs into system design decisions, validating direction in client demos alongside PM, QA and sales.",
      "Built and shipped a multi-tenant B2B2B SaaS module letting agencies onboard and monetize sub-clients with configurable access — adopted by 2–3 enterprise clients.",
      "Cut deployment friction by introducing CI/CD automation (GitHub Actions) and containerized delivery (Docker) to AWS, replacing manual releases.",
      "Own platform reliability during peak hiring cycles under concurrent enterprise workloads.",
    ],
  },
  {
    company: "Tecmantras Solutions",
    location: "Ahmedabad, India",
    period: "Sep 2023 — Aug 2025",
    title: "Full Stack Developer – MERN Stack",
    blurb:
      "Delivered a portfolio of independent client builds spanning e-commerce, event management and no-code platforms.",
    highlights: [
      "Owned each client project end-to-end, from technical design through release.",
      "Built an automated LinkedIn lead-generation tool with email extraction and bulk campaigns, replacing a fully manual outreach process.",
      "Automated WhatsApp booking confirmations, scaling daily event bookings from 10 to 100+ without extra manual coordination.",
      "Built a drag-and-drop page builder with content replication, cutting page-creation effort by 80%.",
    ],
  },
  {
    company: "OtrixWeb Solution",
    location: "Ahmedabad, India",
    period: "Jan 2017 — Aug 2023",
    title: "Senior Full Stack Web Developer",
    blurb:
      "Sole technical owner for a multi-industry client base, combining hands-on development with team and client ownership.",
    highlights: [
      "Primary engineering point of contact from requirements scoping through deployment, without a dedicated PM, while building and leading a small team.",
      "Delivered responsive, SEO-optimized websites with custom business features, improving performance and organic visibility.",
    ],
  },
  {
    company: "Inception System",
    location: "Ahmedabad, India",
    period: "Mar 2013 — Dec 2016",
    title: "Full Stack Web Developer",
    blurb: "Built and maintained client websites and portals across industries.",
    highlights: [
      "Built e-commerce sites, blogs and corporate portals with functionality tailored to each client's business.",
      "Implemented front-end performance optimizations (image compression, minification, caching) and ongoing production maintenance.",
    ],
  },
];

export type Project = {
  title: string;
  summary: string;
  metric?: string;
  period?: string;
  stack: string[];
  highlights: string[];
};

export type FeaturedProject = Project & {
  subtitle: string;
  demo: "builder" | "interview" | "leadgen";
};

export const featuredProjects: FeaturedProject[] = [
  {
    demo: "builder",
    title: "Currinda",
    subtitle: "Event management platform with a no-code website builder",
    summary:
      "A no-code website builder that lets event organizers compose their event site by dragging widgets onto pages — no developer required.",
    metric: "Led a team of 6 front-end developers",
    stack: ["Next.js", "React.js", "TypeScript", "Bootstrap", "Jodit Editor", "AWS S3"],
    highlights: [
      "Led a team of 6 front-end developers.",
      "Built a drag-and-drop website builder using pure JavaScript.",
      "Enabled widget sorting, reordering and cross-page movement.",
      "Integrated Jodit Editor with custom S3 image uploads.",
    ],
  },
  {
    demo: "interview",
    title: "One-Way Video Interview Platform",
    subtitle: "High-concurrency video interview infrastructure",
    summary:
      "Candidates record answers on their own time; recordings stream straight to S3, are processed by FFmpeg workers, and come back as an automatic assessment for recruiters.",
    metric: "10–20 → 100+ parallel interviews · ~70% lower upload latency",
    stack: ["React.js", "Node.js", "FFmpeg", "BullMQ", "Redis", "AWS S3", "Playwright"],
    highlights: [
      "Developed a one-way video interview system allowing candidates to submit recorded interviews.",
      "Implemented automatic assessment generation upon interview completion.",
      "Scaled the platform from 10–20 to 100+ parallel interviews, validated with Playwright load and stress tests.",
      "Direct-to-S3 chunked uploads via pre-signed URLs, cutting upload latency by ~70%.",
      "FFmpeg processing and metadata extraction queued with BullMQ and Redis.",
      "Routed uploads and streams to the nearest regional origin server.",
    ],
  },
  {
    demo: "leadgen",
    title: "Sale Link Up",
    subtitle: "Lead generation platform",
    period: "Jun 2025 – Aug 2025",
    summary:
      "Turns a LinkedIn search into a ready-to-use lead list — scraping profiles, extracting contact emails, exporting to Excel and running bulk email campaigns with analytics.",
    metric: "Replaced a fully manual outreach process",
    stack: ["React.js", "TypeScript", "Python FastAPI", "Yup", "Jest", "Excel Processing", "Web Scraping", "Bulk Email Automation"],
    highlights: [
      "Built the React.js (TypeScript) frontend with form validation (Yup) and unit testing (Jest).",
      "Developed a FastAPI backend for LinkedIn scraping and contact extraction.",
      "Enabled Excel export, bulk email campaigns and analytics logging.",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Multi-Tenant Client Hierarchy with AI-Powered Candidate Sourcing",
    summary:
      "Product → Client → Sub-Client hierarchy with role-based access, white-labeling and RAG-based candidate matching for a recruitment SaaS.",
    metric: "40% faster core APIs · 1,00,000+ concurrent requests",
    stack: ["React.js", "Node.js", "Express.js", "MySQL", "Redis", "WebSockets", "BullMQ"],
    highlights: [
      "Configurable RBAC so clients can expose product modules to sub-clients by access tier.",
      "Per-client email templates and theming for white-labeled hiring workflows.",
      "RAG-based semantic search that scores and ranks candidate profiles against job requirements.",
      "Unipile API integration to source LinkedIn candidates directly into a job's pipeline.",
      "Cross-service real-time notifications with Redis pub/sub and WebSockets.",
    ],
  },
  {
    title: "PuraVida — Party & Event Booking Platform",
    period: "Nov 2024 – Mar 2025",
    summary:
      "An online platform for party organizers to manage event bookings and guest lists, with subscription tiers and live updates.",
    stack: ["React.js", "TypeScript", "Tailwind CSS", "TanStack", "Firebase", "Pusher", "Jest"],
    highlights: [
      "Admin panel with sorting, searching and pagination.",
      "Subscription-based access control.",
      "Real-time notifications using Pusher and Firebase.",
      "Drag-and-drop image sorting.",
    ],
  },
  {
    title: "B2C E-Commerce Platform with Multi-Gateway Payments",
    summary:
      "SEO-first storefront with a one-page checkout across Mollie, PayPal and Razorpay, plus real-time updates.",
    stack: ["Next.js", "React.js", "Laravel", "Redux Toolkit", "Firebase", "Pusher"],
    highlights: [
      "One-page checkout integrating multiple payment gateways.",
      "Complex product filtering and infinite scroll for large catalogs.",
      "Drag-and-drop product image reordering for merchandising.",
      "Next.js SSR and lazy loading for page speed and search visibility.",
    ],
  },
  {
    title: "Automated Job Scraper & Real-Time Notification System",
    summary:
      "Full-stack job-scraping platform with instant match alerts delivered over web, email and WhatsApp.",
    stack: ["React.js", "Node.js", "MongoDB", "Puppeteer", "RabbitMQ", "Firebase", "WebSockets"],
    highlights: [
      "Browser automation and data extraction with Puppeteer.",
      "JWT authentication with role-based access control.",
      "Real-time alerts via Firebase and WebSockets.",
      "RabbitMQ/AMQP microservices for asynchronous email and WhatsApp delivery.",
    ],
  },
];

export const education = {
  degree: "Master of Science in Computer Application & Information Technology",
  school: "K.S. School of Business Management, India",
  year: "2013",
};
