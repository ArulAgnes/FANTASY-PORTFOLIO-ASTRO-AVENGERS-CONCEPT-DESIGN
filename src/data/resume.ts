/* =========================================================
   THE AGNESVERSE — single source of truth.
   Every fact below is drawn from the supplied resume.
   Nothing here is fabricated: no fake stats, no fake roles.
   ========================================================= */

export const SITE = {
  name: 'ARUL MARIA AGNES I',
  short: 'ARUL',
  role: 'PHP WEB DEVELOPER',
  tagline: 'Building dynamic web experiences with code, creativity and technology.',
  universe: 'THE AGNESVERSE',
  email: 'agnes915033@gmail.com',
  phone: '+91 9342450760',
  phoneHref: 'tel:+919342450760',
  location: 'Rajapalayam, Viruthunagar, Tamil Nadu',
  github: 'https://github.com/ArulAgnes',
  githubUser: 'ArulAgnes',
  portfolioUrl: 'https://arul-portfolio-taupe.vercel.app',
  resumePath: '/resume.pdf', // configurable — place the real PDF in /public
} as const;

/* ---------------------------------------------------------
   SKILLS — the Power Cores
   --------------------------------------------------------- */
export type SkillElement =
  | 'fire' | 'forge' | 'crystal' | 'ocean' | 'electric'
  | 'arch' | 'shape' | 'construct' | 'machine' | 'intellect'
  | 'timeline' | 'container' | 'dimension' | 'temporal' | 'flow';

export type SkillCategory = 'BACKEND' | 'DATABASE' | 'FRONTEND' | 'LANGUAGE' | 'TOOLS' | '3D & MOTION';

export interface Skill {
  id: string;
  name: string;
  core: string;
  category: SkillCategory;
  element: SkillElement;
  hue: string;       // accent color
  tagline: string;
  lore: string;
  sequence: string[]; // activation chain
  projects: string[]; // related project ids (resume-supported only)
}

