export const personal = {
  name: 'Rithwik Bandi',
  title: 'Full Stack & AI Engineer',
  tagline: 'Building scalable systems, intelligent applications, and real-world software.',
  location: 'Warangal, Telangana, India',
  email: 'rithwik.bandi56@gmail.com',
  email2: 'info@rithwikbandi.tech',
  github: 'https://github.com/RithwikBandi',
  linkedin: 'https://www.linkedin.com/in/rithwik-bandi/',
  leetcode: 'https://leetcode.com/u/BandiRithwik/',
  twitter: 'https://x.com/RickyBandi56',
  medium: 'https://medium.com/@rithwikbandi.56',
  resume: '/assets/resume/Rithwik_Resume.pdf',
  status: 'Open to opportunities',
  cgpa: '8.92',
  university: 'SR University, Warangal',
  degree: 'B.Tech Computer Science & Engineering',
  period: '2023 – 2027',
}

export const projects = [
  {
    id: 1,
    title: 'JobSpace AI',
    category: 'Full Stack Platform',
    description: 'A comprehensive job tracking platform that brings order to the chaos of job hunting. Features RBAC authentication, real-time analytics dashboards, and intelligent application management built for scale.',
    impact: 'Full-stack job management platform with enterprise-grade access control',
    tech: ['Node.js', 'MongoDB', 'React', 'Express', 'JWT', 'RBAC'],
    github: 'https://github.com/RithwikBandi/JobSpace',
    live: null,
    color: '#6ee7b7',
    featured: true,
    number: '01',
  },
  {
    id: 2,
    title: 'Heart Risk Prediction System',
    category: 'AI Healthcare',
    description: 'An AI-powered cardiovascular risk assessment platform that combines machine learning precision with human-readable explanations. SHAP explainability makes black-box ML transparent and actionable for clinicians.',
    impact: 'ML pipeline with SHAP explainability for clinical-grade transparency',
    tech: ['FastAPI', 'React', 'MongoDB', 'Python', 'SHAP', 'Scikit-learn'],
    github: 'https://github.com/RithwikBandi/Heart-Risk-AI',
    live: null,
    color: '#f87171',
    featured: true,
    number: '02',
  },
  {
    id: 3,
    title: 'Automated Timetable Analyzer',
    category: 'Full Stack Web App',
    description: 'Transforms chaotic Excel timetable exports into clean, interactive, and exportable schedules. Handles real-world data inconsistencies like merged cells and irregular layouts that break naive parsers.',
    impact: 'Deployed at SR University — serving hundreds of students daily',
    tech: ['FastAPI', 'Python', 'JavaScript', 'HTML/CSS', 'openpyxl'],
    github: 'https://github.com/RithwikBandi/SRU-TIME-TABLE',
    live: 'https://sru-time-table.vercel.app',
    color: '#818cf8',
    featured: false,
    number: '03',
  },
  {
    id: 4,
    title: 'MarvelShowCase',
    category: 'Frontend Application',
    description: 'A cinematic MCU explorer built with React and Framer Motion. Smooth page transitions, optimized image loading, and an immersive browsing experience across 30+ years of Marvel content.',
    impact: 'Production-grade UI with buttery-smooth animations and responsive design',
    tech: ['React', 'Framer Motion', 'Tailwind CSS', 'JavaScript'],
    github: 'https://github.com/RithwikBandi/MarvelShowCase',
    live: 'https://marvel-show-case.vercel.app',
    color: '#fbbf24',
    featured: false,
    number: '04',
  },
  {
    id: 5,
    title: 'Personal Loan Prediction (ANN)',
    category: 'Deep Learning',
    description: 'An Artificial Neural Network that predicts personal loan approval outcomes with 91.3% accuracy. Custom ApprovalBoost feature engineering elevates performance beyond baseline classifiers.',
    impact: '91.3% accuracy on structured financial data with custom feature engineering',
    tech: ['Python', 'TensorFlow', 'NumPy', 'Pandas', 'Scikit-learn'],
    github: 'https://github.com/RithwikBandi/Loan-Prediction-AI',
    live: 'https://colab.research.google.com/drive/1ntQ1GVLRfde-cmfWffskJNHsvY9Itq8n',
    color: '#c084fc',
    featured: false,
    number: '05',
  },
]

