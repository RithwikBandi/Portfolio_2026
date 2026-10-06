// Voice: first person, plain, specific. Every claim comes from the project's own README,
// its commit history or the live product. No usage numbers, traffic or impact figures.

const entries = [
  {
    slug: 'jobspace',
    title: 'JobSpace',
    tagline: 'A spreadsheet for your job hunt, with a real backend.',
    summary:
      'Job hunting ends up as a messy sheet and ten open tabs. I kept the spreadsheet feel and added what a sheet can’t do: a login, a place for your resumes, notes on each company and charts of your own pipeline.',
    description:
      'Case study: JobSpace, a MERN job-search workspace with a spreadsheet-style tracker with custom columns, a document vault, company notes, charts and session-based login.',
    year: '2026',
    part: 'I designed and built all of it, front end to deploy',
    status: 'Live',
    stack: ['React', 'Express', 'MongoDB', 'Chart.js'],
    fullStack: ['React 18', 'Vite', 'React Router', 'Chart.js', 'Node.js', 'Express 5', 'MongoDB', 'Mongoose', 'connect-mongo', 'bcrypt', 'Multer'],
    links: { live: 'https://job-space-deployment.vercel.app', github: 'https://github.com/RithwikBandi/JobSpace' },
    plate: { kind: 'shot', image: 'shot-jobspace', alt: 'The JobSpace landing page with the spreadsheet-style applications table', host: 'job-space-deployment.vercel.app' },
    problem: [
      'Most people track applications in a Google Sheet, and by the fiftieth row it is a mess. Resumes live in one folder, company notes in another, and nobody can tell which stage is holding them up.',
      'JobSpace keeps the sheet and puts the rest around it: login, a document vault, company notes and charts, all in one workspace.',
    ],
    features: [
      { title: 'Your own columns', text: 'Every application has the usual fields plus any column you add. No schema change, no migration.' },
      { title: 'Document vault', text: 'Attach resumes and cover letters. Uploads are capped at 10 MB and limited to PDFs, documents and images.' },
      { title: 'Company notes', text: 'The same flexible columns for the companies you are watching, not just the jobs you applied to.' },
      { title: 'Charts of your pipeline', text: 'Built with Chart.js from your own application data.' },
      { title: 'Login with real sessions', text: 'Normal users and admins use separate routes with their own guards.' },
    ],
    architecture: {
      intro:
        'The React app calls an Express API with credentials. The API reads a session cookie, checks it against sessions stored in MongoDB, runs the route guard and then talks to MongoDB through Mongoose.',
      nodes: [
        { title: 'React app', sub: 'React Router · Axios · Chart.js' },
        { title: 'Express API', sub: 'Sessions · route guards · uploads' },
        { title: 'MongoDB', sub: 'users · applications · companies · documents · sessions' },
      ],
    },
    decisions: [
      {
        title: 'Cookie sessions, not JWTs',
        text: 'Sessions live in MongoDB, so logging out genuinely ends the session on the server. With a JWT I would have been waiting for it to expire.',
      },
      {
        title: 'A schema that bends where users need it to',
        text: 'Common fields are real fields. Anything a user adds goes into an open extension map, so new columns cost nothing.',
      },
      {
        title: 'Uploads are checked before they reach any code',
        text: 'File type and size are enforced in middleware, and passwords are hashed with bcrypt.',
      },
      {
        title: 'Two services, deployed separately',
        text: 'The front end and the API ship independently, so I can change one without touching the other.',
      },
    ],
    notes: ['The API runs on a free hosting tier, so the first visit after a quiet spell can take a few seconds to wake up.'],
  },

  {
    slug: 'cardioml',
    title: 'CardioML',
    tagline: 'A heart-risk model that has to explain itself.',
    summary:
      'Enter eight health numbers and get a Low, Moderate or High cardiovascular risk, plus the reasons behind it. I trained the model on 5,500 records and used SHAP so no score arrives without its explanation. A university project, not medical advice.',
    description:
      'Case study: CardioML, an academic cardiovascular risk app with a scikit-learn model trained on 5,500 records, SHAP explanations, a FastAPI backend, a React interface and MongoDB. Not medical advice.',
    year: '2026',
    part: 'I built the model, the API and the interface',
    status: 'Source on GitHub',
    stack: ['React', 'FastAPI', 'scikit-learn', 'MongoDB'],
    fullStack: ['React 19', 'Vite', 'Tailwind CSS', 'FastAPI', 'Motor (MongoDB)', 'scikit-learn', 'SHAP', 'Pydantic', 'JWT', 'pytest'],
    links: { live: null, github: 'https://github.com/RithwikBandi/Heart-Risk-AI' },
    plate: { kind: 'shot', image: 'shot-cardioml', alt: 'The CardioML landing page: predict cardiovascular risk with explainable AI', host: 'local build · source on GitHub' },
    problem: [
      'A risk score on its own is useless. If a model says High, the next question is always why. So I picked a model I could explain and added SHAP, so every prediction lists what pushed it up and what held it down.',
      'This is an academic project. It is not a diagnostic tool and it is not medical advice.',
    ],
    features: [
      { title: 'Eight inputs, checked twice', text: 'The form validates in the browser and the server validates again against medical limits.' },
      { title: 'The reasons, in plain words', text: 'SHAP values become risk factors, protective factors and recommendations a non-specialist can read.' },
      { title: 'History', text: 'Every assessment is saved per user and shown in a sortable table.' },
      { title: 'Admin view', text: 'Risk distribution and predictions over time, behind a separate admin login.' },
    ],
    architecture: {
      intro:
        'The React app posts the form to FastAPI. The backend validates the numbers, scales them, runs the model, computes SHAP values and turns them into readable text before anything is saved to MongoDB.',
      nodes: [
        { title: 'React app', sub: 'Assess · History · Admin' },
        { title: 'FastAPI', sub: 'Validate → scale → model → SHAP → explain' },
        { title: 'MongoDB', sub: 'users · predictions · model logs' },
      ],
      note: 'The model is a logistic regression trained on 5,500 clinical records, saved together with its scaler.',
    },
    decisions: [
      {
        title: 'A model I can defend',
        text: 'I tried several approaches and kept logistic regression. I can explain it end to end, and for health data that matters more than a point of accuracy.',
      },
      {
        title: 'Validation lives outside the model',
        text: 'A separate, tested module rejects impossible values, so the model never sees a blood pressure that cannot exist.',
      },
      {
        title: 'Explanations are a feature, not a chart',
        text: 'A dedicated layer converts SHAP output into sentences. That layer is where most of the product value is.',
      },
      {
        title: 'Admin is its own surface',
        text: 'A separate login route and admin-only endpoints keep analytics away from ordinary users.',
      },
    ],
    notes: ['Educational project. Not a diagnostic tool.'],
  },

  {
    slug: 'sru-timetable',
    title: 'SRU Timetable',
    tagline: 'My university’s timetable, finally readable.',
    summary:
      'SR University publishes every timetable as one dense grid. I built the version I wanted: pick your batch, see your week, find your free hours, compare with a friend. It began as an Excel parser in late 2025 and I rebuilt it as a full app in about a week.',
    description:
      'Case study: SRU Timetable, a React, TypeScript and FastAPI app that turns the university timetable into a readable weekly grid with free-time view, batch comparison, an attendance calculator and exports.',
    year: '2025 – 2026',
    part: 'I designed and built all of it, front end to deploy',
    status: 'Live',
    stack: ['React', 'TypeScript', 'FastAPI', 'Tailwind'],
    fullStack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'FastAPI', 'Pydantic v2', 'httpx', 'openpyxl', 'Vitest', 'pytest'],
    links: { live: 'https://sru-time-table.vercel.app', github: null },
    plate: { kind: 'shot', image: 'shot-sru', alt: 'The SRU Timetable landing page: choose degree, year and batch to load your timetable', host: 'sru-time-table.vercel.app' },
    demo: 'timetable',
    problem: [
      'The official timetable is built for the registrar: every batch, elective and room in one table. Finding out when my next class is, or when I am actually free today, meant squinting at a spreadsheet.',
      'The first version was a tool that read the Excel export and drew a cleaner week. It worked, but you still had to find the right file every time. The rebuild removes that step. You choose your degree, year and batch and the timetable loads. Excel upload stays as a fallback.',
    ],
    features: [
      { title: 'My week as a real grid', text: 'Each class gets room to breathe instead of being squeezed into a spreadsheet cell.' },
      { title: 'Free Time', text: 'The same grid flipped to show your gaps: how many free slots, the longest break, day by day.' },
      { title: 'Compare batches', text: 'Pick two batches and see the hours when both are free.' },
      { title: 'Attendance calculator', text: 'A quick check for one course (how many classes can I skip?) or a tracker for the whole term.' },
      { title: 'Exports that are complete', text: 'PNG, PDF or HTML, always the full schedule and never a cropped screenshot.' },
    ],
    architecture: {
      intro:
        'The browser only ever talks to my backend. The backend fetches the public timetable data, reshapes it, caches it briefly and throws it away. Nothing is stored and nothing is scraped in bulk.',
      nodes: [
        { title: 'Browser', sub: 'React 19 · TypeScript' },
        { title: 'My backend', sub: 'FastAPI · reshape · short cache' },
        { title: 'University timetable page', sub: 'Public source of truth' },
      ],
      note: 'An uploaded Excel file goes through the same pipeline, so the front end never knows which source it came from.',
      code: {
        caption: 'The one shape both sources are reduced to',
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
        title: 'Two sources, one shape',
        text: 'Live data and Excel files look nothing alike. I reduce both to a single structure, so the grid, the free-time view, comparison and export are written once.',
      },
      {
        title: 'The iOS export bug that taught me something',
        text: 'PNG export came out blank on iPhones. A blob URL does not carry over to the tab Safari opens it in. I rewrote the export path instead of patching around it.',
      },
      {
        title: 'A health check that lied',
        text: 'The app kept saying the service was down. My own health endpoint was rejecting HEAD requests. A small bug, but a false “down” banner costs trust.',
      },
      {
        title: 'Free hosting sleeps',
        text: 'The backend runs on a free tier that goes to sleep, so I added a warm-up ping. The first request no longer feels broken.',
      },
      {
        title: 'Tests that do not need the internet',
        text: 'Vitest covers the free-time maths and the interface. pytest mocks the university requests, so every test runs offline.',
      },
    ],
    notes: [
      'An independent student project, not affiliated with SR University. For exams, room changes and deadlines, check the official page.',
      'It depends on the university’s public timetable service. When that is down the app says so and offers the Excel upload instead.',
    ],
  },

  {
    slug: 'folio',
    title: 'Folio',
    tagline: 'Convert documents without uploading them.',
    summary:
      'Markdown to Word and PDF, PDF merge and split, images to PDF. All of it runs inside your browser tab, so a contract or a spec never leaves your laptop.',
    description:
      'Case study: Folio, a browser-only document tool built with React and TypeScript that converts Markdown to Word and PDF, merges and splits PDFs and turns images into PDFs without uploading anything.',
    year: '2026',
    part: 'I designed and built all of it',
    status: 'Live',
    stack: ['React', 'TypeScript', 'docx', 'pdf-lib'],
    fullStack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'docx', 'pdf-lib', 'jsPDF'],
    links: { live: 'https://folio-converter.vercel.app', github: 'https://github.com/RithwikBandi/Folio-Converter' },
    plate: { kind: 'shot', image: 'shot-folio', alt: 'The Folio converter: drop a Markdown file to get a Word or PDF document', host: 'folio-converter.vercel.app' },
    problem: [
      'Most online converters upload your file to a server you cannot see. For a contract, a spec or personal notes, that is a reason to hesitate.',
      'Folio does the work in the browser tab. The file is read into memory, converted there and handed back as a download. There is nothing to upload.',
    ],
    features: [
      { title: 'Markdown to Word', text: 'A real .docx with heading styles, shaded tables and code blocks.' },
      { title: 'Markdown to PDF', text: 'A paginated A4 or Letter layout with margins, page breaks and print typography.' },
      { title: 'Merge and split PDFs', text: 'Reorder and combine files, or pull out page ranges like 1-3, 5.' },
      { title: 'Images to PDF', text: 'Drop PNG, JPG or WebP files, reorder them and export one PDF.' },
      { title: 'Keyboard first', text: 'A Cmd/Ctrl+K command palette and shortcuts, so it feels like a desktop utility.' },
    ],
    architecture: {
      intro:
        'Everything happens in the browser. Markdown is parsed into a syntax tree, compiled into a Word file or laid out into PDF pages, and returned as a download. There is no network request in between.',
      nodes: [
        { title: 'Your file', sub: 'Read into browser memory' },
        { title: 'Conversion', sub: 'marked · docx · jsPDF · pdf-lib' },
        { title: 'Download', sub: 'Saved locally' },
      ],
      note: 'Open the network tab during a conversion and watch nothing leave the page.',
    },
    decisions: [
      {
        title: 'Privacy by design, not by promise',
        text: 'With no server in the loop there is nothing to leak. A policy can change; an architecture with no upload cannot.',
      },
      {
        title: 'Real Word files, not HTML in disguise',
        text: 'Markdown is compiled to OpenXML through a syntax tree, so the result opens as a proper document with real styles.',
      },
      {
        title: 'Several libraries, one flow',
        text: 'Word, PDF layout and PDF editing use different tools, but every format follows the same drop, convert, download path.',
      },
    ],
    notes: [],
  },
]

export const more = [
  {
    title: 'MarvelShowCase',
    year: '2025',
    text: 'A Marvel Cinematic Universe explorer I built in July 2025 while learning React and animation. Browse by phase, movies, shows and characters, or follow the timeline. The mobile layout took more commits than anything else.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
    shot: 'shot-marvel',
    live: 'https://marvel-show-case.vercel.app',
    github: 'https://github.com/RithwikBandi/MarvelShowCase',
  },
  {
    title: 'Production CRM platform',
    year: '2026',
    text: 'A CRM I built and deployed end to end for a business. It is private, so there is no link. Ask me and I will walk you through how it works.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    private: true,
  },
]

// Display order: what a visitor can open and use right now comes first.
const ORDER = ['jobspace', 'cardioml', 'sru-timetable', 'folio']
export const projects = ORDER.map((slug, i) => ({ ...entries.find((p) => p.slug === slug), index: String(i + 1).padStart(2, '0') }))

// Look up a case study by its URL slug
export const getProject = (slug) => projects.find((p) => p.slug === slug)
