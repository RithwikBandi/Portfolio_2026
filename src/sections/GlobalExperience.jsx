import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../components/useInView'

// ─── Program data ─────────────────────────────────────────────────────────────
const PROGRAM = {
  linkedin1: 'https://www.linkedin.com/posts/rithwik-bandi_sruniversity-sru-winterstudytour-activity-7408523550598291456-Ew0V?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEd8Gd8BWXdWLywwR3l6t2l1eN9SxAMQ7mY',
  linkedin2: 'https://www.linkedin.com/posts/rithwik-bandi_sruniversity-globalvibes-learningbeyondborders-activity-7414327083507720192-NKCM?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEd8Gd8BWXdWLywwR3l6t2l1eN9SxAMQ7mY',
  narrative: [
    'Selected as one of eight students from SR University, I represented the institution at FPT University, Vietnam, through the Winter Immersion Program, An international academic initiative designed to integrate classroom learning with global exposure.',
    'The program included structured academic sessions on cybersecurity fundamentals, sustainability practices, and critical thinking, along with institutional interactions that provided insight into real-world applications of technology and innovation.',
    'In addition to academic engagement, the experience involved cultural immersion through activities such as Vietnamese language sessions, visits to Botanica Garden for sustainable agriculture exposure, and traditional experiences in Hoi An, offering a holistic understanding of global learning environments.'
  ],
  highlights: [
    {
      icon: '🌐',
      title: 'International Representation',
      body: 'Selected as one of eight students to represent SR University at FPT University, Vietnam, as part of an international academic immersion program.',
      tags: ['Global Exposure', 'SR University', 'FPT University'],
    },
    {
      icon: '💡',
      title: 'Academic & Innovation Exposure',
      body: 'Participated in structured sessions focused on sustainability, innovation, and real-world applications through interactive institutional learning environments.',
      tags: ['CORMIS', 'Innovation', 'Applied Learning'],
    },
    {
      icon: '♻️',
      title: 'Sustainability Learning',
      body: 'Explored sustainable development practices through field-based learning at Botanica Garden, understanding organic agriculture and environmental systems.',
      tags: ['Sustainability', 'Agri-Tech', 'Systems Thinking'],
    },
    {
      icon: '🏮',
      title: 'Cultural & Global Immersion',
      body: 'Engaged in cross-cultural experiences including Vietnamese language sessions, Hoi An workshops, and traditional activities fostering global perspective.',
      tags: ['Hoi An', 'Cultural Exchange', 'Global Mindset'],
    },
  ],
  photos: [
    { src: '/assets/vietnam/photo-01.jpg', caption: 'Pre-departure group photo', location: 'SR University, Warangal' },
    { src: '/assets/vietnam/photo-02.jpg', caption: 'Welcome ceremony', location: 'FPT University, Vietnam' },
    { src: '/assets/vietnam/photo-03.jpg', caption: 'Botanica Garden — Sustainable Agriculture', location: 'Da Nang, Vietnam' },
    { src: '/assets/vietnam/photo-04.jpg', caption: 'Coconut basket boat ride', location: 'Coconut Forest, Hoi An' },
    { src: '/assets/vietnam/photo-05.jpg', caption: 'Traditional lantern-making', location: 'Hoi An Ancient Town' },
    { src: '/assets/vietnam/photo-06.jpg', caption: 'CORMIS session — Sustainability and Innovation Exposure', location: 'Da Nang, Vietnam' },
    { src: '/assets/vietnam/photo-07.jpg', caption: 'Industry and academic interaction', location: 'FPT University' },
    { src: '/assets/vietnam/photo-08.jpg', caption: 'Winter Immersion cohort closing ceremony', location: 'FPT University' },
  ],
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
)
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
)
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)
const LikeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
)
const CommentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const RepostIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
)