export const SKILLS: Skill[] = [
  { id: 'php', name: 'PHP', core: 'FIRE CORE', category: 'BACKEND', element: 'fire', hue: '#ff7a1a', tagline: 'Backend Development',
    lore: 'Controlled digital fire. Raw code enters the reactor as syntax and leaves as living application logic — the engine room of every dynamic page Arul builds.',
    sequence: ['CODE', 'ENERGY', 'APPLICATION', 'OUTPUT'],
    projects: ['bookbazzar', 'astrology', 'pharmacy'] },
  { id: 'laravel', name: 'LARAVEL', core: 'FORGE CORE', category: 'BACKEND', element: 'forge', hue: '#ff5648', tagline: 'MVC Architecture',
    lore: 'A massive forge where Model, View and Controller are struck into a single weapon. Energy travels between the three structures until the application ignites.',
    sequence: ['MODEL', 'CONTROLLER', 'VIEW', 'APPLICATION'],
    projects: ['bookbazzar'] },
  { id: 'mysql', name: 'MYSQL', core: 'CRYSTAL DATA CORE', category: 'DATABASE', element: 'crystal', hue: '#41d9ff', tagline: 'Database Management',
    lore: 'A floating crystalline artifact. Inside: tables, relationships and queries frozen in lattice. Enter the crystal and you travel the entire database universe.',
    sequence: ['TABLES', 'RELATIONSHIPS', 'QUERIES', 'TRUTH'],
    projects: ['bookbazzar', 'pharmacy'] },
  { id: 'postgresql', name: 'POSTGRESQL', core: 'OCEAN CORE', category: 'DATABASE', element: 'ocean', hue: '#3fd0c9', tagline: 'Database Technology',
    lore: 'A deep ocean world where data flows like currents through submerged structures. Calm on the surface, powerful underneath.',
    sequence: ['DIVE', 'CURRENT', 'STRUCTURE', 'DEPTH'],
    projects: [] },
  { id: 'javascript', name: 'JAVASCRIPT', core: 'LIGHTNING CORE', category: 'FRONTEND', element: 'electric', hue: '#ffe259', tagline: 'Interactive Web Development',
    lore: 'A storm wrapped around a data tower. Every strike wakes an interface — events, states, motion. Hover and the electricity follows your cursor.',
    sequence: ['EVENT', 'STATE', 'ACTION', 'INTERFACE'],
    projects: ['bookbazzar', 'astrology', 'pharmacy'] },
  { id: 'html', name: 'HTML', core: 'ARCHITECTURE CORE', category: 'FRONTEND', element: 'arch', hue: '#ff8a3d', tagline: 'Web Structure',
    lore: 'A city under construction. Header, navigation, section, footer — every building is placed by structure, and the skyline assembles itself.',
    sequence: ['HEADER', 'NAV', 'SECTION', 'FOOTER'],
    projects: ['bookbazzar', 'astrology', 'pharmacy'] },
  { id: 'css', name: 'CSS', core: 'SHAPE CORE', category: 'FRONTEND', element: 'shape', hue: '#b19bff', tagline: 'Responsive UI & Styling',
    lore: 'Shape-shift power. Raw wireframe becomes color, shadow, hierarchy and motion. The same city — reborn as a premium experience.',
    sequence: ['STRUCTURE', 'STYLE', 'HIERARCHY', 'EXPERIENCE'],
    projects: ['bookbazzar', 'astrology', 'pharmacy'] },
  { id: 'bootstrap', name: 'BOOTSTRAP', core: 'CONSTRUCTION CORE', category: 'FRONTEND', element: 'construct', hue: '#7f6bff', tagline: 'Responsive UI Development',
    lore: 'A rapid-deployment construction system. Grids, cards, navbars and components snap into place at industrial speed — responsive by default.',
    sequence: ['GRID', 'COMPONENT', 'ASSEMBLE', 'DEPLOY'],
    projects: ['bookbazzar'] },
  { id: 'java', name: 'JAVA', core: 'MACHINE CORE', category: 'LANGUAGE', element: 'machine', hue: '#ffb25e', tagline: 'Object-Oriented Logic',
    lore: 'A giant mechanical engine. Classes are forged, objects roll off the line, methods fire in sequence — logic made physical.',
    sequence: ['CLASS', 'OBJECT', 'METHOD', 'EXECUTION'],
    projects: [] },
  { id: 'python', name: 'PYTHON', core: 'INTELLIGENCE CORE', category: 'LANGUAGE', element: 'intellect', hue: '#69e2a0', tagline: 'Basics — Automation & Scripting',
    lore: 'A laboratory for automation, scripting and logical experimentation. Small rigs, honest scripts, relentless iteration.',
    sequence: ['SCRIPT', 'AUTOMATE', 'TEST', 'ITERATE'],
    projects: [] },
  { id: 'git', name: 'GIT', core: 'TIMELINE CORE', category: 'TOOLS', element: 'timeline', hue: '#ff6d70', tagline: 'Version Control',
    lore: 'A time machine for code. Every commit a checkpoint, every branch a timeline. Travel backward, merge forward — nothing is ever lost.',
    sequence: ['CODE', 'COMMIT', 'BRANCH', 'MERGE'],
    projects: ['bookbazzar', 'astrology', 'pharmacy'] },
  { id: 'docker', name: 'DOCKER', core: 'CONTAINER CORE', category: 'TOOLS', element: 'container', hue: '#4fb3ff', tagline: 'Containerized Development',
    lore: 'A city made of containers — frontend, backend, database, service — each holding a miniature application. When activated, they lock together as one.',
    sequence: ['FRONTEND', 'BACKEND', 'DATABASE', 'LOCK'],
    projects: [] },
  { id: 'threejs', name: 'THREE.JS', core: 'DIMENSION CORE', category: '3D & MOTION', element: 'dimension', hue: '#8ad8ff', tagline: 'Interactive 3D Experiences',
    lore: 'A portal into the third dimension. Spheres, cameras, light and particles — the raw geometry of an interactive universe.',
    sequence: ['SCENE', 'CAMERA', 'LIGHT', 'RENDER'],
    projects: [] },
  { id: 'gsap', name: 'GSAP', core: 'TEMPORAL CORE', category: '3D & MOTION', element: 'temporal', hue: '#9dff6e', tagline: 'Advanced Animation',
    lore: 'Time control. The environment freezes, reverses, eases and snaps — every movement choreographed to the millisecond.',
    sequence: ['FREEZE', 'EASE', 'REVERSE', 'RESUME'],
    projects: [] },
  { id: 'lenis', name: 'LENIS', core: 'FLOW CORE', category: '3D & MOTION', element: 'flow', hue: '#6ee7ff', tagline: 'Smooth Interaction',
    lore: 'A river made of light. Scrolling stops being mechanical and becomes gliding — heavy, cinematic, controlled.',
    sequence: ['SCROLL', 'GLIDE', 'FLOW', 'ARRIVE'],
    projects: [] },
];

