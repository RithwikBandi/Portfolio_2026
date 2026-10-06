// Canonical origin (no trailing slash)
export const SITE_URL = 'https://rithwikbandi.tech'

export const site = {
  name: 'Rithwik Bandi',
  role: 'Web Developer & Growth Expert',
  status: 'Available for projects and roles',
  email: 'info@rithwikbandi.tech',
  emailAlt: 'rithwik.bandi56@gmail.com',
  resume: '/assets/resume/Rithwik_Resume.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/RithwikBandi', handle: 'RithwikBandi' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rithwik-bandi/', handle: 'rithwik-bandi' },
    { label: 'X', href: 'https://x.com/RickyBandi56', handle: '@RickyBandi56' },
    { label: 'Medium', href: 'https://medium.com/@rithwikbandi.56', handle: '@rithwikbandi.56' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/BandiRithwik/', handle: 'BandiRithwik' },
  ],
}

// What I do, in the order a client thinks about it.
export const pillars = [
  { n: '01', title: 'Build', text: 'Full-stack products, designed and engineered to be fast and effortless to use.' },
  { n: '02', title: 'Market', text: 'Positioning, content and channels, so the right audience finds the work and trusts it.' },
  { n: '03', title: 'Sell', text: 'Offers, outreach and follow-through that turn interest into customers.' },
]

export const principles = [
  {
    title: 'Normalise messy input',
    text: 'SRU Timetable reads two very different sources and reshapes both into one canonical structure, so every feature downstream stays simple.',
  },
  {
    title: 'Protect the user by default',
    text: 'Folio converts documents entirely in the browser, and SRU Timetable never stores an upload. The safest data is data that never leaves the device.',
  },
  {
    title: 'Make the logic explain itself',
    text: 'CardioML validates medical bounds on the server and turns SHAP values into plain language, because a number nobody can interpret is not much use.',
  },
]

// Three disciplines, each with a short, deliberate toolset. Depth over keyword lists.
export const capabilities = [
  {
    n: '01',
    title: 'Engineering',
    line: 'Interfaces, APIs and data, built to be fast, maintainable and a pleasure to use.',
    tools: ['React', 'TypeScript', 'Node.js', 'Python & FastAPI', 'MongoDB & PostgreSQL', 'Performance'],
    proof: 'Folio · JobSpace · CardioML · SRU Timetable',
  },
  {
    n: '02',
    title: 'Marketing',
    line: 'Positioning, content and search that make a product easy to find and easy to believe.',
    tools: ['Positioning & messaging', 'Content & copy', 'Digital campaigns', 'Search (SEO)', 'Conversion'],
    proof: 'Applied to this site: structure, speed, metadata, copy',
  },
  {
    n: '03',
    title: 'Sales',
    line: 'Understanding the buyer, shaping the offer and closing the conversation.',
    tools: ['Offer design', 'Outreach', 'Discovery & follow-up', 'Proposals'],
  },
]

export const education = [
  {
    school: 'SR University',
    degree: 'B.Tech, Computer Science & Engineering',
    period: '2023 — 2027',
    grade: 'CGPA 8.92',
    note: 'In progress',
  },
  {
    school: 'SR Intermediate College',
    degree: 'MPC: Mathematics, Physics & Chemistry',
    period: '2021 — 2023',
    grade: '92.1%',
    note: 'Completed',
  },
  {
    school: 'SPR School of Excellence',
    degree: 'State Board, Secondary Education',
    period: '2020',
    grade: '10 / 10',
    note: 'Completed',
  },
]

export const credentials = [
  {
    badge: 'badge-aws',
    title: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services',
    text: 'Cloud concepts, security, architecture, pricing and support.',
    href: '/assets/certificates/AWS_Academy_Graduate_Cloud_Foundations_Training_Badge_Badge.pdf',
  },
  {
    badge: 'badge-azure',
    title: 'Azure AI Fundamentals (AI-900)',
    issuer: 'Microsoft',
    text: 'Core AI and ML concepts, computer vision, NLP and responsible AI.',
    href: '/assets/certificates/AI-900.pdf',
  },
  {
    badge: 'badge-aicte',
    title: 'AI-ML Virtual Internship',
    issuer: 'AICTE · EduSkills · Google for Developers',
    text: 'Ten weeks on machine-learning workflows, data analysis and practical AI solutions.',
    href: '/assets/certificates/aicte-certificate.pdf',
  },
]

// Photos for the compact Vietnam band (names map to src/data/images.json)
export const vietnam = {
  title: 'Winter Immersion, Vietnam',
  text: 'One of eight SR University students selected for an immersion programme at FPT University: sessions on cybersecurity and sustainability, plus a crash course in how other places learn, build and work.',
  photos: [
    { name: 'vietnam-boat', caption: 'Hoi An, coconut basket boats', alt: 'A group riding a colourful round coconut basket boat through a palm forest in Hoi An' },
    { name: 'vietnam-lanterns', caption: 'Hoi An, lantern making', alt: 'Students making traditional lanterns at a table under hanging lanterns' },
    { name: 'vietnam-garden', caption: 'Da Nang, Botanica Garden', alt: 'The group standing at the entrance of Botanica Garden in Da Nang' },
    { name: 'vietnam-welcome', caption: 'FPT University, welcome ceremony', alt: 'The group in front of the welcome ceremony screen at FPT University' },
  ],
}