export const skills = [
  {
    category: 'Programming',
    icon: '⌨️',
    items: ['Python', 'JavaScript (ES6+)', 'Java', 'C'],
  },
  {
    category: 'Frontend',
    icon: '🎨',
    items: ['React', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    items: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs'],
  },
  {
    category: 'Databases',
    icon: '🗄️',
    items: ['MongoDB', 'MySQL', 'SQLite', 'Mongoose'],
  },
  {
    category: 'AI / ML',
    icon: '🧠',
    items: ['Scikit-learn', 'TensorFlow', 'SHAP', 'Pandas', 'NumPy'],
  },
  {
    category: 'Core CS',
    icon: '🔬',
    items: ['DSA', 'DBMS', 'OS', 'Computer Networks', 'OOP'],
  },
  {
    category: 'Tools',
    icon: '🛠️',
    items: ['Git & GitHub', 'VS Code', 'Google Colab', 'Vercel', 'Render'],
  },
]

export const experience = [
  {
    id: 1,
    role: 'Full Stack & AI Developer',
    project: 'Heart Risk Prediction System',
    period: '2025 — Present',
    type: 'Project Role',
    description: 'Designed and built an end-to-end AI-powered cardiovascular risk assessment platform. Integrated FastAPI backend with React frontend, MongoDB for data persistence, and SHAP for ML explainability — making prediction models interpretable for real clinical use.',
    highlights: [
      'Architected FastAPI + React + MongoDB full-stack pipeline',
      'Implemented ML pipeline with SHAP explainability layer',
      'Designed responsive clinical dashboard UI',
      'Built secure authentication and patient data flows',
    ],
    tech: ['FastAPI', 'React', 'MongoDB', 'Python', 'SHAP', 'ML'],
    status: 'active',
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    project: 'JobSpace AI',
    period: '2026',
    type: 'Project Role',
    description: 'Developed a full-stack job application tracking platform from zero to production. Implemented RBAC authentication, real-time analytics dashboards, and a clean management interface — all backed by Node.js and MongoDB.',
    highlights: [
      'Built RBAC authentication system with JWT',
      'Created analytics dashboards with real-time data',
      'Designed intuitive job tracking workflows',
      'Engineered scalable Node.js + MongoDB backend',
    ],
    tech: ['Node.js', 'MongoDB', 'React', 'Express', 'JWT'],
    status: 'active',
  },
]

export const education = [
  {
    institution: 'SR University, Warangal',
    degree: 'B.Tech — Computer Science & Engineering',
    period: '2023 — 2027',
    grade: 'CGPA: 8.92',
    status: 'In Progress',
    subjects: ['DSA', 'DBMS', 'OS', 'Computer Networks', 'DAA', 'OOP (Python)'],
  },
  {
    institution: 'SR Intermediate College',
    degree: 'MPC — Mathematics, Physics & Chemistry',
    period: '2021 — 2023',
    grade: '92.1%',
    status: 'Completed',
    subjects: [],
  },
  {
    institution: 'SPR School of Excellence',
    degree: 'State Board — Secondary Education',
    period: '2020',
    grade: '10 / 10',
    status: 'Completed',
    subjects: [],
  },
]

export const certifications = [
  {
    title: 'Microsoft Azure AI-900',
    issuer: 'Microsoft',
    subtitle: 'Azure AI Fundamentals',
    description: 'Industry-recognized certification validating foundational knowledge of AI concepts and Microsoft Azure AI services.',
    skills: ['Core AI & ML Concepts', 'Computer Vision', 'NLP', 'Responsible AI'],
    pdf: '/assets/certificates/AI-900.pdf',
    badge: '/assets/certificates/azure-ai-fundamentals-badge.png',
  },

  {
    title: 'AI-ML Virtual Internship',
    issuer: 'All India Council for Technical Education (AICTE)',
    subtitle: 'AICTE • EduSkills • Google for Developers',
    description: 'Successfully completed a 10-week AI-ML Virtual Internship under the AICTE National Internship Portal, in collaboration with EduSkills and supported by Google for Developers. Gained hands-on experience in machine learning workflows, data analysis, and building practical AI solutions with real-world applications.',
    skills: [
      'Machine Learning',
      'AI Fundamentals',
      'Data Analysis',
      'Model Development',
      'Python',
      'Real-world AI Applications'
    ],
    pdf: '/assets/certificates/aicte-certificate.pdf',
    badge: '/assets/certificates/aicte-badge.png'
  }
]