export const SKILL_COMBOS: { skills: string[]; result: string; note: string }[] = [
  { skills: ['php', 'mysql'], result: 'FULL-STACK WEB CORE', note: 'PHP + MySQL — the stack behind BookBazzar, the Astrology Calculator and Pharmacy Billing.' },
  { skills: ['html', 'css', 'javascript'], result: 'FRONTEND CORE', note: 'HTML + CSS + JavaScript — structure, style and behavior of every interface.' },
  { skills: ['threejs', 'gsap', 'lenis'], result: 'INTERACTIVE 3D CORE', note: 'Three.js + GSAP + Lenis — the motion system powering this very Agnesverse.' },
  { skills: ['git', 'docker'], result: 'DEPLOYMENT WORKFLOW CORE', note: 'Git + Docker — versioned, containerized delivery workflow.' },
];

/* ---------------------------------------------------------
   PROJECTS — the Battleground
   --------------------------------------------------------- */
export interface Project {
  id: string;
  match: string; // substring to match GitHub repo name
  name: string;
  codename: string;
  subtitle: string;
  image: string;
  github: string;
  tech: string[];
  features: string[];
  workflow: string[];
  sim: 'bookbazzar' | 'astrology' | 'pharmacy';
  status: 'SOURCE ONLY' | 'LIVE';
  liveUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'bookbazzar',
    match: 'bookbazzar',
    name: 'BOOKBAZZAR',
    codename: 'MISSION 01',
    subtitle: 'Refurbished Book Selling & Donation Platform',
    image: '/images/bookbazzar.jpg',
    github: 'https://github.com/ArulAgnes/BookBazzar-PRO-Updated',
    tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap', 'PHP Mailer', 'XAMPP'],
    features: [
      'Buying, selling & donating refurbished books',
      'Role-based authentication — Admin & User',
      'Email notifications via PHP Mailer',
      'Order confirmations & donation alerts',
      'Inventory management',
      'User management & donation workflows',
    ],
    workflow: ['BOOK APPEARS', 'USER SELECTS', 'TRANSACTION', 'EMAIL SENT', 'INVENTORY UPDATES', 'DONATION PORTAL OPENS'],
    sim: 'bookbazzar',
    status: 'SOURCE ONLY',
  },
  {
    id: 'astrology',
    match: 'astrology',
    name: 'PHP ASTROLOGY CALCULATOR',
    codename: 'MISSION 02',
    subtitle: 'Numerology & Lucky Number Generator',
    image: '/images/astrology.jpg',
    github: 'https://github.com/ArulAgnes/PHP-Astrology-Calculator-',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    features: [
      'Date of Birth input',
      'Lucky number generation',
      'Life path number',
      'Compatibility score',
      'JavaScript DOM interaction',
      'PHP backend logic',
    ],
    workflow: ['ENTER DOB', 'JS VALIDATES', 'PHP COMPUTES', 'LUCKY NUMBER', 'LIFE PATH', 'COMPATIBILITY'],
    sim: 'astrology',
    status: 'SOURCE ONLY',
  },
  {
    id: 'pharmacy',
    match: 'pharmacy',
    name: 'PHARMACY BILLING MANAGEMENT',
    codename: 'MISSION 03',
    subtitle: 'Medical Inventory & Billing System',
    image: '/images/pharmacy.jpg',
    github: 'https://github.com/ArulAgnes/Pharmacy-Billing-Website',
    tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'FPDF'],
    features: [
      'Medicine sales & billing',
      'Inventory management',
      'Customer management',
      'Invoice generation with FPDF',
      'Transaction history',
      'Database management',
    ],
    workflow: ['CUSTOMER', 'MEDICINE', 'QUANTITY', 'BILL', 'PDF INVOICE', 'TRANSACTION LOGGED'],
    sim: 'pharmacy',
    status: 'SOURCE ONLY',
  },
];

/* ---------------------------------------------------------
   EXPERIENCE — Mission Logs
   --------------------------------------------------------- */
export const EXPERIENCE = {
  company: 'DevSkillHub',
  role: 'Frontend Web Development Intern',
  period: 'June — July 2024',
  title: 'FRONTEND WEB DEVELOPMENT MISSION',
  objectives: [
    'Built responsive web pages with HTML, CSS, JavaScript & Bootstrap',
    'Ensured cross-browser compatibility',
    'Crafted pixel-accurate UI components & layouts',
    'Optimized page-load performance',
    'Collaborated with the development team on real interfaces',
  ],
  tools: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
} as const;

/* ---------------------------------------------------------
   EDUCATION — the Knowledge Archive
   --------------------------------------------------------- */
export interface EduRecord {
  id: string;
  page: string;
  degree: string;
  institution: string;
  period: string;
  result: string;
  resultLabel: string;
  visual: string;
  lore: string;
}

