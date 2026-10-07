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
  { n: '01', title: 'Build', text: 'Web products end to end: React and TypeScript in front, Node or Python behind, shipped and live.' },
  { n: '02', title: 'Market', text: 'Positioning, writing and search. I write up what I build so the people who need it can find it.' },
  { n: '03', title: 'Sell', text: 'Packaging the offer, reaching out, following up. The part that turns a good build into a client.' },
]

export const principles = [
  {
    title: 'Start from something that annoys me',
    text: 'SRU Timetable began because I could not read my own university schedule. JobSpace began because my job hunt lived in a messy sheet. The annoyance is the brief.',
  },
  {
    title: 'Keep the user’s data on the user’s side',
    text: 'Folio converts files in the browser and never uploads them. SRU Timetable parses a spreadsheet in memory and throws it away. If I do not have the data, I cannot lose it.',
  },
  {
    title: 'Show the reasoning',
    text: 'CardioML does not just output a risk level. It lists what pushed the score up and what held it down, because a number nobody can question is a number nobody trusts.',
  },
]

// Three disciplines, each with a short, deliberate toolset. Depth over keyword lists.
export const capabilities = [
  {
    n: '01',
    title: 'Engineering',
    line: 'Front end, back end and deploy. I take a product from an empty folder to a live URL.',
    tools: ['React', 'TypeScript', 'Node.js', 'Python & FastAPI', 'MongoDB & PostgreSQL'],
    proof: 'Folio · JobSpace · CardioML · SRU Timetable',
  },
  {
    n: '02',
    title: 'Marketing',
    line: 'Positioning, writing and search. I explain what I build in plain words and make it easy to find.',
    tools: ['Positioning', 'Copywriting', 'Content', 'Search (SEO)'],
    proof: 'My Medium write-ups · this site',
  },
  {
    n: '03',
    title: 'Sales',
    line: 'Understanding the buyer, shaping the offer and following up. This is the skill I am building on purpose.',
    tools: ['Outreach', 'Offer design', 'Proposals'],
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
  text: 'In winter 2025 I was one of eight SR University students sent to FPT University in Vietnam. Sessions on cybersecurity and sustainability, then a lantern workshop in Hoi An and a ride in a coconut-basket boat.',
  photos: [
    { name: 'vietnam-session', caption: 'Session in the meeting room', alt: 'The group in a meeting room with a speaker on the video screen behind them' },
    { name: 'vietnam-lanterns', caption: 'Hoi An, lantern making', alt: 'Students making traditional lanterns at a table under hanging lanterns' },
    { name: 'vietnam-cormis', caption: 'Group photo at CORMIS', alt: 'The group posing together in front of a CORMIS sign' },
    { name: 'vietnam-group', caption: 'Group photo with gift bags', alt: 'The group posing together holding orange gift bags' },
    // Only visible in the full-screen viewer. Captions describe what is in the frame.
    { name: 'vietnam-boat', caption: 'Hoi An, coconut basket boats', alt: 'A group riding a colourful round coconut basket boat through a palm forest in Hoi An' },
    { name: 'vietnam-garden', caption: 'Da Nang, Botanica Garden', alt: 'The group standing at the entrance of Botanica Garden in Da Nang' },
    { name: 'vietnam-welcome', caption: 'FPT University, welcome ceremony', alt: 'The group in front of the welcome ceremony screen at FPT University' },
    { name: 'vietnam-banner', caption: 'FPT University, Winter Study Tour 2025', alt: 'The group holding the SR University and FPT University Winter Study Tour Program 2025 banner on a lawn' },
  ],
  band: 4, // how many photos the home page shows before opening the viewer
}