// ─── Cinematic Slideshow ──────────────────────────────────────────────────────
function CinematicSlideshow({ photos }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)   // 1 = forward, -1 = back
  const [isPaused, setIsPaused] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [ref, inView] = useInView()
  const touchStart = useRef(null)
  const intervalRef = useRef(null)

  const go = useCallback((idx, dir) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const prev = useCallback(() => {
    go((current - 1 + photos.length) % photos.length, -1)
  }, [current, photos.length, go])

  const next = useCallback(() => {
    go((current + 1) % photos.length, 1)
  }, [current, photos.length, go])

  // Auto-advance every 5s — pauses on hover or lightbox open
  useEffect(() => {
    if (isPaused || lightbox || !inView) return
    intervalRef.current = setInterval(next, 5000)
    return () => clearInterval(intervalRef.current)
  }, [next, isPaused, lightbox, inView])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (lightbox) {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
        if (e.key === 'Escape') setLightbox(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 44) { dx < 0 ? next() : prev() }
    touchStart.current = null
  }

  const slideVariants = {
    enter: (d) => ({ opacity: 0, scale: 1.04, x: d > 0 ? 32 : -32 }),
    center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: (d) => ({ opacity: 0, scale: 0.97, x: d > 0 ? -24 : 24, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }),
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ── Main stage ── */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            aspectRatio: '16/9',
            background: 'var(--bg-secondary)',
            boxShadow: '0 16px 64px rgba(0,0,0,0.2)',
            cursor: 'pointer',
          }}
          onClick={() => setLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Sliding image */}
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <img
                src={photos[current].src}
                alt={photos[current].caption}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center', willChange: 'transform' }}
              />
              {/* Stronger vignette for readability */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.95) 100%)' }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Caption + location */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${current}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 pointer-events-none z-20"
            >
              <p className="font-display font-semibold text-sm leading-snug mb-0.5" style={{ color: '#ffffff' }}>
                {photos[current].caption}
              </p>
              <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <GlobeIcon />
                <p className="font-mono text-[10px] tracking-wide">
                  {photos[current].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Photo counter — top right */}
          <div
            className="absolute top-4 right-4 font-mono text-[11px] px-2.5 py-1 rounded-full z-20"
            style={{
              background: 'rgba(8,10,15,0.85)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {String(current + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </div>

          {/* Expand hint — top left */}
          <div
            className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded z-20"
            style={{
              background: 'rgba(8,10,15,0.85)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Program Gallery
          </div>
        </div>

        {/* ── Navigation row ── */}
        <div className="flex items-center justify-between mt-4 px-1">
          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Dot strip — center */}
          <div className="flex items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                aria-label={`Go to photo ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  height: '5px',
                  width: i === current ? '22px' : '5px',
                  background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.18)',
                }}
              />
            ))}
          </div>

          {/* Auto-play state hint */}
          <div
            className="font-mono text-[10px] tracking-widest flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isPaused ? 'var(--text-muted)' : 'var(--accent)',
                transition: 'background 0.3s',
              }}
            />
            {isPaused ? 'Paused' : 'Auto'}
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Photo ${i + 1}`}
              className="shrink-0 rounded-lg overflow-hidden transition-all duration-200"
              style={{
                width: '64px',
                height: '42px',
                border: i === current ? '2px solid var(--accent)' : '2px solid transparent',
                opacity: i === current ? 1 : 0.45,
                background: 'var(--bg-secondary)',
              }}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightbox(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                  key={`lb-${current}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="rounded-2xl overflow-hidden"
                  style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}
                >
                  <img
                    src={photos[current].src}
                    alt={photos[current].caption}
                    className="w-full object-cover block"
                    style={{ maxHeight: '80vh' }}
                  />
                  {/* Caption bar */}
                  <div
                    className="px-6 py-4"
                    style={{
                      background: 'rgba(8,10,15,0.95)',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <p className="font-display font-semibold text-sm" style={{ color: '#ffffff' }}>
                      {photos[current].caption}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <GlobeIcon />
                      <p className="font-mono text-[10px]">
                        {photos[current].location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <button
                onClick={() => setLightbox(false)}
                aria-label="Close"
                className="absolute -top-12 right-0 w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#f8fafc' }}
              >
                <CloseIcon />
              </button>
              {current > 0 && (
                <button onClick={prev} aria-label="Previous" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#f8fafc' }}>
                  <ChevronLeft />
                </button>
              )}
              {current < photos.length - 1 && (
                <button onClick={next} aria-label="Next" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#f8fafc' }}>
                  <ChevronRight />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Realistic LinkedIn post card ─────────────────────────────────────────────
const LI_POSTS = [
  {
    href: 'https://www.linkedin.com/posts/rithwik-bandi_sruniversity-sru-winterstudytour-activity-7408523550598291456-Ew0V?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEd8Gd8BWXdWLywwR3l6t2l1eN9SxAMQ7mY',
    timeAgo: '3mo',
    authorName: 'Rithwik Bandi',
    authorAvatar: '/assets/profile/profile_pic.png',
    authorRole: 'Passionate Web developer with skills in Python, JavaScript, HTML, CSS, ...',
    lines: [
      'This opportunity goes beyond international exposure it’s a chance to engage in cross-cultural learning, gain global academic perspectives, and grow both personally and professionally.',
      'Looking forward to making the most of this experience and bringing back meaningful learnings',
    ],
    hashtags: ['#SRUniversity', '#WinterStudyTour', '#FPTUniversity', '#StudyAbroad', '#GlobalLearning', '#InternationalExposure', '#AcademicGrowth'],
    stats: { impressions: '363', likes: '14', reposts: '1' },
    type: 'Winter Tour',
    typeColor: '#6ee7b7',
    repost: {
      authorName: 'SR University',
      followers: '25,494 followers',
      timeAgo: '3mo',
      lines: [
        'We are pleased to announce that our students Lakka Rishi Chandra, Bandi Rithwik, Nagapuri Sai Sindhu, Mohammed Shariful Hassan, Pettugadi Sree Varshini, Depa Sreshta, Nagavelli Srikar, and Bathini Vaishnavi will be traveling to FPT University, Vietnam, as part of the Winter Study Tour Program – 2025.',
        'The program provides an excellent international learning opportunity, allowing students to gain global exposure, engage in cross-cultural academic exchange, and represent SR University on an international platform.',
        'We wish them a meaningful and enriching journey filled with learning, collaboration, and new perspectives that support their academic and professional growth.'
      ],
      hashtags: ['#SRUniversity', '#SRU', '#WinterStudyTour', '#FPTUniversity', '#GlobalLearning', '#InternationalExposure', '#AcademicExchange', '#GlobalEducation', '#StudyAbroad', '#InternationalPrograms'],
      image: '/assets/vietnam/photo-01.jpg',
    }
  },
  {
    href: 'https://www.linkedin.com/posts/rithwik-bandi_sruniversity-globalvibes-learningbeyondborders-activity-7414327083507720192-NKCM?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEd8Gd8BWXdWLywwR3l6t2l1eN9SxAMQ7mY',
    timeAgo: '2mo',
    authorName: 'Rithwik Bandi',
    authorAvatar: '/assets/profile/profile_pic.png',
    authorRole: 'Passionate Web developer with skills in Python, JavaScript, HTML, CSS, ...',
    lines: [
      'This experience went far beyond academics from hands-on learning and industry exposure to understanding sustainability, culture, and global collaboration. Interacting with international peers, exploring Vietnamese traditions, and gaining insights into cybersecurity and innovation truly broadened my perspective.',
      'Moments like these highlight the impact of experiential learning in shaping both skills and mindset. Thankful to FPT University for providing such meaningful global exposure.',
      'Looking forward to applying these learnings in my academic and professional journey 🌍✨',
    ],
    hashtags: ['#Grateful', '#GlobalLearning', '#InternationalExposure', '#FPTUniversity', '#StudentExperience', '#LearningBeyondClassrooms', '#WinterImmersion'],
    stats: { impressions: '471', likes: '15', reposts: '0' },
    type: 'Completion',
    typeColor: '#818cf8',
    repost: {
      authorName: 'SR University',
      followers: '25,507 followers',
      timeAgo: '2mo',
      lines: [
        'Our students recently returned from a highly enriching Winter Immersion Program at FPT University, Vietnam, where learning extended beyond classrooms into hands-on experiences and cultural exploration.',
        'The participating students—Rishi Chandra Lakka, Sathwik Reddy Nakireddy, Srikar Nagavelli, Rithwik Bandi, Vaishnavi Bathini, Depa Sreshta, Mohammed Shariful Hassan, Nagapuri Sai Sindhu, and Sree Varshini Pettugadi—engaged in a thoughtfully designed program that blended academic exposure, industry interaction, and cultural immersion.',
        'The journey included exploring the historic streets of Hoi An, experiencing traditional lantern-making, and visiting the Botanica Garden – Workshop Hub to understand organic farming, herbal cultivation, and sustainable agrarian practices rooted in Vietnamese culture. Students also participated in interactive Vietnamese language sessions, explored sustainability initiatives at CORMIS, and experienced Vietnam’s iconic coconut basket boat ride.',
        'Adding strong academic depth, our students gained valuable cybersecurity exposure through interactions with FPT EagleEye and the FPT Cyber Security Center.',
        'More than an international program, this immersion fostered global perspectives, cross-cultural collaboration, practical learning, and lifelong memories—reflecting our commitment to globally relevant education.',
        'Swipe through to relive the moments and experience the global learning journey.'
      ],
      hashtags: ['#SRUniversity', '#GlobalVibes', '#LearningBeyondBorders', '#InternationalExposure', '#StudyAbroadLife', '#CampusToWorld', '#GlobalMinds', '#FutureLeaders'],
      image: '/assets/vietnam/photo-08.jpg',
    }
  },
]

const LinkedInPost = memo(({ post, index }) => {
  const [ref, inView] = useInView()
  const [expanded, setExpanded] = useState(false)
  const isLong = post.lines.length > 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="max-w-[600px] w-full mx-auto"
    >
      <a
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl flex flex-col transition-colors duration-200 shadow-sm cursor-none"
        style={{
          textDecoration: 'none',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(110,231,183,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* ── Optional Repost Label ── */}
        {post.repost && (
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-0" style={{ color: 'var(--text-muted)' }}>
            <span className="shrink-0"><RepostIcon /></span>
            <span className="font-body text-[12px] font-medium">
              You reposted
            </span>
          </div>
        )}

        {/* ── Post header ── */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-0">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.authorName} loading="lazy" className="w-12 h-12 rounded-full object-cover shrink-0 border" style={{ borderColor: 'var(--border)' }} />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(110,231,183,0.15) 0%, rgba(110,231,183,0.05) 100%)',
                  border: '1px solid rgba(110,231,183,0.25)',
                  color: 'var(--accent)',
                }}
              >
                RB
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-display font-semibold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>
                  {post.authorName}
                </p>
                {/* Verified checkmark */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#0a66c2', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" fill="#0a66c2" />
                  <polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-mono text-[11px] ml-0.5" style={{ color: 'var(--text-muted)' }}>• You</span>
              </div>
              <p className="font-body text-[11px] mt-1 line-clamp-1 pr-2" style={{ color: 'var(--text-muted)' }}>
                {post.authorRole}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{post.timeAgo}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>·</span>
                {/* Globe icon */}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Post body text ── */}
        <div className="px-4 pt-3 pb-1">
          <div className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {(expanded || !isLong ? post.lines : post.lines.slice(0, 2)).map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>
            ))}
            {isLong && !expanded && (
              <button
                onClick={e => { e.preventDefault(); setExpanded(true) }}
                className="font-body text-[13px] font-medium cursor-none transition-colors"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: 0, marginTop: '2px' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                …see more
              </button>
            )}
          </div>
          {/* Hashtags */}
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-3 mb-2">
            {post.hashtags.map(h => (
              <span key={h} className="font-body text-xs font-semibold" style={{ color: '#0a66c2' }}>{h}</span>
            ))}
          </div>
        </div>

        {/* ── Repost Card / Main Image ── */}
        {post.repost ? (
          <div className="mx-4 mt-3 mb-2 rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {/* Repost Header */}
            <div className="flex items-start gap-3 px-3 pt-3 pb-0">
              <div
                className="w-10 h-10 rounded shadow-sm flex items-center justify-center shrink-0 font-display font-bold text-sm tracking-tighter"
                style={{ background: '#fff', color: '#1d4ed8', border: '1px solid var(--border)' }}
              >
                sru
              </div>
              <div>
                <p className="font-display font-semibold text-[13px] leading-none" style={{ color: 'var(--text-primary)' }}>
                  {post.repost.authorName}
                </p>
                <p className="font-body text-[11px] mt-1 line-clamp-1 pr-2" style={{ color: 'var(--text-muted)' }}>
                  {post.repost.followers}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{post.repost.timeAgo}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>·</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Repost Content */}
            <div className="px-3 pt-2 pb-1">
              <div className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {(expanded || post.repost.lines.length <= 2 ? post.repost.lines : post.repost.lines.slice(0, 2)).map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>
                ))}
                {post.repost.lines.length > 2 && !expanded && (
                  <button
                    onClick={e => { e.preventDefault(); setExpanded(true) }}
                    className="font-body text-[13px] font-medium cursor-none transition-colors"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: 0, marginTop: '2px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    …see more
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-3 mb-2">
                {post.repost.hashtags.map(h => (
                  <span key={h} className="font-body text-xs font-semibold" style={{ color: '#0a66c2' }}>{h}</span>
                ))}
              </div>
            </div>
            {/* Repost Image */}
            {post.repost.image && (
              <div className="w-full relative overflow-hidden mt-1" style={{ aspectRatio: '1.91/1' }}>
                <img src={post.repost.image} alt="Repost visual" loading="lazy" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ) : post.image ? (
          <div className="w-full relative overflow-hidden mt-1" style={{ aspectRatio: '1.91/1' }}>
            <img src={post.image} alt="Post visual" loading="lazy" className="w-full h-full object-cover" />
          </div>
        ) : null}

        {/* ── Engagement Stats summary ── */}
        <div className="px-4 mt-3 mb-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: '#0a66c2' }}>
              <circle cx="12" cy="12" r="10" fill="#0a66c2" />
              <path d="M8 12.5l3 3 6-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-body" style={{ color: 'var(--text-muted)' }}>{post.stats.likes || 15} likes</span>
          </div>
          <span className="text-[11px] font-body" style={{ color: 'var(--text-muted)' }}>{post.stats.reposts} repost{post.stats.reposts !== '1' ? 's' : ''}</span>
        </div>

        {/* ── Engagement row actions ── */}
        <div
          className="flex items-center justify-between px-3 py-2 mx-4 mt-1 mb-3 rounded-lg pointer-events-none"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-6 pt-1 w-full justify-around">
            <div className="flex items-center gap-1.5 font-body text-xs font-semibold transition-colors cursor-none" style={{ color: 'var(--text-muted)' }}>
              <LikeIcon />
              <span>Like</span>
            </div>
            <div className="flex items-center gap-1.5 font-body text-xs font-semibold transition-colors cursor-none" style={{ color: 'var(--text-muted)' }}>
              <CommentIcon />
              <span>Comment</span>
            </div>
            <div className="flex items-center gap-1.5 font-body text-xs font-semibold transition-colors cursor-none" style={{ color: 'var(--text-muted)' }}>
              <RepostIcon />
              <span>Repost</span>
            </div>
            <div className="flex items-center gap-1.5 font-body text-xs font-semibold transition-colors cursor-none" style={{ color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Send</span>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  )
})

// ─── Highlight card (same glass card pattern as Skills) ───────────────────────
function HighlightCard({ item, index }) {
  const [ref, inView] = useInView()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="glass glass-hover rounded-2xl p-6 border border-white/6 group relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.6), transparent)' }}
      />
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{item.icon}</span>
        <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {item.title}
        </h3>
      </div>
      <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {item.body}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </motion.div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function GlobalExperience() {
  const [headRef, headInView] = useInView()

  return (
    <section id="global" className="relative py-32 overflow-hidden">

      {/* Ambient glow — matches About section pattern */}
      <div
        className="absolute left-0 top-1/3 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.035) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header — identical pattern to Experience/About ── */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="section-label mb-4">Global Experience</p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Vietnam Winter{' '}
            <span className="gradient-text">Immersion</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              <GlobeIcon />
              FPT University · Da Nang, Vietnam · December 2025
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-DEFAULT opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-DEFAULT" />
              </span>
              Completed
            </span>
          </div>
        </motion.div>

        {/* ── Main Layout Wrapper ── */}
        <div className="flex flex-col gap-16 max-w-5xl mx-auto mb-20">

          {/* 1. Description & Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {PROGRAM.narrative.map((para, i) => (
              <p key={i} className="font-body leading-relaxed text-base lg:text-lg" style={{ color: 'var(--text-secondary)' }}>
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-2.5 pt-4">
              {['FPT University', 'SR University', 'Da Nang, Vietnam', 'Dec 2025', 'Winter Immersion'].map(t => (
                <span key={t} className="tag border shadow-sm px-3.5 py-1.5 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>{t}</span>
              ))}
            </div>
          </motion.div>

          {/* 2. Stacked LinkedIn Cards */}
          <div className="flex flex-col gap-10">
            {LI_POSTS.map((post, i) => (
              <LinkedInPost key={i} post={post} index={i} />
            ))}
          </div>
        </div>

        {/* ── 4 highlight cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {PROGRAM.highlights.map((item, i) => (
            <HighlightCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* ── Cinematic slideshow ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <CinematicSlideshow photos={PROGRAM.photos} />
        </motion.div>

      </div>
    </section>
  )
}