export const EDUCATION: EduRecord[] = [
  {
    id: 'be', page: 'PAGE 01', degree: 'B.E COMPUTER SCIENCE & ENGINEERING',
    institution: 'Adhiyamaan College of Engineering, Hosur', period: '2021 — 2025',
    result: '8.43', resultLabel: 'CGPA',
    visual: 'A futuristic university tower rising over the archive — where engineering met code.',
    lore: 'Four years inside the machine: programming, databases, web technology and engineering discipline.',
  },
  {
    id: 'hsc', page: 'PAGE 02', degree: 'HIGHER SECONDARY',
    institution: 'PK Hr Sec School, Krishnapuram, Viruthunagar', period: '2019 — 2021',
    result: '86.6%', resultLabel: 'PERFORMANCE',
    visual: 'A glowing academic tower — the mid-game where mathematics and science sharpened.',
    lore: 'The foundation years: logic, mathematics and the first pull toward computation.',
  },
  {
    id: 'sslc', page: 'PAGE 03', degree: 'SSLC',
    institution: 'T.N.P.M.M.N Boys Hr Sec School, Viruthunagar', period: '2018 — 2019',
    result: '91%', resultLabel: 'PERFORMANCE',
    visual: 'A foundation stone — the first chamber of the archive ever unlocked.',
    lore: 'Where the journey began: discipline, fundamentals and the first 91% proof of intent.',
  },
];

/* ---------------------------------------------------------
   CERTIFICATIONS — the Credential Vault
   --------------------------------------------------------- */
export const CERTIFICATIONS = [
  {
    id: 'nasscom',
    title: 'APPLICATION DEVELOPER — WEB & MOBILE',
    org: 'IT-ITES Sector Skills Council (NASSCOM)',
    under: 'Under PMKVY · Adhiyamaan College of Engineering Skill Centre',
    date: 'June 2024',
    glyph: 'shield',
  },
  {
    id: 'aws',
    title: 'MASTERING AWS',
    org: 'A Step-by-Step Guide to Cloud Computing',
    under: 'Cloud Computing Program',
    date: 'October — November 2024',
    glyph: 'cloud',
  },
] as const;

/* ---------------------------------------------------------
   LANGUAGES & SOFT SKILLS — Human Protocols
   --------------------------------------------------------- */
export const LANGUAGES = [
  { name: 'ENGLISH', level: 'Professional Proficiency' },
  { name: 'TAMIL', level: 'Native Proficiency' },
] as const;

export const SOFT_SKILLS = [
  { id: 'teamwork', name: 'TEAMWORK', lore: 'Multiple systems synchronize into one output.', glyph: 'sync' },
  { id: 'adaptability', name: 'ADAPTABILITY', lore: 'The environment transforms — the hero transforms with it.', glyph: 'morph' },
  { id: 'analytical', name: 'ANALYTICAL THINKING', lore: 'Chaotic data patterns organize into signal.', glyph: 'grid' },
  { id: 'leadership', name: 'LEADERSHIP', lore: 'Multiple nodes follow a single clear command.', glyph: 'command' },
  { id: 'problem', name: 'PROBLEM SOLVING', lore: 'A broken system repairs itself — the Legacy Bug falls.', glyph: 'repair' },
] as const;

/* ---------------------------------------------------------
   ORIGIN — about panels (resume-supported)
   --------------------------------------------------------- */
export const ORIGIN_PANELS = [
  { k: '01 — IDENTITY', title: 'PHP WEB DEVELOPER', body: 'Hands-on experience building dynamic and responsive web applications — from database to interface.' },
  { k: '02 — BACKEND', title: 'LOGIC & ARCHITECTURE', body: 'PHP · Laravel · MySQL. Backend logic, MVC architecture, authentication and API integration built to hold under pressure.' },
  { k: '03 — INTERFACE', title: 'RESPONSIVE FRONTEND', body: 'JavaScript · HTML · CSS · Bootstrap. UI design with pixel-accurate components, tuned for every screen and browser.' },
  { k: '04 — DELIVERY', title: 'MODEL & DEPLOY', body: 'Database modeling, deployment workflows, version control. From localhost to the world — the full mission cycle.' },
] as const;

/* ---------------------------------------------------------
   FINAL — five technology artifacts
   --------------------------------------------------------- */
export const FIVE_CORES = [
  { name: 'CODE CORE', behavior: 'fire', hue: '#ff7a1a' },
  { name: 'DATA CORE', behavior: 'crystal', hue: '#41d9ff' },
  { name: 'WEB CORE', behavior: 'electric', hue: '#ffe259' },
  { name: 'LOGIC CORE', behavior: 'geometric', hue: '#8a6bff' },
  { name: 'TIME CORE', behavior: 'temporal', hue: '#9dff6e' },
] as const;
