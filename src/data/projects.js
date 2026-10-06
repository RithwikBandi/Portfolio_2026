// Content rules: every claim here comes from the project's own README or live
// product. No usage numbers, traffic or impact figures are stated anywhere.

const entries = [
  {
    slug: 'folio',
    index: '01',
    title: 'Folio',
    tagline: 'Documents, converted privately.',
    summary:
      'A document studio that runs entirely in your browser: Markdown to Word and PDF, PDF merge and split, images to PDF. Nothing is ever uploaded.',
    description:
      'Case study: Folio, a browser-only document studio built with React and TypeScript that converts Markdown to Word and PDF, merges and splits PDFs and turns images into PDFs without uploading a single byte.',
    year: '2026',
    role: 'Design & development',
    status: 'Live',
    stack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'docx', 'pdf-lib', 'jsPDF'],
    links: { live: 'https://folio-converter.vercel.app', github: 'https://github.com/RithwikBandi/Folio-Converter' },
    plate: { kind: 'shot', image: 'shot-folio', alt: 'The Folio converter: drop a Markdown file to get a Word or PDF document', host: 'folio-converter.vercel.app' },
    problem: [
      'Most online converters upload your document to a server you cannot see. For contracts, specs and personal notes that is a real risk, and a real reason to hesitate.',
      'Folio does the work inside the browser tab instead. The file is read into memory, converted there and handed back as a download, so there is nothing to upload and nothing to leak.',
    ],
    features: [
      { title: 'Markdown to Word', text: 'Compiles Markdown into a real .docx package with heading styles, tables with cell shading and code blocks.' },
      { title: 'Markdown to PDF', text: 'A paginated A4 or Letter renderer with margins, page breaks and print typography, exported as a vector PDF.' },
      { title: 'Merge and split PDFs', text: 'Reorder and combine several PDFs, or extract page ranges such as 1-3, 5, with instant downloads.' },
      { title: 'Images to PDF', text: 'Drop PNG, JPG or WebP files, reorder the thumbnails and export one multi-page PDF.' },
      { title: 'Command palette', text: 'A Cmd/Ctrl+K palette and keyboard shortcuts make it feel like a native utility rather than a web form.' },
      { title: 'Light and dark', text: 'Adaptive themes with no flash on load.' },
    ],
    architecture: {
      intro:
        'Everything runs in the browser. A Markdown file is tokenised into a syntax tree, compiled to Word or laid out into pages for PDF, and returned as a downloadable blob, with no network request in between.',
      nodes: [
        { title: 'Your file', sub: 'Read into browser memory' },
        { title: 'Conversion engine', sub: 'marked AST · docx · jsPDF · pdf-lib' },
        { title: 'Download', sub: 'Blob saved locally' },
      ],
      note: 'Open the network tab during a conversion and you will not see the document leave the page.',
    },
    decisions: [
      {
        title: 'Privacy as architecture, not policy',
        text: 'With no server in the loop there is nothing to promise and nothing to breach. The safest design for a confidential file is one that never travels.',
      },
      {
        title: 'Real documents, not HTML in disguise',
        text: 'Markdown is compiled to OpenXML through a syntax tree rather than pasted into a template, so the result opens as a proper Word file with real styles.',
      },
      {
        title: 'One interface, several engines',
        text: 'Word generation, PDF layout and PDF manipulation use different libraries, but they sit behind one consistent drop-convert-download flow.',
      },
      {
        title: 'A desktop feel in a tab',
        text: 'Keyboard shortcuts, a command palette and spring-based micro-interactions make a utility people actually enjoy using.',
      },
    ],
    notes: [],
  },

  {
    slug: 'sru-timetable',
    index: '01',
    title: 'SRU Timetable',
    tagline: 'A university schedule you can actually read.',
    summary:
      'Choose your degree, year and batch and your week appears as a real grid, with free-time analysis, batch comparison, an attendance calculator and clean exports.',
    description:
      'Case study: SRU Timetable, a React + TypeScript and FastAPI web app that turns a dense university timetable into a readable weekly grid with free-time analysis, batch comparison and exports.',
    year: '2025 — 2026',
    role: 'Design & development',
    status: 'Live',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'FastAPI', 'Pydantic v2', 'httpx', 'openpyxl', 'Vitest', 'pytest'],
    links: { live: 'https://sru-time-table.vercel.app', github: null },
    plate: { kind: 'shot', image: 'shot-sru', alt: 'The SRU Timetable landing page: choose degree, year and batch to load your timetable', host: 'sru-time-table.vercel.app' },
    demo: 'timetable',
    problem: [
      'SR University publishes every student’s timetable, but the official view is one dense table built for the registrar: every batch, every elective section and every room in a single grid. Answering “when is my next class?” or “when am I actually free today?” takes real effort.',
      'This began as a smaller tool. Download your batch’s Excel export, upload it, get a clean weekly view. That fixed reading, but not friction: you still had to find the right file every time. The rebuild removes that step. Pick your degree, year and batch and the schedule loads directly, with Excel upload kept as a fallback.',
    ],
    features: [
      { title: 'My Timetable', text: 'A full week as a real grid, every class sized to be readable rather than squeezed into a spreadsheet cell.' },
      { title: 'Free Time', text: 'The same grid flipped to show when you are free: free-slot count, longest break and a per-day breakdown.' },
      { title: 'Section picking', text: 'Where parallel electives overlap, choose your section and the slot collapses to your own schedule. The full list is never hidden.' },
      { title: 'Compare Batches', text: 'Find the windows when two batches are both free, alongside each batch’s own free-time breakdown.' },
      { title: 'Attendance calculator', text: 'Check one course instantly (skip or attend?) or track every course for the term with a live percentage and target.' },
      { title: 'Export', text: 'PNG, print-ready PDF or a self-contained HTML file. Always the complete schedule, never a cropped screenshot.' },
    ],
    architecture: {
      intro:
        'Three parts, and data only flows one way. The browser talks only to this app’s backend and never to a university system. The backend is the single component that retrieves and reshapes the publicly available schedule data, caches it briefly, then discards it.',
      nodes: [
        { title: 'Browser', sub: 'React 19 · TypeScript' },
        { title: 'App backend', sub: 'FastAPI · normalise · short TTL cache' },
        { title: 'University timetable page', sub: 'Public source of truth' },
      ],
      note: 'The Excel path feeds the same pipeline: both sources are normalised into one canonical shape before the frontend sees anything.',
      code: {
        caption: 'The canonical shape both sources are reduced to',
        text: `{
  "batch": "23CSBTB35",
  "timeSlots": ["09:30", "10:30", "..."],
  "days": ["Monday", "Tuesday", "..."],
  "cells": {
    "Monday": {
      "09:30": { "value": "DBMS (L)\\nRoom 204", "isClass": true, "type": "L" }
    }
  }
}`,
      },
    },
    decisions: [
      {
        title: 'One canonical shape for two very different sources',
        text: 'Live data and uploaded Excel files look nothing alike, so both are normalised into a single typed structure. The grid, free time, comparison, export and section picking all work from that one shape and never care where it came from. A class shared across batches stays marked as shared through filtering.',
      },
      {
        title: 'The browser never talks to the university',
        text: 'Only the backend does. The client stays simple, and nothing beyond the batch you selected leaves your device.',
      },
      {
        title: 'Cache briefly, store nothing',
        text: 'A small in-memory TTL cache avoids re-fetching the same batch on every click. There is no database: uploads are parsed in memory and thrown away, and session state resets on reload by design.',
      },
      {
        title: 'Free time is a first-class view, not an afterthought',
        text: 'The free-slot, longest-break and per-day maths is its own tested module, so the interface can stay a thin layer over trustworthy logic.',
      },
      {
        title: 'Tested without the network',
        text: 'Vitest and React Testing Library cover free-time logic, merging, validation and component behaviour. pytest with HTTP mocking covers the parser, the live-data client and the full API, so the suites run with no live access or credentials.',
      },
      {
        title: 'Free-tier hosting, kept honest',
        text: 'Frontend on Vercel, backend on Render. An uptime monitor and a scheduled GitHub Actions ping keep the free-tier backend from sleeping on inactivity.',
      },
    ],
    notes: [
      'An independent student project, not affiliated with or endorsed by SR University. For exam schedules, room changes and deadlines, always confirm on the official page.',
      'The app depends on the university’s public timetable service. When that is unavailable it says so plainly and offers the Excel upload instead.',
    ],
  },

  {
    slug: 'jobspace',
    index: '02',
    title: 'JobSpace',
    tagline: 'A job search, run like a workspace.',
    summary:
      'Track applications in a spreadsheet-style table with custom columns, keep documents in a vault, follow companies and read your analytics, all in one MERN workspace with role-based access.',
    description:
      'Case study: JobSpace, a full-stack MERN job-search workspace with a dynamic spreadsheet engine, document vault, analytics dashboard, session authentication and role-based access control.',
    year: '2026',
    role: 'Design & development',
    status: 'Live',
    stack: ['React 18', 'Vite', 'React Router', 'Chart.js', 'Node.js', 'Express 5', 'MongoDB', 'Mongoose', 'connect-mongo', 'bcrypt', 'Multer'],
    links: { live: 'https://job-space-deployment.vercel.app', github: 'https://github.com/RithwikBandi/JobSpace' },
    plate: { kind: 'shot', image: 'shot-jobspace', alt: 'The JobSpace landing page with the spreadsheet-style applications table', host: 'job-space-deployment.vercel.app' },
    problem: [
      'A job search sprawls across browser tabs, spreadsheets and folders of resumes. JobSpace brings it into one place: a table you shape yourself, a document vault, a company tracker and the analytics to see how the search is actually going.',
    ],
    features: [
      { title: 'Dynamic spreadsheet engine', text: 'Applications carry named fields plus user-defined columns, so the table adapts to how you track rather than the other way round.' },
      { title: 'Company tracker', text: 'Keep notes and details on the companies you are watching, with the same flexible columns.' },
      { title: 'Document vault', text: 'Store resumes and supporting files, with size and file-type limits enforced in middleware.' },
      { title: 'Analytics dashboard', text: 'Charts over your own application data, built with Chart.js.' },
      { title: 'Role-based access', text: 'Session authentication with separate guards for signed-in users and admins.' },
      { title: 'Light and dark themes', text: 'A full theme system across the whole workspace.' },
    ],
    architecture: {
      intro:
        'Two independently deployable services. The React app calls the Express API with credentials, the API validates the session cookie against a MongoDB-backed session store, route guards decide what is allowed, and controllers talk to MongoDB through Mongoose.',
      nodes: [
        { title: 'React SPA', sub: 'React Router · Axios · Chart.js' },
        { title: 'Express API', sub: 'Sessions · route guards · RBAC' },
        { title: 'MongoDB', sub: 'users · applications · companies · documents · sessions' },
      ],
    },
    decisions: [
      {
        title: 'Sessions over JWT',
        text: 'Sessions are stored in MongoDB through connect-mongo and checked by guard middleware on every request, which keeps logout and revocation straightforward.',
      },
      {
        title: 'Flexible where the data is personal, strict where it is not',
        text: 'Applications keep named fields for the common columns and an open extension map for everything a user adds, so new columns need no migration.',
      },
      {
        title: 'Passwords and uploads hardened at the edges',
        text: 'Passwords are hashed with bcrypt, and uploads are capped in size and restricted to specific file types before they reach any controller.',
      },
      {
        title: 'Two services, deployed separately',
        text: 'Backend and frontend are independent deployables, which keeps each one small enough to reason about.',
      },
    ],
    notes: ['The backend runs on a free hosting tier, so the very first visit after a quiet period can take a little while to wake up.'],
  },

  {
    slug: 'cardioml',
    index: '03',
    title: 'CardioML',
    tagline: 'Risk prediction that shows its reasoning.',
    summary:
      'Enter eight health parameters and get a Low, Moderate or High cardiovascular risk classification, with SHAP-based explanations of what drove it. FastAPI, React, MongoDB and a scikit-learn model, end to end.',
    description:
      'Case study: CardioML, an end-to-end cardiovascular risk prediction app with a scikit-learn model, SHAP explainability, a FastAPI backend, React frontend and MongoDB persistence. Educational project.',
    year: '2026',
    role: 'Full-stack and ML development',
    status: 'Source on GitHub',
    stack: ['React 19', 'Vite', 'Tailwind CSS', 'FastAPI', 'Motor (MongoDB)', 'scikit-learn', 'SHAP', 'Pydantic', 'JWT', 'pytest'],
    links: { live: null, github: 'https://github.com/RithwikBandi/Heart-Risk-AI' },
    plate: { kind: 'shot', image: 'shot-cardioml', alt: 'The CardioML landing page: predict cardiovascular risk with explainable AI', host: 'local build · source on GitHub' },
    problem: [
      'A risk score is only useful if someone can see why. CardioML pairs a simple, interpretable model with SHAP so every prediction comes with the factors behind it, translated into plain language.',
      'This is an educational and research project. It is not medical advice and must not replace professional clinical judgement.',
    ],
    features: [
      { title: 'Risk assessment', text: 'An eight-input clinical form validated on the client and again on the server.' },
      { title: 'Explainable results', text: 'SHAP-driven key risk factors, a health analysis, protective factors and personalised recommendations.' },
      { title: 'Prediction history', text: 'Every assessment is stored per user and viewable in a sortable table.' },
      { title: 'Admin dashboard', text: 'Risk distribution and predictions-over-time charts, behind an isolated admin login.' },
      { title: 'Authentication', text: 'Registration and login with bcrypt-hashed passwords and token-based sessions.' },
      { title: 'Light and dark themes', text: 'Theme tokens persisted in local storage.' },
    ],
    architecture: {
      intro:
        'The React app posts a form to FastAPI. The backend validates medical bounds, scales the inputs, runs the model, computes SHAP values and converts them into readable factors before anything is stored.',
      nodes: [
        { title: 'React SPA', sub: 'Predict · History · Admin' },
        { title: 'FastAPI', sub: 'Validate → scale → model → SHAP → explain' },
        { title: 'MongoDB', sub: 'users · predictions · model logs' },
      ],
      note: 'The model is a logistic regression trained on 5,500 clinical records and persisted with its scaler.',
    },
    decisions: [
      {
        title: 'Validate like it matters',
        text: 'Server-side bounds checking is its own module with unit tests, plus integration tests on the prediction endpoint, because a model should never see an impossible blood pressure.',
      },
      {
        title: 'Translate SHAP into language',
        text: 'A dedicated explanation layer turns raw SHAP values into risk factors, protective factors and recommendations a non-specialist can read.',
      },
      {
        title: 'A model simple enough to explain',
        text: 'Logistic regression after iterative experimentation, chosen partly because its behaviour can be inspected and defended.',
      },
      {
        title: 'Admin surface kept separate',
        text: 'A distinct admin login route and admin-only endpoints keep analytics away from ordinary users.',
      },
    ],
    notes: ['Educational and research use only. Not a diagnostic tool.'],
  },
]

export const more = [
  {
    title: 'MarvelShowCase',
    year: '2025',
    text: 'An explorer for the Marvel Cinematic Universe by phase, media type and character, with a chronological timeline mode and animated route transitions.',
    shot: 'shot-marvel',
    stack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
    live: 'https://marvel-show-case.vercel.app',
    github: 'https://github.com/RithwikBandi/MarvelShowCase',
  },
  {
    title: 'Production CRM platform',
    year: '2026',
    text: 'A full-stack business operations platform, built and deployed end to end. Private work, so there is no link, but I am happy to talk it through.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    private: true,
  },
]

// Display order: what a visitor can open and use right now comes first.
const ORDER = ['jobspace', 'cardioml', 'sru-timetable', 'folio']
export const projects = ORDER.map((slug, i) => ({ ...entries.find((p) => p.slug === slug), index: String(i + 1).padStart(2, '0') }))

export const getProject = (slug) => projects.find((p) => p.slug === slug)
